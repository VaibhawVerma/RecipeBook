const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    author: { type: String },
    
    // This array will store objects, each with a user's ID and their given rating.
    ratings: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true,
            },
            value: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
        }
    ],

    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('recipe', RecipeSchema);