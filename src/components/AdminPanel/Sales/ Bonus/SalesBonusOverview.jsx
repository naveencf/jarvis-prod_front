import { Link } from "react-router-dom";

import View from "../Account/View/View";
import Button from "@mui/material/Button";
import FormContainer from "../../FormContainer";
import { useGetAllSalesBonusQuery } from "../../../Store/API/Sales/SalesBonusApi";

const SalesBonusOverview = () => {
  const { data: getAllBonus, isLoading: bonusLoading } =
    useGetAllSalesBonusQuery();

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
      key: "user_name",
      name: "Username",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "total_bonus_amount",
      name: "Amount",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "bonus_details",
      name: "Bonus Details",
      renderRowCell: (row) => (
        <>
          {/* <Link to={`/admin/sales/sales-bonus-slab/${row.user_id}`}> */}
          <Link to={`/admin/sales/sales-bonus-summary/${row.user_id}`}>
            <button className="btn cmnbtn btn-primary btn_sm mr-2">
              Details
            </button>
          </Link>
        </>
      ),
      showCol: true,
      width: 100,
    },
  ];

  return (
    <div>
      <div className="action_title d-flex justify-content-between">
        <FormContainer mainTitle={"User Wise Bonus"} link={true} />
      </div>

      <View
        columns={columns}
        data={getAllBonus}
        isLoading={bonusLoading}
        title={"Overview"}
        tableName={"Bonus-Overview"}
        pagination={true}
      />
    </div>
  );
};

export default SalesBonusOverview;
