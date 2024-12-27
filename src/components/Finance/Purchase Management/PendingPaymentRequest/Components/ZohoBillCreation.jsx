import React from 'react'

function ZohoBillCreation() {
    const handlebillCreation = () => {
        const phpFormData = new FormData();
        phpFormData.append("request_id", rowData.request_id);
        phpFormData.append("payment_amount", paymentAmout);
        // phpFormData.append(
        //     "payment_date",
        //     new Date(paymentDate)?.toISOString().slice(0, 19).replace("T", " ")
        // );
        phpFormData.append("payment_by", userName);
        phpFormData.append("evidence", payMentProof);
        phpFormData.append("status", 1);
        phpFormData.append("gst_hold", rowData.gst_amount);
        phpFormData.append("adjust_amt", TDSValue ? adjustAmount : 0);
        phpFormData.append("tds_deduction", TDSValue);
        phpFormData.append("finance_remark", payRemark);
        phpFormData.append("gst_hold_amount", GSTHoldAmount);
        phpFormData.append("request_amount", rowData.request_amount);
        phpFormData.append("payment_mode", paymentMode);
        phpFormData.append("gst_Hold_Bool", gstHold ? 1 : 0);
        phpFormData.append("tds_Deduction_Bool", TDSDeduction ? 1 : 0);
        phpFormData.append("tds_percentage", TDSPercentage);
        // {
        //     "bill_number": "SB/2024-25/020",
        //         "vendor_id": "2517767000003571599",
        //             "date": "2024-12-05",
        //                 "due_date": "2024-12-05",
        //                     "terms": "",
        //                         "adjustment_description": "Adjustment",
        //                             "line_items": [
        //                                 {
        //                                     "item_order": 1,
        //                                     "item_id": "2517767000003556029",
        //                                     "account_id": "2517767000000000403",
        //                                     "item_custom_fields": [],
        //                                     "description": "",
        //                                     "rate": "45000",
        //                                     "quantity": "1.00",
        //                                     "discount": "0%",
        //                                     "tax_id": "2517767000000072265",
        //                                     "tax_exemption_code": "",
        //                                     "name": "Meme Marketing",
        //                                     "reverse_charge_tax_id": "",
        //                                     "tags": [],
        //                                     "customer_id": "",
        //                                     "is_billable": false,
        //                                     "hsn_or_sac": "998361",
        //                                     "itc_eligibility": "eligible",
        //                                     "gst_treatment_code": "",
        //                                     "unit": ""
        //                                 }
        //                             ],
        //                                 "pricebook_id": "",
        //                                     "discount": 0,
        //                                         "discount_account_id": "",
        //                                             "discount_type": "entity_level",
        //                                                 "is_discount_before_tax": "",
        //                                                     "is_inclusive_tax": false,
        //                                                         "custom_fields": [],
        //                                                             "documents": [],
        //                                                                 "payment_terms": 0,
        //                                                                     "payment_terms_label": "Net 0",
        //                                                                         "tds_percent": 1,
        //                                                                             "template_id": "2517767000000031017",
        //                                                                                 "gst_treatment": "business_gst",
        //                                                                                     "gst_no": "24ADEFS7038R1ZF",
        //                                                                                         "source_of_supply": "GJ",
        //                                                                                             "destination_of_supply": "MP",
        //                                                                                                 "tax_override_preference": "no_override",
        //                                                                                                     "tds_override_preference": "no_override",
        //                                                                                                         "entity_type": "bill",
        //                                                                                                             "tds_tax_id": "2517767000000072028",
        //                                                                                                                 "billing_address_id": "2517767000003571603"
        // }
    }
    return (
        <div>ZohoBillCreation</div>
    )
}

export default ZohoBillCreation