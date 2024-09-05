import React, { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../../AdminPanel/DeleteButton";
import Modal from "react-modal";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const AssetCategoryOverview = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [inWarranty, setInWarranty] = useState("");
  const warranty = ["Yes", "No"];
  // const [selectedRow, setSelectedRow] = useState(null);

  // Modal State
  const [catId, setCatId] = useState(0);
  const [categoryName, setCategoryName] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [totalAssets, setTotalAssets] = useState([]);

  //Asset Count Modal
  const [assetModal, seAssetModel] = useState(false);
  const [subcategoryCount, setSubcategroycount] = useState([]);

  const [handleOpenSubCat, setHandleOpenSubCat] = useState(false);

  const [subCategoryData, setSubCategoryData] = useState([]);

  const handleSubCategroy = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_count_sub_category/${row}`
      );
      setSubcategroycount(response.data.data?.sub_categories);
      setHandleOpenSubCat(true);
    } catch (error) {
      console.log(error, "sub cat api not working");
    }
  };
  const handleTotalasset = async (row) => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_total_asset_in_category/${row}`
      );
      setTotalAssets(response?.data.data);
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
        `${baseUrl}` + `get_total_asset_in_category_allocated/${row}`
      );
      setTotalAssets(response?.data.data);
      seAssetModel(true);
    } catch (error) {
      console.log("total asset not working", error);
    }
  };

  const getSubCategoryData = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_asset_sub_category");
      setSubCategoryData(response.data.data);
    } catch (error) {
      // toastAlert("Data not submitted", error.message);
      return null;
    }
  };
  useEffect(() => {
    getData();
    getSubCategoryData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inWarranty || inWarranty == "") {
      toastError("In Warranty is Required");
      return;
    }
    try {
      const isSubCategoryExist = subCategoryData.some(
        (d) => d.sub_category_name === subCategoryName
      );
      if (isSubCategoryExist) {
        alert("Sub Category already Exists");
      } else {
        const response = await axios.post(baseUrl + "add_asset_sub_category", {
          sub_category_name: subCategoryName,
          category_id: catId,
          inWarranty: inWarranty,
          // description: description,
          // created_by: loginUserId,
        });
        if (response.status === 200) {
          handleCloseModal();
          toastAlert("Data  posted successfully!");
          getData();
        }
        setSubCategoryName("");
        setInWarranty("");
      }
    } catch (error) {
      // toastAlert(error.message);
    }
  };

  useEffect(() => {
    const result = data?.filter((d) => {
      return d.category_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_asset_category");

      setFilterData(response.data.data?.asset_categories);
      setData(response.data.data?.asset_categories);
    } catch (error) {
      // toastAlert("Data not submitted", error.message);
      return null;
    }
  };

  const handleRowClick = (row) => {
    setCategoryName(row.category_name);
    setCatId(row.category_id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Add Sub Category",
      cell: (row) => (
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => handleRowClick(row)}
          title="Add Sub Category"
        >
          <i className="bi bi-plus"></i>
        </button>
      ),
    },
    {
      name: "Sub Category",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleSubCategroy(row.category_id)}
        >
          {row.sub_category_count}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Available Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleTotalasset(row.category_id)}
        >
          {row.available_assets_count}
        </button>
      ),
      sortable: true,
    },
    {
      name: "Allocated Asset",
      cell: (row) => (
        <button
          className="btn btn-outline-warning"
          onClick={() => handleAllocatedAsset(row.category_id)}
        >
          {row.allocated_assets_count}
        </button>
      ),
      sortable: true,
    },
    // {
    //   name: "Description",
    //   selector: (row) => row.description,
    //   sortable: true,
    // },

    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/asset-category-update/${row.category_id}`}>
            <div
              title="Edit"
              className="icon-1"
            >
              <i className="bi bi-pencil"></i>
            </div>
          </Link>
          <DeleteButton
            endpoint="delete_asset_category"
            id={row.category_id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleCloseSubCat = () => {
    setHandleOpenSubCat(false);
  };

  return (
    <>
      <div>
        <UserNav />
        <div className="section section_padding sec_bg h100vh">
          <div className="container master-card-css">
            <div className="action_heading">
              <div className="action_title">
                <FormContainer
                  mainTitle="Asset Category"
                  link="/asset-category-master"
                  submitButton={false}
                />
              </div>
              <div className="action_btns">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/admin/asset-dashboard">Dashboard</Link>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/asset/subCategory/overview">Sub Category</Link>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                >
                  <Link to="/asset-category-master">Add</Link>
                </button>
              </div>
            </div>
            <div className="">
              <div className="card mb-1">
                <div className="card-header sb">
                  <h5>Asset Category</h5>
                  <input
                          type="text"
                          placeholder="Search here"
                          className="w-50 form-control "
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                </div>
                <div className="card-body body-padding">
                  <DataTable
                   
                    columns={columns}
                    data={filterData}
                    // fixedHeader
                    pagination
                    // fixedHeaderScrollHeight="64vh"
                    exportToCSV
                    highlightOnHover
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
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
              onClick={handleCloseModal}
            >
              X
            </button>
          </div>
          <FormContainer
            mainTitle="Sub Category"
            title="Create Sub Category "
            handleSubmit={handleSubmit}
            buttonAccess={false}
          >
            <FieldContainer
              label="Sub Category"
              value={subCategoryName}
              astric
              onChange={(e) => setSubCategoryName(e.target.value)}
            />

            <FieldContainer
              disabled
              label="Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <div className="form-group col-6">
              <label className="form-label">
                In Warranty <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                className=""
                options={warranty.map((option) => ({
                  value: `${option}`,
                  label: `${option}`,
                }))}
                value={{
                  value: inWarranty,
                  label: `${inWarranty}`,
                }}
                onChange={(e) => {
                  setInWarranty(e.value);
                }}
                required
              />
            </div>
          </FormContainer>
        </div>
        {/* )} */}
      </Modal>
      {/* Total no of asset */}

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

      {/* Sub Category modal here  */}
      <Modal
        isOpen={handleOpenSubCat}
        onRequestClose={handleCloseSubCat}
        style={{
          content: {
            width: "max-content",
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
              onClick={handleCloseSubCat}
            >
              X
            </button>
          </div>
         
          <DataTable
            columns={[
              {
                name: "S.No",
                cell: (row, index) => <div>{index + 1}</div>,
               width: "100px",
              },
              {
                name: "Sub Category Name",
               
                selector: (row) => row.sub_category_name,
                width: "300px",
              },
              // { name: "Category Name", selector: (row) => row.category_name },
            ]}
            data={subcategoryCount}
            highlightOnHover
            subHeader
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
    </>
  );
};

export default AssetCategoryOverview;
