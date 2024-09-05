import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { data } from "jquery";

const PageCategory = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  // const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [categoryUpdate, setCategoryUpdate] = useState("");
  const [descriptionUpdate, setDescriptionUpdate] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const getData = () => {
    axios.get(baseUrl + "getPageCatgList") 
      .then((res) => {
        setCategories(res.data.data);
        setFilterData(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = categories.filter((d) => {
      return d.page_category?.toLowerCase().match(search.toLowerCase()); 
    });
    setFilterData(result);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
       axios.post(baseUrl + "addPageCatg", {
        page_category: categoryName,
        description: description,
        created_by: userID
      })
      .then(() => {
      toastAlert("Submitted");
      setCategoryName("");
      setDescription("");
      getData(); 
    });   
  };

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Page Category Name",
      selector: (row) => row.page_category, 
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Created By",
      selector: (row) => row.created_by_name,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleRowData(row)}
            data-toggle="modal" data-target="#myModal"
          >
            <FaEdit />{" "}
          </button>
          <DeleteButton
            endpoint="deletePage" 
            id={row._id}
            getData={getData}
          />
        </>
      ),
    },
  ];

  const handleRowData = (row) => {
    setRowData(row);
    setCategoryUpdate(row.page_category); 
    setDescriptionUpdate(row.description);
  };

  const handleModalUpdate = () => {
    if (categoryUpdate === "") {
      toastError("Please Fill  Category Name ");
      return;
    }
    axios.put(baseUrl + `updatePageCatg/${rowData._id}`, { 
      page_category: categoryUpdate, 
      description: descriptionUpdate,
      updated_by: userID
    })
    .then(() => {
      toastAlert("Successfully Update");
      getData();
      setCategoryUpdate("");
      setDescriptionUpdate("");
    });
  };

  return (
    <>
      <FormContainer
        mainTitle="Page Category" 
        title="Category" 
        handleSubmit={handleSubmit}
      >
{/* {
  data.map((item) => {
    <span>{

  }</span>
} */}

        <FieldContainer
          label="Category Name *" 
          value={categoryName}
          required={true}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        
        <FieldContainer
          label="Description"
          value={description}
          required={false}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormContainer>


      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Page Category Overview" 
            columns={columns}
            data={filterData}
            fixedHeader
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search Here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>

      <div id="myModal" className="modal fade" role="dialog">
        <div className="modal-dialog">

          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Update</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
            </div>
            <div className="modal-body">
              <FieldContainer
                label="Category *"
                value={categoryUpdate}
                required={true}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />

              <FieldContainer
                label="Description"
                value={descriptionUpdate}
                onChange={(e) => setDescriptionUpdate(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" 
                className="btn btn-primary" 
                data-dismiss="modal"
              >Close</button>
              <button type="button" 
                className="btn btn-success" 
                onClick={handleModalUpdate}
                data-dismiss={`${categoryUpdate === "" ?"": 'modal'}`}
              >Update</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PageCategory;
