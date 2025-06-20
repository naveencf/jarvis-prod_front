import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useEffect, useState } from "react";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import { baseUrl } from "../../../utils/config";
import logo from "../../../assets/logo.png";
import Diamond from "../../../assets/img/icon/badge/diamond.png";
import Platinum from "../../../assets/img/icon/badge/platinum.png";
import Gold from "../../../assets/img/icon/badge/gold.png";
import Silver from "../../../assets/img/icon/badge/silver.png";
import Bronze from "../../../assets/img/icon/badge/bronze.png";
import Basic from "../../../assets/img/icon/badge/iron.png";
import { List } from "@phosphor-icons/react";
import { formatNumber } from "../../../utils/formatNumber";
import rupee from "../../../assets/img/icon/badge/rupee.png";
import { useGlobalContext } from "../../../Context/Context";
import { useGetAdjustmentQuery } from "../../Store/API/Sales/IncentivePlanApi";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const badgeImageMap = {
  Diamond: Diamond,
  Platinum: Platinum,
  Gold: Gold,
  Silver: Silver,
  Bronze: Bronze,
  Basic: Basic,
};

const Navbar = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.name;
  const deptId = decodedToken.dept_id;
  const loginUserId = decodedToken.id;
  const RoleID = decodedToken.role_id;
  const { salesRoute } = useParams();
  const location = useLocation();
  const [count, setCount] = useState(0);
  // const [loginUserData, setLoginUserData] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const [userBadgeData, setUserBadgeData] = useState();
  const [badgeData, setBadgeData] = useState([]);
  const [badge, setBadge] = useState("");
  const [isActive, setIsActive] = useState(0);
  const { data } = useGlobalContext();
  const { loginUserData, contextData } = useAPIGlobalContext();
  const {
    data: adjustmentData,
    error: adjustmentError,
    isLoading: adjustmentLoading,
    isSuccess: adjustmentSuccess,
  } = useGetAdjustmentQuery(loginUserId);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive((prevIsActive) => (prevIsActive === 0 ? 1 : 0));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const user_role = () => {
    if (RoleID == 1) {
      return "Admin";
    } else if (RoleID == 2) {
      return "Manager";
    } else if (RoleID == 3) {
      return "Office Boy";
    } else if (RoleID == 4) {
      return "User";
    } else if (RoleID == 5) {
      return "HR";
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear("token");
    navigate("/login");
  };

  // Check if the current route contains the word 'sales'
  const isSalesRoute = location.pathname.includes("sales");

  const getUserBadge = async () => {
    try {
      const responseOutstanding = await axios.get(
        baseUrl +
          `sales/badges_sales_booking_data${
            RoleID != 1 ? `?userId=${loginUserId}` : ""
            // `sales/invoice_outstanding_amount${RoleID != 1 ? `?userId=${loginUserId}` : ""
          }`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const responseBadges = await axios.get(`${baseUrl}sales/badges_master`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const badgeDataRes = responseBadges.data.data;
      const userBadgeRes = responseOutstanding.data.data;
      console.log(userBadgeRes, "userBadgeRes");
      const userBadge = badgeDataRes.filter(
        (item) =>
          item.max_rate_amount > userBadgeRes.totalCampaignAmount &&
          item.min_rate_amount < userBadgeRes.totalCampaignAmount
      )[0]?.badge_name;
      // console.log(userBadgeRes, "userBadgeRes")
      setBadge(userBadge);
      setBadgeData(badgeDataRes, "badge data");
      setUserBadgeData(userBadgeRes);
      // console.log(userBadgeRes, "userBadgeRes")
    } catch (error) {
      console.error("Error");
    }
  };

  useEffect(() => {
    console.log("first");
    if (isSalesRoute) {
      console.log("first");
      getUserBadge();
    }
    // getAdjustment();
  }, [data]);

  // useEffect(() => {
  //   axios
  //     .post(baseUrl + "login_user_data", {
  //       user_id: loginUserId,
  //     })
  //     .then((res) => setLoginUserData(res.data));
  // }, []);

  // const fetchData = async () => {
  //   await axios.get(baseUrl + "get_all_unreden_notifications").then((res) => {
  //     setNotificationData(res.data.data);
  //     setCount(res.data.data.length);
  //   });
  // };

  // useEffect(() => {
  //   fetchData();

  //   const intervalId = setInterval(() => {
  //     fetchData();
  //   }, 60000);
  //   return () => clearInterval(intervalId);
  // }, []);

  // const NotificationsOff = async (_id) => {
  //   // e.preventDefault();
  //   await axios.put(`${baseUrl}` + `update_notification/`, {
  //     _id: _id,
  //     readen: true,
  //   });
  //   fetchData();
  // };

  return (
    <>
      {/* Topbar Start */}
      <nav className="navbar navbar-expand topbar ">
        {/* <button className="btn sidebar_tglbtn" id="sidebarToggle">
          <i className="bi bi-list" />
        </button> */}
        <div className="topbarBrand">
          <Link className="branding" to="/admin">
            <div className="logo-1">
              <img className="logo-img" src={logo} alt="logo" width={40} />
            </div>
            <div className="brandtext">
              Creative <span>fuel</span>
            </div>
          </Link>
        </div>
        <ul className="navbar-nav align-items-center ml-auto w-100 blurBg">
          <li className="nav-item ml-0 mr-auto ">
            <label className="icon" htmlFor="nav-toggle" id="sidebarToggle">
              <div className="circle">
                <i className="ph">
                  <List />
                </i>
              </div>
            </label>
          </li>

          {(deptId == 36 ||
            RoleID == 1 ||
            loginUserId == 229 ||
            contextData.find((item) => item?._id == 63)) &&
            isSalesRoute && (
              <li className="nav-item" id="salesBadge">
                <div
                  className="navBadge"
                  // title={`₹ ${userBadgeData?.totalOutstandingAmount || 0}`}
                >
                  <div className="navBadgeImg">
                    <img src={rupee} alt="badge" />
                  </div>
                  <div className="navBadgeTxt">
                    {/* /* <h5>{badge}</h5> */}
                    <Link to="/admin/sales/view-Outstanding-details">
                      <div
                        id="carouselExampleSlidesOnly"
                        className="carousel slide"
                        data-ride="carousel"
                      >
                        <div className="carousel-inner">
                          <div
                            // className={`carousel-item ${isActive === 0 ? "active" : ""
                            //   } `}
                            data-interval="500"
                          >
                            <h4>
                              Total Outstanding: ₹
                              {formatNumber(
                                userBadgeData?.totalOutstandingAmount
                              ) || 0}
                            </h4>
                          </div>
                          <div
                            // class={`carousel-item  ${isActive === 1 ? "active" : ""
                            //   } `}
                            data-interval="1000"
                          >
                            <h4>
                              TDS Outstanding: ₹
                              {formatNumber(
                                userBadgeData?.totalOutstandingAmount -
                                  userBadgeData?.totalUnEarnedOutstandingAmount
                              ) || 0}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="navBadgeTxt">
                    {/* /* <h5>{badge}</h5> */}
                    <div
                      // class={`carousel-item  ${isActive === 1 ? "active" : ""
                      //   } `}
                      data-interval="1000"
                    >
                      <h4>
                        Un-Billed Outstanding: ₹
                        {formatNumber(
                          userBadgeData?.totalUnEarnedOutstandingAmount -
                            userBadgeData?.totalUnEarnedWithInvoiceUploadedOutstandingAmount
                        ) || 0}
                      </h4>
                    </div>
                    <Link to="/admin/sales/view-Outstanding-details">
                      <div
                        id="carouselExampleSlidesOnly"
                        className="carousel slide"
                        data-ride="carousel"
                      >
                        <div className="carousel-inner">
                          <div
                            // class={`carousel-item  ${isActive === 1 ? "active" : ""
                            //   } `}
                            data-interval="1000"
                          >
                            <h4>
                              Billed Outstanding: ₹
                              {formatNumber(
                                userBadgeData?.totalUnEarnedWithInvoiceUploadedOutstandingAmount
                              ) || 0}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </li>
            )}
          {/* )} */}
          {/* <InternetSpeedChecker /> */}

          <li className="nav-item">
            <div className="theme-switch">
              <input type="checkbox" id="theme-toggle" />

              <label htmlFor="theme-toggle">
                <div className="theme-sw icon">
                  <i className="bi bi-brightness-high"></i>
                  <i className="bi bi-moon-stars-fill"></i>
                </div>
              </label>
            </div>
          </li>
          {/* <li>
            {(RoleID == 1 || RoleID == 5) && (
              <div className="nav-item dropdown">
                <a
                  className="nav-link"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div
                    className="icon"
                    data-bs-toggle="collapse"
                    data-bs-target="#Notificationbar"
                    aria-expanded="false"
                    aria-controls="Notificationbar"
                    alt=""
                    width={20}
                  >
                    <i className="bi bi-bell"></i>
                  </div>
                  {/* <NotificationsActiveIcon /> */}
          {/* <span>{count}</span> 
                </a>
                {/* <div className="dropdown-menu notification  dropdown-menu-right shadow animated--grow-in mt1">
                  <div className="pack">
                    <div className="head-label">
                      Notification
                      <span>{count}</span>
                    </div>
                    <div className="pack-1">
                      {notificationData.map((notification) => (
                        <div
                          className="message"
                          id={notificationData._id}
                          key={notification._id}
                          onClick={() => NotificationsOff(notification._id)}
                        >
                          <div className="ppimg">
                            <img src={imageTest1} alt="" w={34} />
                          </div>
                          <div className="txt">
                            {notification.notification_message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link to={`/admin/preonboard/pre-onboard-all-notifications/`}>
                    <div className="all-notification">
                      See all notifications
                    </div>
                  </Link>
                  {/* {notificationData.map((notification) => (
                    <div>
                      <div
                        id={notificationData._id}
                        aria-labelledby="headingOne"
                      >
                        {" - " + notification.notification_message}
                        <DoneIcon
                          onClick={() => NotificationsOff(notification._id)}
                        />
                      </div>
                    </div>
                  ))} 

                {/* <button type="button" className="btn btn-success btn-xs">
                    <Link to={`/admin/preonboard/pre-onboard-all-notifications/`}>
                      See All
                    </Link>
                  </button> 
              </div> 
              </div>
            )}
          </li> */}
          {/* <li className="nav-item dropdown no-arrow user_dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span>{userName}</span>
              {loginUserData[0]?.image == null ? (
                <img className="img-profile" src={imageTest1} />
              ) : (
                // loginUserData.map((d) => (
                <img
                  key={1}
                  className="img-profile"
                  src={loginUserData[0]?.image}
                  alt="user"
                />
                // ))
              )}
            </a>
            <div
              className="dropdown-menu dropdown-menu-right shadow animated--grow-in mt16"
              aria-labelledby="userDropdown"
            >
               <Link to="/profile">
                <a className="dropdown-item">
                  <i className="bi bi-person" />
                  Profile
                </a>
              </Link>   
              <a onClick={handleLogOut} className="dropdown-item">
                <i className="bi bi-box-arrow-left" />
                Logout
              </a>
            </div>
          </li> */}
          <li className="nav-item dropdown no-arrow user_dropdown">
            {/* <a
              className="nav-link dropdown-toggle"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span>{userName}</span>
              {loginUserData[0]?.image == null ? (
                <img className="img-profile" src={lalit} />
              ) : (
                // loginUserData.map((d) => (
                <img
                  key={1}
                  className="img-profile"
                  src={loginUserData[0]?.image}
                  alt="user"
                />
                // ))
              )}
            </a> */}
            <div
              className="profile-sec nav-link dropdown-toggle"
              id="userDropdown"
              data-toggle="dropdown"
              data-bs-toggle="collapse"
              data-bs-target="#Profilebar"
              aria-expanded="false"
              aria-haspopup="true"
              aria-controls="Profilebar"
            >
              {loginUserData?.image_url == null ? (
                <div className="profile-img">
                  <img src={imageTest1} alt="" width={40} />
                </div>
              ) : (
                <img
                  key={1}
                  className="img-profile"
                  src={loginUserData?.image_url}
                  alt="user"
                />
              )}
              <div className="profile-name">
                <p>{userName}</p>
                {/* <span>{user_role()}</span> */}
              </div>
            </div>
            <div
              className="dropdown-menu profilebar dropdown-menu-right shadow animated--grow-in mt16"
              aria-labelledby="userDropdown"
            >
              {/* <div className="profile-tab">
                <div className="profile-img">
                  <img
                    className="logo-img"
                    src={imageTest1}
                    alt=""
                    width={40}
                  />
                </div>
                <div className="profile-name">
                  <p>{userName}</p>
                </div>
              </div> */}
              <div className="pack">
                <Link to="/admin/user/user-profile">
                  <div className="pro-btn">
                    <i className="bi bi-person"></i>
                    <p>My profile</p>
                  </div>
                </Link>
                <Link to="/admin/user/user-timeline">
                  <div className="pro-btn">
                    <i className="bi bi-gear"></i>
                    <p>Timeline</p>
                  </div>
                </Link>
                <div className="pro-btn" onClick={handleLogOut}>
                  <i className="bi bi-box-arrow-right"></i>
                  <p>Logout</p>
                </div>
              </div>
              {/* <a onClick={handleLogOut} className="dropdown-item">
                <i className="bi bi-box-arrow-left" />
                Logout
              </a> */}
            </div>
          </li>
        </ul>
      </nav>
      {/* Topbar End */}
    </>
  );
};
export default Navbar;
