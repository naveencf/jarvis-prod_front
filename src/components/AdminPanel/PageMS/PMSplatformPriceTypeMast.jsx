import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import DataTable from "react-data-table-component";
import { Autocomplete, TextField } from "@mui/material";
import Select from "react-select";

export default function PMSplatformPriceTypeMast() {
  const { toastAlert, toastError } = useGlobalContext();
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [priceTypeId, setPriceTypeId] = useState("");
  const [platformUpdateId, setPlatformUpdateId] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [rowData, setRowData] = useState({});
  const [platformPriceType, setPlatformPriceType] = useState({
    value: "",
    priceType: "",
  });
  const [description, setDescription] = useState("");
  const [priceList, setPriceList] = useState([]);
  const [platformList, setPlatformList] = useState([]);
  const [Platform, setPlatform] = useState({
    value: "",
    platformName: "",
  });
  const token = sessionStorage.getItem("token");
  const userID = jwtDecode(token).id;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.PMS_Pricetypes_data.price_type
        ?.toLowerCase()
        .includes(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl + "addPlatformPrice", {
        price_type_id: platformPriceType.value,
        platform_id: Platform.value,
        description: description,
        created_by: userID,
      })
      .then(() => {
        toastAlert("Submitted");
        setPlatformPriceType({ value: "", priceType: "" });
        setDescription("");
        setPlatform("");
        setPriceTypeId("");
        setDescriptionUpdate("");
        setPlatformUpdateId("");
        setPlatform({ value: "", platformName: "" });
        getData();
        setPlatformPriceType({
          value: "",
          priceType: "",
        });
      })
      .catch((error) => {
        toastError("Something went wrong! Please try again later.");
      });
  };

  const getData = () => {
    axios.get(baseUrl + "getPlatformPriceList").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });

    axios.get(baseUrl + "getPriceList").then((res) => {
      setPriceList(res.data.data);
    });

    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformList(res.data.data);
    });
  };

  const handleRowData = (row) => {
    let platform = platformList.find(
      (option) => option.platform_name === row.PMS_Platform_data.platform_name,
      "platformList"
    );
    setDescriptionUpdate(row.description);
    setPlatform({
      value: platform._id,
      platformName: platform.platform_name,
    });
    setPriceTypeId({
      value: row.PMS_Pricetypes_data.pmsPriceType_id,
      priceType: row.PMS_Pricetypes_data.price_type,
    });
    setRowData(row);
  };

  const handleModalUpdate = () => {
    // console.log(priceTypeId, "priceTypeId");
    if (priceTypeId == null ) {
      toastError("Please select the value");
      return;
    }else if (Platform == null) {
      toastError("Please select the value");
      return;
    }
    axios
      .put(baseUrl + `updatePlatformPrice/${rowData._id}`, {
        platform_id: Platform.value,
        price_type_id: priceTypeId.value,
        description: descriptionUpdate,
        updated_by: userID,
      })
      .then(() => {
        toastAlert("Successfully Update");
        setPlatformUpdateId(" ");
        setPriceTypeId(" ");
        setDescriptionUpdate(" ");
        getData();
      });
  };

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Price Type",
      selector: (row) => row.PMS_Pricetypes_data.price_type,
    },
    {
      name: "Platform",
      selector: (row) => row.PMS_Platform_data.platform_name,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleRowData(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="deletePlatformPrice"
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Platform Price Master"
        title="Platform Price Master"
        handleSubmit={handleSubmit}
      >
        <Autocomplete
          id="price-type-autocomplete"
          options={priceList.map((option) => ({
            priceType: option.price_type,
            value: option._id,
          }))}
          value={platformPriceType}
          getOptionLabel={(option) => option.priceType}
          style={{ width: 300 }}
          onChange={(e, value) => {
            setPlatformPriceType(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Price Type *" variant="outlined" />
          )}
        />

        <Autocomplete
          id="platform-autocomplete"
          options={platformList.map((option) => ({
            platformName: option.platform_name,
            value: option._id,
          }))}
          value={Platform}
          getOptionLabel={(option) => option.platformName || ""}
          style={{ width: 300 }}
          onChange={(e, value) => {
            setPlatform(value);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Platform *" variant="outlined" />
          )}
        />

        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Pay Cycle Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

      <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Update</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div className="modal-body row justify-content-cneter">
              <Autocomplete
                className="mb-3"
                id="price-type-autocomplete-update"
                options={priceList.map((option) => ({
                  priceType: option.price_type,
                  value: option._id,
                }))}
                value={priceTypeId}
                getOptionLabel={(option) => option.priceType}
                style={{ width: 300 }}
                onChange={(e, value) => {
                  setPriceTypeId(value); // Ensure to handle the case when value is null
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Price Type *"
                    variant="outlined"
                  />
                )}
              />
              <Autocomplete
                id="platform-autocomplete"
                options={platformList.map((option) => ({
                  platformName: option.platform_name,
                  value: option._id,
                }))}
                value={Platform}
                getOptionLabel={(option) => option.platformName || ""}
                style={{ width: 300 }}
                onChange={(e, value) => {
                  setPlatform(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Platform *"
                    variant="outlined"
                  />
                )}
              />

              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                required={false}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleModalUpdate}
                data-dismiss={
                  priceTypeId === null || Platform === null ? "" : "modal"
                }
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
