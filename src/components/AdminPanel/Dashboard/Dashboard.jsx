import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCategory } from "react-icons/md";
import { TbBrandDenodo } from "react-icons/tb";
import { FaProductHunt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import { Avatar, Box, Button } from "@mui/material";
import ChatApplication from "../../Common/ChatApplication";
import { useLocation } from "react-router-dom";
import titleimg from "/bg-img.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Details } from "@mui/icons-material";
import WFHDDahboard from "./WFHDDahboard";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { constant } from "../../../utils/constants";
import OrgTree from "../WFH/OrgTree/OrgTree";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import successIcon from "../../../assets/img/icon/success.png";
import errorIcon from "../../../assets/img/icon/error.png";

function Dashboard() {
  const { RoleIDContext, loginUserData, contextData } = useAPIGlobalContext();

  const [renderCount, setRenderCount] = useState(0);
  const [allsimData, getAllSimData] = useState([]);
  const [logoBrandData, getLogoBrandData] = useState([]);
  const [IntellectualProperty, getIntellectualProperty] = useState([]);
  // const [contextData, setDatas] = useState([]);
  // const [loginUserData, setLoginUserData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [accountsPendingPaymentsCount, setAccountsPendingPaymentsCount] =
    useState([]);

  const navigate = useNavigate();

  function handleSim() {
    navigate();
  }
  function handleBrand() {
    // navigate("/brand-overview");
  }
  function handleDataBrand() {
    navigate("/data-brand-overview");
  }
  function handleIP() {
    navigate("/ip-overview");
  }

  const conditionToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(conditionToken);
  const userId = decodedToken.id;
  const roleId = decodedToken.role_id;

  // useEffect(() => {
  //   if (userId && contextData.length === 0) {
  //     axios
  //       .get(`${baseUrl}` + `get_single_user_auth_detail/${userId}`)
  //       .then((res) => {
  //         setDatas(res.data);
  //       });
  //   }
  //   if (userId) {
  //     axios.get(`${baseUrl}` + `get_single_user/${userId}`).then((res) => {
  //       setLoginUserData(res.data);
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   setRenderCount(renderCount + 1);
  //   // axios.get(baseUrl + "get_all_sims").then((res) => {
  //   //   getAllSimData(res.data.data);
  //   // });
  //   axios.get(baseUrl + "get_logo_data").then((res) => {
  //     getLogoBrandData(res.data);
  //   });
  //   // axios.get(baseUrl + "total_count_data").then((res) => {
  //   //   setAllData(res.data.distinctDataNamesCount);
  //   // });
  //   // axios.get(baseUrl + "get_all_instapages").then((res) => {
  //   //   getIntellectualProperty(res?.data);
  //   // });
  //   // axios.get(baseUrl + "get_finances").then((res) => {
  //   //   const response = res?.data;
  //   //   setAccountsPendingPaymentsCount(
  //   //     response?.filter((item) => item?.status_ == 0)
  //   //   );
  //   // });
  // }, []);

  // if (loginUserData.job_type == "WFHD" && roleId == 4) {
  //   navigate("/admin/wfh-single-user");
  // }

  const AllSimData = allsimData.length;
  const AllLogoBrandData = logoBrandData.length;
  const AllIntellectualProperty = IntellectualProperty.length;
  const AllData = allData;
  const location = useLocation();
  const activeLink = location.pathname;

  return (
    <>
      <div>
        <div className="form-heading">
          <img className="img-bg" src={titleimg} alt="" width={160} />
          <div className="form_heading_title">
            <h1>Dashboard</h1>
            {/* <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">
                    <i className="bi bi-house"></i>
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {activeLink.slice(1).charAt(0).toUpperCase() +
                    activeLink.slice(2)}
                </li>
              </ol>
            </nav> */}
          </div>
          {/* <Link to={`/admin/kra/${userId}`}>
            <button type="button" className="btn btn-outline-primary btn-sm">
              KRA
            </button>
          </Link> */}
        </div>
        <div className="row">
          {/* {contextData && contextData[8] && contextData[8].view_value === 1 && (
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
              <div className="d_infocard card shadow">

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
              </div>
            </div>
          )} */}
          {/* {contextData && contextData[9] && contextData[9].view_value === 1 && (
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
              <div className="d_infocard card shadow">
                <div className="card-body">
                  <div className="d_infocard_txt">
                    <h3>Pantry</h3>
                    <h2>Delivery</h2>
                  </div>
                  <div className="d_infocard_icon">
                    <span>
                      <MdOutlineCategory />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          {/* {contextData &&
            contextData[15] &&
            contextData[15].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
                <div className="d_infocard card shadow">
                  <div className="card-body">
                    <div className="d_infocard_txt">
                      <h3>Pantry</h3>
                      <h2>Manager</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <MdOutlineCategory />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

          {/* {contextData &&
            contextData[12] &&
            contextData[12].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
                <div className="d_infocard card shadow">
                  <div className="card-body" onClick={handleBrand}>
                    <div className="d_infocard_txt">
                      <h3>Logo Brand</h3>
                      <h2>{AllLogoBrandData}</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <TbBrandDenodo />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          {/* {contextData &&
            contextData[39] &&
            contextData[39].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
                <div className="d_infocard card shadow">
                  <div className="card-body" onClick={handleDataBrand}>
                    <div className="d_infocard_txt">
                      <h3>Data</h3>
                      <h2>{AllData}</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <TbBrandDenodo />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          {/* {contextData &&
            contextData[13] &&
            contextData[13].view_value === 1 && (
              <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
                <div className="d_infocard card shadow">
                  <div className="card-body" onClick={handleIP}>
                    <div className="d_infocard_txt">
                      <h3>InstaGram Page</h3>
                      <h2>{AllIntellectualProperty}</h2>
                    </div>
                    <div className="d_infocard_icon">
                      <span>
                        <FaProductHunt />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

          {/* {loginUserData.department_name == "Accounts" && (
            <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
              <div className="d_infocard card shadow">
                <div
                  className="card-body"
                  onClick={() => navigate("/admin/accounts-finance-overview")}
                >
                  <div className="d_infocard_txt">
                    <h3>Pending WFH Payments</h3>
                    <h2>{accountsPendingPaymentsCount?.length}</h2>
                  </div>
                  <div className="d_infocard_icon">
                    <span>
                      <FaProductHunt />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {loginUserData.department_name == "Accounts" &&
            // <div className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12 d_infocard_col mb0">
            //   <div className="d_infocard card shadow">
            //     <div
            //       className="card-body"
            //       onClick={() => navigate("/admin/accounts-finance-dashboard")}
            //     >
            //       <div className="d_infocard_txt">
            //         <h2>Finance Dashboard</h2>
            //         {/* <h2>{accountsPendingPaymentsCount?.length}</h2>  */}
            //       </div>
            //       <div className="d_infocard_icon">
            //         <span>
            //           <FaProductHunt />
            //         </span>
            //       </div>
            //     </div>
            //   </div>
            // </div>
            navigate("/admin/finance-dashboard")}
        </div>

        {RoleIDContext == constant.CONST_MANAGER_ROLE && <OrgTree />}
        {/* <OrgTree /> */}
        {/* {contextData && contextData[55] && contextData[55].view_value === 1 && (
          <WFHDDahboard />
        )} */}

        {/* <div className="statementDoc">
          <div className="statementDocHeader">
            <div className="vendorBox">
              <div className="vendorImg">
                <Avatar alt="Vendor" src="vendor.jpg" ></Avatar>
              </div>
              <div className="vendorTitle">
                <h2>Vendor Name</h2>
                <h4>Info</h4>
              </div>
            </div>
            <div className="stats">
              <div className="statsBox">
                <h4 className="colorSuccess" data-toggle="modal" data-target="#successModal">Credit :</h4>
                <h2>292928.20</h2>
              </div>
              <div className="statsBox">
                <h4 className="colorDanger" data-toggle="modal" data-target="#errorModal">Debit :</h4>
                <h2>188928.00</h2>
              </div>
              <div className="statsBox">
                <h4 className="colorInfo">Balance :</h4>
                <h2>104000.20</h2>
              </div>
            </div>
          </div>
          <div className="statementDocBody table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">S. No.</th>
                  <th>Date & Time</th>
                  <th>Description</th>
                  <th>Debit</th>
                  <th>Credit</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td scope="row">1</td>
                  <td>27 Jan 2025</td>
                  <td>Finance Released Amount</td>
                  <td>188928.00</td>
                  <td>292928.20</td>
                  <td>104000.20</td>
                </tr>
                <tr>
                  <td scope="row">2</td>
                  <td>27 Jan 2025</td>
                  <td>Finance Released Amount</td>
                  <td>188928.00</td>
                  <td>292928.20</td>
                  <td>104000.20</td>
                </tr>
                <tr className="statementDocInfo paid">
                  <td colspan="6">27 Jan 2025 : Paid Advance amount of Rs. 5,00,000 (for campaign) Transaction ID : 4168466364</td>
                </tr>
                <tr>
                  <td scope="row">3</td>
                  <td>27 Jan 2025</td>
                  <td>Finance Released Amount</td>
                  <td>188928.00</td>
                  <td>292928.20</td>
                  <td>104000.20</td>
                </tr>
                <tr>
                  <td scope="row">4</td>
                  <td>27 Jan 2025</td>
                  <td>Finance Released Amount</td>
                  <td>188928.00</td>
                  <td>292928.20</td>
                  <td>104000.20</td>
                </tr>
                <tr className="statementDocInfo receive">
                  <td colspan="6">29 Jan 2025 : Receive amount of Rs. 4,00,000 (for campaign) Transaction ID : 4168466364</td>
                </tr>
                <tr>
                  <td scope="row">5</td>
                  <td>27 Jan 2025</td>
                  <td>Finance Released Amount</td>
                  <td>188928.00</td>
                  <td>292928.20</td>
                  <td>104000.20</td>
                </tr>
                <tr>
                  <td scope="row">6</td>
                  <td>27 Jan 2025</td>
                  <td>Finance Released Amount</td>
                  <td>188928.00</td>
                  <td>292928.20</td>
                  <td>104000.20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Success Modal */}
        <div
          className="modal fade statusModal"
          id="successModal"
          tabindex="-1"
          aria-labelledby="successModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="statusModalImg">
                  <img src={successIcon} />
                </div>
                <div className="statusModalText">
                  <h2>Success</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </div>
              <div className="modal-footer text-center">
                <button
                  type="button"
                  className="btn cmnbtn btn-success"
                  data-dismiss="modal"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Modal */}
        <div
          className="modal fade statusModal"
          id="errorModal"
          tabindex="-1"
          aria-labelledby="errorModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="statusModalImg">
                  <img src={errorIcon} />
                </div>
                <div className="statusModalText">
                  <h2>Error !</h2>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                </div>
              </div>
              <div className="modal-footer text-center">
                <button
                  type="button"
                  className="btn cmnbtn btn-danger"
                  data-dismiss="modal"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <ChatApplication /> */}
    </>
  );
}
export default Dashboard;
