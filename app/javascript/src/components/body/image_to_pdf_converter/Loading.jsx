import React from 'react';

const Loading = () => {
  return (
    <div id="loading" className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">Converting...</span>
    </div>
  );
};

export default Loading;