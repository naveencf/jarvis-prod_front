// import * as React from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import { useDemoData } from "@mui/x-data-grid-generator";
// import { UserContext } from "../../App";
// import { useContext } from "react";
// import { Paper, Autocomplete } from "@mui/material";

// export default function PlusSign() {
//   const { data, newdata, se, seEmpID, setSeEmpID, newseEmpID } =
//     useContext(UserContext);
//   // const { data } = useDemoData({
//   //   dataSet: "Commodity",
//   //   rowLength: 10,
//   //   maxColumns: 6,
//   // });

//   // return (
//   //   <div style={{ height: 400, width: "100%" }}>
//   //     <DataGrid checkboxSelection disableRowSelectionOnClick {...data} />
//   //   </div>
//   // );
//   const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
//   const handleCheckBox = () => {
//     console.log(rowSelectionModel);
//   };
//   const columns = [
//     {
//       field: "actions",
//       headerName: "S No",
//       width: 70,
//     },
//     {
//       field: "lead_name",
//       headerName: "Name",
//       width: 150,
//       editable: true,
//     },
//     {
//       field: "email",
//       headerName: "Email",
//       type: "email",
//       width: 150,
//       editable: true,
//     },
//     {
//       field: "mobile_no",
//       headerName: "Contact Detail",
//       type: "number",
//       width: 110,
//       // editable: true,
//     },

//     // {
//     //   field: "fullName",
//     //   headerName: "Full name",
//     //   description: "This column has a value getter and is not sortable.",
//     //   sortable: false,
//     //   width: 160,
//     //   valueGetter: (params) =>
//     //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
//     // },
//   ];
//   return (
//     <Paper sx={{ height: 400, width: "100%" }}>
//       <DataGrid
//         rows={data}
//         columns={columns}
//         getRowId={(row) => row.leadmast_id}
//         onRowClick={handleCheckBox}
//         onRowSelectionModelChange={(newRowSelectionModel) => {
//           setRowSelectionModel(newRowSelectionModel);
//         }}
//         rowSelectionModel={rowSelectionModel}
//         checkboxSelection
//         isRowSelectable={(params) => params.row.leadmast_id > 0}
//         // disableRowSelectionOnClick
//         // {...data}
//       />
//     </Paper>
//   );
// }
