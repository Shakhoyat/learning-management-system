import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
    const sizeClasses = {
        small: 'w-4 h-4',
        medium: 'w-8 h-8',
        large: 'w-12 h-12',
    };

    return (
        <div className="loading-container">
            <div className={`loading-spinner ${sizeClasses[size]}`}></div>
            {message && <p className="loading-message">{message}</p>}

            <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .loading-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        .w-4 { width: 1rem; height: 1rem; }
        .w-8 { width: 2rem; height: 2rem; }
        .w-12 { width: 3rem; height: 3rem; }
        
        .loading-message {
          margin-top: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default LoadingSpinner;