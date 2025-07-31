import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 
import App from './App'; 
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';

// Creates a root for the React application to render into.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renders the App component inside React's StrictMode for development checks.
root.render(
  <React.StrictMode>
    <ToastProvider> {/* Wrap everything */}
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </ToastProvider>
  </React.StrictMode>
);