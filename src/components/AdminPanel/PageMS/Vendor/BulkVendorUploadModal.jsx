import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import Select from "react-select";
import { useGetAllPageCategoryQuery } from "../../../Store/PageBaseURL";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import FieldContainer from "../../FieldContainer";
import { useGetAllTagCategoryQuery, useUpdateTagCategoryMutation } from "../../../Store/API/Inventory/TagCategoryAPI";
import { useGlobalContext } from "../../../../Context/Context";
import { useGetAllVendorQuery } from "../../../Store/reduxBaseURL";
import UploadBulkVendorPages from "./BulkVendor/UploadBulkVendorPages";

export default function BulkVendorUploadModal({ open, onClose, rowData }) {
  const { userContextData, userID } = useAPIGlobalContext();
  const {toastAlert} = useGlobalContext()
  const [vendorName , setVendorName] = useState([]);
  const {
    data: vendorData,
    isLoading: loading,
    refetch: refetchVendor,
  } = useGetAllVendorQuery(); 
const vedndors = vendorData?.data || []
console.log(vendorName , 'vendor name')

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>{"Update "}</DialogTitle>
      <DialogContent>
        <div className="form-group col-12">
          <label className="form-label">
            Tag Category <sup className="form-error">*</sup>
          </label>
                <Select
                className=""
                options={vedndors.map((option) => ({
                  value: option._id,
                  label: `${option.vendor_name}`,
                }))}
                value={{
                  value: vendorName,
                  label:
                  vedndors.find(
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
        <UploadBulkVendorPages getRowData={vendorName} from={"pages"} />
      </DialogActions>
    </Dialog>
  );
}
