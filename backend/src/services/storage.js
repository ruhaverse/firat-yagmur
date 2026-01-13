const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Local uploads dir - Hostinger için public/uploads klasörü
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 8 // Max 8 files per request
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos allowed.'));
    }
  }
});

function makeFileUrl(filename) {
  // Hostinger için: FILE_BASE_URL env'den alınır (örn: https://shareuptime.com)
  const base = process.env.FILE_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
  return `${base}/uploads/${filename}`;
}

/**
 * Resize image for mobile optimization
 * @param {string} filepath - Path to original image
 * @param {string} size - Size preset: 'small' (320px), 'medium' (640px), 'large' (1280px)
 * @returns {Promise<Buffer>} - Resized image buffer
 */
async function resizeImage(filepath, size = 'medium') {
  const sizes = {
    thumbnail: 150,  // Profile pictures, thumbnails
    small: 320,      // Mobile feed images
    medium: 640,     // Mobile detail view
    large: 1280,     // Web desktop view
    original: null   // No resize
  };

  const dimension = sizes[size];
  
  // If size is 'original' or invalid, return original file
  if (!dimension) {
    return fs.promises.readFile(filepath);
  }

  // Check if file is an image
  const ext = path.extname(filepath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
    return fs.promises.readFile(filepath); // Return original for non-images
  }

  try {
    return await sharp(filepath)
      .resize(dimension, dimension, { 
        fit: 'cover',           // Crop to cover area
        position: 'center',     // Center the crop
        withoutEnlargement: true // Don't upscale small images
      })
      .jpeg({ 
        quality: size === 'thumbnail' ? 70 : size === 'small' ? 80 : 85,
        progressive: true,       // Progressive JPEG for faster loading
        mozjpeg: true           // Better compression
      })
      .toBuffer();
  } catch (error) {
    console.error('Image resize error:', error);
    // Fallback to original if resize fails
    return fs.promises.readFile(filepath);
  }
}

// uploadToSpaces kaldırıldı - AWS/S3 kullanmıyoruz, sadece local uploads/
module.exports = { upload, makeFileUrl, uploadsDir, resizeImage };
