import React, { useState } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import * as XLSX from 'xlsx';
import { useGlobalContext } from '../../../../../Context/Context';
import { baseUrl } from '../../../../../utils/config';
import axios from 'axios';
import Swal from 'sweetalert2';
const storedToken = sessionStorage.getItem('token');

const UploadBulkVendorPages = ({ getRowData, from, onClose, category, activePlatformId, rateType, selectedSubCategory, closeBy, tagCategoris }) => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateData, setDuplicateData] = useState([]);

  const { toastAlert, toastError } = useGlobalContext();
  const handleCheck = (event) => {
    if (!getRowData) {
      toastError('Please select vendor first');
      return;
    }
  };
  const handleUpload = (event) => {
    if (!getRowData) {
      toastError('Please select vendor first');

      return;
    }

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
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
  const showDuplicateDialog = (duplicates) => {
    Swal.fire({
      title: 'Duplicate Pages',
      html: `
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr>
              <th style="border-bottom: 1px solid #ddd; padding: 8px;">Page Name</th>
            </tr>
          </thead>
          <tbody>
            ${duplicates
              .map(
                (item) => `
                <tr>
                  <td style="border-bottom: 1px solid #ddd; padding: 8px;">${item.page_name}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
    });
  };

  const handleDuplicateDialogClose = () => {
    setDuplicateDialogOpen(false);
  };
  const handleSubmit = async () => {
    const formdata = new FormData();
    if (!getRowData || !category || !rateType || !activePlatformId || !file || !selectedSubCategory?._id || !closeBy || !tagCategoris?.length) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill out all mandatory fields before submitting.',
      });
      return;
    }
    formdata.append('vendor_id', getRowData);
    formdata.append('category_id', category);
    formdata.append('rate_type', rateType);
    formdata.append('platform_id', activePlatformId);
    formdata.append('bulk_vendor_excel', file);
    formdata.append('page_sub_category_id', selectedSubCategory._id);
    formdata.append('page_closed_by', closeBy);
    formdata.append('tags_page_category_name', tagCategoris);
    // tags_page_category_name
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}v1/bulk_vendor_post`, formdata, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toastAlert('Bulk Vendor Updated Succefully');
      onClose();
      console.log(res);
    } catch (error) {
      onClose();
      toastError(error, '');
      if (error.response && error.response.status === 409) {
        const { message, data } = error.response.data;

        // Store the duplicates in state
        setDuplicateData({
          message,
          data,
        });

        // Notify the user about duplicates
        Swal.fire({
          icon: 'warning',
          title: 'Duplicates Found',
          text: message,
          footer: `<button id="view-duplicates-btn" class="swal2-confirm swal2-styled">Click here to see duplicate pages</button>`,
          didOpen: () => {
            const button = document.getElementById('view-duplicates-btn');
            button.addEventListener('click', () => {
              Swal.close();
              showDuplicateDialog(data);
            });
          },
        });
      }
      if (error.response && error.response.status === 400) {
        const { message, data } = error.response.data;

        toastAlert(message);
        // Notify the user about duplicates
      }
      console.error(error);
    }
    setLoading(false);
    setOpen(false);
  };

  const downloadTemplate = () => {
    const headers = [
      [
        'page_name',
        'page_link',
        'followers',
        'post',
        'story',
        'both',
        // "m_post",
        // "m_story",
        // "m_both",
        'reel',
        'carousel',
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    XLSX.writeFile(wb, 'vendor_pages_template.xlsx');
  };

  return (
    <>
      {/* Button to download the template */}
      <Button onClick={downloadTemplate} className="btn cmnbtn btn_sm btn-outline-primary">
        Download Template
      </Button>

      <Button component="label" className="btn cmnbtn btn_sm btn-outline-primary" onClick={handleCheck}>
        Upload Bulk-Vendor-Pages
        {/* {getRowData.length === 1 && ( */}
        <input type="file" accept=".xlsx, .xls" hidden onChange={handleUpload} />
        {/* )} */}
      </Button>

      {/* Dialog to preview the uploaded data */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
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
                {/* <TableCell>Million-Story</TableCell>
                <TableCell>Million-Post</TableCell>
                <TableCell>Million-Both</TableCell> */}
                <TableCell>Reel</TableCell>
                <TableCell>Carousel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.page_name}</TableCell>
                  <TableCell>{row?.page_link}</TableCell>
                  <TableCell>{row?.followers}</TableCell>
                  <TableCell>{row?.post}</TableCell>
                  <TableCell>{row?.story}</TableCell>
                  <TableCell>{row?.both}</TableCell>
                  {/* <TableCell>{row?.m_post}</TableCell>
                  <TableCell>{row?.m_story}</TableCell>
                  <TableCell>{row?.m_both}</TableCell> */}
                  <TableCell>{row?.reel}</TableCell>
                  <TableCell>{row?.carousel}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading} // Disable button when loading
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Duplicate Data Dialog */}
      <Dialog open={duplicateDialogOpen} onClose={handleDuplicateDialogClose} maxWidth="lg" fullWidth>
        <DialogTitle>Duplicate Pages</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S No</TableCell>
                <TableCell>Page Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {duplicateData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.page_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDuplicateDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadBulkVendorPages;
