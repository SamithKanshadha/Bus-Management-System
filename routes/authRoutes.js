const express = require('express');
const { adminLogin, registerCommuter, commuterLogin } = require('../controllers/authcontroller');

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/commuter/register', registerCommuter);
router.post('/commuter/login', commuterLogin);

module.exports = router;
