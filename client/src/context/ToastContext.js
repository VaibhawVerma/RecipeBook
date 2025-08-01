import React, { useState, useCallback, useContext, createContext, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
};

// component that will render the actual toast pop-up.
const Toast = ({ message, type, onDismiss }) => {
    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 5000); // Auto-dismiss after 5 seconds
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white py-3 px-5 rounded-lg shadow-xl animate-fade-in-up`}>
            {message}
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const dismissToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}
        </ToastContext.Provider>
    );
};