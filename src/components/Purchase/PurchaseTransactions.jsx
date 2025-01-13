import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Badge, Button, Chip, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";

import UpdateIcon from '@mui/icons-material/Update';
import { insightsBaseUrl, phpBaseUrl } from "../../utils/config";
import { useGlobalContext } from "../../Context/Context";
import ImageView from "../Finance/ImageView";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import View from "../AdminPanel/Sales/Account/View/View";
import { formatDate } from "../../utils/formatDate";
import ImageIcon from '@mui/icons-material/Image';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import PurchaseTransactionFilter from "./PurchaseTransactionFilter";

const PurchaseTransactions = () => {
    const { toastAlert, toastError } = useGlobalContext();
    const [transactionData, setTransactionData] = useState([]);
    // const [startDate, setStartDate] = useState([]);
    // const [endDate, setEndDate] = useState([]);
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day')); // Default to 7 days ago
    const [endDate, setEndDate] = useState(dayjs()); // Default to today
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [checkTransactionStatus, setCheckTransactionStatus] = useState(false);
    const [viewImgSrc, setViewImgSrc] = useState("");
    // const { request_id } = useParams();


    const handleSubmitTransactionData = () => {
        // // Get today's date
        // const today = new Date();

        // // Get yesterday's date
        // const yesterday = new Date();
        // yesterday.setDate(today.getDate() - 7);

        // // Get tomorrow's date
        // const tomorrow = new Date();
        // tomorrow.setDate(today.getDate() + 2);

        // // Format the dates to YYYY-MM-DD
        // const formatDatehere = (date) => date.toISOString().split("T")[0];

        // const startDate = formatDatehere(yesterday);
        // const endDate = formatDatehere(tomorrow);

        const formData = new FormData();
        formData.append("start_date", startDate.format("YYYY-MM-DD"));
        formData.append("end_date", endDate.format("YYYY-MM-DD"));

        axios
            .post(
                phpBaseUrl + `?view=getpaymentrequesttransdate`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((res) => {
                try {
                    // console.log(res, "Full response");
                    const rawData = res?.data?.body || [];

                    // Format the date for each record in the array
                    const formattedData = rawData.map((item) => ({
                        ...item,
                        request_date: formatDate(item.request_date), // Replace 'request_date' with your date field
                        payment_date: formatDate(item.payment_date), // Replace 'payment_date' with your date field
                    }));

                    console.log(formattedData, "Formatted Data");
                    setTransactionData(formattedData);
                } catch (error) {
                    console.error("Error processing transaction data:", error);
                    setTransactionData([]);
                }

            })
            .catch((err) => console.error("Error fetching transaction data:", err));
    };


    // useEffect(() => {
    //     handleSubmitTransactionData();

    // }, []);

    useEffect(() => {
        handleSubmitTransactionData(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
    }, [startDate, endDate]);


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
            key: "S.NO",
            name: "S.NO",
            width: 90,
            renderRowCell: (row, index) => index + 1,

        },
        {
            key: "invc_img",
            name: "Invoice Image",
            renderRowCell: (row) => {
                if (!row.invc_img) {
                    return "No Image";
                }

                // Extract file extension and check if it's a PDF
                const fileExtension = row.invc_img.split(".").pop().toLowerCase();
                const isPdf = fileExtension === "pdf";
                const imgUrl = `https://purchase.creativefuel.io/${row.invc_img}`;
                // console.log(imgUrl, isPdf, "Image URL and isPdf");

                return isPdf ? (
                    <div
                        style={{ position: "relative", overflow: "hidden", height: "80px" }}
                        onClick={() => {
                            setOpenImageDialog(true);
                            setViewImgSrc(imgUrl);
                        }}
                    >
                        <embed
                            src={imgUrl}
                            type="application/pdf"
                            title="PDF Viewer"
                            style={{ width: "100px", height: "150px" }}
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
                        style={{
                            width: "40px",
                            height: "80px",
                            objectFit: "cover",
                            cursor: "pointer",
                        }}
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80?text=No+Image"; // Fallback image
                        }}
                    />
                );
            },
            width: 100,
        },


        {
            key: "evidence",
            name: "SS",
            width: 150,
            conpare: true,
            renderRowCell: (row) => {
                const imgUrl = `https://purchase.creativefuel.io/${row.evidence}`;

                return row.evidence ? <img
                    onClick={() => {
                        setOpenImageDialog(true);
                        setViewImgSrc(imgUrl);
                    }}
                    src={imgUrl}
                    alt="payment screenshot"
                    style={{ width: "50px", height: "50px" }}
                /> : ""


            },
        },
        {
            key: "request_date",
            name: "Requested Date",
            width: 150,


        },
        {
            key: "payment_date",
            name: "Payment Date ",
            width: 150,

        },

        {
            key: "vendor_name",
            name: "Vendor Name",
            width: 200,
            // renderRowCell: (row) => {
            //     return (
            //         <div style={{ display: "flex", alignItems: "center" }}>
            //             {/* Hold for confirmation of sourabh sir */}
            //             <Button
            //                 disabled={
            //                     row.payment_details
            //                         ? !row.payment_details.length > 0
            //                         : true
            //                 }
            //                 onClick={() => handleOpenBankDetail(row)}
            //             >
            //                 <AccountBalanceIcon style={{ fontSize: "25px" }} />
            //             </Button>
            //             <div
            //                 style={{ cursor: "pointer", marginRight: "20px" }}
            //                 onClick={() => handleOpenSameVender(row.vendor_name)}
            //             >
            //                 {row.vendor_name}
            //             </div>
            //         </div>
            //     );
            // },
        },
        {
            key: "page_name",
            name: "Page Name",
            width: 150,
        },
        {
            key: "payment_getway_status",
            name: "Payment Status",
            width: 150,
            renderRowCell: (row) => {
                const tempRow = row
                return (
                    <Stack direction="row" spacing={1}>

                        <Chip label={row?.payment_getway_status} color="success" />
                        {row?.payment_getway_status == "SUCCESS" || row?.payment_getway_status == "FAILED" || row?.payment_getway_status == null ? "" :
                            <UpdateIcon onClick={() => handleStatusCheck(tempRow)} />
                        }

                    </Stack>
                )
            },
        },


        {
            key: "remark_audit",
            name: "Remark",
            width: 150,
            renderRowCell: (row) => {
                return row.remark_audit;
            },
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
            key: "outstandings",
            name: "OutStanding ",
            width: 150,
            renderRowCell: (row) => {
                return <p> &#8377; {row.outstandings}</p>;
            },
        },

        {
            key: "payment_amount",
            name: "Payment Amount",
            width: 150,
            getTotal: true

        },
        {
            key: "name",
            name: "Requested By",
            width: 150,
            // renderRowCell: (row) => <div>{row.payment_by}</div>,
        },

        {
            key: "ref",
            name: "Reference Number",
            width: 250,
            renderRowCell: (row) => {

                const handleCopy = () => {
                    const { bankTransactionReferenceId, payment_amount } = row;
                    const textToCopy = `Payment Amount: ${payment_amount} , Reference Number: ${bankTransactionReferenceId}`;
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => toastAlert("Copied to clipboard!"))
                        .catch((err) => console.error("Failed to copy text:", err));
                };

                return (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>{row.bankTransactionReferenceId}</span>
                        {!row.bankTransactionReferenceId == "" ?
                            <ContentCopyIcon
                                style={{ cursor: "pointer", color: "gray" }}
                                onClick={handleCopy}
                            />
                            : ""}
                    </div>
                );
            },
        },


    ];
    return (
        <div>
            {/* <FormContainer
                mainTitle="Transaction List"
                link="/admin/finance-pruchasemanagement-paymentdone-transactionlist/:request_id"
            /> */}
            <div className="card" style={{ height: "600px" }}>

                <div className="card-body thm_table">

                    <View
                        columns={columns}
                        data={transactionData}
                        // isLoading={isLoading}
                        showTotal={true}
                        title={"Recent Transaction"}
                        rowSelectable={true}
                        pagination={[100, 200]}
                        tableName={"purchase_transaction"}
                        addHtml={
                            <>
                                <PurchaseTransactionFilter startDate={startDate} endDate={endDate}
                                    setStartDate={setStartDate} setEndDate={setEndDate}
                                    onFilterChange={handleSubmitTransactionData} />

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
