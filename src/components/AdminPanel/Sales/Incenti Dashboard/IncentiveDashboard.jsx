import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import View from "../Account/View/View";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import { useGlobalContext } from "../../../../Context/Context";
import Modal from "react-modal";
import IncentiveRelease from "./IncentiveRelease";
import getDecodedToken from "../../../../utils/DecodedToken";
import { formatNumber } from "../../../../utils/formatNumber";
import {
  CardsThree,
  Dresser,
  CurrencyDollar,
  CoinVertical,
  Money,
} from "@phosphor-icons/react";

const IncentiveDashboard = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const loginUserId = getDecodedToken().id;
  const loginUserRole = getDecodedToken().role_id;
  const [data, setData] = useState([]);
  const [incentiveTotalData, setIncentiveTotalData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusWiseData, setStatusWiseData] = useState([]);
  const [statusWiseIsLoading, setStatusWiseIsLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [salesUserListData, setSalesUserListData] = useState([]);
  const [userListIsLoading, setUserListIsLoading] = useState(false);
  const [selectedYearMonths, setSelectedYearMonths] = useState([]);
  const [releaseModal, setReleaseModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const navigate = useNavigate();
  async function getData(bodyData) {
    if (!bodyData) {
      bodyData = {
        user_ids: [],
        monthYearArray: [],
      };
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        baseUrl + "sales/incentive_calculation_dashboard",
        bodyData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.data.length === 1) {
        setIncentiveTotalData(response.data.data[0]);
        setData(response.data.data[0]?.userWiseIncentiveCalculation);
      } else {
        setData([]);
        setIncentiveTotalData([]);
      }
    } catch (error) {
      // Handle error if needed
      if (error.message !== "Request failed with status code 404")
        toastError(error.message);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or error
    }
  }

  async function getSalesUserList() {
    setUserListIsLoading(true); // Start loading
    try {
      const response = await axios.get(baseUrl + "get_all_sales_users_list", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        // params: { ...bodyData }, // Move params inside the options object
      });

      setSalesUserListData(response.data); // Assuming you want to set the response data
    } catch (error) {
      // Handle error if needed
      toastError(error.message);
    } finally {
      setUserListIsLoading(false); // Stop loading regardless of success or error
    }
  }

  async function getStatusWiseData() {
    setStatusWiseIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        baseUrl + "sales/incentive_calculation_status_wise_data",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setStatusWiseData(response); // Assuming you want to set the response data
    } catch (error) {
      // Handle error if needed
      if (error.message !== "Request failed with status code 404")
        toastError(error.message);
    } finally {
      setStatusWiseIsLoading(false); // Stop loading regardless of success or error
    }
  }

  useEffect(() => {
    getStatusWiseData();
    getSalesUserList();
    getData();
  }, []);

  const generateYearMonthData = (startYear, endYear) => {
    const months = [
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" },
    ];
    const yearMonthData = [];

    for (let year = endYear; year >= startYear; year--) {
      months.forEach((month) => {
        yearMonthData.push({
          id: `${month.id}-${year}`,
          name: `${month.name} ${year}`,
        });
      });
    }

    return yearMonthData;
  };
  const currentYear = new Date().getFullYear();
  const yearMonthDataArray = generateYearMonthData(
    currentYear - 100,
    currentYear
  );

  const handleRelease = async (e, row) => {
    console.log(row);

    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}sales/incentive_request`,
        {
          sales_executive_id: row?.user_id,
          created_by: loginUserId,
          user_requested_amount: row?.incentiveRequestPendingAmount || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      toastAlert("Incentive Release Request Created Successfully");
      getData();
      getStatusWiseData();
      getSalesUserList();
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      name: "S.No",
      renderRowCell: (row, index) => {
        return index + 1;
      },
      width: 50,
    },
    {
      key: "user_name",
      name: "Sales Executive Name",
      renderRowCell: (row) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/admin/sales-user-incentve`, {
                state: { id: row.user_id, name: "monthwise" },
              })
            }
          >
            {row.user_name}
          </div>
        </>
      ),
      width: 150,
    },
    {
      key: "recordServiceAmount",
      name: "Record Service Amount",
      renderRowCell: (row) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/admin/sales-user-incentve`, {
                state: { id: row.user_id, name: "monthwise" },
              })
            }
          >
            {row.recordServiceAmount}
          </div>
        </>
      ),
      width: 150,
    },
    {
      key: "incentiveAmount",
      name: "Incentive Amount",
      width: 150,
      renderRowCell: (row) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/admin/sales-user-incentve`, {
                state: { id: row.user_id, name: "monthwise" },
              })
            }
          >
            {row.incentiveAmount.toFixed(2)}
          </div>
        </>
      ),
    },
    {
      key: "campaignAmount",
      name: "Campaign Amount",
      renderRowCell: (row) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate(`/admin/sales-user-incentve`, {
                state: { id: row.user_id, name: "monthwise" },
              })
            }
          >
            {row.campaignAmount}
          </div>
        </>
      ),
      width: 150,
    },
    {
      key: "earnedIncentiveAmount",
      name: "Earned",
      renderRowCell: (row) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/admin/incentive-status/earned", {
                state: {
                  name: "Earned",
                  id: row.user_id,
                  status: "earned",
                  flag: 1,
                },
              })
            }
          >
            {row.earnedIncentiveAmount.toFixed(2)}
          </div>
        </>
      ),
      width: 150,
    },
    {
      key: "unEarnedIncentiveAmount",
      name: "Unearned",
      renderRowCell: (row) => (
        <>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/admin/incentive-status/earned", {
                state: {
                  name: "Unearned",
                  id: row.user_id,
                  status: "un-earned",
                  flag: 1,
                },
              })
            }
          >
            {row.unEarnedIncentiveAmount.toFixed(2)}
          </div>
        </>
      ),
      width: 150,
    },
    {
      key: "paidAmount",
      name: "Paid Amount",
      width: 150,
    },
    {
      key: "incentiveRequestedAmount",
      name: "Incentive Requested Amount",
      renderRowCell: (row) => (
        <div
          onClick={() =>
            navigate("/admin/user-incenitve", {
              state: {
                id: row.user_id,
                name: row.user_name,
                type: "requested",
              },
            })
          }
        >
          {row.incentiveRequestedAmount.toFixed(2)}
        </div>
      ),
      width: 150,
    },
    {
      key: "incentiveRequestPendingAmount",
      name: "Incentive Request Pending Amount",
      renderRowCell: (row) => row.incentiveRequestPendingAmount.toFixed(2),
      width: 150,
    },
    {
      key: "Request for Release",
      name: "Request for Release",
      renderRowCell: (row) => {
        let buttonView = row?.incentiveButtonShowCondition?.length;
        let disabledState = false;
        if (buttonView == 0 && row?.incentiveRequestPendingAmount == 0) {
          disabledState = true;
        }
        if (buttonView != 0 && row?.totalIncentiveRequestPendingAmount > 0) {
          disabledState = false;
        }
        if (buttonView != 0 && row?.totalIncentiveRequestPendingAmount != 0) {
          disabledState = true;
        }
        if (buttonView == 0 && row?.totalIncentiveRequestPendingAmount > 0) {
          disabledState = false;
        }
        return (
          <div title={disabledState ? "Release Request Already Pending" : ""}>
            {row?.incentiveRequestPendingAmount > 0 && (
              <button
                className="btn btn-primary btn_sm cmnbtn"
                onClick={(e) => handleRelease(e, row)}
                disabled={disabledState}
              >
                Release
              </button>
            )}
          </div>
        );
      },
      width: 150,
    },
    {
      key: "incentiveReleasedAmount",
      name: "Incentive Released Amount",
      renderRowCell: (row) => (
        <div
          onClick={() =>
            navigate("/admin/user-incenitve", {
              state: {
                id: row.user_id,
                name: row.user_name,
                type: "released",
              },
            })
          }
        >
          {row.incentiveReleasedAmount.toFixed(2)}
        </div>
      ),

      width: 150,
    },
  ];

  // const handleRelease = (row) => {
  //   setReleaseModal(true);
  //   setSelectedRow(row);
  // };

  return (
    <div>
      <Modal
        className="salesModal"
        isOpen={releaseModal}
        onRequestClose={() => setReleaseModal(false)}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",
            maxWidth: "900px",
            top: "50px",
            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        <IncentiveRelease
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      </Modal>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Incentive Dashboard"} link={true} />
        </div>
      </div>

      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgPrimaryLight m-0">
                <span>
                  <CardsThree weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">Total Campaign Amount</h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(incentiveTotalData?.totalCampaignAmount)}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgSecondaryLight m-0">
                <span>
                  <Dresser weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">Total Record Service Amount</h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(incentiveTotalData?.totalRecordServiceAmount)}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgTertiaryLight m-0">
                <span>
                  <CurrencyDollar weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">Total Earned</h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(incentiveTotalData?.totalEarnedIncentiveAmount)}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgSuccessLight m-0">
                <span>
                  <CoinVertical weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">Total Unearned</h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(
                    incentiveTotalData?.totalUnEarnedIncentiveAmount
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgWarningLight m-0">
                <span>
                  <Money weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">Sales Amount Received</h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(incentiveTotalData?.totalPaidAmount)}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgInfoLight m-0">
                <span>
                  <Money weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">Release Request Amount</h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(
                    incentiveTotalData?.totalIncentiveRequestedAmount
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgDangerLight m-0">
                <span>
                  <Money weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">
                  Earned Incentive Pending
                </h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(
                    incentiveTotalData?.totalIncentiveRequestPendingAmount
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
          <div className="card">
            <div className="card-body pb20 flexCenter colGap14">
              <div className="iconBadge small bgPrimaryLight m-0">
                <span>
                  <Money weight="duotone" />
                </span>
              </div>
              <div>
                <h6 className="colorMedium">Incentive Released</h6>
                <h6 className="mt4 fs_16">
                  {formatNumber(
                    incentiveTotalData?.totalIncentiveReleasedAmount
                  )}
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="row">
            <CustomSelect
              label={"User"}
              fieldGrid={5}
              dataArray={salesUserListData}
              optionId={"user_id"}
              optionLabel={"user_name"}
              selectedId={selectedUsers}
              setSelectedId={setSelectedUsers}
              required={false}
              multiple={true}
            />

            <CustomSelect
              label={"Year-Month"}
              fieldGrid={5}
              dataArray={yearMonthDataArray}
              optionId={"id"}
              optionLabel={"name"}
              selectedId={selectedYearMonths} // Ensure this state can handle an array of selections
              setSelectedId={setSelectedYearMonths} // Update this function to handle setting an array
              required={false}
              multiple={true}
            />
            <div className="col flexCenter colGap12 pt8">
              <button
                className="cmnbtn btn btn-primary w-100"
                onClick={() => {
                  let payload = {};
                  if (selectedUsers.length === 0) {
                    payload = { monthYearArray: selectedYearMonths };
                  }
                  if (selectedYearMonths.length === 0) {
                    payload = { user_ids: selectedUsers };
                  }
                  if (
                    selectedUsers.length !== 0 &&
                    selectedYearMonths.length !== 0
                  ) {
                    payload = {
                      user_ids: selectedUsers,
                      monthYearArray: selectedYearMonths,
                    };
                  }

                  getData(payload);
                }}
              >
                Search
              </button>
              <button
                className="iconBtn btn btn-outline-danger"
                onClick={() => {
                  getData();
                  setSelectedUsers([]);
                  setSelectedYearMonths([]);
                }}
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <View
        title={"Overview"}
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination
        tableName={"Incentive Overiew Dashboard"}
      />
    </div>
  );
};

export default IncentiveDashboard;
