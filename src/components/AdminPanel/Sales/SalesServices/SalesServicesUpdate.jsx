import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { baseUrl } from "../../../../utils/config";
import DynamicSelect from "../DynamicSelectManualy";
import axios from "axios";
import { useGlobalContext } from "../../../../Context/Context";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const SalesServicesUpdate = () => {
  const { id, post, put } = useParams();
  const { userID } = useAPIGlobalContext();
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [servicename, setServiceName] = useState("");
  const [postType, setPostType] = useState("");
  const [excelUpload, setExcelUpload] = useState("");
  const [amount, setAmount] = useState("");
  const [numberHours, setNumberHours] = useState("");
  const [goal, setGoal] = useState("");
  const [day, setDay] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brandName, setBrandName] = useState("");
  const [hashTag, setHashTag] = useState("");
  const [individual, setIndividual] = useState("");
  const [numberOfCreators, setNumberOfCreators] = useState("");
  const [startEndDate, setStartEndDate] = useState("");
  const [perMonthAmount, setPerMonthAmount] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [remark, setRemark] = useState("");

  const PostTypeData = [
    "Story",
    "Post",
    "Both",
    "Comment",
    "Display",
    "Note",
    "No",
  ];
  const ExcelUploadData = ["Yes", "No"];
  const AmountData = ["Calculated", "Input"];
  const NumberHoursData = ["Yes", "No"];
  const GoalData = ["Yes", "No"];
  const DayData = ["Yes", "No"];
  const QuantityData = ["Yes", "No"];
  const BrandNameData = ["Yes", "No"];
  const HashtagData = ["Yes", "No"];
  const IndividualAmountData = ["Yes", "No"];
  const NumberOfCreatorData = ["Yes", "No"];
  const StartEndDateData = ["Yes", "No"];
  const PerMonthAmountData = ["Yes", "No"];
  const DeliverablesInfoData = ["Yes", "No"];

  const getData = () => {
    axios
      .get(`${baseUrl}` + `sales/get_sale_service_master/${id}`)
      .then((res) => {
        const response = res.data.data;
        if (post === "post") {
          setServiceName("");
        } else {
          setServiceName(response[0]?.service_name);
        }
        setPostType(response[0]?.post_type);
        setExcelUpload(response[0]?.is_excel_upload);
        setAmount(response[0]?.amount_status);
        setNumberHours(response[0]?.no_of_hours_status);
        setGoal(response[0]?.goal_status);
        setDay(response[0]?.day_status);
        setQuantity(response[0]?.quantity_status);
        setBrandName(response[0]?.brand_name_status);
        setHashTag(response[0]?.hashtag);
        setIndividual(response[0]?.indiviual_amount_status);
        setNumberOfCreators(response[0]?.no_of_creators);
        setStartEndDate(response[0]?.start_end_date_status);
        setPerMonthAmount(response[0]?.per_month_amount_status);
        setDeliverables(response[0]?.deliverables_info);
        setRemark(response[0]?.remarks);
      });
  };
  useEffect(() => {
    getData();
  }, [id]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = {
      service_name: servicename,
      post_type: postType,
      is_excel_upload: excelUpload,
      amount_status: amount,
      no_of_hours_status: numberHours,
      goal_status: goal,
      day_status: day,
      quantity_status: quantity,
      brand_name_status: brandName,
      hashtag: hashTag,
      indiviual_amount_status: individual,
      no_of_creators: numberOfCreators,
      start_end_date_status: startEndDate,
      per_month_amount_status: perMonthAmount,
      deliverables_info: deliverables,
      remarks: remark,
      created_by: userID,
    };

    if (post == "post") {
      await axios.post(baseUrl + `sales/add_sale_service_master`, requestData);
    } else {
      await axios.put(
        baseUrl + `sales/update_sale_service_master/${id}`,
        requestData
      );
    }
    try {
      toastAlert("Submited Succesfully");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };
  if (isFormSubmitted) {
    return <Navigate to="/admin/sales-services-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Services"
        title="Services Creation"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Service Name"
          astric={true}
          fieldGrid={4}
          value={servicename}
          onChange={(e) => setServiceName(e.target.value)}
          required={false}
        />
        <DynamicSelect
          label="Post Type"
          astric={true}
          data={PostTypeData}
          value={postType}
          cols={4}
          onChange={(e) => setPostType(e.value)}
        />
        <DynamicSelect
          label="Excel Upload"
          astric={true}
          data={ExcelUploadData}
          value={excelUpload}
          cols={4}
          onChange={(e) => setExcelUpload(e.value)}
        />
        <DynamicSelect
          label="Amount"
          astric={true}
          data={AmountData}
          value={amount}
          cols={4}
          onChange={(e) => setAmount(e.value)}
        />
        <DynamicSelect
          label="Number Hours"
          astric={true}
          data={NumberHoursData}
          value={numberHours}
          cols={4}
          onChange={(e) => setNumberHours(e.value)}
        />
        <DynamicSelect
          label="Goal"
          astric={true}
          data={GoalData}
          value={goal}
          cols={4}
          onChange={(e) => setGoal(e.value)}
        />
        <DynamicSelect
          label="Day"
          astric={true}
          data={DayData}
          value={day}
          cols={4}
          onChange={(e) => setDay(e.value)}
        />
        <DynamicSelect
          label="Quantity"
          astric={true}
          data={QuantityData}
          value={quantity}
          cols={4}
          onChange={(e) => setQuantity(e.value)}
        />
        <DynamicSelect
          label="Brand Name"
          astric={true}
          data={BrandNameData}
          value={brandName}
          cols={4}
          onChange={(e) => setBrandName(e.value)}
        />
        <DynamicSelect
          label="HasTag"
          astric={true}
          data={HashtagData}
          value={hashTag}
          cols={4}
          onChange={(e) => setHashTag(e.value)}
        />
        <DynamicSelect
          label="Individual Amount"
          astric={true}
          data={IndividualAmountData}
          value={individual}
          cols={4}
          onChange={(e) => setIndividual(e.value)}
        />
        <DynamicSelect
          label="Number Of Creators"
          astric={true}
          data={NumberOfCreatorData}
          value={numberOfCreators}
          cols={4}
          onChange={(e) => setNumberOfCreators(e.value)}
        />
        <DynamicSelect
          label="Start End Date"
          astric={true}
          data={StartEndDateData}
          value={startEndDate}
          cols={4}
          onChange={(e) => setStartEndDate(e.value)}
        />
        <DynamicSelect
          label="Per Month Amount"
          astric={true}
          data={PerMonthAmountData}
          value={perMonthAmount}
          cols={4}
          onChange={(e) => setPerMonthAmount(e.value)}
        />
        <DynamicSelect
          label="Deliverables Info "
          astric={true}
          data={DeliverablesInfoData}
          value={deliverables}
          cols={4}
          onChange={(e) => setDeliverables(e.value)}
        />
        <FieldContainer
          label="Remark"
          Tag="textarea"
          fieldGrid={4}
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default SalesServicesUpdate;
