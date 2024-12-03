import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'
import { useAPIGlobalContext } from "../APIContext/APIContext";

const SittingOverview = () => {
  const {id} = useParams()
  const {userContextData} = useAPIGlobalContext ()
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  useEffect(() => {
    axios
      .get(`${baseUrl}get_total_sitting_by_room/${id}`)
      .then((res) => {
        setFilterData(res.data.room)
        console.log(res.data.room , 'sitting')
      })
      .catch((error) => console.error("Error fetching room details:", error));
  }, [id]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Sitting Ref No.",
      selector: (row) => row.sitting_ref_no,
      sortable: true,
    },
    {
      name: "Sitting Area",
      selector: (row) => row.sitting_area,
      sortable: true,
    },
    {
      name: "User Name",
      cell: (row) => userContextData?.find((user) => user.user_id === row.user_id)
      ?.user_name || "Not Alloted",
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remarks,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[7] &&
            contextData[7].update_value === 1 && (
              <Link to={`/admin/sitting-update/${row.sitting_id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                >
                  <FaEdit />{" "}
                </button>
              </Link>
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];
  return (
    <>
      <FormContainer
        mainTitle="Sitting"
        link="/"
      />
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Sitting Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
    </>
  );
};
export default SittingOverview;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Navigate } from "react-router-dom";
// import FormContainer from "../FormContainer";
// import FieldContainer from "../FieldContainer";
// import { useGlobalContext } from "../../../Context/Context";
// import jwtDecode from "jwt-decode";
// import { baseUrl } from "../../../utils/config";

// const SittingMaster = () => {
//   const { toastAlert } = useGlobalContext();
//   const [sittingRefrenceNum, setSittingRefNum] = useState("");
//   const [sittingArea, setSittingArea] = useState("");
//   const [roomId, setRoomId] = useState("");
//   const [remark, setRemark] = useState("");
//   const [error, setError] = useState("");
//   const [roomData, getRoomData] = useState([]);
//   const [isFormSubmitted, setIsFormSubmited] = useState(false);

//   const token = sessionStorage.getItem("token");
//   const decodedToken = jwtDecode(token);
//   const loginUserID = decodedToken.id;
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError("");
//     axios
//       .post(baseUrl + "add_sitting", {
//         sitting_ref_no: sittingRefrenceNum,
//         room_id: Number(roomId),
//         sitting_area: sittingArea,
//         remarks: remark,
//         created_by: loginUserID,
//       })
//       .then(() => {
//         setSittingRefNum("");
//         setSittingArea("");
//         setRemark("");

//         toastAlert("Form Submitted Success");
//         setIsFormSubmited(true);
//       })
//       .catch((error) => {
//         alert(error.response.data.message);
//       });
//   };
//   useEffect(() => {
//     axios
//       .get(baseUrl + "get_all_rooms")
//       .then((res) => {
//         getRoomData(res.data.data);
//       })
//       .catch((error) => {
//         console.log(error, "error hai yha");
//       });
//   }, []);
//   if (isFormSubmitted) {
//     return <Navigate to="/admin/sitting-overview" />;
//   }
//   return (
//     <>
//       <FormContainer
//         mainTitle="Sitting"
//         title="Sitting Registration"
//         handleSubmit={handleSubmit}
//       >
//         <FieldContainer
//           label="Sitting Number"
//           placeholder="IT-1"
//           value={sittingRefrenceNum}
//           onChange={(e) => setSittingRefNum(e.target.value)}
//         />
//         <FieldContainer
//           label="Sitting Area"
//           Tag="select"
//           value={roomId}
//           onChange={(e) => {
//             const selectedRoomOption = e.target.value;
//             setRoomId(selectedRoomOption);
//             const selectedRoomNo = roomData.find(
//               (option) => option.room_id === Number(selectedRoomOption)
//             );
//             setSittingArea(selectedRoomNo ? selectedRoomNo.sitting_ref_no : "");
//           }}
//         >
//           <option value="">choose...</option>
//           {roomData.map((d) => (
//             <option value={d.room_id} key={d.room_id}>
//               {d.sitting_ref_no}
//             </option>
//           ))}
//         </FieldContainer>

//         <FieldContainer
//           label="Remark"
//           Tag="textarea"
//           rows="3"
//           required={false}
//           value={remark}
//           onChange={(e) => setRemark(e.target.value)}
//         />

//         {error && <p style={{ color: "red" }}>{error}</p>}
//       </FormContainer>
//     </>
//   );
// };

// export default SittingMaster;
