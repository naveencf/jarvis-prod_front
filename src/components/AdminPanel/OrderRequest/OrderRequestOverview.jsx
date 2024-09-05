// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import DataTable from "react-data-table-component";
// import Swal from "sweetalert2";
// import { FaEdit, FaUserPlus } from "react-icons/fa";
// import { BsFillEyeFill } from "react-icons/bs";
// import { MdDelete } from "react-icons/md";

// const OrderRequestOverview = () => {
//   const [search, setSearch] = useState("");
//   const [data, setData] = useState([]);
//   const [filterdata, setFilterData] = useState([]);

//   function getData() {
//     axios.get(baseUrl+"allorderrequest").then((res) => {
//       setData(res.data);
//       setFilterData(res.data);
//       console.log(res.data);
//     });
//   }
//   useEffect(() => {
//     getData();
//   }, []);

//   function handleDelete(user_id) {
//     const swalWithBootstrapButtons = Swal.mixin({
//       customClass: {
//         confirmButton: "btn btn-success",
//         cancelButton: "btn btn-danger",
//       },
//       buttonsStyling: false,
//     });

//     swalWithBootstrapButtons
//       .fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "No, cancel!",
//         reverseButtons: true,
//       })
//       .then((result) => {
//         if (result.isConfirmed) {
//           swalWithBootstrapButtons.fire(
//             "Deleted!",
//             "Your file has been deleted.",
//             "success"
//           );
//           axios
//             .delete(`${baseUrl}`+`userdelete/${user_id}`)
//             .then(() => {
//               getData();
//             });
//         } else if (
//           /* Read more about handling dismissals below */
//           result.dismiss === Swal.DismissReason.cancel
//         ) {
//           swalWithBootstrapButtons.fire(
//             "Cancelled",
//             "Your imaginary file is safe :)"
//             // "error"
//           );
//         }
//       });
//   }

//   useEffect(() => {
//     const result = data.filter((d) => {
//       return d.user_name.toLowerCase().match(search.toLowerCase());
//     });
//     setFilterData(result);
//   }, [search]);

//   const columns = [
//     {
//       name: "S.No",
//       // selector: (row) => row.user_id,
//       cell: (row, index) => <div>{index + 1}</div>,
//       width: "9%",
//       sortable: true,
//     },
//     {
//       name: "User Name",
//       selector: (row) => row.user_name,
//       sortable: true,
//     },
//     {
//       name: "Login ID",
//       selector: (row) => row.user_login_id,
//       sortable: true,
//     },
//     {
//       name: "Contact No",
//       selector: (row) => row.user_contact_no,
//     },
//     {
//       name: "Email",
//       selector: (row) => row.user_email_id,
//     },

//     {
//       name: "Action",
//       cell: (row) => (
//         <>
//           <Link to="/admin/user-update">
//             <button
//               title="Edit"
//               className="btn btn-outline-primary btn-sm user-button"
//               onClick={() =>
//                 setToLocalStorage(
//                   row.user_id,
//                   row.user_name,
//                   row.role_id,
//                   row.user_email_id,
//                   row.user_contact_no,
//                   row.user_login_id,
//                   row.user_login_password,

//                   row.dept_id
//                 )
//               }
//             >
//               <FaEdit />{" "}
//             </button>
//           </Link>
//           <Link to="/admin/user_view">
//             <button
//               title="View"
//               className="btn btn-outline-success btn-sml"
//               onClick={() =>
//                 setToLocalStorage(
//                   row.user_id,
//                   row.user_name,
//                   row.Role_name,
//                   row.user_email_id,
//                   row.user_contact_no,
//                   row.user_login_id,
//                   row.user_login_password,

//                   row.department_name
//                 )
//               }
//             >
//               <BsFillEyeFill />{" "}
//             </button>
//           </Link>
//           <button
//             title="Delete"
//             className="btn btn-outline-danger btn-sml user-button"
//             onClick={() => handleDelete(row.user_id)}
//           >
//             <MdDelete />
//           </button>
//         </>
//       ),
//       allowOverflow: true,
//       width: "22%",
//     },
//   ];

//   const setToLocalStorage = (
//     user_id,
//     user_name,
//     role_id,
//     user_email_id,
//     user_contact_no,
//     user_login_id,
//     user_login_password,
//     dept_id
//   ) => {
//     localStorage.setItem("user_id", user_id);
//     localStorage.setItem("user_name", user_name);

//     localStorage.setItem("role_id", role_id);
//     localStorage.setItem("Role_name", role_id);
//     localStorage.setItem("user_email_id", user_email_id);
//     localStorage.setItem("user_contact_no", user_contact_no);
//     localStorage.setItem("user_login_id", user_login_id);
//     localStorage.setItem("user_login_password", user_login_password);

//     localStorage.setItem("dept_id", dept_id);

//     localStorage.setItem("department_name", dept_id);
//   };
//   return (
//     <>
//       <div
//         className="form-heading d-flex"
//         style={{ justifyContent: "space-between" }}
//       >
//         <span> Order Request Overview</span>
//         <Link to="/user/orderRequest">
//           <button
//             title="Add User"
//             className="btn btn-success"
//             style={{
//               marginRight: "20px",
//               marginTop: "-7px",
//               display: "flex",
//               padding: "8px 18px",
//               background: "#5f45ff",
//             }}
//           >
//             <FaUserPlus />
//           </button>
//         </Link>
//       </div>

//       <div
//         className="container-fluid table-responsive"
//       >
//         <DataTable
//           columns={columns}
//           data={filterdata}
//           fixedHeader
//           // pagination
//           fixedHeaderScrollHeight="64vh"
//           highlightOnHover
//           subHeader
//           subHeaderComponent={
//             <input
//               type="text"
//               placeholder="Search Here"
//               className="w-25 form-control "
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           }
//         />
//       </div>
//     </>
//   );
// };
// export default OrderRequestOverview;
