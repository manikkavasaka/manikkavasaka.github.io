import * as XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, 'secure_data', 'leads_master_db.xlsx');

if (fs.existsSync(FILE_PATH)) {
    const wb = XLSX.readFile(FILE_PATH);
    const ws = wb.Sheets['Leads'];
    const data = XLSX.utils.sheet_to_json(ws);
    console.log(`\n--- EXCEL SHEET CONTENT (${FILE_PATH}) ---`);
    console.log(`Total Rows: ${data.length}`);
    console.table(data);
} else {
    console.log("Excel file not found yet (will be created on first submission).");
}
