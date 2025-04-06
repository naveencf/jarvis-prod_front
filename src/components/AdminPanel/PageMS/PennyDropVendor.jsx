import React from "react";
import { Button, Select, MenuItem, TextField } from "@mui/material";
import { insightsBaseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import axios from "axios";

function PennyDropVendor({ bankRows }) {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const handlePennyDropforVendor = async (bankDetail) => {
    if (!bankDetail.account_number) {
      toastAlert(
        "Penny drop is only for Bank Account and Account Number is missing"
      );
      return;
    }

    const payload = {
      accountNumber: bankDetail.account_number,
      branchCode: bankDetail.ifsc,
      createdBy: userID,
      vendorId: bankDetail.vendor_id,
      vendorName: bankDetail.account_holder_name,
      vendorPhpId: bankDetail.php_vendor_id,
      zohoVendorId: "1111",
      isTestingData: false,
      vendorBankDetailId: bankDetail._id,
    };

    try {
      // Step 1: Get JWT Token
      const getTokenResponse = await axios.get(
        `${insightsBaseUrl}v1/payment_gateway_access_token`
      );
      const getWayToken = getTokenResponse?.data?.data;

      // Step 2: Call API
      const response = await axios.post(
        `${insightsBaseUrl}v1/create_penny_drope`,
        payload,
        {
          headers: { Authorization: `Bearer ${getWayToken}` },
        }
      );

      if (response.status === 200) {
        toastAlert("Penny Drop Successfully initiated");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Confirm Account Details</h5>
        </div>

        {bankRows.map((bankDetail, index) => (
          <div
            key={index}
            className="bank-row"
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h4>Bank Details {index + 1}</h4>

            <div className="form-group col-4">
              <label className="form-label">Bank Name</label>
              <TextField
                fullWidth
                variant="outlined"
                value={bankDetail.bank_name}
                disabled
              />
            </div>

            <div className="form-group col-6">
              <label className="form-label">Account Type</label>
              <Select fullWidth value={bankDetail.account_type} disabled>
                <MenuItem value="Savings">Savings</MenuItem>
                <MenuItem value="Current">Current</MenuItem>
              </Select>
            </div>

            <div className="form-group">
              <label className="form-label">Account Number</label>
              <TextField
                fullWidth
                type="text"
                value={bankDetail.account_number}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">IFSC</label>
              <TextField
                fullWidth
                type="text"
                value={bankDetail.ifsc}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Holder Name</label>
              <TextField
                fullWidth
                type="text"
                value={bankDetail.account_holder_name}
                disabled
              />
            </div>

            {/* Show Penny Drop Button only if is_verified is false */}
            {!bankDetail.is_verified && (
              <Button
                onClick={() => handlePennyDropforVendor(bankDetail)}
                sx={{ mt: 2 }}
                variant="contained"
                color="success"
              >
                Penny Drop
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default PennyDropVendor;
