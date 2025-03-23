import React, { useState } from "react";
import FieldContainer from "../../AdminPanel/FieldContainer.jsx";
import { useGetExeCampaignsNameWiseDataQuery } from "../../Store/API/Sales/ExecutionCampaignApi.js";
import CustomSelect from "../../ReusableComponents/CustomSelect.jsx";
import { useAddMultipleServiceMutation } from "../../Store/API/Operation/OperationApi.js";
import { useGetVendorsQuery } from "../../Store/API/Purchase/DirectPurchaseApi.js";
import getDecodedToken from "../../../utils/DecodedToken.js";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../../Context/Context.jsx";
import RemoveSelectedOption from "../../../utils/RemoveSelecetedOption";

const MultipleService = ({ setToggleModal, setModalData }) => {
  const [serviceName, setServiceName] = useState("");
  const [file, setFile] = useState(null);
  const [selcedtedVendor, setSelcedtedVendor] = useState("");
  const [campData, setCampData] = useState([{ campaignId: "", amount: 0 }]);
  const [isValid, setIsValid] = useState({
    vendor: false,
    serviceName: false,
    campData: campData.map((item) => {
      return { campaignId: false, amount: false };
    }),
  });
  const [link, setLink] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
  let token = getDecodedToken();

  const { data: vendorListData, isLoading: loading } = useGetVendorsQuery();

  const {
    data: exeCampaignsNameWiseData,
    isLoading: exeCampaignsNameWiseDataLoading,
  } = useGetExeCampaignsNameWiseDataQuery();

  const [
    addMultipleService,
    { data: addMultipleServiceData, isLoading: addMultipleServiceLoading },
  ] = useAddMultipleServiceMutation();
  async function handleMultiSave() {
    try {
      const formData = new FormData();
      formData.append("ref_link", link);
      formData.append("file", file);
      formData.append("service_description", serviceName);
      formData.append("vendor_id", selcedtedVendor.vendor_id);
      formData.append("vendor_name", selcedtedVendor.vendor_name);
      formData.append("vendorId", selcedtedVendor.vendorId);
      formData.append("postData", JSON.stringify(campData));
      formData.append("record_purchase_by", token.id);
      formData.append("audit_by", token.id);
      formData.append("createdBy", token.id);

      // Check for mandatory fields
      const isValidServiceName = serviceName == "";
      const isValidCampData = campData.every(
        (item) => item.campaignId == "" && item.amount == 0
      );

      setIsValid({
        vendor: selcedtedVendor === "",
        serviceName: isValidServiceName,
        campData: campData.map((item) => ({
          campaignId: item.campaignId == "",
          amount: item.amount == 0,
        })),
      });

      if (isValidServiceName || isValidCampData || selcedtedVendor === "") {
        toastError("Please fill all the mandatory fields");
        return;
      }

      let res = await addMultipleService(formData).unwrap();
      if (res.error) throw new Error(res.error);
      setSelcedtedVendor("");
      setServiceName("");
      setFile(null);
      setCampData([{ campaignId: "", amount: 0 }]);
      setLink("");
      setToggleModal(false);
      toastAlert("Service Added Successfully");
    } catch (e) {
      toastError(e.message);
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header sb">
          <button
            className="icon-1"
            onClick={() => {
              setToggleModal(false);
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="col-md-4"></div>
        <div className="card-body ">
          <div className="row">
            <FieldContainer
              label="Link"
              fieldGrid={12}
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <div className="col-md-6">
              <CustomSelect
                label={"Select Vendor"}
                fieldGrid={12}
                dataArray={vendorListData}
                optionId="_id"
                optionLabel="vendor_name"
                selectedId={selcedtedVendor.vendorId}
                setSelectedId={(val) => {
                  const data = {
                    vendorId: val,
                    vendor_id: vendorListData.find((item) => item._id == val)
                      .vendor_id,
                    vendor_name: vendorListData.find((item) => item._id == val)
                      .vendor_name,
                  };
                  setSelcedtedVendor(data);
                  setIsValid({ ...isValid, vendor: val == "" });
                }}
              />
              {isValid.vendor && <p className="form-error">select vendor</p>}
            </div>
            <div className="col-md-6">
              <CustomSelect
                fieldGrid={12}
                label="Service Name"
                dataArray={[
                  { lable: "Comments", value: "Comments" },
                  { lable: "Edit", value: "Edit" },
                  { lable: "Video", value: "Video" },
                  { lable: "Tweeter Trends", value: "Tweeter Trends" },
                  { lable: "Others", value: "Others" },
                ]}
                optionId={"value"}
                optionLabel={"lable"}
                selectedId={serviceName}
                setSelectedId={(value) => {
                  setServiceName(value);
                  setIsValid({ ...isValid, serviceName: value == "" });
                }}
              />
              {isValid?.serviceName && (
                <p className="form-error">select service name</p>
              )}
            </div>
            <FieldContainer
              fieldGrid={12}
              label="Upload File"
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
            {campData.map((item, index) => {
              return (
                <div key={index} className="row w-100 gap-3">
                  <div className="col-md-4">
                    <CustomSelect
                      label={"Select Campaign"}
                      fieldGrid={12}
                      dataArray={RemoveSelectedOption(
                        index,
                        exeCampaignsNameWiseData,
                        campData,
                        "_id",
                        "campaignId"
                      )}
                      optionId="_id"
                      optionLabel="exe_campaign_name"
                      selectedId={campData[index].campaignId}
                      setSelectedId={(val) => {
                        const data = [...campData];
                        data[index].campaignId = val;
                        setCampData(data);
                        const validate = [...isValid.campData];
                        validate[index].campaignId = val == "";
                        setIsValid({ ...isValid, campData: validate });
                      }}
                    />
                    {isValid?.campData?.[index]?.campaignId && (
                      <p className="form-error">select campaign</p>
                    )}
                  </div>
                  <div className="col-md-4">
                    <FieldContainer
                      fieldGrid={12}
                      label="Amount"
                      type="number"
                      value={campData[index].amount}
                      onChange={(e) => {
                        const data = [...campData];
                        data[index].amount = Number(e.target.value);
                        setCampData(data);
                        const validate = [...isValid.campData];
                        validate[index].amount = e.target.value < 0;
                        setIsValid({ ...isValid, campData: validate });
                      }}
                    />
                    {isValid?.campData?.[index]?.amount && (
                      <p className="form-error">enter amount</p>
                    )}
                  </div>

                  <button
                    className="icon-1 ml-3 mt-4"
                    onClick={() => {
                      setCampData((prev) => {
                        const newData = [...prev];
                        newData.splice(index, 1);
                        return newData;
                      });
                    }}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              );
            })}
            <div className="col-md-12" style={{ color: "Green" }}>
              Total :{" "}
              {campData.reduce((acc, item) => {
                return acc + item.amount;
              }, 0)}
            </div>
            <div className="sb w-100 m-2">
              <button
                className="btn btn-primary cmnbtn btn-sm l-3 mt-4"
                onClick={() => {
                  setCampData([...campData, { campaignId: "", amount: 0 }]);
                }}
              >
                Add More Campaign
              </button>

              <button
                className="btn btn-primary cmnbtn btn-sm l-3 mt-4"
                onClick={() => {
                  handleMultiSave();
                }}
                disabled={addMultipleServiceLoading}
              >
                save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MultipleService;
