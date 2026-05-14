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

/**
 * Welcome email sent to the user after registration.
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 */
const sendWelcomeEmail = async (name, email, phone) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to MK ShopZone! 🙏</p>
      <p>✅ <strong>Free Consultation - Confirmed!</strong></p>
      <p>✅ Our team will call you within 2 hours!</p>
      <p>Your registered phone number is: <strong>${phone}</strong></p>
      <p>Meanwhile, feel free to visit our website:<br/>
         <a href="https://mkshopzone.me">mkshopzone.me</a></p>
      <p>Best Regards,<br/>
         <strong>MK ShopZone Team 🚀</strong></p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"MK ShopZone" <${smtpUser}>`,
      to: email,
      subject: 'Thank You for Contacting MK ShopZone! 🚀',
      html,
    });
    console.log(`✅ Welcome email sent to ${email}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Welcome email failed for ${email}:`, err.message);
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

module.exports = { sendEmail, sendWelcomeEmail, verifyConnection };
