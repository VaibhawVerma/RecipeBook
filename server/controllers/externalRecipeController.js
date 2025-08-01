// communicates with TheMealDB API

const axios = require('axios');

// transforms TheMealDB's data structure into ours
const adaptMealData = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim());
        }
    }

    // **THIS IS THE FIX:**
    // We now check if meal.strSource exists before trying to create a URL from it.
    let author = 'TheMealDB';
    if (meal.strSource) {
        try {
            author = new URL(meal.strSource).hostname.replace('www.', '');
        } catch (e) {
            // If the URL is malformed, we just keep the default author.
            console.error("Could not parse source URL:", meal.strSource);
        }
    }

    return {
        _id: `external-${meal.idMeal}`,
        title: meal.strMeal,
        description: meal.strInstructions ? meal.strInstructions.substring(0, 150) + '...' : 'No description available.',
        instructions: meal.strInstructions,
        imageUrl: meal.strMealThumb,
        ingredients: ingredients,
        category: meal.strCategory,
        author: author,
        user: 'external',
        isExternal: true,
        sourceUrl: meal.strSource,
    };
};
// @desc    Search recipes from TheMealDB
// @route   GET /api/external-recipes/search
// @access  Public
exports.searchExternalRecipes = async (req, res) => {
    const searchTerm = req.query.search || '';
    if (!searchTerm) {
        return res.json([]);
    }
    try {
        const { data } = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        if (data.meals) {
            const adaptedRecipes = data.meals.map(adaptMealData);
            res.json(adaptedRecipes);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching from TheMealDB:', error.message);
        res.status(500).send('Server error while fetching external recipes');
    }
};
