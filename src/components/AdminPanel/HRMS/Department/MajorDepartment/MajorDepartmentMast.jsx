import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../../../Context/Context";
import { baseUrl } from "../../../../../utils/config";
import FormContainer from "../../../FormContainer";
import FieldContainer from "../../../FieldContainer";

export default function MajorDepartmentMast() {
  // const { DepartmentContext } = useAPIGlobalContext();
  const { toastAlert, toastError } = useGlobalContext();
  const [DepartmentContext, getDepartmentData] = useState([]);
  const [majorDepartmentName, setMajorDepartmentName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [isRequired, setIsRequired] = useState({
    majorDepartmentName: false,
    // departmentName: false,
  });

  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (majorDepartmentName === "") {
      setIsRequired((prev) => ({ ...prev, majorDepartmentName: true }));
      isValid = false;
    }

    if (!isValid) {
      return toastError("Fill Required Field");
    }

    try {
      const response = await axios.post(baseUrl + "add_major_department", {
        m_dept_name: majorDepartmentName,
        // dept_id: departmentName,
        remark: remark,
        created_by: loginUserId,
      });

      setMajorDepartmentName("");
      setDepartmentName("");
      setRemark("");
      toastAlert("Submitted successfully");
      setIsFormSubmitted(true);
    } catch (error) {
      toastError("Error while adding sub department.");
      alert(error.response.data.message);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/major-department-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Major-Department"
        title="Major-Department"
        handleSubmit={handleSubmit}
      >
        <div className="col-6">
          <FieldContainer
            label="Major-Department Name"
            value={majorDepartmentName}
            astric
            fieldGrid={12}
            required={false}
            onChange={(e) => {
              const subDeptVal = e.target.value;
              setMajorDepartmentName(subDeptVal);
              if (subDeptVal === "") {
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
          />
          {isRequired.majorDepartmentName && (
            <p className="form-error">Please Enter Major Department</p>
          )}
        </div>

        {/* <div className="form-group col-6">
          <label className="form-label">
            Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={DepartmentContext.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: departmentName,
              label:
                DepartmentContext.find(
                  (user) => user.dept_id === departmentName
                )?.dept_name || "",
            }}
            onChange={(e) => {
              const deptVal = e.value;
              setDepartmentName(deptVal);
              if (deptVal === "") {
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
            required
          />
          {isRequired.departmentName && (
            <p className="form-error">Please Select Department</p>
          )}
        </div> */}

        <FieldContainer
          label="Remark"
          value={remark}
          required={false}
          Tag="textarea"
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
}
