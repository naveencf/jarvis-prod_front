import "./assetDashbaord.css";
import { baseUrl } from "../../utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import Modal from "react-modal";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Select from "react-select";

import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

const AssetDashboard = () => {
  const [simData, setSimData] = useState([]);
  const [availableObjects, setAvailableCount] = useState([]);
  const [allocatedObjects, setAllocatedCount] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [modalSearch, setModalSearch] = useState("");

  const [category, setCategory] = useState("");
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [subcategory, setSubCategory] = useState("");
  const [newAssetRequest, setNewAssetRequest] = useState([]);
  const [returnAssetData, setReturnAssetData] = useState([]);
  const [repairRequestData, setRepairRequestData] = useState([]);

  const [categoryData, setCategoryData] = useState([]);
  const [filterCategoryData, setFilterCategoryData] = useState([]);

  async function getNewAssetData() {
    try {
      const response = await axios.get(`${baseUrl}assetrequest`);
      setNewAssetRequest(
        response.data.data?.filter((d) => d.asset_request_status == "Requested")
      );
    } catch (error) {
      console.log(error);
    }
  }

  const getAllAssetCategory = () => {
    axios.get(baseUrl + "get_all_asset_category").then((res) => {
      setCategoryData(res?.data.data.asset_categories);
      setFilterCategoryData(res?.data.data.asset_categories);
    });
  };
  useEffect(() => {
    getAllAssetCategory();
  }, []);

  async function getRepariRequestData() {
    try {
      const response = await axios.get(`${baseUrl}show_asset_hr_data`);
      setRepairRequestData(
        response.data.data?.filter((d) => d.status == "Requested")
      );
    } catch (error) {
      console.log(error);
    }
  }
  const getReturnAssetData = () => {
    axios.get(`${baseUrl}assetreturn`).then((res) => {
      setReturnAssetData(res.data.singleAssetReturnRequest);
    });
  };
  useEffect(() => {
    getNewAssetData();
    getRepariRequestData();
    getReturnAssetData();
  }, []);

  const getSubCategoryData = () => {
    if (category) {
      axios
        .get(`${baseUrl}get_single_asset_sub_category/${category}`)
        .then((res) => {
          setSubCategoryData(res.data);
          const filtersubcat = subcategory
            ? res.data?.filter((item) => item.sub_category_id === subcategory)
            : res.data;
          setDepartmentData(filtersubcat);
        });
    }
  };
  useEffect(() => {
    getSubCategoryData();
  }, [category]);

  function getData() {
    axios.get(`${baseUrl}get_all_sims`).then((res) => {
      setSimData(res.data.data);

      const availableObjects = res.data.data.filter(
        (item) => item.status === "Available"
      );
      setAvailableCount(availableObjects);

      const allocatedObjects = res.data.data.filter(
        (item) => item.status === "Allocated"
      );
      setAllocatedCount(allocatedObjects);
    });
    axios.get(`${baseUrl}get_asset_department_count`).then((res) => {
      setDepartmentData(res.data.data);

      const filteredDatas = category
        ? res.data.data?.filter((item) => item.category_id === category)
        : res.data.data;
      setDepartmentData(filteredDatas);
    });
  }

  useEffect(() => {
    getData();
  }, [category]);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    axios.get(`${baseUrl}get_asset_users_of_dept/${row}`).then((res) => {
      setSelectedUserData(res.data.data);
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      // alignItems: "center",
      flexDirection: "column",
      gap: "16px",
      width: "100%",
    }}>
      <div className="section section_padding " style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
      }}>
        <div className="" style={{
          display: "flex",
          justifyContent: "center",
          // alignItems: "center",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
        }}>
          <div className="action_heading">
            <div className="action_title">
              <FormContainer
                mainTitle="Assets Dashboard"
                link="/sim-dashboard"
              />
            </div>
          </div>
          
          <div className="card asset-card body-padding ">
           


            <div className=" flex-direct">
              <div className="Asset-info-card d_infocard_col">
                <Link to={`/sim-overview/${0}`}>
                  <div
                    className=" card shadow "
                    style={{
                      background: "#88EF98"
                    }}
                  >
                    <div className="card-body sb ">
                      <div className="pack gap">

                        <div className="asset-d_infocard_icon">
                          <h1>{simData.length}</h1>
                        </div>
                        <div className="asset-d_infocard_txt">
                          <h3>Total</h3>
                        </div>
                      </div>
                      <i class="bi bi-box-arrow-up-right"></i>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="Asset-info-card d_infocard_col">
                <Link to={`/sim-overview/${1}`}>
                  <div
                    className="card shadow "
                    style={{
                      background: "#EB846C"
                    }}
                  >
                    <div className="card-body sb ">
                      <div className="pack gap"> 
                      <div className="asset-d_infocard_icon">
                        <h1>{availableObjects.length}</h1>
                      </div>
                      <div className="asset-d_infocard_txt">
                        <h3>Available</h3>
                      </div>
                      </div>
                      <i class="bi bi-box-arrow-up-right"></i>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="Asset-info-card d_infocard_col">
                <div
                  className="card shadow "
                  style={{
                    background: "#EFC973"
                  }}
                >
                  <Link to={`/sim-overview/${2}`}>
                    <div className="card-body sb">
                      <div className="pack gap">

                     
                      <div className="asset-d_infocard_icon">
                        <h1>{allocatedObjects.length}</h1>
                      </div>
                      <div className="asset-d_infocard_txt">
                        <h3>Allocated</h3>
                        {/* <SimOverview allocated={isAllocation} /> */}
                      </div>
                      </div>
                      <i class="bi bi-box-arrow-up-right"></i>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="card asset-card body-padding ">
            <div className="pack sb">
          <h1>Asset Details</h1>
          <Link to="/admin/asset_summary">
          <button className="btn btn-primary sb" style={{justifyContent:"center", alignItems:"center",gap:"10px"}}>Asset Summary <i className="bi bi-file-earmark-text"></i></button>
          </Link>
          </div>
          </div>
          <div className="asset_chart">
            <div className="card" style={{
              width: "50%",
              height: "100%",
            }}>
            <div className="chart_container body-padding">
            <h5 style={{ fontWeight: "600",color:"var(--gray-700)" }}>
                Total Asset - {simData.length}
              </h5>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: availableObjects.length,
                        label: "Available",
                        color: "rgb(184, 0, 216)",
                      },
                      {
                        id: 1,
                        value: allocatedObjects.length,
                        label: "Allocated",
                      },
                    ],
                    innerRadius: 30,
                    outerRadius: 70,
                    cornerRadius: 5,
                    paddingAngle:1,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                    
                  },
                ]}
                height={200}
              />
              
            </div>
            </div>
            
            <div className="chart_container p-0" style={{width:"50%",height:"100% "}}>
              <div className="card">
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "New Asset Request",
                      "Repair Request",
                      "Return Asset Request",
                    ],
                  },
                ]}
                series={[
                  {
                    data: [
                      newAssetRequest.length,
                      repairRequestData.length,
                      returnAssetData.length,
                    ],
                  },
                  { data: [] },
                  // { data: [2, 5, 6] },
                ]}
                width={600}
                height={300}
              />
            </div>
            </div>

            {/* ----------------------------------------------- */}

            {/* <div
              className="panel panel-default bootcards-summary p-3"
              style={{
                background: "ligh",
                borderRadius: "50px",
              }}
            >
              
                <i className="fa fa-3x fa-bar-chart"></i>
                <h4>Asset Summary</h4>
              
            </div> */}
          </div>

          
          <div className="row">
            <div className="form-group col-2">
              <label className="form-label">
                Department Name<sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={[
                  { value: "", label: "All" },
                  ...departmentData.map((option) => ({
                    value: option.dept_id,
                    label: option.dept_name,
                  })),
                ]}
                value={
                  departmentFilter === ""
                    ? { value: "", label: "All" }
                    : {
                      value: departmentFilter,
                      label:
                        departmentData.find(
                          (dept) => dept.dept_id === departmentFilter
                        )?.dept_name || "Select...",
                    }
                }
                onChange={(selectedOption) => {
                  const selectedValue = selectedOption
                    ? selectedOption.value
                    : "";
                  setDepartmentFilter(selectedValue);
                }}
              />
            </div>
            {/* <div className="form-group col-2">
              <label className="form-label">
                Category <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={[
                  { value: "", label: "All" },
                  ...filterCategoryData.map((option) => ({
                    value: option.category_id,
                    label: option.category_name,
                  })),
                ]}
                value={
                  category === ""
                    ? { value: "", label: "All" }
                    : {
                        value: category,
                        label:
                          filterCategoryData.find(
                            (dept) => dept.category_id === category
                          )?.category_name || "Select...",
                      }
                }
                onChange={(selectedOption) => {
                  const selectedValues = selectedOption
                    ? selectedOption.value
                    : "";
                  setCategory(selectedValues);
                  // if (selectedValues === "") {
                  //   getData();
                  // }
                }}
              />
            </div>
            <div className="form-group col-2">
              <label className="form-label">
                Sub Category <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                className=""
                options={[
                  { value: "", label: "All" },
                  ...subcategoryData.map((option) => ({
                    value: option.sub_category_id,
                    label: `${option.sub_category_name}`,
                  })),
                ]}
                value={
                  subcategory === ""
                    ? { value: "", label: "All" }
                    : {
                        value: subcategory,
                        label:
                          subcategoryData.find(
                            (sub) => sub.sub_category_id === subcategory
                          )?.sub_category_name || "Select...",
                      }
                }
                onChange={(select) => {
                  const selectsub = select ? select.value : "";
                  setSubCategory(selectsub);
                  if (selectsub === "") {
                    getData();
                  }
                }}
                required
              />
            </div> */}
          </div>
          <div className="row">
            {departmentData.map((item) => {
              // Conditionally render the department card based on the filter
              if (
                departmentFilter === "" ||
                departmentFilter === item.dept_id
              ) {
                return (
                  <div
                    key={item.dept_id}
                    className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col"
                  >
                    <div
                      className="d_infocard card shadow"
                      onClick={() => handleRowClick(item.dept_id)}
                    >
                      <div className="card-body">
                        <div className="d_infocard_txt">
                          <h3>Deparmtent -{item.dept_name}</h3>
                          {/* <h3>category -{item.category_name}</h3> */}
                        </div>
                        <div className="d_infocard_icon">
                          <span>{item.count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null; // Return null for departments that don't match the filter
            })}
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
        {selectedRow && (
          <div>
            <div className="d-flex justify-content-between mb-2">
              <h2>Assigned Assets User Name</h2>
              <button
                className="btn btn-success float-left"
                onClick={handleCloseModal}
              >
                X
              </button>
            </div>
            <div className="card">
              <div className="card-header sb">
               <h5>Assigned Assets</h5>
              <input
                  type="text"
                  placeholder="Search..."
                  className="w-50 form-control"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              </div>
              <div className="card-body body padding">
              <DataTable
              columns={[
                {
                  name: "S.No",
                  cell: (row, index) => <div>{index + 1}</div>,
                  width: "10%",
                },
                { name: "Name", selector: (row) => row.user_name },
                { name: "Asset Name", selector: (row) => row.asset_name },
                { name: "Category Name", selector: (row) => row.category_name },
                {
                  name: "SubCategory Name",
                  selector: (row) => row.sub_category_name,
                },
                { name: "Department Name", selector: (row) => row.dept_name },
              ]}
              data={selectedUserData.filter((user) =>
                user.user_name.toLowerCase().includes(modalSearch.toLowerCase())
              )}
              pagination
              selectableRows
            />
              </div>
            </div>
            
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AssetDashboard;
