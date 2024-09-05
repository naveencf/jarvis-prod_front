import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Badge, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../utils/config";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import ImageView from "./ImageView";

const PaymentDoneTransactionList = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [phpRemainderData, setPhpRemainderData] = useState([]);
  const [nodeData, setNodeData] = useState([]);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");

  const { request_id } = useParams();

  const handleSubmitTransactionData = () => {
    axios
      .get(
        "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
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
        "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequesttrans",
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
    handleSubmitTransactionData();
  }, [request_id]);

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
    {
      field: "invc_img",
      headerName: "Invoice Image",
      renderCell: (params) => {
        if (!params.row.invc_img) {
          return "No Image";
        }
        // Extract file extension and check if it's a PDF
        const fileExtension = params.row.invc_img
          .split(".")
          .pop()
          .toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${params.row.invc_img}`;
        return isPdf ? (
          <div
            style={{ position: "relative", overflow: "hidden", height: "40px" }}
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
          >
            <embed
              allowFullScreen={true}
              src={imgUrl}
              title="PDF Viewer"
              scrollbar="0"
              type="application/pdf"
              style={{
                width: "80px",
                height: "80px",
                cursor: "pointer",
                pointerEvents: "none",
              }}
            />
          </div>
        ) : (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={imgUrl}
            alt="Invoice"
            style={{ width: "80px", height: "80px" }}
          />
        );
      },
      width: 250,
    },
    {
      field: "evidence",
      headerName: "Payment Screenshot",
      renderCell: (params) => {
        if (!params.row.evidence) {
          return "No Image";
        }
        // Extract file extension and check if it's a PDF
        const fileExtension = params.row.evidence
          .split(".")
          .pop()
          .toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = `https://purchase.creativefuel.io/${params.row.evidence}`;

        return isPdf ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={imgUrl}
            style={{ width: "40px", height: "40px" }}
            title="PDF Preview"
          />
        ) : (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={imgUrl}
            alt="Invoice"
            style={{ width: "100px", height: "100px" }}
          />
        );
      },
      width: 130,
    },
    {
      field: "request_date",
      headerName: "Requested Date",
      width: 150,
      renderCell: (params) => {
        new Date(params.row.request_date).toLocaleDateString("en-IN") +
          " " +
          new Date(params.row.request_date).toLocaleTimeString("en-IN");
      },
    },
    {
      field: "payment_date",
      headerName: "Payment Date ",
      width: 150,
      renderCell: (params) => {
        new Date(params.row.payment_date).toLocaleDateString("en-IN") +
          " " +
          new Date(params.row.payment_date).toLocaleTimeString("en-IN");
      },
    },
    {
      field: "name",
      headerName: "Requested By",
      width: 150,
      valueGetter: (params) => {
        const reminder = phpRemainderData.filter(
          (item) => item.request_id == params.row.request_id
        );
        return reminder.length;
      },
      renderCell: (params) => {
        const reminder = phpRemainderData.filter(
          (item) => item.request_id == params.row.request_id
        );

        return (
          <>
            <span>{params.row.name}</span> &nbsp;{" "}
            <span>
              {reminder.length > 0 ? (
                <Badge badgeContent={reminder.length} color="primary">
                  <NotificationsActiveTwoToneIcon
                    onClick={() => handleRemainderModal(reminder)}
                  />{" "}
                </Badge>
              ) : (
                ""
              )}
            </span>
          </>
        );
      },
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      width: 200,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Hold for confirmation of sourabh sir */}
            <Button
              disabled={
                params.row.payment_details
                  ? !params.row.payment_details.length > 0
                  : true
              }
              onClick={() => handleOpenBankDetail(params.row)}
            >
              <AccountBalanceIcon style={{ fontSize: "25px" }} />
            </Button>
            <div
              style={{ cursor: "pointer", marginRight: "20px" }}
              onClick={() => handleOpenSameVender(params.row.vendor_name)}
            >
              {params.row.vendor_name}
            </div>
          </div>
        );
      },
    },
    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
    },
    {
      field: "total_paid",
      headerName: "Total Paid",
      width: 150,
      valueGetter: (params) => {
        const totalPaid = nodeData
          .filter(
            (e) => e.vendor_name === params.row.vendor_name && e.status == 1
          )
          .reduce((acc, item) => acc + +item.payment_amount, 0);
        return totalPaid;
      },
      renderCell: (params) => {
        return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
          .length > 0 ? (
          <span className="row ml-2 ">
            <h5
              onClick={() => handleOpenPaymentHistory(params.row, "TP")}
              style={{ cursor: "pointer" }}
              className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
            >
              {/* Total Paid */}
              {nodeData
                .filter(
                  (e) =>
                    e.vendor_name === params.row.vendor_name && e.status == 1
                )
                .reduce((acc, item) => acc + +item.payment_amount, 0)}
            </h5>
          </span>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className="fs-5 col-3 pointer font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      field: "F.Y",
      headerName: "F.Y",
      width: 150,
      valueGetter: (params) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${
            isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${
            isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === params.row.vendor_name &&
            e.status !== 0 &&
            e.status !== 2
          );
        });
        const totalFY = dataFY.reduce(
          (acc, item) => acc + parseFloat(item.payment_amount),
          0
        );
        return totalFY;
      },
      renderCell: (params) => {
        const isCurrentMonthGreaterThanMarch = new Date().getMonth() + 1 > 3;
        const currentYear = new Date().getFullYear();
        const startDate = new Date(
          `04/01/${
            isCurrentMonthGreaterThanMarch ? currentYear : currentYear - 1
          }`
        );
        const endDate = new Date(
          `03/31/${
            isCurrentMonthGreaterThanMarch ? currentYear + 1 : currentYear
          }`
        );
        const dataFY = nodeData.filter((e) => {
          const paymentDate = new Date(e.request_date);
          return (
            paymentDate >= startDate &&
            paymentDate <= endDate &&
            e.vendor_name === params.row.vendor_name &&
            e.status !== 0 &&
            e.status !== 2
          );
        });
        return nodeData.filter((e) => e.vendor_name === params.row.vendor_name)
          .length > 0 ? (
          <h5
            onClick={() => handleOpenPaymentHistory(params.row, "FY")}
            style={{ cursor: "pointer" }}
            className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
          >
            {/* Financial Year */}

            {dataFY.reduce(
              (acc, item) => acc + parseFloat(item.payment_amount),
              0
            )}
          </h5>
        ) : (
          <h5
            style={{ cursor: "pointer" }}
            className="fs-5 col-3  font-sm lead  text-decoration-underline text-black-50"
          >
            0
          </h5>
        );
      },
    },
    {
      field: "Pan Img",
      headerName: "Pan Img",
      valueGetter: (params) =>
        params?.row?.pan_img?.includes("uploads") ? params?.row?.pan_img : "NA",
      renderCell: (params) => {
        const ImgUrl = `https://purchase.creativefuel.io/${params?.row?.pan_img}`;
        return params?.row?.pan_img?.includes("uploads") ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(ImgUrl);
            }}
            src={ImgUrl}
            alt="Pan"
            style={{ width: "40px", height: "40px" }}
          />
        ) : (
          "NA"
        );
      },
    },
    {
      field: "pan",
      headerName: "PAN",
      width: 200,
    },
    {
      field: "gst",
      headerName: "GST",
      width: 200,
    },
    {
      field: "remark_audit",
      headerName: "Remark",
      width: 150,
      renderCell: (params) => {
        return params.row.remark_audit;
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 150,
      renderCell: (params) => {
        return params.row.priority;
      },
    },
    {
      field: "request_amount",
      headerName: "Requested Amount",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.request_amount}</p>;
      },
    },
    {
      field: "base_amount",
      headerName: "Base Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.base_amount ? (
          <p> &#8377; {params.row.base_amount}</p>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "gst_amount",
      headerName: "GST Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_amount ? (
          <p>&#8377; {params.row.gst_amount}</p>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "gst_hold_amount",
      headerName: "GST Hold Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.gst_hold_amount ? (
          <p>&#8377; {params.row.gst_hold_amount}</p>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "tds_deduction",
      headerName: "TDS Amount",
      width: 150,
      renderCell: (params) => {
        return params.row.tds_deduction ? (
          <p>&#8377; {params.row.tds_deduction}</p>
        ) : (
          "NA"
        );
      },
    },
    {
      field: "outstandings",
      headerName: "OutStanding ",
      width: 150,
      renderCell: (params) => {
        return <p> &#8377; {params.row.outstandings}</p>;
      },
    },

    {
      field: "payment_amount",
      headerName: "Payment Amount",
      width: 150,
      renderCell: (params) => {
        const paymentAmount = nodeData.filter(
          (e) => e.request_id == params.row.request_id
        )[0]?.payment_amount;
        return paymentAmount ? <p>&#8377; {paymentAmount}</p> : "NA";
      },
    },
    {
      field: "payment_by",
      headerName: "Payment By",
      width: 150,
      renderCell: (params) => <div>{params.row.payment_by}</div>,
    },
    {
      field: "aging",
      headerName: "Aging",
      width: 150,
      renderCell: (params) => {
        return <p> {params.row.aging} Days</p>;
      },
    },
    {
      field: "Status",
      headerName: "Status",
      width: 150,
      valueGetter: (params) => getStatusText(params.row.status),
      renderCell: (params) => (
        <div>
          {params.row.status === "1"
            ? "Paid"
            : params.row.status === "2"
            ? "Discard"
            : params.row.status === "3"
            ? "Partial"
            : ""}
        </div>
      ),
    },
    // {
    //   field: "Aging (in hours)",
    //   headerName: "Aging (in hours)",
    //   width: 150,
    //   renderCell: (params) => {
    //     return (
    //       <p> {calculateHours(params.row.request_date, new Date())} Hours</p>
    //     );
    //   },
    // },
    {
      field: "gstHold",
      headerName: "GST Hold",
      width: 150,
      renderCell: (params) => {
        return params.row.gstHold == 1 ? "Yes" : "No";
      },
    },
    {
      field: "TDSDeduction",
      headerName: "TDS Deduction",
      width: 150,
      renderCell: (params) => {
        return params.row.TDSDeduction == 1 ? "Yes" : "No";
      },
    },
  ];
  return (
    <div>
      <FormContainer
        mainTitle="Transaction List"
        link="/admin/finance-pruchasemanagement-paymentdone-transactionlist/:request_id"
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
