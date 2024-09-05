import { useEffect, useState } from "react";
import axios from "axios";
import "./Delivery.css";
import "./DeliveryResponsive.css";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

let orderLength = 0;

const DeliveryData = () => {
  const [transferTo, setTransferTo] = useState(0);
  const [reason, setReason] = useState("");
  const [deliveryData, setDeliveryData] = useState([]);
  const [deliveryBoyData, setDeliveryBoyData] = useState([]);

  const [orderRequestTransfer, setOrderRequestTransfer] = useState("");
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState("");
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const roleId = decodedToken.role_id;
  const loginUserId = decodedToken.id;
  const sittingID = decodedToken.sitting_id;
  const roomId = decodedToken.room_id;

  function getData() {
    axios
      .get(baseUrl+"get_all_orderreqdata")
      .then((res) => {
        if (res.data.data?.length !== orderLength) {
          orderLength = res.data.data.length;
          if (Notification.permission === "granted") {
            new Notification("New Order Received", {
              body: "Please check",
            });
          }
        }
      });

    axios
      .post(baseUrl+"add_orderreqs", {
        // Sitting_id: sittingID,
        Request_delivered_by: loginUserId,
        room_id: roomId,
      })
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setDeliveryData(res.data);
        } else {
        }
      })
      .catch((error) => {});
  }

  useEffect(() => {
    const intervalId = setInterval(getData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getData();
    axios.get(`${baseUrl}`+`get_delivery_user`).then((res) => {
      setDeliveryBoyData(res.data);
      // console.log(res.data);
    });
  }, []);

  const handleOrderCompleted = (
    productId,
    OrderReqId,
    userid,
    orderquantity,
    productmessage,
    dynstatus
  ) => {
    // console.log(productId, OrderReqId, userid, orderquantity, productmessage);
    axios
      .put(`${baseUrl}`+`update_orderrequest`, {
        product_id: productId,
        order_req_id: OrderReqId,
        order_quantity: orderquantity,
        special_request: "",
        user_id: userid,
        sitting_id: sittingID,
        status: dynstatus,
        request_delivered_by: loginUserId,
        message: productmessage,
        remarks: "",
        room_id: roomId,
      })
      .then(() => {
        getData();
      });
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    axios
      .post(baseUrl+"add_transreq", {
        from_id: roleId,
        to_id: transferTo,
        reason: reason,
        order_req_id: orderRequestTransfer,
      })
      .then((response) => {
        // console.log("Order delivery submitted successfully", response);
        setTransferTo("");
        setReason("");
        setSelectedDeliveryBoy("");
        getData();
      })
      .catch((error) => {
        console.error("Error submitting order delivery:", error);
      });
    // getData();
  };

  const filterDataByUserId = (userId) => {
    return deliveryData?.filter((d) => d.User_id === userId);
  };

  const createOrderCards = () => {
    const userIds = [...new Set(deliveryData?.map((d) => d.User_id))];

    return userIds?.map((userId) => {
      const filteredData = filterDataByUserId(userId);

      return (
        <div className="col-12" key={userId}>
          <h1> {deliveryBoyData?.User_name}</h1>

          {deliveryData?.map((d) => (
            <div className="order_card">
              <div className="order_card_head">
                <div className="emply_info">
                  <img src={d.image} alt="img" />
                  <div className="emply_title">
                    <h2>{d.user_name}</h2>
                    <ul>
                      <li>Room - {d.Sitting_area}</li>
                      <li>Chair - {d.Sitting_ref_no}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="order_card_body">
                <div className="order_list">
                  <div className="order_list_item" key={d.Order_req_id}>
                    <div className="order_list_item_in">
                      <div className="order_item_img">
                        <img src={d.Product_image} alt="img" />
                      </div>
                      <div className="order_item_title">
                        <h3>{d.Product_name}</h3>
                        <ul>
                          <li>Qty - {d.Order_quantity}</li>
                          <li>
                            <i className="bi bi-clock" /> {"  "}
                            {d.Request_datetime.substring(11, 16)}
                          </li>
                        </ul>
                        {d.props1 == null ? "" : <h4>{d.props1}</h4>}
                        {/*  */}
                      </div>
                      <div className="order_item_action">
                        <button
                          className="btn btn_success"
                          onClick={() =>
                            handleOrderCompleted(
                              d.product_id,
                              d.Order_req_id,
                              d.User_id,
                              d.Order_quantity,
                              d.Message,
                              "Delivered"
                            )
                          }
                        >
                          Delivered
                        </button>
                        <button
                          className="btn btn_danger"
                          onClick={() =>
                            handleOrderCompleted(
                              d.product_id,
                              d.Order_req_id,
                              d.User_id,
                              d.Order_quantity,
                              d.Message,
                              "declined"
                            )
                          }
                        >
                          Decline
                        </button>
                        <button
                          onClick={() =>
                            setOrderRequestTransfer(d.Order_req_id)
                          }
                          className="btn btn_info"
                          data-bs-toggle="modal"
                          data-bs-target="#transferModal"
                        >
                          Transfer
                        </button>
                      </div>
                    </div>
                    <div className="order_list_item_message">
                      <p>
                        <span>Message:</span>
                        {d.Message}
                      </p>
                    </div>
                    <div className="order_list_item_message">
                      <p>
                        <span>Special Message:</span>
                        {d.Special_request}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="order_card_request">
              
              </div> */}
            </div>
          ))}
        </div>
      );
    });
  };

  return (
    <>
      {/* Order Card Section Start */}
      <section className="section section_padding order_listing_sec">
        <div className="container">
          <div className="row">{createOrderCards()}</div>
        </div>
      </section>
      {/* Order Card Section End */}
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
                            <img src={d.user_image_url} alt="img" />
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

export default DeliveryData;
