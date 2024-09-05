import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";

export default function PMSpriceTypeMast() {
  const { toastAlert , toastError } = useGlobalContext();
  const [priceType, setPriceType] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowData, setRowData] = useState({});
  const [priceTypeUpdate, setPriceTypeUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");
  const [platformData, setPlatformData] = useState([]);
  const [platformId, setPlatformId] = useState("");


  const token = sessionStorage.getItem("token");
  const userID = jwtDecode(token).id;

  useEffect(() => {
    const result = data.filter((d) => {
      return d.price_type.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(baseUrl + "addPrice", {
        price_type: priceType,
      description: description,
      created_by: userID,
      platform_id: platformId
    })
    .then(() => {
      // setIsFormSubmitted(true);
      toastAlert("Submitted");
      setPriceType("")
      setDescription("")
      getData()
    }).catch((error) => {
      toastError(error.response.data.message);
    });
  };
  

  const getData = () => {
    axios.get(baseUrl + "getPriceList").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
    axios.get(baseUrl + "getAllPlatform").then((res) => {
      setPlatformData(res.data.data);
    });
  };

  const handleRowData = (row) => {
    setRowData(row);
    setPriceTypeUpdate(row.price_type);
    setDescriptionUpdate(row.description);
  };

  const handleModalUpdate = () => {
    if (priceTypeUpdate === "") {
      toastError("Please fill all the fields");
      return;
    }
    axios
      .put(baseUrl + `updatePrice/${rowData._id}`, {
        price_type: priceTypeUpdate,
        description: descriptionUpdate,
        updated_by: userID,
      })
      .then(() => {
        toastAlert("Successfully Update");
        getData();
        setPriceTypeUpdate("");
        setDescriptionUpdate("");
      });
  };


  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
  {
   name:"Platform",
   cell:(row) => (
      <div>
        {platformData.find((platform) => platform._id === row.platform_id)?.platform_name}
      </div>
    ) 
  },
    {
      name: "Pay Type",
      selector: (row) => row.price_type,
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
            <FaEdit />{" "}
          </button>
          <DeleteButton endpoint="deletePrice" id={row._id} getData={getData} />
        </>
      ),
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Price Master"
        title="Price Master"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-6">
          <label className="form-label">
            Platform ID <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformData?.map((option) => ({
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
        <FieldContainer
          label="Price Type *"
          value={priceType}
          required={true}
          onChange={(e) => setPriceType(e.target.value)}
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
            <div className="modal-body">
              <FieldContainer
                label="Pay Cycle *"
                value={priceTypeUpdate}
                required={true}
                onChange={(e) => setPriceTypeUpdate(e.target.value)}
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
                data-dismiss={`${priceTypeUpdate === "" ?"": 'modal'}`}
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
