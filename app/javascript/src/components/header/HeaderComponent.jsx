import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronUp } from 'lucide-react';

const HeaderComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);

  const navItems = {
    'File Converters': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Image to PDF', path: '/image-to-pdf' }
          ]
        }
      ]
    },
    'Signature Overlay': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Overlay Signature To Image', path: '/image-signature' }
          ]
        }
      ]
    },
    'File Compressor': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Image Compressor', path: '/image-compressor' }
          ]
        }
      ]
    },
    'Translator': {
      features: [
        { 
          name: 'Image', 
          path: '/image',
          subFeatures: [
            { name: 'Image Text Translator', path: '/image-text-translator' }
          ]
        }
      ]
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
    setActiveFeature(null);
  };

  const toggleFeature = (featureName) => {
    setActiveFeature(activeFeature === featureName ? null : featureName);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container') && window.innerWidth >= 768) {
        setActiveDropdown(null);
        setActiveFeature(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="text-2xl font-semibold">
            <span className="text-blue-500">Format-</span>
            Forge
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {Object.entries(navItems).map(([key, item]) => (
              <div key={key} className="relative dropdown-container">
                <button 
                  className={`px-4 py-2 text-gray-700 hover:text-blue-500 flex items-center gap-2
                    ${activeDropdown === key ? 'text-blue-500' : ''}`}
                  onClick={() => toggleDropdown(key)}
                >
                  {key}
                  {activeDropdown === key ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </button>
                {activeDropdown === key && (
                  <div className={`absolute ${key === 'Translator' ? 'right-0' : 'left-0'} top-full mt-2 w-64 bg-white rounded-md shadow-lg z-50`}>
                    <div className="py-2">
                      <div className="mt-1">
                        {item.features.map((feature) => (
                          <div key={feature.path}>
                            <button
                              onClick={() => toggleFeature(feature.name)}
                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 flex justify-between items-center"
                            >
                              {feature.name}
                              {feature.subFeatures && (
                                activeFeature === feature.name ? 
                                  <ChevronUp className="h-4 w-4" /> : 
                                  <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            {activeFeature === feature.name && feature.subFeatures && (
                              <div className="bg-gray-50">
                                {feature.subFeatures.map((subFeature) => (
                                  <a
                                    key={subFeature.path}
                                    href={subFeature.path}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleNavigation(subFeature.path);
                                      setActiveDropdown(null);
                                      setActiveFeature(null);
                                    }}
                                    className="block px-8 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-500"
                                  >
                                    {subFeature.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-500 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
        md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full overflow-y-auto">
          <div className="h-16 flex items-center px-4 border-b border-gray-100">
            <span className="text-lg font-semibold">Menu</span>
          </div>
          
          <div className="py-2">
            {Object.entries(navItems).map(([key, item]) => (
              <div key={key} className="border-b border-gray-100 last:border-b-0">
                <button
                  onClick={() => toggleDropdown(key)}
                  className="w-full px-4 py-3 flex items-center justify-between text-gray-700 hover:bg-gray-50"
                >
                  <span className="font-medium">{key}</span>
                  {activeDropdown === key ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </button>
                {activeDropdown === key && (
                  <div className="bg-gray-50">
                    {item.features.map((feature) => (
                      <div key={feature.path}>
                        <button
                          onClick={() => toggleFeature(feature.name)}
                          className="w-full px-6 py-2 text-sm text-gray-700 hover:text-blue-500 flex justify-between items-center"
                        >
                          {feature.name}
                          {feature.subFeatures && (
                            activeFeature === feature.name ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        {activeFeature === feature.name && feature.subFeatures && (
                          <div className="bg-gray-100">
                            {feature.subFeatures.map((subFeature) => (
                              <a
                                key={subFeature.path}
                                href={subFeature.path}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNavigation(subFeature.path);
                                  setIsMobileMenuOpen(false);
                                  setActiveDropdown(null);
                                  setActiveFeature(null);
                                }}
                                className="block px-8 py-2 text-sm text-gray-600 hover:text-blue-500"
                              >
                                {subFeature.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderComponent;