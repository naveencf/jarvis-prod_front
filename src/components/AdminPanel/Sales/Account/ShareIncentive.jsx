import React, { useState, useEffect, useCallback } from "react";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import FormContainer from "../../FormContainer";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import getDecodedToken from "../../../../utils/DecodedToken";
import FieldContainer from "../../FieldContainer";

const ShareIncentive = ({ closeModal, accountInfo }) => {
  const { userContextData } = useAPIGlobalContext();
  const [incentivepercentage, setIncentivePercentage] = useState();
  const [selectedExecutive, setSelectedExecutive] = useState();
  const [executiveFields, setExecutiveFields] = useState([]);
  const [availableUsers, setAvailableUsers] = useState(userContextData);
  const [incentiveSharing, setIncentiveSharing] = useState([]);
  const token = getDecodedToken();
  const loginUser = token.id;

  useEffect(() => {
    setIncentivePercentage(pre => {
      if (pre > 4) {
        return 4;
      } else if (pre < 0) {
        return 0;
      }
      return pre;

    })
  }, [incentivepercentage])

  const handleExecutiveSelect = (executiveId, percent, isprev) => {
    const selectedUser = availableUsers.find(
      (user) => user.user_id === executiveId
    );
    setSelectedExecutive(executiveId);



    if (selectedUser) {
      setExecutiveFields(
        preExec => [
          ...preExec,
          { user: selectedUser, percentage: `${isprev ? percent : ""}` },
        ]);
      setAvailableUsers(
        availableUsers.filter((user) => user.user_id !== executiveId)
      );
    }
  };

  useEffect(() => {
    if (incentiveSharing.length == 0) {

      handleExecutiveSelect(loginUser);
    } else {
      for (let i = 0; i < incentiveSharing.length; i++) {
        const selectedUser = availableUsers.find(
          (user) => user.user_id === incentiveSharing[i].user_id
        );

        handleExecutiveSelect(incentiveSharing[i].user_id, incentiveSharing[i].percentage, 1);

      }
    }
  }, [userContextData, loginUser]);


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
    setExecutiveFields(prevExec => prevExec.filter((_, i) => i !== index));
    setAvailableUsers(prevAvail => [...prevAvail, removedUser]);
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
      percentage: Number(field.percentage),
    }));

    setIncentiveSharing(data);
    closeModal();
  };


  return (
    <div className="w-700">


      <FormContainer link={true} mainTitle={"Share Incentive for" + " " + accountInfo?.[0]?.account_name} />
      <div className="row">
        <FieldContainer
          fieldGrid={12}
          label={"Set Sharing Percentage"}
          type="number"
          placeholder="Percentage"
          value={incentivepercentage}
          onChange={(e) => {
            setIncentivePercentage(e.target.value);
          }}

        />

        <CustomSelect
          fieldGrid="12"
          label="Executives"
          dataArray={availableUsers}
          optionId="user_id"
          optionLabel="user_name"
          selectedId={selectedExecutive}
          setSelectedId={handleExecutiveSelect}
        />

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
              // disabled={index === executiveFields.length - 1}
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
              (executiveFields.length <= 1) ||
              executiveFields.reduce(
                (acc, field) => acc + Number(field.percentage || 0),
                0
              ) !== 100
            }
          >
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareIncentive;
