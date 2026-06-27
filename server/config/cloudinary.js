const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary if credentials are provided
const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Cloudinary storage
const cloudinaryStorage = useCloudinary
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'darklight-photography',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1920, height: 1080, crop: 'limit' }],
      },
    })
  : null;

// Local storage fallback
const localStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'), false);
};

const upload = multer({
  storage: useCloudinary ? cloudinaryStorage : localStorageConfig,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Helper to get image URL from uploaded file
const getImageUrl = (file) => {
  if (!file) return null;
  if (useCloudinary) return file.path;
  return `/uploads/${file.filename}`;
};

// Helper to delete image
const deleteImage = async (publicIdOrPath) => {
  if (useCloudinary && publicIdOrPath) {
    try {
      await cloudinary.uploader.destroy(publicIdOrPath);
    } catch (err) {
      console.error('Cloudinary delete error:', err);
    }
  } else if (publicIdOrPath) {
    const localPath = path.join(__dirname, '../uploads', path.basename(publicIdOrPath));
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
  }
};

module.exports = { upload, getImageUrl, deleteImage, cloudinary };
