import React from 'react';

const RecipeCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
            <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="space-y-2 flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default RecipeCardSkeleton;