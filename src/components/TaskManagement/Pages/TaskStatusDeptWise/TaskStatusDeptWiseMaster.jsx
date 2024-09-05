import React, { useEffect, useState } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import FieldContainer from "../../../AdminPanel/FieldContainer";
import axios from "axios";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useGlobalContext } from "../../../../Context/Context";
import { Navigate } from "react-router-dom";
import Select from "react-select";
import {baseUrl} from '../../../../utils/config'

const TaskStatusDeptWiseMaster = () => {
  const tokenValue = getDecodedToken();
  const loginUserId = tokenValue.id;

  const { toastAlert, toastError } = useGlobalContext();

  const [departmentdata, setDepartmentData] = useState([]);
  const [selectedDepartmentID, setSelectedDepartmentID] = useState(null);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentData(res.data);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl+"deptwisestatus", {
        dept_id: selectedDepartmentID,
        status: status,
        description: description,
        created_by: loginUserId,
      });
      setSelectedDepartmentID(null);
      setStatus("");
      setDescription("");
      toastAlert("Status Successfully created");
      setIsFormSubmitted(true);
    } catch (error) {
      toastError("Error Creating Status", error);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/task-status-dept-wise-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Task Status Creation Department Wise"
        title="Add Task Status"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-3">
          <label className="form-label">
            Department <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={departmentdata.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: selectedDepartmentID,
              label:
                departmentdata.find(
                  (user) => user.dept_id === selectedDepartmentID
                )?.dept_name || "",
            }}
            onChange={(e) => {
              setSelectedDepartmentID(e.value);
            }}
            required
          />
        </div>
        <FieldContainer
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <FieldContainer
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default TaskStatusDeptWiseMaster;
