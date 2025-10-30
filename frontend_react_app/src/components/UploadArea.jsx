import React, { useRef } from 'react';
import Papa from 'papaparse';

/**
 * UploadArea
 * Accepts a .csv file, parses it using PapaParse and sends text to parent.
 *
 * Props:
 * - onCsvParsed: function(file: File, csvText: string) -> void
 */
// PUBLIC_INTERFACE
export default function UploadArea({ onCsvParsed }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      // We pass raw CSV text to keep schema parsing in utils
      if (onCsvParsed) onCsvParsed(file, text);
    };
    reader.readAsText(file);
  };

  const openFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div className="upload-area">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="visually-hidden"
        aria-label="Upload CSV file"
      />
      <button className="btn btn-primary" onClick={openFileDialog}>
        Select CSV File
      </button>
      <p className="hint">Accepted format: .csv</p>
    </div>
  );
}
