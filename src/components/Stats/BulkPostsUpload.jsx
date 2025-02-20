import { useState, useEffect, useRef, useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { insightsBaseUrl } from "../../utils/config";

export default function BulkPostsUpload({
  setUpload,
  userID,
  setOpen,
  reload,
  setReload,
  usersDataContext,
}) {
  const [dialogopen, setDialogOpen] = useState(false);
  const [bulklead, setBulklead] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // const [alert, setAlert] = useState(false);
  const [alerttemp, setAlerttemp] = useState(false);
  const [catID, setCatID] = useState(0);

  let tj = 2;

  const handleClickOpen = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) {
      alert("Please select a file.");
      setUpload(false);
      return;
    }

    // Check if the file type is valid (optional)
    if (!file.name.endsWith(".xlsx")) {
      alert("Please upload a valid Excel file.");
      setUpload(false);
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const parsedData = XLSX.utils.sheet_to_json(sheet);

        // // Remove duplicates from parsedData based on the "link" field
        // const uniqueData = Array.from(
        //   new Set(parsedData.map((item) => item.link))
        // ).map((link) => {
        //   return parsedData.find((item) => item.link === link);
        // });

        setBulklead(parsedData);
        checkfieldname(parsedData[0]);
      } catch (error) {
        setAlerttemp(true);
        // setAlert(true);
        setUpload(false);
        // alert("An error occurred while processing the file. Please make sure the file format is correct.");
        console.error("Error:", error);
      }
    };
  };

  const fieldname = ["link"];

  const checkfieldname = (data) => {
    for (let i = 0; i < fieldname.length; i++) {
      if (!data.hasOwnProperty(fieldname[i])) {
        console.log("uniqueData");

        setAlerttemp(true);
        // setAlert(true);

        return false;
      } else {
        setDialogOpen(true);
      }
    }
    return true;
  };

  const handleClose = () => {
    setDialogOpen(false);
    setUpload(false);
  };
  const handleAlertClose = () => {
    setAlerttemp(false);
    setUpload(false);
  };
  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (dialogopen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [dialogopen]);

  const columns = [
    {
      field: "s_no",
      headerName: "S No",
      width: 90,
      renderCell: (params) => {
        const rowIndex = bulklead.indexOf(params.row);
        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>
            {rowIndex + 1}
          </div>
        );
      },
    },
    {
      field: "link",
      headerName: "Post Link",
      width: 450,
      type: "text",
      // editable: true,
    },
  ];

  const handlepageaddition = async () => {
    // Extract shortcodes from links
    const tempEmailIdObject = usersDataContext.find((ele) => ele.user_id == userID);
    let emailTo = "naveen@creativefuel.io";
    if (tempEmailIdObject?.user_email_id) {
      emailTo = tempEmailIdObject?.user_email_id;
    }
    // console.log("object");
    const shortcodes = bulklead
      .map((row) => {
        // Assuming link format is something like "https://instagram.com/p/shortcode" or "https://instagram.com/reel/shortcode" with or without additional parameters
        // const regex = /instagram\.com\/(?:p|reel)\/([^/?]+)/;
        const regex = /instagram\.com\/(?:[^/]+\/)?(?:p|reel|share)\/([^/?]+)/;
        const match = row.link.match(regex);
        if (match) {
          return match[1]; // Extract the shortcode from the matched pattern
        } else {
          console.log(row, "We are not acknowledging this link");
        }
        return null; // If no match found or shortcode length > 16, return null
      })
      .filter((code) => code !== null); // Filter out null values
    // console.log(shortcodes);

    // return;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";

    axios
      .post(
        `${insightsBaseUrl}v1/getpostDetailFromInstaForMultiplePost`,
        {
          shortCodes: shortcodes,
          department: "65c1cf4129f505657c16da47",
          userId: userID,
          email: emailTo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // console.log(res);
        setOpen(true);
        setReload(!reload);
        // setReloadOnInterval(shortcodes.length);
      })
      .catch((error) => {
        // console.log("fhdjsdgjghjhsgdhjfg");
        console.error(error);
        alert(error);
        return;
      });

    setDialogOpen(false);
    setUpload(false);
  };
  function setReloadOnInterval(maxtry) {
    let rethittime = 1;
    if (maxtry >= 5) {
      maxtry = 4;
    }
    let count = 0;
    const intervalId = setInterval(() => {
      if (count < maxtry) {
        setReload(!reload);
        count++;
      } else {
        clearInterval(intervalId);
      }
      if (maxtry > 2) {
        rethittime = 2;
      }
    }, rethittime * 60 * 1000); // 2 minutes interval
  }

  return (
    <>
      <TextField
        className="ml12 form-control cmnInputFile"
        // id="standard-basic"
        onChange={handleClickOpen}
        sx={{ width: 100 }}
        accept=".xlsx, .xls"
        variant="standard"
        type="file"
      />

      <Dialog
        // fullWidth={true}
        maxWidth="md"
        open={dialogopen}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Preview</DialogTitle>
        <DataGrid
          rows={bulklead}
          columns={columns}
          getRowId={(row) => row.link}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 25, 100]}
        />

        <DialogActions>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={handlepageaddition}
          >
            Upload
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        // fullWidth={true}
        maxWidth="md"
        open={alerttemp}
        onClose={handleAlertClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Error</DialogTitle>
        <DialogContentText>
          Please check your uploaded sheet once before retry.
        </DialogContentText>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleAlertClose}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
