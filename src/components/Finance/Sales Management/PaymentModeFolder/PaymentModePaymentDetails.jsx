import React, { useState, useEffect } from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import { Button } from "@mui/material";
import { useGlobalContext } from "../../../../Context/Context";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const PaymentModePaymentDetails = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [gstBanks, setGSTBanks] = useState(0);
  const [paymentMode, setPaymentMode] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const handleAddPaymentDetails = async (e) => {
    e.preventDefault();

    if (!title) {
      toastError("Please Fill Title");
      return;
    } else if (!type) {
      toastError("Please Fill Type");
      return;
    } else if (!details) {
      toastError("Please Fill Details");
      return;
    } else if (!gstBanks) {
      toastError("Please Fill GST Banks");
      return;
    }

    const paymentDetails = {
      title: title,
      payment_mode_id: type,
      details: details,
      gst_bank: gstBanks,
    };

    await axios
      .post(baseUrl + "sales/payment_details", paymentDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toastAlert("Data Created Successfully");
          navigate(-1);
        }
      })
      .catch((error) => console.log(error, "Error while Adding Data"));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handlePaymentMode = async () => {
    await axios
      .get(baseUrl + "sales/payment_mode", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPaymentMode(res?.data?.data);
      })
      .catch((error) => console.log(error, "Error while getting Data"));
  };

  useEffect(() => {
    handlePaymentMode();
  }, []);

  return (
    <div>
      <FormContainer
        mainTitle=" Add Payment Details"
        link="/admin/finance-paymentmode"
      />

      <div
        className="card-body pb4"
        style={{ backgroundColor: "white", padding: "20px" }}
      >
        <div className="row thm_form">
          <div className="form-group">
            <label>
              Title {""}
              <sup style={{ color: "red" }}>*</sup>
            </label>
            <input
              // value={requestedAmountField}
              type="text"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>
              Type {""} <sup style={{ color: "red" }}>*</sup>
            </label>
            <select
              className="form-control"
              type="text"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select Priority</option>
              {paymentMode?.map((data) => (
                <option value={data._id}>{data.payment_mode_name}</option>
              ))}
              {/* <option value="UPI">UPI</option>
              <option value="PayPal">PAYPAL</option>
              <option value="Kotak">KOTAK</option> */}
            </select>
          </div>
          <div className="form-group">
            <label>
              Details {""} <sup style={{ color: "red" }}>*</sup>
            </label>
            <input
              type="text"
              placeholder="Request Amount"
              className="form-control"
              onChange={(e) => {
                setDetails(e.target.value);
              }}
            />
          </div>
          <div className="form-group">
            <label>
              GST Banks {""} <sup style={{ color: "red" }}>*</sup>
            </label>
            <select
              className="form-control"
              type="number"
              onChange={(e) => setGSTBanks(e.target.value)}
            >
              <option value="">Select GST Bank</option>
              <option value="1">YES</option>
              <option value="0">NO</option>
            </select>
          </div>
          <div className="card-footer">
            <div className="flexCenter colGap16">
              <Button
                variant="contained"
                className="btn cmnbtn btn-primary"
                onClick={(e) => handleAddPaymentDetails(e)}
              >
                Save
              </Button>
              <Button
                variant="contained"
                className="btn cmnbtn btn-secondary"
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModePaymentDetails;
