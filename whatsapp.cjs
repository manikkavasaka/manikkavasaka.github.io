const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_FROM;

let client = null;
if (accountSid && authToken && accountSid.startsWith('AC')) {
  client = twilio(accountSid, authToken);
} else {
  console.warn('⚠️ Twilio client not initialized. Check .env');
}

const sendWhatsAppMessage = async (phone, name) => {
  if (!client) {
    console.warn('⚠️ Twilio client not initialized. Cannot send WhatsApp.');
    return null;
  }

  try {
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`;
    }

    const message = `Hi ${name}! 👋\n\nThank you for contacting MK ShopZone! 🙏\n\n✅ Free Consultation - Confirmed!\n✅ Our team will call you within 2 hours!\n\nVisit us: mkshopzone.me\n\n— MK ShopZone Team 🚀`;

    const formattedTo = formattedPhone.startsWith('whatsapp:') ? formattedPhone : `whatsapp:${formattedPhone}`;
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo
    });
    console.log(`✅ WhatsApp sent to ${formattedPhone}: ${result.sid}`);
    return result;
  } catch (err) {
    console.error(`❌ Failed to send WhatsApp to ${phone}:`, err.message);
    return null; // Skip if invalid, but don't crash
  }
};

module.exports = { sendWhatsAppMessage };
