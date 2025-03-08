import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress, // Import LinearProgress
  Typography,     // For no data message
} from "@mui/material";
import View from "../Sales/Account/View/View";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useAPIGlobalContext } from "../APIContext/APIContext";

export default function PriceLogs({ open, onClose, rowData, allPriceTypeList }) {
  const token = sessionStorage.getItem("token");
  const [data, setData] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0); // State for loading progress
  const [loading, setLoading] = useState(false); // State for loading status
  const { userContextData } = useAPIGlobalContext();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      setLoadingProgress(30); // Set initial progress

      try {
        const res = await axios.get(
          baseUrl + `v1/get_all_page_price_logs?page_master_id=${rowData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setData(res.data.data);
        setLoadingProgress(100);
        console.log(res.data.data, "page logs data");
      } catch (error) {
        setLoadingProgress(100);
        console.error("Error fetching page logs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (rowData?._id) {
      fetchData();
    }
  }, [rowData._id]);

  const dataGridColumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "price_type",
      name: "Price Type",
      width: 200,
      renderRowCell: (row) => {
        let name = allPriceTypeList?.find(
          (item) => item._id == row.page_price_type_id
        )?.name;
        return <div>{name}</div>;
      },
    },
    {
      key: "price",
      name: "Price",
      width: 200,
    },
    {
      key: "createdAt",
      name: "Created At",
      renderRowCell: (row) => {
        let data = row?.createdAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
      width: 150,
    },
    {
      key: "updatedAt",
      name: "Updated At",
      renderRowCell: (row) => {
        let data = row?.updatedAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
      width: 150,
    },
    {
      key: "created_by",
      name: "Created By",
      renderRowCell: (row) => {
        let name = userContextData?.find(
          (item) => item.user_id == row.created_by
        )?.user_name;
        return <div>{name}</div>;
      },
      width: 150,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      {loading && (
        <>
          <LinearProgress variant="determinate" value={loadingProgress} />
          <Typography align="center">Loading... {loadingProgress}%</Typography>
        </>
      )}

      <DialogContent>
        {!loading && data.length > 0 ? (
          <View
            columns={dataGridColumns}
            data={data}
            isLoading={false}
            title={"Price Logs"}
            pagination={[100, 200, 1000]}
            tableName={"Price Logs"}
          />
        ) : !loading && data.length === 0 ? (
          <Typography align="center">No Price Logs Available</Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
