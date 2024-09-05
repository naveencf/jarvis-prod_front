import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import EmailEventDialog from "./EmailEventDialog/EmailEventDialog";
import DeleteEmailEventDialgo from "./EmailEventDialog/DeleteEmailEventDialgo";

export default function EmailEvent() {
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [openEmailEventDialog, setOpenEmailEventDialog] = useState(false);
  const [openDelateEmailEventDialog, setOpenDelateEmailEventDialog] =
    useState(false);
  const [rowData, setRowData] = useState({});

  const token = sessionStorage.getItem("token");

  const getApi = () => {
    axios
      .get(`${baseUrl}get_all_email_events`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
        setFilterData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getApi();
  }, []);

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 100,
      renderCell: (params) => {
        return <strong>{filterdata.indexOf(params.row) + 1}</strong>;
      },
    },
    {
      field: "event_name",
      headerName: "Event Name",
      width: 200,
    },
    {
      field: "remarks",
      headerName: "Remark",
      width: 200,
    },
    {
      field: "Actions",
      renderCell: (params) => {
        return (
          <div>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "10px" }}
              onClick={() => {
                console.log(params.row);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={(params) => {
                setOpenDelateEmailEventDialog(true);
                setRowData(params.row);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
      width: 200,
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Email Event Overview"
        title=""
        link="admin/email-events"
        submitButton={false}
      />
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: "10px" }}
          onClick={() => {
            setOpenEmailEventDialog(true);
          }}
        >
          Add
        </Button>
      </div>
      <DataGrid
        rows={filterdata}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        getRowId={(row) => row._id}
      />
      {openEmailEventDialog && (
        <EmailEventDialog
          setOpenEmailEventDialog={setOpenEmailEventDialog}
          openEmailEventDialog={openEmailEventDialog}
        />
      )}
      {openDelateEmailEventDialog && (
        <DeleteEmailEventDialgo
          setOpenDelateEmailEventDialog={setOpenDelateEmailEventDialog}
          openDelateEmailEventDialog={openDelateEmailEventDialog}
            rowData={rowData}
        />
      )}
    </>
  );
}
