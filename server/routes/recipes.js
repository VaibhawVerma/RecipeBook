const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/recipes
// @desc    Get all recipes
// @access  Public
router.get('/', recipeController.getAllRecipes);

// @route   GET api/recipes/my
// @desc    Get all recipes for logged in user
// @access  Private
router.get('/my', authMiddleware, recipeController.getUserRecipes);

// @route   GET api/recipes/:id
// @desc    Get a single recipe by ID
// @access  Public
router.get('/:id', recipeController.getRecipeById);

// @route   POST api/recipes
// @desc    Create a recipe
// @access  Private
router.post('/', authMiddleware, recipeController.createRecipe);

// @route   PUT api/recipes/:id
// @desc    Update a recipe
// @access  Private
router.put('/:id', authMiddleware, recipeController.updateRecipe);

// @route   DELETE api/recipes/:id
// @desc    Delete a recipe
// @access  Private
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);

module.exports = router;