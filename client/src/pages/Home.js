import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';
import { CATEGORIES } from '../constants';


// component for the pagination buttons
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
    const [internalRecipes, setInternalRecipes] = useState([]);
    const [externalRecipes, setExternalRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const searchContainerRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTerm = searchParams.get('search') || '';
    const activeCategory = searchParams.get('category') || '';
    const page = Number(searchParams.get('page')) || 1;
    const [pages, setPages] = useState(1);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            setExternalRecipes([]);
            try {
                const { data: internalData } = await axios.get(`/api/recipes?${searchParams.toString()}`);
                setInternalRecipes(internalData.recipes);
                setPages(internalData.pages);
                setLoading(false);

                if (searchTerm && !activeCategory) {
                    const { data: externalData } = await axios.get(`/api/external-recipes/search?search=${searchTerm}`);
                    setExternalRecipes(externalData);
                }
            } catch (err) {
                console.error("Error fetching recipes:", err);
                setLoading(false);
            }
        };
        
        const timerId = setTimeout(() => { fetchRecipes(); }, 300);
        return () => clearTimeout(timerId);
    }, [searchParams]);

    // ... (suggestion logic and handlers remain the same) ...
    useEffect(() => { const fetchSuggestions = async () => { if (searchTerm.length > 1) { try { const { data } = await axios.get(`/api/recipes/suggestions?search=${searchTerm}`); setSuggestions(data); } catch (err) { console.error("Error fetching suggestions:", err); } } else { setSuggestions([]); } }; const timerId = setTimeout(() => fetchSuggestions(), 200); return () => clearTimeout(timerId); }, [searchTerm]);
    useEffect(() => { const handleClickOutside = (event) => { if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) { setSuggestions([]); } }; document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [searchContainerRef]);
    const updateSearchParams = (key, value) => { const newParams = new URLSearchParams(searchParams); if (value) { newParams.set(key, value); } else { newParams.delete(key); } if (key !== 'page') { newParams.set('page', '1'); } setSearchParams(newParams); };
    const handleSearchChange = (e) => updateSearchParams('search', e.target.value);
    const handleCategoryClick = (category) => updateSearchParams('category', activeCategory === category ? '' : category);
    const handleSuggestionClick = (title) => { updateSearchParams('search', title); setSuggestions([]); };
    const handlePageChange = (newPage) => updateSearchParams('page', newPage);

    const combinedRecipes = [...internalRecipes, ...externalRecipes];

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Discover Recipes</h1>
                <p className="mt-2 text-lg text-gray-600">Find your next favorite meal from our community or the web</p>
            </div>
            <div className="mb-8 max-w-2xl mx-auto" ref={searchContainerRef}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                    <input type="text" placeholder="Search for recipes..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" autoComplete="off" />
                    {suggestions.length > 0 && ( <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg"> {suggestions.map(suggestion => ( <li key={suggestion._id} onClick={() => handleSuggestionClick(suggestion.title)} className="px-4 py-2 cursor-pointer hover:bg-gray-100">{suggestion.title}</li> ))} </ul> )}
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-10"> {CATEGORIES.map(cat => ( <button key={cat} onClick={() => handleCategoryClick(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}> {cat} </button> ))} </div>

            {loading ? ( <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {Array.from({ length: 8 }).map((_, index) => ( <RecipeCardSkeleton key={index} /> ))} </div> ) : combinedRecipes.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-gray-800">No Recipes Found</h3>
                    <p className="text-gray-500 mt-2">We couldn't find any recipes for your criteria. Try another search or category!</p>
                </div>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {combinedRecipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
                    </div>
                    {internalRecipes.length > 0 && <Pagination page={page} pages={pages} onPageChange={handlePageChange} />}
                </>
            )}
        </div>
    );
};


export default Home;