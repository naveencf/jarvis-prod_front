import { Modal, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Assigned = ({ open, handleClose, data }) => {
  const [newPayload, setNewPayload] = useState([]);
  
  useEffect(() => {
    const x=data?.filter(page=>page?.ass_status=='pending')
    setNewPayload(x)
  }, [data]);

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = newPayload.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      editable: true,
    },
    {
      field: "cat_name",
      headerName: "Category",
      width: 150,
      editable: true,
    },
    {
      field: "exp_name",
      headerName: "expert",
      width: 150,
      editable: true,
    },

    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
      editable: true,
    },
  ];
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div>
          <div className="form_heading_title">
            <h2 className="form-heading">Assigned Task</h2>
          </div>
        </div>
        <DataGrid
          rows={newPayload}
          columns={columns}
          pageSize={5}
          getRowId={(row) => row.p_id}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Close
          </Button>
          <Button onClick={handleClose} variant="contained" color="primary">
            ok
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Assigned;
