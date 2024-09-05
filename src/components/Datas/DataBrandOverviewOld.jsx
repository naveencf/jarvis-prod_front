import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { BsFillEyeFill } from "react-icons/bs";
import FormContainer from "../AdminPanel/FormContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import UserNav from "../Pantry/UserPanel/UserNav";
import FieldContainer from "../AdminPanel/FieldContainer";
import { baseUrl } from "../../utils/config";

const DataBrandOverviewOld = () => {
  // const { data } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [catNameFilter, setCatNameFilter] = useState("");
  const [uploadFilter, setUploadFilter] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [countData, setCountData] = useState([]);

  function getData() {
    axios.get(baseUrl+"logodata").then((res) => {
      setCountData(res.data);
      const responseData = res.data;
      const uniqueBrandName = new Set();
      const filteredData = responseData.filter((item) => {
        if (!uniqueBrandName.has(item.brand_name)) {
          uniqueBrandName.add(item.brand_name);
          return true;
        }
        return false;
      });
      setData(filteredData);
      setFilterData(filteredData);
    });

    axios
      .get(baseUrl+"alllogocat")
      .then((res) => setCategoryData(res.data));

    axios
      .get(baseUrl+"get_all_users")
      .then((res) => setEmployeeData(res.data.data));
  }

  const getBrandCount = (brandName, data) => {
    const count = countData.filter(
      (item) => item.brand_name === brandName
    ).length;
    return count;
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      const catNameMatch =
        !catNameFilter || d.cat_id === parseInt(catNameFilter, 10);
      const uploadMatch =
        !uploadFilter || d.created_by === parseInt(uploadFilter, 10);

      return catNameMatch && uploadMatch;
    });
    setFilterData(result);
  }, [catNameFilter, uploadFilter]);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.brand_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "Brand Name",
      selector: (row) => row.brand_name,
      sortable: true,
    },
    {
      name: "Image Type",
      selector: (row) => row.image_type,
      sortable: true,
    },
    {
      name: "Size",
      selector: (row) => row.size,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.cat_name,
      sortable: true,
    },
    {
      name: "Count",
      selector: (row) => {
        const count = getBrandCount(row.brand_name, data);
        return <div>{count}</div>;
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <Link to={`/brand-update/${row.logo_id}`}>
            <button
              title="Edit"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <FaEdit />
              {""}
            </button>
          </Link>
          <Link to={`/brand-view/${row.logo_id}`}>
            <button
              title="Download"
              className="btn btn-outline-primary btn-sm user-button"
            >
              <BsFillEyeFill />
            </button>
          </Link>
          <DeleteButton
            endpoint="logodelete"
            id={row.logo_id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];
  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />

      <Link to="/admin/logo-category-overview" style={{}}>
        <button
          type="button"
          className="btn btn-primary"
          style={{ float: "right", margin: "10px 0 10px 0" }}
        >
          Logo Category
        </button>
      </Link>

      <FormContainer mainTitle="Brand" link="/brand-master" />
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <div className="row">
              <FieldContainer
                label="Logo category"
                Tag="select"
                fieldGrid={3}
                value={catNameFilter}
                onChange={(e) => setCatNameFilter(e.target.value)}
              >
                <option value="">Please select</option>
                {categoryData.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.cat_name}
                  </option>
                ))}
              </FieldContainer>

              <FieldContainer
                label="Upload By"
                Tag="select"
                fieldGrid={3}
                value={uploadFilter}
                onChange={(e) => setUploadFilter(e.target.value)}
              >
                <option value="">Please select</option>
                {employeeData.map((data) => (
                  <option key={data.user_id} value={data.user_id}>
                    {data.user_name}
                  </option>
                ))}
              </FieldContainer>
            </div>
            <DataTable
              title="Brand Overview"
              columns={columns}
              data={filterdata}
              fixedHeader
              // pagination
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
    </div>
  );
};
export default DataBrandOverviewOld;
