import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from '../../../utils/config'

const RequestAssignPage = ({ data, RequestAssign }) => {
  const [acceptall, setAcceptAll] = useState([])
  const processedData = data.map((item) => ({
    ...item,
    campaignName: item?.ass_page?.campaignName,
    pageName: item?.ass_page?.page_name,
    post: item?.ass_page?.postPerPage,
    category: item?.ass_page?.cat_name,
    story: item?.ass_page?.storyPerPage,
  }));
  useEffect(() => {
    setAcceptAll(data)
  }, [data])

  const handleAccept = async (row) => {
    const x = await axios.post(
      `${baseUrl}` + `preassignment/phase/update`,
      {
        pre_ass_id: row.pre_ass_id,
        status: "accepted",
        phase_id: row.phase_id,
        p_id: row.ass_page.p_id,
      }
    );
    RequestAssign();
  };
  const handleReject = async (row) => {
    const x = await axios.post(
      `${baseUrl}` + `preassignment/phase/update`,
      {
        pre_ass_id: row.pre_ass_id,
        status: "rejected",
        phase_id: row.phase_id,
        p_id: row.ass_page.p_id,
      }
    );
    RequestAssign();
  };

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = processedData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "campaignName",
      headerName: "Campaign",
      width: 150,
    },
    {
      field: "pageName",
      headerName: "Page Name",
      width: 150,
    },
    {
      field: "post",
      headerName: "Post/Page",
      width: 150,
    },
    {
      field: "story",
      headerName: "Story/Page",
      width: 150,
    },

    {
      field: "category",
      headerName: "Category",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      renderCell: (params) => (
        <div>
          <Button
            style={{ marginRight: "10px" }}
            onClick={() => handleAccept(params.row)}
            variant="outlined"
            color="secondary"
          >
            Accept
          </Button>
          <Button
            onClick={() => handleReject(params.row)}
            variant="outlined"
            color="error"
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  const handleSelectionChange = (row) => {

    const newData = data.filter(item => {
      if (row.some(page => page == item._id)) {
        return item
      }
    })

    setAcceptAll(newData)


  }

  const handleAcceptAll = async () => {
    try {
      const response = await axios.post(`${baseUrl}preassignment/acceptall`, { preAssignedPages: acceptall })

      RequestAssign()
    } catch (error) {

    }
  }

  return (
    <div>
      <Button className="btn cmnbtn btn-primary btn_sm mb-3" variant="contained" onClick={handleAcceptAll}>
        Accept All
      </Button>
      <DataGrid
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(row) => handleSelectionChange(row)}
        rows={processedData}
        columns={columns}
        getRowId={(row) => row._id}

      />
    </div>
  );
};

export default RequestAssignPage;
