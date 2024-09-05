// import React from "react";
// import Box from "@mui/material/Box";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// // import { DataGridPremium } from "@mui/x-data-grid-premium";
// import axios from "axios";
// import { useEffect, useState } from "react";
// // import SEGroupHeader from "./SEGroupHeader";

// /** */

// const columns = [
//   { field: "id", headerName: "Emp ID", width: 110 },
//   // {
//   //   field: "name",
//   //   headerName: "Full name",
//   //   description: "This column has a value getter and is not sortable.",
//   //   sortable: false,
//   //   width: 160,
//   //   valueGetter: (params) =>
//   //     // `${params.row.user_name || ""} ${params.row.lastName || ""}`,
//   //     {
//   //       <SEGroupHeader />;
//   //     },
//   //   // <SEGroupHeader />
//   //   hideable: false,
//   // },
//   {
//     field: "user_name",
//     headerName: "First name",
//     width: 150,
//     // editable: true,
//     description: "You can sort on the basis of this.",
//   },
//   {
//     field: "user_designation",
//     headerName: "Category",
//     type: "text",
//     width: 150,
//     editable: true,
//   },
//   {
//     field: "user_contact_no",
//     headerName: "Contact",
//     type: "number",
//     width: 110,
//     // editable: true,
//   },
//   {
//     field: "user_email_id",
//     headerName: "Email",
//     type: "email",
//     width: 110,
//     // editable: true,
//   },
// ];

// const rows = [
//   {
//     id: 1,
//     lastName: "Snow",
//     firstName: "Jon",
//     contact: 35,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 2,
//     lastName: "Lannister",
//     firstName: "Cersei",
//     contact: 42,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 3,
//     lastName: "Lannister",
//     firstName: "Jaime",
//     contact: 45,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 4,
//     lastName: "Stark",
//     firstName: "Arya",
//     contact: 16,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 5,
//     lastName: "Targaryen",
//     firstName: "Daenerys",
//     contact: null,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 6,
//     lastName: "Melisandre",
//     firstName: null,
//     contact: 150,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 7,
//     lastName: "Clifford",
//     firstName: "Ferrara",
//     contact: 44,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 8,
//     lastName: "Frances",
//     firstName: "Rossini",
//     contact: 36,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 9,
//     lastName: "Roxie",
//     firstName: "Harvey",
//     contact: 65,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 10,
//     lastName: "Clifford",
//     firstName: "Ferrara",
//     contact: 44,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 11,
//     lastName: "Frances",
//     firstName: "Rossini",
//     contact: 36,
//     email: "abc@gmail.com",
//   },
//   {
//     id: 12,
//     lastName: "Roxie",
//     firstName: "Harvey",
//     contact: 65,
//     email: "abc@gmail.com",
//   },
// ];

// function LeadManagement() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios
//       .get("https://6332e201a54a0e83d25ae127.mockapi.io/lalitnew")
//       .then((res) => {
//         setData(res.data);
//         // setFilterData(res.data);
//         console.log(res.data);
//       });
//   }, []);

//   return (
//     <Box sx={{ height: 400, width: "100%" }}>
//       <DataGrid
//         rows={data}
//         columns={columns}
//         initialState={{
//           pagination: {
//             paginationModel: {
//               pageSize: 5,
//             },
//           },
// rowGrouping: {
//   model: ["user_email_id", "user_designation"],
// },
//         }}
//         pageSizeOptions={[5, 10, 25]}
//         // pageSizeOptions={[5]}
//         // checkboxSelection
//         // disableRowSelectionOnClick
//         slots={{
//           toolbar: GridToolbar,
//         }}
//       />
//     </Box>
//   );
// }

// export default LeadManagement;
