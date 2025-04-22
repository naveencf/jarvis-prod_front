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
      key: "Button",
      name: "user id",
      renderRowCell: (row) => (
        <>
          <Link to={`/admin/sales-bonus-slab/${row.user_id}`}>
            <Button variant="outlined" color="primary">
              Bonus Name
            </Button>
          </Link>
        </>
      ),
      showCol: true,
      width: 100,
    },

    {
      key: "user_name",
      name: "Username",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "status",
      name: "status",
      showCol: true,
      width: 100,
      getTotal: true,
    },
  ];

  return (
    <div>
      <div className="action_title d-flex justify-content-between">
        <FormContainer mainTitle={"Bonus Assignment"} link={true} />

        <Link to="/admin/sales-bonus-master-overview">
          <button className="btn cmnbtn btn-primary btn_sm">
            Bonus Master
          </button>
        </Link>
        {/* <Link to="/admin/view-Outstanding-details">
          <button className="btn cmnbtn btn-primary btn_sm">Bonus Slab</button>
        </Link> */}
      </div>

      <View
        columns={columns}
        data={getAllBonus}
        isLoading={bonusLoading}
        title={"Bonus"}
        tableName={"Bonus Overview"}
      />
    </div>
  );
};

export default SalesBonusOverview;
