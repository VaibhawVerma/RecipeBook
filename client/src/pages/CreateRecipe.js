import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateRecipe = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ingredients: '',
        instructions: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // For editing existing recipe

    useEffect(() => {
        if (id) {
            const fetchRecipe = async () => {
                try {
                    const res = await axios.get(`/api/recipes/${id}`);
                    const recipeToEdit = res.data;
                    if (recipeToEdit) {
                        setFormData({
                            title: recipeToEdit.title,
                            description: recipeToEdit.description,
                            ingredients: recipeToEdit.ingredients.join(', '),
                            instructions: recipeToEdit.instructions
                        });
                    }
                } catch (err) {
                    console.error("Failed to fetch recipe for editing", err);
                    setError("Could not load recipe data.");
                }
            };
            fetchRecipe();
        }
    }, [id]);


    const { title, description, ingredients, instructions } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        const recipeData = {
            title,
            description,
            ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item), // also filter out empty strings
            instructions
        };

        if (recipeData.ingredients.length === 0) {
            return setError("Please add at least one ingredient.");
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            if (id) {
                await axios.put(`/api/recipes/${id}`, recipeData, config);
            } else {
                await axios.post('/api/recipes', recipeData, config);
            }
            
            navigate('/my-recipes');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred while saving the recipe.');
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">{id ? 'Edit Your Recipe' : 'Create a New Recipe'}</h1>
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center mb-6" role="alert">{error}</div>}
                    
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input id="title" type="text" name="title" value={title} onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" name="description" value={description} onChange={onChange} required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                        </div>
                         <div>
                            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                            <p className="text-xs text-gray-500 mb-2">Separate ingredients with a comma (e.g., Flour, Sugar, Eggs)</p>
                            <input id="ingredients" type="text" name="ingredients" value={ingredients} onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                            <textarea id="instructions" name="instructions" value={instructions} onChange={onChange} required rows="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                        </div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105">
                            {id ? 'Update Recipe' : 'Submit Recipe'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRecipe;