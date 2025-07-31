import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await axios.get(`/api/recipes/${id}`);
                setRecipe(res.data);
            } catch (err) {
                console.error("Error fetching recipe details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) {
        return <p className="text-center mt-8">Loading recipe...</p>;
    }

    if (!recipe) {
        return <p className="text-center mt-8 text-red-500">Recipe not found.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white p-8 rounded-lg shadow-xl">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{recipe.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
                <p className="text-md text-gray-500 mb-6">Created by: <span className="font-medium">{recipe.author}</span></p>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 pb-2">Ingredients</h2>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {recipe.ingredients.map((ing, index) => (
                                <li key={index}>{ing}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 pb-2">Instructions</h2>
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