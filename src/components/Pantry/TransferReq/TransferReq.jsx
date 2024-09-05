import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {baseUrl} from '../../../utils/config'

const TransferReq = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  function getData() {
    axios.get(baseUrl+"get_all_transreq").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  const columns = [
    {
      name: "S.No",
      cell: (empty, index) => <div>{index + 1}</div>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.Product_name,
      width: "13%",
      sortable: true,
    },
    {
      name: "Reques BY",
      selector: (row) => row.requested_by,
      width: "15%",
      sortable: true,
    },
    {
      name: "Transfer T0",
      selector: (row) => row.transfer_to,
      width: "15%",
    },
    {
      name: "Req.Transfered By",
      selector: (row) => row.request_transfered_by,
      width: "14%",
    },
    {
      name: "Sitting Area",
      cell: (row) => row.Sitting_area,
      width: "15%",
    },
    {
      name: "Reason",
      selector: (row) => row.Reason,
      width: "15%",
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.requested_by.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>All Transfer Request</h2>
        </div>
      </div>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="All Transfer Request"
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

export default TransferReq;
