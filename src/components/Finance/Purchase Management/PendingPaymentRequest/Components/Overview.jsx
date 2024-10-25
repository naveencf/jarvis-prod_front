import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import View from "../../../../AdminPanel/Sales/Account/View/View";

const Overview = (props) => {
  const { data, columns } = props;
  const [overviewListDialog, setOverviewListDialog] = useState(false);
  const [overviewListData, setOverviewListData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTableData, setSelectedTableData] = useState([]);
  const [selectedRanges, setSelectedRanges] = useState({
    "0-10k": false,
    "10k-20k": false,
    "20k-30k": false,
    "30k-40k": false,
    "40-50k": false,
    "50k-100k": false,
    "100k-above": false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        "0-10k": data?.filter(
          (item) => item.balance_amount && item.balance_amount < 10000
        ),
        "10k-20k": data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 10000 &&
            item.balance_amount < 20000
        ),
        "20k-30k": data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 20000 &&
            item.balance_amount < 30000
        ),
        "30k-40k": data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 30000 &&
            item.balance_amount < 40000
        ),
        "40-50k": data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 40000 &&
            item.balance_amount < 50000
        ),
        "50k-100k": data?.filter(
          (item) =>
            item.balance_amount &&
            item.balance_amount >= 50000 &&
            item.balance_amount < 100000
        ),
        "100k-above": data?.filter((item) => item.balance_amount >= 100000),
      };

  const handleCheckboxChange = (range) => {
    setSelectedRanges((prev) => ({
      ...prev,
      [range]: !prev[range],
    }));
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedRanges = Object.keys(selectedRanges)?.reduce((acc, key) => {
      acc[key] = newSelectAll;
      return acc;
    }, {});

    setSelectedRanges(updatedRanges);
  };

  const handleOpenUniqueVendorClick = (filteredData) => {
    console.log(filteredData, "filteredData ---->>");
    setOverviewListData(filteredData);
    setOverviewListDialog(true);
  };

  const handleCloseOverviewList = () => {
    setOverviewListDialog(false);
  };

  const selectedData = Object?.entries(selectedRanges)?.reduce(
    (acc, [key, isSelected]) =>
      isSelected ? acc?.concat(filteredData[key]) : acc,
    []
  );

  const totalAmount =
    selectedData.length > 0
      ? calculateTotalAmount(selectedData)
      : calculateTotalAmount(data);

  const totalCount =
    selectedData?.length > 0 ? selectedData?.length : data?.length;

  return (
    <div>
      <div className="card">
        <div className="card-body thm_table">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <table className="table" style={{ verticalAlign: "middle" }}>
              <thead>
                <tr>
                  <th>
                    <Checkbox
                      checked={selectAll}
                      indeterminate={
                        Object?.values(selectedRanges)?.some(
                          (value) => value
                        ) && !selectAll
                      }
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th style={{ verticalAlign: "middle" }}>Data</th>
                  <th style={{ verticalAlign: "middle" }}>Count</th>
                  <th style={{ verticalAlign: "middle" }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(filteredData)?.map((range) => (
                  <tr key={range}>
                    <td>
                      <Checkbox
                        checked={selectedRanges[range]}
                        onChange={() => handleCheckboxChange(range)}
                      />
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {range?.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td
                      onClick={() =>
                        handleOpenUniqueVendorClick(filteredData[range])
                      }
                      style={{ verticalAlign: "middle" }}
                    >
                      <a style={{ cursor: "pointer", color: "blue" }}>
                        {filteredData[range]?.length}
                      </a>
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {" "}
                      {calculateTotalAmount(filteredData[range])}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={{ color: "#bfbfbf" }}>Total</td>
                  <td></td>
                  <td>{totalCount}</td>
                  <td>{totalAmount}</td>
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
        <DialogTitle>
          Data List
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
        </DialogTitle>
        <DialogContent dividers>
          <div style={{ height: "600px", width: "100%" }}>
            {/* <DataGrid
              rows={overviewListData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              components={{ Toolbar: GridToolbar }}
              getRowId={(row) => row?.vendor_id}
            /> */}

            <View
              columns={columns}
              data={overviewListData}
              isLoading={loading}
              title={"Sale Booking"}
              rowSelectable={true}
              pagination={[100, 200]}
              tableName={"sale_booking_tds_status_wise_data"}
              selectedData={setSelectedTableData}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOverviewList}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Overview;
