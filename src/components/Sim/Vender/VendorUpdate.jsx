import { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Select from "react-select";
import { Autocomplete, TextField } from "@mui/material";
import { baseUrl } from "../../../utils/config";

const VendorUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert, toastError, categoryDataContext } = useGlobalContext();
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
  const [type, setType] = useState("");

  const [companyName, setCompanyName] = useState("");

  const Type = ["Self", "Service", "Both"];
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      getData();
    }, 1000);
  }, [categoryDataContext]);

const getData = () => {
    axios.get(`${baseUrl}` + `get_single_vendor/${id}`).then((res) => {
      const response = res?.data.data;

      const selectedCategories =
        categoryDataContext?.length > 0
          ? response.vendor_category?.map((category) => ({
              label: categoryDataContext?.find((e) => e.category_id == category)
                ?.category_name,
              value: category ? +category : "",
            }))
          : [];

      setSelectedCategory(selectedCategories);

      const availableCategories = categoryDataContext?.filter(
        (category) =>
          !selectedCategories?.find(
            (selected) => selected.value === category.category_id
          )
      );
      setFilteredCategories(availableCategories);

      setVendorName(response.vendor_name);
      setVendorContact(response.vendor_contact_no);
      setVendorEmail(response.vendor_email_id);
      setVendorAddress(response.vendor_address);
      setDescription(response.description);
      setSecondaryContact(response.secondary_contact_no);
      setSecondaryPersonName(response.secondary_person_name);
      setType(response.vendor_type);
      setCompanyName(response.company_name);

    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorContact || vendorContact == "" || vendorContact.length !== 10) {
      return toastError(" Contact is Required and must be 10 digits");
    } else if (vendorEmail) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(vendorEmail)) {
        return toastError("Invalid email format");
      }
    } else if (secondaryContact.length !== 10) {
      return toastError("Secondory Contact is Required and must be 10 digits");
    }

    try {
      const response = await axios.put(baseUrl + "update_vendor", {
        vendor_id: id,
        vendor_name: vendorName,
        vendor_contact_no: vendorContact,
        vendor_email_id: vendorEmail,
        vendor_address: vendorAddress,
        description: description,
        created_by: loginUserId,
        last_updated_by: loginUserId,
        secondary_contact_no: secondaryContact,
        secondary_person_name: secondaryPersonName,
        vendor_type: type,
        vendor_category: selectedCategory?.map((category) => category.value),
        company_name: companyName,
      });
      toastAlert("Data Updated Successfully");
      setVendorName("");
      setDescription("");
      setVendorAddress("");
      setVendorContact("");
      setVendorEmail("");
      if (response.status == 200) {
        navigate("/venderOverView");
      }
    } catch (error) {
      toastAlert(error.message);
    }
  };
  // const categoryChangeHandler = (e, op) => {
  //   setSelectedCategory(op);
  // };
  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);

    const newFilteredCategories = categoryDataContext?.filter(
      (category) =>
        !op.find((selected) => selected.value === category.category_id)
    );
    setFilteredCategories(newFilteredCategories);
  };

  return (
    <>
      <UserNav />
      <div style={{ width: "80%", margin: "40px 0 0 10%" }}>
        <FormContainer
          mainTitle="Vendor"
          title="Vendor Update"
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            label=" Vendor Name"
            astric
            value={vendorName}
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
              value={selectedCategory}
              options={filteredCategories?.map((d) => ({
                label: d.category_name,
                value: d.category_id,
              }))}
              InputLabelProps={{ shrink: true }}
              renderInput={(params) => (
                <TextField {...params} label="Vendor Category" />
              )}
              onChange={categoryChangeHandler}
            />
          </div>
          <FieldContainer
            label="Contact"
            astric
            value={vendorContact}
            onChange={(e) => {
              if (e.target.value?.length <= 10) {
                setVendorContact(e.target.value);
              }
            }}
          />
          <FieldContainer
            label="Secondary contact"
            value={secondaryContact}
            astric
            required={false}
            onChange={(e) => {
              if (e.target.value?.length <= 10) {
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
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
            required={false}
          />

          <FieldContainer
            label="Company Name"
            value={companyName}
            required={false}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <FieldContainer
            label="Address"
            required={false}
            value={vendorAddress}
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

export default VendorUpdate;
