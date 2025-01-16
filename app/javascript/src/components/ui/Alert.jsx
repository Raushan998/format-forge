import React from "react";

export const Alert = ({ children, variant = "default", className = "" }) => {
    const variants = {
      default: "bg-blue-50 text-blue-800",
      destructive: "bg-red-50 text-red-800"
    };
    
    return (
      <div className={`p-4 rounded-md ${variants[variant]} ${className}`}>
        {children}
      </div>
    );
};

export const AlertDescription = ({ children, className = "" }) => (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
);