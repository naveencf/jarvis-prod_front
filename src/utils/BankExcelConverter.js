import * as XLSX from "xlsx";

export default function BankExcelConverter(BankData) {
  const formattedData = BankData?.map((row, index) => ({
    "S.No": index + 1,
    "Beneficiary Name (Mandatory) Special characters not supported":
      row.user_name,
    "Beneficiary's Account Number (Mandatory) Typically 9-18 digits":
      row.account_no,
    "IFSC Code (Mandatory) 11 digit code of the beneficiary’s bank account. Eg. HDFC0004277":
      row.ifsc_code,
    "Payout Amount (Mandatory) Amount should be in rupees": row.toPay,
    "Phone Number (Optional)": row.user_contact_no,
    "Email ID (Optional)": row.user_email_id,
    "Contact Reference ID (Optional) Eg: Employee ID or Customer ID":
      row?.emp_id,
      "Attandance ID": row?.attendence_id,
      "utr":""
  }));

  const fileName = "BankExcel.xlsx";
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, fileName);
}
