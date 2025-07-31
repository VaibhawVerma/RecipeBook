const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const RecipeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    author: { type: String },
    
    category: { type: String },
    ratings: [ { user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, value: { type: Number, required: true, min: 1, max: 5 } } ],
    comments: [CommentSchema],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('recipe', RecipeSchema);