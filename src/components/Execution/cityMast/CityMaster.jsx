import React, { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { Page } from "@react-pdf/renderer";
import { TextField, Typography, Button, Box, Paper } from "@mui/material";
import { useGlobalContext } from "../../../Context/Context";
import DeleteCity from "./DeleteCity";
import EditCity from "./EditCity";
import { baseUrl } from "../../../utils/config";

export default function CityMaster() {
  const { toastAlert } = useGlobalContext();
  const [city, setCity] = useState([]);
  const [row, setRow] = useState([]);
  const [addCity, setAddCity] = useState("");
  const [openEditCity, setOpenEditCity] = useState(false);
  const [editCityName, setEditCityName] = useState("");
  const [rowData, setRowData] = useState({});
  const [openDeleteCityName, setOpenDeleteCityName] = React.useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const handleClickOpenDeleteCityName = (row) => {
    setOpenDeleteCityName(true);
    setRowData(row);
  };
  const handleEditCity = (e) => {
    setEditCityName(e.target.value);
  };
  const handleSaveEditCityName = () => {
    axios
      .put(baseUrl + "update_city", {
        _id: rowData._id,
        city_name: editCityName,
      })
      .then((res) => {
        if (res.status === 200) {
          toastAlert(`${editCityName} updated successfully`);
          setEditCityName("");
          setOpenEditCity(false);
        } else {
          toastAlert("Something went wrong");
        }
        res.status === 200 && callApi();
      });
  };
  const handleCloseDeleteCityName = () => {
    setOpenDeleteCityName(false);
  };

  const handleEditClick = (row) => {
    setOpenEditCity(true);
    setEditCityName(row.city_name);
    setRowData(row);
  };
  const handleCloseEditCityName = () => {
    setOpenEditCity(false);
  };

  const callApi = () => {
    axios.get(baseUrl + "get_all_cities").then((res) => {
      console.log(res);
      setCity(res.data.data);
      setRow(res.data.data);
    });
  };

  useEffect(() => {
    callApi();
  }, []);
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
      field: "city_name",
      headerName: "City Name",
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
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => handleEditClick(params.row)}
            startIcon={<EditIcon />}
            className="icon-1"
          >
            <i className="bi bi-pencil" />
          </button>
          <button
            variant="contained"
            color="error"
            size="small"
            style={{ marginLeft: 16 }}
            onClick={() => handleClickOpenDeleteCityName(params.row)}
            startIcon={<DeleteIcon />}
            className="icon-1"

          >
            <i className="bi bi-trash" />
          </button>
        </>
      ),
    },
  ];

  const handleCityInputChange = (e) => {
    const a = city.filter((ele) => {
      return ele.city_name
        .toLowerCase()
        .includes(e.target.value.toLowerCase().trim());
    });
    setRow(a);
    setAddCity(e.target.value);
  };

  const handleClickAddCity = () => {
    axios.post(baseUrl + "add_city", { city_name: addCity }).then((res) => {
      if (res.status === 200) {
        toastAlert(`${addCity} added successfully`);
        setAddCity("");
      } else {
        toastAlert("Something went wrong");
      }
      res.status === 200 && callApi();
    });
  };

  const filterRows = () => {
    const filtered = row.filter((row) =>
      row.city_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, row]);

  return (
    <div >
      <FormContainer mainTitle="City Master" link="/ip-master" />
      <div className="card">
        <div className="card-body thm_form flexCenter colGap16">

          <TextField
            type="text"
            label="Search City"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <>
            <TextField
              type="text"
              variant="outlined"
              label="City Name"
              value={addCity}
              onChange={handleCityInputChange}
            />
            <Button
              className="btn cmnbtn btn-primary "

              disabled={row.length > 0}
              onClick={handleClickAddCity}
            >
              Add
            </Button>

          </>
        </div>

      </div>
      <div className="card body-padding nt-head">
        <DataGrid
          rows={filteredRows}
          columns={cityColumns}
          getRowId={(row) => row._id}
        />
      </div>

      <DeleteCity
        handleCloseDeleteCityName={handleCloseDeleteCityName}
        handleClickOpenDeleteCityName={handleClickOpenDeleteCityName}
        openDeleteCityName={openDeleteCityName}
        rowData={rowData}
        toastAlert={toastAlert}
        callApi={callApi}
      />
      {openEditCity && (
        <EditCity
          handleCloseEditCityName={handleCloseEditCityName}
          openEditCity={openEditCity}
          callApi={callApi}
          editCityName={editCityName}
          handleEditCity={handleEditCity}
          rowData={rowData}
          toastAlert={toastAlert}
          handleSaveEditCityName={handleSaveEditCityName}
        />
      )}
    </div>
  );
}
