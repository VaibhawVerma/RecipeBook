import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { jwtDecode } from 'jwt-decode';
import BackButton from '../components/BackButton';
import { useToast } from '../context/ToastContext';

const RecipeDetail = () => {
    const { showToast } = useToast();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRating, setUserRating] = useState(0);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [commentText, setCommentText] = useState(''); // State for new comment
    const [comments, setComments] = useState([]); // State for comments list
    const { id } = useParams();
    const placeholderImage = "[https://placehold.co/1200x600/E2E8F0/4A5568?text=Recipe](https://placehold.co/1200x600/E2E8F0/4A5568?text=Recipe)";

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) { const decoded = jwtDecode(token); setCurrentUserId(decoded.user.id); }
        const fetchRecipe = async () => {
            try {
                const { data } = await axios.get(`/api/recipes/${id}`);
                setRecipe(data);
                setComments(data.comments); // Set initial comments
                if (token) {
                    const decoded = jwtDecode(token);
                    const existingRating = data.ratings.find(r => r.user === decoded.user.id);
                    if (existingRating) { setUserRating(existingRating.value); }
                }
            } catch (err) { console.error("Error fetching recipe details:", err); } 
            finally { setLoading(false); }
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
            showToast('Rating submitted successfully!'); // 3. Use the toast
        } catch (err) {
            console.error("Error submitting rating:", err);
            showToast(err.response?.data?.msg || 'Failed to submit rating.', 'error'); // 3. Use the toast for errors
        }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const { data } = await axios.post(`/api/recipes/${id}/comment`, { text: commentText }, config);
            setComments(data);
            setCommentText('');
            showToast('Comment posted!'); // 3. Use the toast
        } catch (err) {
            console.error("Error posting comment:", err);
            showToast('Failed to post comment.', 'error'); // 3. Use the toast for errors
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const { data } = await axios.delete(`/api/recipes/${id}/comment/${commentId}`, config);
                setComments(data);
                showToast('Comment deleted.'); // 3. Use the toast
            } catch (err) {
                console.error("Error deleting comment:", err);
                showToast('Failed to delete comment.', 'error'); // 3. Use the toast for errors
            }
        }
    };

    const getOptimizedUrl = (url) => {
        if (url && url.includes('cloudinary')) {
            // Request a larger, high-quality version for the detail page
            return url.replace('/upload/', '/upload/w_1200,h_800,c_fill,q_auto/');
        }
        return url || placeholderImage;
    };

    if (loading) return <p className="text-center mt-8">Loading recipe...</p>;
    if (!recipe) return <p className="text-center mt-8 text-red-500">Recipe not found</p>;

    const averageRating = recipe.ratings.length > 0 ? (recipe.ratings.reduce((acc, item) => item.value + acc, 0) / recipe.ratings.length).toFixed(1) : 'Not yet rated';
    const isAuthor = recipe.user === currentUserId;

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <BackButton />
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
                    {recipe.category && <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2">{recipe.category}</p>}
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{recipe.title}</h1>
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-4"> <p className="text-md text-gray-500">By: <Link to={`/profile/${recipe.user}`} className="font-medium text-indigo-600 hover:underline">{recipe.author}</Link></p> <div className="flex items-center space-x-2"> <StarRating rating={averageRating} disabled={true} /> <span className="text-sm text-gray-600">{averageRating} ({recipe.ratings.length} ratings)</span> </div> </div>
                    <img src={getOptimizedUrl(recipe.imageUrl)} alt={recipe.title} className="w-full h-96 object-cover rounded-lg mb-8 shadow-md" onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }} />
                    <p className="text-lg text-gray-700 mb-8">{recipe.description}</p>
                    <div className="bg-gray-50 p-6 rounded-lg mb-8"> <h3 className="text-lg font-semibold text-gray-800 mb-2">{isAuthor ? "This is your recipe" : (userRating > 0 ? "You rated this recipe" : "Rate this recipe")}</h3> <StarRating rating={userRating} onRate={handleRate} disabled={isAuthor} /> {isAuthor && <p className="text-xs text-gray-500 mt-1">You cannot rate your own recipe.</p>} </div>
                    <div className="grid md:grid-cols-3 gap-8"> <div className="md:col-span-1"> <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">Ingredients</h2> <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">{recipe.ingredients.map((ing, index) => <li key={index}>{ing}</li>)}</ul> </div> <div className="md:col-span-2"> <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">Instructions</h2> <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{recipe.instructions}</div> </div> </div>
                    <div className="mt-12"> <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-500 pb-2">Comments ({comments.length})</h2> <div className="mb-6"> <form onSubmit={handleCommentSubmit}> <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Leave a comment..." rows="3" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea> <button type="submit" className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">Post Comment</button> </form> </div> <div className="space-y-4"> {comments.map(comment => ( <div key={comment._id} className="bg-gray-50 p-4 rounded-lg"> <div className="flex justify-between items-start"> <div> <p className="font-semibold text-gray-800">{comment.name}</p> <p className="text-xs text-gray-500">{new Date(comment.date).toLocaleString()}</p> </div> {currentUserId === comment.user && ( <button onClick={() => handleCommentDelete(comment._id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button> )} </div> <p className="text-gray-700 mt-2">{comment.text}</p> </div> ))} </div> </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;