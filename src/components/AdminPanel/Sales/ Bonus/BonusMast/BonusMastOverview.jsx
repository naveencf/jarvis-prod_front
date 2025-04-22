import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import {
  useGetAllBonusMasterDataQuery,
  useGetAllSalesBonusQuery,
} from "../../../../Store/API/Sales/SalesBonusApi";
import View from "../../Account/View/View";
import FormContainer from "../../../FormContainer";

const BonusMastOverview = () => {
  const { data: getAllBonus, isLoading: bonusLoading } =
    useGetAllBonusMasterDataQuery();

  console.log(getAllBonus, "getAllBonus");
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
      key: "Action",
      name: "Actoin",
      showCol: true,
      width: 100,
      getTotal: true,
      renderRowCell: (row) => (
        <div className="flex-row">
          <Link to={`/admin/sales-bonus-master-add-edit/${row?._id}`}>
            <button className="icon-1" title="Edit">
              <i className="bi bi-pencil"></i>
            </button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="action_title d-flex justify-content-between">
        <FormContainer mainTitle={"Bonus Master Overview"} link={true} />

        <Link to={`/admin/sales-bonus-master-add-edit/${0}`}>
          <button className="btn cmnbtn btn-primary btn_sm">Bonus Add</button>
        </Link>
        {/* <Link to="/admin/view-Outstanding-details">
      <button className="btn cmnbtn btn-primary btn_sm">Bonus Slab</button>
    </Link> */}
      </div>

      <View
        columns={columns}
        data={getAllBonus}
        isLoading={bonusLoading}
        title={"Bonus Master Overview"}
        tableName={"Bonus Master Overview"}
      />
    </>
  );
};

export default BonusMastOverview;
