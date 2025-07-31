import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

const Home = () => {
    // The typo 'a' has been corrected to 'useState'
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('/api/recipes', {
                    headers: { 'x-auth-token': token }
                });
                setRecipes(res.data);
            } catch (err) {
                console.error("Error fetching recipes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Discover New Recipes</h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : recipes.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-600">No recipes have been shared yet. Be the first!</p>
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