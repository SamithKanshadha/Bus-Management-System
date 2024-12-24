const express = require('express');
const { 
    addBus, 
    getBuses, 
    getBusById, 
    updateBus, 
    deleteBus 
} = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect(['admin','operator']), addBus);
router.get('/', protect(['admin', 'operator']), getBuses);
router.get('/:id', protect(['admin', 'operator']), getBusById);
router.put('/:id', protect(['admin']), updateBus);
router.delete('/:id', protect(['admin']), deleteBus);

module.exports = router;