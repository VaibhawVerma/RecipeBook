const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// This route is public, so anyone can view a user's profile.
router.get('/:userId', userController.getUserProfile);

module.exports = router;