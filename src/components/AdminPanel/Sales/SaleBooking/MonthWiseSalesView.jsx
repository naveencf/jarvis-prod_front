import React, { use, useEffect, useState, useCallback } from "react";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import View from "../Account/View/View";
import FieldContainer from "../../FieldContainer";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import { useLazyGetmonthwiseSaleBookingQuery } from "../../../Store/API/Sales/SaleBookingApi";
const MonthWiseSalesView = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [
    fetchMonthwiseSaleBooking,
    { data: monthwiseData, error: monthwiseError, isLoading: monthwiseLoading },
  ] = useLazyGetmonthwiseSaleBookingQuery();

  useEffect(() => {
    fetchMonthwiseSaleBooking({ startDate: fromDate, endDate: toDate });
  }, []);

  const monthwiseColumns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "monthYear",
      name: "Month-Year",

      width: 100,
    },
    {
      key: "totalCampaignWithNonGstAmount",
      name: "Total Sale Booking Amount",
      renderRowCell: (row) => Number(row.totalCampaignWithNonGstAmount),
      compare: true,

      width: 100,
    },
    {
      key: "totalApprovedAmount",
      name: "Total Recived Amount",
      renderRowCell: (row) => Number(row.totalApprovedAmount),
      compare: true,
      width: 100,
    },
  ];

  const handleFromDateChange = useCallback((value) => setFromDate(value), []);

  const handleToDateChange = useCallback((value) => setToDate(value), []);

  return (
    <div>
      <FormContainer
        mainTitle={"Monthwise Sale Bookings Overview"}
        link={true}
      />

      <div className="card mt24">
        <div className="card-body row">
          <FieldContainer
            type="date"
            label="From Date"
            fieldGrid={4}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <FieldContainer
            type="date"
            label="To Date"
            fieldGrid={4}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button
            className="cmnbtn btn btn-primary ml-2 mt25"
            onClick={() =>
              fetchMonthwiseSaleBooking({
                startDate: fromDate,
                endDate: toDate,
              })
            }
          >
            Search
          </button>
          {fromDate && toDate && (
            <button
              className="iconBtn btn btn-outline-danger ml-2 mt25"
              onClick={() => {
                setFromDate("");
                setToDate("");
                fetchMonthwiseSaleBooking({ startDate: "", endDate: "" });
              }}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>
      </div>

      <View
        columns={monthwiseColumns}
        data={monthwiseData}
        isLoading={monthwiseLoading}
        tableName={"MonthwiseSaleBookingsOverviewinsales"}
        pagination
      />
    </div>
  );
};

export default MonthWiseSalesView;
