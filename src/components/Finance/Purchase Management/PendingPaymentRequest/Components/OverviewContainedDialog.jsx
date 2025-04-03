import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import Overview from "./Overview";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const OverviewContainedDialog = (props) => {
  const { filterData, setOverviewDialog, overviewDialog, columns, setFilterData, setFilterQuery } = props;

  const handleCloseOverview = () => {
    setOverviewDialog(false);
  };
  return (
    <div>
      <Dialog
        open={overviewDialog}
        onClose={handleCloseOverview}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Overview</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseOverview}
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
          dividers={true}
          sx={{ maxHeight: "80vh", overflowY: "auto" }}
        >
          <Overview data={filterData} columns={columns} setFilterData={setFilterData} setOverviewDialog={setOverviewDialog} setFilterQuery={setFilterQuery} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OverviewContainedDialog;
