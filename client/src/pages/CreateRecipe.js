import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useToast } from '../context/ToastContext';
import imageCompression from 'browser-image-compression';

const CreateRecipe = () => {
    const [formData, setFormData] = useState({ title: '', description: '', ingredients: '', instructions: '', category: '' });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const { showToast } = useToast();

    useEffect(() => {
        if (id) {
            const fetchRecipe = async () => {
                try {
                    const { data } = await axios.get(`/api/recipes/${id}`);
                    setFormData({
                        title: data.title,
                        description: data.description,
                        ingredients: data.ingredients.join(', '),
                        instructions: data.instructions,
                        category: data.category
                    });
                    if (data.imageUrl) { setImagePreview(data.imageUrl); }
                } catch (err) { setError("Could not load recipe data."); }
            };
            fetchRecipe();
        }
    }, [id]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image')) {
            setImage(null);
            return;
        }

        setImagePreview(URL.createObjectURL(file)); // Show preview immediately

        // Compression options
        const options = {
            maxSizeMB: 1,          // Max file size in MB
            maxWidthOrHeight: 1920, // Max width or height
            useWebWorker: true,
        };

        try {
            console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
            const compressedFile = await imageCompression(file, options);
            console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
            setImage(compressedFile);
        } catch (error) {
            console.error('Error compressing image:', error);
            setImage(file); // Fallback to the original file if compression fails
        }
    };

    const removeImage = () => { setImage(null); setImagePreview(''); };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const recipeFormData = new FormData();
        recipeFormData.append('title', formData.title);
        recipeFormData.append('description', formData.description);
        recipeFormData.append('instructions', formData.instructions);
        recipeFormData.append('category', formData.category);
        
        const ingredientsArray = formData.ingredients.split(',').map(item => item.trim()).filter(item => item);
        if (ingredientsArray.length === 0) { setError("Please add at least one ingredient."); setLoading(false); return; }
        ingredientsArray.forEach(ing => recipeFormData.append('ingredients', ing));

        if (image) { recipeFormData.append('image', image); }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token } };
            if (id) {
                await axios.put(`/api/recipes/${id}`, recipeFormData, config);
                showToast('Recipe updated successfully!'); 
            } 
            else {
                await axios.post('/api/recipes', recipeFormData, config);
                showToast('Recipe created successfully!');
            }
            navigate('/my-recipes');
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred while saving.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">{id ? 'Edit Your Recipe' : 'Create a New Recipe'}</h1>
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center mb-6" role="alert">{error}</div>}
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* ... (Image upload field remains the same) ... */}
                        <div> <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label> {imagePreview ? ( <div className="relative group"> <img src={imagePreview} alt="Recipe preview" className="w-full h-64 object-cover rounded-lg shadow-inner" /> <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove image"> <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> </button> </div> ) : ( <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"> <div className="space-y-1 text-center"> <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"> <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg> <div className="flex text-sm text-gray-600"> <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"> <span>Upload a file</span> <input id="file-upload" name="image" type="file" accept="image/png, image/jpeg, image/jpg" onChange={onFileChange} className="sr-only" /> </label> </div> <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p> </div> </div> )} </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input id="title" type="text" name="title" value={formData.title} onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        
                        {/* --- NEW CATEGORY DROPDOWN --- */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select id="category" name="category" value={formData.category} onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                <option value="" disabled>Select a category</option>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        {/* --- END CATEGORY DROPDOWN --- */}

                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" name="description" value={formData.description} onChange={onChange} required rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                        </div>
                         <div>
                            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                            <p className="text-xs text-gray-500 mb-2">Separate ingredients with a comma</p>
                            <input id="ingredients" type="text" name="ingredients" value={formData.ingredients} onChange={onChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                         <div>
                            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                            <textarea id="instructions" name="instructions" value={formData.instructions} onChange={onChange} required rows="6" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300">
                            {loading ? 'Saving...' : (id ? 'Update Recipe' : 'Submit Recipe')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRecipe;