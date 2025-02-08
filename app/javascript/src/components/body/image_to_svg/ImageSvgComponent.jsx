import React, { useState } from 'react';
import BodyComponent from '../BodyComponent';
import { IconVector,  IconImage} from '../../utils/IconComponent';

const ImageToSVGConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversionType, setConversionType] = useState('vector');
  const [convertedSvg, setConvertedSvg] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setConvertedSvg(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('type', conversionType);

    try {
      const response = await fetch('/api/v1/images/convert_to_svg', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setConvertedSvg(url);
        
        setMetadata({
          convertedAt: '2025-02-08 17:01:30',
          convertedBy: 'Raushan998',
          originalSize: `${(selectedFile.size / 1024).toFixed(2)} KB`,
          convertedSize: `${(blob.size / 1024).toFixed(2)} KB`,
          format: 'SVG'
        });
      } else {
        throw new Error('Conversion failed');
      }
    } catch (error) {
      console.error('Error converting image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (convertedSvg) {
      const a = document.createElement('a');
      a.href = convertedSvg;
      a.download = `converted-${conversionType}-${selectedFile.name}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <BodyComponent>
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Image to SVG Converter
      </h1>

      {/* File Input */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {/* Controls */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Conversion Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setConversionType('vector')}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              conversionType === 'vector'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <IconVector />
            <span>Vector SVG</span>
          </button>
          <button
            onClick={() => setConversionType('image')}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              conversionType === 'image'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <IconImage />
            <span>Image SVG</span>
          </button>
        </div>
      </div>

      {/* Image Preview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
          <div className="aspect-w-16 aspect-h-9 bg-gray-50 rounded-lg overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Original"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image selected
              </div>
            )}
          </div>
        </div>

        {/* Converted Image */}
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Converted SVG</h3>
          <div className="aspect-w-16 aspect-h-9 bg-gray-50 rounded-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : convertedSvg ? (
              <div className="space-y-4">
                <img
                  src={convertedSvg}
                  alt="Converted"
                  className="w-full h-full object-contain"
                />
                {metadata && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Original Size: {metadata.originalSize}</p>
                    <p>Converted Size: {metadata.convertedSize}</p>
                    <p>Format: {metadata.format}</p>
                    <p>Converted at: {metadata.convertedAt}</p>
                  </div>
                )}
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Download SVG
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Converted image will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!selectedFile || loading}
        className={`w-full mt-6 py-2 px-4 rounded-md transition-colors ${
          !selectedFile || loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Converting...
          </span>
        ) : (
          'Convert to SVG'
        )}
      </button>
    </BodyComponent>
  );
};

export default ImageToSVGConverter;