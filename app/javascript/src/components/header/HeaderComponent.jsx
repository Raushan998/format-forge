import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronUp } from 'lucide-react';

const HeaderComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = {
    'File Converters': {
      name: 'Image',
      features: [
        { name: 'Image to PDF', path: '/image-to-pdf' }
      ]
    },
    'Signature Overlay': {
      features: [
        { name: 'Overlay Signature To Image', path: '/image-signature' }
      ]
    },
    'File Compressor': {
      features: [
        { name: 'Image Compressor', path: '/image-compressor' }
      ]
    },
    'Translator': {
      features: [
        { name: 'Image Text Translator', path: '/image-text-translator'}
      ]
    }
  };

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  const toggleDropdown = (key) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  // Close dropdown when clicking outside - only for desktop
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container') && window.innerWidth >= 768) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="text-2xl font-semibold">
            <span className="text-blue-500">Format-</span>
            Forge
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {Object.entries(navItems).map(([key, item]) => (
              <div key={key} className="relative dropdown-container">
                <button 
                  className={`px-3 py-2 text-gray-700 hover:text-blue-500 flex items-center gap-1
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
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="p-2">
                      <p className="px-4 py-2 text-sm font-semibold text-gray-700">
                        {item.name}
                      </p>
                      {item.features.map((feature) => (
                        <a
                          key={feature.path}
                          href={feature.path}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigation(feature.path);
                            setActiveDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500 rounded-md"
                        >
                          {feature.name}
                        </a>
                      ))}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {Object.entries(navItems).map(([key, item]) => (
              <div key={key} className="px-4 py-2">
                <button
                  onClick={() => toggleDropdown(key)}
                  className="w-full text-left font-semibold text-gray-700 mb-2 flex items-center justify-between"
                >
                  {key}
                  {activeDropdown === key ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                </button>
                {activeDropdown === key && (
                  <div className="ml-4 space-y-2 mt-2 bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-600">{item.name}</p>
                    {item.features.map((feature) => (
                      <a
                        key={feature.path}
                        href={feature.path}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(feature.path);
                          setIsMobileMenuOpen(false);
                          setActiveDropdown(null);
                        }}
                        className="block py-2 text-sm text-gray-700 hover:text-blue-500"
                      >
                        {feature.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default HeaderComponent;