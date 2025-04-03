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
  <div className="table-responsive">
    <View
      columns={columns}
      data={data}
      isLoading={isLoading}
      tableName={"Op_executions"}
      pagination={[100, 200, 1000]}
    />
  </div>
);

const AdvancedPaymentComponent = ({
  activeTab,
  financialYears,
  selectedPaymentYear,
  setSelectedPaymentYear,
  advancedPaymentColumns,
  vendorAdvanced,
  isLoading
}) => {
  if (activeTab !== 'Tab2') return null;

  return (
    <div className="card noCardHeader">
      <div className="card-body p0">
        <div className="pl8 pr8 pt8">
          <div className="row">
            <FilterSelect
              label="Advanced Payment Year"
              dataArray={financialYears}
              selectedId={selectedPaymentYear}
              setSelectedId={setSelectedPaymentYear}
            />
          </div>
        </div>
        <DataTable columns={advancedPaymentColumns} data={vendorAdvanced} isLoading={isLoading} />
      </div>
    </div>
  );
};

export { AdvancedPaymentComponent };
