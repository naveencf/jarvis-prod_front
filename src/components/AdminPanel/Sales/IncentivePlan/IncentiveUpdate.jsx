import React, { useState, useEffect, use } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { baseUrl } from "../../../../utils/config";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import { useGlobalContext } from "../../../../Context/Context";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import DynamicSelect from "../DynamicSelectManualy";
import {
  useGetIncentivePlanDetailsQuery,
  useUpdateIncentivePlanMutation,
} from "../../../Store/API/Sales/IncentivePlanApi";
import { useGetAllSaleServiceQuery } from "../../../Store/API/Sales/SalesServiceApi";
import { is } from "date-fns/locale";

const IncentiveUpdate = () => {
  const { id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { userID } = useAPIGlobalContext();
  const [servicename, setServiceName] = useState("");
  const [incentiveType, setIncentiveType] = useState("");
  const [values, setValues] = useState("");
  const [salesServiceData, setSalesServiceData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [isValid, setIsValid] = useState({});
  const IncentiveTypeData = ["fixed", "variable"];

  const [
    updateIncentive,
    { isLoading: incentiveLoading, error: incentiveError },
  ] = useUpdateIncentivePlanMutation();

  const {
    data: allSalesServiceData,
    isLoading: salesServiceLoading,
    isError: salesServiceError,
  } = useGetAllSaleServiceQuery();

  const {
    data: incentiveData,
    isError: incentiveGetError,
    isLoading: incentiveGetLoading,
  } = useGetIncentivePlanDetailsQuery(id, { skip: !id });

  useEffect(() => {
    if (incentiveData) {
      setRemarks(incentiveData.remarks);
      setServiceName(incentiveData.sales_service_master_id);
      setValues(incentiveData.value);
      setIncentiveType(incentiveData.incentive_type);
    }
  }, [incentiveData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      sales_service_master_id: servicename,
      incentive_type: incentiveType,
      value: values,
      updated_by: userID,
    };
    setIsValid(payload);
    if (!servicename || !incentiveType || !values) {
      return;
    }
    try {
      await updateIncentive({ ...payload, id }).unwrap();

      toastAlert("Submited Succesfully");
      setServiceName("");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error(error);
      toastError("Failed to submit");
    }
  };
  if (isFormSubmitted) {
    return <Navigate to="/admin/sales/sales-incentive-overview" />;
  }
  return (
    <>
      <FormContainer mainTitle="Incentive Plan" link={true} />
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Incentive Plan Updation</h1>
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
              }}
              required
            />
            {isValid.sales_service_master_id === "" && (
              <span className="form-error">Service Name is Required</span>
            )}
          </div>
          <div className="col-4">
            <DynamicSelect
              label="Incentive Type"
              astric={true}
              data={IncentiveTypeData}
              value={incentiveType}
              cols={12}
              required
              onChange={(e) => setIncentiveType(e.target.value)}
            />
            {isValid.incentive_type === "" && (
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
              onChange={(e) => setValues(e.target.value)}
            />
            {isValid.value === "" && (
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
      <buton
        className="cmnbtn btn btn-primary mb-5"
        disabled={incentiveLoading}
        onClick={(e) => handleSubmit(e)}
      >
        {incentiveLoading ? "submitting" : "Submit"}
      </buton>
    </>
  );
};

export default IncentiveUpdate;
