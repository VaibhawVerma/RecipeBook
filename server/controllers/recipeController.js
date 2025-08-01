const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');


// @desc    Add a comment to a recipe
// @route   POST /api/recipes/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name');
        const recipe = await Recipe.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            user: req.user.id
        };

        recipe.comments.unshift(newComment); // Add to the beginning of the array
        await recipe.save();
        res.json(recipe.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a comment from a recipe
// @route   DELETE /api/recipes/:id/comment/:comment_id
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        // Find the comment to be deleted
        const comment = recipe.comments.find(
            c => c.id === req.params.comment_id
        );

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        // Check if the user trying to delete is the one who made the comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Remove the comment from the array
        recipe.comments = recipe.comments.filter(
            c => c.id !== req.params.comment_id
        );

        await recipe.save();
        res.json(recipe.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// UPDATED to use text index
exports.getAllRecipes = async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.page) || 1;

    try {
        let keyword = {};
        if (req.query.search) {
            const searchTerms = req.query.search.split(' ').map(term => `(?=.*${term})`).join('');
            const regex = new RegExp(`${searchTerms}`, 'i');
            
            keyword = {
                $or: [
                    { title: regex },
                    { description: regex },
                    { ingredients: regex },
                ],
            };
        }
        
        const category = req.query.category ? { category: req.query.category } : {};
        const finalQuery = { ...keyword, ...category };

        const count = await Recipe.countDocuments(finalQuery);
        const recipes = await Recipe.find(finalQuery).sort({ date: -1 }).limit(pageSize).skip(pageSize * (page - 1));
        
        res.json({ recipes, page, pages: Math.ceil(count / pageSize) });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getRecipeSuggestions = async (req, res) => {
    try {
        const keyword = req.query.search
            ? { title: { $regex: req.query.search, $options: 'i' } }
            : {};

        const suggestions = await Recipe.find({ ...keyword })
            .limit(5)
            .select('title');

        res.json(suggestions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

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

exports.getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.user.id }).sort({ date: -1 });
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, category } = req.body;
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        const recipeData = {
            title, description, ingredients: Array.isArray(ingredients) ? ingredients : [ingredients], instructions, category,
            author: user.name,
            user: req.user.id
        };

        if (req.file) {
            recipeData.imageUrl = req.file.path;
            recipeData.cloudinaryId = req.file.filename;
        }

        const newRecipe = new Recipe(recipeData);
        const recipe = await newRecipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        console.error("Error in createRecipe:", err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateRecipe = async (req, res) => {
    const { title, description, ingredients, instructions, category } = req.body;
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
        if (recipe.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        
        const updatedFields = { title, description, ingredients: Array.isArray(ingredients) ? ingredients : [ingredients], instructions, category };
        
        if (req.file) {
            if (recipe.cloudinaryId) {
                await cloudinary.uploader.destroy(recipe.cloudinaryId);
            }
            updatedFields.imageUrl = req.file.path;
            updatedFields.cloudinaryId = req.file.filename;
        }
        
        recipe = await Recipe.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });
        if (recipe.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // If the recipe has an image in Cloudinary, delete it
        if (recipe.cloudinaryId) {
            await cloudinary.uploader.destroy(recipe.cloudinaryId);
        }

        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Recipe removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.rateRecipe = async (req, res) => {
    const { rating } = req.body;

    // Basic validation for the rating value
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ msg: 'Rating must be between 1 and 5.' });
    }

    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        // Prevent the author from rating their own recipe
        if (recipe.user.toString() === req.user.id) {
            return res.status(400).json({ msg: 'You cannot rate your own recipe.' });
        }

        // Check if the user has already rated this recipe
        const existingRating = recipe.ratings.find(
            r => r.user.toString() === req.user.id
        );

        if (existingRating) {
            // If they have, update their rating
            existingRating.value = rating;
        } else {
            // If they haven't, add a new rating object to the array
            recipe.ratings.push({ user: req.user.id, value: rating });
        }

        await recipe.save();
        res.json(recipe);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};