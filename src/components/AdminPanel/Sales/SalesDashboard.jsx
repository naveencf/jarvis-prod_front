import {
  Blueprint,
  Invoice,
  Scroll,
  Files,
  FileX,
} from '@phosphor-icons/react';
import Modal from 'react-modal';
import View from './Account/View/View';
import { useGlobalContext } from '../../../Context/Context';
import getDecodedToken from '../../../utils/DecodedToken';
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import IncentiveRelease from './Incenti Dashboard/IncentiveRelease';
import FormContainer from '../FormContainer';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';
import formatString from '../../../utils/formatString';
import SalesBadges from './SalesBadges';
import Loader from '../../Finance/Loader/Loader';
import { formatIndianNumber } from '../../../utils/formatIndianNumber';
import MonthlyWeeklyCard from './MonthlyWeeklyCard';
import TargetCard from './TargetCard';
import { useGetAllTargetCompetitionsQuery } from '../../Store/API/Sales/TargetCompetitionApi';
import { useGetTotalSaleAmountDateWiseQuery } from '../../Store/API/Sales/SaleBookingApi';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const loginUserId = getDecodedToken().id;
  const loginUserRole = getDecodedToken().role_id;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [releaseModal, setReleaseModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState('');
  const [weekMonthCard, setWeekMonthCard] = useState();
  const [userBadgeData, setUserBadgeData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [salesBookingGridStat, setSalesBookingGridStat] = useState();
  const [salesBookingStat, setSalesBookingStat] = useState();

  async function getData() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        baseUrl +
        `sales/top20_account_list?userId=${loginUserId}&isAdmin=${loginUserRole == 1
        }`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      const response1 = await axios.get(
        baseUrl +
        `sales/weekly_monthly_quarterly_list?userId=${loginUserId}&isAdmin=${loginUserRole == 1 ? "true" : "false"
        }`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );

      const responseOutstanding = await axios.get(
        baseUrl + `sales/badges_sales_booking_data?userId=${loginUserId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      const salesBookingGridStatus = await axios.get(
        baseUrl + `sales/sale_booking_grid_status_count_list`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      const salesBookingStatus = await axios.get(
        baseUrl + `sales/sale_booking_status_list`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        }
      );
      setSalesBookingGridStat(salesBookingGridStatus.data.data);
      setSalesBookingStat(salesBookingStatus.data.data);

      setUserBadgeData(responseOutstanding.data.data);
      setWeekMonthCard(response1.data.data);
      setData(response.data.data);
    } catch (error) {
      if (error.message !== 'Request failed with status code 404')
        toastError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  const {
    data: allTargetCompetitionsData,
    refetch: refetchTargetCompetitions,
    isError: targetCompetitionsError,
    isLoading: targetCompetitionsLoading,
  } = useGetAllTargetCompetitionsQuery();
 
  useEffect(() => {
    if (!targetCompetitionsLoading && allTargetCompetitionsData) {
      const activeCompetitions = allTargetCompetitionsData?.filter(
        (competition) => competition.status == 1
      );

      if (activeCompetitions?.length > 0) {
        const formattedStartDate =
          activeCompetitions[0].start_date?.split('T')[0];
        const formattedEndDate = activeCompetitions[0].end_date?.split('T')[0];

        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
      }
    }
  }, [targetCompetitionsLoading, allTargetCompetitionsData]); // Add loading check in the dependency

  const { data: totalSaleAmountDateWise, isError: totalSaleAmountError } =
    useGetTotalSaleAmountDateWiseQuery(
      { startDate, endDate },
      { skip: !startDate || !endDate }
    );

  useEffect(() => {
    getData();
  }, []);
  const booking = [
    {
      key: 's.no',
      name: 'S.No',
      renderRowCell: (row, index) => {
        return index + 1;
      },
      width: 70,
    },
    {
      key: 'status',
      name: 'Status',
      width: 150,
    },
    {
      key: 'discription',
      name: 'Description',
      width: 150,
    },
  ];
  const bookingGrid = [
    {
      key: 's.no',
      name: 'S.No',
      renderRowCell: (row, index) => {
        return index + 1;
      },
      width: 70,
    },
    {
      key: 'booking_status',
      name: 'Booking Status',
      width: 150,
    },
    {
      key: 'totalSaleBookingCounts',
      name: 'Total Sale Booking Counts',
      renderRowCell: (row) => {
        return (
          <div
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() =>
              navigate('/admin/view-sales-booking', {
                state: { booking_status: row.booking_status },
              })
            }
          >
            {row.totalSaleBookingCounts}
          </div>
        );
      },
      width: 150,
    },
  ];
  const columns = [
    {
      name: 'S.No',
      renderRowCell: (row, index) => {
        return index + 1;
      },
      width: 50,
    },
    {
      key: 'account_name',
      name: 'Account Name',
      renderRowCell: (row) => (
        <Link
          style={{ color: 'blue' }}
          to={`/sales-account-info/${row?.account_obj_id}`}
        >
          {formatString(row?.account_name)}
        </Link>
      ),
      width: 150,
    },
    // {
    //   key: "created_by_name",
    //   name: "Created By",
    //   renderRowCell: (row) => row.created_by_name,
    //   width: 150,
    // },
    // {
    //   key: "created_by_contact_no",
    //   name: "Created By Contact Number",
    //   renderRowCell: (row) => row.created_by_contact_no,
    //   width: 150,
    // },
    {
      key: 'totalCampaignAmount',
      name: 'Total Campaign Amount',
      renderRowCell: (row) => formatIndianNumber(row.totalCampaignAmount),
      width: 150,
    },
    {
      key: 'totalSaleBookingCounts',
      name: 'Total Sale Booking Counts',
      width: 150,
    },
  ];

  return (
    <div>
      {isLoading && <Loader />}
      <Modal
        className="salesModal"
        isOpen={releaseModal}
        onRequestClose={() => setReleaseModal(false)}
        contentLabel="modal"
        preventScroll={true}
        appElement={document.getElementById('root')}
        style={{
          overlay: {
            position: 'fixed',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            height: '100vh',
          },
          content: {
            position: 'absolute',
            maxWidth: '900px',
            top: '50px',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px',
            maxHeight: '650px',
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
          <FormContainer mainTitle={'Dashboard'} link={true} />
        </div>
        <div className="action_btns">
          {loginUserRole == 1 && <>
            <Link to="/admin/Sales-Point-Of-Contact">
              <button className="btn cmnbtn btn-primary btn_sm">
                View POC
              </button>
            </Link>
            <Link to="/admin/sales-user-report">
              <button className="btn cmnbtn btn-primary btn_sm">
                Sales Report
              </button>
            </Link>
          </>
          }
          <Link to={"/admin/view-target-competition"}>
            <button className="btn cmnbtn btn-primary btn_sm">
              View target competition
            </button>
          </Link>
          <Link to={'/admin/create-sales-account/0'}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Add account
            </button>
          </Link>
          <Link to={'/admin/create-sales-booking'}>
            <button className="btn cmnbtn btn-primary btn_sm">
              Create Sale Booking
            </button>
          </Link>
        </div>
      </div>

      <div className="row mt20">
        <MonthlyWeeklyCard
          data={weekMonthCard?.weeklyData}
          previousData={weekMonthCard?.lastWeekData}
          title="Weekly"
          cardclassName="bgPrimary"
          titleclassName="colorPrimary"
          colorclassName="bgPrimary"
        />

        <MonthlyWeeklyCard
          data={weekMonthCard?.monthlyData}
          previousData={weekMonthCard?.lastMonthData}
          title="Monthly"
          cardclassName="bgSecondary"
          titleclassName="colorSecondary"
          colorclassName="bgSecondary"
        />

        <MonthlyWeeklyCard
          data={weekMonthCard?.quarterlyData}
          previousData={weekMonthCard?.lastQuarterData}
          title="Quarterly"
          cardclassName="bgTertiary"
          titleclassName="colorTertiary"
          colorclassName="bgTertiary"
        />
      </div>

      <div className="row">
        <div className="col">
          <NavLink to="/admin/sales-incentive-overview">
            <div className="card shadow-none bgPrimaryLight">
              <div className="card-body text-center pb20">
                <div className="iconBadge bgPrimaryLight">
                  <span>
                    <Blueprint weight="duotone" />
                  </span>
                </div>
                <h6 className="fs_16">Incentive Plan</h6>
                {/* <h6 className="mt8 fs_16">
                  {formatNumber(incentiveTotalData?.totalCampaignAmount)}
                </h6> */}
              </div>
            </div>
          </NavLink>
        </div>

        <div className="col">
          <NavLink to="/admin/view-invoice-request">
            <div className="card shadow-none bgSecondaryLight">
              <div className="card-body text-center pb20">
                <div className="iconBadge bgSecondaryLight">
                  <span>
                    <Invoice weight="duotone" />
                  </span>
                </div>
                <h6 className="fs_16">Invoice Request List</h6>
                {/* <h6 className="mt8 fs_16">
                  {formatNumber(incentiveTotalData?.totalCampaignAmount)}
                </h6> */}
              </div>
            </div>
          </NavLink>
        </div>

        {loginUserRole === 1 && (
          <div className="col">
            <NavLink to="/admin/sales-incentive-settlement-overview">
              <div className="card shadow-none bgTertiaryLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgTertiaryLight">
                    <span>
                      <Scroll weight="duotone" />
                    </span>
                  </div>
                  <h6 className="fs_16">Incentive Settlement</h6>
                  {/* <h6 className="mt8 fs_16">
                  {formatNumber(incentiveTotalData?.totalCampaignAmount)}
                </h6> */}
                </div>
              </div>
            </NavLink>
          </div>
        )}

        {loginUserRole !== 4 && (
          <div className="col">
            <NavLink to="https://forms.gle/jz7d66xRpska5fWU9">
              <div className="card shadow-none bgSuccessLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgSuccessLight">
                    <span>
                      <Files weight="duotone" />
                    </span>
                  </div>
                  <h6 className="fs_16">Request Plan</h6>
                  {/* <h6 className="mt8 fs_16">
                  {formatNumber(incentiveTotalData?.totalCampaignAmount)}
                </h6> */}
                </div>
              </div>
            </NavLink>
          </div>
        )}

        {loginUserRole === 1 && (
          <div className="col">
            <NavLink to="/admin/deleted-sales-booking">
              <div className="card shadow-none bgDangerLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgDangerLight">
                    <span>
                      <FileX weight="duotone" />
                    </span>
                  </div>
                  <h6 className="fs_16">Deleted Sale Booking</h6>
                  {/* <h6 className="mt8 fs_16">
                  {formatNumber(incentiveTotalData?.totalCampaignAmount)}
                </h6> */}
                </div>
              </div>
            </NavLink>
          </div>
        )}
      </div>

      {allTargetCompetitionsData?.map(
        (data) =>
          data?.status == 1 && (
            <TargetCard
              data={data}
              totalSaleAmountDateWise={totalSaleAmountDateWise}
            />
          )
      )}

      {loginUserRole !== 1 && <SalesBadges userBadgeData={userBadgeData} />}

      {loginUserRole == 1 && (
        <>
          <View
            title={'Sales Booking Status Grid'}
            data={salesBookingGridStat}
            columns={bookingGrid}
            isLoading={isLoading}
            pagination
            tableName={'Sales Booking Status Grid on dashboard'}
          />
          <View
            title={'Sales Booking Status'}
            data={salesBookingStat}
            columns={booking}
            isLoading={isLoading}
            pagination
            tableName={'Sales Booking Statuson dashboard'}
          />
          <View
            title={'Top Bookings'}
            data={data}
            columns={columns}
            isLoading={isLoading}
            pagination={[10]}
            tableName={'Top 20 Account Campaign Amount Wise'}
          />
        </>
      )}
    </div>
  );
};

export default SalesDashboard;
