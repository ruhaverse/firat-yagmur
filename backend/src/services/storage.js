const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const upload = multer({ storage });

function makeFileUrl(filename) {
  // Hostinger için: FILE_BASE_URL env'den alınır (örn: https://shareuptime.com)
  const base = process.env.FILE_BASE_URL || `http://localhost:${process.env.PORT || 8080}`;
  return `${base}/uploads/${filename}`;
}

// uploadToSpaces kaldırıldı - AWS/S3 kullanmıyoruz, sadece local uploads/
module.exports = { upload, makeFileUrl, uploadsDir };
