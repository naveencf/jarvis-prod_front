import React, { use, useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import Select from "react-select";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { useGlobalContext } from "../../../../Context/Context";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useGetAllSaleBookingQuery } from "../../../Store/API/Sales/SaleBookingApi";
import { useGetAllAccountQuery } from "../../../Store/API/Sales/SalesAccountApi";
import {
  useAddPaymentUpdateMutation,
  useGetSinglePaymentUpdateQuery,
  useUpdatePaymentUpdateMutation,
} from "../../../Store/API/Sales/PaymentUpdateApi";
import { useGetPaymentDetailListQuery } from "../../../Store/API/Sales/PaymentDetailsApi";
import { useGetAllPaymentModesQuery } from "../../../Store/API/Sales/PaymentModeApi";

import Loader from "../../../Finance/Loader/Loader";

const CreatePaymentUpdate = () => {
  const test = useParams();
  const location = useLocation();

  const sales_user = location?.state;

  const userdata = sales_user?.userdata;
  const sale_id =
    sales_user?.sales_user?.sale_booking_id || sales_user?.sale_id;
  const campaignAmount = sales_user?.sales_user?.campaign_amount;
  const [paymentAmount, setPaymentAmount] = useState(0);
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
  const { data: paymentDetailDatalist, isLoading: getPaymentDatilLoading } =
    useGetPaymentDetailListQuery();

  const { data: allPaymentModeData, isLoading: getAllPaymentModeLoading } =
    useGetAllPaymentModesQuery();

  const {
    data: allSaleBookingData,
    refetch: refetchSaleBooking,
    isLoading: getAllSaleBookingLoading,
  } = useGetAllSaleBookingQuery({ loginUserId });

  const [
    updatepayment,
    {
      isLoading: updatePaymentLoading,
      isError: updatePaymentError,
      isSuccess: updatePaymentSuccess,
    },
  ] = useUpdatePaymentUpdateMutation();

  const { data: allAccountData, isLoading: getAllAccountLoading } =
    useGetAllAccountQuery();
  const { id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();
  const navigate = useNavigate();
  const [saleBookingData, setSaleBookingData] = useState([]);
  const [selectedBookingData, setselectedBookingData] = useState(null);
  const [selectedSaleBooking, setSelectedSaleBooking] = useState(
    Number(id) ? Number(id) : null
  );
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [paymentDetailData, setPaymentDetailData] = useState([]);
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState("");
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentType, setPaymentType] = useState("");
  const [paymentRefrenceNumber, setPaymentRefrenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [payAmt, setPayAmt] = useState(0);
  const [accountData, setAccountData] = useState([]);
  const [isValidates, setIsValidated] = useState({
    salebookID: false,
    paymentDate: false,
    paymentAmount: false,
    paymentmode: false,
    paymentDetail: false,
    paymentRefrenceNumber: false,
  });
  const [AddPayment, { isLoading: addPaymentLoading, isError }] =
    useAddPaymentUpdateMutation();

  // Ensure hook is called properly
  const { data: updatepaymentData, isLoading: singlePaymentUpdateLoading } =
    useGetSinglePaymentUpdateQuery(id, {
      skip: !id,
    });

  const isLoading =
    getPaymentDatilLoading ||
    getAllPaymentModeLoading ||
    getAllSaleBookingLoading ||
    getAllAccountLoading ||
    updatePaymentLoading ||
    addPaymentLoading ||
    singlePaymentUpdateLoading;

  useEffect(() => {
    setPaymentAmount(
      saleBookingData?.find(
        (item) => item.sale_booking_id === selectedSaleBooking?.salebookID
      )?.campaign_amount - userdata?.approved_amount
    );
  }, [campaignAmount]);

  useEffect(() => {
    setSaleBookingData(allSaleBookingData);
    setAccountData(allAccountData);
    setPaymentModeData(allPaymentModeData);
    setPaymentDetailData(
      paymentDetailDatalist?.filter((item) => !item.is_hide)
    );
  }, [
    allSaleBookingData,
    allAccountData,
    allPaymentModeData,
    paymentDetailDatalist,
  ]);

  useEffect(() => {
    if (sale_id !== undefined) {
      setSelectedSaleBooking({
        salebookID: sale_id,
        accountID: allSaleBookingData?.find(
          (data) => data?.sale_booking_id === sale_id
        )?.account_id,
      });
    }
  }, [allSaleBookingData, sale_id]);

  useEffect(() => {
    if (id && updatepaymentData) {
      setSelectedSaleBooking({
        salebookID: updatepaymentData.sale_booking_id,
        accountID: updatepaymentData.account_id,
      });
      setPaymentDate(updatepaymentData.payment_date);
      setPaymentAmount(updatepaymentData.payment_amount);
      setSelectedPaymentDetail(updatepaymentData.payment_detail_id);
      setSelectedPaymentMode(updatepaymentData.payment_mode);
      setPaymentRefrenceNumber(updatepaymentData.payment_ref_no);
      setRemarks(updatepaymentData.remarks);
      // Assuming paymentScreenshot is a URL or similar value
      setPaymentScreenshot(updatepaymentData.payment_screenshot);
    }
  }, [id, updatepaymentData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}sales/get_single_sales_booking/${selectedSaleBooking.salebookID}`
        );
        const response = res.data.data;
        setselectedBookingData(response);
      } catch (error) {
        console.error("Error fetching Sales Booking");
      }
    };

    if (selectedSaleBooking?.salebookID) {
      fetchData();
    }
  }, [selectedSaleBooking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSaleBooking) {
      setIsValidated((prev) => ({ ...prev, salebookID: true }));
    }
    if (!paymentDate) {
      setIsValidated((prev) => ({ ...prev, paymentDate: true }));
    }
    if (!paymentAmount) {
      setIsValidated((prev) => ({ ...prev, paymentAmount: true }));
    }
    if (!selectedPaymentDetail) {
      setIsValidated((prev) => ({ ...prev, paymentDetail: true }));
    }
    if (!selectedPaymentMode) {
      setIsValidated((prev) => ({ ...prev, paymentmode: true }));
    }
    if (!paymentScreenshot) {
      setIsValidated((prev) => ({ ...prev, paymentScreenshot: true }));
    }
    if (!paymentRefrenceNumber) {
      setIsValidated((prev) => ({ ...prev, paymentRefrenceNumber: true }));
    }

    if (
      !selectedSaleBooking ||
      !paymentDate ||
      !paymentAmount ||
      !selectedPaymentDetail ||
      !selectedPaymentMode ||
      !paymentScreenshot ||
      !paymentRefrenceNumber
    ) {
      toastError("Please fill all the fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("sale_booking_id", selectedSaleBooking?.salebookID);
      formData.append("account_id", selectedSaleBooking?.accountID);
      formData.append("payment_date", paymentDate);
      formData.append("payment_amount", paymentAmount);
      formData.append("payment_detail_id", selectedPaymentDetail);
      formData.append("payment_mode", selectedPaymentMode);
      formData.append("payment_screenshot", paymentScreenshot);
      formData.append("payment_ref_no", paymentRefrenceNumber);
      formData.append("remarks", remarks);

      if (id == 0) {
        formData.append("created_by", token.id);
        await AddPayment(formData).unwrap();
      } else {
        formData.append("updated_by", token.id);
        let object = {};
        formData.forEach((value, key) => (object[key] = value));
        await updatepayment({ id, ...object }).unwrap();
      }

      refetchSaleBooking();
      toastAlert("Successfull", "Payment updated successfully");
      navigate("/admin/view-sales-booking");
    } catch (error) {
      toastError(error.message || "Error updating payment");
    }
  };
  useEffect(() => {
    if (selectedPaymentMode) {
      setIsValidated({ ...isValidates, paymentmode: false });
    }
  }, [selectedPaymentMode]);
  useEffect(() => {
    const campaignAmount =
      saleBookingData?.find(
        (item) => item.sale_booking_id === selectedSaleBooking?.salebookID
      )?.campaign_amount - userdata?.requested_amount;
    setPayAmt(campaignAmount - userdata?.approved_amount);
    if (campaignAmount - userdata?.approved_amount < paymentAmount) {
      toastError(
        `Payment amount should be less than or equal to ${campaignAmount - userdata?.approved_amount
        } amount`
      );
    }
  }, [paymentAmount]);

  return (
    <div>
      {isLoading && <Loader />}
      <FormContainer mainTitle="Payment Update" link={true} />
      <div className="card">

        <div className="card-body row">
          <div className="form-group col-4">
            <label className="form-label">Sale Booking</label>
            <Select
              options={allSaleBookingData?.map((option) => ({
                value: {
                  salebookID: option?.sale_booking_id,
                  accountID: option?.account_id,
                },
                label: `${allAccountData?.find(
                  (data) => data.account_id === option.account_id
                )?.account_name
                  } | ${DateISOtoNormal(option?.sale_booking_date)} | ${option?.campaign_amount
                  }`,
              }))}
              value={{
                value: selectedSaleBooking,
                label: saleBookingData?.find(
                  (item) =>
                    item?.sale_booking_id === selectedSaleBooking?.salebookID
                )
                  ? `${accountData?.find(
                    (item) =>
                      item.account_id === selectedSaleBooking?.accountID
                  )?.account_name
                  } | ${DateISOtoNormal(
                    saleBookingData.find(
                      (item) =>
                        item.sale_booking_id ===
                        selectedSaleBooking?.salebookID
                    )?.sale_booking_date
                  )} | ${saleBookingData.find(
                    (item) =>
                      item.sale_booking_id ===
                      selectedSaleBooking?.salebookID
                  )?.campaign_amount
                  }`
                  : "",
              }}
              onChange={(e) => {
                setSelectedSaleBooking(e.value);
                setIsValidated({ ...isValidates, salebookID: false });
              }}
              required
              isDisabled={Number(id) || sale_id ? true : false}
            />
            {isValidates.salebookID && (
              <div className="form-error">Please select a Sale Booking</div>
            )}
          </div>
          <div className="col-4">
            <FieldContainer
              label="Payment Date"
              fieldGrid={12}
              type="date"
              astric
              value={paymentDate}
              onChange={(e) => {
                setPaymentDate(e.target.value);
                setIsValidated({ ...isValidates, paymentDate: false });
              }}
            />
            {isValidates.paymentDate && (
              <div className="form-error">Please enter a date</div>
            )}
          </div>

          <div className="col-4">
            <FieldContainer
              label="Payment Amount"
              type="number"
              fieldGrid={12}
              astric
              value={paymentAmount}
              onChange={(e) => {
                if (
                  e.target.value <=
                  saleBookingData.find(
                    (item) =>
                      item.sale_booking_id === selectedSaleBooking?.salebookID
                  )?.campaign_amount
                ) {
                  setPaymentAmount(e.target.value);
                  setIsValidated({ ...isValidates, paymentAmount: false });
                } else {
                  toastError("Payment amount is greater than campaign amount");
                  setPaymentAmount(
                    saleBookingData.find(
                      (item) =>
                        item.sale_booking_id === selectedSaleBooking?.salebookID
                    )?.campaign_amount -
                    saleBookingData.find(
                      (item) =>
                        item.sale_booking_id ===
                        selectedSaleBooking?.salebookID
                    )?.requested_amount
                  );
                }
              }}
            />
            {<span className="successText ml-4 pb-5">
              {((paymentAmount / payAmt) * 100) ?

                ((paymentAmount / payAmt) * 100).toFixed(2)
                : 0}%
            </span>}
            {isValidates.paymentAmount && (
              <div className="form-error">Please enter a payment amount</div>
            )}
          </div>
          <div className="form-group col-4">
            <label className="form-label">
              Payment Detail <sup className="form-error">*</sup>
            </label>
            <Select
              options={paymentDetailData?.map((option) => ({
                value: option?._id,
                label: option?.title,
              }))}
              value={{
                value: selectedPaymentDetail,
                label:
                  paymentDetailData?.find(
                    (item) => item._id === selectedPaymentDetail
                  )?.title || "",
              }}
              onChange={(e) => {
                setSelectedPaymentDetail(e.value);
                setSelectedPaymentMode(
                  paymentDetailData?.find((data) => e.value === data._id)
                    ?.payment_mode_id
                );
                setIsValidated({ ...isValidates, paymentDetail: false });
              }}
              required
            />
            {isValidates.paymentDetail && (
              <div className="form-error">Please select a payment detail</div>
            )}
          </div>
          <div className="form-group col-4">
            <label className="form-label">
              Payment Mode <sup className="form-error">*</sup>
            </label>
            <Select
              options={paymentModeData?.map((option) => ({
                value: option?._id,
                label: option?.payment_mode_name,
              }))}
              value={{
                value: selectedPaymentMode,
                label:
                  paymentModeData?.find(
                    (item) => item._id === selectedPaymentMode
                  )?.payment_mode_name || "",
              }}
              onChange={(e) => {
                setSelectedPaymentMode(e.value);
                setIsValidated({ ...isValidates, paymentmode: false });
              }}
              required
              astric
            />
            {isValidates.paymentmode && (
              <div className="form-error">Please select a payment mode</div>
            )}
          </div>
          <div className="col-4 flex-row ">
            <FieldContainer
              label="Payment Screenshot"
              fieldGrid={10}
              type="file"
              onChange={(e) => {
                setPaymentScreenshot(e.target.files[0]);
                setIsValidated({ ...isValidates, paymentScreenshot: false });
              }}
              required
              astric
            />
            {isValidates.paymentScreenshot && (
              <div className="form-error">
                Please select a payment screenshot
              </div>
            )}
            {updatepaymentData?.payment_screenshot_url && (
              <a
                target="__blank"
                href={updatepaymentData?.payment_screenshot_url}
                className="icon-1 mt25"
              >
                <i className="bi bi-eye" />
              </a>
            )}
          </div>
          <div className="col-4">
            <FieldContainer
              label="Payment Refrence Number"
              placeholder="Enter Refrence Number"
              // type="number"
              fieldGrid={12}
              astric
              value={paymentRefrenceNumber}
              onChange={(e) => {
                setPaymentRefrenceNumber(e.target.value);
                setIsValidated({
                  ...isValidates,
                  paymentRefrenceNumber: false,
                });
              }}
            />
            {isValidates.paymentRefrenceNumber && (
              <div className="form-error">
                Please enter a payment reference number
              </div>
            )}
          </div>
          <div className="col-4">
            <FieldContainer
              label="Remarks"
              placeholder="Enter Remark"
              fieldGrid={12}
              // astric
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        className="cmnbtn btn btn-primary mb-3 "
        disabled={isLoading || updatePaymentLoading}
        onClick={(e) => handleSubmit(e)}
      >
        {isLoading || updatePaymentLoading ? "Submitting" : "Submit"}
      </button>
    </div>
  );
};

export default CreatePaymentUpdate;
