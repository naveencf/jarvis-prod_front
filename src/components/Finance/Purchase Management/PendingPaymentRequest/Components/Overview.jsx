import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  InputAdornment,
} from "@mui/material";
// import pdf from "./pdf-file.png";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Overview = (props) => {
  const { data, columns } = props;
  const [overviewListDialog, setOverviewListDialog] = useState(false);
  const [overviewListData, setOverviewListData] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");

  // const filterData = () => {
  //   switch (selectedRange) {
  //     case "0-10k":
  //       setFilteredData(
  //         pendingReqData?.filter((data) => data?.balance_amount <= 10000)
  //       );
  //       break;
  //     case "10k-50k":
  //       setFilteredData(
  //         pendingReqData?.filter(
  //           (data) =>
  //             data?.balance_amount > 10000 && data?.balance_amount <= 50000
  //         )
  //       );
  //       break;
  //     case "50k-100k":
  //       setFilteredData(
  //         pendingReqData?.filter(
  //           (data) =>
  //             data?.balance_amount > 50000 && data?.balance_amount <= 100000
  //         )
  //       );
  //       break;
  //     case "100k-above":
  //       setFilteredData(
  //         pendingReqData?.filter((data) => data?.balance_amount > 100000)
  //       );
  //       break;
  //     default:
  //       setFilteredData(pendingReqData);
  //   }
  // };

  const calculateTotalAmount = (data) => {
    return data?.reduce(
      (total, item) => total + parseFloat(item.balance_amount),
      0
    );
  };

  const handleOpenUniqueVendorClick = (data) => {
    setOverviewListData(data);
    setOverviewListDialog(true);
  };

  const handleCloseOverviewList = () => {
    setOverviewListDialog(false);
  };

  return (
    <div>
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>count</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0-10k</td>
                <td
                  onClick={() =>
                    handleOpenUniqueVendorClick(
                      data.filter((item) => item.balance_amount <= 10000)
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                      color: "blue",
                    }}
                  >
                    {
                      data?.filter((item) => item.balance_amount <= 10000)
                        .length
                    }
                  </a>
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter((item) => item.balance_amount <= 10000)
                  )}
                </td>
              </tr>
              <tr>
                <td>10k-20k</td>
                <td
                  onClick={() =>
                    handleOpenUniqueVendorClick(
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 10000 &&
                          item.balance_amount <= 20000
                      )
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                      color: "blue",
                    }}
                  >
                    {" "}
                    {
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 10000 &&
                          item.balance_amount <= 20000
                      ).length
                    }
                  </a>
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 10000 &&
                        item.balance_amount <= 20000
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td>20k-30k</td>
                <td
                  onClick={() =>
                    handleOpenUniqueVendorClick(
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 20000 &&
                          item.balance_amount <= 30000
                      )
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                      color: "blue",
                    }}
                  >
                    {" "}
                    {
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 20000 &&
                          item.balance_amount <= 30000
                      ).length
                    }
                  </a>
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 20000 &&
                        item.balance_amount <= 30000
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td>30k-40k</td>
                <td
                  onClick={() =>
                    handleOpenUniqueVendorClick(
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 30000 &&
                          item.balance_amount <= 40000
                      )
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                      color: "blue",
                    }}
                  >
                    {
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 30000 &&
                          item.balance_amount <= 40000
                      ).length
                    }
                  </a>
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 30000 &&
                        item.balance_amount <= 40000
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td>40k-50k</td>
                <td
                  onClick={() =>
                    handleOpenUniqueVendorClick(
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 40000 &&
                          item.balance_amount <= 50000
                      )
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                      color: "blue",
                    }}
                  >
                    {" "}
                    {
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 40000 &&
                          item.balance_amount <= 50000
                      ).length
                    }
                  </a>
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 40000 &&
                        item.balance_amount <= 50000
                    )
                  )}
                </td>
              </tr>
              <tr>
                <td>50k-100k</td>
                <td
                  onClick={() =>
                    handleOpenUniqueVendorClick(
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 50000 &&
                          item.balance_amount <= 100000
                      )
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                      color: "blue",
                    }}
                  >
                    {" "}
                    {
                      data?.filter(
                        (item) =>
                          item.balance_amount >= 50000 &&
                          item.balance_amount <= 100000
                      ).length
                    }
                  </a>
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter(
                      (item) =>
                        item.balance_amount >= 50000 &&
                        item.balance_amount <= 100000
                    )
                  )}
                </td>
              </tr>

              <tr>
                <td>100k-above</td>
                <td
                  onClick={() =>
                    handleOpenUniqueVendorClick(
                      data?.filter((item) => item.balance_amount >= 100000)
                    )
                  }
                >
                  <a
                    style={{
                      cursor: "pointer",
                      marginRight: "20px",
                      color: "blue",
                    }}
                  >
                    {
                      data?.filter((item) => item.balance_amount >= 100000)
                        .length
                    }
                  </a>
                </td>
                <td>
                  {" "}
                  {calculateTotalAmount(
                    data?.filter((item) => item.balance_amount >= 100000)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={overviewListDialog}
        onClose={handleCloseOverviewList}
        fullWidth={"md"}
        maxWidth={"md"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DialogTitle>Overview List</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseOverviewList}
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
          <DataGrid
            rows={overviewListData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => overviewListData.indexOf(row)}
          />
          {openImageDialog && (
            <ImageView
              viewImgSrc={viewImgSrc}
              fullWidth={true}
              maxWidth={"md"}
              setViewImgDialog={setOpenImageDialog}
              openImageDialog={openImageDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Overview;
