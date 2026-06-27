const express = require('express');
const router = express.Router();
const { getOverview, getBookingsChart, getRevenueChart, getPopularPackages, getCustomerGrowth } = require('../controllers/reportController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/overview', protect, requireAdmin, getOverview);
router.get('/bookings-chart', protect, requireAdmin, getBookingsChart);
router.get('/revenue-chart', protect, requireAdmin, getRevenueChart);
router.get('/popular-packages', protect, requireAdmin, getPopularPackages);
router.get('/customer-growth', protect, requireAdmin, getCustomerGrowth);

module.exports = router;
