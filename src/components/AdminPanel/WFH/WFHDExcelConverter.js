import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const WFHDExcelConverter = (apiData, fileName) => {
  const formattedData = apiData.map((data, index) => ({
    sno: index + 1,
    UserName: data.user_name,
    EmployeeID: data.user_id,
    salary: data.salary,
    status: data.att_status,
    JobType: data.job_type,
    Email: data.user_email_id,
    Contact: data.user_contact_no,
    Address: data.permanent_address,
    City: data.permanent_city,
    State: data.permanent_state,
    PinCode: data.permanent_pin_code,
    PanNo: data.pan_no,
    BankName: data.bank_name,
    AccountNo: data.account_no,
    ifscCode: data.ifsc_code,
    Beneficiary: data.beneficiary,
  }));
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





export default WFHDExcelConverter