import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { setCloseWhatsappModal } from "../../Store/PageOverview";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetAllVendorTypeQuery,
  useGetVendorWhatsappLinkQuery,
  useGetVendorWhatsappLinkTypeQuery,
} from "../../Store/reduxBaseURL";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function VendorWhatsappLinkModla() {
  const row = useSelector((state) => state.PageOverview.rowData);
  const { data } = useGetVendorWhatsappLinkQuery(row?._id, {
    skip: !row._id,
  });
  const links = data?.data;

  const { data: linkType } = useGetVendorWhatsappLinkTypeQuery();

  const dispatch = useDispatch();
  const showWhatsappModal = useSelector(
    (state) => state.PageOverview.showWhatsappModal
  );
  const handleClose = () => {
    dispatch(setCloseWhatsappModal());
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={showWhatsappModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Whatsapp Group Links
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
        <DialogContent dividers>
          <DataGrid
            rows={links}
            columns={[
              {
                field: "sno",
                headerName: "S.NO",
                width: 90,
                renderCell: (params) => {
                  return links.indexOf(params.row) + 1;
                },
              },
              {
                field: "type",
                headerName: "Type",
                width: 150,
                renderCell: (params) => {
                  return linkType?.data.find(
                    (type) => type?._id === params?.row?.type
                  )?.link_type;
                },
              },
              {
                field: "link",
                headerName: "Link",
                width: 150,
                renderCell: (params) => {
                  return (
                    <a href={params.value} target="_blank" rel="noopener noreferrer">
                      {params.value}
                    </a>
                  );
                },
              },
              // { field: "link", headerName: "Link", width: 150 },
              // { field: 'remark', headerName: 'Remark', width: 150 },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id}
            disableSelectionOnClick
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            variant="contained"
            color="error"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
