import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Overview = (props) => {
  const { data, columns } = props;
  const [overviewListDialog, setOverviewListDialog] = useState(false);
  const [overviewListData, setOverviewListData] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(data, "..data---filterData---main overview");

    if (data && data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  const calculateTotalAmount = (filteredData) => {
    return filteredData?.reduce(
      (total, item) => total + (parseFloat(item?.balance_amount) || 0),
      0
    );
  };

  const filteredData = loading
    ? {}
    : {
        lessThan10k: data?.filter(
          (item) => item.balance_amount && item.balance_amount < 10000
        ),
        between10kAnd20k: data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 10000 &&
            item.balance_amount < 20000
        ),
        between20kAnd30k: data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 20000 &&
            item.balance_amount < 30000
        ),
        between30kAnd40k: data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 30000 &&
            item.balance_amount < 40000
        ),
        between40kAnd50k: data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 40000 &&
            item.balance_amount < 50000
        ),
        between50kAnd100k: data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 50000 &&
            item.balance_amount < 100000
        ),
        moreThan100k: data?.filter((item) => item.balance_amount >= 100000),
      };
  const handleOpenUniqueVendorClick = (filteredData) => {
    setOverviewListData(filteredData);
    setOverviewListDialog(true);
  };
  console.log(filteredData?.lessThan10k, "ddd");
  const handleCloseOverviewList = () => {
    setOverviewListDialog(false);
  };

  return (
    <div>
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Count</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0-10k</td>
                  <td
                    onClick={() =>
                      handleOpenUniqueVendorClick(filteredData.lessThan10k)
                    }
                  >
                    <a style={{ cursor: "pointer", color: "blue" }}>
                      {filteredData?.lessThan10k?.length}
                    </a>
                  </td>
                  <td>{calculateTotalAmount(filteredData?.lessThan10k)}</td>
                </tr>
                <tr>
                  <td>10k-20k</td>
                  <td
                    onClick={() =>
                      handleOpenUniqueVendorClick(
                        filteredData?.between10kAnd20k
                      )
                    }
                  >
                    <a style={{ cursor: "pointer", color: "blue" }}>
                      {filteredData?.between10kAnd20k?.length}
                    </a>
                  </td>
                  <td>
                    {calculateTotalAmount(filteredData?.between10kAnd20k)}
                  </td>
                </tr>
                <tr>
                  <td>20k-30k</td>
                  <td
                    onClick={() =>
                      handleOpenUniqueVendorClick(
                        filteredData?.between20kAnd30k
                      )
                    }
                  >
                    <a style={{ cursor: "pointer", color: "blue" }}>
                      {filteredData?.between20kAnd30k?.length}
                    </a>
                  </td>
                  <td>
                    {calculateTotalAmount(filteredData?.between20kAnd30k)}
                  </td>
                </tr>
                <tr>
                  <td>30k-40k</td>
                  <td
                    onClick={() =>
                      handleOpenUniqueVendorClick(
                        filteredData?.between30kAnd40k
                      )
                    }
                  >
                    <a style={{ cursor: "pointer", color: "blue" }}>
                      {filteredData?.between30kAnd40k?.length}
                    </a>
                  </td>
                  <td>
                    {calculateTotalAmount(filteredData?.between30kAnd40k)}
                  </td>
                </tr>
                <tr>
                  <td>40k-50k</td>
                  <td
                    onClick={() =>
                      handleOpenUniqueVendorClick(
                        filteredData?.between40kAnd50k
                      )
                    }
                  >
                    <a style={{ cursor: "pointer", color: "blue" }}>
                      {filteredData?.between40kAnd50k?.length}
                    </a>
                  </td>
                  <td>
                    {calculateTotalAmount(filteredData?.between40kAnd50k)}
                  </td>
                </tr>
                <tr>
                  <td>50k-100k</td>
                  <td
                    onClick={() =>
                      handleOpenUniqueVendorClick(
                        filteredData?.between50kAnd100k
                      )
                    }
                  >
                    <a style={{ cursor: "pointer", color: "blue" }}>
                      {filteredData?.between50kAnd100k?.length}
                    </a>
                  </td>
                  <td>
                    {calculateTotalAmount(filteredData?.between50kAnd100k)}
                  </td>
                </tr>
                <tr>
                  <td>100k-above</td>
                  <td
                    onClick={() =>
                      handleOpenUniqueVendorClick(filteredData?.moreThan100k)
                    }
                  >
                    <a style={{ cursor: "pointer", color: "blue" }}>
                      {filteredData?.moreThan100k?.length}
                    </a>
                  </td>
                  <td>{calculateTotalAmount(filteredData?.moreThan100k)}</td>
                </tr>
                <tr>
                  <td style={{ color: "#bfbfbf" }}>Total</td>
                  <td>
                    <a style={{ cursor: "pointer", color: "#bfbfbf" }}>
                      {Object?.values(filteredData)?.reduce(
                        (acc, curr) => acc + curr?.length,
                        0
                      )}
                    </a>
                  </td>
                  <td style={{ color: "#bfbfbf" }}>
                    {calculateTotalAmount(Object?.values(filteredData)?.flat())}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Overview List Dialog */}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Overview;
