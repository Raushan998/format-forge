import React from "react";
export const Slider = ({ value, onValueChange, min, max, step, className = "" }) => {
    const handleChange = (e) => {
      onValueChange([parseInt(e.target.value)]);
    };
  
    return (
      <input
        type="range"
        value={value[0]}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className}`}
      />
    );
};