import React, { useState, useCallback, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Slider } from '../../ui/Slider';
import BodyComponent from '../bodyComponent';

const PdfCompressorComponent = () => {
  const [file, setFile] = useState(null);
  const [percentage, setPercentage] = useState([50]);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setOriginalSize((selectedFile.size / 1024).toFixed(2)); // Convert to KB
      setCompressedSize(null);
      setDownloadUrl(null);
    } else {
      alert('Please upload a PDF file');
      setFile(null);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const compressPdf = async (selectedPercentage) => {
    if (!file || isProcessing) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('percentage', selectedPercentage);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await fetch('/api/v1/pdfs/compress', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': csrfToken
        },
      });

      if (!response.ok) throw new Error('PDF compression failed');

      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      setCompressedSize((blob.size / 1024).toFixed(2));
    } catch (error) {
      console.error('PDF compression failed:', error);
      alert('PDF compression failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!file) return;

    const debounceTimeout = setTimeout(() => {
      compressPdf(percentage[0]);
    }, 500); // Debounce API calls to prevent overload

    return () => clearTimeout(debounceTimeout);
  }, [percentage, file]);

  return (
    <BodyComponent>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">PDF Compressor</h2>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg mb-2">
            Drag and drop your PDF here, or click to browse
          </p>
          <p className="text-sm text-gray-500">Only PDF files are supported</p>
        </div>

        {file && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">Selected file: {file.name}</p>
              <p className="text-sm text-gray-600">
                Original Size: {originalSize} KB
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Compression Level: {percentage[0]}%
              </label>
              <Slider
                value={percentage}
                onValueChange={setPercentage}
                min={1}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        )}

        {/* Show Loader While Processing */}
        {isProcessing && (
          <div className="flex items-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
            <p className="ml-2 text-sm text-blue-500">Compressing...</p>
          </div>
        )}

        {compressedSize && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Compressed Size: {compressedSize} KB
            </p>
            <p className="text-sm text-gray-600">
              Reduction:{' '}
              {(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}
              %
            </p>
            <a
              href={downloadUrl}
              download={`compressed_${percentage[0]}percent.pdf`}
              className="mt-4 inline-block w-full py-2 px-4 bg-green-500 text-white text-center rounded-lg hover:bg-green-600 transition-colors"
            >
              Download Compressed PDF
            </a>
          </div>
        )}
      </div>
    </BodyComponent>
  );
};

export default PdfCompressorComponent;
