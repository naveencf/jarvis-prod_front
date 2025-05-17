import React from "react";
import { Box } from "@mui/material";
import View from "../../../AdminPanel/Sales/Account/View/View";
import { useGetPaymentTransectionQuery } from "../../../Store/API/Sales/PaymentDetailsApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 700,
  overflowY: "scroll",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const PaymentTransectionModal = ({ closeModal, id }) => {
  const { data, isLoading } = useGetPaymentTransectionQuery(id);
  const Columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },

    {
      key: "invoice_uploaded_date",
      name: "Invoice Uploaded Date",
      renderRowCell: (row) => row?.invoice_uploaded_date,
      width: 120,
    },
  ];
  return (
    <>
      <Box sx={style}>
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="lg:col-span-12 col-span-12">
          <View
            columns={Columns}
            data={data}
            isLoading={isLoading}
            title={"Payment Transection"}
            tableName={"Transection"}
            pagination
          />
        </div>
      </Box>
    </>
  );
};

export default PaymentTransectionModal;
