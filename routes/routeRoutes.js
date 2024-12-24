const express = require('express');
const {
  addRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  assignBusToRoute,
  deleteAssignedBus
} = require('../controllers/routeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/', protect(['admin']), addRoute);
router.get('/', protect(['admin', 'operator', 'commuter']), getRoutes);
router.get('/:id', protect(['admin', 'operator', 'commuter']), getRouteById);
router.put('/:id', protect(['admin']), updateRoute);
router.delete('/:id', protect(['admin']), deleteRoute);
router.post('/assignbus', protect(['admin','operator']), assignBusToRoute);
router.post('/deleteassignedbus', protect(['admin','operator']), deleteAssignedBus);

module.exports = router;