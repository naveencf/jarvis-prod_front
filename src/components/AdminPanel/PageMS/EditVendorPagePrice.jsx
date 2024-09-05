import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import axios from "axios";

import Select from "react-select";
import FieldContainer from "../FieldContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";

export default function EditVendorPagePrice() {
  const { toastAlert, toastError } = useGlobalContext();
  const Navigate = useNavigate();
  const [platformPriceList, setPlatformPriceList] = useState([]);
  const [platformPriceId, setPlatformPriceId] = useState("");
  const [pageMastList, setPageMastList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [pageMastId, setPageMastId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [priceTypeList, setPriceTypeList] = useState([]);
  const [priceTypeId, setPriceTypeId] = useState("");
  const [pricecalType, setPriceCalType] = useState("");
  const [variableType, setVariableType] = useState("");
  const [priceFixed, setPriceFixed] = useState("");
  const [priceVariable, setPriceVariable] = useState("");
  const [description, setDescription] = useState("");

  const { id } = useParams();

  const fetchData = async () => {
    try {
      const [
        vendorPagePriceRes,
        platformPriceRes,
        pageMastRes,
        vendorRes,
        priceRes,
      ] = await Promise.all([
        axios.get(baseUrl + "getVendorPagePriceList"),
        axios.get(baseUrl + "getPlatformPriceList"),
        axios.get(baseUrl + "getPageMastList"),
        axios.get(baseUrl + "vendorAllData"),
        axios.get(baseUrl + "getPriceList"),
      ]);

      const vendorPagePriceData = vendorPagePriceRes.data.data.filter(
        (e) => e._id == id
      )[0];
      setPlatformPriceId(vendorPagePriceData.platform_price_id);
      setPageMastId(vendorPagePriceData.pageMast_id);
      setVendorId(vendorPagePriceData.vendorMast_id);
      setPriceTypeId(vendorPagePriceData.price_type_id);
      setPriceCalType(vendorPagePriceData.price_cal_type);
      setVariableType(vendorPagePriceData.variable_type);
      setPriceFixed(vendorPagePriceData.price_fixed);
      setPriceVariable(vendorPagePriceData.price_variable);
      setDescription(vendorPagePriceData.description);

      setPlatformPriceList(platformPriceRes.data.data);
      setPageMastList(pageMastRes.data.data);
      setVendorList(vendorRes.data.tmsVendorkMastList);
      setPriceTypeList(priceRes.data.data);
    } catch (error) {
     toastError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePlatformPriceChange = (selectedOption) => {
    setPlatformPriceId(selectedOption.value);
  };

  const handlePageMastChange = (selectedOption) => {
    setPageMastId(selectedOption.value);
  };

  const handleVendorChange = (selectedOption) => {
    setVendorId(selectedOption.value);
  };

  const handlePriceTypeChange = (selectedOption) => {
    setPriceTypeId(selectedOption.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!platformPriceId) {
      toastError("Please Fill Platform Price List");
      return;
    } else if (!pageMastId) {
      toastError("Please Fill Page");
      return;
    } else if (!vendorId) {
      toastError("Please Fill Owner Vendor");
      return;
    } else if (!priceTypeId) {
      toastError("Please Fill Price Type");
      return;
    } else if (!pricecalType) {
      toastError("Please Fill Price Cal Type");
      return;
    } else if (!priceFixed) {
      toastError("Please Fill Price Fixed");
      return;
    } else if (!priceVariable) {
      toastError("Please Fill Price Variable");
      return;
    }
    axios
      .put(baseUrl + `updateVendorPagePrice/${id}`, {
        platform_price_id: platformPriceId,
        pageMast_id: pageMastId,
        vendorMast_id: vendorId,
        price_type_id: priceTypeId,
        price_cal_type: pricecalType,
        variable_type: variableType,
        price_fixed: priceFixed,
        price_variable: priceVariable,
        description: description,
      })
      .then((res) => {
        if (res.status === 200) {
          toastAlert("Successfully Updated");
          Navigate("/admin/pms-vendor-page-price-overview");
        }
      });
  };

  return (
    <>
      <FormContainer
        mainTitle="Edit Vendor Page Price Master"
        title="Edit Vendor Page Price Master"
        handleSubmit={handleSubmit}
      >
        <div className="form-group col-6 row">
          <label className="form-label">
            Platform Price List <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={platformPriceList.map((option) => ({
              value: option._id,
              label: option._id,
            }))}
            required={true}
            value={{
              value: platformPriceId,
              label:
                platformPriceList.find((role) => role._id === platformPriceId)
                  ?._id || "",
            }}
            onChange={handlePlatformPriceChange}
          />
        </div>

        <div className="form-group col-6 row">
          <label className="form-label">
            Page <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={pageMastList.map((option) => ({
              value: option.pageMast_id,
              label: option.page_user_name,
            }))}
            required={true}
            value={{
              value: pageMastId,
              label:
                pageMastList.find((role) => role.pageMast_id == pageMastId)
                  ?.page_user_name || "",
            }}
            onChange={handlePageMastChange}
          />
        </div>

        <div className="form-group col-6 row">
          <label className="form-label">
            Owner Vendor <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={vendorList.map((option) => ({
              value: option.vendorMast_id,
              label: option.vendorMast_name,
            }))}
            required={true}
            value={{
              value: vendorId,
              label:
                vendorList.find((role) => role.vendorMast_id === vendorId)
                  ?.vendorMast_name || "",
            }}
            onChange={handleVendorChange}
          />
        </div>

        <div className="form-group col-6 row">
          <label className="form-label">
            Price Type <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={priceTypeList.map((option) => ({
              value: option._id,
              label: option.price_type,
            }))}
            required={true}
            value={{
              value: priceTypeId,
              label:
                priceTypeList.find((role) => role._id === priceTypeId)
                  ?.price_type || "",
            }}
            onChange={handlePriceTypeChange}
          />
        </div>

        <FieldContainer
          label="Price Cal Type *"
          value={pricecalType}
          required={true}
          type="number"
          onChange={(e) => setPriceCalType(e.target.value)}
        />
        <FieldContainer
          label="Variable Type *"
          value={variableType}
          required={true}
          onChange={(e) => setVariableType(e.target.value)}
        />

        <FieldContainer
          label="Price Fixed *"
          value={priceFixed}
          required={true}
          onChange={(e) => setPriceFixed(e.target.value)}
        />
        <FieldContainer
          label="Price Variable *"
          value={priceVariable}
          required={true}
          onChange={(e) => setPriceVariable(e.target.value)}
        />

        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>
    </>
  );
}
