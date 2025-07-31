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