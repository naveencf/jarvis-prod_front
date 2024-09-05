import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import Modal from "react-modal";
import Select from "react-select";
import { baseUrl } from '../../../utils/config'

export const SelfAudit = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const [ImageModalOpen, setImageModalOpen] = useState(false);
  const [type, setType] = useState("");
  const [sim_id, setSimId] = useState("");
  const [uploaded_by, setUploaded_by] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  //   const [showAssetsImage , setShowAssetImages] = useState([])
  const typeData = ["Hr", "User"];

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("img1", image1);
    formData.append("img2", image2);
    formData.append("img3", image3);
    formData.append("img4", image4);
    formData.append("sim_id", sim_id);
    formData.append("uploaded_by", userID);
    formData.append("type", type);
    await axios.post(
      baseUrl + "add_assets_images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setImageModalOpen(false);
  };
  //

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split("T")[0]; // Extracts the YYYY-MM-DD part
    return formattedDate;
  };

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}` + `get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);
  const handleImageClick = (row) => {
    setSimId(row.sim_id);
    setImageModalOpen(true);
  };
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };
  function getData() {
    axios.get(baseUrl + "get_all_sims").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return (
        d.assetsName?.toLowerCase().match(search.toLowerCase()) ||
        d.sub_category_name?.toLowerCase().match(search.toLowerCase()) ||
        d.category_name?.toLowerCase().match(search.toLowerCase()) ||
        d.vendor_name?.toLowerCase().match(search.toLowerCase())
      );
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
      name: "Asset Name",
      selector: (row) => row.assetsName,
      sortable: true,
    },
    {
      name: "Sub Category Name",
      selector: (row) => row.sub_category_name,
    },
    {
      name: "Category Name",
      selector: (row) => row.category_name,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_name,
    },
    {
      name: "Date of Purchase",
      selector: (row) =>
        row.dateOfPurchase ? formatDate(row.dateOfPurchase) : "",
    },
    {
      name: "Action",
      selector: (row) => (
        <button
          className="btn cmnbtn btn_sm btn-outline-success"
          onClick={() => handleImageClick(row)}
        >
          Verify
        </button>
      ),
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="Self Audit Overview"
        link="/admin/object-master"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          false
        }
      />

      <div className="card">
        <div className="card-header sb">
          Self Audit
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body thm_table">
          < DataTable
            // title="Self Audit"
            columns={columns}
            data={filterData}
            // fixedHeader
            pagination
            selectableRows
          // fixedHeaderScrollHeight="64vh"
          // highlightOnHover
          // subHeader

          />
        </div>
        {/* <div className="data_tbl table-responsive">
          <DataTable
            // title="Self Audit"
            columns={columns}
            data={filterData}
            fixedHeader
            pagination
            // fixedHeaderScrollHeight="64vh"
            // highlightOnHover
            // subHeader
            
          /> */}
        {/* </div> */}
      </div>
      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
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
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Assets Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 ">
            <form onSubmit={handleSubmit}>
              <div className="form-group col-12">
                <label className="form-label">
                  Type <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  className=""
                  options={typeData.map((option) => ({
                    value: `${option}`,
                    label: `${option}`,
                  }))}
                  value={{
                    value: type,
                    label: `${type}`,
                  }}
                  onChange={(e) => {
                    setType(e.value);
                  }}
                  required
                />
              </div>

              {/* images */}
              <div className="form-group">
                <label htmlFor="images">Image First</label>
                <input
                  type="file"
                  className="form-control"
                  id="images"
                  name="images"
                  onChange={(e) => {
                    setImage1(e.target.files[0]);
                  }}
                  accept="image/*"
                  required
                />
              </div>

              {/* images */}
              <div className="form-group">
                <label htmlFor="images">Image Secound</label>
                <input
                  type="file"
                  className="form-control"
                  id="images"
                  name="images"
                  onChange={(e) => {
                    setImage2(e.target.files[0]);
                  }}
                  accept="image/*"
                />
              </div>

              {/* images */}
              <div className="form-group">
                <label htmlFor="images">Image Third</label>
                <input
                  type="file"
                  className="form-control"
                  id="images"
                  name="images"
                  onChange={(e) => {
                    setImage3(e.target.files[0]);
                  }}
                  accept="image/*"
                />
              </div>

              {/* images */}
              <div className="form-group">
                <label htmlFor="images">Image Four</label>
                <input
                  type="file"
                  className="form-control"
                  id="images"
                  name="images"
                  onChange={(e) => {
                    setImage4(e.target.files[0]);
                  }}
                  accept="image/*"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
