const express = require('express');
const { 
  createSchedule, 
  getSchedules, 
  updateSchedule, 
  deleteSchedule, 
  getSpecificSchedule
} = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/',protect(["admin","operator"]), createSchedule);
router.get('/',protect(["admin","operator","commutor"]), getSchedules);
router.get('/:routeId',protect(["admin","operator","commutor"]), getSpecificSchedule);
router.put('/:scheduleId',protect(["admin","operator"]), updateSchedule);
router.delete('/:scheduleId',protect(["admin","operator"]), deleteSchedule);


module.exports = router;
