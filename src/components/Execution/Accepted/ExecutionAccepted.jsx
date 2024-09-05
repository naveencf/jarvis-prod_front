import { useEffect, useState } from "react";
// import Confirmation from '../Confirmation'
import { ThemeProvider } from "styled-components";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { createTheme } from "react-data-table-component";
import jwtDecode from "jwt-decode";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import axios from "axios";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Confirmation from "../Confirmation";
import ExecutionUpdate from "../ExecutionUpdate";
import { baseUrl } from "../../../utils/config";

export default function ExecutionAccepted() {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const [alert, setAlert] = useState([]);
  const [contextData, setContextData] = useState();
  const [data, setData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [executionStatus, setExecutionStatus] = useState();
  const [reload, setReload] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  const handleDone = (row) => {
    console.log(row);
    setRowData(row);
    // setConfirmation(true);
    setExecutionStatus(1);
    setReload(true);
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [reload]);

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (userID && contextData == false) {
        axios
          .get(
            `${baseUrl}`+`get_single_user_auth_detail/${userID}`
          )
          .then((res) => {
            if (res.data[26].view_value == 1) {
              setContextData(true);
              setAlert(res.data);
              console.log(contextData);
            }
            console.log(res.data[26].view_value);
          });
      }
      const formData = new URLSearchParams();
      formData.append("loggedin_user_id", 36);
      // formData.append("filter_criteria", "m");
      // formData.append("pendingorcomplete", "pending");
      console.log(formData);
      const response = axios
        .get(baseUrl+"get_exe_sum")
        .then((res) => {
          setData(res.data.filter((ele) => ele.execution_status == "2"));
          // console.log()
          // console.log(jsonData);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      // setLoading(false);
    }
    axios.post(baseUrl+"exe_sum_post", {
      loggedin_user_id: 52,
    });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(13, 110, 253)",
      },
      //   secondary: purple,
    },
  });
  const addSerialNumber = (rows) => {
    return rows.map((row, index) => ({
      ...row,
      S_No: index + 1,
    }));
  };
  const columns = [
    {
      field: "S_No",
      headerName: "S No",
      width: 90,
    },
    {
      field: "cust_name",
      headerName: "Client Name",
      width: 150,
    },
    {
      field: "execution_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        // const StatusDetail = data.indexOf(params.row);
        if (params.row.execution_status == "2") {
          return (
            <Button
              size="small"
              color="success"
              variant="outlined"
              // fontSize="inherit"
            >
              Accepted
            </Button>
          );
        }
      },
    },
    {
      field: "sale_booking_date",
      headerName: "Booking Date",
      type: "number",
      width: 110,
      renderCell: (params) => {
        return new Date(params?.row.sale_booking_date).toLocaleDateString();
      },
    },
    {
      // filed: "start_date_",
      headerName: "Start Date",
      width: 150,
      renderCell: (params) => {
        return new Date(params?.row.start_date_).toLocaleDateString();
      },
    },
    // contextData && {
    //   field: "campaign_amount",
    //   headerName: "Amount",
    //   width: 120,
    // },

    {
      field: "summary",
      headerName: "Summary",
      type: "number",
      width: 110,
    },
    {
      field: "Time passed",
      headerName: "Time passed",
      type: "number",
      width: 110,
      renderCell: (params) => {
        if (params.row.execution_status == "2") {
          return (
            Math.floor(
              Math.abs((new Date(params.row.start_date_) - new Date()) / 36e5)
            ) + " hours"
          );
        }
      },
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 300,
      cellClassName: "actions",
      getActions: (params) => {
        const { id, row } = params; // Destructure the id and row from params
        return [
          <Link key={id} to={`/admin/exeexecution/${id}`}>
            <GridActionsCellItem
              icon={<ListAltOutlinedIcon />}
              label="Delete"
              // onClick={handleViewClick(id)}
              color="inherit"
            />
          </Link>,
          // <Link to={`/admin/executionupdate/${id}`}>,
          <GridActionsCellItem
            key={id}
            icon={
              <ExecutionUpdate setReload={setReload} id={id} rowData={row} />
              // <Button color="error" variant="outlined">
              //   Done
              // </Button>
            }
            label="Delete"
            onClick={(e) => handleDone(row)}
            color="inherit"
          />,
          // <GridActionsCellItem key={id}
          //   icon={<Button variant="outlined">Accept</Button>}
          //   label="Delete"
          //   // onClick={(e) => handleAccept(row)}
          //   color="inherit"
          // />,

          // <Button
          //   variant="outlined"
          //   color="danger"
          //   size="small"
          //   onClick={(e) => handleReject(row)}
          // >
          //   Reject
          // </Button>,
          // <GridActionsCellItem
          //   icon={
          //     <ExecutionUpdate id={id} rowData={row} setReload={setReload} />
          //   }
          //   label="Reject"
          //   className="textPrimary"
          //   // onClick={handleEditClick(id)}
          //   color="inherit"
          //   // color="primary"
          // />,
          // </Link>
        ];
      },
    },
  ];

  return (
    <div>
      <div>
        <div className="form_heading_title">
          <h2 className="form-heading">Execution In Progress Summary</h2>
        </div>
        <>
          {confirmation && (
            <Confirmation
              rowData={addSerialNumber(rowData)}
              value={new Date()}
              status={executionStatus}
              setReload={setReload}
              confirmation={confirmation}
              setSnackbar={setSnackbar}
              setConfirmation={setConfirmation}
            />
          )}
          <ThemeProvider theme={theme}>
            <DataGrid
              rows={addSerialNumber(data)}
              touchrippleref={false}
              columns={columns}
              getRowId={(row) => row.sale_booking_execution_id}
            />
          </ThemeProvider>
        </>
      </div>
    </div>
  );
}
