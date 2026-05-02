const { sendWhatsApp } = require('./backend/utils/whatsapp.js');
require('dotenv').config();

// Simple test script for WhatsApp
const testWhatsApp = async () => {
    const testNumber = process.env.TEST_PHONE_NUMBER || '+1234567890'; // Replace with a real number in .env
    const message = "Hello from MK ShopZone! This is a test WhatsApp message.";
    
    console.log(`🚀 Sending test WhatsApp to ${testNumber}...`);
    const result = await sendWhatsApp(testNumber, message);
    
    if (result) {
        console.log("✅ Test message sent successfully!");
    } else {
        console.log("❌ Test message failed. Check your Twilio credentials in .env");
    }
};

testWhatsApp();
