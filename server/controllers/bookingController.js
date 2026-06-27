const Booking = require('../models/Booking');
const Package = require('../models/Package');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { getImageUrl } = require('../config/cloudinary');

// Helper to create notification
const createNotification = async (userId, title, message, type, bookingId = null) => {
  try {
    await Notification.create({ user_id: userId, title, message, type, booking_id: bookingId });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

// @desc   Create booking
// @route  POST /api/bookings
// @access Customer
const createBooking = async (req, res, next) => {
  try {
    const {
      package_id, customer_name, customer_phone, customer_email,
      event_type, event_date, start_time, end_time, location, special_request,
    } = req.body;

    const pkg = await Package.findById(package_id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });

    const reference_images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        reference_images.push({ url: getImageUrl(file), public_id: file.filename || file.public_id });
      }
    }

    const booking = await Booking.create({
      user_id: req.user.id,
      package_id,
      customer_name,
      customer_phone,
      customer_email,
      event_type,
      event_date,
      start_time,
      end_time,
      location,
      special_request,
      reference_images,
    });

    // Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await createNotification(
        admin._id,
        'New Booking Request',
        `${customer_name} has submitted a new booking request for ${event_type}.`,
        'booking_new',
        booking._id
      );
    }

    // Notify customer
    await createNotification(
      req.user.id,
      'Booking Submitted',
      `Your booking for ${event_type} on ${new Date(event_date).toDateString()} has been submitted. We'll review it shortly.`,
      'booking_new',
      booking._id
    );

    const populatedBooking = await Booking.findById(booking._id).populate('package_id', 'name price duration');

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (error) {
    next(error);
  }
};

// @desc   Get my bookings (customer)
// @route  GET /api/bookings/my
// @access Customer
const getMyBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user_id: req.user.id };
    if (status) query.status = status;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('package_id', 'name price duration')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single booking
// @route  GET /api/bookings/:id
// @access Private (owner or admin)
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user_id', 'name email phone profile_image')
      .populate('package_id', 'name price duration description features');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only owner or admin can view
    if (booking.user_id._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all bookings (admin)
// @route  GET /api/bookings
// @access Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, event_type, page = 1, limit = 10, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (event_type) query.event_type = event_type;
    if (search) {
      query.$or = [
        { customer_name: { $regex: search, $options: 'i' } },
        { customer_email: { $regex: search, $options: 'i' } },
        { booking_id: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user_id', 'name email profile_image')
      .populate('package_id', 'name price duration')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc   Approve booking (admin)
// @route  PUT /api/bookings/:id/approve
// @access Admin
const approveBooking = async (req, res, next) => {
  try {
    const { admin_note, meeting_time, additional_charges } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', admin_note, meeting_time, additional_charges: additional_charges || 0 },
      { new: true }
    ).populate('package_id', 'name price duration');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    await createNotification(
      booking.user_id,
      '🎉 Booking Approved!',
      `Your booking (${booking.booking_id}) for ${booking.event_type} on ${new Date(booking.event_date).toDateString()} has been approved!${admin_note ? ' Note: ' + admin_note : ''}`,
      'booking_approved',
      booking._id
    );

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc   Reject booking (admin)
// @route  PUT /api/bookings/:id/reject
// @access Admin
const rejectBooking = async (req, res, next) => {
  try {
    const { rejection_reason, rejection_type } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejection_reason, rejection_type },
      { new: true }
    ).populate('package_id', 'name price duration');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    await createNotification(
      booking.user_id,
      '❌ Booking Rejected',
      `Your booking (${booking.booking_id}) for ${booking.event_type} has been rejected.${rejection_reason ? ' Reason: ' + rejection_reason : ''}`,
      'booking_rejected',
      booking._id
    );

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc   Cancel booking (customer)
// @route  PUT /api/bookings/:id/cancel
// @access Customer
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user_id: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (!['pending'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: 'Only pending bookings can be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    next(error);
  }
};

// @desc   Get calendar bookings (admin)
// @route  GET /api/bookings/calendar
// @access Admin
const getCalendarBookings = async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const query = { status: 'approved' };
    if (year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.event_date = { $gte: start, $lte: end };
    }

    const bookings = await Booking.find(query)
      .populate('user_id', 'name email')
      .populate('package_id', 'name')
      .select('booking_id customer_name event_type event_date start_time end_time location status');

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking, getMyBookings, getBooking, getAllBookings,
  approveBooking, rejectBooking, cancelBooking, getCalendarBookings,
};
