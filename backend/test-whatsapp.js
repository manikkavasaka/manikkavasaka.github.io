// backend/test-whatsapp.js
const { sendRegistrationMessage } = require('./utils/whatsapp');

// Testing with your number
sendRegistrationMessage('Manikka', '+917200059453')
  .then(() => console.log('✅ Test message trigger finished.'))
  .catch(err => console.error('❌ Test failed:', err));
