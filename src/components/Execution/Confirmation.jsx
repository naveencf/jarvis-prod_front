import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../utils/config";
import { useGlobalContext } from "../../Context/Context";

const Confirmation = ({
  confirmation,
  setSnackbar,
  setConfirmation,
  rowData,
  value,
  remark,
  setReload,
  status,
}) => {
  const { toastError } = useGlobalContext();
  const [open, setOpen] = useState(confirmation);
  const [data, setData] = useState(rowData);
  const [token, setToken] = useState("");
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    setData(rowData);
    console.log(rowData, "this is row data");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      ("Please Enter Token");
      return;
    }
    if (token != data.execution_token) {
      return toastError("Entered Token Does not Match Please Enter Again");
    }

    let payload = {
      execution_status: "execution_accepted",
      sale_booking_id: data.sale_booking_id,
    };
    axios
      .put(`${baseUrl}sales/execution_status/${data._id}`, payload, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
      .then((res) => {
        if (res.data.data) {
          handleYes();
          setTimeout(() => {
            setReload((preVal) => !preVal);
          }, 1000);
        } else {
          toastError("Invalid Token");
        }
      });
  };
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }

  const handleYes = () => {
    if (status == 2) {
      let payload = {
        execution_status: "execution_accepted",
        sale_booking_id: data.sale_booking_id,
      };
      axios
        .put(`${baseUrl}sales/execution_status/${data._id}`, payload, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
      setConfirmation(false);

      const payload1 = {
        loggedin_user_id: userID,
        sale_booking_execution_id: data.sale_booking_execution_id,
        execution_date_time: new Date().toISOString().split("T")[0],
        execution_time: "0.00",
        execution_remark: "Accepted",
        execution_status: 2,
      };
      axios
        .post(
          `https://sales.creativefuel.io/webservices/RestController.php?view=executionSummaryUpdate`,
          payload1
        )
        .then((res) => {
          console.log(res);

          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
          setSnackbar({
            open: true,
            message: "Error Updating",
            severity: "error",
          });
        });

      setOpen(false);
      setConfirmation(false);
    } else if (status == 3) {
      let payload = {
        execution_status: "execution_rejected",
        sale_booking_id: data.sale_booking_id,
      };
      axios
        .put(`${baseUrl}sales/execution_status/${data._id}`, payload, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
      setConfirmation(false);
      setOpen(false);
      setConfirmation(false);
    } else if (status == 1) {
      const currentDateTime = new Date(getCurrentDateTime());
      const start_date = new Date(data.start_date_);
      const end_date = currentDateTime;
      const timeDifference = end_date - start_date;
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      let payload = {
        execution_status: "execution_completed",
        sale_booking_id: data.sale_booking_id,
      };
      axios
        .put(`${baseUrl}sales/execution_status/${data._id}`, payload, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
      setConfirmation(false);
      setOpen(false);
      setConfirmation(false);
    } else {
      const currentDateTime = new Date(getCurrentDateTime());
      const start_date = new Date(data.start_date_);
      const end_date = currentDateTime;
      const timeDifference = end_date - start_date;
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      const payload = {
        loggedin_user_id: userID,
        sale_booking_id: data.sale_booking_id,
        execution_date: value ? value : new Date(),
        execution_remark: remark,
        execution_status: 1,
        start_date_: data.start_date_,
        end_date: currentDateTime,
        sale_booking_execution_id: data.sale_booking_execution_id,
        execution_time: hoursDifference.toFixed(2),
      };
      axios
        .put(`${baseUrl}` + `edit_exe_sum`, payload)
        .then((res) => {
          console.log(res);
          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
        });

      setOpen(false);
      setConfirmation(false);

      const payload1 = {
        loggedin_user_id: userID,
        sale_booking_execution_id: data.sale_booking_execution_id,
        execution_date_time: new Date(value).toISOString().split("T")[0],
        execution_time: new Date(value).toLocaleTimeString("en-GB", {
          hour12: false,
        }),
        execution_remark: remark ? remark : "Done",
        execution_status: 1,
      };
      axios
        .post(
          `https://sales.creativefuel.io/webservices/RestController.php?view=executionSummaryUpdate`,
          payload1
        )
        .then((res) => {
          console.log(res);

          setReload((preVal) => !preVal);
        })
        .catch((err) => {
          console.log(err);
          setSnackbar({
            open: true,
            message: "Error Updating",
            severity: "error",
          });
        });

      setOpen(false);
      setConfirmation(false);
    }
  };
  const handleNo = () => {
    setOpen(false);
    setSnackbar(null);
    setConfirmation(false);
  };
  return (
    <Dialog maxWidth="xs" open={open}>
      {status != 2 && (
        <>
          {" "}
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent dividers>
            {`Pressing 'Yes' will Update the status.`}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleYes}>Yes</Button>
            <Button onClick={handleNo}>No</Button>
          </DialogActions>
        </>
      )}
      {status == 2 && (
        <>
          <DialogTitle>Please Enter the Token </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <input
                type="text"
                placeholder="Enter Token"
                onChange={(e) => {
                  console.log(e.target.value);
                  setToken(e.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button type="submit">Yes</Button>
              <Button onClick={handleNo}>No</Button>
            </DialogActions>
          </form>
        </>
      )}
    </Dialog>
  );
};

export default Confirmation;
