import React from "react";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useGetStatementQuery } from "../../../Store/API/Sales/IncentiveSettelmentApi";
import View from "../Account/View/View";
import { FormatName } from "../../../../utils/FormatName";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { useState } from "react";

import StatementSheet from "./StatementSheet";
import EarnIncentive from "./EarnIncentive";


const IncentiveStatements = () => {
  const [activeTab, setActiveTab] = useState('Tab3');

  const user_id = getDecodedToken().id;
  const {
    data: statementData,
    error: statementError,
    isLoading: statementLoading,
  } = useGetStatementQuery(user_id, { skip: !user_id });
  

  const Column = [
    {
      key: "S.No",
      name: "S.No",
      renderRowCell: (value, index) => index + 1,
      width: 50,
    },
    {
      key: "payment_date",
      name: "Payment Date",
      renderRowCell: (row) => DateISOtoNormal(row.payment_date),
      width: 100,
    },
    {
      key: "finance_status",
      name: "Finance Status",
      renderRowCell: (row) => (
        <span
          class={`badge rounded-pill ${row?.finance_status === "approved"
            ? "btn-success"
            : row?.finance_status === "pending"
              ? "btn-warning"
              : "btn-danger"
            }`}
        >
          {FormatName(row?.finance_status)}
        </span>
      ),
      width: 100,
    },

    {
      key: "user_requested_amount",
      name: "Requested Amount",
      width: 100,
      getTotal: true,
    },
    {
      key: "finance_released_amount",
      name: "Finance Released Amount",
      width: 100,
      getTotal: true,
    },
    {
      key: "payment_ref_no",
      name: "Payment Ref No",
      width: 100,
    },
    {
      key: "remarks",
      name: "Remarks",
      width: 100,
    },
  ];

  return (
    <>

      <div className="tabs">
      <button className={activeTab === 'Tab3' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab3')}>
          Statements 
        </button>
        <button className={activeTab === 'Tab1' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab1')}>
          Finance Release
        </button>
        <button className={activeTab === 'Tab2' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab2')}>
        Earn Incentive
        </button>
       
      </div>

      {activeTab === 'Tab1' && (
        <>
          {/* <FormContainer link={true} mainTitle={"Incentive Statements"} /> */}
          <View
            data={statementData?.filter(
              (data) => data?.finance_status === "approved"
            )}
            isLoading={statementLoading}
            columns={Column}
            showTotal={true}
            title={"Approved Statements"}
            tableName={"Sales_Incentive_Statement"}
            pagination
          />
        </>
      )}
      {activeTab === 'Tab2' && <EarnIncentive />}
      {activeTab === 'Tab3' && <StatementSheet statementData={statementData}/>}

    </>
  );
};

export default IncentiveStatements;
