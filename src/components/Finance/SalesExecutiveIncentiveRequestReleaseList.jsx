import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import FormContainer from "../AdminPanel/FormContainer";

export default function SalesExecutiveIncentiveRequestReleaseList() {
  const [contextData, setDatas] = useState([]);
  const { incentive_request_id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("incentive_request_id", incentive_request_id);
    axios
      .post(
        "https://sales.creativefuel.io/webservices/RestController.php?view=sales-incentive_released_request_list",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setData(res.data.body);
      });
  }, []);
  const columns = [
    { field: "sno", headerName: "S.No", width: 100 },
    {
      field: "sale_exective_name",
      headerName: "Sales Executive Name",
      width: 200,
    },
    { field: "request_amount", headerName: "Request Amount", width: 200 },
    { field: "release_amount", headerName: "Released Amount", width: 200 },
    { field: "account_number", headerName: "Account Number", width: 200 },
    {
      headerName: "Release Date",
      renderCell: (params) => {
        const releaseDate = new Date(params.row.released_payment_date);
        return <span>{releaseDate.toLocaleDateString("en-IN")} </span>;
      },
      width: 200,
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Sales Executive Incentive Request List"
        link="/admin/incentive-payment-list"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        autoHeight
        getRowId={(row) => row.sno}
      />
    </>
  );
}
