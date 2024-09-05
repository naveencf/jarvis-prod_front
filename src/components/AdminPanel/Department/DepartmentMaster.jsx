import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import Select from "react-select";

const DepartmentMaster = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [shortName, setShortName] = useState("");
  const [majorDepartmentName, setMajorDepartmentName] = useState("");
  const [data, setData] = useState([]);
  const [MajorDepartmentData , setMejorDepartmentData] = useState([])

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [isRequired, setIsRequired] = useState({
    departmentName: false,
    shortName: false,
    majorDepartmentName: false,
  });

  function MajorDeptDatas() {
    axios.get(baseUrl + "get_all_major_departments").then((res) => {
      setMejorDepartmentData(res.data)
    });
  }

  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setData(res.data);
    });

    MajorDeptDatas()
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (departmentName == "") {
      setIsRequired((perv) => ({ ...perv, departmentName: true }));
    }
    if (shortName == "") {
      setIsRequired((perv) => ({ ...perv, shortName: true }));
    }
    if (majorDepartmentName == "") {
      setIsRequired((perv) => ({ ...perv, majorDepartmentName: true }));
    }

    if (!departmentName) {
      return toastError("Fill Required Field");
    }

    if (!shortName) {
      return toastError("Fill Required Field");
    }

    const isModalExists = data.some((d) => d.dept_name === departmentName);
    if (isModalExists) {
      alert("Department already Exists");
    } else {
      await axios
        .post(baseUrl + "add_department", {
          dept_name: departmentName,
          short_name: shortName,
          m_dept_id: majorDepartmentName,
          remark: remark,
          Created_by: loginUserId,
        })
        .then((response) => {
          if (response.data.data == 409) {
            toastError("The department already exists.");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setDepartmentName("");
      setRemark("");
      setShortName('')

      toastAlert("Added Successfully");
      setIsFormSubmitted(true);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/department-overview" />;
  }

  return (
    <div>
      <FormContainer
        mainTitle="Department"
        title="Department"
        handleSubmit={handleSubmit}
      >
        <div className="mb-4 row">
          <div className="col-4">
            <FieldContainer
              label="Department Name"
              astric
              fieldGrid={12}
              required={false}
              value={departmentName}
              onChange={(e) => {
                const deptvalue = e.target.value;
                setDepartmentName(deptvalue);
                if (deptvalue === "") {
                  setIsRequired((prev) => ({
                    ...prev,
                    departmentName: true,
                  }));
                } else {
                  setIsRequired((prev) => ({
                    ...prev,
                    departmentName: false,
                  }));
                }
              }}
            />
            {isRequired.departmentName && (
              <p className="form-error">Please Enter Department</p>
            )}
          </div>

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
              if (deptVal === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  majorDepartmentName: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  majorDepartmentName: false,
                }));
              }
            }}
            required
          />
          {isRequired.majorDepartmentName && (
            <p className="form-error">Please Enter Major Department</p>
          )}
        </div>

          <div className="col-4">
            <FieldContainer
              label="Short Name"
              value={shortName}
              onChange={(e) => {
                setShortName(e.target.value)
                if (e.target.value === "") {
                  setIsRequired((prev) => ({
                    ...prev,
                    shortName: true,
                  }));
                } else {
                  setIsRequired((prev) => ({
                    ...prev,
                    shortName: false,
                  }));
                }
              }}
              required={false}
              astric
            />
            {isRequired.shortName && (
              <p className="form-error">Please Enter Short Name</p>
            )}
          </div>
          {/* <FieldContainer
          label="Created By"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          disabled
        /> */}
          <FieldContainer
            label="Remark"
            Tag="textarea"
            value={remark}
            required={false}
            onChange={(e) => setRemark(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </FormContainer>
    </div>
  );
};

export default DepartmentMaster;
