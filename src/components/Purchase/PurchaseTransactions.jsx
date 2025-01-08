import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Badge, Button, Chip, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";

import UpdateIcon from '@mui/icons-material/Update';
import { phpBaseUrl } from "../../utils/config";
import { useGlobalContext } from "../../Context/Context";
import ImageView from "../Finance/ImageView";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const PurchaseTransactions = () => {
    const { toastAlert, toastError } = useGlobalContext();
    const [transactionData, setTransactionData] = useState([]);
    const [startDate, setStartDate] = useState([]);
    const [endDate, setEndDate] = useState([]);
    const [openImageDialog, setOpenImageDialog] = useState(false);
    const [checkTransactionStatus, setCheckTransactionStatus] = useState(false);
    const [viewImgSrc, setViewImgSrc] = useState("");
    // const { request_id } = useParams();

    const handleSubmitTransactionData = () => {
        // Get today's date
        const today = new Date();

        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Format the dates to YYYY-MM-DD
        const formatDate = (date) => date.toISOString().split("T")[0];

        const startDate = formatDate(yesterday);
        const endDate = formatDate(today);

        const formData = new FormData();
        formData.append("start_date", startDate);
        formData.append("end_date", endDate);

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
                console.log(res?.data?.body, "res?.data?.body");
                setTransactionData(res?.data?.body || []);
            })
            .catch((err) => console.error("Error fetching transaction data:", err));
    };


    useEffect(() => {
        handleSubmitTransactionData();

    }, []);



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
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = String(date.getFullYear());// Get last two digits of the year
        return `${day}-${month}-${year}`;
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
                return formatDate(params?.row?.request_date)
            },
        },
        {
            field: "payment_date",
            headerName: "Payment Date ",
            width: 150,
            renderCell: (params) => {
                return formatDate(params?.row?.payment_date)
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
            field: "payment_getway_status",
            headerName: "Payment Status",
            width: 150,
            renderCell: (params) => {
                const tempRow = params?.row
                return (
                    <Stack direction="row" spacing={1}>

                        <Chip label={params?.row?.payment_getway_status} color="success" />
                        {params?.row?.payment_getway_status == "SUCCESS" || params?.row?.payment_getway_status == "FAILED" ? "" :
                            <UpdateIcon onClick={() => handleStatusCheck(tempRow)} />
                        }

                    </Stack>
                )
            },
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
            field: "request_amount",
            headerName: "Requested Amount",
            width: 150,
            renderCell: (params) => {
                return <p> &#8377; {params.row.request_amount}</p>;
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
            // renderCell: (params) => {
            //   const paymentAmount = nodeData.filter(
            //     (e) => e.request_id == params.row.request_id
            //   )[0]?.payment_amount;
            //   return paymentAmount ? <p>&#8377; {paymentAmount}</p> : "NA";
            // },
        },
        {
            field: "name",
            headerName: "Requested By",
            width: 150,
            // renderCell: (params) => <div>{params.row.payment_by}</div>,
        },

        {
            field: "ref",
            headerName: "Reference Number",
            width: 250,
            renderCell: (params) => {
                const handleCopy = () => {
                    const { bankTransactionReferenceId, payment_amount } = params.row;
                    const textToCopy = `Reference Number: ${bankTransactionReferenceId}, Payment Amount: ${payment_amount}`;
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => alert("Copied to clipboard!"))
                        .catch((err) => console.error("Failed to copy text:", err));
                };

                return (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span>{params.row.bankTransactionReferenceId}</span>
                        {params.row.bankTransactionReferenceId == "" ? <ContentCopyIcon
                            style={{ cursor: "pointer", color: "gray" }}
                            onClick={handleCopy}
                        /> : ""}
                    </div>
                );
            },
        },

        // {
        //     field: "actions",
        //     headerName: "Actions",
        //     width: 200,
        //     renderCell: (params) => {
        //         const handleCopy = () => {
        //             const { bankTransactionReferenceId, payment_amount } = params.row;
        //             const textToCopy = `Reference Number: ${bankTransactionReferenceId}, Payment Amount: ${payment_amount}`;
        //             navigator.clipboard.writeText(textToCopy)
        //                 .then(() => alert("Copied to clipboard!"))
        //                 .catch((err) => console.error("Failed to copy text:", err));
        //         };

        //         return (

        //             <ContentCopyIcon onClick={handleCopy} />
        //         );
        //     },
        // },
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

    ];
    return (
        <div>
            {/* <FormContainer
                mainTitle="Transaction List"
                link="/admin/finance-pruchasemanagement-paymentdone-transactionlist/:request_id"
            /> */}
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

export default PurchaseTransactions;
