const express = require('express');
const router = express.Router();
const externalRecipeController = require('../controllers/externalRecipeController');

router.get('/search', externalRecipeController.searchExternalRecipes);

module.exports = router;