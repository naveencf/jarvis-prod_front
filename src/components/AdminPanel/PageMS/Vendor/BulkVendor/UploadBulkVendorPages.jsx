import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import * as XLSX from "xlsx";
import { useGlobalContext } from "../../../../../Context/Context";
import { baseUrl } from "../../../../../utils/config";
import axios from "axios";
const storedToken = sessionStorage.getItem("token");

const UploadBulkVendorPages = ({ getRowData,from, onClose,category }) => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const { toastAlert, toastError } = useGlobalContext();

  const handleCheck = (event) => {
    if (!getRowData) {
      toastError("Please select vendor first");
      return;
    }
  };
  const handleUpload = (event) => {
    if (!getRowData) {
      toastError("Please select vendor first");

      return;
    }

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = jsonData[0];
        const contentRows = jsonData.slice(1);

        const formattedRows = contentRows.map((row) =>
          headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {})
        );

        setRows(formattedRows);
        setOpen(true);
      };
      reader.readAsArrayBuffer(selectedFile);
      event.target.value = null;
    }
  };

  const handleClose = () => {
    setOpen(false);
    setRows([]);
    setFile(null);
  };

  const handleSubmit = async () => {
  
    const formdata = new FormData();
      formdata.append("vendor_id", getRowData);
      formdata.append("category_id", category);
      formdata.append("bulk_vendor_excel", file);
  

    try {
      const res = await axios.post(`${baseUrl}v1/bulk_vendor_post`, formdata, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toastAlert("Bulk Vendor Updated Succefully")
      onClose()
      console.log(res);
    } catch (error) {
      onClose()
      toastError(error,"")
      console.error(error);
      

    }

    setOpen(false);
  };

  const downloadTemplate = () => {
    const headers = [
      [
        "page_name",
        "page_link",
        "followers",
        "post",
        "story",
        "both",
        "m_post",
        "m_story",
        "m_both",
        "reel",
        "carousel",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    XLSX.writeFile(wb, "vendor_pages_template.xlsx");
  };

  return (
    <>
      {/* Button to download the template */}
      <Button
        onClick={downloadTemplate}
        className="btn cmnbtn btn_sm btn-outline-primary"
      >
        Download Template
      </Button>

     
      <Button
        component="label"
        className="btn cmnbtn btn_sm btn-outline-primary"
        onClick={handleCheck}
      >
        Upload Bulk-Vendor-Pages
        {/* {getRowData.length === 1 && ( */}
          <input
            type="file"
            accept=".xlsx, .xls"
            hidden
            onChange={handleUpload}
          />
        {/* )} */}
      </Button>

      {/* Dialog to preview the uploaded data */}
      <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth>
        <DialogTitle>Preview: {fileName}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S No</TableCell>
                <TableCell>Pagename</TableCell>
                <TableCell>Link</TableCell>
                <TableCell>Followers</TableCell>
                <TableCell>Story</TableCell>
                <TableCell>Post</TableCell>
                <TableCell>Both</TableCell>
                <TableCell>Million-Story</TableCell>
                <TableCell>Million-Post</TableCell>
                <TableCell>Million-Both</TableCell>
                <TableCell>Reel</TableCell>
                <TableCell>Carousel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index+1}</TableCell>
                  <TableCell>{row?.page_name}</TableCell>
                  <TableCell>{row?.page_link}</TableCell>
                  <TableCell>{row?.followers}</TableCell>
                  <TableCell>{row?.post}</TableCell>
                  <TableCell>{row?.story}</TableCell>
                  <TableCell>{row?.both}</TableCell>
                  <TableCell>{row?.m_post}</TableCell>
                  <TableCell>{row?.m_story}</TableCell>
                  <TableCell>{row?.m_both}</TableCell>
                  <TableCell>{row?.reel}</TableCell>
                  <TableCell>{row?.carousel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadBulkVendorPages;
