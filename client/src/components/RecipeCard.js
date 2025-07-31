import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    // Fallback image if a recipe doesn't have one.
    const placeholderImage = "https://placehold.co/600x400/E2E8F0/4A5568?text=Recipe";

    return (
        <Link to={`/recipe/${recipe._id}`} className="block group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 h-full flex flex-col">
                <img 
                    src={recipe.imageUrl || placeholderImage} 
                    alt={recipe.title} 
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                />
                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">{recipe.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow text-sm">{recipe.description.substring(0, 100)}{recipe.description.length > 100 && '...'}</p>
                    <p className="text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">By: {recipe.author}</p>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;