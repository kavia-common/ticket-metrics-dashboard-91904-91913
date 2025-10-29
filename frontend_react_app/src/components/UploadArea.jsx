import React, { useRef } from 'react';

/**
 * UploadArea
 * Renders a file input for Excel files and lifts the selected file to parent via props.
 *
 * Props:
 * - onFileSelected: function(File | null) -> void
 */
// PUBLIC_INTERFACE
export default function UploadArea({ onFileSelected }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (onFileSelected) onFileSelected(file);
  };

  const openFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="upload-area">
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="visually-hidden"
        aria-label="Upload Excel file"
      />
      <button className="btn btn-primary" onClick={openFileDialog}>
        Select Excel File
      </button>
      <p className="hint">Accepted formats: .xlsx, .xls</p>
    </div>
  );
}
