const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const targetDir = path.join(process.cwd(), 'assets', 'products');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Only JPG and PNG images are allowed'));
    cb(null, true);
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const ext = req.file.mimetype === 'image/png' ? '.png' : '.jpg';
    const filename = `p_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    const outPath = path.join(targetDir, filename);

    // Compress and resize to max 800px
    const pipeline = sharp(req.file.buffer).resize({ width: 800, withoutEnlargement: true });
    if (ext === '.jpg') {
      await pipeline.jpeg({ quality: 80 }).toFile(outPath);
    } else {
      await pipeline.png({ compressionLevel: 8 }).toFile(outPath);
    }

    const publicUrl = `/assets/products/${filename}`;
    res.status(201).json({ success: true, data: { url: publicUrl } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Upload failed', message: err.message });
  }
});

module.exports = router;


