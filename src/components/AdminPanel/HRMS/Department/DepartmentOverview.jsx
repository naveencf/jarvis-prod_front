import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";
import { baseUrl } from "../../../../utils/config";
import DeleteButton from "../../DeleteButton";
import FormContainer from "../../FormContainer";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const DepartmentOverview = () => {
  const { userContextData } = useAPIGlobalContext();
  const [search, setSearch] = useState("");
  const [modalSearch, setModalSearch] = useState("");

  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  // const [allUserDepartment, setAllUserDepartment] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
        .then((res) => {
          setDatas(res.data);
        });
    }
    // axios.get(baseUrl + "get_all_users").then((res) => {
    //   setAllUserDepartment(res.data.data);
    // });
  }, [userID]);

  function getData() {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setData(res.data);
      setFilterData(res.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.dept_name.toLowerCase().match(search.toLowerCase());
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
      name: "Department Name",
      width: "22%",
      selector: (row) => row.dept_name,
      sortable: true,
    },
    {
      name: "Major Department Name",
      width: "20%",
      selector: (row) => row.major_dept_name,
      sortable: true,
    },
    {
      name: "Dept Count",
      width: "12%",
      cell: (row) => {
        const count = userContextData.filter(
          (data) => data.department_name === row.dept_name
        ).length;
        return (
          <button
            className="btn btn-outline-warning btn-sm user-button"
            onClick={() => handleRowClick(row)}
          >
            {count}
          </button>
        );
      },
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.Remarks,
    },
    {
      name: "Auth",
      cell: (row) => (
        <Link to={`/admin/desi-dept-auth/${row.dept_id}`}>
          <button className="w-100 btn btn-outline-success btn-sm user-button">
            Auth
          </button>
        </Link>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[3] &&
            contextData[3].update_value === 1 && (
              <Link to="/admin/department-update">
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button icon-1"
                  onClick={() =>
                    setToLocalStorage(
                      row.dept_id,
                      row.dept_name,
                      row.m_dept_id,
                      row.short_name,
                      row.Remarks,
                      row.Creation_date,
                      row.created_by,
                      row.created_by_name,
                      row.Last_updated_by,
                      row.Last_updated_date
                    )
                  }
                >
                  <i className="bi bi-pencil" />{" "}
                </button>
              </Link>
            )}
          {contextData &&
            contextData[3] &&
            contextData[3].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_department"
                id={row.dept_id}
                getData={getData}
              />
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  const setToLocalStorage = (
    dept_id,
    dept_name,
    m_dept_id,
    short_name,
    Remarks,
    Creation_date,
    created_by,
    Last_updated_by,
    Last_updated_date,
    created_by_name
  ) => {
    localStorage.setItem("dept_id", dept_id);
    localStorage.setItem("dept_name", dept_name);
    localStorage.setItem("m_dept_id", m_dept_id);
    localStorage.setItem("short_name", short_name);
    localStorage.setItem("Remarks", Remarks);
    localStorage.setItem("Creation_date", Creation_date);
    localStorage.setItem("Created_by", created_by);
    localStorage.setItem("created_by_name", created_by_name);
    localStorage.setItem("Last_updated_by", Last_updated_by);
    localStorage.setItem("Last_updated_date", Last_updated_date);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);

    const filteredData = userContextData.filter(
      (data) => data.department_name === row.dept_name
    );
    setSelectedUserData(filteredData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <FormContainer
        mainTitle="Department"
        link="/admin/department-master"
        buttonAccess={
          contextData &&
          contextData[3] &&
          contextData[3].insert_value === 1 &&
          "true"
        }
      />

      <div className="d-flex">
        <Link to="/admin/sub-department-overview">
          <button
            onClick={() => getData()}
            type="button"
            className="btn btn_sm cmnbtn btn-outline-primary btn-sm mr-2"
          >
            Sub Department
          </button>
        </Link>
        <Link to="/admin/major-department-overview">
          <button
            type="button"
            className="btn btn_sm cmnbtn btn-outline-primary btn-sm mb-4"
          >
            Major Department
          </button>
        </Link>

        <Link to="/admin/designation-overview">
          <button
            type="button"
            className="btn btn_sm cmnbtn btn-outline-primary btn-sm mb-4 ml-2"
          >
            Designation
          </button>
        </Link>
      </div>

      <div className="card">
        <div className="card-header sb">
          <div className="card-title">
            <h4>Department Overview</h4>
          </div>
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body">
          <DataTable
            // title="Department Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            pagination
            paginationPerPage={100}
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {selectedRow && (
          <div>
            <div className="d-flex justify-content-between mb-2">
              <h2>Department: {selectedRow.dept_name}</h2>

              <button
                className="btn btn-success float-left"
                onClick={handleCloseModal}
              >
                X
              </button>
            </div>
            <DataTable
              columns={[
                {
                  name: "S.No",
                  cell: (row, index) => <div>{index + 1}</div>,
                  width: "10%",
                },
                { name: "Name", selector: (row) => row.user_name },
                { name: "Email", selector: (row) => row.user_email_id },
                { name: "Contact", selector: (row) => row.user_contact_no },
              ]}
              data={selectedUserData.filter((user) =>
                user.user_name.toLowerCase().includes(modalSearch.toLowerCase())
              )}
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-50 form-control"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                />
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DepartmentOverview;
