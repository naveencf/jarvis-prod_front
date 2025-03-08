import React, { useEffect, useState } from "react";
import IndianBankList from "../../../assets/js/IndianBankList";
import { Autocomplete, TextField } from "@mui/material";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";

const OnboardingBankDetails = () => {
  const { toastError, toastAlert } = useGlobalContext()
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const [bankName, setBankName] = useState("");
  const [customBank, setCustomBank] = useState("");

  const [accountType, setAccountType] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [oldPFNumber, setOldPFNumber] = useState("");
  const [UANNumber, setUANNumber] = useState("");
  const [oldESICNumber, setOldESICNumber] = useState("");
  const [upiNumber, setUPINumber] = useState("");

  const bankTypeData = ["Saving A/C", "Current A/C", "Salary A/C"];

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_single_user/${userID}`).then((res) => {
      const fetchedData = res.data;
      const { bank_name, ifsc_code, beneficiary, account_no, account_type, old_esic_number, upi_Id, uan_number, old_pf_number } =
        fetchedData;
      setBankName(bank_name);
      setIFSC(ifsc_code);
      setBeneficiary(beneficiary);
      setBankAccountNumber(account_no);
      setAccountType(account_type);
      setOldPFNumber(old_pf_number)
      setOldESICNumber(old_esic_number)
      setUANNumber(uan_number)
      setUPINumber(upi_Id)
    });
  }, [userID]);
  const handleSubmitBank = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bank_name", bankName);
    formData.append("account_no", bankAccountNumber);
    formData.append("ifsc_code", IFSC);
    formData.append("beneficiary", beneficiary);
    formData.append("account_type", accountType);
    formData.append("old_pf_number", oldPFNumber);
    formData.append("uan_number", UANNumber);
    formData.append("old_esic_number", oldESICNumber);
    formData.append("upi_id", upiNumber);


    if (!bankName || bankName == "") {
      return toastError("bank name is required");
    } else if (!bankAccountNumber || bankAccountNumber == "") {
      return toastError("bank account number is required");
    } else if (!IFSC || IFSC == "" || IFSC.length !== 11) {
      return toastError("IFSC is required and length must be 11 digit");
    } else if (!accountType || accountType == "") {
      return toastError("Bank Type is required");
    }
    try {
      const response = await axios.put(
        baseUrl + `update_user_for_bank_details/${userID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toastAlert("Bank Details Update");
      // console.log("Update successful", response.data);
    } catch (error) {
      console.error(
        "Update failed",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <div className="board_form board_form_flex">
      <h2>Finance Details</h2>

      {/* Bank Name */}
      <div className="form-group">
        {/* <Autocomplete
          options={IndianBankList}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={
            bankName
              ? IndianBankList.find((bank) => bank.value === bankName)
              : null
          }
          onChange={(event, newValue) => {
            setBankName(newValue ? newValue.value : null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Bank"
              variant="outlined"
              required
              fullWidth
            />
          )}
          clearOnEscape
        /> */}
      </div>
      <Autocomplete
        options={IndianBankList}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        value={
          bankName
            ? IndianBankList.find((bank) => bank.value === bankName) || { label: customBank, value: "other" }
            : null
        }
        onChange={(event, newValue) => {
          if (newValue && newValue.value === "other") {
            setBankName("other");
          } else {
            setBankName(newValue ? newValue.value : null);
            setCustomBank(""); // Clear custom bank name if not selecting "Other"
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Bank"
            variant="outlined"
            required
            fullWidth
          />
        )}
        clearOnEscape
      />

      {/* {bankName === "other" && (
        <TextField
          label="Enter Custom Bank Name"
          variant="outlined"
          fullWidth
          required
          value={customBank}
          onChange={(e) => setCustomBank(e.target.value)}
          style={{ marginTop: "20px" }}
        />
      )} */}

      {/* Bank Type */}
      <div className="form-group">
        <Autocomplete
          options={bankTypeData}
          getOptionLabel={(option) => option}
          value={
            accountType
              ? bankTypeData.find((type) => type === accountType)
              : null
          }
          onChange={(event, newValue) => {
            setAccountType(newValue || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Bank Type"
              variant="outlined"
              required
              fullWidth
            />
          )}
          clearOnEscape
        />
      </div>

      {/* Bank Account Number */}
      <div className="form-group">
        <TextField
          label="Bank Account Number"
          variant="outlined"
          required
          fullWidth
          value={bankAccountNumber}
          onChange={(e) => {
            const inputValue = e.target.value;
            const onlyNumbers = /^[0-9]+$/;

            if (onlyNumbers.test(inputValue) && inputValue.length <= 17) {
              setBankAccountNumber(inputValue);
            } else if (inputValue === "") {
              setBankAccountNumber("");
            }
          }}
        />
      </div>

      {/* IFSC Code */}
      <div className="form-group">
        <TextField
          label="IFSC"
          variant="outlined"
          required
          fullWidth
          value={IFSC}
          onChange={(e) => {
            const inputValue = e.target.value.toUpperCase();
            setIFSC(inputValue.slice(0, 11));
          }}
        />
      </div>

      {/* Beneficiary */}
      <div className="form-group">
        <TextField
          label="Beneficiary Name"
          variant="outlined"
          fullWidth
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
        />
      </div>

      {/* Old PF Number */}
      <div className="form-group">
        <TextField
          label="Old PF Number"
          type="number"
          variant="outlined"
          fullWidth
          value={oldPFNumber}
          onChange={(e) => setOldPFNumber(e.target.value)}
        />
      </div>

      {/* UAN Number */}
      <div className="form-group">
        <TextField
          label="UAN Number (if any)"
          type="number"
          variant="outlined"
          fullWidth
          value={UANNumber}
          onChange={(e) => setUANNumber(e.target.value)}
        />
      </div>

      {/* Old ESIC Number */}
      <div className="form-group">
        <TextField
          label="Old ESIC Number"
          type="number"
          variant="outlined"
          fullWidth
          value={oldESICNumber}
          onChange={(e) => setOldESICNumber(e.target.value)}
        />
      </div>

      {/* UPI Number */}
      <div className="form-group">
        <TextField
          label="UPI"
          type="number"
          variant="outlined"
          fullWidth
          value={upiNumber}
          onChange={(e) => setUPINumber(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn cmnbtn btn-primary mr-2"
        onClick={handleSubmitBank}
      >
        Save Bank Details
      </button>
    </div>
  );
};

export default OnboardingBankDetails;
