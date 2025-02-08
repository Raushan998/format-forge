import React from 'react';
import { 
  FileText,
  Image,
  ScrollText,
  MinusSquare,
  Languages
} from 'lucide-react';

import { NavItemComponent } from '../utils/NavItemComponent';

const categoryInfo = {
  'File Converters': {
    icon: <FileText className="w-8 h-8" />,
    description: "Convert files between different formats easily",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    borderColor: "border-blue-200"
  },
  'Signature Overlay': {
    icon: <ScrollText className="w-8 h-8" />,
    description: "Add signatures to your documents",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
    borderColor: "border-purple-200"
  },
  'File Compressor': {
    icon: <MinusSquare className="w-8 h-8" />,
    description: "Reduce file sizes while maintaining quality",
    bgColor: "bg-green-50",
    iconColor: "text-green-500",
    borderColor: "border-green-200"
  },
  'Translator': {
    icon: <Languages className="w-8 h-8" />,
    description: "Translate text from images across languages",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500",
    borderColor: "border-orange-200"
  }
};

const HomeComponent = () => {
  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Document Processing Tools
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(NavItemComponent).map(([category, { features }]) => {
          const { icon, description, bgColor, iconColor, borderColor } = categoryInfo[category];
          
          return (
            <div key={category} className={`${bgColor} rounded-xl p-6 border ${borderColor}`}>
              {/* Category Header */}
              <div className="flex items-center mb-4">
                <div className={`${iconColor} p-2 rounded-lg ${bgColor}`}>
                  {icon}
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-800">{category}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{description}</p>
              
              {/* Features */}
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.path} className="bg-white rounded-lg p-4 border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2">{feature.name}</h3>
                    <div className="space-y-2">
                      {feature.subFeatures.map((subFeature) => (
                        <div 
                          key={subFeature.path}
                          onClick={(e)=> handleNavigation(subFeature.path)}
                          className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                        >
                          <Image className={`w-4 h-4 ${iconColor} mr-2`} />
                          <span className="text-sm text-gray-600">{subFeature.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          How to Use Our Tools
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select any tool from the categories above to begin processing your files. 
          Each tool is designed to be simple to use while providing professional results.
        </p>
      </div>
    </div>
  );
};

export default HomeComponent;