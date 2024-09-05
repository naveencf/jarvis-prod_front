import React from "react";
import FormContainer from "../../../components/AdminPanel/FormContainer";
import FieldContainer from "../../../components/AdminPanel/FieldContainer";
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { Autocomplete, TextField } from "@mui/material";
import Select from "react-select";
import axios from "axios";
import AssetSingleuserOverview from "./AssetSingleuserOverview";
import { baseUrl } from "../../../utils/config";

const AssetSingleUser = () => {
  const { usersDataContext, getAssetDataContext, toastAlert, toastError } =
    useGlobalContext();
  const { userID } = useAPIGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

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
  const [newAssetRequestData, setNewAssetRequestData] = useState([]);
  const PriorityData = ["Low", "Medium", "High", "Urgent"];

  const hardRender = () => {
    getNewAssetRequest();
    getData();
  };

  // New tab
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Assigned Assets", "Asset Requests"];

  const tab1 = (
    <AssetSingleuserOverview
      filterData={filterData?.filter(
        (d) =>
          d.asset_return_status !== "RecovedByHR" ||
          d.asset_return_status !== "ApprovedByManager"
      )}
      hardRender={hardRender}
      tab="tab"
    />
  );
  const tab2 = (
    <AssetSingleuserOverview
      newAssetRequestData={newAssetRequestData}
      hardRender={hardRender}
    />
  );

  const getData = async () => {
    setFilterData([]);
    setData([]);
    try {
      const res = await axios.get(
        `${baseUrl}` + `get_allocated_asset_data_for_user_id/${userID}`
      );
      setData(res.data.data);
      setFilterData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  async function getRepairReason() {
    const res = await axios.get(baseUrl + "get_all_assetResons");
    setReasonData(res?.data.data);
  }

  async function getNewAssetRequest() {
    setNewAssetRequestData([]);
    try {
      const res = await axios.get(`${baseUrl}assetrequest/${userID}`);
      // Assuming you want to filter out only non-approved asset requests
      const filteredData = res?.data.filter(
        (d) => d.asset_request_status !== "Approved"
      );
      setNewAssetRequestData(filteredData);
    } catch (error) {
      // Handle the error here. For example, you could log it or display a message to the user.
      console.error("Failed to fetch new asset request data:", error);
      // Optionally, you can also set some state here to indicate that the request failed
    }
  }

  useEffect(() => {
    getRepairReason();
    hardRender();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.assetsName?.toLowerCase().match(search.toLocaleLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const userMultiChangeHandler = (e, op) => {
    setTagUser(op);
  };
  const TagUserData = usersDataContext
    .filter(
      (category) =>
        !tagUser.find((selected) => selected.value === category.user_id)
    )
    .map((category) => ({
      label: category.user_name,
      value: category.user_id,
    }));

  const handleRow = (row) => {
    setAssetName(row?.sim_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("repair_request_date_time", repairDate);
      formData.append("status", "Requested");
      formData.append("req_by", userID);
      formData.append("asset_reason_id", reason);
      formData.append("sim_id", assetsName);
      formData.append("priority", priority);
      formData.append(
        "multi_tag",
        tagUser.map((user) => user.value)
        // tagUser.map((user) => Number(user.value)).join(",")
      );

      formData.append("img1", assetsImg1);
      formData.append("img2", assetsImg2);
      formData.append("img3", assetsImg3);
      formData.append("img4", assetsImg4);
      formData.append("status", "Requested");

      formData.append("problem_detailing", problemDetailing);

      const response = await axios.post(
        baseUrl + "add_repair_request",
        formData
      );

      toastAlert("Success");
      setAssetName("");
      setRepairDate("");
      setPriority("");
      setAssetsImg1("");
      setAssetsImg2("");
      setAssetsImg3("");
      setAssetsImg4("");
      setProblemDetailing("");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 16);
    setRepairDate(currentDate);
  }, []);
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle="Asset"
            title=""
            link="true"
          />
        </div>
      </div>
      <div className="tab">
        {accordionButtons.map((button, index) => (
          <div
            className={`named-tab ${activeAccordionIndex === index ? "active-tab" : ""
              }`}
            onClick={() => {
              handleAccordionButtonClick(index);
            }}
          >
            {button}
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header sb">Asset</div>
        <div className="card-body thm_table">
          {activeAccordionIndex === 0 && tab1}
          {activeAccordionIndex === 1 && tab2}
        </div>
      </div>

      {/* Repair Requset Modal  */}
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
                Reason Request
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
                  value={repairDate}
                  onChange={(e) => setRepairDate(e.target.value)}
                  required={true}
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
                    priority <sup style={{ color: "red" }}>*</sup>
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

                <div className="col-sm-12 col-lg-8 p-2">
                  <Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={TagUserData}
                    getOptionLabel={(option) => option.label}
                    InputLabelProps={{ shrink: true }}
                    renderInput={(params) => (
                      <TextField {...params} label="Tag" />
                    )}
                    onChange={userMultiChangeHandler}
                    value={tagUser}
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
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetSingleUser;
