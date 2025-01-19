import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from "../../ui/Slider";

const ImageCompressorComponent = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [quality, setQuality] = useState(95);
  const [resizePercentage, setResizePercentage] = useState(95);
  const [format, setFormat] = useState("png");
  const [compressedImageUrl, setCompressedImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageStats, setImageStats] = useState(null);

  // Function to compress image
  const compressImage = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image[file]", file);
    formData.append("image[options][quality]", quality.toString());
    formData.append("image[options][resize_percentage]", resizePercentage.toString());
    formData.append("image[options][format]", format);

    try {
      const response = await fetch('/api/v1/images/image_compressor', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const { data } = await response.json();
        // Create base64 image URL
        const base64ImageUrl = `data:${data.content_type};base64,${data.image_data}`;
        setCompressedImageUrl(base64ImageUrl);
        
        // Set image statistics
        setImageStats({
          originalSize: data.original_size,
          compressedSize: data.compressed_size,
          dimensions: data.dimensions,
          format: data.format,
          quality: data.quality
        });
      } else {
        console.error("Error compressing image");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [file, quality, resizePercentage, format]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setCompressedImageUrl(null);
      setImageStats(null);
    }
  };

  // Function to handle image download
  const handleDownload = () => {
    if (compressedImageUrl) {
      const link = document.createElement('a');
      link.href = compressedImageUrl;
      link.download = `compressed_${file.name.split('.')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Trigger compression when parameters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (file) {
        compressImage();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [quality, resizePercentage, format, file, compressImage]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Image Compressor</h1>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Quality Slider */}
          <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                Quality: {quality}%
                </label>
                <Slider
                value={[quality]}
                onValueChange={(value) => setQuality(value[0])}
                min={1}
                max={100}
                step={1}
                className="w-full"
                />
           </div>

            {/* Resize Percentage Slider */}
          <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                Resize: {resizePercentage}%
                </label>
                <Slider
                value={[resizePercentage]}
                onValueChange={(value) => setResizePercentage(value[0])}
                min={1}
                max={100}
                step={1}
                className="w-full"
                />
          </div>

          {/* Format Selection */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WEBP</option>
            </select>
          </div>
        </div>

        {/* Image Preview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Original Image</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-50 rounded-lg overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
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

          {/* Compressed Image */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Compressed Image</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-50 rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
              ) : compressedImageUrl ? (
                <div className="space-y-4">
                  <img
                    src={compressedImageUrl}
                    alt="Compressed"
                    className="w-full h-full object-contain"
                  />
                  {imageStats && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Dimensions: {imageStats.dimensions}</p>
                      <p>Original Size: {imageStats.originalSize}</p>
                      <p>Compressed Size: {imageStats.compressedSize}</p>
                      <p>Format: {imageStats.format}</p>
                      <p>Quality: {imageStats.quality}%</p>
                    </div>
                  )}
                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Download Compressed Image
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Compressed image will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCompressorComponent;