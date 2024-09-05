import * as XLSX from "xlsx";

export default function DynamicExcelDownload(data, fileName) {
  const formattedData = data.map((row, index) => {
    const formattedRow = {};
    Object.keys(row).forEach((key) => {
      formattedRow[key] = row[key];
    });
    return formattedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, fileName);
}
