const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get user profile with their recipes
// @route   GET /api/users/:userId
// @access  Public
exports.getUserProfile = async (req, res) => {
    try {
        // Find the user by the ID from the URL parameters to get their name
        const user = await User.findById(req.params.userId).select('name');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Find all recipes created by this user
        const recipes = await Recipe.find({ user: req.params.userId }).sort({ date: -1 });

        // Return the user's name and their list of recipes
        res.json({
            name: user.name,
            recipes: recipes,
        });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Toggle a recipe in user's favorites
// @route   PUT /api/users/favorites/:recipeId
// @access  Private
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const recipeId = req.params.recipeId;

        // Check if the recipe is already in favorites
        const favoriteIndex = user.favorites.indexOf(recipeId);

        if (favoriteIndex === -1) {
            // If not, add it
            user.favorites.push(recipeId);
        } else {
            // If it is, remove it
            user.favorites.splice(favoriteIndex, 1);
        }

        await user.save();
        res.json(user.favorites); // Return the updated list of favorite IDs

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all favorite recipes for a user
// @route   GET /api/users/favorites
// @access  Private
exports.getFavoriteRecipes = async (req, res) => {
    try {
        // Find the user and populate the 'favorites' field, which replaces the recipe IDs
        // with the full recipe documents.
        const user = await User.findById(req.user.id).populate('favorites');
        res.json(user.favorites);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};