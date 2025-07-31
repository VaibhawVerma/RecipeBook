const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    author: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('recipe', RecipeSchema);