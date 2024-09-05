import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useGlobalContext } from "../../../Context/Context";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";

const ModalMast = () => {
  const { getBrandDataContext, toastAlert, toastError } = useGlobalContext();
  const [modalName, setModalName] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [brandNameUpdate, setBrandNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [modalId, setModalId] = useState(0);
  const [modalNameUpdate, setModalNameUpdate] = useState("");

  // const [brandData, setBrandData] = useState([]);
  // async function getBrandData() {
  //   const res = await axios.get(
  //     baseUrl+"get_all_asset_brands"
  //   );
  //   setBrandData(res.data.data);
  // }
  // useEffect(() => {
  //   getBrandData();
  // }, []);
  const [totalAssets, setTotalAssets] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
  };
  //Asset Count Modal
  const [assetModal, seAssetModel] = useState(false);
  const handleTotalasset = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_asset_available_count_in_modal/${row}`
      );
      setTotalAssets(response.data.data);
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
        `${baseUrl}` + `get_asset_allocated_count_in_modal/${row}`
      );
      setTotalAssets(response.data.data);
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
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
      name: "Model Name",
      selector: (row) => row.asset_modal_name,
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
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="icon-1"
            data-toggle="modal"
            data-target="#exampleModal"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleBrandData(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <DeleteButton
            endpoint="delete_asset_modal"
            id={row._id}
            getData={getModalData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modalName || modalName == "") {
      return toastError("Model Name is Required");
    } else if (!brandName || brandName == "") {
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
          asset_brand_id: brandName,
        });
        toastAlert("Model Created");
        setModalName("");
        setBrandName("");
        getModalData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function getModalData() {
    const res = await axios.get(baseUrl + "get_all_asset_modals");
    setModalData(res.data);
    setModalFilter(res.data);
  }

  useEffect(() => {
    getModalData();
  }, []);

  const handleBrandData = (row) => {
    setIsUpdateModalOpen(true);
    setModalId(row._id);
    setModalNameUpdate(row.asset_modal_name);
    setBrandNameUpdate(row.asset_brand_id);
  };
  const handleModalUpdate = () => {
    if (!modalNameUpdate || modalNameUpdate == "") {
      toastError("Modal Name is Required");
      return;
    }
    axios
      .put(baseUrl + "update_asset_modal", {
        asset_modal_id: modalId,
        asset_brand_id: brandNameUpdate,
        asset_modal_name: modalNameUpdate,
      })
      .then((res) => {
        getModalData();
        closeUpdateModal();
      });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.asset_brand_name
        ?.toLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setModalFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Model"
          title="Add Model"
          handleSubmit={handleSubmit}
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
                value: brandName,
                label:
                  getBrandDataContext.find((user) => user._id === brandName)
                    ?.asset_brand_name || "",
              }}
              onChange={(e) => {
                setBrandName(e.value);
              }}
              required
            />
          </div>
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Model Overview"
              columns={columns}
              data={modalFilter}
              fixedHeader
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
        className={`modal fade ${isUpdateModalOpen ? "show" : ""}`}
        // id="exampleModal"
        tabIndex={-1}
        role="dialog"
        style={{ display: isUpdateModalOpen ? "block" : "none" }}
        aria-labelledby="exampleModalLabel"
        // aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Model Update
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={() => closeUpdateModal()}>
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Model Name"
                fieldGrid={12}
                value={modalNameUpdate}
                onChange={(e) => setModalNameUpdate(e.target.value)}
              ></FieldContainer>
              <div className="form-group col-12">
                <label className="form-label">
                  Brand Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={getBrandDataContext.map((opt) => ({
                    value: opt._id,
                    label: opt.asset_brand_name,
                  }))}
                  value={{
                    value: brandNameUpdate,
                    label:
                      getBrandDataContext.find(
                        (user) => user._id === brandNameUpdate
                      )?.asset_brand_name || "",
                  }}
                  onChange={(e) => {
                    setBrandNameUpdate(e.value);
                  }}
                  required
                />
              </div>
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
                onClick={handleModalUpdate}
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
            height: "max-content",
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
                cell: (row, index) => <div>{index + 1}</div>,
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
            pagination
            // subHeaderComponent={
            //   <input
            //     type="text"
            //     placeholder="Search..."
            //     className="w-50 form-control"
            //     value={modalSearch}
            //     onChange={(e) => setModalSearch(e.target.value)}
            //   />
            // }
          />
        </div>
        {/* )} */}
      </Modal>
    </div>
  );
};

export default ModalMast;
