import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Autocomplete, TextField } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import Swal from "sweetalert2";

const AssetSingleuserOverview = ({
  filterData,
  hardRender,
  tab,
  newAssetRequestData,
  newRequestAPIRender,
}) => {
  const { usersDataContext, getAssetDataContext, toastAlert, toastError } =
    useGlobalContext();
  const { userID } = useAPIGlobalContext();
  const [reasonData, setReasonData] = useState([]);
  const [reason, setReason] = useState("");
  const [assetsName, setAssetName] = useState("");
  const [repairDate, setRepairDate] = useState("");
  const [priority, setPriority] = useState("");
  const [assetsImg1, setAssetsImg1] = useState(null);
  const [assetsImg2, setAssetsImg2] = useState(null);
  const [assetsImg3, setAssetsImg3] = useState(null);
  const [assetsImg4, setAssetsImg4] = useState(null);
  const [problemDetailing, setProblemDetailing] = useState("");
  const [tagUser, setTagUser] = useState([]);
  const PriorityData = ["Low", "Medium", "High", "Urgent"];

  // Return Asset
  const [returnRemark, setReturnRemark] = useState("");
  const [returnImage1, setReturnImage1] = useState(null);
  const [returnImage2, setReturnImage2] = useState(null);
  const [assetSubCategroyData, setAssetSubCategoryData] = useState([]);
  const [repairAssetId, setRepairAssetId] = useState("");

  const [newAssetID, setNewAssetID] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [assetId, setAssetId] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const closeRepairModal = () => {
    setIsRepairModalOpen(false);
  };

  async function getRepairReason() {
    const res = await axios.get(baseUrl + "get_all_assetResons");

    setReasonData(res?.data.data);
  }

  const getAssetSubCategory = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_asset_sub_category");

      setAssetSubCategoryData(response.data.data);
    } catch (error) {
      toastAlert("Data not submitted", error.message);
      return null;
    }
  };

  useEffect(() => {
    getAssetSubCategory();
    getRepairReason();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repairDate || repairDate == "") {
      return toastError("Repair Request Date is Required");
    } else if (!reason || reason == "") {
      return toastError("Reason is Required");
    } else if (!priority || priority == "") {
      return toastError("Priority is Required");
    }
    try {
      const formData = new FormData();
      formData.append("repair_request_date_time", repairDate);
      formData.append("status", "Requested");
      formData.append("req_by", userID);
      formData.append("asset_reason_id", reason);
      formData.append("sim_id", repairAssetId);
      formData.append("priority", priority);
      formData.append(
        "multi_tag",
        tagUser.map((user) => user.value)
      );
      formData.append("img1", assetsImg1);
      formData.append("img2", assetsImg2);
      formData.append("img3", assetsImg3);
      formData.append("img4", assetsImg4);
      formData.append("problem_detailing", problemDetailing);

      await axios.post(baseUrl + "add_repair_request", formData);

      hardRender();
      closeRepairModal();
      setAssetName("");
      setRepairDate("");
      setPriority("");
      setAssetsImg1("");
      setAssetsImg2("");
      setAssetsImg3("");
      setAssetsImg4("");
      setProblemDetailing("");
      toastAlert("Success");
    } catch (error) {
      console.log(error);
    }
  };
  const handleReturnAsset = (row) => {
    setAssetId(row.sim_id);
  };

  const handleAssetReturn = async () => {
    try {
      const formData = new FormData();
      formData.append("sim_id", assetId);
      formData.append("asset_return_remark", returnRemark);
      formData.append("return_asset_image_1", returnImage1);
      formData.append("return_asset_image_2", returnImage2);
      formData.append("asset_return_status", "Pending");
      formData.append("asset_return_by", userID);

      await axios.post(baseUrl + "assetreturn", formData);

      hardRender();
      toastAlert("Requested Success");
    } catch (error) {
      console.log(error);
    }
  };
  const handleRow = (row) => {
    setIsRepairModalOpen(true);
    setAssetName(row.assetsName);
    setRepairAssetId(row.sim_id);
  };
  const handleDeleteNewAsset = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`${baseUrl}` + `assetrequest/${id}`)
            .then(() => {
              // Check if no error occurred and then show the success alert
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              );

              hardRender();
            })
            .catch(() => {
              showErrorAlert();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)"
          );
        }
      });
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Asset ID",
      selector: (row) => row.sim_no,
      sortable: true,
      width: "150px"

    },
    {
      name: "Asset Name",
      selector: (row) => row.assetsName,
      sortable: true,
      width: "150px"

    },
    {
      name: "Asset Category",
      selector: (row) => row.category_name,
      sortable: true,
      width: "150px"
    },

    {
      name: "Asset SubCategory",
      selector: (row) => row.sub_category_name,
      sortable: true,
      width: "170px"
    },

    {
      name: "Assigned Duration",
      selector: (row) => row.submitted_at,
      sortable: true,
      width: "170px",
      cell: (row) => {
        // Get the assigned date from the row
        const assignedDate = new Date(row.submitted_at);

        // Get the current date
        const currentDate = new Date();

        // Calculate the difference in days
        const timeDifference = currentDate - assignedDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

        return <div>{daysDifference} days</div>;
      },
    },
    {
      name: "Repair Status",
      selector: (row) => (
        <>
          {row.asset_repair_request_status === "Accept" ? (
            <span className="badge badge-success border-round">Accepted</span>
          ) : row.asset_repair_request_status === "Recover" ? (
            <span className="badge badge-warning border-round">Recoverd</span>
          ) : row.asset_repair_request_status === "Resolved" ? (
            <span className="badge badge-success border-round">Resolved</span>
          ) : row.asset_repair_request_status === "Requested" ? (
            <span className="badge badge-danger border-round">Requested</span>
          ) : row.asset_repair_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning border-round">Approve By Manager</span>
          ) : (
            "N/A"
          )}
        </>
      ),
      width: "170px",
      sortable: true,
    },
    {
      name: "Return Status",
      selector: (row) => (
        <>
          {row.asset_return_status === "Pending" ? (
            <span className="badge badge-warning border-round">Pending</span>
          ) : row.asset_return_status === "RecoverdByManager" ? (
            <span className="badge badge-warning border-round">Recover By Manager</span>
          ) : (
            "N/A"
          )}
        </>
      ),
      width: "170px",
      sortable: true,
    },

    {
      name: "Repair",
      cell: (row) => (
        <>
          {row.asset_repair_request_status !== "Requested" &&
            row.asset_repair_request_status !== "Accept" &&
            row.asset_repair_request_status !== "Recover" &&
            row.asset_repair_request_status !== "ApprovedByManager" && (
              <button
                onClick={() => handleRow(row)}
                className="btn cmnbtn btn_sm btn-outline-warning btn-sm"
                type="button"
              >
                Repair Request
              </button>
            )}
        </>
      ),
      width: "180px",
    },
    {
      name: "Return",
      cell: (row) => (
        <>
          {row.asset_return_status !== "Pending" &&
            row.asset_return_status !== "RecoverdByManager" && (
              <button
                type="button"
                data-toggle="modal"
                data-target="#return-asset-modal"
                size="small"
                className="btn cmnbtn btn_sm btn-outline-primary btn-sm"
                onClick={() => handleReturnAsset(row)}
              >
                Return Asset
              </button>
            )}
        </>
      ),
      width: "200px"
    },
  ];

  const NewAssetcolumns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },

    {
      name: "Asset Name",
      selector: (row) => row.sub_category_name,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_request_status === "Requested" ? (
            <span className="badge badge-danger border-round">Requested</span>
          ) : row.asset_request_status === "Approved" ? (
            <span className="badge badge-success border-round">Assigned</span>
          ) : row.asset_request_status === "Rejected" ? (
            <span className="badge badge-warning border-round">Rejected</span>
          ) : row.asset_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning border-round">Approve By Manager</span>
          ) : row.asset_request_status === "RejectedByManager" ? (
            <span className="badge badge-warning border-round">Reject By Manager</span>
          ) : null}
        </>
      ),
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Detail",
      cell: (row) => (
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {row.detail}
        </div>
      ),
      sortable: true,
      width: "300px",
    },

    {
      name: "Tagged Person",
      cell: (row) => (
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {row.multi_tag_names.join(", ")}</div>),
      sortable: true,
    },

    {
      name: "Reject Reason",
      cell: (row) => (
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {row.reject_reason}</div>),
      sortable: true,
      width: "200px",
    },
    {
      name: "Action",

      cell: (row) => (
        <>
          {row.asset_request_status == "Requested" && (
            <div class="btn-group">
              <button

                type="button"
                class=" icon-1 "
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="fa-solid fa-ellipsis"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                <button
                  onClick={() => handleUpdateNewAssetRow(row)}
                  class="dropdown-item "
                // type="button"
                // data-toggle="modal"
                // data-target="#sidebar-right"
                // size="small"
                >
                  Edit
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => handleDeleteNewAsset(row._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  //   New Asset Request Data Submit here

  const userMultiChangeHandler = (e, op) => {
    setTagUser(op);
  };

  const filteredOptions = usersDataContext
    .filter(
      (user) => !tagUser.some((selected) => selected.value === user.user_id)
    )
    .map((user) => ({
      label: user.user_name,
      value: user.user_id,
    }));

  const handleNewAssetSubmit = async () => {
    if (!assetsName || assetsName == "") {
      return toastError("Asset Name is Required");
    } else if (!priority || priority == "") {
      return toastError("Priority is Required");
    }
    try {
      await axios.post(baseUrl + "assetrequest", {
        sub_category_id: assetsName,
        detail: problemDetailing,
        priority: priority,
        request_by: userID,
        multi_tag: tagUser.map((user) => user.value),
      });

      closeModal();
      hardRender();
      toastAlert("Request Success");
      setAssetName("");
      setPriority("");
      setProblemDetailing("");
      setTagUser([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateNewAssetRow = (row) => {
    setIsEditMode(true);
    setIsModalOpen(true);
    setNewAssetID(row._id);
    setAssetName(row.sub_category_id);
    setProblemDetailing(row.detail);
    setPriority(row.priority);
  };
  const handleNewAssetUpdate = () => {
    try {
      axios.put(baseUrl + "assetrequest", {
        _id: newAssetID,
        sub_category_id: assetsName,
        detail: problemDetailing,
        priority: priority,
        request_by: userID,
        multi_tag: tagUser.map((user) => user.value),
      });

      toastAlert("Request Success");
      hardRender();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {tab ? (

        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable

              columns={columns}
              data={filterData}
              // fixedHeader
              // fixedHeaderScrollHeight="64vh"
              pagination
              exportToCSV
              highlightOnHover
              subHeader
            />
          </div>
        </div>

      ) : (
        <>
          <button
            type="button"
            // data-toggle="modal"
            // data-target="#sidebar-right"
            // size="small"
            className="col-2 ml-3 mb-2 cmnbtn btn_sm btn btn-outline-primary "
            style={{ height: "30px", minWidth: "200px" }}
            onClick={() => {
              setIsEditMode(false);
              setIsModalOpen(true);
              // Additional logic if needed
            }}
          >
            New Asset Request
          </button>


          <div className="card mb-4">
            <div className="data_tbl table-responsive">
              <DataTable

                columns={NewAssetcolumns}
                data={newAssetRequestData}
                // fixedHeader
                pagination
                fixedHeaderScrollHeight="50vh"
                exportToCSV
                highlightOnHover
                subHeader
              />
            </div>
          </div>

        </>
      )}

      {/* Repair Requset Modal  */}
      {/* <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      > */}
      <div
        className={`modal fade ${isRepairModalOpen ? "show" : ""}`}
        id="sidebar-right"
        tabIndex={-1}
        role="dialog"
        style={{ display: isRepairModalOpen ? "block" : "none" }}
      >
        <div
          className="modal-dialog"
          role="document"
          style={{ marginLeft: "400px" }}
        >
          <div
            className="modal-content"
            style={{ marginLeft: "100px", width: "200%" }}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Reason Request
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={() => closeRepairModal()}>
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <FieldContainer
                  fieldGrid={4}
                  label="Repair Request Date"
                  astric
                  type="datetime-local"
                  value={repairDate}
                  onChange={(e) => setRepairDate(e.target.value)}
                  required
                />
                <FieldContainer
                  fieldGrid={4}
                  label="Asset Name"
                  astric
                  value={assetsName}
                  onChange={(e) => setAssetName(e.target.value)}
                  required
                  disabled
                />

                <div className="form-group col-4">
                  <label className="form-label">
                    Reason <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={reasonData.map((opt) => ({
                      value: opt.asset_reason_id,
                      label: opt.reason,
                    }))}
                    value={{
                      value: reason,
                      label:
                        reasonData.find((d) => d.asset_reason_id === reason)
                          ?.reason || "",
                    }}
                    onChange={(e) => {
                      setReason(e.value);
                    }}
                    required
                  />
                </div>

                <div className="form-group col-4">
                  <label className="form-label">
                    Priority <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    className=""
                    options={PriorityData.map((option) => ({
                      value: `${option}`,
                      label: `${option}`,
                    }))}
                    value={{
                      value: priority,
                      label: `${priority}`,
                    }}
                    onChange={(e) => {
                      setPriority(e.value);
                    }}
                    required
                  />
                </div>

                <div className="col-sm-12 col-lg-8 p-2" style={{ display: "flex", alignItems: "center" }}>
                  {/* <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={usersDataContext.map((d) => ({
                      label: d.user_name,
                      value: d.user_id,
                    }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Tag" />
                    )}
                    onChange={userMultiChangeHandler}
                  /> */}
                  <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={filteredOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField {...params} label="Tag" />
                    )}
                    onChange={userMultiChangeHandler}
                    value={tagUser}
                    // Ensure that the comparison between option and value works for objects
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                  />
                </div>

                <FieldContainer
                  label="IMG 1"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg1(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 2"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg2(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 3"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg3(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 4"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg4(e.target.files[0])}
                />

                <FieldContainer
                  label="Problem Detailing"
                  Tag="textarea"
                  value={problemDetailing}
                  onChange={(e) => setProblemDetailing(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => closeRepairModal()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              // data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Sidebar Right new asset */}
      {/* {isModalOpen && ( */}
      <div className="right-modal ">
        <div
          className={`modal fade right ${isModalOpen ? "show" : ""}`}
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
          style={{ display: isModalOpen ? "block" : "none" }}
        >
          {/* <div
          className="right-modal modal fade right"
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
        > */}
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Asset Request</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closeModal}
                >
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group col-12">
                  <label className="form-label">
                    Asset Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={assetSubCategroyData.map((opt) => ({
                      value: opt.sub_category_id,
                      label: opt.sub_category_name,
                    }))}
                    value={{
                      value: assetsName,
                      label:
                        assetSubCategroyData.find(
                          (user) => user.sub_category_id === assetsName
                        )?.sub_category_name || "",
                    }}
                    onChange={(e) => {
                      setAssetName(e.value);
                    }}
                    required
                  />
                </div>
                <div className="form-group col-12">
                  <label className="form-label">
                    Priority <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    className=""
                    options={PriorityData.map((option) => ({
                      value: `${option}`,
                      label: `${option}`,
                    }))}
                    value={{
                      value: priority,
                      label: `${priority}`,
                    }}
                    onChange={(e) => {
                      setPriority(e.value);
                    }}
                    required
                  />
                </div>
                <div className="col-sm-12 col-lg-12 p-2">
                  {/* <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={usersDataContext.map((d) => ({
                      label: d.user_name,
                      value: d.user_id,
                    }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Tag" />
                    )}
                    onChange={userMultiChangeHandler}
                  /> */}
                  <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={filteredOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField {...params} label="Tag" />
                    )}
                    onChange={userMultiChangeHandler}
                    value={tagUser}
                    // Ensure that the comparison between option and value works for objects
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                  />
                </div>
                <FieldContainer
                  label="Asset Details"
                  Tag="textarea"
                  value={problemDetailing}
                  onChange={(e) => setProblemDetailing(e.target.value)}
                  required={false}
                />
                {isEditMode ? (
                  <button
                    type="button"
                    data-dismiss="modal"
                    className="btn btn-primary ml-2"
                    onClick={handleNewAssetUpdate}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    type="button"
                    // data-dismiss="modal"
                    className="btn btn-primary ml-2"
                    onClick={handleNewAssetSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
      {/* Return asset modal */}
      <div className="right-modal">
        <div
          className="modal fade right"
          id="return-asset-modal"
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Return Asset</h4>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <FieldContainer
                  label="Return Remark"
                  Tag="textarea"
                  value={returnRemark}
                  onChange={(e) => setReturnRemark(e.target.value)}
                  required
                />
                <FieldContainer
                  label="Image 1"
                  type="file"
                  fieldGrid={12}
                  onChange={(e) => setReturnImage1(e.target.files[0])}
                  required
                />
                <FieldContainer
                  label="Image 2"
                  type="file"
                  fieldGrid={12}
                  onChange={(e) => setReturnImage2(e.target.files[0])}
                  required
                />
                <button
                  type="button"
                  data-dismiss="modal"
                  className=" btn btn-primary ml-2"
                  onClick={handleAssetReturn}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetSingleuserOverview;
