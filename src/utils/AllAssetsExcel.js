import * as XLSX from "xlsx";

export default function AllAssetsExcel(fillterData) {
  console.log(fillterData, "excel data");
  const formattedData = fillterData?.map((row, index) => ({
    "S.No": index + 1,
    "Asset Name": row.assetsName,
    "Asset ID": row.asset_id,
    "Asset Type": row.asset_type,
    "Allocated To": row.allocated_username,
    Category: row.category_name,
    "Sub Category": row.sub_category_name,
    Value: row.assetsValue,
    Status: row.status,
    "Invoice URL": row.invoiceCopy_url,
  }));

  const fileName = "Assets.xlsx";
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, fileName);
}
