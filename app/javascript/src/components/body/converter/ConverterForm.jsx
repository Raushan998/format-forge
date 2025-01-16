import React, { useState, useEffect } from 'react';
import Dropzone from './DropZone';
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
    <div className="container mx-auto px-4 mt-32">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Image to PDF Converter
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Dropzone onFileSelect={handleFileSelect} />
            <FileList files={files} />
            {files.length > 1 && <MergeOption merge={merge} onChange={handleMergeChange} />}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={files.length === 0 || loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Convert to PDF
            </button>
          </form>
          {loading && <Loading />}
          {pdfs.length > 0 && <DownloadSection pdfs={pdfs} />}
        </div>
      </div>
    </div>
  );
};

export default ConverterForm;