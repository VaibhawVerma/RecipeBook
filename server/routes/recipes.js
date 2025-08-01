const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

// Route Order
router.get('/my', authMiddleware, recipeController.getUserRecipes);
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);

// Private routes
router.post('/', authMiddleware, upload.single('image'), recipeController.createRecipe);
router.put('/:id', authMiddleware, upload.single('image'), recipeController.updateRecipe);
router.delete('/:id', authMiddleware, recipeController.deleteRecipe);
router.put('/:id/rate', authMiddleware, recipeController.rateRecipe);


router.post('/:id/comment', authMiddleware, recipeController.addComment);
router.delete('/:id/comment/:comment_id', authMiddleware, recipeController.deleteComment);

module.exports = router;