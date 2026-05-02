const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const sendWhatsApp = async (to, message) => {
  if (!client) {
    console.warn('⚠️ Twilio client not initialized. Check .env');
    return null;
  }

  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo
    });
    console.log(`✅ WhatsApp sent to ${to}: ${result.sid}`);
    return result;
  } catch (err) {
    console.error('❌ Failed to send WhatsApp:', err);
    return null;
  }
};

// Registration message in Tamil
const sendRegistrationMessage = async (name, phone) => {
  const message = `👋 வணக்கம் ${name}!

🎉 எங்கள் Digital Marketing Agency-ல உங்களை வரவேற்கிறோம்!

✅ உங்கள் registration successful!

🚀 நாங்கள் உங்களுக்கு உதவுவோம்:
- 📊 SEO Optimization
- 📱 Social Media Marketing  
- 🎯 Google & Meta Ads
- 🌐 Website Development

📞 உங்கள் Free Consultation Book பண்ண:
👉 https://mkshopzone.me/

எந்த நேரமும் தொடர்பு கொள்ளுங்கள்! 💼

நன்றி! 🙏
— Team MKDigital`;

  return await sendWhatsApp(phone, message);
};

module.exports = { sendWhatsApp, sendRegistrationMessage };
