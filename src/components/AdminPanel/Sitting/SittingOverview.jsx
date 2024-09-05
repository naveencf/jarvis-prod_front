import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

const SittingOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [userData, getUsersData] = useState([]);
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
  function getData() {
    axios.get(baseUrl+"get_all_sittings").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }
  useEffect(() => {
    getData();
    axios.get(baseUrl+"get_all_users").then((res) => {
      getUsersData(res.data.data);
    });
  }, []);
  useEffect(() => {
    const result = datas.filter((d) => {
      const user = userData.find((user) => user.sitting_id === d.sitting_id);
      const userName = user ? user.user_name.toLowerCase() : "";
      return (
        d.sitting_area.toLowerCase().includes(search.toLowerCase()) ||
        d.sitting_ref_no.toLowerCase().includes(search.toLowerCase()) ||
        userName.includes(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search, datas, userData]);
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
      name: "UserName",
      selector: (row) => {
        const user = userData.find(
          (user) => user.sitting_id === row.sitting_id
        );
        return <div>{user ? user.user_name : "N/A"}</div>;
      },
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[7] &&
            contextData[7].update_value === 1 && (
              <Link to="/admin/sitting-update">
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                  onClick={() =>
                    setToLocalStorage(
                      row.sitting_id,
                      row.sitting_ref_no,
                      row.sitting_area,
                      row.remarks,
                      row.creation_date,
                      row.created_by,
                      row.last_updated_by,
                      row.last_updated_date,
                      row.room_id
                    )
                  }
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
  const setToLocalStorage = (
    sitting_id,
    sitting_ref_no,
    sitting_area,
    remarks,
    creation_date,
    created_by,
    room_id,
    last_updated_by,
    last_updated_date
  ) => {
    localStorage.setItem("sitting_id", sitting_id);
    localStorage.setItem("sitting_ref_no", sitting_ref_no);
    localStorage.setItem("sitting_area", sitting_area);
    localStorage.setItem("remarks", remarks);
    localStorage.setItem("creation_date", creation_date);
    localStorage.setItem("created_by", created_by);
    localStorage.setItem("last_updated_by", last_updated_by);
    localStorage.setItem("last_updated_date", last_updated_date);
    localStorage.setItem("room_id", room_id);
  };
  return (
    <>
      <FormContainer
        mainTitle="Sitting"
        link="/admin/sitting-master"
        buttonAccess={
          contextData &&
          contextData[7] &&
          contextData[7].insert_value === 1 &&
          true
        }
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
