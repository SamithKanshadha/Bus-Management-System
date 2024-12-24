const express = require('express');
const {
  createBooking,
  getAllBookings,
  getMyBookings,
  cancelBooking,
  getSeatAvailability
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect(['commuter']), createBooking);
router.get('/', protect(['admin', 'operator', 'commuter']), getAllBookings);
router.get('/mybookings', protect(['commuter']), getMyBookings);
router.put('/cancel/:bookingId', protect(['commuter']), cancelBooking);
router.get('/availability/:scheduleId', protect(['commuter']), getSeatAvailability);

module.exports = router;
