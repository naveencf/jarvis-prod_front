import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import DataTable from "react-data-table-component";
import FormContainer from "../../FormContainer";
import DateISOtoNormal from "../../../../utils/DateISOtoNormal";
import { Link } from "react-router-dom";
import { useGetAllRecordServicesQuery } from "../../../Store/API/Sales/RecordServicesApi";
import View from "../Account/View/View";
import { render } from "react-dom";
import formatString from "../../../../utils/formatString";
import getDecodedToken from "../../../../utils/DecodedToken";

const RecordServices = () => {
  const [recordServiceData, setRecordServiceData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
  const {
    data: recordServicedata,
    isLoading: recordServiceDataLoading,
    error: recordServiceDataError,
    isError: recordServiceDataIsError,
  } = useGetAllRecordServicesQuery(loginUserId)
  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/get_record_service_master`
      );
      setRecordServiceData(response.data.data);
      setOriginalData(response.data.data);
    } catch (error) {
      console.error("Error fetching credit approval reasons:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = originalData.filter((d) => {
      return (
        d?.sale_executive_by_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase()) ||
        d?.customer_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
        d?.Salesservicemasters?.service_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase())
      );
    });
    setRecordServiceData(result);
  }, [search]);

  const columns = [
    {
      key: "serial",
      name: "S.No",
      width: 50,
      renderRowCell: (row, index) => <div>{index + 1}</div>,
    },
    {
      key: "sale_executive_name",
      name: "Sales Executive Name",
      width: 150,
    },
    {
      key: "account_name",
      name: "Account Name",
      width: 150,
    },

    {
      key: "sales_service_master_name",
      name: "Service Name",
      width: 150,

    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      renderRowCell: (row) => formatString(row.campaign_name),
      width: 150,
    },
    {
      key: "campaign_amount",
      name: "Campaign Amount",
      width: 150,

    },
    {
      key: "amount",
      width: 150,
      name: "Record Service Amount"
    }, {
      key: "brand_name",
      name: "Brand Name",
      width: 150,
    }, {
      key: "day",
      name: "Day",
      width: 150,
    },
    {
      key: "deliverables_info",
      name: "Deliverables Info",
      width: 150,
    },
    {
      key: "end_date",
      name: "End Date",
      renderRowCell: (row) => DateISOtoNormal(row?.end_date),
      compare: true,
      width: 150,
    },
    {
      key: "goal",
      name: "Goal",
      width: 150,
    },
    {
      key: "hashtag",
      name: "Hashtag",
      width: 150,
    },
    {
      key: "individual_amount",
      name: "Individual Amount",
      width: 150
    },
    {
      key: "no_of_creators",
      name: "No of creators",
      width: 150,
    },
    {
      key: "no_of_hours",
      name: "No of hours",
      width: 150,
    }, {
      key: "per_month_amount",
      name: "Per month amount",
      width: 150,
    },
    {
      key: "quantity",
      name: "Quantity",
      width: 150,
    },
    {
      key: "remarks",
      name: "Remarks",
      width: 150,
    },
    {
      key: "start_date",
      name: "Start Date",
      renderRowCell: (row) => DateISOtoNormal(row?.start_date),
      compare: true,
      width: 150,

    },

  ];
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Record Services"
            link={true}
          />
        </div>
      </div>
      <View
        data={recordServicedata}
        columns={columns}
        pagination
        tableName={"Record Services Overview salebooking table navigation"}
        title={"Record Service Overview"}

      />
    </div>
  );
};

export default RecordServices;
