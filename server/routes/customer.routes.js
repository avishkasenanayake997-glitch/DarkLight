const express = require('express');
const router = express.Router();
const { getCustomers, getCustomerBookings } = require('../controllers/customerController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', protect, requireAdmin, getCustomers);
router.get('/:id/bookings', protect, requireAdmin, getCustomerBookings);

module.exports = router;
