import React from 'react';
import { Link } from 'react-router-dom';

// A small helper component for the star icon
const StarIcon = () => (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const RecipeCard = ({ recipe }) => {
    const placeholderImage = "[https://placehold.co/600x400/E2E8F0/4A5568?text=Recipe](https://placehold.co/600x400/E2E8F0/4A5568?text=Recipe)";

    // Calculate average rating
    const averageRating = recipe.ratings.length > 0
        ? (recipe.ratings.reduce((acc, item) => item.value + acc, 0) / recipe.ratings.length).toFixed(1)
        : 0;

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
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">By: {recipe.author}</p>
                        {/* --- NEW RATING DISPLAY --- */}
                        {recipe.ratings.length > 0 && (
                            <div className="flex items-center space-x-1">
                                <StarIcon />
                                <span className="text-sm font-semibold text-gray-700">{averageRating}</span>
                                <span className="text-xs text-gray-500">({recipe.ratings.length})</span>
                            </div>
                        )}
                        {/* --- END RATING DISPLAY --- */}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;