const Recipe = require('../models/Recipe');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Helper function to delete a file
const deleteFile = (filePath) => {
    // Correctly resolve the path from the project root
    const fullPath = path.join(__dirname, '..', '..', filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, err => {
            if (err) console.error("Error deleting file:", err);
        });
    }
};

// Get all recipes (UPDATED with search functionality)
exports.getAllRecipes = async (req, res) => {
    try {
        // Check if a 'search' query parameter exists in the URL
        const keyword = req.query.search
            ? {
                // If it exists, create a query object to search across multiple fields
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search on title
                    { description: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search on description
                    { ingredients: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search on ingredients
                ],
            }
            : {}; // If no search query, the filter object is empty and returns all recipes

        const recipes = await Recipe.find({ ...keyword }).sort({ date: -1 });
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
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Recipe not found' });
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
    const imageUrl = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : '';

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newRecipe = new Recipe({
            title,
            description,
            // Ensure ingredients are saved as an array
            ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
            instructions,
            imageUrl,
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
    
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
        if (recipe.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        const updatedFields = {
            title,
            description,
            ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
            instructions
        };
        
        if (req.file) {
            // If a new image is uploaded, delete the old one if it exists
            if (recipe.imageUrl) {
                deleteFile(recipe.imageUrl);
            }
            updatedFields.imageUrl = `/${req.file.path.replace(/\\/g, "/")}`;
        }

        recipe = await Recipe.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
        if (recipe.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // Delete the associated image file if it exists
        if (recipe.imageUrl) {
            deleteFile(recipe.imageUrl);
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Recipe removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};