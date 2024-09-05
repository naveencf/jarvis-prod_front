import React from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FieldContainer from "../../AdminPanel/FieldContainer";
import FormContainer from "../../AdminPanel/FormContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const DataSubCategory = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [categoryData, setCategoryData] = useState([]);
  const [subCatName, setSubCatName] = useState("");
  const [modalData, setModalData] = useState([]);
  const [modalFilter, setModalFilter] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameUpdate, setCategoryNameUpdate] = useState("");
  const [search, setSearch] = useState("");

  const [modalId, setModalId] = useState(0);
  const [subCatNameUpdate, setSubCatNameUpdate] = useState("");
  //Asset Count Modal

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_data_categorys")
      .then((res) => {
        setCategoryData(res.data.simcWithSubCategoryCount);
      });
  }, []);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Sub Cat Name",
      selector: (row) => row.data_sub_cat_name,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.cat_id?.category_name,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#exampleModal"
            size="small"
            variant="contained"
            color="primary"
            onClick={() => handleBrandData(row)}
          >
            <FaEdit />
          </button>
          <DeleteButton
            endpoint="delete_data_sub_category"
            id={row._id}
            getData={getModalData}
          />
        </>
      ),
    },
  ];

  const handleSubmit = async (e) => {
    if (categoryName == "") {
      toastError("Category is required");
    }
    e.preventDefault();
    try {
      const subCategoryExists = modalData.some(
        (d) =>
          d.data_sub_cat_name.toLowerCase() === subCatName.toLowerCase() &&
          d.cat_id._id === categoryName
      );
      if (subCategoryExists) {
        alert(
          "Subcategory with the same name exists in the selected category."
        );
      } else {
        const response = await axios.post(
          baseUrl+"add_data_sub_category",
          {
            data_sub_cat_name: subCatName,
            cat_id: categoryName,
          }
        );
        toastAlert("Successfully Add");
        setSubCatName("");
        setCategoryName("");
        getModalData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getModalData() {
    const res = await axios.get(
      baseUrl+"get_all_data_Sub_categories"
    );
    setModalData(res.data);
    setModalFilter(res.data);
  }

  useEffect(() => {
    getModalData();
  }, []);

  const handleBrandData = (row) => {
    setModalId(row._id);
    setSubCatNameUpdate(row.data_sub_cat_name);
    setCategoryNameUpdate(row.cat_id._id);
  };
  const handleModalUpdate = () => {
    axios
      .put(baseUrl+"update_data_sub_category", {
        _id: modalId,
        cat_id: categoryNameUpdate,
        data_sub_cat_name: subCatNameUpdate,
      })
      .then((res) => {
        toastAlert("Successfully Update");
        getModalData();
      });
  };

  useEffect(() => {
    const result = modalData.filter((d) => {
      return d.data_sub_cat_name
        ?.toLowerCase()
        .match(search.toLocaleLowerCase());
    });
    setModalFilter(result);
  }, [search]);

  return (
    <div>
      <div style={{ width: "80%", margin: "0 0 0 10%" }}>
        <UserNav />

        <FormContainer
          mainTitle="Data Sub Category"
          title="sub-category"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Sub Cat Name"
            value={subCatName}
            onChange={(e) => setSubCatName(e.target.value)}
          />
          <div className="form-group col-6">
            <label className="form-label">
              Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={categoryData.map((opt) => ({
                value: opt._id,
                label: opt.category_name,
              }))}
              value={{
                value: categoryName,
                label:
                  categoryData.find((user) => user._id === categoryName)
                    ?.category_name || "",
              }}
              onChange={(e) => {
                setCategoryName(e.value);
              }}
              required
            />
          </div>
        </FormContainer>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Modal Overview"
              columns={columns}
              data={modalFilter}
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
                label="Sub Cat Name"
                fieldGrid={12}
                value={subCatNameUpdate}
                onChange={(e) => setSubCatNameUpdate(e.target.value)}
              ></FieldContainer>
              <div className="form-group col-12">
                <label className="form-label">
                  Category Name <sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  options={categoryData.map((opt) => ({
                    value: opt._id,
                    label: opt.category_name,
                  }))}
                  value={{
                    value: categoryNameUpdate,
                    label:
                      categoryData.find(
                        (user) => user._id === categoryNameUpdate
                      )?.category_name || "",
                  }}
                  onChange={(e) => {
                    setCategoryNameUpdate(e.value);
                  }}
                  required
                />
              </div>
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

export default DataSubCategory;
