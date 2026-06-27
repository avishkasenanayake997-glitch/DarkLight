const express = require('express');
const router = express.Router();
const { getGallery, uploadImages, updateImage, deleteGalleryImage } = require('../controllers/galleryController');
const { protect, requireAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getGallery);
router.post('/', protect, requireAdmin, upload.array('images', 10), uploadImages);
router.put('/:id', protect, requireAdmin, updateImage);
router.delete('/:id', protect, requireAdmin, deleteGalleryImage);

module.exports = router;
