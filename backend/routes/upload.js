const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;

// Check if running in Vercel serverless environment
const IS_VERCEL = process.env.VERCEL === '1';

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WebP images are allowed'));
    }
    cb(null, true);
  }
});

// Upload file to Cloudinary
const uploadToCloudinary = async (buffer, options = {}) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: 'auto',
      public_id: `products/${uuidv4()}`,
      ...options
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

// Middleware to check if file uploads are enabled
const checkUploadEnabled = (req, res, next) => {
  if (IS_VERCEL && !process.env.CLOUDINARY_CLOUD_NAME) {
    return res.status(400).json({
      success: false,
      error: 'File uploads are disabled in Vercel serverless. Use cloud storage.'
    });
  }
  next();
};

// Upload single image
router.post('/', checkUploadEnabled, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      transformation: [
        { width: 1200, crop: 'limit', quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Generate thumbnail URL
    const thumbnailUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 300, height: 300, crop: 'thumb' },
        { fetch_format: 'auto', quality: 'auto' }
      ]
    });

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        thumbnail: thumbnailUrl,
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed', 
      message: process.env.NODE_ENV === 'production' ? 'Upload service error' : err.message
    });
  }
});

// Delete an uploaded image
router.delete('/:public_id', checkUploadEnabled, async (req, res) => {
  try {
    const { public_id } = req.params;
    if (!public_id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing public_id parameter' 
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(400).json({
        success: false,
        error: 'Cloud storage is not configured'
      });
    }

    await cloudinary.uploader.destroy(public_id);
    
    res.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete image',
      message: process.env.NODE_ENV === 'production' ? 'Delete operation failed' : err.message
    });
  }
});

module.exports = router;


