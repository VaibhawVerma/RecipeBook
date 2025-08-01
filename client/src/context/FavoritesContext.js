import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useToast } from './ToastContext';

const FavoritesContext = React.createContext();

export const useFavorites = () => {
    return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const { showToast } = useToast();

    useEffect(() => {
        const fetchFavorites = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data: user } = await axios.get('/api/auth/user', { headers: { 'x-auth-token': token } });
                    setFavoriteIds(new Set(user.favorites || []));
                } catch (err) {
                    console.error("Failed to fetch user favorites on load", err);
                    if (err.response && err.response.status === 401) {
                        localStorage.removeItem('token');
                        window.dispatchEvent(new Event('appAuthChange'));
                    }
                }
            } else {
                setFavoriteIds(new Set());
            }
        };

        fetchFavorites();
        window.addEventListener('appAuthChange', fetchFavorites);
        return () => window.removeEventListener('appAuthChange', fetchFavorites);
    }, []);

    const toggleFavorite = async (recipeId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const originalFavorites = new Set(favoriteIds);
        const newFavoriteIds = new Set(favoriteIds);
        const isCurrentlyFavorited = newFavoriteIds.has(recipeId);

        try {
            if (isCurrentlyFavorited) {
                newFavoriteIds.delete(recipeId);
            } else {
                newFavoriteIds.add(recipeId);
            }
            setFavoriteIds(newFavoriteIds);

            const config = { headers: { 'x-auth-token': token } };
            await axios.put(`/api/users/favorites/${recipeId}`, {}, config);

            showToast(isCurrentlyFavorited ? 'Removed from favorites' : 'Added to favorites!');

        } catch (err) {
            console.error("Failed to toggle favorite", err);
            setFavoriteIds(originalFavorites); // Revert UI on error
            showToast('Could not update favorites', 'error');
        }
    };

    const value = {
        favoriteIds,
        toggleFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};