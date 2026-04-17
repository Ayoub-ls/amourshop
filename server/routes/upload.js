const express = require('express');
const router = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Stream directly to Cloudinary bypassing third-party storage plugins
  const stream = cloudinary.uploader.upload_stream(
    (error, result) => {
      if (error) {
        console.error("Cloudinary Native Stream Error:", error);
        return res.status(500).json({ error: error.message || 'Stream failed' });
      }
      res.status(200).json({ image_url: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

module.exports = router;
