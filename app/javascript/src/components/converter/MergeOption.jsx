import React from 'react';

const MergeOption = ({ onChange }) => {
  return (
    <div id="mergeOption" className="flex items-center justify-center space-x-4">
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="merge"
          value="false"
          className="form-radio text-blue-500"
          defaultChecked
          onChange={onChange}
        />
        <span className="ml-2">Separate PDFs</span>
      </label>
      <label className="inline-flex items-center">
        <input
          type="radio"
          name="merge"
          value="true"
          className="form-radio text-blue-500"
          onChange={onChange}
        />
        <span className="ml-2">Merge into single PDF</span>
      </label>
    </div>
  );
};

export default MergeOption;