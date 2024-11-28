import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";

const IdentityDetails = () => {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const { toastAlert, toastError } = useGlobalContext();

  const [passportNumber, setPassportNumber] = useState("");
  const [passportValidUpto, setPassportValidUpto] = useState("");
  const [aadharName, setAadharName] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [voterIdNumber, setVoterIdNumber] = useState("");
  const [voterName, setVoterName] = useState("");
  const [panName, setPanName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");
  const [drivingLicenseValidUpto, setDrivingLicenseValidUpto] = useState("");

  const gettingData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      const fetchedData = res.data;
      const {
        passportNumber,
        passportValidUpto,
        aadharName,
        uid_no,
        voterName,
        panName,
        pan_no,
        vehicleNumber,
        drivingLicenseNumber,
        drivingLicenseValidUpto,
        voterIdNumber,
        vehicleName,
      } = fetchedData;
      setPassportNumber(passportNumber);
      setPassportValidUpto(passportValidUpto);
      setAadharName(aadharName);
      setAadharNumber(uid_no);
      setVoterIdNumber(voterIdNumber);
      setVoterName(voterName);
      setPanName(panName);
      setPanNumber(pan_no);
      setVehicleName(vehicleName);
      setVehicleNumber(vehicleNumber);
      setDrivingLicenseNumber(drivingLicenseNumber);
      setDrivingLicenseValidUpto(drivingLicenseValidUpto);
    });
  };
  useEffect(() => {
    gettingData();
  }, [userID]);
  // PAN Card validation
  const validatePan = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const handlePanChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPanNumber(value);
    if (!validatePan(value)) {
      console.log("Invalid PAN number");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadharName) {
      toastError("Aadhar Name is required");
      return;
    }
    if (aadharNumber.length !== 12) {
      toastError("Aadhar Number must be exactly 12 digits");
      return;
    }
    if (panNumber.length !== 10) {
      toastError("PAN number must be exactly 10 characters long");
      return;
    }
    if (!validatePan(panNumber)) {
      toastError("Invalid PAN Number format");
      return;
    }
    try {
      const response = await axios.put(
        baseUrl + `update_user_identity_details`,
        {
          user_id: userID,
          passportNumber: passportNumber,
          passportValidUpto: passportValidUpto,
          aadharName: aadharName,
          uid_no: aadharNumber,
          voterIdNumber: voterIdNumber,
          voterName: voterName,
          panName: panName,
          pan_no: panNumber,
          vehicleNumber: vehicleNumber,
          vehicleName: vehicleName,
          drivingLicenseNumber: drivingLicenseNumber,
          drivingLicenseValidUpto: drivingLicenseValidUpto,
        }
      );
      toastAlert("Identity Details Saved");
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <div className="board_form board_form_flex">
      <h2>Identity Details</h2>

      {/* Name as per Aadhar */}
      <div className="form-group">
        <TextField
          label="Name as per Aadhar"
          variant="outlined"
          fullWidth
          value={aadharName}
          onChange={(e) => setAadharName(e.target.value)}
        />
      </div>

      {/* Aadhar Card Number */}
      <div className="form-group">
        <TextField
          label={<span>Aadhar Number <span style={{color:"red"}}>*</span></span>}
          variant="outlined"
          fullWidth
          type="number"
          value={aadharNumber}
          onChange={(e) => setAadharNumber(e.target.value.slice(0, 12))} 
          inputProps={{ maxLength: 12 }}
        />
      </div>
      {/* Name as per PAN Card */}
      <div className="form-group">
        <TextField
          label="Name as per PAN Card"
          variant="outlined"
          fullWidth
          value={panName}
          onChange={(e) => setPanName(e.target.value)}
        />
      </div>

      {/* PAN Card Number */}
      <div className="form-group">
        <TextField
          label={<span>PAN Number <span style={{color:"red"}}>*</span></span>}
          variant="outlined"
          fullWidth
          inputProps={{ maxLength: 10 }} 
          value={panNumber}
          onChange={handlePanChange}
          error={panNumber && !validatePan(panNumber)}
          helperText={
            panNumber && !validatePan(panNumber) ? "Invalid PAN format" : ""
          }
        />
      </div>
      {/* Name as per Voter ID */}
      <div className="form-group">
        <TextField
          label="Name as per Voter ID"
          variant="outlined"
          fullWidth
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
        />
      </div>
      {/* Voter ID Number */}
      <div className="form-group">
        <TextField
          label="Voter ID Number"
          variant="outlined"
          fullWidth
          value={voterIdNumber}
          onChange={(e) => setVoterIdNumber(e.target.value)}
        />
      </div>

      {/* Passport Number */}
      <div className="form-group">
        <TextField
          label="Passport Number"
          variant="outlined"
          fullWidth
          value={passportNumber}
          onChange={(e) => setPassportNumber(e.target.value)}
        />
      </div>

      {/* Passport Valid Upto */}
      <div className="form-group">
        <TextField
          label="Passport Valid Upto"
          type="date"
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={passportValidUpto}
          onChange={(e) => setPassportValidUpto(e.target.value)}
        />
      </div>

      {/* Driving License Number */}
      <div className="form-group">
        <TextField
          label="Driving License Number"
          variant="outlined"
          fullWidth
          value={drivingLicenseNumber}
          onChange={(e) => setDrivingLicenseNumber(e.target.value)}
        />
      </div>

      {/* Driving License Valid Upto */}
      <div className="form-group">
        <TextField
          label="Driving License Valid Upto"
          type="date"
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={drivingLicenseValidUpto}
          onChange={(e) => setDrivingLicenseValidUpto(e.target.value)}
        />
      </div>

      {/* Vehicle Number */}
      <div className="form-group">
        <TextField
          label="Vehicle Number"
          variant="outlined"
          fullWidth
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
      </div>

      {/* Vehicle Name */}
      <div className="form-group">
        <TextField
          label="Vehicle Name"
          variant="outlined"
          fullWidth
          value={vehicleName}
          onChange={(e) => setVehicleName(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn cmnbtn btn-primary mr-2"
        onClick={handleSubmit}
      >
        Save Identity Details
      </button>
    </div>
  );
};

export default IdentityDetails;
