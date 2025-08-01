import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { useFavorites } from '../context/FavoritesContext';

const MyFavorites = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { favoriteIds } = useFavorites();

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.get('/api/users/favorites', config);
                setFavoriteRecipes(data);
            } catch (err) {
                console.error("Error fetching favorite recipes:", err);
                setFavoriteRecipes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    useEffect(() => {
        setFavoriteRecipes(prevRecipes => prevRecipes.filter(recipe => favoriteIds.has(recipe._id)));
    }, [favoriteIds]);

    if (loading) return <p className="text-center mt-8 text-gray-500">Loading your favorites...</p>;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">My Favorite Recipes</h1>
                <p className="mt-2 text-lg text-gray-600">Your hand-picked collection of must-try meals</p>
            </div>
            {favoriteRecipes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border-2 border-dashed">
                    <h3 className="text-xl font-medium text-gray-800">No Favorites Yet!</h3>
                    <p className="text-gray-500 mt-2">Click the heart icon on any recipe to save it here</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favoriteRecipes.map(recipe => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFavorites;