import React, { useEffect, useState } from "react";
import UserNav from "../Pantry/UserPanel/UserNav";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { baseUrl } from "../../utils/config";

export default function Dashboard() {
  const [categoryData, setCategoryData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [designedData, setDesignedData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);

  const callApi = () => {
    axios
      .get(baseUrl + "get_all_data_categorys")
      .then((res) => setCategoryData(res.data.simcWithSubCategoryCount));

    axios
      .get(baseUrl + "get_all_data_brands")
      .then((res) => setBrandData(res.data));

    axios
      .get(baseUrl + "distinct_created_by")
      .then((res) => setEmployeeData(res.data.data));
    axios
      .get(baseUrl + "distinct_designed_by")
      .then((res) => setDesignedData(res.data.data));

    axios
      .get(baseUrl + "get_all_data_platforms")
      .then((res) => setPlatformData(res.data));
    axios

      .get(baseUrl + "get_all_data_content_types")
      .then((res) => setContentData(res.data));
    axios
      .get(baseUrl + "get_all_data_Sub_categories")
      .then((res) => setSubCategoryData(res.data));
  };

  useEffect(() => {
    callApi();
  }, []);

  //   const columns = [
  //     {
  //       field: "sno",
  //       headerName: "S.No",
  //       width: 100,
  //       renderCell: (params) => {
  //         return <strong>{categoryData.indexOf(params.row) + 1}</strong>;
  //       },
  //     },
  //     {
  //       field: "category_name",
  //       headerName: "Category Name",
  //       width: 200,
  //       renderCell: (params) => <strong>{params.row.category_name}</strong>,
  //     },
  //     {
  //       field: "sub_category_count",
  //       headerName: "Sub Category Count",
  //       width: 200,
  //         renderCell: (params) => <Button
  //         variant="outlined"
  //         size="sx"
  //         color = "warning"
  //         >{params.row.sub_category_count}</Button>,
  //     },
  //   ];

  return (
    <div>
      <UserNav />
      <div
        className="row container"
        style={{
          margin: "20px auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Category Card */}
        <div
          className="col-md-5"
          style={{ margin: "15px", flexBasis: "calc(50% - 30px)" }}
        >
          <div
            className="card"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              backgroundColor: "#f8f9fa",
              padding: "20px",
            }}
          >
            <div className="card-body">
              <h5
                className="card-title"
                style={{ fontSize: "1.25rem", color: "#007bff" }}
              >
                Category
              </h5>
              <p className="card-text" style={{ fontSize: "1rem" }}>
                Total Category: {categoryData.length}
              </p>
              <Link
                to="/data-brand-category"
                className="btn btn-primary"
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                View Category
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Card */}
        <div
          className="col-md-5"
          style={{ margin: "15px", flexBasis: "calc(50% - 30px)" }}
        >
          <div
            className="card"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              backgroundColor: "#f8f9fa",
              padding: "20px",
            }}
          >
            <div className="card-body">
              <h5
                className="card-title"
                style={{ fontSize: "1.25rem", color: "#007bff" }}
              >
                Brand
              </h5>
              <p className="card-text" style={{ fontSize: "1rem" }}>
                Total Brand: {brandData.length}
              </p>
              <Link
                to="/data-brand"
                className="btn btn-primary"
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                View Brand
              </Link>
            </div>
          </div>
        </div>

        {/* Sub Category Card */}
        <div
          className="col-md-5"
          style={{ margin: "15px", flexBasis: "calc(50% - 30px)" }}
        >
          <div
            className="card"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              backgroundColor: "#f8f9fa",
              padding: "20px",
            }}
          >
            <div className="card-body">
              <h5
                className="card-title"
                style={{ fontSize: "1.25rem", color: "#007bff" }}
              >
                Sub Category
              </h5>
              <p className="card-text" style={{ fontSize: "1rem" }}>
                Total Sub Category: {subCategoryData.length}
              </p>
              <Link
                to="/data-brand-sub-category"
                className="btn btn-primary"
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                View Sub Category
              </Link>
            </div>
          </div>
        </div>

        {/* Content Type Card */}
        <div
          className="col-md-5"
          style={{ margin: "15px", flexBasis: "calc(50% - 30px)" }}
        >
          <div
            className="card"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              backgroundColor: "#f8f9fa",
              padding: "20px",
            }}
          >
            <div className="card-body">
              <h5
                className="card-title"
                style={{ fontSize: "1.25rem", color: "#007bff" }}
              >
                Content Type
              </h5>
              <p className="card-text" style={{ fontSize: "1rem" }}>
                Total Content Type: {contentData.length}
              </p>
              <Link
                to="/data-content-type"
                className="btn btn-primary"
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                View Content Type
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
