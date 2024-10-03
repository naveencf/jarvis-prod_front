import React, { useEffect, useState } from 'react'
import FormContainer from '../../FormContainer'
import { useLazyGetSalesReportQuery } from '../../../Store/API/Sales/SalesReportApi'
import View from '../Account/View/View';
import CustomSelect from '../../../ReusableComponents/CustomSelect';
import FieldContainer from '../../FieldContainer';

const SalesReport = () => {
    const [filter, setFilter] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [
        triggerGetSalesReport,
        { data: salesReportData, isLoading: salesLoad, isError: salesError }
    ] = useLazyGetSalesReportQuery();

    useEffect(() => {
        triggerGetSalesReport({ filter, fromDate, toDate });
    }, []);

    const handelSearch = () => {
        triggerGetSalesReport({ filter, fromDate, toDate });
    }

    const options = [
        {
            value: "",
            label: "None"
        },
        {
            value: "today",
            label: "Today"
        },
        {
            value: "week",
            label: "Week"
        },
        {
            value: "month",
            label: "Month"
        },
        {
            value: "quarter",
            label: "Quarter"
        },
        {
            value: "custom",
            label: "Custom"
        }
    ]

    const columns = [
        {
            key: "S.no",
            name: "S.No.",
            renderRowCell: (row, index) => index + 1,
            width: 30

        },
        {
            key: "userName",
            name: "Sales User Name",
            width: 100
        },
        {
            key: "userId",
            name: "User ID",
            width: 100
        },
        {
            key: "totalSaleBookingCounts",
            name: "Total Sales Booking",
            width: 100,
            getTotal: true,
        },
        {
            key: "totalRequestedAmount",
            name: "Total Requested Amount",
            width: 100,
            getTotal: true,
        },
        {
            key: "totalRecordServiceCounts",
            name: "Total Record Sevice",
            width: 100,
            getTotal: true,
        },
        {
            key: "totalRecordServiceAmount",
            name: "Total Record Sevice Amount",
            renderRowCell: (row) => row.totalRecordServiceAmount + "₹",
            width: 100,
            getTotal: true,
        },
        {
            key: "totalGstAmount",
            name: "Total GST Amount",
            renderRowCell: (row) => row.totalGstAmount + "₹",
            width: 100,
            getTotal: true,
        },
        {
            key: "totalCampaignAmount",
            name: "Total Campaign Amount",
            renderRowCell: (row) => row.totalCampaignAmount + "₹",
            width: 100,
            getTotal: true,
        },
        {
            key: "totalBaseAmount",
            name: "Total Base Amount",
            renderRowCell: (row) => row.totalBaseAmount + "₹",
            width: 100,
            getTotal: true,
        },
        {
            key: "totalApprovedAmount",
            name: "Total Appoved Amount",
            renderRowCell: (row) => row.totalApprovedAmount + "₹",
            width: 100,
            getTotal: true,
        }
    ];
    console.log(fromDate, toDate);

    return (
        <div>
            <FormContainer
                link={true}
                mainTitle={"Sales Report"}
            />
            <div className="card">
                <div className="card-body row p-3">

                    <CustomSelect
                        fieldGrid={"4"}
                        label={"Filter By"}
                        dataArray={options}
                        optionId={"value"}
                        optionLabel={"label"}
                        selectedId={filter}
                        setSelectedId={setFilter}
                    />
                    {filter === "custom" && (
                        <>

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
                        </>
                    )}
                    <div className="col-4 mt-4">
                        <button className="btn cmnbtn btn-primary" onClick={handelSearch}>
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <View
                columns={columns}
                data={salesReportData}
                isLoading={salesLoad}
                pagination
                title={"Report Overview"}
                tableName={"Sales Report OverView"}
                showTotal={true}
            />
        </div>
    )
}

export default SalesReport