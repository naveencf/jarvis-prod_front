import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import moment from "moment";

const PaymentModeTransactionList = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [paymentMode, setPaymentMode] = useState([]);
  const { sale_booking_id } = useParams();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken?.id;

  //   function handleSubmitTransactionData() {
  //     axios
  //       .get(
  //         baseUrl +
  //           `sales/payment_update?status=approval&sale_booking_id=${sale_booking_id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         setTransactionData(res?.data?.data);
  //       });
  //   }

  //   const paymentModeData = () => {
  //     axios
  //       .get(baseUrl + "sales/payment_mode", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       })
  //       .then((res) => {
  //         setPaymentMode(res?.data?.data);
  //       })
  //       .catch((error) =>
  //         console.log(error, "Error While getting payment mode data")
  //       );
  //   };

  //   useEffect(() => {
  //     handleSubmitTransactionData();
  //     paymentModeData();
  //   }, []);

  return (
    <div>
      <FormContainer
        mainTitle="Transaction List"
        link="/admin/finance/finance-transaction-list"
      />
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          {/* <DataGrid
            // rows={transactionData}
            // columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            // getRowId={(row) => transactionData?.indexOf(row)}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentModeTransactionList;
