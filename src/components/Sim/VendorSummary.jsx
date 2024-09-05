import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { baseUrl } from "../../utils/config";

const VendorSummary = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "vendorsum");
      setData(response.data.data);
      setFilterData(response.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const columns = [
    {
      name: "S.No",
      // selector: (row) => row.Role_id,
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.assetsName,

      sortable: true,
    },
    {
      name: "Send By Name",
      selector: (row) => row.send_by_name,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendor_name,
    },
    {
      name: "Send Vendor Date",
      selector: (row) => row.send_date,
    },
    {
      name: "Expected Date",
      selector: (row) => row.expected_date_of_repair,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.asset_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Vendor Summary"
            columns={columns}
            data={filterdata}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="62vh"
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
    </>
  );
};

export default VendorSummary;
