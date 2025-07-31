import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import MyRecipes from './pages/MyRecipes';
import MyFavorites from './pages/MyFavorites';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';
import UserProfile from './pages/UserProfile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  useEffect(() => {
    const syncAuthFromStorage = () => {
        setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', syncAuthFromStorage);
    return () => window.removeEventListener('storage', syncAuthFromStorage);
  }, []);

  useEffect(() => {
    window.dispatchEvent(new Event('appAuthChange'));
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      <main>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!isAuthenticated ? <Auth setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/recipe/:id" element={isAuthenticated ? <RecipeDetail /> : <Navigate to="/auth" />} />
          <Route path="/my-recipes" element={isAuthenticated ? <MyRecipes /> : <Navigate to="/auth" />} />
          <Route path="/my-favorites" element={isAuthenticated ? <MyFavorites /> : <Navigate to="/auth" />} />
          <Route path="/create-recipe" element={isAuthenticated ? <CreateRecipe /> : <Navigate to="/auth" />} />
          <Route path="/edit-recipe/:id" element={isAuthenticated ? <CreateRecipe /> : <Navigate to="/auth" />} />
          <Route path="/profile/:userId" element={isAuthenticated ? <UserProfile /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;