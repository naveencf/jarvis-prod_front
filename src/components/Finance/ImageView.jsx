import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "antd";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ImageView({
  viewImgSrc,
  setViewImgDialog,
  fullWidth = true,
  maxWidth = "md",
}) {
  const [open, setOpen] = React.useState(true);
  const [isPDF, setIsPDF] = React.useState(false);

  useEffect(() => {
    let verify = viewImgSrc.split(".").pop().toLowerCase() === "pdf";
    setIsPDF(verify);
  }, [viewImgSrc]);

  const handleClose = () => {
    setViewImgDialog(false);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          View
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          dividers
          // sx={{width:"50vw",height:"auto"}}
        >
          {!isPDF ? (
            <img src={viewImgSrc} alt="img" />
          ) : (
            <div style={{ width: "100%", height: "80vh" }}>
              <iframe
                src={viewImgSrc}
                title="file"
                width="100%"
                height="100%"
              ></iframe>
            </div>
          )}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
