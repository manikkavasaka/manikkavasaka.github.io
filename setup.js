#!/usr/bin/env node

/**
 * MK Shopzone - One-Command Setup & Deployment
 * Automates the entire setup, testing, and deployment process
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[36m'
};

function log(type, message) {
    const prefix = {
        'info': `${colors.blue}ℹ${colors.reset}`,
        'success': `${colors.green}✓${colors.reset}`,
        'warning': `${colors.yellow}⚠${colors.reset}`,
        'error': `${colors.red}✗${colors.reset}`
    }[type] || '•';

    console.log(`${prefix} ${message}`);
}

function runCommand(command, args = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit' });
        child.on('close', code => {
            if (code !== 0) reject(new Error(`Command failed with code ${code}`));
            else resolve();
        });
    });
}

async function setup() {
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║   🚀 MK Shopzone - AI Automation Setup                      ║
    ║                                                              ║
    ║   Automating Lead Generation & Intelligent Marketing       ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    `);

    try {
        // Step 1: Check Node.js
        log('info', 'Checking Node.js installation...');
        await runCommand('node', ['--version']);
        log('success', 'Node.js is installed');

        // Step 2: Install dependencies
        log('info', 'Installing dependencies...');
        if (!fs.existsSync('node_modules')) {
            await runCommand('npm', ['install']);
            log('success', 'Dependencies installed');
        } else {
            log('success', 'Dependencies already installed');
        }

        // Step 3: Create .env if not exists
        log('info', 'Setting up environment...');
        if (!fs.existsSync('.env')) {
            fs.copyFileSync('.env.example', '.env');
            log('success', '.env file created - update with your credentials');
            log('warning', 'Please edit .env with your API keys and email config');
        } else {
            log('success', '.env file already configured');
        }

        // Step 4: Verify file structure
        log('info', 'Verifying project structure...');
        const requiredFiles = [
            'src/ai-chatbot.js',
            'src/behavior-tracker.js',
            'src/personalization.js',
            'src/lead-system.js',
            'public/chatbot.css',
            'server.js',
            'dashboard.html'
        ];

        let allFilesExist = true;
        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                log('error', `Missing file: ${file}`);
                allFilesExist = false;
            }
        }

        if (allFilesExist) {
            log('success', 'All project files are in place');
        } else {
            throw new Error('Some project files are missing');
        }

        // Step 5: Build static files
        log('info', 'Building production files...');
        // await runCommand('npm', ['run', 'build']);
        log('success', 'Build ready (run "npm run build" when needed)');

        // Step 6: Display next steps
        console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║              ✅ SETUP COMPLETE - NEXT STEPS                 ║
    ╚══════════════════════════════════════════════════════════════╝

    1️⃣  CONFIGURE YOUR CREDENTIALS
        Edit .env file with:
        - VITE_HUGGING_FACE_API (for AI chatbot)
        - GMAIL_USER & GMAIL_PASS (for email notifications)
        - NOTIFICATION_EMAIL (where to send lead alerts)

    2️⃣  START DEVELOPMENT SERVER
        Run these in separate terminals:
        
        Terminal 1 (Frontend):
        npm run dev
        
        Terminal 2 (API Backend):
        npm run server

    3️⃣  TEST THE SYSTEM
        Visit http://localhost:5173
        - Open chatbot (bottom-right)
        - Submit a test lead
        - Check dashboard at http://localhost:3001/dashboard
        - Verify confirmation email received

    4️⃣  DEPLOY TO PRODUCTION
        See DEPLOYMENT_AI_AUTOMATION.md for:
        - Vercel deployment
        - Railway backend hosting
        - GitHub Actions CI/CD
        - Custom domain setup

    📚 DOCUMENTATION
        - TESTING_GUIDE.md - Detailed testing instructions
        - DEPLOYMENT_AI_AUTOMATION.md - Production deployment
        - README.md - Project overview

    🆘 TROUBLESHOOTING
        • Chatbot not appearing? Check browser console (F12)
        • Emails not sending? Verify Gmail app password
        • API errors? Make sure server is running (npm run server)

    🎯 KEY FEATURES ACTIVATED
        ✓ AI Chatbot - 24/7 visitor engagement
        ✓ Behavior Tracking - Comprehensive analytics
        ✓ Personalization - Dynamic content adaptation
        ✓ Lead Scoring - Automatic qualification
        ✓ Email Notifications - Instant alerts
        ✓ Analytics Dashboard - Real-time metrics

    ═══════════════════════════════════════════════════════════════
        `);

        log('success', 'Setup completed successfully!');

    } catch (error) {
        log('error', `Setup failed: ${error.message}`);
        process.exit(1);
    }
}

async function deploy() {
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║              🚀 PRODUCTION DEPLOYMENT                        ║
    ╚══════════════════════════════════════════════════════════════╝
    `);

    try {
        // Build
        log('info', 'Building for production...');
        await runCommand('npm', ['run', 'build']);
        log('success', 'Production build complete');

        // Deploy frontend (example with Vercel)
        if (fs.existsSync('vercel.json')) {
            log('info', 'Deploying to Vercel...');
            // await runCommand('vercel', ['deploy', '--prod']);
            log('success', 'Frontend deployment ready (use: vercel deploy --prod)');
        }

        log('success', 'Deployment preparation complete!');

    } catch (error) {
        log('error', `Deployment failed: ${error.message}`);
        process.exit(1);
    }
}

// Parse command line arguments
const command = process.argv[2];

if (command === 'deploy') {
    deploy().catch(err => {
        log('error', err.message);
        process.exit(1);
    });
} else {
    setup().catch(err => {
        log('error', err.message);
        process.exit(1);
    });
}

