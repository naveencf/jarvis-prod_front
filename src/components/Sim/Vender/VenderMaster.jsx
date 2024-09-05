import { useState, useEffect } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import axios from "axios";
import UserNav from "../../Pantry/UserPanel/UserNav";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { Autocomplete, TextField } from "@mui/material";
import { baseUrl } from "../../../utils/config";

const VenderMaster = () => {
  const { toastAlert, toastError, categoryDataContext } = useGlobalContext();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [vendorName, setVendorName] = useState("");
  const [vendorContact, setVendorContact] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [secondaryContact, setSecondaryContact] = useState("");
  const [secondaryPersonName, setSecondaryPersonName] = useState("");

  const [companyName, setCompanyName] = useState("");

  const [type, setType] = useState("");

  const Type = ["Sales", "Service", "Both"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorName || vendorName == "") {
      return toastError("Vendor Name is required");
    } else if (!type || type == "") {
      return toastError("Type is required");
    } else if (!selectedCategory || selectedCategory == "") {
      return toastError("Selected Category is required");
    } else if (
      !vendorContact ||
      vendorContact == "" ||
      vendorContact.length !== 10
    ) {
      return toastError(" Contact is Required and must be 10 digits");
    }
    if (vendorEmail) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(vendorEmail)) {
        return toastError("Invalid email format");
      }
    } else if (secondaryContact.length !== 10) {
      return toastError("Secondory Contact is Required and must be 10 digits");
    }

    try {
      const response = await axios.post(baseUrl + "add_vendor", {
        vendor_name: vendorName,
        vendor_type: type,
        vendor_category: selectedCategory.map((category) => category.value),
        vendor_contact_no: vendorContact,
        secondary_contact_no: secondaryContact,
        secondary_person_name: secondaryPersonName,
        vendor_email_id: vendorEmail,
        vendor_address: vendorAddress,
        description: description,
        created_by: loginUserId,
        last_updated_by: loginUserId,

        company_name: companyName,
      });
      toastAlert("Data posted successfully!");
      setVendorName("");
      setDescription("");
      setVendorAddress("");
      setVendorContact("");
      setVendorEmail("");
      if (response.status == 200) {
        navigate("/venderOverView");
      }
    } catch (error) {
      toastAlert(error.mesaage);
    }
  };

  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);
  };

  // Filter the options to exclude the selected categories
  const filteredCategoryOptions = categoryDataContext
    .filter(
      (category) =>
        !selectedCategory.find(
          (selected) => selected.value === category.category_id
        )
    )
    .map((category) => ({
      label: category.category_name,
      value: category.category_id,
    }));
  return (
    <>
      <UserNav />
      <div style={{ width: "80%", margin: "40px 0 0 10%" }}>
        <FormContainer
          mainTitle="Vendor "
          title="Vendor Create"
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            label=" Vendor Name"
            value={vendorName}
            required={false}
            astric
            onChange={(e) => setVendorName(e.target.value)}
          />
          <div className="form-group col-6">
            <label className="form-label">
              Vendor Type <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={Type.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: type,
                label: `${type}`,
              }}
              onChange={(e) => {
                setType(e.value);
              }}
              required
            />
          </div>
          <div className="col-sm-12 col-lg-6 ">
            <Autocomplete
              multiple
              id="combo-box-demo"
              options={filteredCategoryOptions}
              getOptionLabel={(option) => option.label}
              InputLabelProps={{ shrink: true }}
              renderInput={(params) => (
                <TextField {...params} label="Vendor Category" />
              )}
              onChange={categoryChangeHandler}
              value={selectedCategory}
            />
          </div>
          <FieldContainer
            label="Contact"
            astric
            value={vendorContact}
            type="number"
            required={false}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                setVendorContact(e.target.value);
              }
            }}
          />
          <FieldContainer
            label="Secondary contact"
            type="number"
            astric
            value={secondaryContact}
            required={false}
            onChange={(e) => {
              if (e.target.value.length <= 10) {
                setSecondaryContact(e.target.value);
              }
            }}
          />
          <FieldContainer
            label="Secondary Person Name"
            value={secondaryPersonName}
            required={false}
            onChange={(e) => setSecondaryPersonName(e.target.value)}
          />
          <FieldContainer
            label="Email ID"
            required={false}
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
          />
          <FieldContainer
            label="Company Name"
            value={companyName}
            required={false}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <FieldContainer
            label="Address"
            value={vendorAddress}
            required={false}
            onChange={(e) => setVendorAddress(e.target.value)}
          />

          {/* <FieldContainer
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /> */}
        </FormContainer>
      </div>
    </>
  );
};

export default VenderMaster;
