import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import CountdownTimer from "./CountdownTimer";
import { useGlobalContext } from "../../../Context/Context";
import Modal from "react-modal";
import {baseUrl} from '../../../utils/config'

let orderLength = 0;

const PendingOrder = () => {
  const { toastAlert } = useGlobalContext();
  const [allData, setAlldata] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  // transfer Request code
  const [transferTo, setTransferTo] = useState(0);
  const [reason, setReason] = useState("");
  const [deliveryBoyData, setDeliveryBoyData] = useState([]);
  const [orderRequestTransfer, setOrderRequestTransfer] = useState({});
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");
  const [departmentName, setDepartmentName] = useState([]);
  const [showALlDeliveryBoy, setAllDeliveryBoy] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalAlert, setModalAlert] = useState("");

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((data) => {
        setDepartmentName(data.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_delivery_boy`)
      .then((res) => setAllDeliveryBoy(res.data.results));
  }, []);

  const handleStatusChange = (row, selectedStatus) => {
    if (selectedStatus === "declined") {
      setIsModalOpen(true);
      setSelectedRow(row);
      return;
    } else {
      axios
        .put(baseUrl+"update_orderrequest", {
          product_id: row.product_id,
          order_req_id: row.Order_req_id,
          order_quantity: row.Order_quantity,
          special_request: row.Special_request,
          user_id: row.User_id,
          sitting_id: row.Sitting_id,
          status: selectedStatus,
          request_delivered_by: row.Request_delivered_by,
          message: row.Message,
          remarks: "",
        })
        .then(() => {
          handleGetOrderData();
          toastAlert("Order Deliverd");
        });
    }
  };

  useEffect(() => {
    const result = allData.filter((d) => {
      return d.user_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
    handleGetOrderData();
  }, [search]);

  function handleGetOrderData() {
    axios
      .get(baseUrl+"get_all_orderreqdata")
      .then((res) => {
        const data = res.data.data
          .filter((res) => res.Status === "pending")
          .map((item) => {
            return {
              ...item,
              statusDropdown: "pending",
            };
          });
        setAlldata(data);
        if (res.data.data.length !== orderLength) {
          orderLength = res.data.data.length;
          if (Notification.permission === "granted") {
            new Notification("New Order Received", {
              body: "Please check",
            });
          }
        }
        setFilterData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    const intervalId = setInterval(handleGetOrderData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    axios.get(`${baseUrl}`+`get_delivery_user`).then((res) => {
      setDeliveryBoyData(res.data);
    });
  }, []);

  const modalSubmit = (selectedRow) => {
    // console.log("selectedRow", selectedRow);
    if (remarks.length > 2) {
      axios
        .put(baseUrl+"update_orderrequest", {
          product_id: selectedRow.product_id,
          order_req_id: selectedRow.Order_req_id,
          order_quantity: selectedRow.Order_quantity,
          special_request: selectedRow.Special_request,
          user_id: selectedRow.User_id,
          sitting_id: selectedRow.Sitting_id,
          status: "declined",
          request_delivered_by: selectedRow.Request_delivered_by,
          message: selectedRow.Message,
          remarks: remarks,
        })
        .then(() => {
          handleGetOrderData();
        })
        .catch((error) => {
          console.log(error);
          // Handle error if needed
        });
      setRemarks("");
      setIsModalOpen(false);
      setModalAlert("");
    } else {
      setModalAlert("Please enter remarks");
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl+"add_transreq", {
        from_id: orderRequestTransfer[1],
        to_id: transferTo,
        reason: reason,
        order_req_id: orderRequestTransfer[0],
      })
      .then((response) => {
        setTransferTo("");
        setReason("");
        setSelectedDeliveryBoy("");
      })
      .catch((error) => {
        console.error("Error submitting order delivery:", error);
      });
  };

  const columns = [
    {
      name: "S.No",
      cell: (empty, index) => <div>{index + 1}</div>,
      // width: "7%",
      sortable: true,
    },
    {
      name: "OrderNo.",
      selector: (row) => row.Order_req_id,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.Product_name,
      width: "140px",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
      // width: "13%",
    },
    {
      name: "Quantity",
      selector: (row) => row.Order_quantity,
    },
    // {
    //   name: "Delivery Boy",
    //   selector: (row) => {
    //     if (showALlDeliveryBoy.length > 0) {
    //       const usernames = showALlDeliveryBoy.map((d) => d.user_name);
    //       return <div>{usernames.join(", ")}</div>;
    //     } else {
    //       return "Unknown User";
    //     }
    //   },
    //   width: "20%",
    // },
    {
      name: "Delivery Boy",
      selector: (row) => {
        const deliveryBoys = showALlDeliveryBoy.filter(
          (d) => d.room_id === row.room_id
        );
        if (deliveryBoys.length > 0) {
          const usernames = deliveryBoys.map((d) => d.user_name);
          return usernames.join(", ");
        } else {
          return "Unknown User";
        }
      },
      width: "10%",
    },

    {
      name: "Time Delay",
      selector: (row) => (
        <CountdownTimer
          initialTime={row.timer}
          // reqTime={row.Request_datetime}
        />
      ),
      width: "10%",
    },
    {
      name: "Department",
      selector: (row) => {
        const dept = departmentName.find(
          (data) => data.dept_id === row.dept_id
        );
        return dept ? (
          <div style={{ whiteSpace: "normal" }}>{dept.dept_name}</div>
        ) : (
          "Unknown Department"
        );
      },
    },
    {
      name: "Status",
      selector: (row) => (
        <select
          className="form-control"
          value={row.statusDropdown}
          onChange={(e) => handleStatusChange(row, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="declined">Declined</option>
        </select>
      ),
      // width: "14%",
    },
    {
      name: "Sitting area",
      cell: (row) => (
        <>
          {row.Sitting_area} | {row.Sitting_ref_no}
        </>
      ),
      // width: "15%",
    },
    {
      name: "Req Time",
      selector: (row) => row.Request_datetime.substring(11, 16),
    },
    // {
    //   name: "Req Time",
    //   selector: (row) => {
    //     const datetime = new Date(row.Request_datetime);
    //     const amPm = datetime.getHours() >= 12 ? "PM" : "AM";
    //     const formattedHours = (datetime.getHours() % 12 || 12)
    //       .toString()
    //       .padStart(2, "0");
    //     const formattedMinutes = datetime
    //       .getMinutes()
    //       .toString()
    //       .padStart(2, "0");
    //     return `${formattedHours}:${formattedMinutes} ${amPm}`;
    //   },
    // },
    {
      name: "Message",
      selector: (row) => row.Message,
      // width: "230px",
    },
    {
      name: "Transfer",
      cell: (row) => (
        <>
          <button
            onClick={() =>
              setOrderRequestTransfer([
                row.Order_req_id,
                row.Request_delivered_by,
              ])
            }
            className="btn icon_btn btn_info"
            data-bs-toggle="modal"
            data-bs-target="#transferModal"
          >
            <i className="bi bi-send" />
          </button>
        </>
      ),
    },
  ];
  return (
    <>
      <Modal
        appElement={document.getElementById("root")}
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "30%",
            height: "25%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="d-flex flex-column w-75 m-auto">
          <label htmlFor="modalInput">
            <h2 className="fs-5">
              Reason <span className="text-danger">*</span>
            </h2>
          </label>
          <textarea
            id="modalInput"
            type="text"
            label="Remarks"
            rows="3"
            cols="10"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <p className="my-2 text-danger ">{modalAlert}</p>
          <button
            className="btn btn-success"
            type="submit"
            onClick={() => modalSubmit(selectedRow)}
          >
            Submit
          </button>
        </div>
      </Modal>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Pending Order</h2>
        </div>
      </div>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Pending Order"
            columns={columns}
            data={filterdata.sort((a, b) =>
              a.Request_datetime.substring(11, 16) <
              b.Request_datetime.substring(11, 16)
                ? 1
                : -1
            )}
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
      {/* Transfer Modal Start */}
      <div
        className="modal fade alert_modal transfer_modal"
        id="transferModal"
        tabIndex={-1}
        aria-labelledby="transferModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <form onSubmit={handleTransfer}>
                <div className="transfer_head">
                  <h2>Transfer Order</h2>
                </div>
                <div className="transfer_reason">
                  <div className="form-group">
                    <label>Select reason</label>
                    <select
                      name="transfer reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="form-control"
                    >
                      <option>-- -- --</option>
                      <option value="Absent">Absent</option>
                      <option value="Not Available">
                        Not Available on Floor
                      </option>
                      <option value="Busy in Other work">
                        Busy in other work
                      </option>
                    </select>
                  </div>
                </div>
                <div className="transfer_body">
                  <div
                    className="transfer_boxes"
                    onChange={(e) => setTransferTo(e.target.value)}
                    value={transferTo}
                  >
                    {deliveryBoyData.map((d) => (
                      <label className="transfer_bx" key={d.user_id}>
                        <input
                          type="radio"
                          value={d.user_id}
                          name="transfer-radio"
                          // defaultChecked=""'
                          checked={selectedDeliveryBoy === d.user_id}
                          onChange={() => setSelectedDeliveryBoy(d.user_id)}
                        />
                        <span className="cstm-radio-btn">
                          <i className="bi bi-check2" />
                          <div className="boy_img">
                            <img src={d.downloadableUrl} alt="img" />
                            <h3>{d.user_name}</h3>
                          </div>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="alert_text">
                  <button
                    className="btn cmnbtn btn_success"
                    data-bs-dismiss="modal"
                    type="submit"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Transfer Modal End */}
    </>
  );
};

export default PendingOrder;
