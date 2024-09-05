import React, { useState, useEffect, useCallback } from "react";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import FormContainer from "../../FormContainer";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import axios from "axios";

const ShareIncentive = () => {
  const { userContextData } = useAPIGlobalContext();
  const [selectedExecutive, setSelectedExecutive] = useState();
  const [executiveFields, setExecutiveFields] = useState([]);
  const [availableUsers, setAvailableUsers] = useState(userContextData);

  const handleExecutiveSelect = (executiveId) => {
    const selectedUser = availableUsers.find(
      (user) => user.user_id === executiveId
    );
    setSelectedExecutive(executiveId);

    if (selectedUser) {
      setExecutiveFields([
        ...executiveFields,
        { user: selectedUser, percentage: "" },
      ]);
      setAvailableUsers(
        availableUsers.filter((user) => user.user_id !== executiveId)
      );
    }
  };

  const handlePercentageChange = useCallback(
    (index, value) => {
      const newFields = [...executiveFields];
      newFields[index].percentage = value;
      setExecutiveFields(newFields);
    },
    [executiveFields]
  );

  const handleDelete = (index) => {
    const removedUser = executiveFields[index].user;
    setExecutiveFields(executiveFields.filter((_, i) => i !== index));
    setAvailableUsers([...availableUsers, removedUser]);
    setSelectedExecutive();
  };

  useEffect(() => {
    if (executiveFields.length > 0) {
      const totalPercentage = executiveFields
        .slice(0, -1)
        .reduce((acc, field) => acc + Number(field.percentage || 0), 0);
      const remainingPercentage = Math.max(0, 100 - totalPercentage);
      setExecutiveFields((prevFields) => {
        const newFields = [...prevFields];
        newFields[newFields.length - 1].percentage = remainingPercentage;
        return newFields;
      });
    }
  }, [
    executiveFields.length,
    executiveFields
      .slice(0, -1)
      .map((field) => field.percentage)
      .join(","),
  ]);

  const handleSubmit = async () => {
    const data = executiveFields.map((field) => ({
      user_id: field.user.user_id,
      percentage: field.percentage,
    }));

    try {
      const response = await axios.post("/your-api-endpoint", data); // Replace with your API endpoint
      console.log("API response:", response.data);
      // Handle successful response
    } catch (error) {
      console.error("Error submitting data:", error);
      // Handle error
    }
  };

  return (
    <div className="w-700">
      <FormContainer mainTitle="Share Incentive" link={true} />
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Share Incentive</h5>
        </div>
        <div className="card-body row">
          <div className="col-12">
            <CustomSelect
              fieldGrid="12"
              label="Executives"
              dataArray={availableUsers}
              optionId="user_id"
              optionLabel="user_name"
              selectedId={selectedExecutive}
              setSelectedId={handleExecutiveSelect}
            />
          </div>
          {executiveFields.map((field, index) => (
            <div key={index} className="col-12 row mt-3 align-items-center">
              <div className="col-4">
                <label className="form-label">Executive Name </label>
                <input
                  type="text"
                  className="form-control"
                  value={field.user.user_name}
                  readOnly
                />
              </div>
              <div className="col-4">
                <label className="form-label">Percentage</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Percentage"
                  value={field.percentage}
                  onChange={(e) =>
                    handlePercentageChange(index, e.target.value)
                  }
                  disabled={index === executiveFields.length - 1}
                />
              </div>
              <div className="col-2">
                <button
                  title="Delete"
                  className="icon-1"
                  onClick={() => handleDelete(index)}
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          ))}
          <div className="col-12 mt-3">
            <button
              className="btn cmnbtn btn-primary"
              onClick={handleSubmit}
              disabled={
                executiveFields.reduce(
                  (acc, field) => acc + Number(field.percentage || 0),
                  0
                ) !== 100
              }
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareIncentive;
