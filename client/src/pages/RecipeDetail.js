import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const placeholderImage = "[https://placehold.co/1200x600/E2E8F0/4A5568?text=Recipe](https://placehold.co/1200x600/E2E8F0/4A5568?text=Recipe)";

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data } = await axios.get(`/api/recipes/${id}`);
                setRecipe(data);
            } catch (err) {
                console.error("Error fetching recipe details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) return <p className="text-center mt-8">Loading recipe...</p>;
    if (!recipe) return <p className="text-center mt-8 text-red-500">Recipe not found.</p>;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{recipe.title}</h1>
                <p className="text-md text-gray-500 mb-6">By: <span className="font-medium text-indigo-600">{recipe.author}</span></p>
                
                <img 
                    src={recipe.imageUrl || placeholderImage} 
                    alt={recipe.title} 
                    className="w-full h-96 object-cover rounded-lg mb-8 shadow-md"
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                />

                <p className="text-lg text-gray-700 mb-8">{recipe.description}</p>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">Ingredients</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
                            {recipe.ingredients.map((ing, index) => (
                                <li key={index}>{ing}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="md-col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">Instructions</h2>
                        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                            {recipe.instructions}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;