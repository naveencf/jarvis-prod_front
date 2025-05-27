import { useState } from "react";
import {
  useAuditReportMutation,
  useGetVendorsWithSearchQuery,
} from "../../Store/API/Purchase/DirectPurchaseApi";
import { useGetAllExeCampaignsQuery } from "../../Store/API/Sales/ExecutionCampaignApi";
import Calendar from "../Calender";
import { Autocomplete } from "@mui/lab";
import { TextField } from "@mui/material";
import { DatePicker } from "antd";
import View from "../../AdminPanel/Sales/Account/View/View";
import { Spinner } from "react-bootstrap";
import { ctrlKey } from "jodit/esm/core/helpers";
import CampaignReport from "./CampaignReport";

const PurchaseReport = () => {
  const [currentTab, setCurrentTab] = useState("Tab1");
  const [tabData, setTabData] = useState({
    Tab1: null,
    Tab2: null,
    Tab3: null,
  });
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    vendorSearchQuery: "",
    selectedVendorId: null,
    selectedPlan: null,
    selectedDate: null,
  });

  const [fetchReport, { isLoading }] = useAuditReportMutation();
  const { data: vendorsList } = useGetVendorsWithSearchQuery(
    filters.vendorSearchQuery.length >= 4 ? filters.vendorSearchQuery : ""
  );
  const { data: campaignList } = useGetAllExeCampaignsQuery();

  const fetchData = async () => {
    const reportParams = {
      flagForData: currentTab === "Tab1" ? 3 : currentTab === "Tab2" ? 2 : 1,
      ...(filters.selectedVendorId && { vendorId: filters.selectedVendorId }),
      ...(filters.startDate &&
        filters.endDate && {
          startDate: filters.startDate,
          endDate: filters.endDate,
        }),
      ...(filters.selectedDate && { phaseDate: filters.selectedDate }),
      ...(filters.selectedPlan && { campaignId: filters.selectedPlan }),
    };

    const response = await fetchReport(reportParams);
    setTabData((prev) => ({ ...prev, [currentTab]: response?.data }));
  };

  
  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    setFilters({
      startDate: null,
      endDate: null,
      vendorSearchQuery: "",
      selectedVendorId: null,
      selectedPlan: null,
      selectedDate: null,
    });
  };

  const columnsFlag3 = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "phaseDate",
      name: "Phase Date",
      renderRowCell: (row) =>
        row?.phaseDate ? new Date(row.phaseDate).toLocaleDateString() : "N/A",
      width: 100,
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      renderRowCell: (row) => row?.campaign_name || "N/A",
      width: 150,
    },
    {
      key: "platform_name",
      name: "Platform",
      renderRowCell: (row) => row?.platform_name || "N/A",
      width: 100,
    },
    {
      key: "amount",
      name: "Amount",
      renderRowCell: (row) =>
        row?.amount ? `₹${row.amount.toLocaleString()}` : "N/A",
      width: 100,
    },
    {
      key: "postImage",
      name: "Post Image",
      renderRowCell: (row) =>
        row?.postImage ? (
          <img
            style={{ height: "60px", width: "60px", borderRadius: "8px" }}
            src={row.postImage}
            alt="Post"
          />
        ) : (
          "No Image"
        ),
      width: 100,
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      renderRowCell: (row) => row?.vendor_name || "N/A",
      width: 150,
    },
    {
      key: "postType",
      name: "Post Type",
      renderRowCell: (row) => row?.postType || "N/A",
      width: 100,
    },
    {
      key: "like_count",
      name: "Likes",
      renderRowCell: (row) => row?.like_count?.toLocaleString() || "0",
      width: 100,
    },
    {
      key: "comment_count",
      name: "Comments",
      renderRowCell: (row) => row?.comment_count?.toLocaleString() || "0",
      width: 100,
    },
    {
      key: "ref_link",
      name: "Post Link",
      renderRowCell: (row) =>
        row?.ref_link ? (
          <a href={row.ref_link} target="_blank" rel="noopener noreferrer">
            View Post
          </a>
        ) : (
          "No Link"
        ),
      width: 150,
    },
  ];

  const columnsFlag2 = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "phaseDate",
      name: "Phase Date",
      renderRowCell: (row) => row?.phaseDate || "N/A",
      width: 100,
    },
    {
      key: "totalAmount",
      name: "Total Amount",
      renderRowCell: (row) => row?.totalAmount?.toLocaleString() || "0",
      width: 100,
    },
    {
      key: "priceDetails",
      name: "Price Breakdown",
      renderRowCell: (row) =>
        row?.priceDetails?.length > 0 ? (
          <ul>
            {row.priceDetails.map((detail, idx) => (
              <li key={idx}>
                {detail?.price_key || "Unknown"}: ₹
                {detail?.totalAmount?.toLocaleString() || "0"}
              </li>
            ))}
          </ul>
        ) : (
          "No Details"
        ),
      width: 150,
    },
  ];

  const columnsFlag1 = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "price_key",
      name: "Price Key",
      renderRowCell: (row) =>
        row?.price_key?.trim() ? (
          row.price_key
        ) : (
          <span style={{ fontStyle: "italic", color: "#9ca3af" }}>(Other)</span>
        ),
      width: 100,
    },
    {
      key: "totalAmount",
      name: "Total Amount",
      renderRowCell: (row) => row?.totalAmount?.toLocaleString() || "N/A",
      width: 100,
    },
  ];

  const columnsMap = {
    Tab1: columnsFlag1,
    Tab2: columnsFlag2,
    Tab3: columnsFlag3,
  };
   

  return (
    <div className="card">
      {/* Tabs */}
      <div className="card-header pt16 pb16">
        <div className="tabs sm m0">
          {["Tab1", "Tab2", "Tab3", "Tab4"].map((tab, index) => (
            <button
              key={index}
              className={currentTab === tab ? "active btn btn-primary" : "btn"}
              onClick={() => handleTabClick(tab)}
            >
              {
                {
                  Tab1: "Overview Report",
                  Tab2: "Phase Wise",
                  Tab3: "Detailed Records",
                  Tab4: "Campaign Report",
                }[tab]
              }
            </button>
          ))}
        </div>
      </div>

      {/* Filters and data view for Tab1, Tab2, Tab3 */}
      {(currentTab === "Tab1" ||
        currentTab === "Tab2" ||
        currentTab === "Tab3") && (
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <Calendar
                startDate={filters.startDate}
                endDate={filters.endDate}
                setStartDate={(date) =>
                  setFilters((prev) => ({ ...prev, startDate: date }))
                }
                setEndDate={(date) =>
                  setFilters((prev) => ({ ...prev, endDate: date }))
                }
              />
            </div>

            <div className="col-md-6 col-12">
              <div className="form-group">
                <label>Select Vendor</label>
                <Autocomplete
                  fullWidth
                  options={vendorsList}
                  getOptionLabel={(option) => option.vendor_name}
                  value={
                    vendorsList?.find(
                      (item) => item._id === filters?.selectedVendorId
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedVendorId: newValue?._id || null,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Vendor"
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-6 col-12">
              <div className="form-group">
                <label>Select Plans</label>
                <Autocomplete
                  fullWidth
                  options={
                    campaignList?.filter(
                      (data) => data?.is_sale_booking_created
                    ) || []
                  }
                  getOptionLabel={(option) => option.exe_campaign_name || ""}
                  value={
                    campaignList?.find(
                      (option) => option._id === filters.selectedPlan
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setFilters((prev) => ({
                      ...prev,
                      selectedPlan: newValue ? newValue._id : null,
                    }))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Plans" variant="outlined" />
                  )}
                  clearOnEscape
                />
              </div>
            </div>

            <div className="col-md-6 col-12 p0">
              <div className="form-group">
                <label>Select Date</label>
                <DatePicker
                  value={filters.selectedDate}
                  onChange={(date) =>
                    setFilters((prev) => ({ ...prev, selectedDate: date }))
                  }
                />
              </div>
            </div>

            <div className="col-12 p0">
              <button onClick={fetchData} className="btn cmnbtn btn-primary">
                Fetch Report
              </button>
            </div>
          </div>

          {/* Report Section */}
          {isLoading ? (
            <Spinner />
          ) : tabData[currentTab] ? (
            <div>
              {currentTab === "Tab1" && (
                <p>
                  Total Amount:{" "}
                  {tabData[currentTab]?.data?.data?.calculatedData?.totalAmount}
                </p>
              )}
              <View
                columns={columnsMap[currentTab]}
                data={
                  currentTab === "Tab1"
                    ? tabData[currentTab]?.data?.data?.calculatedData
                        ?.priceDetails
                    : tabData[currentTab]?.data?.data || []
                }
                title={`${currentTab} Report`}
                pagination={[5, 10]}
                tableName="Report Summary"
              />
            </div>
          ) : (
            <div className="mb16 mt16">
              <h6 className="fw_400">
                No data available. Click 'Fetch Report' to load.
              </h6>
            </div>
          )}
        </div>
      )}

      {/* Tab4 Component */}
      {currentTab === "Tab4" && <CampaignReport />}
    </div>
  );
};

export default PurchaseReport;
