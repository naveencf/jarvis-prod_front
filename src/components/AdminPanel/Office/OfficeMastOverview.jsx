import React, { useEffect, useState } from "react";
import Viewer from "../Sitting/Viewer";
import SittingOverview from "../Sitting/SittingOverview";
import axios from "axios";
import { baseUrl } from "../../../utils/config";

const OfficeMastOverview = () => {
  const [roomWiseCount, setRoomWiseCount] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const [totalSittingCount , setTotalSittingCount] = useState([])


  const fetchAllocationCounts = async () => {
    try {
      const response = await axios.get(`${baseUrl}get_allocation_counts`);
      const dataWithDefaults = response.data.map((d) => ({
        ...d,
        counts: {
          allocated: d.counts?.allocated || 0, 
          not_allocated: d.counts?.not_allocated || 0, 
        },
      }));
      setRoomWiseCount(dataWithDefaults);
      console.log("Allocation Counts:", dataWithDefaults);
    } catch (error) {
      console.error("Error fetching allocation counts:", error);
    }
  };
  const totalSittingDataCount = async ()=>{
    try{
      const res = await axios.get(`${baseUrl}get_total_counts`);
      setTotalSittingCount(res.data)
      console.log(res.data , 'total count')
    }
    catch{

    }
  }

  useEffect(() => {
    totalSittingDataCount()
    fetchAllocationCounts();
  }, []);

  const handleCardClick = (roomName) => {
    setSelectedRoomName(roomName); // Update state with the clicked roomName
  };

  return (
    <>
    {/* <SittingOverview/> */}
      <div className="scrollRow">
        <div className="row">
        <div className="col-md-3 col-sm-6 col-12">
              <div class="timeDataCard card ">
                <div class="card-header">
                  <div class="titleCard w-100">
                    <div class="titleCardImg bgPrimary border-0 ">
                      <i class="bi bi-pc-display-horizontal"></i>
                    </div>
                    <div class="titleCardText w-75">
                      <h2 class="colorPrimary">All Rooms</h2>
                      <h3>
                        Total Seats: {totalSittingCount?.total}
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="timeDataCardInfo">
                    <ul>
                      <li>
                        <span>Total Assigned</span>
                        <div class="growthBadge growthSuccess">
                          {totalSittingCount?.allocated}
                        </div>
                      </li>
                      <li>
                        <span>Total Not Assigned</span>
                        <div class="growthBadge growthWarning">
                          {totalSittingCount?.not_allocated}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          {roomWiseCount?.map((d, index) => (
            <div className="col-md-3 col-sm-6 col-12" key={index}>
              <div class="timeDataCard card " onClick={() => handleCardClick(d.roomName)}>
                <div class="card-header">
                  <div class="titleCard w-100">
                    <div class="titleCardImg bgPrimary border-0 ">
                      <i class="bi bi-pc-display-horizontal"></i>
                    </div>
                    <div class="titleCardText w-75">
                      <h2 class="colorPrimary">{d.roomName}</h2>
                      <h3>
                        Total Seats: {d.counts.allocated + d.counts.not_allocated}
                      </h3>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="timeDataCardInfo">
                    <ul>
                      <li>
                        <span>Assigned</span>
                        <div class="growthBadge growthSuccess">
                          {d.counts.allocated}
                        </div>
                      </li>
                      <li>
                        <span>Not Assigned</span>
                        <div class="growthBadge growthWarning">
                          {d.counts.not_allocated}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    <Viewer roomNameCard={selectedRoomName} totalSittingDataCount={totalSittingDataCount} fetchAllocationCounts={fetchAllocationCounts}/>
    </>
  );
};

export default OfficeMastOverview;

// import axios from "axios";
// import { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { Link } from "react-router-dom";
// import { FaEdit } from "react-icons/fa";
// import FormContainer from "../FormContainer";
// import DeleteButton from "../DeleteButton";
// import jwtDecode from "jwt-decode";
// import { baseUrl } from "../../../utils/config";

// const OfficeMastOverview = () => {
//   const [search, setSearch] = useState("");
//   const [datas, setData] = useState([]);
//   const [filterdata, setFilterData] = useState([]);
//   const [contextData, setDatas] = useState([]);
//   const [allotmentDataCount , setAllotmentDataCount] = useState([])

//   const storedToken = sessionStorage.getItem("token");
//   const decodedToken = jwtDecode(storedToken);
//   const userID = decodedToken.id;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${baseUrl}get_sitting_with_user_id`);
//         console.log(response.data.data, "data is here");
//         setAllotmentDataCount(response.data.data)
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (userID && contextData.length === 0) {
//       axios
//         .get(
//           `${baseUrl}` + `get_single_user_auth_detail/${userID}`
//         )
//         .then((res) => {
//           setDatas(res.data);
//         });
//     }
//   }, [userID]);

//   async function getData() {
//     try {
//       const res = await axios.get(
//         baseUrl + "get_all_rooms"
//       );
//       setData(res.data.data);
//       setFilterData(res.data.data);
//     } catch (error) {
//       console.error("An error occurred while fetching data", error);
//     }
//   }

//   const columns = [
//     {
//       name: "S.No",
//       cell: (row, index) => <div>{index + 1}</div>,
//       width: "10%",
//       sortable: true,
//     },
//     {
//       name: "Room No",
//       selector: (row) => row.sitting_ref_no,
//       width: "20%",
//       sortable: true,
//     },
//     {
//       name: "Room Image",
//       selector: (row) => (
//         <img
//           style={{ height: "80px" }}
//           src={row.room_image_url}
//           alt="Room Image"
//         />
//       ),
//       width: "20%",
//       sortable: true,
//     },
//     {
//       name: "Sittings",
//       cell: (row) => (
//         <Link to={`/admin/sitting-overview/${row.room_id}`}>
//                 <button
//                   className="btn cmnbtn btn_sm btn-outline-primary"
//                   variant="outline"
//                   size="small"
//                 >
//                  {row.total_no_seats}
//                 </button>
//               </Link>
//       ),
//     },
//     {
//       name: "remark",
//       selector: (row) => row.remarks,
//     },
//     {
//       name: "Action",
//       width: "15%",
//       cell: (row) => (
//         <>
//           {contextData &&
//             contextData[6] &&
//             contextData[6].update_value === 1 && (
//               <Link to={`/admin/office-mast-update/${row.room_id}`}>
//                 <div
//                   title="Edit"
//                   className="icon"
//                 >
//                   <i className="bi bi-pencil"></i>
//                 </div>
//               </Link>
//             )}
//           {contextData &&
//             contextData[6] &&
//             contextData[6].delete_flag_value === 1 && (
//               <DeleteButton
//                 endpoint="delete_room"
//                 id={row.room_id}
//                 getData={getData}
//               />
//             )}
//         </>
//       ),
//     },
//   ];

//   useEffect(() => {
//     getData();
//   }, []);

//   useEffect(() => {
//     const result = datas.filter((d) => {
//       return d.sitting_ref_no.toLowerCase().match(search.toLowerCase());
//     });
//     setFilterData(result);
//   }, [search]);

//   return (
//     <>

//       <FormContainer
//         mainTitle="Office"
//         link="/admin/office-mast"
//         buttonAccess={
//           contextData && contextData[6] && contextData[6].insert_value === 1
//         }
//       />
//       {allotmentDataCount.map((d)=>(
//         <>
//         <div className="d-flex">
//         <h4>Room Name: {d.room_id}</h4>
//         <h4>Alloted: {d.allocated}</h4>
//         <h4>Non Alloted: {d.non_allocated}</h4>
//         </div>
//         </>
//         ))}

//       <div className="card">
//         <div className="card-header sb">
//           <h5>Office Overview</h5>
//           <input
//             type="text"
//             placeholder="Search here"
//             className="w-25 form-control"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <div className="card-body">

//           <DataTable

//             columns={columns}
//             data={filterdata}
//             // fixedHeader
//             pagination

//           // selectableRows
//           />
//         </div>
//         {/* <div className="data_tbl table-responsive">
//         </div> */}
//       </div>
//     </>
//   );
// };

// export default OfficeMastOverview;
