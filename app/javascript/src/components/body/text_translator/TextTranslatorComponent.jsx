import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Upload, Download, Search, ChevronDown, XCircle } from 'lucide-react';

const TextTranslatorComponent = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [outputLanguages, setOutputLanguages] = useState([]);
  const [targetLang, setTargetLang] = useState('');
  const [loading, setLoading] = useState(false);
  const [translatedFile, setTranslatedFile] = useState(null);
  const [isTargetOpen, setIsTargetOpen] = useState(false);
  const [error, setError] = useState(null);
  const targetRef = useRef(null);

  useEffect(() => {
    fetchLanguages('output', setOutputLanguages);
  }, []);

  const fetchLanguages = async (type, setLanguages) => {
    try {
      const response = await fetch(`/api/v1/language_list?lang=${type}`);
      const data = await response.json();
      setLanguages(Object.entries(data.language_list));
    } catch (error) {
      console.error(`Error fetching ${type} languages:`, error);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !targetLang) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image[file]', file);
    formData.append('image[options][target_lang]', targetLang);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      const response = await fetch('/api/v1/images/image_translator', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });
      if (!response.ok) {
        throw new Error('Failed to translate image');
      }
      const result = await response.blob();
      setTranslatedFile(URL.createObjectURL(result));
    } catch (error) {
      setError(error.message);
      console.error('Error translating file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOutside = (event) => {
    if (targetRef.current && !targetRef.current.contains(event.target)) {
      setIsTargetOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const Select = forwardRef(({ options, value, onChange, placeholder, isOpen, setIsOpen }, ref) => {
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter(([name]) => name.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          <span>{value ? options.find(([name, code]) => code === value)[0] : placeholder}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg">
            <div className="sticky top-0 px-2 py-2 bg-white">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 w-full border px-2 py-1 rounded-md"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {filteredOptions.map(([name, code]) => (
                <button
                  key={code}
                  type="button"
                  className="select-item flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm hover:bg-slate-100"
                  onClick={() => {
                    onChange(code);
                    setIsOpen(false);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mt-6 relative">
        <h1 className="text-2xl font-bold mb-4">Document Translator</h1>
        
        {error && (
          <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span>Upload Image</span>
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 max-w-full h-40 object-contain"
              />
            )}
          </div>

          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              options={outputLanguages}
              value={targetLang}
              onChange={setTargetLang}
              placeholder="Target Language"
              isOpen={isTargetOpen}
              setIsOpen={setIsTargetOpen}
              ref={targetRef}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!file || !targetLang || loading}
            className="w-full h-10 bg-blue-500 text-white rounded-md flex items-center justify-center hover:bg-blue-600"
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Translation Preview</h2>
          {translatedFile ? (
            <iframe
              src={translatedFile}
              className="w-full h-96 border rounded-md"
              title="Translated document preview"
            ></iframe>
          ) : (
            <div className="w-full h-96 border rounded-md flex items-center justify-center text-gray-500">
              <span>Translation preview will appear here</span>
            </div>
          )}
          <div className="mt-4 flex justify-end space-x-2">
            {translatedFile && (
              <a
                href={translatedFile}
                download
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextTranslatorComponent;