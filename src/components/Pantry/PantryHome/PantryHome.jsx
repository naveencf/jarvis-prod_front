import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCategory, MdOutlineFastfood } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { BsBoxes } from "react-icons/bs";
// import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

const PantryHome = () => {
  const [allOrderData, setAllOrderData] = useState([]);
  const [transferReq, setTransferReq] = useState([]);
  // const [contextData, setDatas] = useState([]);
  const navigate = useNavigate();

  // const conditionToken = sessionStorage.getItem("token");
  // const decodedToken = jwtDecode(conditionToken);
  // const userId = decodedToken.id;
  // useEffect(() => {
  //   if (userId && contextData.length === 0) {
  //     axios.get(`${baseUrl}`+`get_single_user_auth_detail/${userId}`).then((res) => {
  //       setDatas(res.data);
  //     });
  //   }
  // }, []);

  const handleAllOrder = () => {
    navigate("/admin/all-order");
  };
  const handlePendingOrder = () => {
    navigate("/admin/all-pending-order");
  };
  const handleDeliverdOrder = () => {
    navigate("/admin/all-deliverd-order");
  };
  const handleDeclinedOrder = () => {
    navigate("/admin/all-declined-order");
  };

  const handleTransferReq = () => {
    navigate("/admin/transfer-req");
  };

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_orderreqdata")
      .then((res) => {
        setAllOrderData(res.data.data);
      });
  }, []);
  const pendingOrdersCount = allOrderData?.filter(
    (orders) => orders.Status.toLowerCase() === "pending"
  ).length;
  const deliveredOrdersCount = allOrderData?.filter(
    (orders) => orders.Status === "Delivered"
  ).length;
  const declinedOrderCount = allOrderData?.filter(
    (orders) => orders.Status.toLowerCase() === "declined"
  ).length;

  const allOrderCount = allOrderData?.length;
  useEffect(() => {
    axios.get(baseUrl+"get_all_transreq").then((res) => {
      setTransferReq(res.data.data);
    });
  }, []);
  const TransferDataLength = transferReq?.length;
  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Dashboard</h2>
        </div>
      </div>
      <div className="row">
        {/* <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
          <div className="d_infocard card shadow">
            <Link to="/pantry-user">
              <div className="card-body">
                <div className="d_infocard_txt">
                  <h3>Pantry</h3>
                  <h2>Order</h2>
                </div>
                <div className="d_infocard_icon">
                  <span>
                    <MdOutlineCategory />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div> */}
        {/* {contextData && contextData[15] && contextData[15].view_value === 1 && ( */}
        <>
          <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
            <div className="d_infocard card shadow">
              <div className="card-body" onClick={handleAllOrder}>
                <div className="d_infocard_txt">
                  <h3>All Order</h3>
                  <h2>{allOrderCount}</h2>
                </div>
                <div className="d_infocard_icon">
                  <span>
                    <MdOutlineCategory />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
            <div className="d_infocard card shadow">
              <div className="card-body" onClick={handlePendingOrder}>
                <div className="d_infocard_txt">
                  <h3>Pending Order</h3>
                  <h2>{pendingOrdersCount}</h2>
                </div>
                <div className="d_infocard_icon">
                  <span>{/* <HiUsers /> */}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
            <div className="d_infocard card shadow">
              <div className="card-body" onClick={handleDeliverdOrder}>
                <div className="d_infocard_txt">
                  <h3>Delivered Order</h3>
                  <h2>{deliveredOrdersCount}</h2>
                </div>
                <div className="d_infocard_icon">
                  <span>
                    <BsBoxes />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
            <div className="d_infocard card shadow">
              <div className="card-body" onClick={handleDeclinedOrder}>
                <div className="d_infocard_txt">
                  <h3>Declined Order</h3>
                  <h2>{declinedOrderCount}</h2>
                </div>
                <div className="d_infocard_icon">
                  <span>
                    <BsBoxes />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col">
            <div className="d_infocard card shadow">
              <div className="card-body" onClick={handleTransferReq}>
                <div className="d_infocard_txt">
                  <h3>Transfer Req.</h3>
                  <h2>{TransferDataLength}</h2>
                </div>
                <div className="d_infocard_icon">
                  <span>
                    <MdOutlineFastfood />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
        {/* )} */}
      </div>
    </>
  );
};

export default PantryHome;
