const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Get all recipes for the public feed
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ date: -1 });
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single recipe by its ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ msg: 'Recipe not found' });
        }
        res.status(500).send('Server Error');
    }
};


// Get all recipes for the logged-in user
exports.getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id }).sort({ date: -1 });
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a new recipe
exports.createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions } = req.body;

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            author: user.name,
            user: req.user.id
        });

        const recipe = await newRecipe.save();
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
    const { title, description, ingredients, instructions } = req.body;

    // Build recipe object
    const recipeFields = {};
    if (title) recipeFields.title = title;
    if (description) recipeFields.description = description;
    if (ingredients) recipeFields.ingredients = ingredients;
    if (instructions) recipeFields.instructions = instructions;

    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        // Make sure user owns the recipe
        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { $set: recipeFields },
            { new: true }
        );

        res.json(recipe);
    } catch (err)
    {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        // Make sure user owns the recipe
        if (recipe.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Recipe.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Recipe removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};