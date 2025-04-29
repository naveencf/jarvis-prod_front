import React from "react";
import { Avatar } from "@mui/material";
// import View from "../../AdminPanel/Sales/Account/View/View";
// import CustomSelect from "../../ReusableComponents/CustomSelect";
import formatString from "../../../../utils/formatString";
import {
  useGetBonusStatementByIdQuery,
  useGetUserStatementByIdQuery,
} from "../../../Store/API/Sales/SalesBonusApi";
import { useParams } from "react-router-dom";

const VendorInfo = ({ userData }) => (
  <div className="vendorBox">
    <div className="vendorImg">
      <Avatar alt={userData?.user_name || "U"} src={"vendor.jpg"} />
    </div>
    <div className="vendorTitle">
      <h2>{formatString(userData?.user_name) || "User Name"}</h2>
      <h4>Email: {userData?.user_email_id}</h4>
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

// const FilterSelect = ({
//   label,
//   dataArray,
//   selectedId,
//   setSelectedId,
//   multiple = false,
// }) => (
//   <div className="col-md-6 col-12">
//     <CustomSelect
//       fieldGrid={12}
//       label={label}
//       dataArray={dataArray}
//       optionId="value"
//       optionLabel="label"
//       selectedId={selectedId}
//       setSelectedId={setSelectedId}
//       multiple={multiple}
//     />
//   </div>
// );

// const DataTable = ({ columns, data, isLoading }) => (
//   <div className="table-responsive noCardHeader">
//     <View
//       columns={columns}
//       showTotal={true}
//       data={data}
//       isLoading={isLoading}
//       tableName={"Op_executions"}
//       pagination={[100, 200, 1000]}
//     />
//   </div>
// );

const BonusStatementComponent = ({
  bonusStatementData,
  BonusStatementLoading,
  vendorDetail,
  ledgerData,
  vendorData,
  actualOutstanding,
}) => {
  const { id } = useParams();

  const {
    data: getBonusUserList,
    isLoading: bonusUserListLoading,
    refetch,
  } = useGetBonusStatementByIdQuery(id);
  const {
    data: userData,
    isLoading: userDataLoading,
    refetch: userDataRefetch,
  } = useGetUserStatementByIdQuery(id);
  return (
    <div className="statementDoc">
      <div className="statementDocHeader">
        <VendorInfo userData={userData} />
        {/* <div className="stats">
          <StatsBox title="Total Debited Amount" amount={totalDebit} />
          <StatsBox title="Total Credit Amount" amount={totalCredit} />
          <StatsBox title="Balance Amount" amount={runningBalance} />
        </div> */}
      </div>
      <div className="statementDocBody card-body p-3">
        <div className="row">
          <div className="col">
            <div className="card p16 shadow-none border-0 m0 bgPrimaryLight">
              <h6 className="colorMedium">Number Of Bonus</h6>
              <h6 className="mt8 fs_16">
                {userData?.totalBonuses?.toLocaleString()}
              </h6>
            </div>
          </div>
          <div className="col">
            <div className="card p16 shadow-none border-0 m0 bgSecondaryLight">
              <h6 className="colorMedium">Total Bonus Amount:</h6>
              <h6 className="mt8 fs_16">
                ₹ {userData?.totalBonusAmount?.toLocaleString()}
              </h6>
            </div>
          </div>
          <div className="col">
            <div
              className="card p16 shadow-none border-0 m0"
              style={{ backgroundColor: "lightsteelblue" }}
            >
              <h6 className="colorMedium">Current Sale Booking:</h6>
              <h6 className="mt8 fs_16">
                {/* ₹ {vendorPhpDetail[0]?.outstanding?.toLocaleString()} */}₹{" "}
                {userData?.totalApprovedAmount?.toLocaleString()}
              </h6>
            </div>
          </div>
          <div className="col">
            <div className="card p16 shadow-none border-0 m0 bgInfoLight">
              <h6 className="colorMedium">Upcoming Bonus</h6>
              <h6 className="mt8 fs_16">
                ₹ {userData?.nextSlab?.toLocaleString()}
              </h6>
            </div>
          </div>
          <div className="col">
            <div className="card p16 shadow-none border-0 m0 bgDangerLight">
              <h6 className="colorMedium">Add Sale Booking</h6>
              <h6 className="mt8 fs_16">
                ₹{userData?.amountToReachNextSlab?.toLocaleString()}
              </h6>
            </div>
          </div>
        </div>
        {/* <div className="row mt-2">
          <FilterSelect
            label="Financial Year"
            dataArray={financialYears}
            selectedId={selectedYear}
            setSelectedId={setSelectedYear}
          />
          <FilterSelect
            label="Months"
            dataArray={months}
            selectedId={selectedMonths}
            setSelectedId={setSelectedMonths}
            multiple
          />
        </div> */}

        {/* <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
        /> */}
      </div>
    </div>
  );
};

export default BonusStatementComponent;
