import React, { use, useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import View from "../Account/View/View";
import { useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import axios from "axios";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useGlobalContext } from "../../../../Context/Context";
import { set } from "date-fns";
import {
  Blueprint,
  Invoice,
  Scroll,
  CurrencyDollar,
  CoinVertical,
  CheckSquare,
} from "@phosphor-icons/react";

const UserIncentive = () => {
  const token = getDecodedToken();
  const { toastAlert, toastError } = useGlobalContext();

  let loginUserId;
  const loginUserRole = token.role_id;

  loginUserId = token.id;
  let userData = useLocation().state || {};

  if (!userData.id) {
    userData = {
      ...userData,

      name: "monthwise",
      id: loginUserId,
    };
  }
  const Navigate = useNavigate();
  const [monthWiseData, setMonthWiseData] = useState([]);
  const [ismonthWiseDataLoading, setIsMonthWiseDataLoading] = useState(false);
  const [userIncentiveData, setUserIncentiveData] = useState();
  const [buttonView, setButtonView] = useState();
  const [disabledsate, setDisabledState] = useState(false);
  const [releaseButtonConditiondata, setReleaseButtonConditionData] = useState(
    {}
  );
  useEffect(() => {
    if (
      buttonView == 0 &&
      userIncentiveData?.totalIncentiveRequestPendingAmount == 0
    ) {
      setDisabledState(true);
    }
    if (
      buttonView != 0 &&
      userIncentiveData?.totalIncentiveRequestPendingAmount > 0
    ) {
      setDisabledState(false);
    }
    if (
      buttonView != 0 &&
      userIncentiveData?.totalIncentiveRequestPendingAmount != 0
    ) {
      setDisabledState(true);
    }
    if (
      buttonView == 0 &&
      userIncentiveData?.totalIncentiveRequestPendingAmount > 0
    ) {
      setDisabledState(false);
    }
  }, [buttonView, userIncentiveData]);

  async function getMonthWiseData() {
    setIsMonthWiseDataLoading(true);
    try {
      if (userData.name === "monthwise") {
        const response = await axios.get(
          `${baseUrl}sales/incentive_calculation_month_wise/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        const incentiveCalculation = await axios.post(
          `${baseUrl}sales/incentive_calculation_dashboard?userId=${userData.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        const releaseButtonResponse = await axios.get(
          `${baseUrl}sales/incentive_released_button_condition/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        const releaseButtonCondition = releaseButtonResponse?.data?.data;
        setReleaseButtonConditionData(releaseButtonCondition);

        const count = Object.keys(releaseButtonCondition)?.length;
        setButtonView(count);

        setUserIncentiveData(incentiveCalculation.data.data[0]);
        setMonthWiseData(response.data.data.monthYearWiseIncentiveCalculation);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsMonthWiseDataLoading(false);
    }
  }

  useEffect(() => {
    getMonthWiseData();
  }, []);

  const handleRelease = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}sales/incentive_request`,
        {
          sales_executive_id: userData?.id,
          created_by: loginUserId,
          user_requested_amount:
            userIncentiveData?.totalIncentiveRequestPendingAmount || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      toastAlert("Released Successfully");
      getMonthWiseData();
    } catch (error) {
      toastError(error);
    }
  };

  const columns = [
    {
      key: "s.no",
      name: "S.No",
      width: 50,
      renderRowCell: (row, index) => index + 1,
    },
  ];
  if (userData.name === "monthwise") {
    const monthwise = [
      {
        key: "month",
        name: "Month Year",
        width: 100,
        renderRowCell: (row) => row.monthYear,
        compare: true,
      },
      {
        key: "balanceAmount",
        name: "Balance Amount",
        width: 100,
        renderRowCell: (row) => row.balanceAmount.toFixed(2),
      },
      {
        key: "campaignAmount",
        name: "Campaign Amount",
        width: 100,
        renderRowCell: (row) => row.campaignAmount.toFixed(2),
      },
      {
        key: "earnedIncentiveAmount",
        name: "Earned Incentive Amount",
        width: 100,
        renderRowCell: (row) => (
          <div
            className="hov-pointer"
            onClick={() =>
              Navigate("/admin/incentive-status/earned", {
                state: {
                  name: "Earned",
                  id: userData.id,
                  month: row.monthYear,
                  status: "earned",
                  flag: 0,
                },
              })
            }
          >
            {row.earnedIncentiveAmount.toFixed(2)}{" "}
          </div>
        ),
      },
      {
        key: "incentiveAmount",
        name: "Incentive Amount",
        width: "100",
        renderRowCell: (row) => row.incentiveAmount.toFixed(2),
      },
      {
        key: "paidAmount",
        name: "Paid Amount",
        width: "100",
        renderRowCell: (row) => row.paidAmount.toFixed(2),
      },
      {
        key: "recordServiceAmount",
        name: "Record Service Amount",
        width: "100",
        renderRowCell: (row) => row.recordServiceAmount,
      },
      {
        key: "totalDocuments",
        name: "Total Documents",
        width: "100",
        renderRowCell: (row) => row.totalDocuments,
      },
      {
        key: "unEarnedIncentiveAmount",
        name: "Unearned Incentive Amount",
        width: "100",
        renderRowCell: (row) => (
          <div
            className="hov-pointer"
            onClick={() =>
              Navigate("/admin/incentive-status/un-earned", {
                state: {
                  name: "Un-Earned",
                  id: userData.id,
                  month: row.monthYear,
                  status: "un-earned",
                  flag: 0,
                },
              })
            }
          >
            {row.unEarnedIncentiveAmount.toFixed(2)}
          </div>
        ),
      },
    ];
    columns.push(...monthwise);
  }
  return (
    <>
      <div>
        <div className="action_heading">
          <div className="action_title">
            <FormContainer mainTitle={"User Incentive"} link={true} />
          </div>
          <div className="action_btns">
            <div
              title={
                disabledsate &&
                  releaseButtonConditiondata?.finance_status === "pending"
                  ? "Pending from finance side"
                  : ""
              }
            >
              <button
                className="btn btn_sm cmnbtn btn-primary mb-4"
                onClick={handleRelease}
                disabled={disabledsate}
              >
                Release
              </button>
            </div>
          </div>
        </div>

        <div className="row mt24">
          {loginUserRole === 1 &&
            <>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge bgPrimaryLight m-0">
                      <span>
                        <Blueprint weight="duotone" />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Total Incentive Amount</h6>
                      <h6 className="mt8 fs_16">
                        {userIncentiveData?.totalIncentiveAmount.toFixed(2)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card">
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge bgSecondaryLight m-0">
                      <span>
                        <CurrencyDollar weight="duotone" />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Total Earned Incentive</h6>
                      <h6 className="mt8 fs_16">
                        {userIncentiveData?.totalEarnedIncentiveAmount.toFixed(2)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div></>}
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body pb20 flexCenter colGap14">
                <div className="iconBadge bgTertiaryLight m-0">
                  <span>
                    <CoinVertical weight="duotone" />
                  </span>
                </div>
                <div>
                  <h6 className="colorMedium">Total Unearned Incentive</h6>
                  <h6 className="mt8 fs_16">
                    {userIncentiveData?.totalUnEarnedIncentiveAmount.toFixed(2)}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          {loginUserRole === 1 && <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body pb20 flexCenter colGap14">
                <div className="iconBadge bgSuccessLight m-0">
                  <span>
                    <Scroll weight="duotone" />
                  </span>
                </div>
                <div>
                  <h6 className="colorMedium">Total Release Request</h6>
                  <h6 className="mt8 fs_16">
                    {userIncentiveData?.totalIncentiveRequestedAmount.toFixed(
                      2
                    )}
                  </h6>
                </div>
              </div>
            </div>
          </div>}
          <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body pb20 flexCenter colGap14">
                <div className="iconBadge bgInfoLight m-0">
                  <span>
                    <Invoice weight="duotone" />
                  </span>
                </div>
                <div>
                  <h6 className="colorMedium">Total Release Request Pending</h6>
                  <h6 className="mt8 fs_16">
                    {userIncentiveData?.totalIncentiveRequestPendingAmount.toFixed(
                      2
                    )}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          {loginUserRole === 1 && <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
            <div className="card">
              <div className="card-body pb20 flexCenter colGap14">
                <div className="iconBadge bgWarningLight m-0">
                  <span>
                    <CheckSquare weight="duotone" />
                  </span>
                </div>
                <div>
                  <h6 className="colorMedium">Total Release Completed</h6>
                  <h6 className="mt8 fs_16">
                    {userIncentiveData?.totalIncentiveReleasedAmount.toFixed(2)}
                  </h6>
                </div>
              </div>
            </div>
          </div>}
        </div>

        <View
          columns={columns}
          data={monthWiseData}
          title={"User Overview"}
          tableName={"sales-individual-incentive-table"}
          pagination
          isLoading={ismonthWiseDataLoading}
        />
      </div>
    </>
  );
};

export default UserIncentive;
