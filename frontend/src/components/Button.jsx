import React from 'react';

export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-medical-600 text-white hover:bg-medical-700 focus:ring-medical-500 shadow-md hover:shadow-lg",
        secondary: "bg-white text-medical-900 border border-medical-200 hover:bg-medical-50 focus:ring-medical-500",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md",
        ghost: "bg-transparent text-medical-600 hover:bg-medical-50"
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
