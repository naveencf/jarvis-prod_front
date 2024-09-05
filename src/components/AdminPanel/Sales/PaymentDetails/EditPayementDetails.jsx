import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  useGetPaymentDetailsQuery,
  useUpdatePaymentDetailsMutation,
} from "../../../Store/API/Sales/PaymentDetailsApi";
import { useGetAllPaymentModesQuery } from "../../../Store/API/Sales/PaymentModeApi";
import CustomSelect from "../../../ReusableComponents/CustomSelect";

const gstBankList = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const EditPaymentDetails = () => {
  const {
    data: allPaymentModes,
    isLoading: paymentModeLoading,
    isError: paymentModeError,
  } = useGetAllPaymentModesQuery();

  const { toastAlert, toastError } = useGlobalContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [selectedGstBank, setSelectedGstBank] = useState(null);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);

  const token = getDecodedToken();
  const loginUserId = token.id;
  const {
    data: paymentDetailsData,
    isLoading: paymentDetailsLoading,
    isError: paymentDetailsError,
  } = useGetPaymentDetailsQuery(id, { skip: !id });

  const [
    updatePaymentDetails,
    {
      isLoading: updatepaymentDetailsLoading,
      isError: updatepaymentDetailsError,
    },
  ] = useUpdatePaymentDetailsMutation();

  useEffect(() => {
    if (id) {
      setTitle(paymentDetailsData?.title);
      setDetails(paymentDetailsData?.details);
      setSelectedGstBank(paymentDetailsData?.gst_bank);
      setSelectedPaymentMode(paymentDetailsData?.payment_mode_id);
    }
  }, [paymentDetailsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePaymentDetails({
        title: title,
        details: details,
        gst_bank: selectedGstBank,
        updated_by: loginUserId,
        id: id,
      }).unwrap();

      navigate("/admin/view-payment-details");
      toastAlert("Payment Details Created");
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <div>
      <FormContainer
        mainTitle="Payment Details"
        title="Create"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Title"
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
          Tag="Textarea"
          label="Details"
          fieldGrid={4}
          astric={true}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default EditPaymentDetails;
