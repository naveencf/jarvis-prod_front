import React from "react";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";
import DeleteButton from "../../DeleteButton";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import UserNav from "../../../Pantry/UserPanel/UserNav";


const CaseStudyplateform = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [platformName, setPlatformName] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [modalId, setModalId] = useState(0);
  const [platformNameUpdate, setPlatformNameUpdate] = useState("");
  //Asset Count Modal

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },

    {
      name: "Platform Name",
      selector: (row) => row.platform_name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="icon-1"
            data-toggle="modal"
            data-target="#exampleModal"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleBrandData(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <DeleteButton
            endpoint="delete_data_platform"
            id={row._id}
            getData={getModalData}
          />
        </>
      ),
    },
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isModalExists = modalData.some(
        (d) => d.platform_name === platformName
      );
      if (isModalExists) {
        alert("Platform already Exists");
      } else {
        const response = await axios.post(
          baseUrl + "add_data_platform",
          {
            platform_name: platformName,
            remark: "",
          }
        );
        toastAlert("Successfully Add");
        setPlatformName("");
        getModalData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  async function getModalData() {
    const res = await axios.get(
      baseUrl + "get_all_data_platforms"
    );
    setModalData(res.data);
    setModalFilter(res.data);
  }

  useEffect(() => {
    getModalData();
  }, []);

  const handleBrandData = (row) => {
    setModalId(row._id);
    setPlatformNameUpdate(row.platform_name);
  };
  const handleModalUpdate = () => {
    axios
      .put(baseUrl + "update_data_platform", {
        _id: modalId,
        platform_name: platformNameUpdate,
      })
      .then((res) => {
        getModalData();
        toastAlert("Successfully Update");
      });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.platform_name?.toLowerCase().match(search.toLocaleLowerCase());
    });
    setModalFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Data Platform"
          title="Platform"
          link="true"
          handleSubmit={false}
        >

        </FormContainer>
        <div className="card body-padding sb flex-row">


          <FieldContainer
            label="Platform Name"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
          <button className="btn cmnbtn btn-outline-primary">Submit</button>

        </div>

        <div className="card">
          <div className="card-header
          sb">
            <h6> Modal Overview</h6>

            <input
              type="text"
              placeholder="Search here"
              className="w-25 form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="data_tbl table-responsive card-body body-padding">
            <DataTable

              columns={columns}
              data={modalFilter}

              pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover

            />
          </div>
        </div>
      </div>
      {/* Update  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal Update
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Platform Name"
                value={platformNameUpdate}
                onChange={(e) => setPlatformNameUpdate(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModalUpdate}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyplateform;
