import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import jwtDecode from "jwt-decode";
import DeleteButton from "../../DeleteButton";
import FormContainer from "../../FormContainer";
import Modal from "react-modal";
import { baseUrl } from "../../../../utils/config";

const ResponsiblityOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [allResponsiblility, setAllResponsibility] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

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
  }, [userID]);

  function getData() {
    axios.get(baseUrl + "get_all_responsibilitys").then((res) => {
      setData(res.data);
      setFilterData(res.data);
    });
  }

  const handleRowClick = (row) => {
    console.log(row);
    setSelectedRow(row);

    const filteredData = allResponsiblility.filter(
      (data) => data.sjob_responsibility === row.respo_name
    );
    setSelectedUserData(filteredData);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    getData();
    axios.get(baseUrl + "get_all_jobresponsibilitys").then((res) => {
      setAllResponsibility(res.data.data);
    });
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.respo_name.toLowerCase().includes(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      // selector: (row) => row.user_id,
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Responsibility",
      selector: (row) => row.respo_name,
      sortable: true,
      width: "15%",
    },
    {
      name: "Assign Responsibility",
      cell: (row) => {
        const count = allResponsiblility.filter(
          (data) => data.sjob_responsibility === row.respo_name
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
      width: "7%",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[16] &&
            contextData[16].update_value === 1 && (
              <Link to={`/admin/responsibility-update/${row.id}`}>
                <button
                  title="Edit"
                  className="icon-1"
                >
                  <i className="bi bi-pencil" />
                </button>
              </Link>
            )}
          {contextData &&
            contextData[16] &&
            contextData[16].delete_flag_value === 1 && (
              <DeleteButton
                endpoint="delete_responsibility"
                id={row.id}
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
    <div>
      {allResponsiblility.map((d) => {
        <h1>{d.user_name}</h1>;
      })}
      <FormContainer
        mainTitle="Resposibility"
        link="/admin/responsibility-master"
        buttonAccess={
          contextData &&
          contextData[16] &&
          contextData[16].insert_value === 1 &&
          true
        }
      />
      <>
        <div className="card">
          <div className="card-header sb">
            <div className="card-title">
              Responsibility Overview
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

              columns={columns}
              data={filterdata}
              fixedHeader
              pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover

            />
          </div>
        </div>
      </>
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
export default ResponsiblityOverview;
