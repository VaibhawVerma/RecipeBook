import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

// Accepts setIsAuthenticated as a prop from Auth.js
const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { showToast } = useToast();

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);
            showToast('Logged in successfully!');
        } catch (err) {
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <form className="space-y-6" onSubmit={onSubmit}>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center" role="alert">{error}</div>}
            
            <div className="space-y-4">
                <input name="email" type="email" value={formData.email} onChange={onChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
                <input name="password" type="password" value={formData.password} onChange={onChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" />
            </div>

            <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105">
                    Sign In
                </button>
            </div>
        </form>
    );
};

export default Login;