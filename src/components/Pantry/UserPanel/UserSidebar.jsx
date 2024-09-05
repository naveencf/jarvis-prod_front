import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataContext } from "./DataProvider/DataProvider";
import axios from "axios";
import "./OrderRequest.css";
import jwtDecode from "jwt-decode";
import successImage from "../../../assets/img/icon/success.png";
import {baseUrl} from '../../../utils/config'

const UserSidebar = ({ cartItems, updatedCart, selectedSitting }) => {
  const { count, setCount } = useContext(DataContext);
  const [cartToggle, setCartToggle] = useState(false);
  // const [message, setMessage] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [reqDelApiData, setReqDelApiData] = useState([]);
  const [orderId, setOrderID] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const SittingId = decodedToken.sitting_id;
  const loginUserRoomId = decodedToken.room_id;
  const userEmail = decodedToken.email;

  const cartValue = Object.keys(cartItems).length;

  const handleCartOpen = () => {
    setCartToggle(true);
  };

  const handleCartClose = () => {
    setCartToggle(false);
  };

  useEffect(() => {
    if (cartValue === 0) {
      setCartToggle(false);
    }
  }, [cartValue]);

  // Order ID
  async function getData() {
    try {
      await axios
        .get(baseUrl+"get_LastOrderId")
        .then((res) => {
          setOrderID(res.data.Order_req_id);
        });
      // setOrderID(res.data.data[res.data.data.length - 1].Order_req_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleCheckboxChange = (productId, targetValue, propid) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.product_id === productId) {
        const propNames = item["propNames"] || [];
        for (let i = 0; i < propNames.length; i++) {
          if (propNames[i][1] == propid) {
            propNames[i] = propNames[propNames.length - 1];
            propNames.pop();
          }
        }
        const updatedPropNames = propNames.includes(targetValue)
          ? propNames.filter((name) => name !== targetValue)
          : [...propNames, [targetValue, propid]];

        return {
          ...item,
          ["propNames"]: updatedPropNames,
        };
      }
      return item;
    });
    updatedCart(updatedCartItems);
  };

  useEffect(() => {
    axios
      .get(baseUrl+"get_delivery_boy")
      .then((res) => setReqDelApiData(res.data.results));
  }, []);
  const handlePlaceOrder = async () => {
    // e.preventDefault();
    for (const element of cartItems) {
      if (element.propNames !== undefined) {
        for (let i = 0; i < element.propNames.length; i++) {
          element.propNames[i].pop();
        }
        element.propNames = element.propNames.join(", ");
      }
      const finalsitting_id =
        selectedSitting == "" ? Number(SittingId) : Number(selectedSitting);
      await axios
        .post(baseUrl+"add_orderreq", {
          product_id: element.product_id,
          order_quantity: count[element.product_id],
          special_request: specialRequest,
          user_id: userId,
          sitting_id: finalsitting_id,
          message: element.message,
          remarks: "",
          created_by: userId,
          request_delivered_by: reqDelApiData[0].user_id,
          room_id: loginUserRoomId,
          props1: element.propNames,
          email: userEmail
          // props2: element.props2,
          // props3: element.props3,
          // props1Int: element.props1Int,
          // props2Int: element.props2Int,
          // props3Int: element.props3Int,
        })
        .then(() => {
          getData();
        });
    }
    updatedCart([]);
    setCount(0);
    setSpecialRequest("");
  };

  const handleIncrement = (productId) => {
    setCount((prevCounts) => ({
      ...prevCounts,
      [productId]: prevCounts[productId] + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setCount((prevCounts) => ({
      ...prevCounts,
      [productId]: prevCounts[productId] - 1,
    }));
    const index = cartItems.findIndex(
      (object) => object.product_id === productId
    );

    count[productId] - 1 === 0 ? cartItems.splice(index, 1) : cartItems;
  };
  // console.log(cartItems);

  const handleMessageChange = (productId, value) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.product_id === productId) {
        return {
          ...item,
          message: value,
        };
      }
      return item;
    });
    updatedCart(updatedCartItems);
  };

  return (
    <>
      <div className={cartToggle ? "sidecart_open" : ""}>
        <div className="sidecart_wrapper">
          <div onClick={handleCartClose} className="sidecart_overlay" />
          <div className="sidecart_content">
            <button
              onClick={handleCartClose}
              className="btn carttoggle close_carttoggle"
            >
              <i className="bi bi-x-lg" />
            </button>
            <div className="sidecart_heading">
              <h2>
                <span>
                  <i className="bi bi-basket" />
                </span>
                Your Orders
              </h2>
            </div>
            <div className="sidecart_items">
              {cartItems.map(
                (item) =>
                  count[item.product_id] !== 0 && (
                    <>
                      <div className="sidecart_item" key={item.productId}>
                        <div className="sidecart_item_img">
                          <img
                            src={item.Product_image_download_url}
                            alt="product"
                          />
                        </div>
                        <div className="sidecart_item_title">
                          <h2>{item.Product_name}</h2>
                          {/* <h3>{item.Product_type}</h3> */}
                        </div>
                        <textarea
                          className="form-control"
                          placeholder="Message"
                          value={item.message}
                          onChange={(e) =>
                            handleMessageChange(item.product_id, e.target.value)
                          }
                        />
                        <div className="sidecart_item_action">
                          <div className="add_counter">
                            <div className="counter_bar">
                              <button
                                className="btn counter_btn"
                                onClick={() => handleDecrement(item.product_id)}
                              >
                                <i className="bi bi-dash-lg" />
                              </button>

                              <p>{count[item.product_id]}</p>
                              <button
                                className="btn counter_btn"
                                onClick={() => handleIncrement(item.product_id)}
                              >
                                <i className="bi bi-plus-lg" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="addons">
                        <div className="addon_item_group">
                          {item.Product_Prop.some((e) => e.type_id === 1) && (
                            <h4>
                              {item.Product_Prop.filter((e) => e.type_id === 1)
                                .map((e) => e.prop_category)
                                .filter(
                                  (value, index, self) =>
                                    self.indexOf(value) === index
                                )
                                .join(", ") + ":"}
                            </h4>
                          )}
                          {item.Product_Prop.map((prop) => {
                            if (prop.type_id === 1 && prop.prop_name !== null) {
                              return (
                                <div
                                  className="addon_item"
                                  key={`${prop.prop_name}_${prop.type_id}`}
                                >
                                  <input
                                    type="radio"
                                    name={`radio_${item.product_id}_${prop.type_id}`}
                                    value={prop.prop_name}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        item.product_id,
                                        e.target.value,
                                        prop.type_id
                                      )
                                    }
                                  />
                                  <label>{prop.prop_name}</label>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <div className="addon_item_group">
                          {item.Product_Prop.some((e) => e.type_id === 2) && (
                            <h4>
                              {item.Product_Prop.filter((e) => e.type_id === 2)
                                .map((e) => e.prop_category)
                                .filter(
                                  (value, index, self) =>
                                    self.indexOf(value) === index
                                )
                                .join(", ")}
                              :
                            </h4>
                          )}
                          {item.Product_Prop.map((prop) => {
                            if (prop.type_id === 2 && prop.prop_name !== null) {
                              return (
                                <div
                                  className="addon_item"
                                  key={`${prop.prop_name}_${prop.type_id}`}
                                >
                                  {/* <h4>{prop.prop_category}:</h4> */}
                                  <input
                                    type="radio"
                                    name={`radio_${item.product_id}_${prop.type_id}`}
                                    value={prop.prop_name}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        item.product_id,
                                        e.target.value,
                                        prop.type_id
                                      )
                                    }
                                  />
                                  <label>{prop.prop_name}</label>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <div className="addon_item_group">
                          {item.Product_Prop.some((e) => e.type_id === 3) && (
                            <h4>
                              {item.Product_Prop.filter((e) => e.type_id === 3)
                                .map((e) => e.prop_category)
                                .filter(
                                  (value, index, self) =>
                                    self.indexOf(value) === index
                                )
                                .join(", ")}
                              :
                            </h4>
                          )}
                          {item.Product_Prop.map((prop) => {
                            if (prop.type_id === 3 && prop.prop_name !== null) {
                              return (
                                <div
                                  className="addon_item"
                                  key={`${prop.prop_name}_${prop.type_id}`}
                                >
                                  {/* <h4>{prop.prop_category}</h4> */}
                                  <input
                                    type="radio"
                                    name={`radio_${item.product_id}_${prop.type_id}`}
                                    value={prop.prop_name}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        item.product_id,
                                        e.target.value,
                                        prop.type_id
                                      )
                                    }
                                  />
                                  <label>{prop.prop_name}</label>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <div className="addon_item_group">
                          {item.Product_Prop.some((e) => e.type_id === 4) && (
                            <h4>
                              {item.Product_Prop.filter((e) => e.type_id === 4)
                                .map((e) => e.prop_category)
                                .filter(
                                  (value, index, self) =>
                                    self.indexOf(value) === index
                                )
                                .join(", ") + ":"}
                            </h4>
                          )}
                          {item.Product_Prop.map((prop) => {
                            if (prop.type_id === 4 && prop.prop_name !== null) {
                              return (
                                <div
                                  className="addon_item"
                                  key={`${prop.prop_name}_${prop.type_id}`}
                                >
                                  <input
                                    type="radio"
                                    name={`radio_${item.product_id}_${prop.type_id}`}
                                    value={prop.prop_name}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        item.product_id,
                                        e.target.value,
                                        prop.type_id
                                      )
                                    }
                                  />
                                  <label>{prop.prop_name}</label>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                        <div className="addon_item_group">
                          {item.Product_Prop.some((e) => e.type_id === 5) && (
                            <h4>
                              {item.Product_Prop.filter((e) => e.type_id === 5)
                                .map((e) => e.prop_category)
                                .filter(
                                  (value, index, self) =>
                                    self.indexOf(value) === index
                                )
                                .join(", ") + ":"}
                            </h4>
                          )}
                          {item.Product_Prop.map((prop) => {
                            if (prop.type_id === 5 && prop.prop_name !== null) {
                              return (
                                <div
                                  className="addon_item"
                                  key={`${prop.prop_name}_${prop.type_id}`}
                                >
                                  <input
                                    type="radio"
                                    name={`radio_${item.product_id}_${prop.type_id}`}
                                    value={prop.prop_name}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        item.product_id,
                                        e.target.value,
                                        prop.type_id
                                      )
                                    }
                                  />
                                  <label>{prop.prop_name}</label>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </>
                  )
              )}
            </div>
            <div className="sidecart_footer">
              <label>Special Request</label>
              <textarea
                className="form-control"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
              />
              <button
                className="btn cmnbtn btn_success carttoggle"
                data-bs-toggle="modal"
                data-bs-target="#alertModal"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>

        <button
          disabled={cartValue === 0}
          onClick={handleCartOpen}
          className="btn sidecart_toggle_btn"
        >
          <i className="bi bi-basket"></i> <span>{cartValue}</span>
        </button>
      </div>

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
                <img src={successImage} alt="image" />
              </div>
              <div className="alert_text">
                <h2>Woo Hoo !!</h2>
                <h2>Your Order No. is {orderId}</h2>
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
    </>
  );
};

UserSidebar.propTypes = {
  cartItems: PropTypes.array.isRequired,
  updatedCart: PropTypes.func.isRequired,
};

export default UserSidebar;
