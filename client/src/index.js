import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Imports Tailwind CSS styles
import App from './App'; // Imports the main App component
import { FavoritesProvider } from './context/FavoritesContext';

// Creates a root for the React application to render into.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renders the App component inside React's StrictMode for development checks.
root.render(
  <React.StrictMode>
    <FavoritesProvider>
      <App />
    </FavoritesProvider>
  </React.StrictMode>
);