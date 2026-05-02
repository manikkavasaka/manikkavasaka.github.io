const { sendEmail, verifyConnection } = require('./mailer');

verifyConnection();

sendEmail(
  'mkshopzone2@gmail.com',  // உங்களுக்கே test அனுப்புங்க
  'Test Email!',
  '<h1>Gmail Working! ✅</h1>'
);
