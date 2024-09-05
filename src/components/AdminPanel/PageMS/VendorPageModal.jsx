import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { setClosePageModal } from "../../Store/PageOverview";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function VendorPageModal() {
  const { toastError } = useGlobalContext();
  const vendorRow = useSelector((state) => state.PageOverview.venodrRowData);
  const open = useSelector((state) => state.PageOverview.showPageModal);
  const dispatch = useDispatch();

  const [pages, setPages] = React.useState([]);
  const handleClose = () => {
    setPages([]);
    dispatch(setClosePageModal());
  };

  const dataGridcolumns = [
    {
      field: "S.NO",
      headerName: "Count",
      renderCell: (params) => <div>{pages.indexOf(params.row) + 1}</div>,
      width: 80,
    },
    {
      field: "page_user_name",
      headerName: "User Name",
      width: 200,
      editable: true,
      renderCell: (params) => {
        let name = params.row.page_user_name;
        return (
          <Link target="__black" to={params.row.link} className="link-primary">
            {name}
          </Link>
        );
      },
    },
    { field: "page_level", headerName: "Level", width: 200 },
    { field: "page_status", headerName: "Status", width: 200 },
    { field: "ownership_type", headerName: "Ownership", width: 200 },
    {
      field: "followers_count",
      headerName: "Followers",
      width: 200,
    },
    {
      field: "engagment_rate",
      headerName: "ER",
      width: 200,
    },
    {
      field: "page_name_type",
      headerName: "Name Type",
      width: 200,
      renderCell: (params) => {
        return params.row.page_name_type != 0 ? params.row.page_name_type : "";
      },
    },
    {
      field: "content_creation",
      headerName: "Content Creation",
      renderCell: ({ row }) => {
        return row.content_creation != 0 ? row.content_creation : "";
      },
      width: 200,
    },

    { field: "price_cal_type", headerName: "Rate Type", width: 200 },
    { field: "variable_type", headerName: "Variable Type", width: 200 },

    { field: "description", headerName: "Description", width: 200 },
  ];
  useEffect(() => {
    if (vendorRow.vendorMast_id) {
      (async () => {
        try {
          const response = await axios.get(
            `${baseUrl}pageByVenodrId/${vendorRow.vendorMast_id}`
          );
          setPages(response.data.data);
        } catch (error) {
          toastError("Error while fetching tag categories");
        }
      })();
    }
  }, [vendorRow]);

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Page</DialogTitle>
        <DialogContent>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            {pages?.length > 0 ? (
              <DataGrid
                title="Page Overview"
                rows={pages}
                columns={dataGridcolumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                rowHeight={38}
                getRowId={(row) => row._id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                disableRowSelectionOnClick
              />
            ) : (
              <h1>No Data Found</h1>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
