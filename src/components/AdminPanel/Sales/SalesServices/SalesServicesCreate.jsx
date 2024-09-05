import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { baseUrl } from "../../../../utils/config";
import DynamicSelect from "../DynamicSelectManualy";
import axios from "axios";
import { useGlobalContext } from "../../../../Context/Context";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import {
  useAddSaleServiceMutation,
  useEditSaleServiceMutation,
  useGetSingleSaleServiceQuery,
} from "../../../../components/Store/API/Sales/SalesServiceApi";
import Loader from "../../../Finance/Loader/Loader";

const SalesServicesCreate = () => {
  const { id, method } = useParams();
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { userID } = useAPIGlobalContext();
  const [servicename, setServiceName] = useState("");
  // const [postType, setPostType] = useState("");
  // const [excelUpload, setExcelUpload] = useState(false);
  const [brandName, setBrandName] = useState(false);
  const [amount, setAmount] = useState("");
  const [numberHours, setNumberHours] = useState(false);
  const [goal, setGoal] = useState(false);
  const [day, setDay] = useState(false);
  const [quantity, setQuantity] = useState(false);
  const [hashTag, setHashTag] = useState(false);
  const [individual, setIndividual] = useState(false);
  const [numberOfCreators, setNumberOfCreators] = useState(false);
  const [startEndDate, setStartEndDate] = useState(false);
  const [perMonthAmount, setPerMonthAmount] = useState(false);
  const [deliverables, setDeliverables] = useState(false);
  const [remark, setRemark] = useState("");

  // const PostTypeData = [
  //   "Story",
  //   "Post",
  //   "Both",
  //   "Comment",
  //   "Display",
  //   "Note",
  //   "No",
  // ];

  const AmountData = ["calculated", "input"];
  const [createSaleService, { isLoading: isCreating, error: createError }] =
    useAddSaleServiceMutation();
  const {
    data: singleSaleService,
    isLoading: isSingleSaleServiceLoading,
    error: singleSaleServiceError,
  } = useGetSingleSaleServiceQuery(id, { skip: !id });

  const [updatesalesservice, { isLoading: isUpdating, error: updateError }] =
    useEditSaleServiceMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        service_name: servicename,
        amount_status: amount,
        no_of_hours_status: numberHours,
        // is_excel_upload: excelUpload,
        goal_status: goal,
        day_status: day,
        // post_type: postType,
        quantity_status: quantity,
        brand_name_status: brandName,
        hashtag: hashTag,
        indiviual_amount_status: individual,
        no_of_creators: numberOfCreators,
        start_end_date_status: startEndDate,
        per_month_amount_status: perMonthAmount,
        deliverables_info: deliverables,
        remarks: remark,
      };

      if (method === "put") {
        await updatesalesservice({
          ...payload,
          updated_by: userID,
          id: id,
        }).unwrap();
      } else {
        await createSaleService({ ...payload, created_by: userID }).unwrap();
      }

      // Reset all the states to their initial values
      setAmount("");
      setIsFormSubmitted(true);
      toastAlert("Submited Succesfully");
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (isFormSubmitted) navigate("/admin/sales-services-overview");
  }, [isFormSubmitted]);
  useEffect(() => {
    if (method === "put" || method === "post") {
      setServiceName(singleSaleService?.service_name);
      setAmount(singleSaleService?.amount_status);
      // setPostType(singleSaleService?.post_type);
      // setExcelUpload(singleSaleService?.is_excel_upload);
      setNumberHours(singleSaleService?.no_of_hours_status);
      setGoal(singleSaleService?.goal_status);
      setDay(singleSaleService?.day_status);
      setQuantity(singleSaleService?.quantity_status);
      setHashTag(singleSaleService?.hashtag);
      setBrandName(singleSaleService?.brand_name_status);
      setIndividual(singleSaleService?.indiviual_amount_status);
      setNumberOfCreators(singleSaleService?.no_of_creators);
      setStartEndDate(singleSaleService?.start_end_date_status);
      setPerMonthAmount(singleSaleService?.per_month_amount_status);
      setDeliverables(singleSaleService?.deliverables_info);
      setRemark(singleSaleService?.remarks);
    }
  }, [isSingleSaleServiceLoading]);

  let isLoading = isCreating || isSingleSaleServiceLoading || isUpdating;
  return (
    <div className="servicepage">
      {isLoading && <Loader />}
      <FormContainer
        mainTitle="Services"
        title="Services Creation"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Service Name"
          astric={true}
          fieldGrid={6}
          value={servicename}
          placeholder={"Enter Service Name"}
          required={false}
          onChange={(e) => setServiceName(e.target.value)}
        />
        {/* <DynamicSelect
          label="Post Type"
          astric={true}
          data={PostTypeData}
          value={postType}
          cols={4}
          required={false}
          onChange={(e) => setPostType(e.value)}
        /> */}
        <DynamicSelect
          label="Amount"
          astric={true}
          data={AmountData}
          value={amount}
          cols={6}
          required={false}
          onChange={(e) => setAmount(e.value)}
        />
        {/* <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={excelUpload}
              onChange={(e) => setExcelUpload(!excelUpload)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Excel Upload</label>
        </div> */}

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={numberHours}
              onChange={(e) => setNumberHours(!numberHours)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Number Hours</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={goal}
              onChange={(e) => setGoal(!goal)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Goal</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={day}
              onChange={(e) => setDay(!day)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Day</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={quantity}
              onChange={(e) => setQuantity(!quantity)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Quantity</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={brandName}
              onChange={(e) => setBrandName(!brandName)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Brand Name</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={hashTag}
              onChange={(e) => setHashTag(!hashTag)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">HasTag</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={individual}
              onChange={(e) => setIndividual(!individual)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Individual Amount</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={numberOfCreators}
              onChange={(e) => setNumberOfCreators(!numberOfCreators)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Number Of Creators</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={startEndDate}
              onChange={(e) => setStartEndDate(!startEndDate)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Start End Date</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={perMonthAmount}
              onChange={(e) => setPerMonthAmount(!perMonthAmount)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Per Month Amount</label>
        </div>

        <div className="form-group col-2">
          <label className="switch">
            <input
              type="checkbox"
              checked={deliverables}
              onChange={(e) => setDeliverables(!deliverables)}
            />
            <span className="slider round"></span>
          </label>
          <label className="form-label">Deliverables Info</label>
        </div>

        <FieldContainer
          placeholder="Enter Remark"
          label="Remark"
          Tag="textarea"
          fieldGrid={4}
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default SalesServicesCreate;
