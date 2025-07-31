import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import { CATEGORIES } from '../constants'; // Import categories


// A new component for the pagination buttons
const Pagination = ({ page, pages, onPageChange }) => {
    if (pages <= 1) return null; // Don't show pagination if there's only one page

    return (
        <nav className="flex justify-center items-center space-x-4 mt-12">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Previous
            </button>
            <span className="text-sm text-gray-700">
                Page {page} of {pages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === pages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
            </button>
        </nav>
    );
};

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1); // State for current page
    const [pages, setPages] = useState(1); // State for total pages
    const [activeCategory, setActiveCategory] = useState(''); // State for category filter

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                // API call now includes category
                const { data } = await axios.get(`/api/recipes?search=${searchTerm}&page=${page}&category=${activeCategory}`);
                setRecipes(data.recipes);
                setPage(data.page);
                setPages(data.pages);
            } catch (err) {
                console.error("Error fetching recipes:", err);
            } finally {
                setLoading(false);
            }
        };
        const timerId = setTimeout(() => { fetchRecipes(); }, 300);
        return () => clearTimeout(timerId);
    }, [searchTerm, page, activeCategory]); // Re-run when category changes

    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setPage(1); };
    
    const handleCategoryClick = (category) => {
        // If clicking the active category, clear the filter. Otherwise, set it.
        const newCategory = activeCategory === category ? '' : category;
        setActiveCategory(newCategory);
        setPage(1); // Reset to page 1
    };

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Discover Recipes</h1>
                <p className="mt-2 text-lg text-gray-600">Find your next favorite meal.</p>
            </div>
            <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                    <input type="text" placeholder="Search by title, description, or ingredient..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
            </div>
            
            {/* --- NEW CATEGORY FILTER BUTTONS --- */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            {/* --- END CATEGORY FILTER BUTTONS --- */}

            {loading ? <p className="text-center text-gray-500">Searching...</p> : recipes.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800">No Recipes Found</h3>
                    <p className="text-gray-500 mt-2">{searchTerm || activeCategory ? `We couldn't find any recipes for your criteria. Try another search or category!` : "No recipes have been shared yet. Be the first!"}</p>
                </div>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
                    </div>
                    <Pagination page={page} pages={pages} onPageChange={setPage} />
                </>
            )}
        </div>
    );
};

export default Home;