import React from 'react';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
    return (
        <Link to={`/recipe/${recipe._id}`} className="block group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2 h-full flex flex-col">
                {/* You can add an image here later */}
                {/* <img src="https://placehold.co/600x400/E2E8F0/333333?text=Recipe+Image" alt={recipe.title} className="w-full h-48 object-cover" /> */}
                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors">{recipe.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{recipe.description.substring(0, 100)}{recipe.description.length > 100 && '...'}</p>
                    <p className="text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">By: {recipe.author}</p>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;