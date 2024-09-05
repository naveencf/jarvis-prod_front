import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import gifone from "../../../assets/img/finance/gifone.gif";
import giftwo from "../../../assets/img/finance/giftwo.gif";
import gifthree from "../../../assets/img/finance/gifthree.gif";
import dayjs from "dayjs";
import FormattedNumberWithTooltip from "../FormateNumWithTooltip/FormattedNumberWithTooltip";

const filterOptions = [
  "Today",
  "Current Month",
  "Last Month",
  "Last 3 Months",
  "Last 6 Months",
  "Last 1 Year",
  "Custom Date",
]; // Mapping the array to the required format

const PurchaseDashboard = () => {
  const [filterValue, setFilterValue] = useState();
  const [pendingReqData, setPendingReqData] = useState([]);
  const [filterPendingReqData, setFilterPendingReqData] = useState([]);
  const [paymentDoneData, setPaymentDoneData] = useState([]);
  const [filterPaymentDoneData, setFilterPaymentDoneData] = useState([]);
  const [gstData, setGSTData] = useState([]);
  const [filterGstData, setFilterGSTData] = useState([]);
  const [tdsData, setTDSData] = useState([]);
  const [filterTdsData, setFilterTDSData] = useState([]);
  const [discardData, setDiscardData] = useState([]);
  const [filterDiscardData, setFilterDiscardData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs(new Date()));
  const navigate = useNavigate();

  const handleResetClick = () => {
    setFilterValue();
    setStartDate(dayjs());
    setEndDate(dayjs(new Date()));
    setPendingReqData(filterPendingReqData);
    setPaymentDoneData(filterPaymentDoneData);
    setGSTData(filterGstData);
    setTDSData(filterTdsData);
    setDiscardData(filterDiscardData);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e);
    const filterValue = e;

    let startFilterDate;
    let endFilterDate = new Date();

    switch (filterValue) {
      case "Today":
        startFilterDate = new Date();
        startFilterDate.setHours(0, 0, 0, 0); // Set to the start of the day
        endFilterDate.setHours(23, 59, 59, 999); // Set to the end of the day
        break;
      case "Current Month":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth(),
          1
        );
        endFilterDate = new Date();
        break;
      case "Last Month":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth() - 1,
          1
        );
        endFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth(),
          0
        );
        break;
      case "Last 3 Months":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth() - 2,
          1
        );
        endFilterDate = new Date();
        break;
      case "Last 6 Months":
        startFilterDate = new Date(
          endFilterDate.getFullYear(),
          endFilterDate.getMonth() - 5,
          1
        );
        endFilterDate = new Date();
        break;
      case "Last 1 Year":
        startFilterDate = new Date(
          endFilterDate.getFullYear() - 1,
          endFilterDate.getMonth(),
          1
        );
        endFilterDate = new Date();
        break;
      case "search":
        startFilterDate = new Date(startDate);
        endFilterDate = new Date(endDate);
        break;
      default:
      case "Custom Date":
        return;
    }

    const filteredData = filterPendingReqData.filter((item) => {
      const itemDate = new Date(item.request_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    setPendingReqData(filteredData);

    const filteredData1 = filterPaymentDoneData.filter((item) => {
      const itemDate = new Date(item.request_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });
    setPaymentDoneData(filteredData1);

    const filteredData2 = filterGstData.filter((item) => {
      const itemDate = new Date(item.request_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setGSTData(filteredData2);

    const filteredData3 = filterTdsData.filter((item) => {
      const itemDate = new Date(item.request_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setTDSData(filteredData3);

    const filteredData4 = filterDiscardData.filter((item) => {
      const itemDate = new Date(item.request_date);
      return itemDate >= startFilterDate && itemDate <= endFilterDate;
    });

    setDiscardData(filteredData4);
  };
  useEffect(() => {
    handlePendingReqData();
  }, []);

  useEffect(() => {
    handlePaymentDone();
  }, []);

  useEffect(() => {
    handleGSTHold();
  }, []);

  useEffect(() => {
    TDSDeducted();
  }, []);

  useEffect(() => {
    handleDiscardData();
  }, []);

  const handlePaymentDone = async () => {
    //PAYMENT DONE API :-
    axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const x = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequestpaid"
        )
        .then((res) => {
          // setPhpDta(res.data.body);

          let y = x.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some((item2) => item.request_id == item2.request_id);
          });
          setPaymentDoneData(u);
          setFilterPaymentDoneData(u);
        });
    });
  };
  const handleGSTHold = async () => {
    // GST HOLD API  :-

    await axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const gstHold = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = gstHold.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some(
              (item2) =>
                item.request_id == item2.request_id &&
                item2.gst_Hold_Bool == true
            );
          });
          setGSTData(u);
          setFilterGSTData(u);
        });
    });
  };

  const TDSDeducted = async () => {
    // TDS DEDUCTED API  :-

    await axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const tdsDeduct = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = tdsDeduct.filter((item) => {
            if (item.status == 1) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some(
              (item2) =>
                item.request_id == item2.request_id &&
                item2.tds_Deduction_Bool == true
            );
          });
          setTDSData(u);
          setFilterTDSData(u);
        });
    });
  };

  const handleDiscardData = async () => {
    // DISCARD API  :-
    await axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
      const discard = res.data.modifiedData;

      axios
        .get(
          "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
        )
        .then((res) => {
          let y = discard.filter((item) => {
            if (item.status == 2) {
              return item;
            }
          });
          let u = res.data.body.filter((item) => {
            return y.some((item2) => item.request_id == item2.request_id);
          });
          setDiscardData(u);
          setFilterDiscardData(u);
        });
    });
  };
  const handlePendingReqData = async () => {
    //PENDING PAYMENT REQUEST API
    //PENDING PAYMENT REQUEST API
    let remindData = "";
    await axios
      .get(
        "https://purchase.creativefuel.io//webservices/RestController.php?view=getpaymentrequestremind"
      )
      .then((res) => {
        remindData = res.data.body;

        axios.get(baseUrl + "phpvendorpaymentrequest").then((res) => {
          const pendingPmt = res?.data?.modifiedData;
          axios
            .get(
              "https://purchase.creativefuel.io/webservices/RestController.php?view=getpaymentrequest"
            )
            .then((res) => {
              let y = res?.data?.body.filter((item) => {
                return !pendingPmt.some(
                  (item2) => item.request_id === item2.request_id
                );
              });

              let c = res?.data?.body.filter((item) => {
                return remindData.some(
                  (item2) => item.request_id === item2.request_id
                );
              });

              y.push(...c); // Merging the filtered items with items matching certain conditions

              let mergedArray = [...y, ...c];

              // Creating a set of unique request_ids from the merged data
              let t = new Set(mergedArray?.map((item) => item?.request_id));
              mergedArray = Array.from(t).map((request_id) => {
                return mergedArray.find(
                  (item) => item.request_id === request_id
                );
              });

              mergedArray = mergedArray.filter(
                (item) =>
                  item.status == 0 || item.status == 3 || item.status == 2
              );
              // console.log(mergedArray, "mergedArray?>>>>");
              setPendingReqData(mergedArray);
              setFilterPendingReqData(mergedArray);
            });
        });
      });
  };

  const handleClick = (selectedRange) => {
    navigate("/admin/finance-overview", {
      state: {
        selectedRange: selectedRange,
        pendingReqData: pendingReqData && pendingReqData,
      },
    });
  };

  return (
    <div className="card body-padding">
      <div className="card">
        <div className="card-body flex-row gap4">
          <div className="row thm_form w-100">
            <div className="col-md-2_5">
              <Autocomplete
                disablePortal
                value={filterValue}
                id="combo-box-demo"
                options={filterOptions}
                onChange={(event, value) => {
                  handleFilterChange(value);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter" />
                )}
              />
            </div>

            {filterValue === "Custom Date" && (
              <>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="col-md-2_5">
                    <DatePicker
                      label="Start Date"
                      format="DD/MM/YYYY"
                      disableFuture
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                    />
                  </div>
                  <div className="col-md-2_5">
                    <DatePicker
                      label="End Date"
                      format="DD/MM/YYYY"
                      value={endDate}
                      shouldDisableDate={(day) =>
                        dayjs(day).isBefore(startDate)
                      }
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                    />
                  </div>
                </LocalizationProvider>
                <div className="col-md-2_5">
                  <button
                    onClick={() => handleFilterChange("search")}
                    className="btn cmnbtn btn-outline-primary w-100 "
                  >
                    Filter
                  </button>
                </div>
              </>
            )}
            <div className="col-md-2_5">
              <button
                onClick={handleResetClick}
                className="btn cmnbtn btn-outline-primary w-100"
              >
                Reset
              </button>
            </div>
          </div>
          <div className=" flex-row d-flex" style={{ gap: "20px" }}>
            <i
              className="bi bi-list-ul"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setgraph(0);
              }}
            ></i>
            <i
              className="bi bi-bar-chart-fill"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setgraph(1);
              }}
            ></i>
          </div>
        </div>
      </div>
      <div className="cardGrdnt orangeGrdnt">
        <Link to="/admin/finance-pruchasemanagement-pendingpaymentrequest">
          <div className="row align-items-center p-2">
            <div className="col-md-6 financeCardBox border-right ">
              <div className="financeCardBoxIn p0">
                <div className="financeCardBoxTitle">
                  <div className="financeCardBoxImg">
                    <img src={gifone} alt="" />
                  </div>
                  <h2>Pending Payment Request</h2>
                </div>
                <div className="scroll-con">
                  <div className="scroller">
                    <h3>0</h3>
                    {pendingReqData?.map((item, index) => (
                      <h3>{index + 1}</h3>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 financeCardBox">
              <div className="financeCardBoxDetails">
                <ul className="pl32">
                  <li>
                    Request Amount
                    <span>
                      <span>&#8377; </span>
                      <FormattedNumberWithTooltip
                        value={pendingReqData?.reduce(
                          (total, item) =>
                            total + parseFloat(item?.request_amount),
                          0
                        )}
                      />
                    </span>
                  </li>

                  <li>
                    Balance Release
                    <span>
                      <span>&#8377; </span>
                      <FormattedNumberWithTooltip
                        value={pendingReqData?.reduce(
                          (total, item) =>
                            total + parseFloat(item?.balance_amount),
                          0
                        )}
                      />
                    </span>
                  </li>
                  <li>
                    Base Amount
                    <span>
                      <span>&#8377; </span>
                      {/* <FormattedNumberWithTooltip> */}
                      <FormattedNumberWithTooltip
                        value={pendingReqData?.reduce(
                          (total, item) => total + parseFloat(item.base_amount),
                          0
                        )}
                      />
                      {/* </FormattedNumberWithTooltip> */}
                    </span>
                  </li>
                  <li>
                    Paid Amount
                    <span>
                      <span>&#8377; </span>
                      <FormattedNumberWithTooltip
                        value={pendingReqData?.reduce(
                          (total, item) => total + parseFloat(item.paid_amount),
                          0
                        )}
                      />
                    </span>
                  </li>
                  <li>
                    GST Amount
                    <span>
                      <span>&#8377; </span>
                      <FormattedNumberWithTooltip
                        value={pendingReqData?.reduce(
                          (total, item) => total + parseFloat(item.gst_amount),
                          0
                        )}
                      />
                    </span>
                  </li>
                  <li>
                    OutStanding
                    <span>
                      <span>&#8377; </span>
                      <FormattedNumberWithTooltip
                        value={pendingReqData?.reduce(
                          (total, item) =>
                            total + parseFloat(item.outstandings),
                          0
                        )}
                      />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Link>
      </div>{" "}
      <div className="row">
        <Link
          className="col-md-6 mb-4"
          to="/admin/finance-pruchasemanagement-paymentdone"
        >
          <div className="pack flex-row " style={{ gap: "16px" }}>
            <div className="fin-card w-100">
              <div
                className="pack flex-row w-100"
                style={{ gap: "32px", padding: "20px" }}
              >
                <div className="fd-circle">
                  <img src={giftwo} alt="gif" />
                </div>
                <div
                  className="pack d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  <h4> Payment Done</h4>
                  <div className="scroll-con">
                    <div className="scroller">
                      <h1>0</h1>
                      {/* {paymentDoneData?.map((item, index) => ( */}
                      <h1>{paymentDoneData?.length}</h1>
                      {/* ))} */}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pack d-flex flex-column w-100"
                style={{ gap: "10px", padding: "20px" }}
              >
                <div className="pack sb">
                  <h6>Requested Amount</h6>{" "}
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={paymentDoneData?.reduce(
                        (total, item) =>
                          total + parseFloat(item.request_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>Base Amount</h6>
                  <h6>
                    <FormattedNumberWithTooltip
                      value={paymentDoneData?.reduce(
                        (total, item) => total + parseFloat(item.base_amount),
                        0
                      )}
                    />{" "}
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>GST Amount</h6>
                  <h6>
                    <FormattedNumberWithTooltip
                      value={paymentDoneData?.reduce(
                        (total, item) => total + parseFloat(item.gst_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>Outstanding</h6>
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={paymentDoneData?.reduce(
                        (total, item) => total + parseFloat(item.outstandings),
                        0
                      )}
                    />
                  </h6>
                </div>
              </div>
            </div>
          </div>{" "}
        </Link>{" "}
        <Link className="col-md-6" to="/admin/payment-GST_hold">
          <div className="pack flex-row" style={{ gap: "16px" }}>
            <div className="fin-card w-100">
              <div
                className="pack flex-row w-100"
                style={{ gap: "32px", padding: "20px" }}
              >
                <div className="fd-circle">
                  <img src={gifthree} alt="gif" />
                </div>
                <div
                  className="pack d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  <h4> GST Hold</h4>
                  <div className="scroll-con">
                    <div className="scroller">
                      <h1>0</h1>
                      {gstData?.map((item, index) => (
                        <h1>{index + 1}</h1>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pack d-flex flex-column w-100"
                style={{ gap: "10px", padding: "20px" }}
              >
                <div className="pack sb">
                  <h6>Requested Amount</h6>{" "}
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={gstData?.reduce(
                        (total, item) =>
                          total + parseFloat(item.request_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                {/* <div className="pack sb">
                  <h6>Base Amount</h6>
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={gstData?.reduce(
                        (total, item) => total + parseFloat(item.base_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>GST Amount</h6>
                  <h6>
                    <FormattedNumberWithTooltip
                      value={gstData?.reduce(
                        (total, item) => total + parseFloat(item.gst_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>Outstanding</h6>
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={gstData?.reduce(
                        (total, item) => total + parseFloat(item.outstandings),
                        0
                      )}
                    />
                  </h6>
                </div> */}
              </div>
            </div>
          </div>{" "}
        </Link>{" "}
        <Link className="col-md-6" to="/admin/payment-TDS_deduct">
          <div className="pack flex-row" style={{ gap: "16px" }}>
            <div className="fin-card w-100">
              <div
                className="pack flex-row w-100"
                style={{ gap: "32px", padding: "20px" }}
              >
                <div className="fd-circle">
                  <img src={gifone} alt="gif" />
                </div>
                <div
                  className="pack d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  <h4> TDS Deduction</h4>
                  <div className="scroll-con">
                    <div className="scroller">
                      <h1>0</h1>
                      {tdsData?.map((item, index) => (
                        <h1>{index + 1}</h1>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pack d-flex flex-column w-100"
                style={{ gap: "10px", padding: "20px" }}
              >
                <div className="pack sb">
                  <h6>Requested Amount</h6>{" "}
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={tdsData?.reduce(
                        (total, item) =>
                          total + parseFloat(item.request_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>Base Amount</h6>
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={tdsData?.reduce(
                        (total, item) => total + parseFloat(item.base_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>GST Amount</h6>
                  <h6>
                    <FormattedNumberWithTooltip
                      value={tdsData?.reduce(
                        (total, item) => total + parseFloat(item.gst_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>Outstanding</h6>
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={tdsData?.reduce(
                        (total, item) => total + parseFloat(item.outstandings),
                        0
                      )}
                    />
                  </h6>
                </div>
              </div>
            </div>
          </div>{" "}
        </Link>{" "}
        <Link
          className="col-md-6"
          to="/admin/finance-pruchasemanagement-discardpayment"
        >
          <div className="pack flex-row" style={{ gap: "16px" }}>
            <div className="fin-card w-100">
              <div
                className="pack flex-row w-100"
                style={{ gap: "32px", padding: "20px" }}
              >
                <div className="fd-circle">
                  <img src={giftwo} alt="gif" />
                </div>
                <div
                  className="pack d-flex flex-column"
                  style={{ gap: "15px" }}
                >
                  <h4> Discard Payment</h4>
                  <div className="scroll-con">
                    <div className="scroller">
                      <h1>0</h1>
                      {discardData?.map((item, index) => (
                        <h1>{index + 1}</h1>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="pack d-flex flex-column w-100"
                style={{ gap: "10px", padding: "20px" }}
              >
                <div className="pack sb">
                  <h6>Requested Amount</h6>{" "}
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={discardData?.reduce(
                        (total, item) =>
                          total + parseFloat(item.request_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>Base Amount</h6>
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={discardData?.reduce(
                        (total, item) => total + parseFloat(item.base_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>GST Amount</h6>
                  <h6>
                    <FormattedNumberWithTooltip
                      value={discardData?.reduce(
                        (total, item) => total + parseFloat(item.gst_amount),
                        0
                      )}
                    />
                  </h6>
                </div>
                <div className="pack sb">
                  <h6>Outstanding</h6>
                  <h6>
                    {" "}
                    <FormattedNumberWithTooltip
                      value={discardData?.reduce(
                        (total, item) => total + parseFloat(item.outstandings),
                        0
                      )}
                    />
                  </h6>
                </div>
              </div>
            </div>
          </div>{" "}
        </Link>
      </div>
    </div>
  );
};

export default PurchaseDashboard;
