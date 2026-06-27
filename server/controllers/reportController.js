const Booking = require('../models/Booking');
const User = require('../models/User');
const Package = require('../models/Package');

// @desc   Get dashboard overview stats (admin)
// @route  GET /api/reports/overview
// @access Admin
const getOverview = async (req, res, next) => {
  try {
    const [totalBookings, pending, approved, rejected, completed, totalCustomers] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'approved' }),
      Booking.countDocuments({ status: 'rejected' }),
      Booking.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: 'customer' }),
    ]);

    // Today's events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayEvents = await Booking.countDocuments({
      event_date: { $gte: today, $lt: tomorrow },
      status: 'approved',
    });

    // Monthly revenue (approved bookings this month)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyBookings = await Booking.find({
      status: { $in: ['approved', 'completed'] },
      createdAt: { $gte: firstDayOfMonth },
    }).populate('package_id', 'price');

    const monthlyRevenue = monthlyBookings.reduce((sum, b) => {
      return sum + (b.package_id?.price || 0) + (b.additional_charges || 0);
    }, 0);

    res.status(200).json({
      success: true,
      stats: { totalBookings, pending, approved, rejected, completed, totalCustomers, todayEvents, monthlyRevenue },
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get bookings per month chart data
// @route  GET /api/reports/bookings-chart
// @access Admin
const getBookingsChart = async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const pipeline = [
      { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
      { $group: { _id: { month: { $month: '$createdAt' }, status: '$status' }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } },
    ];

    const data = await Booking.aggregate(pipeline);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = months.map((month, i) => {
      const monthData = { month };
      ['pending', 'approved', 'rejected', 'completed', 'cancelled'].forEach((status) => {
        const found = data.find((d) => d._id.month === i + 1 && d._id.status === status);
        monthData[status] = found ? found.count : 0;
      });
      monthData.total = Object.values(monthData).filter((v) => typeof v === 'number').reduce((a, b) => a + b, 0);
      return monthData;
    });

    res.status(200).json({ success: true, chartData });
  } catch (error) {
    next(error);
  }
};

// @desc   Get revenue chart data
// @route  GET /api/reports/revenue-chart
// @access Admin
const getRevenueChart = async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const bookings = await Booking.find({
      status: { $in: ['approved', 'completed'] },
      createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) },
    }).populate('package_id', 'price');

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth = Array(12).fill(0);

    bookings.forEach((b) => {
      const month = new Date(b.createdAt).getMonth();
      revenueByMonth[month] += (b.package_id?.price || 0) + (b.additional_charges || 0);
    });

    const chartData = months.map((month, i) => ({ month, revenue: revenueByMonth[i] }));
    res.status(200).json({ success: true, chartData });
  } catch (error) {
    next(error);
  }
};

// @desc   Get popular packages chart
// @route  GET /api/reports/popular-packages
// @access Admin
const getPopularPackages = async (req, res, next) => {
  try {
    const data = await Booking.aggregate([
      { $group: { _id: '$package_id', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'packages', localField: '_id', foreignField: '_id', as: 'package' } },
      { $unwind: '$package' },
      { $project: { name: '$package.name', count: 1, price: '$package.price' } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc   Get customer growth chart
// @route  GET /api/reports/customer-growth
// @access Admin
const getCustomerGrowth = async (req, res, next) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const data = await User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
      { $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = months.map((month, i) => {
      const found = data.find((d) => d._id.month === i + 1);
      return { month, customers: found ? found.count : 0 };
    });

    res.status(200).json({ success: true, chartData });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview, getBookingsChart, getRevenueChart, getPopularPackages, getCustomerGrowth };
