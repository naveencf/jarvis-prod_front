import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  DialogActions,
  Typography,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import React from "react";
import { baseUrl, insightsBaseUrl } from "../../../../../utils/config";
import { useGlobalContext } from "../../../../../Context/Context";
import { TextFields } from "@mui/icons-material";
import { useState } from "react";
import jwtDecode from "jwt-decode";

const PayThroughVendorDialog = (props) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const userEmail = decodedToken.email;
  const { toastAlert, toastError } = useGlobalContext();
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [otptoVerify, setOtptoVerify] = useState(0);
  const {
    payThroughVendor,
    setPayThroughVendor,
    rowSelectionModel,
    filterData, handlePayVendorClick, handleClosePayDialog, paymentStatus, gatewayPaymentMode, setGatewayPaymentMode, rowData, paymentAmout, userName, payRemark, TDSValue, GSTHoldAmount, gstHold, TDSDeduction,
    TDSPercentage, paymentDate, vendorDetail, adjustAmount, callApi, selectedBankIndex, vendorBankDetail,
    setSelectedBankIndex, setRefetch, refetch
  } = props;


  const handleClosePayThroughVendor = () => {
    setPayThroughVendor(false);
  };


  // function extractPayeeName(fullString) {
  //   // Use a regular expression to match the name before the parentheses
  //   const match = fullString.match(/^([^(]+)\s*\(/);
  //   return match ? match[1].trim() : fullString.trim();
  // }
  function extractPayeeName(fullString) {
    // Extract name before parentheses (if present)
    const match = fullString.match(/^([^(]+)\s*\(/);
    let name = match ? match[1].trim() : fullString.trim();

    // Remove special characters except spaces and letters
    name = name.replace(/[^a-zA-Z\s]/g, '');

    return name;
  }

  console.log(rowSelectionModel[0], "check")
  const doPayment = async (e) => {
    try {

      if (!rowSelectionModel || rowSelectionModel?.length != 1) {
        toastAlert("Please select one Payment at a time")
        return;
      }
      const selectedRow = rowSelectionModel[0];

      if (vendorBankDetail[selectedBankIndex]?.ifsc == "") {
        toastError("Branch Code is not valid.");
        return;

      }
      // Step 1: Get the JWT token
      const getTokenResponse = await axios.get(
        insightsBaseUrl + `v1/payment_gateway_access_token`
      );
      const token = getTokenResponse?.data?.data;

      if (!token) {
        toastError("Payment gateway server down.Please ask IT team for more details");
        return;
      }
      let mailTo = userEmail;
      if (!userEmail || userEmail == "") {
        mailTo = "naveen@creativefuel.io";
      }
      const paymentPayload = {
        clientReferenceId: `${selectedRow?.request_id}_${(Number(rowData?.transaction_count) + 1)}`,
        // clientReferenceId: selectedRow?.request_id,
        payeeName: extractPayeeName(selectedRow?.vendor_name,),
        ...(gatewayPaymentMode !== "UPI" && {
          accountNumber: vendorBankDetail[selectedBankIndex]?.account_number,
          branchCode: vendorBankDetail[selectedBankIndex]?.ifsc,
        }),
        ...(gatewayPaymentMode === "UPI" && {
          vpa: vendorBankDetail[selectedBankIndex]?.upi_id,
        }),
        email: 'naveen@creativefuel.io',
        phone: "9109102483",
        amount: {
          currency: "INR",
          value: paymentAmout * 100,
        },

        mode: gatewayPaymentMode || "NEFT",
        remarks: "Creativefuel",
        // vendorId: "67690a8250051ca0d5074dd6",
        vendorName: selectedRow?.vendor_name,
        vendorPhpId: selectedRow?.vendor_id,
        requestId: selectedRow?.request_id,
        zohoVendorId: "1111",

        // payload for purchase
        request_id: rowData.request_id,
        payment_amount: paymentAmout,
        payment_date: new Date(paymentDate)?.toISOString().slice(0, 19).replace("T", " "),
        payment_by: userName,
        // evidence: payMentProof,
        finance_remark: selectedRow?.remark_audit || "",
        status: 1,
        payment_mode: gatewayPaymentMode,
        gst_hold: rowData.gst_amount,
        adjust_amt: TDSValue ? adjustAmount : 0,
        gst_hold_amount: GSTHoldAmount,
        request_amount: rowData.request_amount,
        tds_deduction: TDSValue,
        gst_Hold_Bool: gstHold ? 1 : 0,
        tds_Deduction_Bool: TDSDeduction ? 1 : 0,
        tds_percentage: TDSPercentage,
        // clientReferenceId,

        otp: Number(otptoVerify),
        otpEmail: mailTo,
        createdBy: userID,
        paymentType: gatewayPaymentMode || "NEFT",
        // payment_date,
        // payment_getway_status,
        // getway_process_amt,

      };
      try {
        console.log(paymentPayload, "paymentPayload")
        // return
        setPaymentInitiated(true);
        const payResponse = await axios.post(
          insightsBaseUrl + `v1/create_payout`,
          paymentPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(payResponse, "payResponse", payResponse.status);
        if (payResponse.status == 200) {
          // handlePayVendorClick();

          handleClosePayThroughVendor();
          handleClosePayDialog();
          setRefetch(!refetch)
          callApi();
          return;
          // console.log("Payment successful:", payResponse);
        } else {
          toastError("Unknown Error found.");
        }
        setPaymentInitiated(false);
      } catch (error) {
        // console.log(error?.response?.data?.error?.code, "error")
        if (error?.response?.data?.error?.code == '4108') {
          handleClosePayThroughVendor()
          toastError("This Payment request is already in process")
          return;
        } else if (error?.response?.data?.error?.errorDetails?.length > 0) {
          const errorMessages = error.response.data.error.errorDetails
            .map(detail => detail.message)
            .join(", ");
          toastError(errorMessages);
          return;
        }
        setPaymentInitiated(false);
        toastError("Payment Request Failed")
      }

    } catch (error) {
      console.error("Error processing payment:", error);
      toastError("Payment Request Failed.Contact IT team for the same.")
    }
  };

  const handleOTPforPayment = (e) => {

    setOtptoVerify(e.target.value)
  }
  // console.log(typeof (paymentAmout), "paymentAmout", paymentAmout, "paymentAmout")
  return (
    <Dialog
      open={payThroughVendor}
      onClose={handleClosePayThroughVendor}
      fullWidth
      maxWidth="md"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!paymentInitiated ? <>

        <DialogTitle> Verify OTP to Complete Payment</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClosePayThroughVendor}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ maxHeight: "80vh", overflowY: "auto" }}>



          {/* Uncomment and ensure activeAccordionIndex, filterData, and columns are passed as props if needed */}
          {/* <DataGrid
          rows={
            activeAccordionIndex === 0
              ? filterData
              : activeAccordionIndex === 1
              ? filterData
              : []
          }
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          autoHeight
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => filterData?.indexOf(row)}
        /> */}
          <Autocomplete
            onChange={(e, value) => setGatewayPaymentMode(value)}
            // className="col mt-1"
            sx={{ mb: 2 }}
            id="combo-box-demo"
            options={["IMPS", "NEFT", "UPI"]}
            value={gatewayPaymentMode}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Payment Mode *"
                placeholder="Payment Mode"
              />
            )}
          />
          <TextField id="outlined-basic" label="Type OTP" variant="outlined" onChange={(e) => handleOTPforPayment(e)} />
          {/* <Typography gutterBottom>
          Verify OTP to complete payment
        </Typography> */}

        </DialogContent>
        <DialogActions>
          {/* <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleOTPforPayment}
        >
          Pay
        </Button> */}
          {paymentAmout > 0 &&
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={doPayment}
            >
              Pay ₹{paymentAmout}
            </Button>}
        </DialogActions>
      </> :
        <CircularProgress sx={{ m: 4, p: 1 }} />}
    </Dialog>
  );
};

export default PayThroughVendorDialog;




// {
//   "bill_number": "SB/2024-25/020",
//   "vendor_id": "2517767000003571599",
//   "date": "2024-12-05",
//   "due_date": "2024-12-05",
//   "terms": "",
//   "adjustment_description": "Adjustment",
//   "line_items": [
//     {
//       "item_order": 1,
//       "item_id": "2517767000003556029",
//       "account_id": "2517767000000000403",
//       "item_custom_fields": [],
//       "description": "",
//       "rate": "45000",
//       "quantity": "1.00",
//       "discount": "0%",
//       "tax_id": "2517767000000072265",
//       "tax_exemption_code": "",
//       "name": "Meme Marketing",
//       "reverse_charge_tax_id": "",
//       "tags": [],
//       "customer_id": "",
//       "is_billable": false,
//       "hsn_or_sac": "998361",
//       "itc_eligibility": "eligible",
//       "gst_treatment_code": "",
//       "unit": ""
//     }
//   ],
//   "pricebook_id": "",
//   "discount": 0,
//   "discount_account_id": "",
//   "discount_type": "entity_level",
//   "is_discount_before_tax": "",
//   "is_inclusive_tax": false,
//   "custom_fields": [],
//   "documents": [],
//   "payment_terms": 0,
//   "payment_terms_label": "Net 0",
//   "tds_percent": 1,
//   "template_id": "2517767000000031017",
//   "gst_treatment": "business_gst",
//   "gst_no": "24ADEFS7038R1ZF",
//   "source_of_supply": "GJ",
//   "destination_of_supply": "MP",
//   "tax_override_preference": "no_override",
//   "tds_override_preference": "no_override",
//   "entity_type": "bill",
//   "tds_tax_id": "2517767000000072028",
//   "billing_address_id": "2517767000003571603"
// }


// response
// {
//     "code": 0,
//     "message": "The bill has been created.",
//     "bill": {
//         "bill_id": "2517767000006528358",
//         "purchaseorder_ids": [],
//         "vendor_id": "2517767000003571599",
//         "vendor_name": "SHORBOX NEW MEDIA MARKETING",
//         "source": "Client",
//         "source_of_supply": "GJ",
//         "source_of_supply_formatted": "Gujarat",
//         "destination_of_supply": "MP",
//         "destination_of_supply_formatted": "Madhya Pradesh",
//         "can_amend_transaction": false,
//         "gst_no": "24ADEFS7038R1ZF",
//         "reference_invoice_type": "",
//         "contact_category": "business_gst",
//         "gst_treatment": "business_gst",
//         "gst_treatment_formatted": "Registered Business - Regular",
//         "tax_treatment": "business_gst",
//         "tax_treatment_formatted": "Registered Business - Regular",
//         "gst_return_details": {
//             "status_formatted": "",
//             "return_period": "",
//             "status": "",
//             "return_period_formatted": ""
//         },
//         "invoice_conversion_type": "invoice",
//         "unused_credits_payable_amount": 0.00,
//         "unused_credits_payable_amount_formatted": "₹0.00",
//         "status": "overdue",
//         "status_formatted": "Overdue",
//         "color_code": "",
//         "current_sub_status_id": "",
//         "current_sub_status": "overdue",
//         "current_sub_status_formatted": "Overdue",
//         "sub_statuses": [],
//         "bill_number": "SB/2024-25/020",
//         "date": "2024-12-05",
//         "date_formatted": "05/12/2024",
//         "is_pre_gst": false,
//         "due_date": "2024-12-05",
//         "due_date_formatted": "05/12/2024",
//         "discount_setting": "flat",
//         "tds_calculation_type": "tds_entity_level",
//         "is_tds_amount_in_percent": true,
//         "tds_percent_formatted": "1.00%",
//         "tds_percent": "1.00",
//         "tds_amount_formatted": "₹450.00",
//         "tds_amount": 450.00,
//         "tax_account_id": "",
//         "tds_tax_id": "2517767000000072028",
//         "tds_tax_name": "Payment of contractors HUF/Indiv (1%)",
//         "tds_section_formatted": "Section 194 C",
//         "tds_section": "194C",
//         "payment_terms": 0,
//         "payment_terms_label": "Net 0",
//         "payment_expected_date": "",
//         "payment_expected_date_formatted": "",
//         "reference_number": "",
//         "scanned_po_number": "",
//         "recurring_bill_id": "",
//         "due_by_days": 19,
//         "due_in_days": "",
//         "due_days": "Overdue by 19 days",
//         "currency_id": "2517767000000000099",
//         "currency_code": "INR",
//         "currency_symbol": "₹",
//         "currency_name_formatted": "INR- Indian Rupee",
//         "documents": [
//             {
//                 "can_send_in_mail": false,
//                 "file_name": "Shorbox New Media Marketing jarvis dec.pdf",
//                 "attachment_order": 1,
//                 "source": "desktop",
//                 "document_id": "2517767000006528380",
//                 "file_size": "167787",
//                 "source_formatted": "Desktop",
//                 "uploaded_by": "Hitesh Kushwah",
//                 "file_type": "pdf",
//                 "file_size_formatted": "163.9 KB",
//                 "uploaded_on": "24/12/2024 04:53 PM",
//                 "uploaded_by_id": "2517767000005052347",
//                 "alter_text": "",
//                 "uploaded_on_date_formatted": "24/12/2024"
//             }
//         ],
//         "subject_content": "",
//         "price_precision": 2,
//         "exchange_rate": 1.00,
//         "custom_fields": [],
//         "custom_field_hash": {},
//         "is_viewed_by_client": false,
//         "client_viewed_time": "",
//         "client_viewed_time_formatted": "",
//         "is_item_level_tax_calc": false,
//         "is_inclusive_tax": false,
//         "tax_rounding": "entity_level",
//         "filed_in_vat_return_id": "",
//         "filed_in_vat_return_name": "",
//         "filed_in_vat_return_type": "",
//         "is_reverse_charge_applied": false,
//         "is_uber_bill": false,
//         "is_tally_bill": false,
//         "track_discount_in_account": true,
//         "is_bill_reconciliation_violated": false,
//         "bill_order_type": "",
//         "line_items": [
//             {
//                 "purchaseorder_id": "",
//                 "purchaseorder_item_id": "",
//                 "receive_id": "",
//                 "line_item_id": "2517767000006528360",
//                 "item_id": "2517767000003556029",
//                 "itc_eligibility": "eligible",
//                 "gst_treatment_code": "",
//                 "sku": "",
//                 "name": "Meme Marketing",
//                 "account_id": "2517767000000000403",
//                 "account_name": "Advertising And Marketing",
//                 "description": "",
//                 "bcy_rate": 45000.00,
//                 "bcy_rate_formatted": "₹45,000.00",
//                 "rate": 45000.00,
//                 "rate_formatted": "₹45,000.00",
//                 "sales_rate": 1.00,
//                 "sales_rate_formatted": "₹1.00",
//                 "sales_margin": "",
//                 "pricebook_id": "",
//                 "header_id": "",
//                 "header_name": "",
//                 "tags": [],
//                 "quantity": 1.00,
//                 "discount": 0.00,
//                 "discounts": [],
//                 "discount_account_id": "",
//                 "discount_account_name": "",
//                 "markup_percent": 0.00,
//                 "markup_percent_formatted": "0.00%",
//                 "tax_id": "2517767000000072265",
//                 "tax_exemption_id": "",
//                 "tax_exemption_code": "",
//                 "tax_name": "IGST18",
//                 "tax_type": "tax",
//                 "tax_percentage": 18,
//                 "tds_tax_id": "2517767000000072028",
//                 "tds_tax_name": "Payment of contractors HUF/Indiv",
//                 "tds_tax_percentage": 1.000000,
//                 "tds_tax_amount": 450.00,
//                 "tds_tax_amount_formatted": "₹450.00",
//                 "tds_tax_type": "tds_tax",
//                 "line_item_taxes": [
//                     {
//                         "tax_id": "2517767000000072265",
//                         "tax_name": "IGST18 (18%)",
//                         "tax_amount": 8100.00,
//                         "tax_amount_formatted": "₹8,100.00"
//                     }
//                 ],
//                 "item_total": 45000.00,
//                 "item_total_formatted": "₹45,000.00",
//                 "item_total_inclusive_of_tax": 53100.00,
//                 "item_total_inclusive_of_tax_formatted": "₹53,100.00",
//                 "item_order": 1,
//                 "unit": "",
//                 "product_type": "service",
//                 "item_type": "sales_and_purchases",
//                 "item_type_formatted": "Sales and Purchase Items (Service)",
//                 "has_product_type_mismatch": false,
//                 "hsn_or_sac": "998361",
//                 "reverse_charge_tax_id": "",
//                 "image_name": "",
//                 "image_type": "",
//                 "is_billable": false,
//                 "customer_id": "",
//                 "receipt_line_item_id": "",
//                 "customer_name": "",
//                 "project_id": "",
//                 "project_name": "",
//                 "invoice_id": "",
//                 "invoice_number": "",
//                 "item_custom_fields": [],
//                 "purchase_request_items": [],
//                 "item_matching_type": ""
//             }
//         ],
//         "submitted_date": "",
//         "submitted_date_formatted": "",
//         "submitted_by": "",
//         "submitted_by_name": "",
//         "submitted_by_email": "",
//         "submitted_by_photo_url": "",
//         "submitter_id": "",
//         "approver_id": "",
//         "adjustment": 0.00,
//         "adjustment_formatted": "₹0.00",
//         "adjustment_description": "Adjustment",
//         "discount_amount_formatted": "₹0.00",
//         "discount_amount": 0.00,
//         "discount": 0.00,
//         "discount_applied_on_amount_formatted": "₹0.00",
//         "discount_applied_on_amount": 0.00,
//         "is_discount_before_tax": true,
//         "discount_account_id": "",
//         "discount_account_name": "",
//         "discount_type": "entity_level",
//         "sub_total": 45000.00,
//         "sub_total_formatted": "₹45,000.00",
//         "sub_total_inclusive_of_tax": 53100.00,
//         "sub_total_inclusive_of_tax_formatted": "₹53,100.00",
//         "tax_total": 8100.00,
//         "tax_total_formatted": "₹8,100.00",
//         "total": 52650.00,
//         "total_formatted": "₹52,650.00",
//         "payment_made": 0.00,
//         "payment_made_formatted": "₹0.00",
//         "vendor_credits_applied": 0.00,
//         "vendor_credits_applied_formatted": "₹0.00",
//         "is_line_item_invoiced": false,
//         "purchaseorders": [],
//         "taxes": [
//             {
//                 "tax_amount": 8100.00,
//                 "tax_name": "IGST18 (18%)",
//                 "tax_amount_formatted": "₹8,100.00",
//                 "tax_id": "2517767000000072265"
//             }
//         ],
//         "tax_override": false,
//         "tax_override_preference": "no_override",
//         "tds_override_preference": "no_override",
//         "tds_summary": [
//             {
//                 "tds_tax_id": "2517767000000072028",
//                 "tds_name": "Payment of contractors HUF/Indiv",
//                 "tds_percentage": 1.000000,
//                 "tds_amount": 450.00,
//                 "tds_amount_formatted": "₹450.00"
//             }
//         ],
//         "balance": 52650.00,
//         "balance_formatted": "₹52,650.00",
//         "unprocessed_payment_amount": 0.00,
//         "unprocessed_payment_amount_formatted": "₹0.00",
//         "billing_address_id": "2517767000003571603",
//         "billing_address": {
//             "address": "",
//             "street2": "",
//             "city": "",
//             "state": "Delhi",
//             "zip": "",
//             "country": "India",
//             "fax": "",
//             "phone": "",
//             "attention": ""
//         },
//         "is_portal_enabled": false,
//         "payments": [],
//         "vendor_credits": [],
//         "journal_credits": [],
//         "comments": [
//             {
//                 "comment_id": "2517767000006528364",
//                 "bill_id": "2517767000006528358",
//                 "description": "Bill created for ₹52,650.00",
//                 "commented_by_id": "2517767000005052347",
//                 "commented_by": "Hitesh Kushwah",
//                 "comment_type": "system",
//                 "date": "2024-12-24",
//                 "date_formatted": "24/12/2024 04:53 PM",
//                 "date_description": "few seconds ago",
//                 "time": "4:53 PM",
//                 "operation_type": "Added",
//                 "transaction_id": "",
//                 "transaction_type": "bill"
//             }
//         ],
//         "created_time": "2024-12-24T16:53:57+0530",
//         "created_by_id": "2517767000005052347",
//         "last_modified_id": "2517767000005052347",
//         "last_modified_time": "2024-12-24T16:53:58+0530",
//         "warn_create_vendor_credits": true,
//         "reference_id": "",
//         "notes": "",
//         "terms": "",
//         "attachment_name": "Shorbox New Media Marketing jarvis dec.pdf",
//         "open_purchaseorders_count": 0,
//         "un_billed_items": {
//             "un_billed_items_group": [],
//             "has_unbilled_items": false
//         },
//         "template_id": "2517767000000031017",
//         "template_name": "Standard Template",
//         "page_width": "8.27in",
//         "page_height": "11.69in",
//         "orientation": "portrait",
//         "template_type": "standard",
//         "template_type_formatted": "Standard",
//         "invoices": [],
//         "is_approval_required": false,
//         "allocated_landed_costs": [],
//         "unallocated_landed_costs": [],
//         "entity_type": "bill",
//         "credit_notes": [],
//         "reference_bill_id": "",
//         "can_send_in_mail": false,
//         "approvers_list": []
//     }
// }

