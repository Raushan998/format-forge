import React from "react";
export const Button = ({ children, onClick, variant = "default", className = "", disabled = false }) => {
    const baseStyles = "px-4 py-2 rounded-md transition-colors";
    const variants = {
      default: "bg-blue-500 text-white hover:bg-blue-600",
      outline: "border border-gray-300 hover:bg-gray-50"
    };
    
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {children}
      </button>
    );
};