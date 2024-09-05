import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button, Alert } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

export default function SimpleBackdrop() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
        <Alert severity="info">
          Thank you for your patience ! <br />
          We're working diligently to gather and analyze the data that makes
          your experience meaningful. Your understanding is invaluable as we
          strive to provide you with the best insights. <br />
          Sit back, relax, and let the magic happen. We appreciate your support!
        </Alert>
        {/* <LinearProgress /> */}
      </Backdrop>
    </div>
  );
}
