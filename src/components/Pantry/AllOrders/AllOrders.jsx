import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../PendingOrder/PendingOrder.css";
import {baseUrl} from '../../../utils/config'

const AllOrder = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  function getData() {
    axios
      .get(baseUrl+"get_all_orderreqdata")
      .then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
      });
  }

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "7%",
      sortable: true,
    },
    {
      name: "Order No",
      selector: (row) => row.Order_req_id,
      sortable: true,
    },
    {
      name: "Order No",
      selector: (row) => row.Order_req_id,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.Product_name,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Order Quantity",
      selector: (row) => row.Order_quantity,
      width: "12%",
    },
    {
      name: "Status",
      selector: (row) => (
        <div className={`status-${row.Status.toLowerCase()}`}>{row.Status}</div>
      ),
    },
    {
      name: "Sitting Area",
      cell: (row) => (
        <>
          {row.Sitting_area} | {row.Sitting_ref_no}
        </>
      ),
    },
    {
      name: "Req Time",
      selector: (row) => row.Request_datetime.substring(11, 16),

      // const [hours, minutes] = requestTime.split(":").map(Number);
      // let newHours = (hours + 5) % 12;
      // const newMinutes = (minutes + 30) % 60;
      // const amPm = hours >= 12 ? "AM" : "PM";

      // if (newHours === 0) {
      //   newHours = 12;
      // }

      // const newTime = `${String(newHours).padStart(2, "0")}:${String(
      //   newMinutes
      // ).padStart(2, "0")} ${amPm}`;
      // return newTime;
      // },
      width: "10%",
    },
    {
      name: "Message",
      selector: (row) => row.Message,
    },
    // {
    //   name: "Average Time",
    //   cell: (row) => {
    //     if (row.Status === "Completed") {
    //       const averageTime = calculateAverageTime(row.User_id);
    //       return averageTime !== null ? (
    //         <div>{averageTime} minutes</div>
    //       ) : (
    //         <div>null</div>
    //       );
    //     } else {
    //       return null;
    //     }
    //   },
    // },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.user_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  // const calculateAverageTime = (user_id) => {
  //   const completedOrders = data.filter(
  //     (order) => order.User_id === user_id && order.Status === "Completed"
  //   );

  //   if (completedOrders.length === 0) {
  //     return null; // Return null if there are no completed orders
  //   }

  //   const totalMinutes = completedOrders.reduce((total, order) => {
  //     const requestDatetime = new Date(order.Request_datetime);
  //     const deliveredDatetime = new Date(order.Delivered_datetime);
  //     const timeDiffInMinutes =
  //       Math.abs(deliveredDatetime - requestDatetime) / 60000;
  //     return total + timeDiffInMinutes;
  //   }, 0);

  //   const averageTime = totalMinutes / completedOrders.length;
  //   return isNaN(averageTime) ? null : averageTime.toFixed(2);
  // };

  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>All Order Request</h2>
        </div>
      </div>

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="All Order Request"
            columns={columns}
            data={filterdata}
            fixedHeader
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

export default AllOrder;
