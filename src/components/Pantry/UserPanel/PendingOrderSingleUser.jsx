import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import DataTable from "react-data-table-component";
import UserNav from "./UserNav";
import CountdownTimer from "../PendingOrder/CountdownTimer";
import {baseUrl} from '../../../utils/config'

const PendingOrderSingleUser = () => {
  const [oldUserProduct, setOldUserProduct] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [reqDelApiData, setReqDelApiData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const loginUserRoomId = decodedToken.room_id;

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_single_pendingorders/${userId}`)
      .then((res) => {
        setOldUserProduct(res.data.data);
        setFilterData(res.data.data);
        console.log("pending order", res.data);
      });
  }, []);

  useEffect(() => {
    const result = oldUserProduct.filter((d) => {
      return d.Product_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

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
      width: "10%",
    },
    {
      name: "Sitting",
      selector: (row) => row.Sitting_ref_no + "|" + row.Sitting_area,
      sortable: true,
      //   width: "10%",
    },
    {
      name: "Product Name",
      selector: (row) => row.Product_name,
      sortable: true,
      //   width: "10%",
    },
    {
      name: "Product Image",
      selector: (row) => <img src={row.product_image_url} width="50px" />,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          style={{
            backgroundColor: "orange",
            padding: "7px",
            borderRadius: "150px",
          }}
        >
          {row.Status}
        </span>
      ),
      //   width: "12%",
    },
    {
      name: "Time Delay",
      selector: (row) => <CountdownTimer initialTime={row.timer} />,
      width: "10%",
    },
  ];

  return (
    <>
      <UserNav />
      <div style={{ margin: "0 0 0 8%", width: "85%" }}>
        <div className="form-heading" style={{ margin: "10px 0 10px 0" }}>
          <div className="form_heading_title">
            <h2>Pending Order</h2>
          </div>
        </div>

        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure to repeat this order ?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  data-dismiss="modal"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Recent Orders"
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
      </div>
    </>
  );
};

export default PendingOrderSingleUser;
