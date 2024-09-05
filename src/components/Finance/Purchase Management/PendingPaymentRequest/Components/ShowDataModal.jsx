import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";

export default function ShowDataModal({
  handleClose,
  rows,
  columns,
  aknowledgementDialog,
  setAknowledgementDialog,
  userName,
  callApi,
  setRemainderDialog,
}) {
  const [acknowledgementMessage, setAcknowledgementMessage] = useState("");
  const [acknowLedgementDate, setAcknowLedgementDate] = useState("");

  const YYYYMMDDdateConverter = (date) => {
    let dateObj = new Date(date);
    let month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Month in 2 digits
    let day = String(dateObj.getUTCDate()).padStart(2, "0"); // Day in 2 digits
    let year = dateObj.getUTCFullYear(); // Year in 4 digits
    let newdate = year + "-" + month + "-" + day;
    return newdate;
  };

  const handleSendAcknowledgement = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("status", 1);
    formData.append("revert_remark", acknowledgementMessage);
    formData.append("revert_date", YYYYMMDDdateConverter(acknowLedgementDate));
    formData.append("revert_by", userName);
    formData.append("request_id", 1 * rows[0].request_id);
    formData.append("remind_id", 1 * rows[0].remind_id);
    axios
      .post(
        "https://purchase.creativefuel.io/webservices/RestController.php?view=updatePaymentRemindReuest",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.message === "Update successful.") {
          axios
            .delete(
              baseUrl + "deletephpvendorpaymentrequest/" + rows[0].request_id
            )
            .then((res) => {
              console.log(res);
            });
          setAknowledgementDialog(false);
          handleClose(false);
          callApi();
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // setAknowledgementDialog(false);
  };

  const handleSetAcknowledgementData = (e) => {
    setAcknowLedgementDate(e.target.value);
  };

  return (
    <>
      <Dialog open={true} onClose={() => handleClose(false)} maxWidth="lg">
        <DialogTitle>Remainder</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleClose(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row?.remind_id || []}
          />
        </DialogContent>
      </Dialog>

      {aknowledgementDialog && (
        <Dialog
          open={true}
          onClose={() => setAknowledgementDialog(false)}
          maxWidth="lg"
        >
          <DialogTitle>Acknowledge</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setAknowledgementDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <TextField
              multiline
              rows={5}
              value={acknowledgementMessage}
              onChange={(e) => setAcknowledgementMessage(e.target.value)}
              fullWidth
              label="Acknowledgement Message"
              variant="outlined"
            />
            <input
              type="date"
              onChange={handleSetAcknowledgementData}
              className="form-control"
            />
            <DialogActions>
              <Button
                variant="contained"
                onClick={(e) => handleSendAcknowledgement(e)}
              >
                Send
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
