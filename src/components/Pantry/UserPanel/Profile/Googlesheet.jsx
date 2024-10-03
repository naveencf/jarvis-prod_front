import React, { useState } from 'react';
import axios from 'axios';

const GoogleSheetDownloader = () => {
  const [sheetUrl, setSheetUrl] = useState('');

  const handleInputChange = (e) => {
    setSheetUrl(e.target.value);
  };

  const downloadSheet = async () => {
    try {
      // Extract the sheet ID from the Google Sheet URL
      const sheetId = sheetUrl.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (!sheetId) {
        alert('Please enter a valid Google Sheets URL');
        return;
      }

      // Google Sheets API URL for exporting the sheet as CSV
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      // Fetch the CSV file data
      const response = await axios.get(csvUrl);

      // Create a Blob from the CSV data
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'google_sheet.csv';
      document.body.appendChild(link);
      link.click();

      // Clean up after the download
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading the sheet:', error);
      alert('Failed to download the Google Sheet. Please make sure the URL is correct.');
    }
  };

  return (
    <div>
      <h2>Google Sheet Downloader</h2>
      <input
        type="text"
        value={sheetUrl}
        onChange={handleInputChange}
        placeholder="Enter Google Sheet URL"
        style={{ width: '300px', padding: '8px' }}
      />
      <button onClick={downloadSheet} style={{ marginLeft: '10px', padding: '8px' }}>
        Download Sheet
      </button>
    </div>
  );
};

export default GoogleSheetDownloader;
