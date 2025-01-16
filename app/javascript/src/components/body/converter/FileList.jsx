import React from 'react';

const FileList = ({ files }) => {
  return (
    <div id="fileList" className="space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{file.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FileList;