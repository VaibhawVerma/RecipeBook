import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

// This component now receives setIsAuthenticated to pass down to its children.
const Auth = ({ setIsAuthenticated }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Welcome to RecipeBook
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        {isLoginView ? 'Sign in to discover and share recipes.' : 'Create an account to get started.'}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    {/* We pass the setIsAuthenticated function to both Login and Register */}
                    {isLoginView 
                        ? <Login setIsAuthenticated={setIsAuthenticated} /> 
                        : <Register setIsAuthenticated={setIsAuthenticated} />
                    }
                    
                    <div className="mt-6 text-sm text-center">
                        <button
                            onClick={() => setIsLoginView(!isLoginView)}
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300"
                        >
                            {isLoginView ? "Don't have an account? Register" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;