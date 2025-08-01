import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchUserRecipes = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('/api/recipes/my', { headers: { 'x-auth-token': token } });
                setRecipes(res.data);
            } catch (err) {
                console.error("Error fetching user recipes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserRecipes();
    }, []);

    const deleteRecipe = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/recipes/${id}`, { headers: { 'x-auth-token': token } });
            setRecipes(recipes.filter(recipe => recipe._id !== id));
            showToast('Recipe deleted successfully.');
        } catch (err) {
            console.error("Error deleting recipe:", err);
            showToast('Failed to delete recipe.', 'error');
        }  
    };

    if (loading) return <p className="text-center mt-8 text-gray-500">Loading your recipes...</p>;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
                <Link to="/create-recipe" className="bg-indigo-600 text-white py-2 px-5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-px">+ Add New Recipe</Link>
            </div>
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, index) => <RecipeCardSkeleton key={index} />)}
                </div>
            ) : recipes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border-2 border-dashed">
                    <h3 className="text-xl font-medium text-gray-800">No Recipes Yet!</h3>
                    <p className="text-gray-500 mt-2">Click the button above to add your first recipe.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {recipes.map(recipe => (
                            <li key={recipe._id} className="p-4 sm:p-6 group hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center">
                                   <Link to={`/recipe/${recipe._id}`} className="flex-grow flex items-center space-x-4">
                                        <img src={recipe.imageUrl || "https://placehold.co/100x100/E2E8F0/4A5568?text=Recipe"} alt={recipe.title} className="h-16 w-16 object-cover rounded-md flex-shrink-0"/>
                                        <div>
                                            <h3 className="text-lg font-semibold text-indigo-700 group-hover:underline">{recipe.title}</h3>
                                            <p className="text-gray-600 mt-1 text-sm">{recipe.description.substring(0, 80)}...</p>
                                        </div>
                                   </Link>
                                   <div className="flex space-x-3 flex-shrink-0 ml-4">
                                       <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)} className="bg-blue-100 text-blue-700 py-1 px-4 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium">Edit</button>
                                       <button onClick={() => deleteRecipe(recipe._id)} className="bg-red-100 text-red-700 py-1 px-4 rounded-md hover:bg-red-200 transition-colors text-sm font-medium">Delete</button>
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