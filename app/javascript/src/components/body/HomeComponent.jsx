// src/components/HomeComponent.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeComponent = () => {
  const navigate = useNavigate();

  const handleGetStarted = ()=> {
    navigate('/image-to-pdf')
  }
  return (
    <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="stars"></div>

      <div className="relative z-10 text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our App!</h1>
        <p className="mb-8">Get ready to explore the stars and enjoy our dark theme experience.</p>
        <button onClick={handleGetStarted} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HomeComponent;