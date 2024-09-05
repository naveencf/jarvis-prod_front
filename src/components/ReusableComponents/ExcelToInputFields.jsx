import React, { useState } from "react";
import * as XLSX from "xlsx";

const App = () => {
  const [excelData, setExcelData] = useState({});
  const excludedFields = ["ID", "Notes"]; // Fields to be excluded

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      handleUpload(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleUpload = (data) => {
    const workbook = XLSX.read(data, { type: "binary" });
    const sheetNames = workbook.SheetNames;
    console.log("Sheet Names:", sheetNames);
    const dataFromAllSheets = {};

    sheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (jsonData.length > 1) {
        // Ensure there's more than just the header row
        const headers = jsonData[0];
        console.log(`Headers for ${sheetName}:`, headers);
        const rows = jsonData
          .slice(1)
          .map((row) => {
            const rowObject = {};
            headers.forEach((header, index) => {
              rowObject[header] = row[index];
            });
            return rowObject;
          })
          .filter((rowObject) => {
            // Filter out rows where all values are empty
            return Object.values(rowObject).some(
              (value) => value !== undefined && value !== null && value !== ""
            );
          });

        if (rows.length > 0) {
          dataFromAllSheets[sheetName] = { headers, rows };
        }
      }
    });

    setExcelData(dataFromAllSheets);
    console.log("Processed Data:", dataFromAllSheets);
  };

  return (
    <div>
      <h1>Excel Data</h1>
      <input type="file" onChange={handleFileUpload} />
      {Object.keys(excelData).map((sheetName) => (
        <div key={sheetName}>
          <h2>{sheetName}</h2>
          {excelData[sheetName].rows.map((row, rowIndex) => (
            <div key={rowIndex} style={{ marginBottom: "20px" }}>
              <div
                className="card"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                <div className="card-body">
                  {excelData[sheetName].headers.map((colName, colIndex) => {
                    if (!excludedFields.includes(colName)) {
                      return (
                        <div
                          key={colIndex}
                          className="form-group"
                          style={{ marginBottom: "10px" }}
                        >
                          <label>{colName}: </label>
                          <input
                            type="text"
                            value={row[colName] || ""}
                            className="form-control"
                            readOnly
                            style={{ marginLeft: "10px" }}
                          />
                        </div>
                      );
                    } else {
                      return null; // Exclude this field
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
