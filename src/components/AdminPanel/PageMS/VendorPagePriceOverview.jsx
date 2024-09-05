import axios from "axios";
import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import DeleteButton from "../DeleteButton";
import { FaEdit } from "react-icons/fa";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

export default function VendorPagePriceOverview() {
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [filterData, setFilterData] = React.useState([]);

  const getData = () => {
    axios.get(baseUrl + "getVendorPagePriceList").then((res) => {
      // console.log(res.data.data, "data");
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return d._id.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "ID",
      selector: (row) => row._id,
    },
    {
      name: "Platform Price",
      selector: (row) => row.platform_price_id,
    },
    {
      name: "Page Master",
      selector: (row) => row.pageMast_id,
    },
    {
      name: "Vendor Master",
      selector: (row) => row.vendorMast_id,
    },
    {
      name: "Price Type",
      selector: (row) => row.price_type_id,
    },
    {
      name: "Price Cal Type",
      selector: (row) => row.price_cal_type,
    },
    {
      name: "Variable Type",
      selector: (row) => row.variable_type,
    },
    {
      name: "Price Fixed",
      selector: (row) => row.price_fixed,
    },
    {
      name: "Price Variable",
      selector: (row) => row.price_variable,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex">
          <Link to={`/admin/pms-vendor-page-price-master/${row._id}`}>
            <button title="Edit" className="btn btn-outline-primary">
              <FaEdit />
            </button>
          </Link>
          <DeleteButton
            id={row._id}
            endpoint="deleteVendorPagePrice"
            cid={row._id}
            getData={getData}
          />
        </div>
      ),
    },
  ];

  const dataGridcolumns = [
    {
      field: "sno",
      headerName: "S.NO",
      renderCell: (params) => <div>{filterData.indexOf(params.row) + 1}</div>,
    },
    {
      field: "_id",
      headerName: "ID",
      width: 200,
    },
    {
      field: "platform_price_id",
      headerName: "Platform Price",
      width: 200,
    },
    {
      field: "pageMast_id",
      headerName: "Page Master",
      width: 200,
    },
    {
      field: "vendorMast_id",
      headerName: "Vendor Master",
      width: 200,
    },
    {
      field: "price_type_id",
      headerName: "Price Type",
      width: 200,
    },
    {
      field: "price_cal_type",
      headerName: "Price Cal Type",
      width: 200,
    },
    {
      field: "variable_type",
      headerName: "Variable Type",
      width: 200,
    },
    {
      field: "price_fixed",
      headerName: "Price Fixed",
      width: 200,
    },
    {
      field: "price_variable",
      headerName: "Price Variable",
      width: 200,
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="d-flex">
          <Link to={`/admin/pms-vendor-page-price-master/${params.row._id}`}>
            <button title="Edit" className="btn btn-outline-primary">
              <FaEdit />
            </button>
          </Link>
          <DeleteButton
            id={params.row._id}
            endpoint="deleteVendorPagePrice"
            cid={params.row._id}
            getData={getData}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Link to={`/admin/pms-vendor-page-price-master`}>
        <button
          title="Add"
          className="btn btn-outline-primary"
          style={{ marginBottom: "10px" }}
        >
          Add Vendor Page Price
        </button>
      </Link>

      <div className="card">
        <div className="data_tbl table-responsive">
          {/* <DataTable
            title="Vendor Overview"
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
          /> */}
          <DataGrid
            rows={filterData}
            columns={dataGridcolumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
