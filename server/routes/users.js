const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Gets all favorited recipes for the logged-in user
router.get('/favorites', authMiddleware, userController.getFavoriteRecipes);
// Toggles a recipe in the user's favorites list
router.put('/favorites/:recipeId', authMiddleware, userController.toggleFavorite);

// This route is public, so anyone can view a user's profile.
router.get('/:userId', userController.getUserProfile);

module.exports = router;