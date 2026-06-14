const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

router.post('/register', verifyToken, requireRole('admin'), authController.register);
router.post('/login', authController.login);

module.exports = router;
