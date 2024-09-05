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
import { Autocomplete, TextField } from "@mui/material";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const RepairRequest = () => {
  const { toastAlert, toastError, getAssetDataContext, usersDataContext } =
    useGlobalContext();

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const [modalData, setModalData] = useState([]);
  const [repairRequestFilter, setrepairRequestFilter] = useState([]);
  const [search, setSearch] = useState("");

  // Post Data State
  const [assetsName, setAssetName] = useState("");
  const [repairDate, setRepairDate] = useState("");
  const [priority, setPriority] = useState("");
  const [assetsImg1, setAssetsImg1] = useState(null);
  const [assetsImg2, setAssetsImg2] = useState(null);
  const [assetsImg3, setAssetsImg3] = useState(null);
  const [assetsImg4, setAssetsImg4] = useState(null);
  const [problemDetailing, setProblemDetailing] = useState("");
  const [tagUser, setTagUser] = useState([]);

  // Update Data State

  const [repairId, setRepairId] = useState(0);
  // const [assetsNameUpdate, setAssetNameUpdate] = useState("");
  const [repairDateUpdate, setRepairDateUpdate] = useState("");
  const [priorityUpdate, setPriorityUpdate] = useState("");
  const [assetsImg1Update, setAssetsImg1Update] = useState(null);
  const [assetsImg2Update, setAssetsImg2Update] = useState(null);
  const [assetsImg3Update, setAssetsImg3Update] = useState(null);
  const [assetsImg4Update, setAssetsImg4Update] = useState(null);
  const [problemDetailingUpdate, setProblemDetailingUpdate] = useState("");
  const [tagUserUpdate, setTagUserUpdate] = useState([]);

  const genderData = ["Low", "Medium", "High", "Urgent"];

  const [reason, setReason] = useState("");
  const [reasonData, setReasonData] = useState([]);
  async function getRepairReason() {
    const res = await axios.get(baseUrl + "get_all_assetResons");
    setReasonData(res?.data.data);
  }

  useEffect(() => {
    getRepairReason();
  }, []);

  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [showAssetsImage, setShowAssetImages] = useState("");
  const handleImageClick = (row) => {
    setShowAssetImages(row);

    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
    },
    {
      name: "Reason Name",
      selector: (row) => row.reason_name,
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Repair Date & Time",
      selector: (row) => row.repair_request_date_time?.slice(0, 16).replace("T", " "),
      sortable: true,
    },
    {
      name: "Problem Detailing",
      selector: (row) => row.problem_detailing,
      sortable: true,
      height: "max-content",
    },
    {
      name: "Image",
      selector: (row) => (
        <button
        title="View Images"
          className="btn btn-outline-success icon-1"
          onClick={() => handleImageClick(row)}
        >
          <i className="bi bi-images"></i>
        </button>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-black icon-1"
            data-toggle="modal"
            data-target="#exampleModal"
            size="small"
            variant="contained"
            color="primary"
            title="Edit"
            onClick={() => handleRepairId(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <DeleteButton
            endpoint="delete_repair_request"
            id={row.repair_id}
            getData={getRepairRequest}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repairDate || repairDate == "") {
      return toastError("Date is Required");
    } else if (!assetsName || assetsName == "") {
      return toastError("Asset Name is Required");
    } else if (!reason || reason == "") {
      return toastError("Reason is Required");
    } else if (!priority || priority == "") {
      return toastError("Priority is Required");
    }
    try {
      const formData = new FormData();
      formData.append("repair_request_date_time", repairDate);
      formData.append("req_by", userID);
      formData.append("status", "Requested");
      formData.append("asset_reason_id", reason);
      formData.append("sim_id", assetsName);
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

      const response = await axios.post(
        baseUrl + "add_repair_request",
        formData
      );
      setAssetName("");
      setRepairDate("");
      setReason("");
      setPriority("");
      setAssetsImg1("");
      setAssetsImg2("");
      setAssetsImg3("");
      setAssetsImg4("");
      getRepairRequest("");
      setProblemDetailing("");
      setTagUser([]);
      toastAlert("Success");
    } catch (error) {
      console.log(error);
    }
  };
  async function getRepairRequest() {
    const res = await axios.get(baseUrl + "get_all_repair_request");
    setModalData(res?.data.data);
    setrepairRequestFilter(res?.data.data);
  }

  useEffect(() => {
    getRepairRequest();
  }, []);

  const formatApiDate = (apiDate) => {
    const dateObj = new Date(apiDate);
    const formattedDate = dateObj.toISOString().slice(0, 16); // Format as "YYYY-MM-DDTHH:MM"
    return formattedDate;
  };

  useEffect(() => {
    setTimeout(() => {
      getRepairRequest();
    }, 1000);
  }, [usersDataContext]);

  console.log(reason, "reason");
  const handleRepairId = (row) => {
    setRepairId(row.repair_id);
    const formattedApiDate = formatApiDate(row.repair_request_date_time);
    setRepairDateUpdate(formattedApiDate);
    setAssetName(row.sim_id);
    setPriorityUpdate(row.priority);
    setProblemDetailingUpdate(row.problem_detailing);
    setReason(row.asset_reason_id);
    setTagUserUpdate();
  };

  // Update Function here with submittion
  const handleModalUpdate = () => {
    const formData = new FormData();
    formData.append("repair_id", repairId);
    formData.append("repair_request_date_time", repairDateUpdate);
    formData.append("asset_reason_id", reason);
    formData.append("sim_id", assetsName);
    formData.append("priority", priorityUpdate);
    formData.append(
      "multi_tag",
      tagUser.map((user) => user.value)
    );
    formData.append("img1", assetsImg1Update);
    formData.append("img2", assetsImg2Update);
    formData.append("img3", assetsImg3Update);
    formData.append("img4", assetsImg4Update);
    formData.append("problem_detailing", problemDetailingUpdate);
    axios.put(baseUrl + "update_repair_request", formData).then((res) => {
      getRepairRequest();
      toastAlert("Update Success");
    });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.asset_name?.toLowerCase().match(search.toLocaleLowerCase());
    });
    setrepairRequestFilter(result);
  }, [search]);

  const userMultiChangeHandler = (e, op) => {
    setTagUser(op);
  };
  const userMultiChangeHandlerUpdate = (e, op) => {
    setTagUserUpdate(op);
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 16);
    setRepairDate(currentDate);
  }, []);

  return (
    <div>
      <div className="master-card-css" style={{ width: "80%", margin: "0px 0 0 10%" }}>
        <UserNav />
        <Link to="/repair-reason">
          <button
            // style={{ marginRight: "200px", top: "90px" }}
            type="button"
            className="btn btn-outline-primary btn-sm mt-2 mb-2"
          >
            Repair Reason
          </button>
        </Link>
        <div>
          <FormContainer
            mainTitle="Repair Request"
            title="Add Repair Request"
            
            handleSubmit={handleSubmit}
          >
            <FieldContainer
              fieldGrid={2}
              label="Repair Request Date"
              type="datetime-local"
              astric
              value={repairDate}
              onChange={(e) => setRepairDate(e.target.value)}
              required
            />

            <div className="form-group col-2">
              <label className="form-label">
                Asset Name <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={getAssetDataContext.map((opt) => ({
                  value: opt.sim_id,
                  label: opt.assetsName,
                }))}
                value={{
                  value: assetsName,
                  label:
                    getAssetDataContext.find(
                      (user) => user.sim_id === assetsName
                    )?.assetsName || "",
                }}
                onChange={(e) => {
                  setAssetName(e.value);
                }}
                required
              />
            </div>
            <div className="form-group col-2">
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
            <div className="form-group col-2">
              <label className="form-label">
                Priority <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                className=""
                options={genderData.map((option) => ({
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

            <div className="col-sm-12 col-lg-4 p-2">
              <Autocomplete
                multiple
                id="combo-box-demo"
                options={usersDataContext.map((d) => ({
                  label: d.user_name,
                  value: d.user_id,
                }))}
                renderInput={(params) => <TextField {...params} label="Tag" />}
                onChange={userMultiChangeHandler}
              />
            </div>

            <FieldContainer
              label="IMG 1"
              type="file"
              required={false}
              fieldGrid={3}
              onChange={(e) => setAssetsImg1(e.target.files[0])}
            />

            <FieldContainer
              label="IMG 2"
              required={false}
              type="file"
              fieldGrid={3}
              onChange={(e) => setAssetsImg2(e.target.files[0])}
            />

            <FieldContainer
              label="IMG 3"
              required={false}
              type="file"
              fieldGrid={3}
              onChange={(e) => setAssetsImg3(e.target.files[0])}
            />

            <FieldContainer
              label="IMG 4"
              required={false}
              type="file"
              fieldGrid={3}
              onChange={(e) => setAssetsImg4(e.target.files[0])}
            />

            <FieldContainer
              label="Problem Detailing"
              Tag="textarea"
              value={problemDetailing}
              onChange={(e) => setProblemDetailing(e.target.value)}
              required={false}
            />
          </FormContainer>
        </div>
        <div className="card" >
          <div className="card-header sb">
            <h5>Repair Request Overview</h5>
            <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
          </div>
          <div className="data_tbl table-responsive  card-body body-padding">
            <DataTable
              title="Repair Request Overview"
              columns={columns}
              data={repairRequestFilter}
              // fixedHeader
              pagination
              // fixedHeaderScrollHeight="36vh"
              highlightOnHover
              
            />
          </div>
        </div>
      </div>
      {/* Update  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
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
                Reason Request Update
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <FieldContainer
                  fieldGrid={4}
                  label="Repair Request Date"
                  type="datetime-local"
                  value={repairDateUpdate}
                  onChange={(e) => setRepairDateUpdate(e.target.value)}
                  required
                />

                <div className="form-group col-4">
                  <label className="form-label">
                    Asset Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={getAssetDataContext.map((opt) => ({
                      value: opt.sim_id,
                      label: opt.assetsName,
                    }))}
                    value={{
                      value: assetsName,
                      label:
                        getAssetDataContext.find(
                          (user) => user.sim_id === assetsName
                        )?.assetsName || "",
                    }}
                    onChange={(e) => {
                      setAssetName(e.value);
                    }}
                    required
                  />
                </div>
                <div className="form-group col-2">
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
                    options={genderData.map((option) => ({
                      value: `${option}`,
                      label: `${option}`,
                    }))}
                    value={{
                      value: priorityUpdate,
                      label: `${priorityUpdate}`,
                    }}
                    onChange={(e) => {
                      setPriorityUpdate(e.value);
                    }}
                    required
                  />
                </div>

                <div className="col-sm-12 col-lg-3 p-2">
                  <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={usersDataContext.map((d) => ({
                      label: d.user_name,
                      value: d.user_id,
                    }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Tag" />
                    )}
                    onChange={userMultiChangeHandlerUpdate}
                  />
                </div>

                <FieldContainer
                  label="IMG 1"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg1Update(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 2"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg2Update(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 3"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg3Update(e.target.files[0])}
                />

                <FieldContainer
                  label="IMG 4"
                  type="file"
                  fieldGrid={3}
                  onChange={(e) => setAssetsImg4Update(e.target.files[0])}
                />

                <FieldContainer
                  label="Problem Detailing"
                  Tag="textarea"
                  value={problemDetailingUpdate}
                  onChange={(e) => setProblemDetailingUpdate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
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
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
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
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Repair Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>

        <>
          {/* <h2>Type : {showAssetsImage?.type}</h2> */}
          <div className="summary_cards flex-row row">
            <div
              className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img1_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img2_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img3_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <div className="summary_card">
                <div className="summary_cardtitle"></div>
                <div className="summary_cardbody">
                  <div className="summary_cardrow flex-column">
                    <div className="summary_box text-center ml-auto mr-auto"></div>
                    <div className="summary_box col">
                      <img
                        src={showAssetsImage?.img4_url}
                        width="80px"
                        height="80px"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default RepairRequest;
