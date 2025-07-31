import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

// Accepts setIsAuthenticated to handle logout
const Navbar = ({ setIsAuthenticated }) => {
    const [user, setUser] = useState(null);
    useEffect(() => { const fetchUser = async () => { const token = localStorage.getItem('token'); if (token) { try { const res = await axios.get('/api/auth/user', { headers: { 'x-auth-token': token } }); setUser(res.data); } catch (err) { onLogout(); } } }; fetchUser(); }, []);
    
    const onLogout = () => { 
        localStorage.removeItem('token'); 
        setIsAuthenticated(false); 
        window.dispatchEvent(new Event('appAuthChange')); 
    };
    
    const activeLinkStyle = { color: '#4f46e5', fontWeight: '600' };

    return (
        <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-gray-900">RecipeBook</Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink to="/home" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition-colors">Discover</NavLink>
                        <NavLink to="/my-recipes" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition-colors">My Recipes</NavLink>
                        <NavLink to="/my-favorites" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition-colors">My Favorites</NavLink>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link to="/create-recipe" className="hidden sm:inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-px">+ Add Recipe</Link>
                        {user && <span className="hidden lg:inline font-medium text-gray-700">Hi, {user.name}!</span>}
                        <button onClick={onLogout} title="Logout" className="text-gray-500 hover:text-red-600 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;