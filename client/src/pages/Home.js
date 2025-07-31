import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // useEffect hook will run whenever the searchTerm changes
    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                // The API call now includes the search term as a query parameter.
                const { data } = await axios.get(`/api/recipes?search=${searchTerm}`);
                setRecipes(data);
            } catch (err) {
                console.error("Error fetching recipes:", err);
            } finally {
                setLoading(false);
            }
        };

        //  debounce timer, waits 500ms after the user stops typing
        // before sending the API request, prevents excessive API calls
        const timerId = setTimeout(() => {
            fetchRecipes();
        }, 500);

        // cleanup function that clears the timer if the user types again
        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]); // effect depends on the searchTerm state

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Discover Recipes</h1>
                <p className="mt-2 text-lg text-gray-600">Find your next favorite meal.</p>
            </div>

            {/* --- NEW SEARCH BAR --- */}
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title, description, or ingredient..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
            {/* --- END SEARCH BAR --- */}

            {loading ? (
                <p className="text-center text-gray-500">Searching...</p>
            ) : recipes.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800">No Recipes Found</h3>
                    <p className="text-gray-500 mt-2">
                        {searchTerm 
                            ? `We couldn't find any recipes for "${searchTerm}". Try another search!`
                            : "No recipes have been shared yet. Be the first!"
                        }
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;