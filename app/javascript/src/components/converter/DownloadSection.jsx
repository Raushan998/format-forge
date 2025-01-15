import React from 'react';

const base64ToBlob = (base64, type = 'application/pdf') => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type });
};

const DownloadSection = ({ pdfs }) => {
  return (
    <div id="downloadSection" className="mt-6">
      {pdfs.length > 0 && (
        <>
          <div className="text-green-500 flex items-center mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>Conversion complete!</span>
          </div>
          <div id="pdfList" className="w-full space-y-2">
            {pdfs.map((pdf, index) => {
              const blob = base64ToBlob(pdf.data);
              const url = window.URL.createObjectURL(blob);

              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{pdf.filename}</span>
                  <a
                    href={url}
                    download={pdf.filename}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadSection;