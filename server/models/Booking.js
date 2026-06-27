const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    booking_id: {
      type: String,
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    package_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true,
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
    },
    customer_phone: {
      type: String,
      required: true,
      trim: true,
    },
    customer_email: {
      type: String,
      required: true,
      lowercase: true,
    },
    event_type: {
      type: String,
      required: true,
      enum: ['wedding', 'birthday', 'graduation', 'event', 'commercial', 'outdoor', 'other'],
    },
    event_date: {
      type: Date,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    special_request: {
      type: String,
      trim: true,
    },
    reference_images: [
      {
        url: String,
        public_id: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    admin_note: {
      type: String,
      trim: true,
    },
    meeting_time: {
      type: String,
    },
    additional_charges: {
      type: Number,
      default: 0,
    },
    rejection_reason: {
      type: String,
      trim: true,
    },
    rejection_type: {
      type: String,
      enum: ['unavailable', 'fully_booked', 'outside_area', 'other'],
    },
  },
  { timestamps: true }
);

bookingSchema.pre('save', async function () {
  if (!this.booking_id) {
    const count = await mongoose.model('Booking').countDocuments();
    this.booking_id = `DL-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
