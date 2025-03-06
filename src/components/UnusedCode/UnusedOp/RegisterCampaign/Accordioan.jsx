// import { useParams } from "react-router-dom";

import { Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// import CampaignDetailes from "./CampaignDetailes";

const Accordioan = ({ data }) => {
  const rows = data?.pages;
  // const param = useParams();
  // const id = param.id;
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 60,
      renderCell: (params) => {
        const rowIndex = rows?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Pages",
      width: "140",
    },
    {
      field: "phaseName",
      headerName: "Phase",
      width: "140",
    },
    {
      field: "postPerPage",
      headerName: "Post / Page",
      width: "140",
    },
    {
      field: "postRemaining",
      headerName: "PostRemaining",
      width: "140",
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: "140",
    },
    {
      field: "page_link",
      headerName: "Page Link",
      width: 300,
      renderCell: (params) => {
        return (
          <a href={params.row.page_link} target="_blank" rel="noreferrer">
            <p style={{ color: "blue" }}> {params.row.page_link}</p>
          </a>
        );
      },
    },
  ];
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <TextField
          label="Plan Name"
          disabled
          value={data.planName}
          // sx={{ m: 2 }}
        />
        <TextField
          label="Phase Name"
          disabled
          value={data.phaseName}
          // sx={{ m: 2 }}
        />
        <TextField
          label="description"
          disabled
          value={data.description}
          // sx={{ m: 2 }}
        />
        
      </Box>
      {data.commitment.map((item, ind) => (
        <Box key={ind} sx={{ display: "flex" }}>
          <TextField
            label="commitMent"
            disabled
            value={item.commitment}
            // sx={{ m: 2 }}
          />
          <TextField label="value" disabled value={item.value} />
        </Box>
      ))}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.p_id}
          pageSizeOptions={[5]}
        />
      </Box>
    </>
  );
};

export default Accordioan;
