import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";

import { useGetIncentivePlanListQuery } from "../../../Store/API/Sales/IncentivePlanApi";
import View from "../Account/View/View";
import getDecodedToken from "../../../../utils/DecodedToken";
import { Compare } from "@mui/icons-material";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const IncentiveOverview = () => {
  const [incentiveData, setIncentiveData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const token = getDecodedToken();

  let loginUserId;
  const loginUserRole = token.role_id;
  const { userContextData, contextData } = useAPIGlobalContext();
  if (contextData?.find((data) => data?._id == 64)?.view_value !== 1) {
    loginUserId = token.id;
  }

  const {
    data: allIncentiveData,
    isError: incentiveError,
    isLoading: incentiveLoading,
  } = useGetIncentivePlanListQuery();

  useEffect(() => {
    if (allIncentiveData) {
      if (loginUserRole === 1) {
        setIncentiveData(allIncentiveData);
      } else {
        setIncentiveData(
          allIncentiveData.filter(
            (data) => data?.sales_service_master_Data?.status === 0
          )
        );
      }
    }
  }, [allIncentiveData]);

  const columns = [
    {
      name: "S.No",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 50,
      sortable: true,
    },
    {
      key: "sales_service_name",
      name: "Service Name",
      renderRowCell: (row) => row?.sales_service_master_Data?.service_name,
      width: 200,
      compare: true,
    },

    {
      key: "value",
      name: "Value (%)",
      renderRowCell: (row) => row.value,
      width: 200,
    },
  ];

  if (loginUserRole == 1) {
    columns.push({
      key: "incentive_type",
      name: "Service Type",
      renderRowCell: (row) => row.incentive_type,
      width: 200,
    });
  }

  if (loginUserRole === 1) {
    columns.push({
      name: "Action",

      renderRowCell: (row) => (
        <div className="flex-row">
          <Link to={`/admin/sales-incentive-update/${row._id}`}>
            <div className="icon-1">
              <i className="bi bi-pencil"></i>
            </div>
          </Link>
        </div>
      ),
      width: 500,
    });
  }

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle={`Incentive Plan`}
            link="/admin/sales-incentive-create"
            buttonAccess={loginUserRole === 1}
            submitButton={false}
          />
        </div>
      </div>
      <View
        version={1}
        title={`Incentive Overview (${allIncentiveData?.length
          }) - ${"There will be no incentive for competitive plan"}`}
        data={incentiveData}
        columns={columns}
        isLoading={incentiveLoading}
        pagination={[20]}
        rowSelectable
        tableName={"IncentivePlanOverview"}
      />
    </>
  );
};

export default IncentiveOverview;
