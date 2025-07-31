import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserRecipes = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get('/api/recipes/my', {
                headers: { 'x-auth-token': token 
            }});
            setRecipes(res.data);
        } catch (err) {
            console.error("Error fetching user recipes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserRecipes();
    }, []);

    const deleteRecipe = async (id) => {
        // Using a custom modal instead of window.confirm for better styling
        if (confirm('Are you sure you want to delete this recipe? This cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/recipes/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                // Refetch recipes after deletion by filtering state
                setRecipes(recipes.filter(recipe => recipe._id !== id));
            } catch (err) {
                console.error("Error deleting recipe:", err);
                alert('Failed to delete recipe.');
            }
        }
    };

    if (loading) {
        return <p className="text-center mt-8">Loading your recipes...</p>;
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
                <Link to="/create-recipe" className="bg-indigo-600 text-white py-2 px-5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-px">
                    + Add New Recipe
                </Link>
            </div>
            {recipes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border-2 border-dashed">
                    <h3 className="text-xl font-medium text-gray-800">No Recipes Yet!</h3>
                    <p className="text-gray-500 mt-2">Click the button above to add your first recipe.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {recipes.map(recipe => (
                            <li key={recipe._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center">
                                   <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-indigo-700">{recipe.title}</h3>
                                        <p className="text-gray-600 mt-1 text-sm">{recipe.description}</p>
                                   </div>
                                   <div className="flex space-x-3 flex-shrink-0 ml-4">
                                       <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)} className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium">Edit</button>
                                       <button onClick={() => deleteRecipe(recipe._id)} className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 transition-colors text-sm font-medium">Delete</button>
                                   </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MyRecipes;