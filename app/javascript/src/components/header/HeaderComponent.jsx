import React, { useState } from 'react';
import { ChevronDown, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const tools = {
    'File Converters': [
      { name: 'Image to PDF', path: '/image-to-pdf' }
    ],
    'SignatureOverlay': [
      { name: 'Overlay Signature To Image', path: '/image-signature' }
    ],
    'ImageCompressor': [
      {name: 'Image Compressor', path: '/image-compressor'}
    ]
  };

  const handleToolClick = (path) => {
    navigate(path);
    setIsToolsOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getAllTools = () => {
    const allTools = [];
    Object.entries(tools).forEach(([category, items]) => {
      items.forEach(tool => {
        allTools.push({ category, ...tool });
      });
    });
    return allTools;
  };

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center">
            <Link to="/" className="text-2xl font-semibold">
              <span className="text-blue-500">Format-</span>
              Forge
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-500"
              >
                <span>Tools</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isToolsOpen && (
                <div className="absolute left-0 mt-2 bg-white rounded-md shadow-lg z-50 w-[90vw] sm:w-[600px]">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row">
                      {chunkArray(getAllTools(), 10).map((chunk, columnIndex) => (
                        <div key={columnIndex} className="flex-1 min-w-[150px] sm:min-w-[200px]">
                          {chunk.map((tool, index) => (
                            <div key={index}>
                              {(index === 0 || chunk[index - 1]?.category !== tool.category) && (
                                <div className="text-sm font-semibold text-gray-700 py-2">
                                  {tool.category}
                                </div>
                              )}
                              <p 
                                key={tool.name}
                                onClick={() => handleToolClick(tool.path)}
                                className="block py-1 text-sm text-gray-700 hover:text-blue-500 cursor-pointer"
                              >
                                {tool.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <Link to="/login" className="text-gray-700 hover:text-blue-500">
              Log In
            </Link>
            <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Sign Up
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(tools).map(([category, items]) => (
                <div key={category} className="px-2">
                  <div className="text-sm font-semibold text-gray-700 py-2">
                    {category}
                  </div>
                  {items.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-1 text-sm text-gray-700 hover:text-blue-500"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HeaderComponent;