import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";
import {baseUrl} from '../../../utils/config'

const ObjectMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [objectName, setObjectName] = useState("");
  const [softwareName, setSoftwareName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [deptData, setDeptData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const [isRequired, setIsRequired] = useState({
    objectName: false,
    softwareName: false,
    selectedDepartment: false,
  });

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => setDeptData(res.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (objectName == "") {
      setIsRequired((perv) => ({ ...perv, objectName: true }));
    }
    if (softwareName == "") {
      setIsRequired((perv) => ({ ...perv, softwareName: true }));
    }
    if (selectedDepartment == "") {
      setIsRequired((perv) => ({ ...perv, selectedDepartment: true }));
    }

    if (!objectName || objectName == "") {
      return toastError("Fill Required Fields");
    }
    if (!softwareName || softwareName == "") {
      return toastError("Fill Required Fields");
    }
    if (!selectedDepartment || selectedDepartment == "") {
      return toastError("Fill Required Fields");
    }
    axios
      .post(baseUrl+"add_obj", {
        obj_name: objectName,
        soft_name: softwareName,
        dept_id: selectedDepartment,
        created_by: userId,
      })
      .then(() => {
        setObjectName("");
        setSoftwareName("");
        setSelectedDepartment("");
        toastAlert("Form Submitted success");
        setIsFormSubmitted(true);
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/object-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Object"
        title="Object Master"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-6">
        <FieldContainer
        required={false}
          label="Object Name"
          fieldGrid={12}
          value={objectName}
          astric
          onChange={(e) =>{
             setObjectName(e.target.value)
             if (e.target.value === "") {
              setIsRequired((prev) => ({
                ...prev,
                objectName: true,
              }));
            } else {
              setIsRequired((prev) => ({
                ...prev,
                objectName: false,
              }));
            }
            }}
        />
        {isRequired.objectName && (
            <p className="form-error">Please Enter Object Name</p>
          )}
          </div>
        

          <div className="form-group col-6">
        <FieldContainer
          label="Software Name"
          astric
          required={false}
          value={softwareName}
          onChange={(e) =>{
             setSoftwareName(e.target.value)
             if (e.target.value === "") {
              setIsRequired((prev) => ({
                ...prev,
                softwareName: true,
              }));
            } else {
              setIsRequired((prev) => ({
                ...prev,
                softwareName: false,
              }));
            }
            }}
        />
        {isRequired.softwareName && (
            <p className="form-error">Please Enter Software Name</p>
          )}
        </div>

        {/* <FieldContainer
          label="Department"
          Tag="select"
          className="form-select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(Number(e.target.value))}
        >
          <option disabled selected value="">
            Choose...
          </option>
          {deptData.map((d) => (
            <option key={d.dept_id} value={d.dept_id}>
              {d.dept_name}
            </option>
          ))}
        </FieldContainer> */}
        <div className="form-group col-6">
          <label className="form-label">
            Department <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={deptData.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: selectedDepartment,
              label:
                deptData.find((user) => user.dept_id === selectedDepartment)
                  ?.dept_name || "",
            }}
            onChange={(e) => {
              setSelectedDepartment(e.value);
              if (e.value === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  selectedDepartment: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  selectedDepartment: false,
                }));
              }
            }}
            required
          />
          {isRequired.selectedDepartment && (
            <p className="form-error">Please Select Department Name</p>
          )}
        </div>
      </FormContainer>
    </>
  );
};

export default ObjectMaster;
