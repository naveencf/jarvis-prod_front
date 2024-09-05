import { useEffect, useState } from "react";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

export default function SubDepartmentMaster() {
  // const { DepartmentContext } = useAPIGlobalContext();
  const { toastAlert, toastError } = useGlobalContext();
  const [DepartmentContext , getDepartmentData] = useState([])
  const [subDepartmentName, setSubDepartmentName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const [isRequired, setIsRequired] = useState({
    subDepartmentName: false,
    departmentName: false,
  });

  useEffect(()=>{
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (subDepartmentName === "") {
      setIsRequired((prev) => ({ ...prev, subDepartmentName: true }));
      isValid = false;
    }
    if (departmentName === "") {
      setIsRequired((prev) => ({ ...prev, departmentName: true }));
      isValid = false;
    }

    if (!isValid) {
      return toastError("Fill Required Field");
    }

    try {
      const response = await axios.post(baseUrl + "add_sub_department", {
        sub_dept_name: subDepartmentName,
        dept_id: departmentName,
        remark: remark,
        created_by: loginUserId,
      });

      setSubDepartmentName("");
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
    return <Navigate to="/admin/sub-department-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Sub-Department"
        title="Sub-Department"
        handleSubmit={handleSubmit}
      >
        <div className="col-6">
          <FieldContainer
            label="Sub-Department Name"
            value={subDepartmentName}
            astric
            fieldGrid={12}
            required={false}
            onChange={(e) => {
              const subDeptVal = e.target.value;
              setSubDepartmentName(subDeptVal);
              if (subDeptVal === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  subDepartmentName: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  subDepartmentName: false,
                }));
              }
            }}
          />
          {isRequired.subDepartmentName && (
            <p className="form-error">Please Enter Sub Department</p>
          )}
        </div>

        <div className="form-group col-6">
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
        </div>

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
