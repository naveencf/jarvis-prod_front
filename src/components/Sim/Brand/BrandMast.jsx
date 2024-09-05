import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";

const BrandMast = () => {
  const { toastAlert, toastError, getBrandDataContext } = useGlobalContext();
  const [brandName, setBrandName] = useState("");
  const [brnadData, setBrandData] = useState([]);
  const [Brnadfilter, setBrnadFilter] = useState([]);
  const [search, setSearch] = useState("");

  const [brandId, setBrandId] = useState(0);
  const [brandNameUpdate, setBrandNameUpdate] = useState("");

  const [totalAssets, setTotalAssets] = useState([]);
  //Asset Count Modal
  const [assetModal, seAssetModel] = useState(false);
  const [brandNameModal, setBrandNameModal] = useState("");

  const [modalName, setModalName] = useState("");
  const [isAddModalOpen, setIsOpenAddModal] = useState(false);
  const handleCloseAddModalModal = () => {
    setIsOpenAddModal(false);
  };

  const [isUpdateBrandOpen, setIsUpdateBrandOpen] = useState(false);
  const closeUpdateBrandModal = () => {
    setIsUpdateBrandOpen(false);
  };

  const handleRowClick = (row) => {
    console.log(row.asset_brand_name, "row hai ");
    setBrandNameModal(row._id);
    setIsOpenAddModal(true);
  };

  const handleTotalasset = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_asset_available_count_in_brand/${row}`
      );
      setTotalAssets(response?.data.data);
      console.log(response.data.data, "response here ");
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
    }
  };
  const handleClosAssetCounteModal = () => {
    seAssetModel(false);
  };

  const handleAllocatedAsset = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_asset_allocated_count_in_brand/${row}`
      );
      setTotalAssets(response.data.data);
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
    }
  };

  const [modalData, setModalData] = useState([]);
  async function getModalData() {
    const res = await axios.get(baseUrl + "get_all_asset_modals");
    setModalData(res.data);
  }
  useEffect(() => {
    getModalData();
  }, []);

  const handleAddModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalName || modalName == "") {
      return toastError("Modal Name is Required");
    } else if (!brandNameModal || brandNameModal == "") {
      return toastError("Brand Name is Required");
    }
    try {
      const isModalExists = modalData.some(
        (d) => d.asset_modal_name === modalName
      );
      if (isModalExists) {
        alert("Brand already Exists");
      } else {
        const response = await axios.post(baseUrl + "add_asset_modal", {
          asset_modal_name: modalName,
          asset_brand_id: brandNameModal,
        });
        toastAlert("Modal Created");
        setModalName("");
        setBrandName("");
        setIsOpenAddModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Brand Name",
      selector: (row) => row.asset_brand_name,
      sortable: true,
    },
    {
      name: "Available Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleTotalasset(row._id)}
        >
          {row.total_available_asset}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Allocated Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleAllocatedAsset(row._id)}
        >
          {row.total_allocated_asset}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Add Model",
      cell: (row) => (
        <>
          <button
            className="btn btn-outline-success"
            onClick={() => handleRowClick(row)}
          >
            Add Model
          </button>
        </>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="icon-1"
            data-toggle="modal"
            // data-target="#exampleModal"
            // size="small"
            // variant="contained"
            // color="primary"
            onClick={() => handleBrandData(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <DeleteButton
            endpoint="delete_asset_brand"
            id={row._id}
            getData={getBrandData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isBrandExist = brnadData.some(
        (d) => d.asset_brand_name === brandName
      );
      if (isBrandExist) {
        alert("Brand already Exists");
      } else {
        const response = await axios.post(baseUrl + "add_asset_brand", {
          asset_brand_name: brandName,
        });
        toastAlert("Brand Created");
        setBrandName("");
        getBrandData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function getBrandData() {
    const res = await axios.get(baseUrl + "get_all_asset_brands");
    setBrandData(res.data.data);
    setBrnadFilter(res.data.data);
  }

  useEffect(() => {
    getBrandData();
  }, []);

  const handleBrandData = (row) => {
    setIsUpdateBrandOpen(true);
    setBrandId(row._id);
    setBrandNameUpdate(row.asset_brand_name);
  };
  const handleBrandUpdate = () => {
    if (!brandNameUpdate || brandNameUpdate == "") {
      toastError("Brand Name is Required");
      return;
    }
    axios
      .put(baseUrl + "update_asset_brand", {
        asset_brand_id: brandId,
        asset_brand_name: brandNameUpdate,
      })
      .then((res) => {
        getBrandData();
        toastAlert("Updated Successfully");
        closeUpdateBrandModal();
      });
  };

  useEffect(() => {
    const result = brnadData.filter((d) => {
      return d.asset_brand_name
        ?.toLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setBrnadFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Brand"
          title="Add Brand"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Brand Name"
            astric
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Brand Overview"
              columns={columns}
              data={Brnadfilter}
              fixedHe ader
              pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
      {/* Update  */}
      <div
        // className="modal fade"
        className={`modal fade ${isUpdateBrandOpen ? "show" : ""}`}
        id="exampleModal"
        tabIndex={-1}
        // role="dialog"
        // aria-labelledby="exampleModalLabel"
        style={{ display: isUpdateBrandOpen ? "block" : "none" }}
        // aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Brand Update
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span
                  aria-hidden="true"
                  onClick={() => closeUpdateBrandModal()}
                >
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Brand Name"
                fieldGrid={12}
                value={brandNameUpdate}
                onChange={(e) => setBrandNameUpdate(e.target.value)}
              ></FieldContainer>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button> */}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleBrandUpdate}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={assetModal}
        onRequestClose={handleClosAssetCounteModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {/* {selectedRow && ( */}
        <div>
          <div className="d-flex justify-content-end mb-2">
            {/* <h2>Department: {selectedRow.dept_name}</h2> */}

            <button
              className="btn btn-success float-left"
              onClick={handleClosAssetCounteModal}
            >
              X
            </button>
          </div>
          <h1></h1>
          <DataTable
            columns={[
              {
                name: "S.No",
                selector: (row, index) => <div>{index + 1}</div>,
                width: "10%",
              },
              { name: "Asset Name", selector: (row) => row.assetsName },
              { name: "Asset ID", selector: (row) => row.asset_id },
              { name: "Asset Type", selector: (row) => row.asset_type },
              { name: "Category Name", selector: (row) => row.category_name },
              {
                name: "Sub Category Name",
                selector: (row) => row.sub_category_name,
              },
              { name: "Status", selector: (row) => row.status },
            ]}
            data={totalAssets}
            highlightOnHover
            subHeader
          />
        </div>
        {/* )} */}
      </Modal>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={handleCloseAddModalModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {/* {selectedRow && ( */}
        <div>
          <div className="d-flex justify-content-end mb-2">
            {/* <h2>Department: {selectedRow.dept_name}</h2> */}

            <button
              className="btn btn-success float-left"
              onClick={handleCloseAddModalModal}
            >
              X
            </button>
          </div>
          <FormContainer
            mainTitle="Sub Category"
            title="Create Sub Category "
            // handleSubmit={handleSubmit}
            submitButton={false}
            buttonAccess={false}
          >
            <FieldContainer
              label="Model Name"
              value={modalName}
              astric
              required={false}
              onChange={(e) => setModalName(e.target.value)}
            />
            <div className="form-group col-6">
              <label className="form-label">
                Brand Name <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={getBrandDataContext.map((opt) => ({
                  value: opt._id,
                  label: opt.asset_brand_name,
                }))}
                value={{
                  value: brandNameModal,
                  label:
                    getBrandDataContext.find(
                      (user) => user._id === brandNameModal
                    )?.asset_brand_name || "",
                }}
                onChange={(e) => {
                  setBrandNameModal(e.value);
                }}
                isDisabled
                required
              />
            </div>
            <div className="form-group col-2">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAddModalSubmit}
              >
                Submit
              </button>
            </div>
          </FormContainer>
        </div>
        {/* )} */}
      </Modal>
    </div>
  );
};

export default BrandMast;
