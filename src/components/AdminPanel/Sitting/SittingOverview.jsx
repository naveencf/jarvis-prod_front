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
