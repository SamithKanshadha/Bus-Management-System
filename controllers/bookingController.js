const Booking = require("../models/Booking");
const Schedule = require("../models/Schedule");

exports.createBooking = async (req, res) => {
  try {
    const { scheduleId, seatNumber } = req.body;
    const commuterId = req.user.id;

    const existingBooking = await Booking.findOne({
      schedule: scheduleId,
      seatNumber,
      status: { $ne: 'Cancelled' }, 
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'Seat is already booked.' });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    const price = schedule.price;
    const booking = new Booking({
      commuter: commuterId,
      schedule: scheduleId,
      seatNumber,
      price,
    });

    await booking.save();

    res.status(201).json({ message: 'Booking created successfully.', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookings = async (_, res) => {
  try {
    const bookings = await Booking.find()
      .populate("commuter")
      .populate({
        path: "schedule",
        populate: [
          { path: "route", options: { strictPopulate: false } },
          { path: "bus", options: { strictPopulate: false } },
        ],
      });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const commuterId = req.user.id;
    const bookings = await Booking.find({ commuter: commuterId })
      .populate("schedule")
      .populate({
        path: "schedule",
        populate: [
          { path: "route", options: { strictPopulate: false } },
          { path: "bus", options: { strictPopulate: false } },
        ],
      });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const commuterId = req.user.id;

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, commuter: commuterId, status: "Booked" },
      { status: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or already cancelled." });
    }

    const schedule = await Schedule.findById(booking.schedule);
    if (new Date(schedule.departureTime) <= new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot cancel booking after journey start time." });
    }

    res
      .status(200)
      .json({ message: "Booking cancelled successfully.", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSeatAvailability = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const schedule = await Schedule.findById(scheduleId).populate({ path: "busId", select: "capacity", options: { strictPopulate: false } });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    console.log('Schedule:', schedule);
    console.log('Bus capacity:', schedule.busId ? schedule.busId.capacity : 'No bus found');

    const bookings = await Booking.find({
      schedule: scheduleId,
      status: { $ne: 'Cancelled' },
    });
    const bookedSeats = bookings.map((booking) => parseInt(booking.seatNumber, 10));

    console.log('Booked seats:', bookedSeats);

    const availableSeats = schedule.busId
      ? Array.from(
          { length: schedule.busId.capacity },
          (_, i) => i + 1
        ).filter((seat) => !bookedSeats.includes(seat))
      : [];

    console.log('Available seats:', availableSeats);

    res.status(200).json({
      availableSeats,
      pricing: schedule.price,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};