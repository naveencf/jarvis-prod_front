import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  useGetInstaBoostingDataQuery,
  useReportPriceCardMutation,
} from "../Store/API/Boosting/BoostingApi";
import PurchaseTransactionFilter from "../Purchase/PurchaseTransactionFilter";

const ReportPriceCard = ({ startDate, endDate, setStartDate, setEndDate }) => {
  const [sendData] = useReportPriceCardMutation();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ API Call Function (Memoized)
  const fetchReportData = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const response = await sendData({ startDate, endDate }).unwrap();
      setReportData(response.data);
    } catch (error) {
      setError("Failed to fetch report data");
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, sendData]);

  // ✅ Fetch data when startDate or endDate changes (Debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchReportData();
    }, 300);

    return () => clearTimeout(timeout);
  }, [startDate, endDate, fetchReportData]);
  console.log(reportData, "report data");
  return (
    <>
      {loading && <CircularProgress size={24} />}
      {error && <Typography color="error">{error}</Typography>}

      {reportData && (
        <>
          <div className="statementDocBody card-body">
            <div className="p16">
              <div className="row">
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgPrimaryLight">
                    <h6 className="colorMedium">Post Count</h6>
                    <h6 className="mt8 fs_16">{reportData?.post_count}</h6>
                  </div>
                </div>
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgSecondaryLight">
                    <h6 className="colorMedium">Page Count:</h6>
                    <h6 className="mt8 fs_16">{reportData?.page_count}</h6>
                  </div>
                </div>
                <div className="col">
                  <div
                    className="card p16 shadow-none border-0 m0"
                    style={{ backgroundColor: "lightsteelblue" }}
                  >
                    <h6 className="colorMedium">Total Spend:</h6>
                    <h6 className="mt8 fs_16">
                      ₹{reportData.totalSpend.toFixed(2)}
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgInfoLight">
                    <h6 className="colorMedium">Like Spend</h6>
                    <h6 className="mt8 fs_16">
                      ₹ {reportData.likesSpend.toFixed(2)}
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgDangerLight">
                    <h6 className="colorMedium">View Spend</h6>
                    <h6 className="mt8 fs_16">
                      ₹{reportData.viewsSpend.toFixed(2)}
                    </h6>
                  </div>
                </div>
                <div className="col">
                  <div className="card p16 shadow-none border-0 m0 bgTertiaryLight">
                    <h6 className="colorMedium">Share Spend</h6>
                    <h6 className="mt8 fs_16">
                      ₹{reportData.sharesSpend.toFixed(2)}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReportPriceCard;
