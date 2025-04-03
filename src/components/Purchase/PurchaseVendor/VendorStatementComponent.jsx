import React from 'react';
import { Avatar } from "@mui/material";
import View from "../../AdminPanel/Sales/Account/View/View";
import CustomSelect from '../../ReusableComponents/CustomSelect';

const VendorInfo = ({ vendorDetail, ledgerData }) => (
    <div className="vendorBox">
        <div className="vendorImg">
            <Avatar alt="Vendor" src={ledgerData[0]?.vendor_image || 'vendor.jpg'} />
        </div>
        <div className="vendorTitle">
            <h2>{vendorDetail?.vendor_name || 'Vendor Name'}</h2>
            <h4>Vendor Category: {vendorDetail?.vendor_category}</h4>
            {vendorDetail?.recent_purchase_date && (
                <h4>Purchase Date: {vendorDetail.recent_purchase_date}</h4>
            )}
        </div>
    </div>
);

const StatsBox = ({ title, amount }) => (
    <div className="statsBox">
        <h4>{title}</h4>
        <h2>₹ {amount?.toLocaleString()}</h2>
    </div>
);

const CardBox = ({ title, amount, bgColor }) => (
    <div className={`card p16 shadow-none border-0 m0 ${bgColor}`}>
        <h6 className="colorMedium">{title}</h6>
        <h6 className="mt8 fs_16">₹ {amount?.toLocaleString()}</h6>
    </div>
);

const FilterSelect = ({ label, dataArray, selectedId, setSelectedId, multiple = false }) => (
    <div className="col-md-6 col-12">
        <CustomSelect
            fieldGrid={12}
            label={label}
            dataArray={dataArray}
            optionId="value"
            optionLabel="label"
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            multiple={multiple}
        />
    </div>
);

const DataTable = ({ columns, data, isLoading }) => (
    <div className="table-responsive noCardHeader">
        <View
            columns={columns}
            showTotal={true}
            data={data}
            isLoading={isLoading}
            tableName={"Op_executions"}
            pagination={[100, 200, 1000]}
        />
    </div>
);

const VendorStatementComponent = ({
    activeTab,
    vendorDetail,
    ledgerData,
    totalDebit,
    totalCredit,
    runningBalance,
    vendorData,
    vendorPhpDetail,
    actualOutstanding,
    financialYears,
    selectedYear,
    setSelectedYear,
    months,
    selectedMonths,
    setSelectedMonths,
    columns,
    filteredData,
    isLoading
}) => {
    if (activeTab !== 'Tab1') return null;

    return (
        <div className="statementDoc">
            <div className="statementDocHeader">
                <VendorInfo vendorDetail={vendorDetail} ledgerData={ledgerData} />
                <div className="stats">
                    <StatsBox title="Total Debited Amount" amount={totalDebit} />
                    <StatsBox title="Total Credit Amount" amount={totalCredit} />
                    <StatsBox title="Balance Amount" amount={runningBalance} />
                </div>
            </div>
            <div className="statementDocBody card-body p-3">
                <div className="row">
                    <div className="col">
                        <div className="card p16 shadow-none border-0 m0 bgPrimaryLight">
                            <h6 className="colorMedium">Audit Pending</h6>
                            <h6 className="mt8 fs_16">₹ {vendorData?.totalAmount?.toLocaleString()}</h6>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card p16 shadow-none border-0 m0 bgSecondaryLight">
                            <h6 className="colorMedium">Outstanding:</h6>
                            <h6 className="mt8 fs_16">₹ {vendorDetail?.vendor_outstandings?.toLocaleString()}</h6>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card p16 shadow-none border-0 m0" style={{ backgroundColor: "lightsteelblue" }}>
                            <h6 className="colorMedium">Php Outstanding:</h6>
                            <h6 className="mt8 fs_16">₹ {Number(vendorPhpDetail[0]?.outstanding)?.toLocaleString()}</h6>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card p16 shadow-none border-0 m0 bgInfoLight">
                            <h6 className="colorMedium">Total Remaining Advance</h6>
                            <h6 className="mt8 fs_16">₹ {vendorDetail?.vendor_total_remaining_advance_amount?.toLocaleString()}</h6>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card p16 shadow-none border-0 m0 bgDangerLight">
                            <h6 className="colorMedium">Actual Outstanding</h6>
                            <h6 className="mt8 fs_16">₹{actualOutstanding?.toLocaleString()}</h6>
                        </div>
                    </div>
                    </div>
                    <div className="row mt-2">
                        <FilterSelect label="Financial Year" dataArray={financialYears} selectedId={selectedYear} setSelectedId={setSelectedYear} />
                        <FilterSelect label="Months" dataArray={months} selectedId={selectedMonths} setSelectedId={setSelectedMonths} multiple />
                    </div>

                    <DataTable columns={columns} data={filteredData} isLoading={isLoading} />
                </div>
            </div>
            );
};

            export default VendorStatementComponent;
