import React from "react";
export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
);
export const CardContent = ({ children, className = "" }) => (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
);
export const CardHeader = ({ children, className = "" }) => (
    <div className={`p-4 border-b ${className}`}>
      {children}
    </div>
);
export const CardTitle = ({ children, className = "" }) => (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
);
  