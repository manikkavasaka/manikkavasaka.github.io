const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// Cloudinary Configuration
// Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mks-demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo-secret',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mkshopzone-uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    resource_type: 'auto', // Important for PDF support
  },
});

module.exports = { cloudinary, storage };
