import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import MyRecipes from './pages/MyRecipes';
import CreateRecipe from './pages/CreateRecipe';
import RecipeDetail from './pages/RecipeDetail';

function App() {
  // We create a state variable to track if the user is logged in.
  // We initialize it by checking if a token exists in localStorage.
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // This effect listens for manual changes to localStorage from other tabs,
  // though our app's logic will primarily use setIsAuthenticated.
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      {/* The Navbar now renders based on our state variable, ensuring it's always in sync. */}
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
      
      <main>
        <Routes>
          {/* If authenticated, the root path goes to Home. If not, it goes to Auth. */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <Auth setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
          />
          
          {/* All other content routes are now implicitly protected by the root redirect. */}
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
          <Route path="/recipe/:id" element={isAuthenticated ? <RecipeDetail /> : <Navigate to="/auth" />} />
          <Route path="/my-recipes" element={isAuthenticated ? <MyRecipes /> : <Navigate to="/auth" />} />
          <Route path="/create-recipe" element={isAuthenticated ? <CreateRecipe /> : <Navigate to="/auth" />} />
          <Route path="/edit-recipe/:id" element={isAuthenticated ? <CreateRecipe /> : <Navigate to="/auth" />} />

          {/* Fallback to redirect any unknown URL to the root path. */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;