import { useEffect, useState } from "react";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { Navigate } from "react-router-dom";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const Designation = () => {
  const { toastAlert, toastError } = useGlobalContext();
  // const { DepartmentContext } = useAPIGlobalContext();

  const [isLoading, setIsLoading] = useState(false);

  const [designationName, setDesignationName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [subDepartmentData, setSubDeparmentData] = useState([]);
  const [subDeparmtment, setSubDepartment] = useState("");

  const [DepartmentContext , getDepartmentData] = useState([])

  const [isRequired, setIsRequired] = useState({
    designationName: false,
    departmentName: false,
    subDeparmtment: false,
  });

  useEffect(()=>{
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });
  })

  function subDepartmentDatas() {
    if (departmentName) {
      axios
        .get(baseUrl + `get_subdept_from_dept/${departmentName}`)
        .then((res) => {
          setSubDeparmentData(res.data);
        });
    }
  }
  useEffect(() => {
    subDepartmentDatas();
  }, [departmentName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (designationName == "") {
      setIsRequired((perv) => ({ ...perv, designationName: true }));
    }
    if (departmentName == "") {
      setIsRequired((perv) => ({ ...perv, departmentName: true }));
    }
    if (subDeparmtment == "") {
      setIsRequired((perv) => ({ ...perv, subDeparmtment: true }));
    }

    if (!designationName || designationName == "") {
      return toastError("Fill Required Fields");
    } else if (!departmentName || departmentName == "") {
      return toastError("Fill Required Fields");
    } else if (!subDeparmtment || subDeparmtment == "") {
      return toastError("Fill Required Fields");
    }
    try {
      setIsLoading(true);
      await axios.post(baseUrl + "add_designation", {
        desi_name: designationName,
        dept_id: departmentName,
        sub_dept_id: subDeparmtment,
        remark: remark,
      });
      setDesignationName("");
      setDepartmentName("");
      setRemark("");
      toastAlert("Submitted successfully");
      setIsFormSubmitted(true);
      setIsLoading(false);
    } catch (error) {
      alert(error.response.data.message);
      toastError(errorMessage);
      setIsLoading(false);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/designation-overview" />;
  }
  return (
    <div>
      <FormContainer
        mainTitle="Designation"
        title="Designation"
        submitButton={false}
      >
        <div className="mb-3 row">
          <div className="col-6">
            <FieldContainer
              label="Designation Name"
              astric
              fieldGrid={12}
              required={false}
              value={designationName}
              onChange={(e) => {
                const desiVal = e.target.value;
                setDesignationName(desiVal);
                if (desiVal === "") {
                  setIsRequired((prev) => ({
                    ...prev,
                    designationName: true,
                  }));
                } else {
                  setIsRequired((prev) => ({
                    ...prev,
                    designationName: false,
                  }));
                }
              }}
            />
            {isRequired.designationName && (
              <p className="form-error">Please Enter Designation</p>
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
                const deptvalue = e.value;
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
              required
            />
            {isRequired.departmentName && (
              <p className="form-error">Please select Department</p>
            )}
          </div>
          <div className="form-group col-6">
            <label className="form-label">
              Sub Department Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={subDepartmentData.map((option) => ({
                value: option.sub_dept_id,
                label: `${option.sub_dept_name}`,
              }))}
              value={{
                value: subDeparmtment,
                label:
                  subDepartmentData.find(
                    (user) => user.sub_dept_id === subDeparmtment
                  )?.sub_dept_name || "",
              }}
              onChange={(e) => {
                const subDeptVal = e.value;
                setSubDepartment(subDeptVal);
                if (subDeptVal === "") {
                  setIsRequired((prev) => ({
                    ...prev,
                    subDeparmtment: true,
                  }));
                } else {
                  setIsRequired((prev) => ({
                    ...prev,
                    subDeparmtment: false,
                  }));
                }
              }}
              required
            />
            {isRequired.subDeparmtment && (
              <p className="form-error">Please select Sub Department</p>
            )}
          </div>
          <FieldContainer
            label="Remark"
            value={remark}
            required={false}
            Tag="textarea"
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn cmnbtn btn-primary"
          onClick={handleSubmit}
          style={{ width: "20%", marginLeft: "1%" }}
        >
          {isLoading ? "Please wait submiting..." : "Submit"}
        </button>
      </FormContainer>
    </div>
  );
};

export default Designation;
