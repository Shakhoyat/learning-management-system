import React from 'react';

const LoadingSpinner = ({ size = 'large' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-32 w-32'
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
        </div>
    );
};

export default LoadingSpinner;