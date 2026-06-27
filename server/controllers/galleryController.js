const Gallery = require('../models/Gallery');
const { getImageUrl, deleteImage } = require('../config/cloudinary');

// @desc   Get all gallery images (public)
// @route  GET /api/gallery
// @access Public
const getGallery = async (req, res, next) => {
  try {
    const { category, featured, limit } = req.query;
    const query = {};
    if (category && category !== 'all') query.category = category;
    if (featured === 'true') query.is_featured = true;

    let galleryQuery = Gallery.find(query).sort({ createdAt: -1 });
    if (limit) galleryQuery = galleryQuery.limit(Number(limit));

    const images = await galleryQuery;
    res.status(200).json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

// @desc   Upload gallery image(s)
// @route  POST /api/gallery
// @access Admin
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const { category = 'events', title } = req.body;
    const images = [];

    for (const file of req.files) {
      const image = await Gallery.create({
        title: title || file.originalname,
        category,
        image_url: getImageUrl(file),
        public_id: file.filename || file.public_id,
      });
      images.push(image);
    }

    res.status(201).json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

// @desc   Update gallery image
// @route  PUT /api/gallery/:id
// @access Admin
const updateImage = async (req, res, next) => {
  try {
    const { title, category, is_featured } = req.body;
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title, category, is_featured },
      { new: true }
    );
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.status(200).json({ success: true, image });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete gallery image
// @route  DELETE /api/gallery/:id
// @access Admin
const deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    await deleteImage(image.public_id || image.image_url);
    await image.deleteOne();

    res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGallery, uploadImages, updateImage, deleteGalleryImage };
