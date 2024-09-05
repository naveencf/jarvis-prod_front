import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import Select from "react-select";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import FieldContainer from "../FieldContainer";
import { useParams } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useGlobalContext } from "../../../Context/Context";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";


export default function PurchasePrice() {
  const { id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();

  const [priceTypeList, setPriceTypeList] = useState([]);
  const [priceTypeId, setPriceTypeId] = useState("");
  const [rateType, setRateType] = useState({ value: "Fixed", label: "Fixed" });
  const [variableType, setVariableType] = useState({
    value: "Per Thousand",
    label: "Per Thousand",
  });
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [platformData, setPlatformData] = useState([]);
  const [platformId, setPlatformId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [allPriceList, setAllPriceList] = useState([]);
  const [allPriceTypeList, setAllallPriceTypeList] = useState([]);
  const [rowCount, setRowCount] = useState([{ price_type_id: "", price: "" }]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceData, setPriceData] = useState({});

  const handleClose = () => {
    setShowPriceModal(false);
  };

  const getData = () => {
    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });

    axios.get(baseUrl + `get_page_purchase_price/${+id}`).then((res) => {
      setTableData(res.data.data);
    });
    axios.get(baseUrl + `get_all_data_list`).then((res) => {
      setAllallPriceTypeList(res.data.data);
    });
  };

  useEffect(() => {
    if (tableData.length > 0) {
      axios.get(baseUrl + `getPriceList`).then((res) => {
        setAllPriceList(res.data.data);
      });
    }
  }, [tableData]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (platformId) {
      setPriceTypeId([]);
      setPriceTypeList([]);
      let priceData = platformData.find((role) => role._id == platformId)?._id;
      axios.get(baseUrl + `data/${priceData}`).then((res) => {
        setPriceTypeList(res.data.data);
        setFilterPriceTypeList(res.data.data);
      });
    }
  }, [platformId]);

  const handleRateTypeChange = (selectedOption) => {
    setRateType(selectedOption);
  };

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let copyData = tableData.find(
      (e) =>
        e.PMS_PageMast_data.platform_id == platformId &&
        e.price_type_id == priceTypeId
    );
    if (copyData) {
      toastError("Data already exists");
      return;
    }

    if ( !rateType || !price) {
      toastError("Please fill all the fields");
      return;
    }
    let data = {
      platform_id: platformId,
      pageMast_id: id,
      price_cal_type: rateType.value,
      // price_type_id: priceTypeId,
      variable_type: rateType.value == "Variable" ? variableType.value : null,
      // purchase_price: price,
      purchase_price: rowCount,
      description: description,
    };
    axios
      .post(baseUrl + "add_page_purchase_price", data)
      .then((res) => {
        if (res.data.status === 200) {
          toastAlert("Data added successfully");
          setPriceTypeId("");
          setRateType({ value: "Fixed", label: "Fixed" });
          setVariableType({ value: "Per Thousand", label: "Per Thousand" });
          setPrice("");
          setDescription("");
          setPlatformId("");
          setRowCount([{ price_type_id: "", price: "" }]);

          getData();
        } else {
          alert("Something went wrong");
        }
      })
      .catch((err) => {
        toastError(err.response.data.message);
      });
  };

  const handlePriceClick = (row) => {
    return function () {
      // console.log(row.purchase_price, "row._id by Manoj");
      setPriceData(row.purchase_price);
      setShowPriceModal(true);
    };
  };

  const priceColumn = [
    {
      field: "S.NO",
      headerName: "S.NO",
      renderCell: (params) => <div>{priceData.indexOf(params.row) + 1}</div>,
      width: 130,
    },
    {
      field: "price_type",
      headerName: "Price Type",
      width: 200,
      renderCell: (params) => {
        let name = allPriceTypeList?.find(
          (item) => item.price_type_id == params.row.price_type_id
        )?.price_type;
        return <div>{name}</div>;
      },
    },

    {
      field: "price",
      headerName: "Price",
      width: 200,
    },
  ];

  const columns = [
    {
      field: "S.No",
      headerName: "S.No",
      width: 90,
      renderCell: (params) => (
        <strong>{tableData.indexOf(params.row) + 1}</strong>
      ),
    },
    {
      field: "PMS_Platforms_data.platform_name",
      headerName: "Platform Name",
      width: 200,
      renderCell: (params) => (
        <strong>
          {
            platformData.find(
              (e) => e._id == params.row?.PMS_PageMast_data.platform_id
            )?.platform_name
          }
        </strong>
      ),
    },
   
    { field: "price_cal_type", headerName: "Rate Type", width: 200 },
    { field: "variable_type", headerName: "Variable Type", width: 200 },
    {
      field: "purchase_price",
      headerName: "Price",
      width: 200,
      renderCell: ({ row }) => {
        return (
          <div>
            {row.purchase_price && (
              <button
              type="button"
                title="Price"
                onClick={handlePriceClick(row)}
                className="btn btn-outline-primary btn-sm user-button"
              >
                <PriceCheckIcon />
              </button>
            )}
          </div>
        );
      },
    },
    { field: "description", headerName: "Description", width: 200 },
  ];

  const handlePriceChange = (e, index) => {
    setPrice(() => e.target.value);
    rowCount[index].price = +e.target.value;
  };

  const handleFilterPriceType = () => {
    let filteredData = priceTypeList.filter((row) => {
      return !rowCount.some((e) => e.price_type_id == row.price_type_id);
    });
    setFilterPriceTypeList(filteredData);
  };

  const addPriceRow = () => {
    setRowCount((rowCount) => [...rowCount, { price_type_id: "", price: "" }]);
  };

  const handlePriceTypeChange = (e, index) => {
    setPriceTypeId(e.value);
    rowCount[index].price_type_id = e.value;
    handleFilterPriceType();
  };

  return (
    <>
      <FormContainer
        mainTitle="Page Master"
        title="Page Master"
        handleSubmit={handleSubmit}
        submitButton={false}
      >
        <div className="form-group col-6">
          <label className="form-label">
            Platform ID <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData.map((option) => ({
              value: option._id,
              label: option.platform_name,
            }))}
            value={{
              value: platformId,
              label:
                platformData.find((role) => role._id === platformId)
                  ?.platform_name || "",
            }}
            onChange={(e) => {
              setPlatformId(e.value);
            }}
          ></Select>
        </div>

        <div className="form-group col-6 row">
          <label className="form-label">
            Rate Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={["Fixed", "Variable"].map((option) => ({
              value: option,
              label: option,
            }))}
            required={true}
            value={{
              value: rateType.value,
              label: rateType.label,
            }}
            onChange={handleRateTypeChange}
          />
        </div>
        {rateType.label == "Variable" && (
          <div className="form-group col-6 row">
            <label className="form-label">
              Variable Type <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={["Per Thousand", "Per Million"].map((option) => ({
                value: option,
                label: option,
              }))}
              required={true}
              value={{
                value: variableType.value,
                label: variableType.label,
              }}
              onChange={handleVariableTypeChange}
            />
          </div>
        )}
        {/*  <FieldContainer
          label=" Price *"
          required={true}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />*/}
        <FieldContainer
          label="Discription "
          type="text"
          required={false}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="col-12 row">
          {rowCount.map((row, index) => (
            <>
              {" "}
              <div className="form-group col-5 row">
                <label className="form-label">
                  Price Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={filterPriceTypeList.map((option) => ({
                    value: option.price_type_id,
                    label: option.price_type,
                  }))}
                  required={true}
                  value={{
                    label: priceTypeList.find(
                      (role) =>
                        role.price_type_id === rowCount[index].price_type_id
                    )?.price_type,
                    value: rowCount[index].price_type_id,
                  }}
                  onChange={(e) => handlePriceTypeChange(e, index)}
                />
              </div>
              <FieldContainer
                label=" Price *"
                required={true}
                type="number"
                onChange={(e) => handlePriceChange(e, index)}
                value={rowCount[index].price}
              />
              {index != 0 && (
                <button
                  className="btn btn-sm btn-danger mt-4 ml-2  col-1 mb-3"
                  type="button"
                  onClick={() => {
                    setRowCount(
                      (prev) => prev.filter((e, i) => i !== index),
                      handleFilterPriceType()
                    );
                  }}
                >
                  Remove
                </button>
              )}
            </>
          ))}
          <div className="text-center">
            <button
              type="button"
              onClick={addPriceRow}
              className="btn btn-sm btn-primary"
            >
              Add Price
            </button>
          </div>
        </div>

        <div>
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              marginTop: "20px",
              mb: "20px",
            }}
          >
            Submit
          </Button>
        </div>
        <DataGrid
          rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          getRowId={(row) => row._id}
        />
      </FormContainer>

      <Dialog
        open={showPriceModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Price Details"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <DataGrid
              rows={priceData}
              columns={priceColumn}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              getRowId={(row) => row.price_type_id}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
