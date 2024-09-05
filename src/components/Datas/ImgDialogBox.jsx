import {
  AppBar,
  Button,
  Dialog,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Document, Page } from "@react-pdf/renderer";

const allowedFileTypes = ["jpg", "png", "gif"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImgDialogBox({
  openReviewDisalog,
  setOpenReviewDisalog,
}) {
    console.log(openReviewDisalog.image, "openReviewDisalog.detail");
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpenReviewDisalog({ open: false, image: "" });
  };

  const allowedImageTypes = ["jpg", "png", "gif"];
  const allowedVideoTypes = ["mp4", "avi", "mkv"]; // Add video file types as needed
  const allowedPdfTypes = ["pdf"]; // Add PDF file types as needed

  {
    (allowedImageTypes.includes(openReviewDisalog.detail.fileType) ||
      allowedVideoTypes.includes(openReviewDisalog.detail.fileType) ||
      allowedPdfTypes.includes(openReviewDisalog.detail.fileType)) &&
      renderFile(openReviewDisalog.detail.fileType, openReviewDisalog.image);
  }

  function renderFile(fileType, fileSource) {
    console.log( fileSource, "fileType, fileSource");
    if (allowedImageTypes.includes(fileType)) {
      return (
        <img
          src={fileSource}
          alt="img"
          
          width="10%"
          style={{ 
            // objectFit: "contain"
         }}
          height="auto"
        />
      );
    } else if (allowedVideoTypes.includes(fileType)) {
      return (
        <div>
        <video className="mt-5" controls width="100%" height="auto">
          <source src={fileSource} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
        </div>
      );
    } else if (allowedPdfTypes.includes(fileType)) {
      return (
        <iframe src= {fileSource} 
                width="100%"
                height="100%"
                > 
        </iframe> 
      )
    } else {
      return <p>Unsupported file type</p>;
    }
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Review
            </Typography>
          </Toolbar>
        </AppBar>
        <List style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            width: "98.3vw",
            
        }}>
          {/* {
         allowedFileTypes.includes(openReviewDisalog.detail.fileType)  && 
         <img
            src={openReviewDisalog.image}
            alt="img"
            width="100%"
            style={{objectFit:"contain"}}
            height="auto"
          />} */}
          {renderFile(
            openReviewDisalog.detail.fileType,
            openReviewDisalog.image
          )}
        </List>
      </Dialog>
    </div>
  );
}
