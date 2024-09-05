import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {baseUrl} from '../../../utils/config'

const AlertOrderSuccessful = () => {
  const [data, setData] = useState([]);
  const [newOrderReqId, setNewOrderReqId] = useState("");

  async function getData() {
    try {
      const res = await axios.get(
        baseUrl+"get_all_orderreqdata"
      );
      setData(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const latestOrder = data[data.length - 1];
      setNewOrderReqId(latestOrder.Order_req_id);
    }
  }, [data]);
  console.log(newOrderReqId, "new order");
  return (
    <div
      className="modal fade alert_modal"
      id="alertModal"
      tabIndex="-1"
      aria-labelledby="alertModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="alert_img">
              <img src="" alt="image" />
            </div>
            <div className="alert_text">
              <h2>Woo Hoo !!</h2>
              {newOrderReqId}
              <p>Your order has been placed successfully.</p>
              <button
                className="btn cmnbtn btn_success"
                data-bs-dismiss="modal"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertOrderSuccessful;
