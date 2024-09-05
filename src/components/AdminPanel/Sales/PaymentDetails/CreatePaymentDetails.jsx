import React, { useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useCreatePaymentDetailsMutation } from "../../../Store/API/Sales/PaymentDetailsApi";
import { useGetAllPaymentModesQuery } from "../../../Store/API/Sales/PaymentModeApi";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import Loader from "../../../Finance/Loader/Loader";

const gstBankList = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const CreatePaymentDetails = () => {
  const {
    data: allPaymentModes,
    isLoading: paymentModeLoading,
    isError: paymentModeError,
  } = useGetAllPaymentModesQuery();
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedGstBank, setSelectedGstBank] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
  const token = getDecodedToken();
  const loginUserId = token.id;
  const [
    AddDetails,
    { isLoading: addDetailsLoading, isError: addDetailsError },
  ] = useCreatePaymentDetailsMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddDetails({
        title: title,
        details: details,
        gst_bank: selectedGstBank,
        payment_mode_id: selectedPaymentMode, // Use the selected payment mode value
        created_by: loginUserId,
      }).unwrap();
      navigate("/admin/view-payment-details");
      toastAlert("Payment Details Updated");
    } catch (error) {
      toastError(error.message);
    }
  };

  let isLoading = paymentModeLoading || addDetailsLoading;

  // Transform the payment modes data to the format required by Select
  const paymentModeOptions =
    allPaymentModes?.map((mode) => ({
      label: mode.name, // Adjust based on the structure of the payment modes data
      value: mode.id, // Adjust based on the structure of the payment modes data
    })) || [];

  return (
    <div>
      {isLoading && <Loader />}
      <FormContainer
        mainTitle="Payment Details"
        title="Create"
        handleSubmit={handleSubmit}
        loading={addDetailsLoading}
      >
        <FieldContainer
          label="Title"
          placeholder="Title"
          fieldGrid={4}
          astric={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <CustomSelect
          label={"Payment Mode"}
          fieldGrid={4}
          dataArray={allPaymentModes}
          optionId={"_id"}
          optionLabel={"payment_mode_name"}
          selectedId={selectedPaymentMode}
          setSelectedId={setSelectedPaymentMode}
          required={true}
        />

        <div className="form-group col-4">
          <label className="form-label">
            GST Bank <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            options={gstBankList}
            value={gstBankList.find((item) => item.value === selectedGstBank)}
            onChange={(e) => setSelectedGstBank(e.value)}
            required
          />
        </div>

        <FieldContainer
          Tag="textarea"
          label="Details"
          placeholder="Details"
          fieldGrid={4}
          astric={true}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default CreatePaymentDetails;
