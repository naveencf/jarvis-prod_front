import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Badge, Button, Chip, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import UpdateIcon from "@mui/icons-material/Update";
import { baseUrl, insightsBaseUrl, phpBaseUrl } from "../../utils/config";
import { useGlobalContext } from "../../Context/Context";
import ImageView from "../Finance/ImageView";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import View from "../AdminPanel/Sales/Account/View/View";
import { formatDate } from "../../utils/formatDate";
import ImageIcon from "@mui/icons-material/Image";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import PurchaseTransactionFilter from "./PurchaseTransactionFilter";
import html2canvas from "html2canvas";
import formatString from "../../utils/formatString";
import { useGetVendorPaymentTransactionsQuery } from "../Store/API/Purchase/PurchaseRequestPaymentApi";
import pdfImg from "../Finance/pdf-file.png";
import { formatUTCDate } from "../../utils/formatUTCDate";
import formatDataObject from "../../utils/formatDataObject";
import { formatDateTime } from "../../utils/formatDateTime";
import DateISOtoNormal from "../../utils/DateISOtoNormal";
import DateTimeUTCtoISO from "../../utils/DateTimeUTCtoISO";

const PurchaseTransactions = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [transactionData, setTransactionData] = useState([]);
  const [startDate, setStartDate] = useState(
    dayjs().startOf("day").format("YYYY-MM-DD")
  ); // Default to today's date in yyyy-mm-dd format
  const [endDate, setEndDate] = useState(
    dayjs().add(1, "day").startOf("day").format("YYYY-MM-DD")
  ); // Default to tomorrow's date in yyyy-mm-dd format
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [checkTransactionStatus, setCheckTransactionStatus] = useState(false);
  const [viewImgSrc, setViewImgSrc] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [filterStep, setFilterStep] = useState(0); // 0: true, 1: false, 2: all
  const {
    data,
    error,
    isLoading,
    refetch: refetchTransaction,
  } = useGetVendorPaymentTransactionsQuery({
    startDate: startDate,
    endDate: endDate,
  });
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    setTransactionData(data)
  }, [data])
  const downloadSlipAsImage = (rowData) => {
    // Create a container div for the content that will be captured
    const slipElement = document.createElement("div");
    slipElement.style.width = "440px";
    slipElement.style.padding = "40px";
    slipElement.style.margin = "0px";
    slipElement.style.backgroundColor = "#171F2A";
    slipElement.style.color = "#fff";
    slipElement.style.textAlign = "left";
    slipElement.style.position = "absolute";
    slipElement.style.zIndex = "9999";
    slipElement.style.top = "0";
    slipElement.style.left = "0";
    slipElement.style.boxShadow = "none";
    slipElement.style.border = "none";
    // Add the dynamic content into the container
    slipElement.innerHTML = `
    <div class="paymentHeader">
      <h1><span>₹</span>${rowData?.payment_amount}</h1>
      <p>Created on <span>${rowData?.payment_date}</span></p>
    </div>
    <div class="paymentDetails payDtlBox">
      <h2>Payout Details</h2>
      <ul>
        <li><span>UTR Number</span>${rowData?.bankTransactionReferenceId}</li>
        <li><span>Debit From</span> Yes Bank</li>
        <li><span>Purpose</span> Vendor Payment</li>
        <li><span>Attachment</span> None</li>
        <li><span></span> </li>
        <li><span></span> </li>
        <li><span></span> </li>
        </ul>
        </div>
        <div class="vendorDetails payDtlBox">
        <h2>Contact <span>details</span></h2>
        <ul>
        <li> ${formatString(rowData?.vendor_name)}</li>
        </ul>
        </div>
        `;
    // <li><span>Acc. Number Name</span> XXXX-XXXX-2868</li>
    // <li><span>Payment Reference ID</span> ${rowData?.ref}</li>
    // <li><span>Acc. Number Name</span> XXXX-XXXX-2868</li>

    // Append the div to the body temporarily for rendering
    document.body.appendChild(slipElement);

    // Ensure content is rendered before taking the screenshot
    setTimeout(() => {
      // Use html2canvas to take a screenshot of the slipElement
      html2canvas(slipElement, {
        useCORS: true, // Enable CORS for external resources (images, fonts)
        logging: true, // Enable logging for debugging
        allowTaint: true, // Allow tainted content (e.g., third-party images)
        letterRendering: true, // Improve text rendering
        foreignObjectRendering: true, // Force better rendering of text
      })
        .then((canvas) => {
          // Convert canvas to a data URL (PNG image)
          const image = canvas.toDataURL("image/png");

          // Create a temporary download link
          const link = document.createElement("a");
          link.href = image;
          link.download = `${rowData.vendor_name}${rowData.bankTransactionReferenceId}.png`; // Download image with dynamic filename
          link.click(); // Trigger the download

          // Clean up by removing the slipElement from the DOM
          document.body.removeChild(slipElement);
        })
        .catch((error) => {
          console.error("Error while capturing the image:", error);
        });
    }, 100); // Increase delay to 1000ms to allow for full rendering
  };

  const handleSubmitTransactionData = () => {

    refetchTransaction();
  };

  const handleStatusCheck = async (row) => {
    // Step 1: Get the JWT token
    if (!row) return;
    const getTokenResponse = await axios.get(
      insightsBaseUrl + `v1/payment_gateway_access_token`
    );
    const token = getTokenResponse?.data?.data;
    // https://insights.ist:8080/api/v1/check_payment_status?clientReferenceId=2017_1
    try {
      const payResponse = await axios.get(
        insightsBaseUrl +
        `v1/check_payment_status?clientReferenceId=${row?.clientReferenceId}`,
        // paymentPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        payResponse.status == 200 &&
        row?.payment_getway_status == payResponse?.data?.data?.message
      ) {
        toastAlert("Status Remain Same");
      } else if (payResponse.status == 200) {
        toastAlert("Please wait while we are updating status");
        setTransactionData([]);
        handleSubmitTransactionData();
        console.log(payResponse.data.data, "payResponse");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVendorReportingStatus = async (row) => {
    // https://insights.ist:8080/api/v1/check_payment_status?clientReferenceId=2017_1
    try {
      const payResponse = await axios.put(
        baseUrl +
        `v1/vendor_payment_transactions_shared_SS/${row?.clientReferenceId}`,
        {
          is_shared_ss: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (payResponse.status === 200) {
        toastAlert("Status Updated");
        refetchTransaction();
        setRefetch(!refetch);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      key: "S.NO",
      name: "S.NO",
      width: 90,
      renderRowCell: (row, index) => {
        return index + 1;
      },
    },
    {
      key: "clientReferenceId",
      name: "Ref ID",
      width: 90,
      // renderRowCell: (row, index) => {
      //     return index + 1;
      // },
    },

    {
      key: "is_shared_ss",
      name: "Reported",
      width: 150,

      renderRowCell: (row) => {
        return (
          <button
            className="btn cmnbtn btn-outline-secondary btn_sm"
            onClick={() => handleVendorReportingStatus(row)}
            style={{ cursor: "pointer" }}
          >
            Shared SS
          </button>
        );
        // return <p>  {row.vendor_update}</p>;
      },
      colorRow: (row) => {
        if (row?.is_shared_ss) {
          return "#ACE1AF";
        } else {
          return "#ffff008c";
        }
      },
    },
    {
      key: "slip",
      name: "Slip",
      renderRowCell: (row) =>
        row?.payment_getway_status === "SUCCESS" &&
        row?.bankTransactionReferenceId && (
          <button
            className="btn cmnbtn btn-outline-primary btn_sm"
            onClick={() => downloadSlipAsImage(row)}
            style={{ cursor: "pointer" }}
          >
            Download Slip
          </button>
        ),


    },
    {
      key: "invoice_url",
      name: "Invoice Image",
      renderRowCell: (row) => {
        if (!row?.invoice_url) {
          return "No Image";
        }
        // Extract file extension and check if it's a PDF
        const fileExtension = row?.invoice_url.split(".").pop().toLowerCase();
        const isPdf = fileExtension === "pdf";

        const imgUrl = row?.invoice_url;

        return isPdf ? (
          <img
            onClick={() => {
              setOpenImageDialog(true);
              setViewImgSrc(imgUrl);
            }}
            src={pdfImg}
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
      key: "evidence_url",
      name: "SS",
      width: 150,
      conpare: true,
      renderRowCell: (row) => {
        const imgUrl = row.evidence_url;

        return row.evidence_url ? (
          <img
            // onClick={() => {
            //     setOpenImageDialog(true);
            //     setViewImgSrc(imgUrl);
            // }}
            onClick={() => downloadSlipAsImage(row)}
            src={imgUrl}
            alt="payment screenshot"
            style={{ width: "50px", height: "50px" }}
          />
        ) : (
          ""
        );
      },
    },
    {
      key: "payment_by",
      name: "Payment by",
      width: 150,
    },
    {
      key: "payment_date",
      name: "Payment Date ",
      width: 150,
      renderRowCell: (row) => {
        const { date, time } = DateTimeUTCtoISO(row.payment_date)
        return date;
      }
    },
    {
      key: "payment_time",
      name: "Payment Time ",
      width: 150,
      renderRowCell: (row) => {
        const { date, time } = DateTimeUTCtoISO(row.payment_date)
        return time;
      }
    },

    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
    },
    // {
    //   key: "page_name",
    //   name: "Page Name",
    //   width: 150,
    // },
    {
      key: "payment_mode",
      name: "Payment Mode",
      width: 150,
    },
    {
      key: "payment_getway_status",
      name: "Payment Status",
      width: 150,
      renderRowCell: (row) => {
        const tempRow = row;
        return (
          <Stack direction="row" spacing={1}>
            <Chip label={row?.payment_getway_status} color="success" />
            {row?.payment_getway_status == "SUCCESS" ||
              row?.payment_getway_status == "FAILED" ||
              row?.payment_getway_status == null ? (
              ""
            ) : (
              <UpdateIcon onClick={() => handleStatusCheck(tempRow)} />
            )}
          </Stack>
        );
      },
    },

    {
      key: "finance_remark",
      name: "Remark",
      width: 150,
      renderRowCell: (row) => {
        return row.finance_remark;
      },
    },
    {
      key: "request_amount",
      name: "Invoice Amount",
      width: 150,
      // renderRowCell: (row) => {
      //   return row.request_by;
      // },
    },

    {
      key: "request_amount",
      name: "Requested Amount",
      width: 150,
      renderRowCell: (row) => {
        return <p> &#8377; {row.request_amount}</p>;
      },
    },

    {
      key: "accountNumber",
      name: "Account ",
      width: 150,

    },

    {
      key: "payment_amount",
      name: "Payment Amount",
      width: 150,
      getTotal: true,
    },
    {
      key: "ref",
      name: "Reference Number",
      width: 250,
      renderRowCell: (row) => {
        const handleCopy = () => {
          const {
            bankTransactionReferenceId,
            payment_amount,
            payment_date,
            finance_remark,
          } = row;

          if (!payment_date) return;
          const { date, time } = DateTimeUTCtoISO(row.payment_date)
          // Properly formatted message with alignment
          const message =
            `Amount of ₹${payment_amount}/- has been released from Creativefuel to your bank account on ${date} at ${time}.\nThe reference ID for this transaction is ${bankTransactionReferenceId}.\n${finance_remark ? finance_remark : ""
              }`.trim();

          navigator.clipboard
            .writeText(message)
            .then(() => toastAlert("Copied to clipboard!"))
            .catch((err) => console.error("Failed to copy text:", err));
        };

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>{row.bankTransactionReferenceId}</span>
            {row.bankTransactionReferenceId ? (
              <ContentCopyIcon
                style={{ cursor: "pointer", color: "gray" }}
                onClick={handleCopy}
              />
            ) : null}
          </div>
        );
      },
    },
  ];

  const handleFilterData = () => {
    let result = [];

    if (filterStep === 0) {
      result = data.filter(item => item.is_shared_ss === true);
    } else if (filterStep === 1) {
      result = data.filter(item => item.is_shared_ss === false);
    } else {
      result = data; // show all
    }

    setTransactionData(result);
    setFilterStep((prev) => (prev + 1) % 3); // loop: 0 → 1 → 2 → 0
  };
  return (
    <div>
      {/* <FormContainer
                mainTitle="Transaction List"
                link="/admin/finance/finance-pruchasemanagement-paymentdone-transactionlist/:request_id"
            /> */}
      <div className="card" style={{ height: "600px" }}>
        <div className="card-body thm_table">
          <View
            columns={columns}
            data={transactionData}
            // data={data}
            isLoading={isLoading}
            showTotal={true}
            title={"Recent Transaction"}
            rowSelectable={true}
            pagination={[100, 200]}
            tableName={"purchase_transaction"}
            addHtml={
              <>
                <button
                  className="btn cmnbtn btn_sm btn-primary ms-2"
                  onClick={() => refetchTransaction()}
                >
                  Refetch
                </button>
                <div
                  className="pt-3"
                >

                  <PurchaseTransactionFilter

                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    onFilterChange={handleSubmitTransactionData}
                  />
                </div>
                <button
                  className="btn cmnbtn btn_sm btn-primary ms-2"
                  onClick={() => handleFilterData()}
                >
                  Filter shared SS
                </button>
              </>
            }

          // selectedData={setSelectedRows}
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

export default PurchaseTransactions;
