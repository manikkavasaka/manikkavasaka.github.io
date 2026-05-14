const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary.cjs');

const router = express.Router();
const upload = multer({ storage });

// Single File Upload (Image or PDF)
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: 'No file uploaded' });
    }

    res.json({
      ok: true,
      url: req.file.path,
      id: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ ok: false, message: 'Upload failed' });
  }
});

module.exports = router;
