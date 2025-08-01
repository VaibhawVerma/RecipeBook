import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

// Accepts setIsAuthenticated as a prop from Auth.js
const Register = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    // A simple email validation function
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const onSubmit = async e => {
        e.preventDefault();
        
        if (!validateEmail(formData.email)) {
            return setError('Please enter a valid email address.');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }

        try {
            const res = await axios.post('/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            // This is the key: we call the function from App.js to update the state.
            setIsAuthenticated(true);
            showToast('Welcome! Your account has been created.');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        }
    };

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center" role="alert">{error}</div>}
            
            <div className="space-y-4">
                <input name="name" type="text" value={formData.name} onChange={onChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your Name" />
                <input name="email" type="email" value={formData.email} onChange={onChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
                <input name="password" type="password" value={formData.password} onChange={onChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password (min. 6 characters)" />
            </div>
            
            <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105">
                    Create Account
                </button>
            </div>
        </form>
    );
};

export default Register;