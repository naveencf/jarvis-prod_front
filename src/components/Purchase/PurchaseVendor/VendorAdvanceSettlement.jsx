import React from 'react'
import { useAdvancedPaymentSettlementMutation, useGetAdvancedPaymentQuery } from '../../Store/API/Purchase/PurchaseRequestPaymentApi';
import { Autocomplete, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useGlobalContext } from '../../../Context/Context';
import jwtDecode from 'jwt-decode';

function VendorAdvanceSettlement({ vendorDetail, vendorId, formData, handleCloseDialog, selectedValues, setSelectedValues }) {
    const token = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userID = decodedToken.id;
    const [pagequery, setpagequery] = useState("");
    const [advancedPaymentSettlement, { isLoading, isError: advancePostApiIsError, isSuccess: advancePostApiSuccess, error: advancePostApiError }] =
        useAdvancedPaymentSettlementMutation();


    const { data: advanceData, error, isLoading: advanceLoading } = useGetAdvancedPaymentQuery(vendorId);
    // const [selectedValues, setSelectedValues] = useState([]);
    const { toastAlert, toastError } = useGlobalContext();

    const handleChange = (e, newValue) => {
        console.log(e.target, "selectedValues", newValue)
        setSelectedValues(newValue);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Extract _id values from selectedValues
        const selectedAdvanceIds = selectedValues.map(item => item._id);
        if (formData.base_amount == 0) {
            toastAlert("Please input settle amount")
        }
        // Constructing the payload using formData values
        const payload = {
            payment_amount: formData.base_amount, // Using request_amount from formData
            advancedPaymentIdsArray: selectedAdvanceIds, // Extracted IDs
            vendor_id: formData.vendor_id,
            request_amount: formData.request_amount,
            // gst_amount: formData.gst_amount,
            base_amount: formData.base_amount,
            priority: formData.priority,
            invc_no: formData.invc_no,
            invc_date: formData.invc_date,
            remark_audit: formData.remark_audit,
            request_by: formData.request_by,
            outstandings: formData.outstandings,
            gst: 0,
            accountNumber: formData.accountNumber || "", // Ensure default values if undefined
            branchCode: formData.branchCode || "",
            vpa: formData.vpa || "",
            is_bank_verified: true,
            payment_getway_status: "SUCCESS"
        };

        try {
            const response = await advancedPaymentSettlement({ settlementData: payload, vendorObjId: vendorId });
            // console.log("Settlement Response:", response);
            handleCloseDialog()
            toastAlert("Advanced updated successfully!");
        } catch (err) {
            console.error("Error in Settlement:", err);
        }
    };


    return (
        <>
            <Button variant="contained" onClick={handleSubmit} disabled={selectedValues.length == 0 ? true : false}>
                {isLoading ? 'updating...' : 'Settle from Advance'}
            </Button>
            {advanceData && advanceData.length > 0 &&
                <Autocomplete
                    multiple
                    sx={{ width: 300 }}
                    id="tags-standard"
                    options={advanceData}
                    getOptionLabel={(option) => `${option?.page_name} - ${option?.remaining_advance_amount - option?.gst_amount}`} // Fix: No need for .title, as options are strings
                    // getOptionLabel={(option) => `${option?.page_name} - ${option?.advance_amount > option?.base_amount ? option?.remaining_advance_amount - option?.advance_amount + option?.base_amount : option?.remaining_advance_amount}`} // Fix: No need for .title, as options are strings
                    // getOptionLabel={(option) => option} // Fix: No need for .title, as options are strings
                    onChange={(e, newValue) => handleChange(e, newValue)} // Update state
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            // variant="standard"
                            label="Multiple values"
                            placeholder="Favorites"
                        />
                    )}
                />}

        </>
    )
}

export default VendorAdvanceSettlement