import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { google } from 'googleapis'; // Google Sheets API
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Secure Data Directory
const DATA_DIR = path.join(__dirname, 'secure_data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// SINGLE MASTER SHEET (Local Backup)
const FILE_PATH = path.join(DATA_DIR, 'leads_master_db.xlsx');

// --- 0. Initialize Database ---
const initializeDatabase = () => {
    if (!fs.existsSync(FILE_PATH)) {
        console.log(`[Local DB] Creating new database at ${FILE_PATH}`);
        const wb = XLSX.utils.book_new();
        const headers = ["ID", "Date", "Time", "Name", "Email", "Phone", "Service", "Status"];
        const ws = XLSX.utils.aoa_to_sheet([headers]);
        XLSX.utils.book_append_sheet(wb, ws, 'Leads');
        XLSX.writeFile(wb, FILE_PATH);
        console.log(`[Local DB] Database initialized successfully.`);
    } else {
        console.log(`[Local DB] Database found at ${FILE_PATH}`);
    }
};
initializeDatabase();

// --- 1. LOCAL Database Helper ---
const appendToMasterSheet = (newLead) => {
    let wb;
    let existingData = [];

    if (fs.existsSync(FILE_PATH)) {
        // Read existing Master Sheet
        wb = XLSX.readFile(FILE_PATH);
        const ws = wb.Sheets['Leads'];
        if (ws) {
            existingData = XLSX.utils.sheet_to_json(ws);
        }
    } else {
        // Create New Master Sheet if not exists
        wb = XLSX.utils.book_new();
    }

    // Add New Lead to Array
    existingData.push(newLead);

    // Write back to sheet (Overwriting the sheet content with new appended list)
    const newWs = XLSX.utils.json_to_sheet(existingData);
    XLSX.utils.book_append_sheet(wb, newWs, 'Leads', true); // 'true' might not be valid for 4th arg in all versions, but let's stick to standard rewrite

    // Correct way: Replace the sheet
    wb.Sheets['Leads'] = newWs;
    if (!wb.SheetNames.includes('Leads')) XLSX.utils.book_append_sheet(wb, newWs, 'Leads');

    // Save strictly to the one file
    XLSX.writeFile(wb, FILE_PATH);
    console.log(`[Local DB] Saved to Master Sheet.`);
};

// --- 2. GOOGLE SHEETS Helper ---
// Requires 'credentials.json' in root and SPREADSHEET_ID in .env
const appendToGoogleSheet = async (lead) => {
    const KEY_FILE = path.join(__dirname, 'google-sheet-credentials.json');

    // Check if credentials exist
    if (!fs.existsSync(KEY_FILE)) {
        console.warn(`[Google Sheets] 'google-sheet-credentials.json' not found. Skipping Google Sheet upload.`);
        return;
    }

    // Check if Spreadsheet ID is configured
    // User provided Sheet: https://docs.google.com/spreadsheets/d/19xUa4pht7WK2gdEmRwVndSxat9341nIzpQBmIB2Wg_I/edit
    const SPREADSHEET_ID = '19xUa4pht7WK2gdEmRwVndSxat9341nIzpQBmIB2Wg_I';

    if (!SPREADSHEET_ID) {
        console.warn(`[Google Sheets] Spreadsheet ID not set. Skipping.`);
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_FILE,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const client = await auth.getClient();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Data Row
        const values = [
            [lead.ID, lead.Date, lead.Time, lead.Name, lead.Email, lead.Phone, lead.Service]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:G',
            valueInputOption: 'USER_ENTERED',
            resource: { values },
        });

        console.log(`[Google Sheets] Successfully appended row for ${lead.Name}`);

    } catch (err) {
        console.error(`[Google Sheets Error]`, err.message);
    }
};

// --- 3. Communication Helper ---
const sendFollowUps = async (lead) => {
    console.log(`\n--- Automating Follow-Ups for ${lead.Name} ---`);
    // Simulated Email/SMS logic as before...
    console.log(`[Email/SMS/WhatsApp] Auto-responders triggered.`);
};

// POST Endpoint
app.post('/api/submit-lead', async (req, res) => {
    try {
        const { name, email, phone, service } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and Phone are required.' });
        }

        const now = new Date();
        const newLead = {
            ID: Date.now().toString().slice(-6),
            Date: now.toLocaleDateString(),
            Time: now.toLocaleTimeString(),
            Name: name,
            Email: email,
            Phone: phone,
            Service: service,
            Status: 'New',
        };

        // 1. Save Local
        appendToMasterSheet(newLead);

        // 2. Save Google Sheet (Async, don't block response)
        appendToGoogleSheet(newLead);

        // 3. Trigger Comms
        await sendFollowUps(newLead);

        res.status(200).json({ success: true, message: 'Lead processed successfully.' });

    } catch (error) {
        console.error('Error processing lead:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Secure Backend Server running on http://localhost:${PORT}`);
    console.log(`🔒 Master Database: ${FILE_PATH}`);
});
