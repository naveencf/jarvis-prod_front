import React, { useState, useEffect } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";

const OtherDetails = () => {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const { toastAlert } = useGlobalContext();
  
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [travelMode, setTravelMode] = useState("");
  const [sportsTeam, setSportsTeam] = useState("");
  const [smoking, setSmoking] = useState("No");
  const [daysSmoking, setDaysSmoking] = useState("");
  const [alcohol, setAlcohol] = useState("No");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [bmi, setBmi] = useState("");
  const [describe , setDescribe] = useState("")

  
  const gettingData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      const fetchedData = res.data;
      const { facebookLink, instagramLink,linkedInLink,height,weight,travelMode,sportsTeam,smoking,daysSmoking,alcohol,medicalHistory,describe } = fetchedData;
      setFacebookLink(facebookLink);
      setInstagramLink(instagramLink)
      setLinkedInLink(linkedInLink)
      setHeight(height)
      setWeight(weight)
      setTravelMode(travelMode)
      setSportsTeam(sportsTeam)
      setSmoking(smoking)
      setDaysSmoking(daysSmoking)
      setAlcohol(alcohol)
      setMedicalHistory(medicalHistory)
      setDescribe(describe)
    });
  };
  useEffect(() => {
    gettingData();
  }, [userID]);
  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100; 
      const calculatedBmi = (weight / (heightInMeters ** 2)).toFixed(2);   
      setBmi(calculatedBmi); 
    }
  }, [height, weight]);

  const handleOtherDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(baseUrl + `update_user_other_detail`, {
        user_id: userID,
        facebookLink,
        instagramLink,
        linkedInLink,
        height,
        weight,
        travelMode,
        sportsTeam,
        smoking,
        daysSmoking,
        alcohol,
        medicalHistory,
        bmi,
        describe,
      });
      toastAlert("Other Details Saved");
    } catch (error) {
      console.error("Update failed", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="board_form board_form_flex">
      <h2>Other Details</h2>

      {/* Social Media Links */}
      <div className="form-group">
        <TextField
          label="Facebook Profile Link"
          variant="outlined"
          fullWidth
          value={facebookLink}
          onChange={(e) => setFacebookLink(e.target.value)}
        />
      </div>

      <div className="form-group">
        <TextField
          label="Instagram Profile Link"
          variant="outlined"
          fullWidth
          value={instagramLink}
          onChange={(e) => setInstagramLink(e.target.value)}
        />
      </div>

      <div className="form-group">
        <TextField
          label="LinkedIn Profile Link"
          variant="outlined"
          fullWidth
          value={linkedInLink}
          onChange={(e) => setLinkedInLink(e.target.value)}
        />
      </div>

      {/* Height and Weight */}
      <div className="form-group">
        <TextField
          label="Height (in cm)"
          variant="outlined"
          fullWidth
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>

      <div className="form-group">
        <TextField
          label="Weight (in kg)"
          variant="outlined"
          fullWidth
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>
      
      {/* BMI */}
      <div className="form-group">
        <TextField
          label="Body Mass Index (BMI)"
          variant="outlined"
          fullWidth
          value={bmi}
          onChange={(e) => setBmi(e.target.value)}
          disabled 
        />
      </div>

      {/* Travel Mode */}
        <div className="form-group">
        <TextField
          select
          label="How do you plan on travelling to office?"
          variant="outlined"
          fullWidth
          value={travelMode}
          onChange={(e) => setTravelMode(e.target.value)}
        >
          <MenuItem value="two_wheeler">Two Wheeler</MenuItem>
          <MenuItem value="four_wheeler">Four Wheeler</MenuItem>
          <MenuItem value="cab/auto">Cab/Auto</MenuItem>
          <MenuItem value="ibus/citybus">IBus/City Bus</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
      </div>

      {/* Sports Teams */}
      <div className="form-group">
        <TextField
          label="Creativefuel's Official Sports Teams"
          variant="outlined"
          fullWidth
          value={sportsTeam}
          onChange={(e) => setSportsTeam(e.target.value)}
        />
      </div>

      {/* Smoking Dropdown */}
      <div className="form-group">
        <TextField
          select
          label="Do You Smoke?"
          variant="outlined"
          fullWidth
          value={smoking}
          onChange={(e) => setSmoking(e.target.value)}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </div>

      {/* Conditional Smoking Days Input */}
      {smoking === "Yes" && (
        <div className="form-group">
          <TextField
            label="How many do you consume in a day?"
            variant="outlined"
            type="number"
            fullWidth
            value={daysSmoking}
            onChange={(e) => setDaysSmoking(e.target.value)}
          />
        </div>
      )}

      {/* Alcohol Dropdown */}
      <div className="form-group">
        <TextField
          select
          label="Do You Consume Alcohol?"
          variant="outlined"
          fullWidth
          value={alcohol}
          onChange={(e) => setAlcohol(e.target.value)}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </div>

      {/* Medical History */}
      <div className="form-group">
        <TextField
          select
          label="Any Medical History?"
          variant="outlined"
          fullWidth
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </TextField>
      </div>
      {medicalHistory === "Yes" && (
        <div className="form-group">
          <TextField
            label="Describe"
            variant="outlined"
            fullWidth
            value={describe}
            onChange={(e) => setDescribe(e.target.value)}
          />
        </div>
      )}

      <button
        type="button"
        className="btn cmnbtn btn-primary mr-2"
        onClick={handleOtherDetails}
      >
        Save Other Details
      </button>
    </div>
  );
};

export default OtherDetails;
