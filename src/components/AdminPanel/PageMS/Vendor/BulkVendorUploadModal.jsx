import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import Select from "react-select";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { useGlobalContext } from "../../../../Context/Context";
import { useGetAllVendorQuery } from "../../../Store/reduxBaseURL";
import UploadBulkVendorPages from "./BulkVendor/UploadBulkVendorPages";

export default function BulkVendorUploadModal({ open, onClose, rowData }) {
  const [vendorName , setVendorName] = useState([]);
  const {
    data: vendorData,
    isLoading: loading,
    refetch: refetchVendor,
  } = useGetAllVendorQuery(); 

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md"  PaperProps={{
      style: {
        height: '550px',
        maxHeight: '80vh',
      },
    }}>
      <DialogTitle>{"Upload Bulk Vendor "}</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <UploadBulkVendorPages getRowData={vendorName} onClose={onClose} from={"pages"} />
      </DialogActions>
    </Dialog>
  );
}
