import {
   
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from "@mui/material";
  import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const PriceModal = ({setShowPriceModal,setSelectedRow,setLocalPriceData,showPriceModal,localPriceData,allPriceTypeList,priceData}) => {
    const handleClose = () => {
        setShowPriceModal(false);
        setSelectedRow(null);
        setLocalPriceData(null);
      };


      const priceColumn = [
        {
          field: "S.NO",
          headerName: "S.NO",
          renderCell: (params) => <div>{priceData.indexOf(params.row) + 1}</div>,
          width: 130,
        },
        {
          field: "price_type",
          headerName: "Price Type",
          width: 200,
          renderCell: (params) => {
            let name = allPriceTypeList?.find(
              (item) => item._id == params.row.page_price_type_id
            )?.name;
            return <div>{name}</div>;
          },
        },
    
        {
          field: "price",
          headerName: "Price",
          width: 200,
        },
      ];
  return (
    <div>
       <Dialog
              open={showPriceModal}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Price Details"}
              </DialogTitle>
              <DialogContent>
                {localPriceData == null ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : (
                  <DialogContentText id="alert-dialog-description">
                    <DataGrid
                      rows={localPriceData}
                      columns={priceColumn}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      disableSelectionOnClick
                      getRowId={(row) => row._id}
                      slots={{ toolbar: GridToolbar }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                        },
                      }}
                    />
                  </DialogContentText>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} autoFocus>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
    </div>
  )
}

export default PriceModal
