import { useContext, useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { UserContext } from "./LeadApp";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import LeadHeader from "./LeadHeader";
import { memo } from "react";
import AssignLeadHeader from "./Tools/AssignLeadHeader";
import CountButton from "./Tools/CountButton";

function LeadManagement() {
  // console.log("1");
  const { datalead, se, reload } = useContext(UserContext);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [hmdata, setHmdata] = useState(false);
  // const localhm = localStorage.getItem("localhm");
  const handleCheckBox = () => {
    console.log(rowSelectionModel);
  };

  let newleadcount = datalead.length;

  console.log(hmdata);
  // todo // Lead Count for salesrepresentative
  const hm = new Map();
  const createHashmap = () => {
    se.map((ele) => {
      // console.log(ele.user_id);
      hm.set(ele.user_id, 0);
    });

    datalead.map((ele) => {
      if (hm.has(ele.assign_to)) {
        hm.set(ele.assign_to, hm.get(ele.assign_to) + 1);
      } else {
        hm.set(ele.assign_to, 1);
      }
    });
    // localStorage.setItem("localhm", hm);

    console.log(hm);
    console.log(hm.get(167));
    console.log(hm.has(167));
  };
  useEffect(() => {
    createHashmap();
    // setHmdata(true);
  }, [reload]);

  const columns = [
    {
      field: "emp",
      headerName: "Emp ID",
      width: 70,
      valueGetter: (params) => `${params.row.user_id || ""} `,
    },
    {
      field: "user_name",
      headerName: "Sales Executive",
      width: 150,
      // editable: true,
    },
    {
      field: "user_id",
      headerName: "Actions",
      width: 100,
      // renderCell: RenderDate,
      renderCell: (params) => (
        <>
          <Link to={`/admin/${params.id}`}>
            {/* <Button
              component="button"
              variant="contained"
              size="small"
              style={{ marginLeft: -5 }}
              // onClick={() => localStorage.setItem("seEmpID", params.id)}
            >
              {hm.has(params.id) ? hm.get(params.id) : "NA"}
            </Button> */}
            <CountButton hm={hm} params={params} />
          </Link>
        </>
      ),
    },
    {
      field: "email",
      headerName: "Lead Status",
      type: "email",
      width: 150,
      // editable: true,
    },
    {
      field: "mobile_no",
      headerName: "Contact Detail",
      type: "number",
      width: 110,
      // editable: true,
    },
  ];

  return (
    <Paper sx={{ width: "100%" }}>
      <AssignLeadHeader
        hm={hm}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        newleadcount={newleadcount}
      />
      <DataGrid
        rows={se}
        columns={columns}
        getRowId={(row) => row.user_id}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        onRowClick={handleCheckBox}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        isRowSelectable={(params) => params.row.onboard_status != 5}
        disableRowSelectionOnClick
      />
    </Paper>
  );
}
export default LeadManagement;
