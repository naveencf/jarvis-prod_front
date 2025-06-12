import React, { useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate } from "react-router-dom";
import { useAddPaymentModeMutation } from "../../../Store/API/Sales/PaymentModeApi";

const CreatePaymentMode = () => {
  const { toastAlert, toastError } = useGlobalContext();

  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const token = getDecodedToken();
  const loginUserId = token.id;
  const [addMode, { isLoading: addModeLoading, isError: addModeError }] =
    useAddPaymentModeMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("payment_mode_name", title);
    formData.append("created_by", loginUserId);
    try {
      await addMode(formData).unwrap();
      navigate("/admin/sales/view-payment-mode");
      toastAlert("Payment Mode Created");
    } catch (error) {
      toastError(error.message);
    }
  };
  return (
    <div>
      <FormContainer
        mainTitle="Payment Mode"
        title="Create"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Mode Title"
          placeholder={"Enter Mode Title"}
          fieldGrid={4}
          astric={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default CreatePaymentMode;
