import React from "react";
import FormContainer from "../../FormContainer";
import { Link, useParams } from "react-router-dom";
import View from "../Account/View/View";
import {
  useGetAllBonusMasterDataQuery,
  useGetBonusSummaryByIdQuery,
} from "../../../Store/API/Sales/SalesBonusApi";
import getDecodedToken from "../../../../utils/DecodedToken";
import BonusStatementComponent from "./BonusStatementComponent";
import { formatUTCDate, formatUTCToISODate } from "../../../../utils/formatUTCDate.jsx";

const SalesBonusSummary = () => {
  const token = getDecodedToken();
  const loginUserRole = token.role_id;
  const userID = token.id;

  const { id: paramId } = useParams();

  const bonusQueryId = loginUserRole === 1 ? paramId : userID;

  const { data: bonusSummaryData, isLoading: BonusSummaryLoading } =
    useGetBonusSummaryByIdQuery(bonusQueryId);
  const { data: bonusStatementData, isLoading: BonusStatementLoading } =
    useGetAllBonusMasterDataQuery(bonusQueryId);

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
      showCol: true,
      compare: true,
    },
    {
      key: "bonus_name",
      name: "Bonus Name",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "bonus_amount",
      name: "Bonus Amount",
      renderRowCell: (row) => {
        return row?.bonus_amount ? row?.bonus_amount : 0;
      },
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "date_range",
      name: "Date Range",
      renderRowCell: (row) => {
        let range = "";
        if (row?.date_range_start && row?.date_range_end) {
          range = `${formatUTCToISODate(row?.date_range_start)} - ${formatUTCToISODate(
            // row?.date_range_end
            "2026-03-31T23:59:59.999Z"
          )}`;
        }
        return range;
      },
      showCol: true,
      width: 100,
      getTotal: true,
    },
  ];
  return (
    <>
      <div className="action_title d-flex justify-content-between">
        <FormContainer mainTitle={"Bonus Summary"} link={true} />
        <Link to={`/admin/sales-bonus-slab/${bonusQueryId}`}>
          <button className="btn cmnbtn btn-primary btn_sm">
            Assigned Bonus
          </button>
        </Link>
      </div>
      <BonusStatementComponent
        bonusStatementData={bonusStatementData}
        BonusStatementLoading={BonusStatementLoading}
      />

      <View
        columns={columns}
        data={bonusSummaryData}
        isLoading={BonusSummaryLoading}
        title={"Bonus"}
        tableName={"Bonus-summary"}
        pagination={true}
      />
    </>
  );
};

export default SalesBonusSummary;
