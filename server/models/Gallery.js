const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['wedding', 'birthday', 'graduation', 'commercial', 'nature', 'events', 'portraits', 'outdoor'],
      default: 'events',
    },
    image_url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
