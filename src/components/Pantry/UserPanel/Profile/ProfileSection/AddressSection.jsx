import React, { useState } from "react";
import IndianStatesMui from "../../../../ReusableComponents/IndianStatesMui";
import IndianCitiesMui from "../../../../ReusableComponents/IndianCitiesMui";
import { TextField } from "@mui/material";
import { baseUrl } from "../../../../../utils/config";
import axios from "axios";
import { useGlobalContext } from "../../../../../Context/Context";

const AddressSection = ({ userData }) => {
  console.log(userData, "userdata");
  const { toastAlert, toastError } = useGlobalContext();
  //Permanent Address
  const [permanentAddress, setPermanentAddress] = useState(
    userData.permanent_address || ""
  );
  const [permanentCity, setPermanentCity] = useState(
    userData.permanent_city || ""
  );
  const [permanentState, setPermanentState] = useState(
    userData.permanent_state || ""
  );
  const [permanentPincode, setPermanentPincode] = useState(
    userData.permanent_pin_code || ""
  );

  //Current Address
  const [currentAddress, setCurrentAddress] = useState(
    userData.current_address || ""
  );
  const [currentCity, setcurrentCity] = useState(userData.current_city || "");
  const [currentState, setcurrentState] = useState(
    userData.current_state || ""
  );
  const [currentPincode, setcurrentPincode] = useState(
    userData.current_pin_code || ""
  );

  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [isPrimaryModalOpen, setIsPrimaryModelOpen] = useState(false);

  const closePrimaryModel = () => {
    setIsPrimaryModelOpen(false);
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setSameAsCurrent(checked);
    if (checked) {
      setPermanentAddress(currentAddress);
      setPermanentCity(currentCity);
      setPermanentState(currentState);
      setPermanentPincode(currentPincode);
    } else {
      setPermanentAddress("");
      setPermanentCity("");
      setPermanentState("");
      setPermanentPincode("");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_other_details/${userData.user_id}`,
        {
          permanent_city: permanentCity,
          permanent_address: permanentAddress,
          permanent_state: permanentState,
          permanent_pin_code: Number(permanentPincode),
          current_address: currentAddress,
          current_city: currentCity,
          current_pin_code: Number(currentPincode),
          current_state: currentState,
        }
      );
      closePrimaryModel();
      toastAlert("Employee Personal Details are successfully updated.");
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title">Address</h5>
          <button
            className="btn cmnbtn btn_sm"
            type="button"
            onClick={(e) => {
              setIsPrimaryModelOpen(true);
            }}
          >
            Edit
          </button>
        </div>
        <div className="card-body p0 profileTabBody">
          <div className="profileTabInfo">
            <div className="row profileTabRow">
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Current Address</h3>
                  <h4>
                    {userData.current_address ? userData.current_address : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Current City</h3>
                  <h4>
                    {userData.current_city ? userData.current_city : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Current State</h3>
                  <h4>
                    {userData.current_state ? userData.current_state : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Current Pin Code</h3>
                  <h4>
                    {userData.current_pin_code
                      ? userData.current_pin_code
                      : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Permanent Address</h3>
                  <h4>
                    {userData.permanent_address
                      ? userData.permanent_address
                      : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Permanent City</h3>
                  <h4>
                    {userData.permanent_city ? userData.permanent_city : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Permanent State</h3>
                  <h4>
                    {userData.permanent_state ? userData.permanent_state : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-12 profileTabCol">
                <div className="profileTabBox">
                  <h3>Permanent Pin Code</h3>
                  <h4>
                    {userData.permanent_pin_code
                      ? userData.permanent_pin_code
                      : "NA"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address section modal is here  */}
      <div className="right-modal ">
        <div
          className={`modal fade right ${isPrimaryModalOpen ? "show" : ""}`}
          id="sidebar-right"
          tabIndex={-1}
          role="dialog"
          style={{ display: isPrimaryModalOpen ? "block" : "none" }}
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Address</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={closePrimaryModel}
                >
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div>
                    {/* <h4>Current Address</h4> */}
                    <div className="form-group">
                      <TextField
                        id="outlined-basic"
                        label={
                          <span>
                            Current Address
                            <span style={{ color: "red" }}> *</span>
                          </span>
                        }
                        variant="outlined"
                        type="text"
                        value={currentAddress}
                        onChange={(e) => setCurrentAddress(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <IndianStatesMui
                        selectedState={currentState}
                        onChange={(option) =>
                          setcurrentState(option ? option : null)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <IndianCitiesMui
                        selectedState={currentState}
                        selectedCity={currentCity}
                        onChange={(option) =>
                          setcurrentCity(option ? option : null)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        required
                        id="outlined-basic"
                        label="Current Pincode"
                        variant="outlined"
                        type="text"
                        value={currentPincode}
                        onChange={(e) => {
                          const value = e.target.value;
                          const cleanedValue = value.replace(/\D/g, "");
                          if (cleanedValue.length <= 6) {
                            setcurrentPincode(cleanedValue);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className=" form_checkbox">
                    <label className="cstm_check">
                      Permanent Address Same as Current Address
                      <input
                        className="form-control"
                        type="checkbox"
                        checked={sameAsCurrent}
                        onChange={handleCheckboxChange}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  <div>
                    {/* <h4>Permanent Address</h4> */}

                    <div className="form-group">
                      <TextField
                        required
                        id="outlined-basic"
                        label="Permanent Address"
                        variant="outlined"
                        type="text"
                        value={permanentAddress}
                        onChange={(e) => setPermanentAddress(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <IndianStatesMui
                        selectedState={permanentState}
                        onChange={(option) =>
                          setPermanentState(option ? option : null)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <IndianCitiesMui
                        selectedState={permanentState}
                        selectedCity={permanentCity}
                        onChange={(option) =>
                          setPermanentCity(option ? option : null)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <TextField
                        required
                        id="outlined-basic"
                        label="Permanent Pincode"
                        variant="outlined"
                        type="text"
                        value={permanentPincode}
                        onChange={(e) => {
                          const value = e.target.value;
                          const cleanedValue = value.replace(/\D/g, "");
                          if (cleanedValue.length <= 6) {
                            setPermanentPincode(cleanedValue);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary ml-2"
                  onClick={handleSubmit}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={closePrimaryModel}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressSection;
