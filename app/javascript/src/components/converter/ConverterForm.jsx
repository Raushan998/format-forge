import React, { useState, useEffect } from 'react';
import Dropzone from './Dropzone';
import FileList from './FileList';
import MergeOption from './MergeOption';
import Loading from './Loading';
import DownloadSection from './DownloadSection';

const ConverterForm = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [merge, setMerge] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Fetch the CSRF token from the meta tag
    const token = document.querySelector('meta[name="csrf-token"]').content;
    setCsrfToken(token);
  }, []);

  const handleFileSelect = (selectedFiles) => {
    setFiles(selectedFiles);
    setError('');
  };

  const handleMergeChange = (e) => {
    setMerge(e.target.value === 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPdfs([]);
    setError('');

    const formData = new FormData();
    files.forEach((file) => formData.append('images[]', file));
    formData.append('merge', merge);

    try {
      const response = await fetch('/convert', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Accept': 'application/json',
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPdfs(data.pdfs);
    } catch (err) {
      setError('An error occurred during conversion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">Image to PDF Converter</h1>
          <form onSubmit={handleSubmit} className="space-y-6" id="convertForm">
            <div className="space-y-4">
              <Dropzone onFileSelect={handleFileSelect} />
              <FileList files={files} />
              {files.length > 1 && <MergeOption onChange={handleMergeChange} />}
              {error && <div className="text-red-500 text-center">{error}</div>}
            </div>
            <div id="convertButtonSection">
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                disabled={files.length === 0 || loading}
              >
                Convert to PDF
              </button>
            </div>
          </form>
          {loading && <Loading />}
          {pdfs.length > 0 && <DownloadSection pdfs={pdfs} />}
        </div>
      </div>
    </div>
  );
};

export default ConverterForm;