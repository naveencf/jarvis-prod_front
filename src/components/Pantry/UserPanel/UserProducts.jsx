import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./OrderRequest.css";
import { DataContext } from "./DataProvider/DataProvider";
import jwtDecode from "jwt-decode";
import Select from "react-select";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import {baseUrl} from '../../../utils/config'

const UserProducts = ({ handleCartAddition, cartItems, handleSitting }) => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const loginUserSitting = decodedToken.sitting_ref_no;
  const sittingId = decodedToken.sitting_id;

  const { count, setCount } = useContext(DataContext);
  const [products, setProducts] = useState([]);
  const [sittingHistory, setSittingHistory] = useState([]);
  const [sittingData, setSittingData] = useState([]);
  const [sittingAreaData, setSittingAreaData] = useState([]);
  const [office, setOffice] = useState([]);
  const [showRoomImageModal, setShowRoomImageModal] = useState(false);
  const [selectedRoomImage, setSelectedRoomImage] = useState("");
  const [selectedSitting, setSelectedSitting] = useState({
    value: loginUserSitting,
  });
  const [selectedHistory, setSelectedHistory] = useState("");
  const [oldUserProduct, setOldUserProduct] = useState([]);

  useEffect(() => {
    axios.get(baseUrl+"get_all_products").then((res) => {
      setProducts(res.data);
    });
    axios.get(baseUrl+"get_all_rooms").then((res) => {
      setOffice(res.data.data);
    });
  }, []);

  // Single User Product Data
  useEffect(() => {
    axios
      .get(
        `${baseUrl}`+`get_single_orderreqshistory/${userId}`
      )
      .then((res) => {
        setOldUserProduct(res.data);
      });
  }, []);

  const handleAddButton = (productId) => {
    const product = products.find(
      (product) => product.product_id === productId
    );
    if (product) {
      handleCartAddition(product);
    }
    setCount((prevCounts) => ({
      ...prevCounts,
      [productId]: 1,
    }));
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

  useEffect(() => {
    axios
      .post(baseUrl+"get_user_pre_sitting", {
        user_id: userId,
      })
      .then((res) => setSittingHistory(res.data));

    axios
      .get(baseUrl+"get_all_sittings")
      .then((res) => setSittingData(res.data.data));
  }, []);
  // new sitting api ---------------------------------------------
  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_single_sitting/${sittingId}`)
      .then((res) => {
        setSittingAreaData(res.data);
      });
  }, []);

  useEffect(() => {
    if (selectedSitting) {
      axios
        .get(`${baseUrl}`+`get_single_sitting/${sittingId}`)
        .then((res) => {
          // handleSitting(res.data.sitting_area);
          //  104 sitting problem ke liye comment kiya
        });
    }
  }, [selectedSitting]);

  useEffect(() => {
    const selectedOption = sittingData.find(
      (option) => option?.sitting_id === Number(sittingId)
    );
    // console.log(selectedOption, "selectedOption")
    // setRoomId(selectedOption);
    setSelectedSitting({
      value: selectedOption?.sitting_id,
      label: `${selectedOption?.sitting_ref_no} | ${selectedOption?.sitting_area}`,
    });
  }, [sittingData]);

  const handleHistoryChange = (selectedOption) => {
    setSelectedSitting(selectedOption);
    setSelectedHistory(selectedOption); // Set selectedSitting with the selected option
  };

  const handleSittingChange = (selectedOption) => {
    setSelectedSitting(selectedOption); // Set selectedSitting with the selected option
    handleSitting(selectedOption.value);
  };

  const handleCloseModal = () => {
    setShowRoomImageModal(false);
  };

  const handleModalImage = (e) => {
    // console.log("fffffff", e);
    setShowRoomImageModal(true);
    const selectedRoom = office.find((room) => room.room_id === e.value);
    if (selectedRoom) {
      setSelectedRoomImage(selectedRoom.room_image_url);
      // console.log("hello:", selectedRoom.room_image_url);
      // console.log("selectedRoomImage:", selectedRoomImage);
    }
    return;
  };

  return (
    <>
      <div className="section product_section section_padding">
        <div className="container">
          <div className="product_head">
            <h2>All Products</h2>
            <div className="sitting_filter">
              <div className="sitting_bx">
                <label className="form-label">
                  Where am I ? <sup style={{ color: "red" }}>*</sup>
                </label>
                {/* Modify the Select component to open the modal */}
                <Select
                  options={office.map((option) => ({
                    value: option.room_id,
                    label: option.sitting_ref_no,
                  }))}
                  value={selectedRoomImage}
                  onChange={handleModalImage}
                />
              </div>
              <div className="sitting_bx">
                <div className="form-group">
                  <label className="form-label">History</label>
                  <Select
                    className="sitting_select"
                    options={sittingHistory.map((option) => ({
                      value: option.Sitting_id,
                      label: `${option.sitting_area} | ${option.sitting_ref_no}`,
                    }))}
                    value={selectedHistory}
                    onChange={handleHistoryChange} // Use handleHistoryChange function
                    isClearable
                  />
                </div>
              </div>
              <div className="sitting_bx">
                <div className="form-group">
                  <label className="form-label">
                    Sitting <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    defaultInputValue={setSelectedSitting.label}
                    className="sitting_select"
                    options={sittingData.map((option) => ({
                      value: option.sitting_id,
                      label: `${option.sitting_ref_no} |${option.sitting_area} `,
                    }))}
                    value={selectedSitting}
                    onChange={handleSittingChange}
                    required
                  />
                </div>
              </div>
              <button type="button" className="btn btn-outline-success">
                <Link to="/order-history">OrderHistory</Link>
              </button>
              <button type="button" className="btn btn-outline-warning">
                <Link to="/pending-order-single-user">Pending</Link>
              </button>
            </div>
          </div>

          <div className="row prdct_card_row">
            {products.map((product) => (
              <div
                className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 prdct_card_col"
                key={product.product_id}
              >
                <div className="prdct_card">
                  <div className="prdct_card_imgs">
                    <div className="prdct_img">
                      <img
                        src={product.Product_image_download_url}
                        alt="product"
                      />
                    </div>
                  </div>
                  <div className="prdct_card_info">
                    <div className="prdct_card_title">
                      {/* <h3>{product.Product_type}</h3> */}
                      <h2>{product.Product_name}</h2>
                    </div>
                    <div className="prdct_card_action">
                      <div className="prdct_card_btn">
                        <div className="add_counter">
                          {count[product.product_id] === undefined ||
                          count[product.product_id] === 0 ? (
                            <button
                              className="btn add_btn"
                              onClick={() =>
                                handleAddButton(product.product_id)
                              }
                            >
                              ADD
                            </button>
                          ) : (
                            <div className="counter_bar">
                              <button
                                className="btn counter_btn"
                                onClick={() =>
                                  handleDecrement(product.product_id)
                                }
                              >
                                <i className="bi bi-dash-lg" />
                              </button>
                              <p>{count[product.product_id]}</p>
                              <button
                                className="btn counter_btn"
                                onClick={() =>
                                  handleIncrement(product.product_id)
                                }
                              >
                                <i className="bi bi-plus-lg" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        appElement={document.getElementById("root")}
        isOpen={showRoomImageModal}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "50%",
            height: "60%",
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
              {selectedRoomImage ? (
                <img
                  style={{ height: "400px", width: "450px" }}
                  src={selectedRoomImage}
                  alt="Selected Room"
                />
              ) : (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Image not found
                </p>
              )}
            </h2>
          </label>
        </div>
      </Modal>
    </>
  );
};

export default UserProducts;
