import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Badge, Button, Chip, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import { baseUrl, insightsBaseUrl, phpBaseUrl } from "../../../../../utils/config";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import ImageView from "../../../ImageView";
import FormContainer from "../../../../AdminPanel/FormContainer";
import UpdateIcon from '@mui/icons-material/Update';
import { useGlobalContext } from "../../../../../Context/Context";
import { useGetPaymentRequestTransactionsQuery } from "../../../../Store/API/Purchase/PurchaseRequestPaymentApi";

const PaymentDoneTransactionList = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [transactionData, setTransactionData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [checkTransactionStatus, setCheckTransactionStatus] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const { request_id } = useParams();
  const { data, isLoading: transactionLoading, } = useGetPaymentRequestTransactionsQuery({ request_id });

  const handleSubmitTransactionData = () => {
    axios
      .get(
        phpBaseUrl + `?view=getpaymentrequest`
      )
      .then((res) => {
        setPhpRemainderData(res.data.body || []);
      })
      .catch((err) => console.error("Error fetching payment requests:", err));

    axios
      .get(baseUrl + "phpvendorpaymentrequest")
      .then((res) => {
        setNodeData(res.data.modifiedData || []);
      })
      .catch((err) =>
        console.error("Error fetching vendor payment requests:", err)
      );

    const formData = new FormData();
    formData.append("request_id", request_id);

    axios
      .post(
        phpBaseUrl + `?view=getpaymentrequesttrans`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setTransactionData(res?.data?.body || []);
      })
      .catch((err) => console.error("Error fetching transaction data:", err));
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setTransactionData(data)
    }

  }, [data]);

  const getStatusText = (status) => {
    switch (status) {
      case "0":
        return "Paid";
      case "1":
        return "Discard";
      case "2":
        return "Partial";
      default:
        return "";
    }
  };

  const handleStatusCheck = async (row) => {
    // Step 1: Get the JWT token
    console.log(row, "row")
    if (!row) return;
    const getTokenResponse = await axios.get(
      insightsBaseUrl + `v1/payment_gateway_access_token`
    );
    const token = getTokenResponse?.data?.data;
    // https://insights.ist:8080/api/v1/check_payment_status?clientReferenceId=2017_1
    try {
      const payResponse = await axios.get(
        insightsBaseUrl + `v1/check_payment_status?clientReferenceId=${row?.clientReferenceId}`,
        // insightsBaseUrl + `v1/check_payment_status?clientReferenceId=3060_1`,
        // paymentPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (payResponse.status == 200 && row?.payment_getway_status == payResponse?.data?.data?.message) {
        toastAlert("Status Remain Same");
      }
      else if (payResponse.status == 200) {
        toastAlert("Please wait while we are updating status");
        setTransactionData([])
        handleSubmitTransactionData();
        console.log(payResponse.data.data, "payResponse");
      }
    } catch (error) {
      console.log(error)
    }
  }
  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      valueGetter: (params) => transactionData.indexOf(params.row) + 1,
      renderCell: (params) => {
        const rowIndex = transactionData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    // {
    //   field: "invc_img",
    //   headerName: "Invoice Image",
    //   // renderCell: (params) => {
    //   //   if (!params.row.invc_img) {
    //   //     return "No Image";
    //   //   }
    //   //   // Extract file extension and check if it's a PDF
    //   //   const fileExtension = params.row.invc_img
    //   //     .split(".")
    //   //     .pop()
    //   //     .toLowerCase();
    //   //   const isPdf = fileExtension === "pdf";

    //   //   const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;
    //   //   return isPdf ? (
    //   //     <div
    //   //       style={{ position: "relative", overflow: "hidden", height: "40px" }}
    //   //       onClick={() => {
    //   //         setOpenImageDialog(true);
    //   //         setViewImgSrc(imgUrl);
    //   //       }}
    //   //     >
    //   //       <embed
    //   //         allowFullScreen={true}
    //   //         src={imgUrl}
    //   //         title="PDF Viewer"
    //   //         scrollbar="0"
    //   //         type="application/pdf"
    //   //         style={{
    //   //           width: "80px",
    //   //           height: "80px",
    //   //           cursor: "pointer",
    //   //           pointerEvents: "none",
    //   //         }}
    //   //       />
    //   //     </div>
    //   //   ) : (
    //   //     <img
    //   //       onClick={() => {
    //   //         setOpenImageDialog(true);
    //   //         setViewImgSrc(imgUrl);
    //   //       }}
    //   //       src={imgUrl}
    //   //       alt="Invoice"
    //   //       style={{ width: "80px", height: "80px" }}
    //   //     />
    //   //   );
    //   // },
    //   width: 250,
    // },
    // {
    //   field: "evidence",
    //   headerName: "Payment Screenshot",
    //   renderCell: (params) => {
    //     if (!params.row.evidence) {
    //       return "No Image";
    //     }
    //     // Extract file extension and check if it's a PDF
    //     const fileExtension = params.row.evidence
    //       .split(".")
    //       .pop()
    //       .toLowerCase();
    //     const isPdf = fileExtension === "pdf";

    //     const imgUrl = `https://purchase.creativefuel.io/${params.row.evidence}`;

    //     return isPdf ? (
    //       <img
    //         onClick={() => {
    //           setOpenImageDialog(true);
    //           setViewImgSrc(imgUrl);
    //         }}
    //         src={imgUrl}
    //         style={{ width: "40px", height: "40px" }}
    //         title="PDF Preview"
    //       />
    //     ) : (
    //       <img
    //         onClick={() => {
    //           setOpenImageDialog(true);
    //           setViewImgSrc(imgUrl);
    //         }}
    //         src={imgUrl}
    //         alt="Invoice"
    //         style={{ width: "100px", height: "100px" }}
    //       />
    //     );
    //   },
    //   width: 130,
    // },
    // {
    //   field: "request_date",
    //   headerName: "Requested Date",
    //  
    //   renderCell: (params) => {
    //     new Date(params.row.request_date).toLocaleDateString("en-IN") +
    //       " " +
    //       new Date(params.row.request_date).toLocaleTimeString("en-IN");
    //   },
    // },
    {
      field: "payment_date",
      headerName: "Payment Date",
      renderCell: (params) => {
        return new Date(params.row.payment_date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },

    // {
    //   field: "requested_by",
    //   headerName: "Requested By",
    //  

    // },
    {
      field: "payment_by",
      headerName: "Payment By",

    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 200,
      // renderCell: (params) => {
      //   return (
      //     <div style={{ display: "flex", alignItems: "center" }}>
      //       {/* Hold for confirmation of sourabh sir */}
      //       <Button
      //         disabled={
      //           params.row.payment_details
      //             ? !params.row.payment_details.length > 0
      //             : true
      //         }
      //         onClick={() => handleOpenBankDetail(params.row)}
      //       >
      //         <AccountBalanceIcon style={{ fontSize: "25px" }} />
      //       </Button>
      //       <div
      //         style={{ cursor: "pointer", marginRight: "20px" }}
      //         onClick={() => handleOpenSameVender(params.row.vendor_name)}
      //       >
      //         {params.row.vendor_name}
      //       </div>
      //     </div>
      //   );
      // },
    },

    {
      field: "payment_getway_status",
      headerName: "Status",
      width: 200,
    },
    {
      field: "request_amount",
      headerName: "Request Amount",
      width: 200,
    },
    {
      field: "invc_no",
      headerName: "Invoice No.",
      renderCell: (params) => {
        return params.row.remark_audit;
      },
    },
    // {
    //   field: "priority",
    //   headerName: "Priority",
    //  
    //   renderCell: (params) => {
    //     return params.row.priority;
    //   },
    // },
    {
      field: "accountNumber",
      headerName: "Account No.",
      // renderCell: (params) => {
      //   return <p> &#8377; {params.row.request_amount}</p>;
      // },
    },
    {
      field: "branchCode",
      headerName: "IFSC",
      width: 150
    },
    // {
    //   field: "gst_amount",
    //   headerName: "GST Amount",
    //   renderCell: (params) => {
    //     return params.row.gst_amount ? (
    //       <p>&#8377; {params.row.gst_amount}</p>
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
    // {
    //   field: "gst_hold_amount",
    //   headerName: "GST Hold Amount",
    //   renderCell: (params) => {
    //     return params.row.gst_hold_amount ? (
    //       <p>&#8377; {params.row.gst_hold_amount}</p>
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
    // {
    //   field: "tds_deduction",
    //   headerName: "TDS Amount",
    //   renderCell: (params) => {
    //     return params.row.tds_deduction ? (
    //       <p>&#8377; {params.row.tds_deduction}</p>
    //     ) : (
    //       "NA"
    //     );
    //   },
    // },
    {
      field: "outstandings",
      headerName: "OutStanding ",
      renderCell: (params) => {
        return <p> &#8377; {params.row.outstandings}</p>;
      },
    },

    {
      field: "payment_amount",
      headerName: "Payment Amount",
      // renderCell: (params) => {
      //   const paymentAmount = nodeData.filter(
      //     (e) => e.request_id == params.row.request_id
      //   )[0]?.payment_amount;
      //   return paymentAmount ? <p>&#8377; {paymentAmount}</p> : "NA";
      // },
    },
    // {
    //   field: "payment_by",
    //   headerName: "Payment By",
    //   renderCell: (params) => <div>{params.row.payment_by}</div>,
    // },
    // {
    //   field: "aging",
    //   headerName: "Aging",
    //   renderCell: (params) => {
    //     return <p> {params.row.aging} Days</p>;
    //   },
    // },

    // {
    //   field: "Aging (in hours)",
    //   headerName: "Aging (in hours)",
    //  
    //   renderCell: (params) => {
    //     return (
    //       <p> {calculateHours(params.row.request_date, new Date())} Hours</p>
    //     );
    //   },
    // },
    // {
    //   field: "gstHold",
    //   headerName: "GST Hold",
    //   renderCell: (params) => {
    //     return params.row.gstHold == 1 ? "Yes" : "No";
    //   },
    // },
    // {
    //   field: "tds_deduction",
    //   headerName: "TDS ",
    //   // renderCell: (params) => {
    //   //   return params.row.TDSDeduction == 1 ? "Yes" : "No";
    //   // },
    // },
  ];
  return (
    <div>
      <FormContainer
        mainTitle="Transaction List"
        link="/admin/finance/finance-pruchasemanagement-paymentdone-transactionlist/:request_id"
      />
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          <DataGrid
            rows={transactionData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            getRowId={(row) => transactionData.indexOf(row)}
          />
          {openImageDialog && (
            <ImageView
              viewImgSrc={viewImgSrc}
              fullWidth={true}
              maxWidth={"md"}
              setViewImgDialog={setOpenImageDialog}
              openImageDialog={openImageDialog}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDoneTransactionList;
