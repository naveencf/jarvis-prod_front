import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { baseUrl } from "../../../../utils/config";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { useCreateIncentivePlanMutation } from "../../../Store/API/Sales/IncentivePlanApi";
import { useGetAllSaleServiceQuery } from "../../../Store/API/Sales/SalesServiceApi";
import { set } from "date-fns";
import Loader from "../../../Finance/Loader/Loader";

const IncentiveCreate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { userID } = useAPIGlobalContext();
  const [servicename, setServiceName] = useState("");
  const [incentiveType, setIncentiveType] = useState("");
  const [values, setValues] = useState("");
  const [salesServiceData, setSalesServiceData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [isValid, setIsValid] = useState({
    sales_service_master_id: false,
    incentive_type: false,
    value: false,
  });

  const navigate = useNavigate();
  const IncentiveTypeData = [
    { value: "fixed", label: "Fixed" },
    { value: "variable", label: "Variable" },
  ];
  const [addIncentive, { isLoading: incentiveLoading, error: incentiveError }] =
    useCreateIncentivePlanMutation();
  const {
    data: allSalesServiceData,
    isLoading: salesServiceLoading,
    isError: salesServiceError,
  } = useGetAllSaleServiceQuery();

  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl + "sales/getlist_sale_service_master"
      );
      const data = response.data.data;
      setSalesServiceData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      sales_service_master_id: servicename,
      incentive_type: incentiveType,
      value: values,
      created_by: userID,
    };
    const newValidationState = {
      sales_service_master_id: !servicename,
      incentive_type: !incentiveType,
      value: !values,
    };
    const hasErrors = Object.values(newValidationState).some(
      (isInvalid) => isInvalid
    );
    setIsValid(newValidationState);
    if (hasErrors) {
      return;
    }
    try {
      await addIncentive(payload).unwrap();
      toastAlert("Submitted Successfully");
      setServiceName("");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error(error);
      toastError("Failed to submit");
    }
  };

  if (isFormSubmitted) {
    navigate("/admin/sales/sales-incentive-overview");
  }

  return (
    <div>
      {salesServiceLoading && <Loader />}
      <FormContainer mainTitle="Incentive Plan" link={true} />
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Incentive Plan Creation</h1>
        </div>
        <div className="card-body row">
          <div className="form-group col-4">
            <label className="form-label">
              Service Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={allSalesServiceData?.map((opt) => ({
                value: opt._id,
                label: opt.service_name,
              }))}
              value={{
                value: servicename,
                label:
                  allSalesServiceData?.find((user) => user._id === servicename)
                    ?.service_name || "",
              }}
              onChange={(e) => {
                setServiceName(e.value);
                setIsValid({ ...isValid, sales_service_master_id: false });
              }}
              required
            />
            {isValid.sales_service_master_id && (
              <span className="form-error">Service Name is Required</span>
            )}
          </div>
          <div className="form-group col-4">
            <label className="form-label">
              Incentive Type <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={IncentiveTypeData}
              value={IncentiveTypeData.find(
                (opt) => opt.value === incentiveType
              )}
              onChange={(e) => {
                setIncentiveType(e.value);
                setIsValid({
                  ...isValid,
                  incentive_type: false,
                });
              }}
              required
            />
            {isValid.incentive_type && (
              <span className="form-error">Incentive Type is Required</span>
            )}
          </div>
          <div className="col-4">
            <FieldContainer
              label="Value"
              astric={true}
              type="number"
              fieldGrid={12}
              value={values}
              required
              onChange={(e) => {
                setValues(e.target.value);
                setIsValid({
                  ...isValid,
                  value: false,
                });
              }}
            />
            {isValid.value && (
              <span className="form-error">Value is Required</span>
            )}
          </div>
          <FieldContainer
            label={"Remarks"}
            type={"text"}
            fieldGrid={12}
            value={remarks}
            required={false}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      </div>
      <button
        className="cmnbtn btn btn-primary mb-5"
        disabled={incentiveLoading}
        onClick={handleSubmit}
      >
        {incentiveLoading ? "Submitting" : "Submit"}
      </button>
    </div>
  );
};

export default IncentiveCreate;
