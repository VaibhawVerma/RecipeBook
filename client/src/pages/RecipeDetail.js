import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Import Link
import StarRating from '../components/StarRating';
import { jwtDecode } from 'jwt-decode';
import BackButton from '../components/BackButton';

const RecipeDetail = () => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);
    const { id } = useParams();
    const placeholderImage = "[https://placehold.co/1200x600/E2E8F0/4A5568?text=Recipe](https://placehold.co/1200x600/E2E8F0/4A5568?text=Recipe)";

    useEffect(() => {
        const token = localStorage.getItem('token');
        let decodedUserId = null;
        if (token) {
            const decoded = jwtDecode(token);
            decodedUserId = decoded.user.id;
            setCurrentUserId(decodedUserId);
        }
        const fetchRecipe = async () => {
            try {
                const { data } = await axios.get(`/api/recipes/${id}`);
                setRecipe(data);
                if (decodedUserId) {
                    const existingRating = data.ratings.find(r => r.user === decodedUserId);
                    if (existingRating) { setUserRating(existingRating.value); }
                }
            } catch (err) {
                console.error("Error fetching recipe details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleRate = async (rating) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const { data } = await axios.put(`/api/recipes/${id}/rate`, { rating }, config);
            setRecipe(data);
            setUserRating(rating);
        } catch (err) {
            console.error("Error submitting rating:", err);
            alert(err.response?.data?.msg || 'Failed to submit rating.');
        }
    };

    if (loading) return <p className="text-center mt-8">Loading recipe...</p>;
    if (!recipe) return <p className="text-center mt-8 text-red-500">Recipe not found.</p>;

    const averageRating = recipe.ratings.length > 0 ? (recipe.ratings.reduce((acc, item) => item.value + acc, 0) / recipe.ratings.length).toFixed(1) : 'Not yet rated';
    const isAuthor = recipe.user === currentUserId;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <BackButton /> {/* 2. Add the component here */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{recipe.title}</h1>
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                        <p className="text-md text-gray-500">By: <Link to={`/profile/${recipe.user}`} className="font-medium text-indigo-600 hover:underline">{recipe.author}</Link></p>
                        <div className="flex items-center space-x-2">
                            <StarRating rating={averageRating} disabled={true} />
                            <span className="text-sm text-gray-600">{averageRating} ({recipe.ratings.length} ratings)</span>
                        </div>
                    </div>
                    
                    <img src={recipe.imageUrl || placeholderImage} alt={recipe.title} className="w-full h-96 object-cover rounded-lg mb-8 shadow-md" onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }} />

                    <p className="text-lg text-gray-700 mb-8">{recipe.description}</p>

                    <div className="bg-gray-50 p-6 rounded-lg mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{isAuthor ? "This is your recipe" : (userRating > 0 ? "You rated this recipe" : "Rate this recipe")}</h3>
                        <StarRating rating={userRating} onRate={handleRate} disabled={isAuthor} />
                        {isAuthor && <p className="text-xs text-gray-500 mt-1">You cannot rate your own recipe.</p>}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">Ingredients</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">{recipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)}</ul>
                        </div>
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">Instructions</h2>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{recipe.instructions}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;