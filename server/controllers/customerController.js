const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc   Get all customers (admin)
// @route  GET /api/customers
// @access Admin
const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'customer' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Add booking count to each customer
    const customersWithCounts = await Promise.all(
      customers.map(async (customer) => {
        const bookingCount = await Booking.countDocuments({ user_id: customer._id });
        return { ...customer.toObject(), bookingCount };
      })
    );

    res.status(200).json({ success: true, customers: customersWithCounts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc   Get customer booking history (admin)
// @route  GET /api/customers/:id/bookings
// @access Admin
const getCustomerBookings = async (req, res, next) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });

    const bookings = await Booking.find({ user_id: req.params.id })
      .populate('package_id', 'name price duration')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, customer, bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomers, getCustomerBookings };
