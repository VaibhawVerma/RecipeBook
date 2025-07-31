import React, { useState } from 'react';

const StarRating = ({ rating = 0, onRate, disabled = false }) => {
    const [hover, setHover] = useState(0); // New state to track hover
    const stars = [1, 2, 3, 4, 5];

    return (
        <div 
            className="flex items-center space-x-1"
            // Reset hover state when the mouse leaves the container
            onMouseLeave={() => !disabled && setHover(0)}
        >
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !disabled && onRate(star)}
                    disabled={disabled}
                    // Set the hover state when the mouse enters a star
                    onMouseEnter={() => !disabled && setHover(star)}
                    className={`text-2xl transition-transform duration-200 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer transform hover:scale-125'}`}
                    aria-label={`Rate ${star} stars`}
                >
                    <svg
                        className={`w-6 h-6 transition-colors`}
                        // The star's color is now determined by the hover state OR the actual rating
                        style={{ color: star <= (hover || rating) ? '#FBBF24' : '#D1D5DB' }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

export default StarRating;