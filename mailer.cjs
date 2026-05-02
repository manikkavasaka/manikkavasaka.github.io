const nodemailer = require('nodemailer');
require('dotenv').config();

const smtpUser = process.env.SMTP_USER || 'mkshopzone2@gmail.com';
const smtpPass = (process.env.SMTP_PASS || 'jizs rofi bdvg ihff').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Gmail server ready!');
    return true;
  } catch (err) {
    console.error('❌ Verification failed:', err.message || err);
    return false;
  }
};

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"MK ShopZone" <${smtpUser}>`,
      to,
      subject,
      text: 'Plain text version',
      html,
    });

    console.log('✅ Message sent:', info.messageId);
    console.log('📨 Gmail response:', info.response || 'Sent');

    if (info.rejected && info.rejected.length > 0) {
      console.warn('⚠️ Rejected:', info.rejected);
    }

    return info;
  } catch (err) {
    switch (err.code) {
      case 'ECONNECTION':
      case 'ETIMEDOUT':
        console.error('🔴 Network error:', err.message);
        break;
      case 'EAUTH':
        console.error('🔴 Auth failed:', err.message);
        console.error('👉 Gmail App Password check pannunga.');
        break;
      default:
        console.error('🔴 Send failed:', err.message || err);
    }
    throw err;
  }
};

if (require.main === module) {
  (async () => {
    const ok = await verifyConnection();
    if (!ok) return;
    try {
      await sendEmail(
        process.env.TEST_EMAIL || smtpUser,
        'Hello from MK ShopZone!',
        '<h1>Email Working! ✅</h1><p>Nodemailer Gmail setup success!</p>'
      );
    } catch (_) {}
  })();
}

module.exports = { sendEmail, verifyConnection };
