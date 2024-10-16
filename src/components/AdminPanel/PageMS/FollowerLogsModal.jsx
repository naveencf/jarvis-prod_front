import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import View from "../Sales/Account/View/View";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { baseUrl } from "../../../utils/config";
import axios from "axios";

export default function FollowerLogsModal({ open, onClose, rowData }) {
    const token = sessionStorage.getItem("token");
    const [data , setData] = useState([])
    const {userContextData} = useAPIGlobalContext()
    useEffect(() => {
        
        const fetchData = async () => {
          try {
            const res = await axios.get(baseUrl + `v1/get_all_page_follower_count_logs?page_id=${rowData._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            setData(res.data.data);
            console.log(res.data.data, 'page logs data');
          } catch (error) {
            console.error('Error fetching page logs:', error);
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
          key: "page_name",
          name: "Page Name",
          width: 200,
        },
        {
          key: "follower_count",
          name: "Follower Count",
          width: 200,
        },
        {
          key: "bio",
          name: "Bio",
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
      {/* <DialogTitle>{"text"}</DialogTitle> */}
      <DialogContent>
      <View
          columns={dataGridColumns}
          data={data}
          isLoading={false}
          title={"Follower Logs"}
          pagination={[100, 200, 1000]}
          tableName={"Follower Logs"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
