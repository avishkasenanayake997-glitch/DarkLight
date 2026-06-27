const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, getBooking, getAllBookings,
  approveBooking, rejectBooking, cancelBooking, getCalendarBookings,
} = require('../controllers/bookingController');
const { protect, requireAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Customer routes
router.post('/', protect, upload.array('reference_images', 5), createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, requireAdmin, getAllBookings);
router.get('/calendar', protect, requireAdmin, getCalendarBookings);
router.put('/:id/approve', protect, requireAdmin, approveBooking);
router.put('/:id/reject', protect, requireAdmin, rejectBooking);

// Shared (owner or admin)
router.get('/:id', protect, getBooking);

module.exports = router;
