/**
 * MK Shopzone API Server
 * Handles lead capture, email notifications, and analytics
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// In-memory database (replace with MongoDB for production)
let leads = [];
let events = [];

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Lead capture API
app.post('/api/leads', async (req, res) => {
    try {
        const lead = req.body;

        // Validate required fields
        if (!lead.email || !lead.name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Add to database
        lead.createdAt = new Date();
        lead.status = 'new';
        leads.push(lead);

        console.log(`✓ Lead captured: ${lead.name} (${lead.email})`);

        // Send confirmation email to visitor
        await sendConfirmationEmail(lead);

        // Send notification to team
        await sendLeadNotification(lead);

        // Trigger webhook if configured
        if (process.env.WEBHOOK_URL) {
            await triggerWebhook(lead);
        }

        res.json({
            success: true,
            message: 'Lead received successfully',
            leadId: lead.id
        });

    } catch (error) {
        console.error('Lead capture error:', error);
        res.status(500).json({ error: 'Failed to capture lead' });
    }
});

// Track user behavior
app.post('/api/track', async (req, res) => {
    try {
        const { sessionId, sessionData, events: eventList } = req.body;

        events.push({
            sessionId,
            sessionData,
            events: eventList,
            receivedAt: new Date()
        });

        console.log(`✓ Tracked ${eventList.length} events from session ${sessionId}`);

        res.json({ success: true });
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ error: 'Failed to track events' });
    }
});

// Get leads dashboard data
app.get('/api/leads', (req, res) => {
    try {
        const quality = req.query.quality;

        let filteredLeads = leads;
        if (quality) {
            filteredLeads = leads.filter(l => l.quality === quality);
        }

        res.json({
            total: leads.length,
            hot: leads.filter(l => l.quality === 'hot').length,
            warm: leads.filter(l => l.quality === 'warm').length,
            cool: leads.filter(l => l.quality === 'cool').length,
            cold: leads.filter(l => l.quality === 'cold').length,
            leads: filteredLeads,
            averageScore: Math.round(leads.reduce((a, l) => a + l.score, 0) / leads.length || 0)
        });
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

// Get analytics
app.get('/api/analytics', (req, res) => {
    try {
        const totalEvents = events.reduce((sum, e) => sum + e.events.length, 0);
        const avgEngagementScore = Math.round(
            leads.reduce((sum, l) => sum + (l.sessionData?.scrollDepth || 0), 0) / leads.length || 0
        );

        res.json({
            totalSessions: new Set(events.map(e => e.sessionId)).size,
            totalEvents,
            totalLeads: leads.length,
            conversionRate: leads.length > 0 ? Math.round((leads.length / (new Set(events.map(e => e.sessionId)).size || 1)) * 100) : 0,
            avgEngagementScore,
            topServices: getTopServices(),
            leadsByQuality: getLandsByQuality(),
            dailyStats: getDailyStats()
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Helper functions
async function sendConfirmationEmail(lead) {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: lead.email,
            subject: 'Your Audit Request Received 🚀',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Hi ${lead.name.split(' ')[0]},</h2>
                    <p>We have received your request. Our expert will contact you within 60 minutes.</p>
                    <p>In the meantime, feel free to reach out to us directly via WhatsApp for an even faster response.</p>
                    <br>
                    <p>Best regards,<br><strong>MK Shopzone Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Confirmation email sent to ${lead.email}`);
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
    }
}

async function sendLeadNotification(lead) {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER,
            subject: `🔥 NEW LEAD: ${lead.name} - ${lead.quality.toUpperCase()} (Score: ${lead.score})`,
            html: `
                <h2>New Lead Captured</h2>
                <p><strong>Quality:</strong> ${lead.quality} 🎯</p>
                <p><strong>Score:</strong> ${lead.score}/100</p>
                <p><strong>Name:</strong> ${lead.name}</p>
                <p><strong>Email:</strong> ${lead.email}</p>
                <p><strong>Phone:</strong> ${lead.phone}</p>
                <p><strong>Service Interest:</strong> ${lead.service}</p>
                <p><strong>Message:</strong> ${lead.message}</p>
                <p><strong>Engagement Time:</strong> ${lead.sessionData?.duration || 0}s</p>
                <p><strong>Scroll Depth:</strong> ${lead.sessionData?.scrollDepth || 0}%</p>
                <hr>
                <p><a href="https://your-dashboard.com/leads/${lead.id}">View Lead Details →</a></p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ Lead notification sent to team`);
    } catch (error) {
        console.error('Failed to send lead notification:', error);
    }
}

async function triggerWebhook(lead) {
    try {
        await fetch(process.env.WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead)
        });
        console.log('✓ Webhook triggered');
    } catch (error) {
        console.error('Webhook error:', error);
    }
}

function getTopServices() {
    const services = {};
    leads.forEach(lead => {
        if (lead.service) {
            services[lead.service] = (services[lead.service] || 0) + 1;
        }
    });
    return Object.entries(services).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function getLandsByQuality() {
    return {
        hot: leads.filter(l => l.quality === 'hot').length,
        warm: leads.filter(l => l.quality === 'warm').length,
        cool: leads.filter(l => l.quality === 'cool').length,
        cold: leads.filter(l => l.quality === 'cold').length
    };
}

function getDailyStats() {
    const stats = {};
    leads.forEach(lead => {
        const date = new Date(lead.timestamp).toLocaleDateString();
        stats[date] = (stats[date] || 0) + 1;
    });
    return stats;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║  MK Shopzone AI Automation Server Running                 ║
    ║  🚀 Server started on http://localhost:${PORT}           ║
    ║  📊 Dashboard: http://localhost:${PORT}/dashboard         ║
    ║  🔧 API: http://localhost:${PORT}/api                    ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
});

export default app;
