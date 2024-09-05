import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setCloseVendorNotAssignedModal } from "../../Store/PageOverview";
import { DataGrid } from "@mui/x-data-grid";
import { useGetnotAssignedVendorsQuery } from "../../Store/reduxBaseURL";

export default function VendorNotAssignedModal() {
  const dispatch = useDispatch();
  const open = useSelector(
    (state) => state.PageOverview.showVendorNotAssignedModal
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = () => {
    dispatch(setCloseVendorNotAssignedModal());
  };

  const { data, isLoading } = useGetnotAssignedVendorsQuery();
  const dataGridcolumns = [
    {
      field: "sno",
      headerName: "S.NO",
      width: 80,
      renderCell: (params) => <div>{data.data.indexOf(params.row) + 1}</div>,
    },
    {
      field: "vendorMast_name",
      headerName: "Vendor Name",
      width: 200,
      // editable: true,
      renderCell: (params) => {
        return (
          <div
            // onClick={handleClickVendorName(params)}
            className="link-primary cursor-pointer text-truncate"
          >
            {params.row.vendorMast_name}
          </div>
        );
      },
    },
    {
      field: "vendor_category",
      headerName: "Vendor Category",
      width: 150,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 200,
      editable: true,
    },
    {
      field: "alternate_mobile",
      headerName: "Alternate Mobile",
      width: 200,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "home_city",
      headerName: "Home City",
      width: 200,
      editable: true,
    },
    {
      field: "gst_no",
      headerName: "GST No",
      width: 200,
      editable: true,
    },
    {
      field: "threshold_limit",
      headerName: "Threshold Limit",
      width: 200,
      editable: true,
    },
    {
      field: "country_code",
      headerName: "Country Code",
      width: 200,
      editable: true,
    },
    {
      field: "company_pincode",
      headerName: "Company Pincode",
      width: 200,
      editable: true,
    },
    {
      field: "company_address",
      headerName: "Company Address",
      width: 200,
      editable: true,
    },
    {
      field: "company_city",
      headerName: "Company City",
      width: 200,
      editable: true,
    },
    {
      field: "company_name",
      headerName: "Company Name",
      width: 200,
      editable: true,
    },
    {
      field: "company_state",
      headerName: "Company State",
      width: 200,
      editable: true,
    },
    {
      field: "home_address",
      headerName: "Home Address",
      width: 200,
      editable: true,
    },
    {
      field: "home_state",
      headerName: "Home State",
      width: 200,
      editable: true,
    },
    {
      field: "pan_no",
      headerName: "Pan No",
      width: 200,
      editable: true,
    },
    {
      field: "personal_address",
      headerName: "Personal Address",
      width: 200,
      editable: true,
    },
    // {
    //   field: "type_id",
    //   headerName: "Vendor Type",
    //   width: 200,
    //   renderCell: (params) => {
    //     let name = typeData?.find(
    //       (item) => item?._id == params.row?.type_id
    //     )?.type_name;
    //     return <div>{name}</div>;
    //   },
    //   editable: true,
    // },
    // {
    //   field: "platform_id",
    //   headerName: "Platform",
    //   width: 200,
    //   renderCell: (params) => {
    //     let name = platformData?.find(
    //       (item) => item?._id == params.row?.platform_id
    //     )?.platform_name;
    //     return <div>{name}</div>;
    //   },
    //   editable: true,
    // },
    // {
    //   field: "payMethod_id",
    //   headerName: "Paymen Method",
    //   width: 200,
    //   renderCell: (params) => {
    //     let name = payData?.find(
    //       (item) => item?._id == params.row?.payMethod_id
    //     )?.payMethod_name;
    //     return <div>{name}</div>;
    //   },
    //   editable: true,
    // },
    // {
    //   field: "cycle_id",
    //   headerName: "Cycle",
    //   width: 200,
    //   renderCell: (params) => {
    //     let name = cycleData?.find(
    //       (item) => item?._id == params.row?.cycle_id
    //     )?.cycle_name;
    //     return <div>{name}</div>;
    //   },
    //   editable: true,
    // },
    {
      field: "bank_name",
      headerName: "Bank Name",
      width: 200,
    },
    {
      field: "account_type",
      headerName: "Account Type",
      width: 200,
    },
    {
      field: "account_no",
      headerName: "Account No",
      width: 200,
    },
    {
      field: "ifsc_code",
      headerName: "IFSC Code",
      width: 200,
    },
    {
      field: "upi_id",
      headerName: "UPI ID",
      width: 200,
    },
    // {
    //   field: "whatsapp_link",
    //   headerName: "Whatsapp Link",
    //   width: 200,
    //   renderCell: (params) => {
    //     return (
    //       <div>
    //         {
    //           params.row?.whatsapp_link && (
    //             <div
    //               className="text-truncate link-primary cursor-pointer"
    //               onClick={handleOpenWhatsappModal(params.row.whatsapp_link)}
    //             >
    //               <OpenWithIcon />
    //             </div>
    //           )
    //           // ))
    //         }
    //       </div>
    //     );
    //   },
    // },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   width: 200,
    //   renderCell: (params) => (
    //     <>
    //       <Link
    //         to={`/admin/pms-vendor-page-price-master/${params.row.vendorMast_name}`}
    //       >
    //         <button
    //           title="Update Price"
    //           className="btn btn-outline-primary btn-sm user-button"
    //         >
    //           <PriceChangeIcon />
    //         </button>
    //       </Link>
    //       <Link
    //         to={`/admin/pms-vendor-group-link/${params.row.vendorMast_name}`}
    //       >
    //         <button
    //           title="Group Link"
    //           className="btn btn-outline-primary btn-sm user-button"
    //         >
    //           <RouteIcon />
    //         </button>
    //       </Link>
    //       <Link to={`/admin/pms-vendor-edit/${params.row._id}`}>
    //         <button
    //           title="Edit"
    //           className="btn btn-outline-primary btn-sm user-button"
    //         >
    //           <FaEdit />{" "}
    //         </button>
    //       </Link>
    //       <DeleteButton
    //         endpoint="deleteVendorMast"
    //         id={params.row._id}
    //         getData={getData}
    //       />
    //     </>
    //   ),
    // },
  ];
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Vendor Not Assigned List"}
        </DialogTitle>
        <DialogContent>
          {!isLoading && (
            <DataGrid
              rows={data.data}
              columns={dataGridcolumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              getRowId={(row) => row._id}
              //   slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            //   checkboxSelection
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
