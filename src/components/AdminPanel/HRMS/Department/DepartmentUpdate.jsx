import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Select from "react-select";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";

const DepartmentUpdate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [id, setId] = useState(0);
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [shortName, setShortName] = useState("");

  const [majorDepartmentName, setMajorDepartmentName] = useState("");
  const [MajorDepartmentData, setMejorDepartmentData] = useState([]);

  const [error, setError] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  function MajorDeptDatas() {
    axios.get(baseUrl + "get_all_major_departments").then((res) => {
      setMejorDepartmentData(res.data);
    });
  }
  useEffect(() => {
    MajorDeptDatas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!departmentName) {
      return toastError("Fill Required Field");
    }
    if (!shortName) {
      return toastError("Fill Required Field");
    }

    try {
      await axios.put(`${baseUrl}update_department`, {
        dept_id: id,
        dept_name: departmentName,
        m_dept_id: majorDepartmentName,
        short_name: shortName,
        remark: remark,
        // Created_by: createdBy,
      });
      setDepartmentName("");
      setRemark("");
      toastAlert("Updated Successfully");
      setIsFormSubmitted(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    setId(localStorage.getItem("dept_id"));
    setDepartmentName(localStorage.getItem("dept_name"));
    setMajorDepartmentName(localStorage.getItem("m_dept_id"));
    setShortName(localStorage.getItem("short_name"));
    setRemark(localStorage.getItem("Remarks"));
    setCreationDate(localStorage.getItem("Creation_date").substring(0, 10));
    setCreatedBy(localStorage.getItem("created_by_name"));
    setLastUpdatedBy(localStorage.getItem("Last_updated_by"));
    setLastUpdatedDate(
      localStorage.getItem("Last_updated_date").substring(0, 10)
    );
  }, []);

  if (isFormSubmitted) {
    return <Navigate to="/admin/department-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Department"
        title="Department Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Department Name"
          astric
          fieldGrid={4}
          required={false}
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <div className="col-4">
          <label className="form-label">
            Major Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={MajorDepartmentData.map((option) => ({
              value: option.m_dept_id,
              label: `${option.m_dept_name}`,
            }))}
            value={{
              value: majorDepartmentName,
              label:
                MajorDepartmentData.find(
                  (user) => user.m_dept_id === majorDepartmentName
                )?.m_dept_name || "",
            }}
            onChange={(e) => {
              const deptVal = e.value;
              setMajorDepartmentName(deptVal);
            }}
            required
          />
        </div>
        <FieldContainer
          label="Short Name"
          astric
          fieldGrid={4}
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          required={false}
        />
        <FieldContainer
          label="Remark"
          rows={"4"}
          required={false}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <FieldContainer
          label="Creation Date"
          disabled
          value={creationDate}
          onChange={(e) => setCreationDate(e.target.value)}
        />
        {/* <FieldContainer
          label="Created By"
          disabled
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
        /> */}
      </FormContainer>
    </>
  );
};

export default DepartmentUpdate;
