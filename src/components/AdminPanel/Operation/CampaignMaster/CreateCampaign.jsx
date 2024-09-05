import React, { useEffect, useState } from "react";
import { Box, TextField, Typography, Modal, Autocomplete } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import jwtDecode from "jwt-decode";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CreateCampaign = ({
  openCamp,
  handleOpenCampaign,
  handleCloseCampaign,
}) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [brand, setBrand] = useState([]);
  const [agency, setAgency] = useState([]);
  const [campaignName, setCampaignName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [hashTag, setHashTag] = useState("");
  const [campImages, setCampImages] = useState(null);
  const [errors, setErrors] = useState({});

  const getBrand = async () => {
    const res = await axios.get(`http://35.200.154.203:8080/api/insta_brand`);
    setBrand(res?.data?.data);
  };

  const getAgency = async () => {
    const res = await axios.get(`http://34.173.148.74:8080/api/agency`);
    setAgency(res?.data.result);
  };

  useEffect(() => {
    getBrand();
    getAgency();
  }, []);

  const handleImageChange = (e) => {
    setCampImages(e.target.files[0]);
    if (e.target.files[0]) {
      setErrors((prev) => ({ ...prev, campImages: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!campaignName) newErrors.campaignName = "Campaign name is required";
    if (!brandName) newErrors.brandName = "Brand is required";
    if (!agencyName) newErrors.agencyName = "Agency is required";
    // if (!hashTag) newErrors.hashTag = "Hashtag is required";
    // if (!campImages) newErrors.campImages = "Campaign image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("exe_campaign_name", campaignName);
    formData.append("brand_id", brandName);
    formData.append("agency_id", agencyName);
    formData.append("exe_hash_tag", hashTag);
    formData.append("exe_campaign_image", campImages);
    formData.append("created_by", loginUserId);
    formData.append("user_id", loginUserId);

    try {
      const res = await axios.post(`${baseUrl}exe_campaign`, formData);
      handleCloseCampaign();
      setCampaignName("");
      setBrandName("");
      setAgencyName("");
      setHashTag("");
      setCampImages(null);
      setErrors("")
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case "campaignName":
        setCampaignName(value);
        if (value) setErrors((prev) => ({ ...prev, campaignName: null }));
        break;
      case "brandName":
        setBrandName(value);
        if (value) setErrors((prev) => ({ ...prev, brandName: null }));
        break;
      case "agencyName":
        setAgencyName(value);
        if (value) setErrors((prev) => ({ ...prev, agencyName: null }));
        break;
      case "hashTag":
        setHashTag(value);
        if (value) setErrors((prev) => ({ ...prev, hashTag: null }));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Modal
        open={openCamp}
        onClose={handleCloseCampaign}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Campaign
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Campaign"
            variant="outlined"
            value={campaignName}
            onChange={(e) => handleFieldChange("campaignName", e.target.value)}
            error={!!errors.campaignName}
            helperText={errors.campaignName}
          />
          <Autocomplete
            options={brand}
            getOptionLabel={(option) => option.instaBrandName}
            onChange={(event, newValue) => {
              handleFieldChange("brandName", newValue ? newValue._id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brand"
                variant="outlined"
                error={!!errors.brandName}
                helperText={errors.brandName}
              />
            )}
          />
          <Autocomplete
            options={agency}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              handleFieldChange("agencyName", newValue ? newValue._id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Agency"
                variant="outlined"
                error={!!errors.agencyName}
                helperText={errors.agencyName}
              />
            )}
          />
          <TextField
            type="file"
            onChange={handleImageChange}
            // error={!!errors.campImages}
            // helperText={errors.campImages}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Hash Tag"
            variant="outlined"
            value={hashTag}
            onChange={(e) => handleFieldChange("hashTag", e.target.value)}
            // error={!!errors.hashTag}
            // helperText={errors.hashTag}
          />
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-danger rounded-pill"
              onClick={handleSave}
            >
              Submit
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateCampaign;
