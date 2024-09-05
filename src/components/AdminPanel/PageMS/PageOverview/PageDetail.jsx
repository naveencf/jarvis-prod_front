import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setShowPageInfoModal } from "../../../Store/Page-slice";
import InfoCards from "./InfoCards";
import StatsHistory from "./StatsHistory";

export default function PageDetail() {
  const open = useSelector((state) => state.PageSlice.showPageInfoModal);
  const pageRow = useSelector((state) => state.PageSlice.pageRow);
  let dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));


  const handleClose = () => {
    dispatch(setShowPageInfoModal(false));
  };
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        fullWidth={"xl"}
        maxWidth={"lg"}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {pageRow?.page_name} Page Details
        </DialogTitle>
        <hr />
        <DialogContent>
          <InfoCards pageRow={pageRow} />
          <StatsHistory pageRow={pageRow} />
        </DialogContent>
      </Dialog>
    </>
  );
}
