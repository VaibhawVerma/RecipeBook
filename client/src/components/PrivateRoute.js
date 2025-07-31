import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    // If there's a token, render the children components (the protected page)
    // Otherwise, redirect the user to the login page
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;