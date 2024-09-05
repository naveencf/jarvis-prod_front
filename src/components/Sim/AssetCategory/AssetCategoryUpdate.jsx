import React, { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const AssetCategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [selfAuditPeriod, setSelfAuditPeriod] = useState("");
  const [selfAuditUnit, setSelfAuditUnit] = useState("");
  const [hrselfAuditPeriod, setHrSelfAuditPeriod] = useState("");
  const [hrselfAuditUnit, setHrSelfAuditUnit] = useState("");

  const Unit = ["Month(s)", "Day(s)", "Year(s)"];

  useEffect(() => {
    getData();
  }, [id]);

  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_asset_category/${id}`).then((res) => {
      const response = res.data.data;
      setCategoryName(response.category_name);
      setDescription(response.description);
      setSelfAuditPeriod(response.selfAuditPeriod);
      setSelfAuditUnit(response.selfAuditUnit);
      setHrSelfAuditPeriod(response.hrAuditPeriod);
      setHrSelfAuditUnit(response.hrAuditUnit);
      
    });
  };

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
      const response = await axios.put(baseUrl + "update_asset_category", {
        category_id: id,
        category_name: categoryName,
        description: description,
        selfAuditPeriod: selfAuditPeriod,
        selfAuditUnit: selfAuditUnit,
        hrAuditPeriod: hrselfAuditPeriod,
        hrAuditUnit: hrselfAuditUnit,
        last_updated_by: loginUserId,
      });
      toastAlert("Data Updated Successfully");
      setCategoryName("");
      setDescription("");
      if (response.status == 200) {
        navigate("/asset-category-overview");
      }
    } catch (error) {
      toastAlert(error.message);
    }
  };

  return (
    <>
      <UserNav />
      <div style={{ width: "80%", margin: "40px 0 0 10%" }}>
        <FormContainer
          mainTitle="Asset"
          title="Category Update"
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            fieldGrid={12}
            label="Category Name"
            value={categoryName}
            astric
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
              Self Audit Unit
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
              required
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
              {hrselfAuditUnit && <span style={{ color: "red" }}> *</span>}{" "}
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
              required
            />
          </div>
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

export default AssetCategoryUpdate;
