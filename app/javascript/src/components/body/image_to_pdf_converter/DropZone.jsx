import React, { useRef } from 'react';

const Dropzone = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    onFileSelect(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onFileSelect(Array.from(e.dataTransfer.files));
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="w-full flex flex-col items-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
      id="dropZone"
      onDrop={handleDrop}
      onDragOver={preventDefaults}
      onClick={() => fileInputRef.current.click()}
    >
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      <span className="mt-2 text-base text-gray-600">Drag and drop images here or click to select</span>
      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Dropzone;