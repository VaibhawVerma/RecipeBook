import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ setIsAuthenticated }) => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false); // State for mobile menu

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('/api/auth/user', { headers: { 'x-auth-token': token } });
                    setUser(res.data);
                } catch (err) { onLogout(); }
            }
        };
        fetchUser();
    }, []);

    const onLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('appAuthChange'));
    };

    const activeLinkStyle = { color: '#4f46e5', fontWeight: '600' };

    const navLinks = (
        <>
            <NavLink to="/home" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition-colors block py-2 md:py-0">Discover</NavLink>
            <NavLink to="/my-recipes" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition-colors block py-2 md:py-0">My Recipes</NavLink>
            <NavLink to="/my-favorites" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="text-gray-600 hover:text-indigo-600 transition-colors block py-2 md:py-0">My Favorites</NavLink>
        </>
    );

    return (
        <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-gray-900">RecipeBook</Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">{navLinks}</nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/create-recipe" className="hidden sm:inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-px">+ Add Recipe</Link>
                        {user && <span className="hidden lg:inline font-medium text-gray-700">Hi, {user.name}!</span>}
                        <button onClick={onLogout} title="Logout" className="hidden md:inline-block text-gray-500 hover:text-red-600 transition-colors"><svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
                        
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-indigo-600">
                                <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 border-t">
                    {navLinks}
                    <button onClick={onLogout} className="w-full text-left text-red-600 py-2">Logout</button>
                </div>
            )}
        </header>
    );
};

export default Navbar;