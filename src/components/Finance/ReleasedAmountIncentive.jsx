import React from "react";
import FormContainer from "../AdminPanel/FormContainer";
// import { GridToolbar } from "@mui/x-data-grid";

const ReleasedAmountIncentive = () => {
  //   const getData = () => {
  //     axios
  //       .post(baseUrl + "add_php_payment_incentive_data_in_node")
  //       .then(() => {});
  //     const formData = new FormData();
  //     formData.append("loggedin_user_id", 36);
  //     axios
  //       .post(
  //         "https://sales.creativefuel.io/webservices/RestController.php?view=sales-incentive_request_list",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       )
  //       .then((res) => {})
  //       .catch((error) => {
  //         console.error("Error fetching data: ", error);
  //       });
  //   };

  //   useEffect(() => {
  //     getData();
  //   }, []);

  // const columns = [
  //     {
  //       width: 70,
  //       headerName: "S.No",
  //       field: "s_no",
  //       renderCell: (params, index) =>
  //         // <div style={{ whiteSpace: "normal" }}>{index + 1} </div>
  //         filterData.indexOf(params.row) + 1 === filterData.length ? (
  //           ""
  //         ) : (
  //           <div>{filterData.indexOf(params.row) + 1}</div>
  //         ),
  //       sortable: true,
  //     },
  //     {
  //       headerName: "Sales Executive Name",
  //       width: 230,
  //       field: "sales_executive_name",
  //       renderCell: (params) =>
  //         params.row.sales_executive_name !== "Total" ? (
  //           <Link
  //             to={`/admin/Incentive-Request-Released-List/${params.row.incentive_request_id}`}
  //             className="link-primary"
  //           >
  //             {params.row.sales_executive_name}
  //           </Link>
  //         ) : (
  //           <div className="fs-6 font-bold text-black-50">
  //             {" "}
  //             {params.row.sales_executive_name}
  //           </div>
  //         ),
  //     },
  //     {
  //       headerName: "Requested Date & Time",
  //       width: 230,
  //       field: "request_creation_date",
  //       renderCell: (params) =>
  //         params.row.sales_executive_name !== "Total"
  //           ? new Date(params.row.request_creation_date).toLocaleDateString(
  //               "en-IN"
  //             ) +
  //             " " +
  //             new Date(params.row.request_creation_date).toLocaleTimeString(
  //               "en-IN"
  //             )
  //           : null,
  //     },
  //     {
  //       headerName: "Request Amount",
  //       width: 230,
  //       field: "request_amount",
  //       renderCell: (params) =>
  //         params.row.sales_executive_name !== "Total" ? (
  //           params.row.request_amount
  //         ) : (
  //           <div className="fs-6 font-bold text-black-50">
  //             {" "}
  //             {params.row.request_amount}
  //           </div>
  //         ),
  //     },
  //     {
  //       headerName: "Released Amount",
  //       width: 230,
  //       field: "released_amount",
  //       renderCell: (params) =>
  //         params.row.sales_executive_name !== "Total" ? (
  //           <Link
  //             to={`/admin/Incentive-balance-Released/${params.row.incentive_request_id}`}
  //             className="link-primary"
  //           >
  //             {params.row.released_amount
  //               ? params.row.released_amount?.toLocaleString("en-IN")
  //               : 0}
  //           </Link>
  //         ) : (
  //           <div className="fs-6 font-bold text-black-50">
  //             {params.row.released_amount?.toLocaleString("en-IN")}
  //           </div>
  //         ),
  //     },
  //     {
  //       headerName: "Balance Release Amount",
  //       width: 230,
  //       field: "balance_release_amount",
  //       renderCell: (params) =>
  //         params.row.sales_executive_name !== "Total" ? (
  //           params.row.balance_release_amount?.toLocaleString("en-IN")
  //         ) : (
  //           <div className="fs-6 font-bold text-black-50">
  //             {params.row.balance_release_amount}
  //           </div>
  //         ),
  //     },
  //     {
  //       field: "Status",
  //       headerName: "Status",
  //       width: 230,
  //       renderCell: (params) => {
  //         return params.row.action === "Complete Release Button" ? (
  //           <button
  //             className="btn cmnbtn btn_sm btn-outline-primary"
  //             // data-toggle="modal"
  //             // data-target="#incentiveModal"
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setSelectedData(params.row),
  //                 setBalanceReleaseAmount(params.row.balance_release_amount);
  //               setAccountNo("");
  //               setRemarks("");
  //               setPaymentRef("");
  //               setModalOpen(true);
  //             }}
  //           >
  //             Complete Release
  //           </button>
  //         ) : (
  //           <span>{params.row.action}</span>
  //         );
  //       },
  //     },
  //     {
  //       field: "Aging",
  //       headerName: "Aging",
  //       renderCell: (params) => (
  //         <div>{params.row.aging} </div>

  //         // const currentDate = new Date(
  //         //   params.row.action == "Complete Release Button"
  //         //     ? new Date()
  //         //     : params.row.request_creation_date
  //         // );
  //         // const requestedDate = new Date(
  //         //   params.row.action == "Complete Release Button"
  //         //     ? params.row.request_creation_date
  //         //     : params.row.payment_date
  //         // );
  //         // const diffTime = Math.abs(currentDate - requestedDate);
  //         // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //         // return params.row.sales_executive_name !== "Total" ? diffDays : null;
  //       ),
  //     },
  //   ];
  return (
    <div>
      <FormContainer
        mainTitle="Incentive Settlement List"
        link="/admin/Incentive-balance-Released/:incentive_request_id"
      />
      <div className="card-body thm_table pt0">
        {/* <DataGrid
            rows={filterData}
            columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
            getRowId={(row) => filterData.indexOf(row)}
        /> */}
      </div>
    </div>
  );
};

export default ReleasedAmountIncentive;
