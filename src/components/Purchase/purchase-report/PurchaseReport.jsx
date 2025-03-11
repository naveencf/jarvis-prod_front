import React, { useEffect, useState } from 'react'
import { useAuditReportMutation, useGetVendorsWithSearchQuery } from '../../Store/API/Purchase/DirectPurchaseApi';
import Calendar from '../Calender';
import { Autocomplete } from '@mui/lab';
import { TextField } from '@mui/material';
import CustomSelect from '../../ReusableComponents/CustomSelect';
import { useGetAllExeCampaignsQuery } from '../../Store/API/Sales/ExecutionCampaignApi';
import { DatePicker } from 'antd';

const PurchaseReport = () => {
    const [currentTab, setcurrentTab] = useState("Tab1")
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [vendorSearchQuery, setVendorSearchQuery] = useState("");
    const [selectedVendorId, setSelectedVendorId] = useState(null);
    const [vendorNumericId, setVendorNumericId] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [fetchReport, { data: dataFlag1, error: error1, isLoading: isLoading1 }] = useAuditReportMutation();
    const [fetchReport2, { data: dataFlag2, error: error2, isLoading: isLoading2 }] = useAuditReportMutation()
    const [fetchReport3, { data: dataFlag3, error: error3, isLoading: isLoading3 }] = useAuditReportMutation()
    useEffect(() => {
        // Trigger API calls for both flags when the component mounts
        fetchReport({ flagForData: 1 });
        fetchReport2({ flagForData: 2 });
        fetchReport3({ flagForData: 3 });
    }, []);
    const { data: vendorsList, isLoading: vendorsLoading } =
        useGetVendorsWithSearchQuery(
            vendorSearchQuery.length >= 4 ? vendorSearchQuery : ""
        );
    const {
        data: campaignList,
        isFetching: fetchingCampaignList,
        isLoading: loadingCampaignList,
    } = useGetAllExeCampaignsQuery();
    const handleTabClick = (tab) => {
        setcurrentTab(tab);
        switch (tab) {
            case "Tab1":

                break;
            case "Tab2":

                break;
            case "Tab3":

                break;
            case "Tab4":

                break;
            default:
                break;
        }
    };
    console.log("dataFlag1,", dataFlag1?.data);
    console.log("dataFlag2,", dataFlag2?.data);
    console.log("dataFlag3,", dataFlag3?.data);
    return (
        <div>
            <div className="tabs sm m0">
                <button
                    className={
                        currentTab === "Tab1" ? "active btn btn-primary" : "btn"
                    }
                    onClick={() => handleTabClick("Tab1")}
                >
                    Overview Report
                </button>
                <button
                    className={
                        currentTab === "Tab2" ? "active btn btn-primary" : "btn"
                    }
                    onClick={() => handleTabClick("Tab2")}
                >
                    Phase Wise
                </button>
                <button
                    className={
                        currentTab === "Tab3" ? "active btn btn-primary" : "btn"
                    }
                    onClick={() => handleTabClick("Tab3")}
                >
                    Detailed Records
                </button>
            </div>
            <Calendar
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />

            <div className="form-group">
                <label>Select Vendor</label>
                <Autocomplete
                    fullWidth
                    options={vendorsList}
                    getOptionLabel={(option) => option.vendor_name}
                    value={
                        vendorsList?.find(
                            (item) => item._id === selectedVendorId
                        ) || null
                    }
                    onChange={(event, newValue) => {
                        if (newValue) {
                            setSelectedVendorId(newValue._id);
                            setVendorNumericId(newValue.vendor_id);
                        } else {
                            setSelectedVendorId(null);
                            setVendorNumericId(null);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select Vendor"
                            variant="outlined"
                            onChange={(e) => setVendorSearchQuery(e.target.value)}
                        />
                    )}
                />

                <Autocomplete
                    fullWidth
                    options={campaignList?.filter((data) => data?.is_sale_booking_created) || []}
                    getOptionLabel={(option) => option.exe_campaign_name || ""}
                    value={campaignList?.find((option) => option._id === selectedPlan) || null}
                    onChange={(event, newValue) => setSelectedPlan(newValue ? newValue._id : null)}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderInput={(params) => <TextField {...params} label="Plans" variant="outlined" />}
                    clearOnEscape
                />

                <DatePicker
                    label="Select a date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />

            </div>
        </div>
    )
}

export default PurchaseReport
