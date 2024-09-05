import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSinglePaymentModeQuery, useUpdatePaymentModeMutation } from "../../../Store/API/Sales/PaymentModeApi";

const EditPaymentMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const [title, setTitle] = useState("");
  const token = getDecodedToken();
  const loginUserId = token.id;
  const {
    data: paymentModeData,
    isLoading: paymentModeLoading,
    isError: paymentModeError
  } = useGetSinglePaymentModeQuery(id, { skip: !id })
  const [updateMode, {
    isLoading: updateModeLoading,
    isError: updateModeError,
  }] = useUpdatePaymentModeMutation()
  // const getData = async () => {
  //   const response = await axios.get(
  //     `${baseUrl}sales/get_sale_payment_mode/${id}`
  //   );
  //   const res = response.data.data;

  //   setTitle(res.payment_mode_name);
  // };

  useEffect(() => {
    if (paymentModeData) {
      setTitle(paymentModeData.payment_mode_name);

    }
  }, [paymentModeData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMode({ id, payment_mode_name: title }).unwrap();

      setTitle("");
      toastAlert("Payment Mode Updated");
      navigate("/admin/view-payment-mode");
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
          fieldGrid={4}
          astric={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormContainer>
    </div>
  );
};

export default EditPaymentMode;
