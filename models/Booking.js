const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  commuter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Booked", "Cancelled"],
    default: "Booked",
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    ref: "Price",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
