import React, { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import axios from "axios";
import UserNav from "../../Pantry/UserPanel/UserNav";
import { Navigate, useNavigate } from "react-router-dom";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const AssetCategoryMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [selfAuditPeriod, setSelfAuditPeriod] = useState("");
  const [selfAuditUnit, setSelfAuditUnit] = useState("");
  const [hrselfAuditPeriod, setHrSelfAuditPeriod] = useState("");
  const [hrselfAuditUnit, setHrSelfAuditUnit] = useState("");
  const Unit = ["Day(s)", "Month(s)", "Year(s)"];
  const [categoryData, setCategoryData] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_asset_category");

      setCategoryData(response.data.data?.asset_categories);
    } catch (error) {
      // toastAlert("Data not submitted", error.message);
      return null;
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selfAuditPeriod && !selfAuditUnit) {
      toastError(
        "Please select a Self Audit Unit when a Self Audit Period is given."
      );
      return;
    }
    if (hrselfAuditPeriod && !hrselfAuditUnit) {
      toastError(
        "Please select a HR Audit Unit when a HR Audit Period is given."
      );
      return;
    }
    try {
      const isCategoryExist = categoryData.some(
        (d) => d.category_name === categoryName
      );
      if (isCategoryExist) {
        alert("Category already Exists");
      } else {
        const response = await axios.post(baseUrl + "add_asset_category", {
          category_name: categoryName,
          description: description,
          selfAuditPeriod: selfAuditPeriod,
          selfAuditUnit: selfAuditUnit,
          hrselfAuditPeriod: hrselfAuditPeriod,
          hrAuditUnit: hrselfAuditUnit,
          created_by: loginUserId,
          last_updated_by: loginUserId,
        });
        toastAlert("Data posted successfully!");
        setCategoryName("");
        setDescription("");
        if (response.status == 200) {
          navigate("/asset-category-overview");
        }
        setIsFormSubmitted(true);
      }
    } catch (error) {
      // toastAlert(error.mesaage);
    }
  };
  if (isFormSubmitted) {
    return <Navigate to="/asset-category-overview" />;
  }
  return (
    <>
      <UserNav />
      <div style={{ width: "80%", margin: "40px 0 0 10%" }}>
        <FormContainer
          mainTitle="Asset Category "
          title="Category Master"
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            fieldGrid={12}
            label="Category Name"
            astric
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <FieldContainer
            type="number"
            label="Self Audit Period"
            value={selfAuditPeriod}
            required={false}
            onChange={(e) => setSelfAuditPeriod(e.target.value)}
          />

          <div className="form-group col-6">
            <label className="form-label">
              Self Audit Unit{" "}
              {selfAuditPeriod && <span style={{ color: "red" }}> *</span>}
            </label>
            <Select
              className=""
              options={Unit.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: selfAuditUnit,
                label: `${selfAuditUnit}`,
              }}
              onChange={(e) => {
                setSelfAuditUnit(e.value);
              }}
              // required
            />
          </div>
          <FieldContainer
            type="number"
            label="Hr Audit Period"
            required={false}
            value={hrselfAuditPeriod}
            onChange={(e) => setHrSelfAuditPeriod(e.target.value)}
          />
          <div className="form-group col-6">
            <label className="form-label">
              HR Audit Unit{" "}
              {hrselfAuditPeriod && <span style={{ color: "red" }}> *</span>}{" "}
            </label>
            <Select
              className=""
              options={Unit.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: hrselfAuditUnit,
                label: `${hrselfAuditUnit}`,
              }}
              onChange={(e) => {
                setHrSelfAuditUnit(e.value);
              }}
              // required
            />
          </div>
        </FormContainer>
      </div>
    </>
  );
};

export default AssetCategoryMaster;
