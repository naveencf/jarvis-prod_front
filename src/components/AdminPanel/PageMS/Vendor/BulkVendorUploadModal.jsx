import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Select from "react-select";
import { useGetAllVendorQuery } from "../../../Store/reduxBaseURL";
import UploadBulkVendorPages from "./BulkVendor/UploadBulkVendorPages";
import { useGetAllPageCategoryQuery } from "../../../Store/PageBaseURL";
import jwtDecode from "jwt-decode";
import { FormatName } from "../../../../utils/FormatName";

export default function BulkVendorUploadModal({ open, onClose, rowData }) {
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const token = sessionStorage.getItem('token');
  const [vendorName, setVendorName] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  console.log(categoryName,"<--------");
  const {
    data: vendorData,
   
  } = useGetAllVendorQuery();
  const { data: category } = useGetAllPageCategoryQuery({decodedToken,token});
  const categoryData = category?.data || [];
  console.log(categoryData,'uuuuu');

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md" PaperProps={{
      style: {
        height: '550px',
        maxHeight: '80vh',
      },
    }}>
      <DialogTitle>{"Upload Bulk Vendor "}</DialogTitle>
      {vendorData && <DialogContent>
        <div className="form-group col-12">
          <label className="form-label">
            Vendor Name <sup className="form-error">*</sup>
          </label>
          <Select
            className=""
            options={vendorData.map((option) => ({
              value: option._id,
              label: `${option.vendor_name}`,
            }))}
            value={{
              value: vendorName,
              label:
                vendorData.find(
                  (d) => d._id === vendorName
                )?.vendor_name || "",
            }}
            onChange={(e) => {
              setVendorName(e.value);
            }}
            required
          />
        </div>
        <div className="form-group col-12">
          <label className="form-label">
            Category Name <sup className="form-error">*</sup>
          </label>
          <Select
            className=""
            options={categoryData.map((option) => ({
              value: option._id,
              label: `${FormatName(option.page_category)}`,
            }))}
        
            onChange={(e) => {
              setCategoryName(e);
            }}
            required
          />
        </div>
      </DialogContent>}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <UploadBulkVendorPages getRowData={vendorName} category={categoryName?.value} onClose={onClose} from={"pages"} />
      </DialogActions>
    </Dialog>
  );
}
