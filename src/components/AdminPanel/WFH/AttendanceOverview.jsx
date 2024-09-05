import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DeleteButton from "../DeleteButton";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const AttendanceOverview = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
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

  function getData() {
    axios
      .get(baseUrl+"all_attendence_mast_data")
      .then((res) => {
        setData(res.data);
        setFilterData(res.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.user_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Department Name",
      selector: (row) => row.dept_name,
      sortable: true,
    },

    {
      name: "No.of Absent",
      selector: (row) => row.noOfabsent,
      sortable: true,
    },

    {
      name: "Remarks",
      selector: (row) => row.remark,
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          {/* {contextData &&
            contextData[10] &&
            contextData[10].update_value === 1 && (
              <Link to={`/admin/designation-update/${row.desi_id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                >
                  <FaEdit />{" "}
                </button>
              </Link>
            )} */}

          {contextData &&
            contextData[10] &&
            contextData[10].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="attendencemastdelete"
                id={row.attendence_id}
                getData={getData}
              />
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
        mainTitle="Attendance"
        link="/admin/attendence-mast"
        buttonAccess={
          contextData &&
          contextData[10] &&
          contextData[10].insert_value === 1 &&
          true
        }
      />
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Attendance overview"
              columns={columns}
              data={filterdata}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceOverview;
