import FormContainer from "../../../AdminPanel/FormContainer";
import { Box, Button, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import EditIcon from "@mui/icons-material/Edit";
import { Page } from "@react-pdf/renderer";
import jwtDecode from "jwt-decode";
import EditPaymentMode from "../../EditPaymentMode";
import DeleteButton from "../../../AdminPanel/DeleteButton";

export default function PaymentModeMast() {
  const { toastAlert } = useGlobalContext();
  const [paymentMode, setPaymentMode] = useState([]);
  const [row, setRow] = useState([]);
  const [addPaymentMode, setAddPaymentMode] = useState("");
  const [openEditPaymentMode, setOpenEditPaymentMode] = useState(false);
  const [editPaymetMode, setEditPaymentMode] = useState("");
  const [rowData, setRowData] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleEditPaymentMode = (e) => {
    setEditPaymentMode(e.target.value);
  };
  const handleSaveEditPaymentMode = () => {
    axios
      .put(baseUrl + `edit_payment_mode/${rowData._id}`, {
        payment_mode: editPaymetMode,
      })
      .then((res) => {
        if (res.status === 200) {
          toastAlert(`${editPaymetMode} updated successfully`);
          setEditPaymentMode("");
          setOpenEditPaymentMode(false);
        } else {
          toastAlert("Something went wrong");
        }
        res.status === 200 && callApi();
      });
  };

  const callApi = () => {
    axios.get(baseUrl + "get_all_payment_mode").then((res) => {
      setPaymentMode(res.data);
      setRow(res.data);
    });
  };

  const handlePaymentModeInputChange = (e) => {
    const a = paymentMode.filter((ele) => {
      return ele.payment_mode
        .toLowerCase()
        .includes(e.target.value.toLowerCase().trim());
    });
    setRow(a);
    setAddPaymentMode(e.target.value);
  };

  const handleClickAddCity = () => {
    axios
      .post(baseUrl + "add_payment_mode", {
        payment_mode: addPaymentMode,
        created_by: loginUserId,
      })
      .then((res) => {
        if (res.status === 200) {
          toastAlert(`${addPaymentMode} added successfully`);
          setAddPaymentMode("");
        } else {
          toastAlert("Something went wrong");
        }
        res.status === 200 && callApi();
      });
  };

  useEffect(() => {
    callApi();
  }, []);

  const filterRows = () => {
    const filtered = row.filter((row) =>
      row.payment_mode.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  const handleEditClick = (row) => {
    setOpenEditPaymentMode(true);
    setEditPaymentMode(row.city_name);
    setRowData(row);
  };

  const handleCloseEditPaymentMode = () => {
    setOpenEditPaymentMode(false);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, row]);

  const cityColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = row.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "payment_mode",
      headerName: "Payment Mode",
      width: 180,
      require: true,
      renderCell: (params) => {
        const name = params.value;
        const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
        return <div>{capitalized}</div>;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <>
          <button
            className="btn cmnbtn btn_sm tableIconBtn btn-light"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </button>
          <DeleteButton
            className="btn cmnbtn btn_sm tableIconBtn btn-light"
            endpoint={`delete_payment_mode`}
            id={params.row._id}
            getData={callApi}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <FormContainer
        submitButton={false}
        label={"Payment Mode"}
        mainTitle="Payment Mode Master"
        link={"#"}
      />
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <div className="thm_form">
                <TextField
                  type="text"
                  label="Search Payment Mode"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="flexCenter colGap12 thm_form">
                <TextField
                  type="text"
                  variant="outlined"
                  label="Payment Mode Name"
                  // value={addPaymentMode}
                  onChange={handlePaymentModeInputChange}
                />
                <button
                  className="btn cmnbtn btn-primary"
                  disabled={row.length > 0}
                  onClick={handleClickAddCity}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="card-body thm_table">
              <DataGrid
                rows={filteredRows}
                columns={cityColumns}
                getRowId={(row) => row._id}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {openEditPaymentMode && (
          <EditPaymentMode
            handleCloseEditPaymentMode={handleCloseEditPaymentMode}
            openEditPaymentMode={openEditPaymentMode}
            callApi={callApi}
            editPaymetMode={editPaymetMode}
            handleEditPaymentMode={handleEditPaymentMode}
            rowData={rowData}
            toastAlert={toastAlert}
            handleSaveEditPaymentMode={handleSaveEditPaymentMode}
          />
        )}
      </div>
    </div>
  );
}
