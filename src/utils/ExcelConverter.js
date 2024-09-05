import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const exportToCSV = (apiData, fileName) => {
  // Calculate totals
  const totalFollowerCount = apiData.reduce((sum, data) => sum + parseInt(data.follower_count || 0), 0);
  const totalPostPerPage = apiData.reduce((sum, data) => sum + parseInt(data.postPerPage || 0), 0);
  const totalStoryPerPage = apiData.reduce((sum, data) => sum + parseInt(data.storyPerPage || 0), 0);
  const totalPages = apiData.length;

  // Map your data to the format you want in the Excel
  const formattedData = apiData.map((data,index)=> ({
    sno:index+1,
    PageName: data.page_name,
    link:data.page_link,
    Category: data.cat_name,
    Follower: data.follower_count,
    Post: data.postPerPage,
    Story: data.storyPerPage,
  }));

  // Append a row for totals at the end
  formattedData.push({
    PageName: 'Total',
    Category: '',
    Follower: totalFollowerCount,
    Post: totalPostPerPage,
    Story: totalStoryPerPage
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  
  // Buffer
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  FileSaver.saveAs(data, fileName + "_report.xlsx");
};

export default exportToCSV;



// export default WFHDExcelConverter
