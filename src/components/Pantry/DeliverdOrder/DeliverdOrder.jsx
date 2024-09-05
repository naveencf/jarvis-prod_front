import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {baseUrl} from '../../../utils/config'

const DeliverdOrder = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  function getData() {
    axios
      .get(baseUrl+"get_all_orderreqdata")
      .then((res) => {
        setData(res.data.data.filter((res) => res.Status === "Delivered"));
        setFilterData(
          res.data.data.filter((res) => res.Status === "Delivered")
        );
      });
  }

  const columns = [
    {
      name: "S.No",
      cell: (empty, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "Order No.",
      selector: (row) => row.Order_req_id,
      width: "13%",
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.Product_name,
      width: "11%",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      width: "15%",
      sortable: true,
    },
    {
      name: "Order Quantity",
      selector: (row) => row.Order_quantity,
      width: "10%",
    },
    {
      name: "Complete By Order",
      selector: (row) => row.delivered_by_name,
      width: "12%",
    },
    {
      name: "Status",
      selector: (row) => (
        <div className={`status-${row.Status.toLowerCase()}`}>{row.Status}</div>
      ),
      width: "11%",
    },
    {
      name: "SittingArea",
      cell: (row) => (
        <>
          {row.Sitting_area} | {row.Sitting_ref_no}
        </>
      ),
      width: "11%",
    },
    {
      name: "Req Time",
      selector: (row) => row.Request_datetime.substring(11, 16),

      //   const [hours, minutes] = requestTime.split(":").map(Number);
      //   let newHours = (hours + 5) % 12;
      //   const newMinutes = (minutes + 30) % 60;
      //   const amPm = hours >= 12 ? "AM" : "PM";

      //   if (newHours === 0) {
      //     newHours = 12;
      //   }

      //   const newTime = `${String(newHours).padStart(2, "0")}:${String(
      //     newMinutes
      //   ).padStart(2, "0")} ${amPm}`;
      //   return newTime;
      // },
      width: "10%",
    },
    {
      name: "Message",
      selector: (row) => row.Message,
      width: "20%",
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
          <h2>All Deliverd Order</h2>
        </div>
      </div>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="All Deliverd Order"
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

export default DeliverdOrder;
