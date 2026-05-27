const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que a pasta uploads/ existe
const uploadDir = process.env.UPLOADS_PATH || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (!ext) {
      if (file.mimetype === 'image/png') ext = '.png';
      else if (file.mimetype === 'image/webp') ext = '.webp';
      else ext = '.jpg';
    }
    const uniqueName = `product_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExts.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens JPG, PNG ou WebP são permitidas.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;
