import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

const StarIcon = () => ( <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> );

const RecipeCard = ({ recipe }) => {
    const { favoriteIds, toggleFavorite } = useFavorites();
    const isFavorited = favoriteIds.has(recipe._id);
    const placeholderImage = "https://placehold.co/600x400/E2E8F0/4A5568?text=Recipe";
    const averageRating = recipe.ratings.length > 0 ? (recipe.ratings.reduce((acc, item) => item.value + acc, 0) / recipe.ratings.length).toFixed(1) : 0;

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(recipe._id);
    };
    
    const handleAuthorClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col group relative">
            <button
                onClick={handleFavoriteClick}
                className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" 
                     className={`h-6 w-6 transition-colors ${isFavorited ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`} 
                     fill={isFavorited ? 'currentColor' : 'none'} 
                     viewBox="0 0 24 24" 
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
            </button>

            <Link to={`/recipe/${recipe._id}`} className="block">
                <div className="w-full h-48 bg-gray-200">
                    <img src={recipe.imageUrl || placeholderImage} alt={recipe.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}/>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-indigo-600 transition-colors truncate">{recipe.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed">{recipe.description.substring(0, 100)}{recipe.description.length > 100 && '...'}</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 truncate">By: <Link to={`/profile/${recipe.user}`} onClick={handleAuthorClick} className="hover:underline text-indigo-600">{recipe.author}</Link></p>
                        {recipe.ratings.length > 0 && (
                            <div className="flex items-center space-x-1 flex-shrink-0">
                                <StarIcon />
                                <span className="text-sm font-semibold text-gray-700">{averageRating}</span>
                                <span className="text-xs text-gray-500">({recipe.ratings.length})</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default RecipeCard;