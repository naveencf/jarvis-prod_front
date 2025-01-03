import { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import DeleteButton from '../DeleteButton';
import { Link } from 'react-router-dom';
import { Box, Grid, Skeleton } from '@mui/material';
import View from '../Sales/Account/View/View';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HouseSidingIcon from '@mui/icons-material/HouseSiding';
import { City } from '@phosphor-icons/react';
import { setRowData, setShowBankDetailsModal, setShowWhatsappModal } from '../../Store/PageOverview';
import { useDispatch } from 'react-redux';
import VendorWhatsappLinkModla from './VendorWhatsappLinkModla';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import VendorPageModal from './VendorPageModal';
import { useGetAllVendorQuery, useGetAllVendorTypeQuery, useGetPmsPayCycleQuery, useGetPmsPaymentMethodQuery, useGetPmsPlatformQuery } from '../../Store/reduxBaseURL';
import VendorBankDetailModal from './VendorBankDetailModal';
import VendorDetails from './Vendor/VendorDetails';
import { useGetAllPageListQuery, useGetCountDocumentsQuery } from '../../Store/PageBaseURL';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';
import formatString from '../Operation/CampaignMaster/WordCapital';
import UploadBulkVendorPages from './Vendor/BulkVendor/UploadBulkVendorPages';
import { constant } from '../../../utils/constants';
import VendorMPriceModal from './VendorMPriceModal';
import { formatNumber } from '../../../utils/formatNumber';
import CustomTableV2 from '../../CustomTable_v2/CustomTableV2';
import VendorDocCount from './Vendor/VendorDocCount';

const VendorOverview = () => {
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  console.log(decodedToken, 'decodedToken');


  const dispatch = useDispatch();

  const [vendorDetails, setVendorDetails] = useState(null);
  const [openUpdateVendorMPrice, setOpenUpdateVendorMPrice] = useState(false);
  const [rowVendor, setRowVendor] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const token = sessionStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('Tab1');
  const [tabFilterData, setTabFilterData] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [platformCounts, setPlatformCounts] = useState([]);
  const [stateDataS, setStateDataS] = useState([]);
  const [cityDataS, setCityDataS] = useState([]);
  const [vendorDocsCountData, setVendorDocsCountData] = useState([]);
  const { data: pageList } = useGetAllPageListQuery();
  const [getRowData, setGetRowData] = useState([]);

  const { data: vendor } = useGetAllVendorTypeQuery();
  const typeData = vendor?.data;
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data;
  const { data: vendordocumentCount } = useGetCountDocumentsQuery();

  const { data: cycle } = useGetPmsPayCycleQuery();

  const [closedByCount, setClosedByCount] = useState([]);

  const cycleData = cycle?.data;
  const { data: vendorData, isLoading: loading, refetch: refetchVendor } = useGetAllVendorQuery();

  const handleUpdateVendorMPrice = (row) => {
    setOpenUpdateVendorMPrice(true);
    setRowVendor(row);
  };
  const handleCloseVendorMPriceModal = () => {
    setOpenUpdateVendorMPrice(false);
  };

  const getData = () => {
    refetchVendor();
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // if (vendorData) {
    //   setFilterData(vendorData?.data);
    //   setTabFilterData(vendorData?.data);
    // }
    if (vendorData) {
      // if (decodedToken.role_id !== 1) {
      //   setFilterData(vendorData)
      //   //   vendorData.filter((item) => item.created_by == decodedToken.id)
      //   // );
      //   setTabFilterData(vendorData)
      //   //   vendorData.filter((item) => item.created_by == decodedToken.id)
      //   // );
      // } else {
      setFilterData(vendorData);
      setTabFilterData(vendorData);
      // }
    }
  }, [vendorData]);

  const handleOpenWhatsappModal = (row) => {
    return () => {
      dispatch(setShowWhatsappModal());
      dispatch(setRowData(row));
    };
  };

  const handleOpenBankDetailsModal = (row) => {
    return () => {
      dispatch(setShowBankDetailsModal());
      dispatch(setRowData(row));
    };
  };

  const handleClickVendorName = (params) => {
    // setVendorDetails(params.row);

    setVendorDetails(params);
  };

  const showPagesOfVendor = async (data) => {
    try {
      let result;

      result = await axios.get(`${baseUrl}v1/vendor_wise_page_master_data/${data._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setPageData(result.data.data);
    } catch (error) {
      console.error('Error fetching vendor pages:', error);
    }
  };

  useEffect(() => {
    function getUniqueStatesWithCounts() {
      const stateData = {};
      for (let i = 0; i < filterData?.length; i++) {
        const state = filterData[i].home_state;
        const vendorName = filterData[i].vendor_name;

        if (state) {
          if (!stateData[state]) {
            stateData[state] = {
              count: 1,
              filterData: [vendorName],
            };
          } else {
            stateData[state].count++;
            stateData[state].filterData.push(vendorName);
          }
        }
      }
      setStateDataS(stateData);
    }

    function getUniqueCitiesWithCounts() {
      const cityData = {};
      for (let i = 0; i < filterData?.length; i++) {
        const city = filterData[i].home_city;
        const vendorName = filterData[i].vendor_name;

        if (city) {
          if (!cityData[city]) {
            cityData[city] = {
              count: 1,
              filterData: [vendorName],
            };
          } else {
            cityData[city].count++;
            cityData[city].filterData.push(vendorName);
          }
        }
      }
      setCityDataS(cityData);
    }
    getUniqueStatesWithCounts();
    getUniqueCitiesWithCounts();
  }, [filterData]);

  const columns = [
    {
      key: 'S.No',
      name: 'S.No',
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: 'page_name',
      name: 'Page Name',
      renderRowCell: (row) => (
        <a href={row.page_link} target="blank">
          {formatString(row.page_name)}
        </a>
      ),
      width: 200,
    },

    {
      key: 'followers',
      name: 'Followers',
      // renderRowCell: (row) => row.followers_count,
      renderRowCell: (row) => {
        let followerCount = Math.max(0, row?.followers_count || 0);
        return formatNumber(followerCount);
      },
      width: 200,
    },
    // {
    //   key: "Ownership Type",
    //   name: "Ownership Type",
    //   renderRowCell: (row) => row.ownership_type,
    //   width: 200,
    // },
    {
      key: 'Post Price',
      name: 'Post Price',
      width: 200,
      renderRowCell: (row) => {
        const postData = row?.page_price_list?.find((item) => item?.instagram_post !== undefined);
        const postPrice = postData ? postData.instagram_post : 0;
        return postPrice > 0 ? Number(postPrice) : 0;
      },
      compare: true,
    },
    {
      key: 'Story Price',
      name: 'Story Price',
      width: 200,
      renderRowCell: (row) => {
        const storyData = row?.page_price_list?.find((item) => item?.instagram_story !== undefined);
        const storyPrice = storyData ? storyData.instagram_story : 0;
        return storyPrice > 0 ? Number(storyPrice) : 0;
      },
      compare: true,
    },
    {
      key: 'Both Price',
      name: 'Both Price',
      width: 200,
      renderRowCell: (row) => {
        const bothData = row?.page_price_list?.find((item) => item?.instagram_both !== undefined);
        const bothPrice = bothData ? bothData.instagram_both : 0;
        return bothPrice;
      },
      compare: true,
    },
    {
      key: 'm_story_price',
      name: 'M Story',
      width: 200,
      renderRowCell: (row) => {
        const storyData = row?.page_price_list?.find((item) => item?.instagram_m_story !== undefined);
        const storyPrice = storyData ? storyData.instagram_m_story : 0;
        return storyPrice;
      },
      compare: true,
    },
    {
      key: 'm_post_price',
      name: 'M Post',
      width: 200,
      renderRowCell: (row) => {
        const postData = row?.page_price_list?.find((item) => item?.instagram_m_post !== undefined);
        const postPrice = postData ? postData.instagram_m_post : 0;
        return postPrice;
      },
      compare: true,
    },
    {
      key: 'm_both_price',
      name: 'M Both',
      width: 200,
      renderRowCell: (row) => {
        const bothData = row?.page_price_list?.find((item) => item?.instagram_m_both !== undefined);
        const bothPrice = bothData ? bothData.instagram_m_both : 0;
        return bothPrice;
      },
      compare: true,
    },
  ];

  const dataGridcolumns = [
    {
      key: 'sno',
      name: 'S.NO',
      width: 80,
      renderRowCell: (row, index) => {
        return index + 1;
      },
    },
    {
      key: 'vendorPercentage',
      name: 'Vendor %',
      width: 150,
      renderRowCell: (row) => {
        const fields = ['vendor_name', 'email', 'mobile', 'home_address', 'payment_method', 'Pincode'];
        const totalFields = fields?.length;
        let filledFields = 0;

        fields.forEach((field) => {
          if (row[field] && row[field] !== 0) {
            filledFields++;
          }
        });

        const percentage = (filledFields / totalFields) * 100;

        if (percentage === 100) {
          return 'Full';
        } else if (percentage > 50) {
          return 'More than Partial';
        } else {
          return 'Less than Partial';
        }
      },
    },
    {
      key: 'vendor_name',
      name: 'Vendor Name',
      width: 200,
      // editable: true,
      renderRowCell: (row) => {
        return (
          <div onClick={() => handleClickVendorName(row)} className="link-primary cursor-pointer text-truncate">
            {formatString(row.vendor_name)}
          </div>
        );
      },
    },
    {
      key: 'Price_Update',
      name: 'Price Update',
      renderRowCell: (row) => {
        return (
          <div>
            {
              <button title="Price Update" onClick={() => handleUpdateVendorMPrice(row)} className="btn cmnbtn btn_sm btn-outline-primary">
                Price Update
              </button>
            }
          </div>
        );
      },
      width: '20%',
    },
    {
      key: 'vendor_category',
      name: 'Vendor Category',
      width: 150,
    },
    {
      key: 'primary_page',
      name: 'Primary Page',
      width: 200,
      renderRowCell: (row) => {
        // let name = pageList?.data?.find(
        //   (ele) => ele._id === row.primary_page
        // )?.page_name;
        // return name ?? 'NA';
        return row?.primary_page_name;
      },
    },
    {
      key: 'page_count',
      name: 'Page Count',
      renderRowCell: (row) => {
        return (
          <button title="Page Count" className="btn btn-outline-primary btn-sm user-button" onClick={() => showPagesOfVendor(row)} data-toggle="modal" data-target="#myModal">
            {row.page_count}
            {/* <OpenWithIcon /> */}
          </button>
        );
      },
    },
    {
      key: 'mobile',
      name: 'Mobile',
      width: 200,
      editable: true,
    },
    {
      key: 'email',
      name: 'Email',
      width: 200,
      editable: true,
    },
    {
      key: 'Pincode',
      name: 'Home Pincode',
      width: 200,
      editable: true,
    },
    {
      key: 'home_city',
      name: 'Home City',
      width: 200,
      editable: true,
    },
    {
      key: 'home_state',
      name: 'Home State',
      width: 200,
      editable: true,
    },
    {
      key: 'home_address',
      name: 'Home Address',
      width: 200,
      editable: true,
    },
    {
      key: 'vendor_type',
      name: 'Vendor Type',
      renderRowCell: (row) => {
        return typeData?.find((item) => item?._id == row?.vendor_type)?.type_name;
      },
      width: 200,
      editable: true,
    },
    {
      key: 'vendor_platform',
      name: 'Platform',
      renderRowCell: (row) => {
        const fun = platformData?.find((item) => item?._id == row?.vendor_platform)?.platform_name;
        return formatString(fun);
      },
      width: 200,
      editable: true,
    },
    {
      key: 'pay_cycle',
      name: 'Cycle',
      width: 200,
      renderRowCell: (row) => {
        return cycleData?.find((item) => item?._id == row?.pay_cycle)?.cycle_name;
      },
      // renderRowCell: (params) => {
      //   let name = cycleData?.find(
      //     (item) => item?._id == params.row?.pay_cycle
      //   )?.cycle_name;
      //   return <div>{name}</div>;
      // },
      editable: true,
    },
    {
      key: 'Bank Details',
      name: 'Bank Details',
      width: 200,
      renderRowCell: (row) => {
        return (
          <button title="Bank Details" className="btn btn-outline-primary btn-sm user-button" onClick={handleOpenBankDetailsModal(row)}>
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      key: 'whatsapp_link',
      name: 'Whatsapp Link',
      width: 200,
      renderRowCell: (row) => {
        return (
          <button title="Whatsapp Link" className="btn btn-outline-primary btn-sm user-button" onClick={handleOpenWhatsappModal(row)}>
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      key: 'action',
      name: 'Action',
      width: 200,
      renderRowCell: (row) => (
        <>
          {/* {contextData && ( */}
          <Link to={`/admin/pms-vendor-master/${row._id}`}>
            <button title="Edit" className="btn btn-outline-primary btn-sm user-button">
              <FaEdit />{' '}
            </button>
          </Link>
          {/* )} */}
          {decodedToken.role_id == 1 && (
            <div onClick={() => deletePhpData(row)}>
              <DeleteButton endpoint="v1/vendor" id={row._id} getData={getData} />
            </div>
          )}
        </>
      ),
    },
  ];

  const deletePhpData = async (row) => {
    await axios.delete(baseUrl + `node_data_to_php_delete_vendor`, {
      vendor_id: row.vendor_id,
    });
  };

  useEffect(() => {
    const fetchVendorCounts = async () => {
      try {
        const response = await axios.get(`${baseUrl}v1/get_vendor_counts`);
        setClosedByCount(response.data.data.pageClosedBYCounts);
      } catch (error) {
        console.error('Error fetching vendor counts:', error.message);
      }
    };

    fetchVendorCounts();
  }, []);

  // for category statistics
  useEffect(() => {
    const countVendorCategories = (tabFilterData) => {
      const counts = {};
      tabFilterData.forEach((item) => {
        const category = item.vendor_category;
        counts[category] = (counts[category] || 0) + 1;
      });
      return counts;
    };

    const counts = countVendorCategories(tabFilterData);
    setCategoryCounts(counts);
  }, [tabFilterData]);

  // for platform statistics
  useEffect(() => {
    const platformCountsMap = {};
    for (const vendor of tabFilterData) {
      const platformId = vendor.vendor_platform;
      const platform = platformData?.find((item) => item._id === platformId);
      if (platform) {
        const platformName = platform.platform_name;
        if (platformCountsMap[platformId]) {
          platformCountsMap[platformId].count++;
        } else {
          platformCountsMap[platformId] = {
            platform_name: platformName,
            count: 1,
          };
        }
      }
    }
    const platformCountsArray = Object.keys(platformCountsMap).map((platformId) => ({
      platform_id: platformId,
      platform_name: platformCountsMap[platformId].platform_name,
      count: platformCountsMap[platformId].count,
    }));
    setPlatformCounts(platformCountsArray);
  }, [tabFilterData, platformData]);

  const vendorWithNoMobileNum = () => {
    const vendorwithnomobilenum = tabFilterData.filter((item) => item.mobile == 0);
    setFilterData(vendorwithnomobilenum);
    setActiveTab('Tab1');
  };
  const vendorWithNoEmail = () => {
    const vendorwithnoemail = tabFilterData.filter((item) => item.email == '');
    setFilterData(vendorwithnoemail);
    setActiveTab('Tab1');
  };
  const vendorWithNoPages = () => {
    const vendorwithnopages = tabFilterData.filter((item) => item.page_count == 0);
    setFilterData(vendorwithnopages);
    setActiveTab('Tab1');
  };
  const vendorWithCategories = (category) => {
    const vendorwithcategories = tabFilterData.filter((item) => item.vendor_category == category);
    setFilterData(vendorwithcategories);
    setActiveTab('Tab1');
  };
  const vendorWithPlatforms = (platform) => {
    const vendorwithplatforms = tabFilterData.filter((item) => item.vendor_platform == platform);
    setFilterData(vendorwithplatforms);
    setActiveTab('Tab1');
  };
  const vendorClosedBy = (closeby) => {
    const vendorclosedby = tabFilterData.filter((item) => item.closed_by == closeby);
    setFilterData(vendorclosedby);
    setActiveTab('Tab1');
  };
  useEffect(() => {
    if (vendorDocsCountData?.length) {
      console.log('vendorDocs', vendorDocsCountData);
      setFilterData(vendorDocsCountData);
      setActiveTab('Tab1');
    }
  }, [vendorDocsCountData]);
  const ExportData = () => {
    return decodedToken?.role_id == 1;  // returns false if role_id is not 1, otherwise true
  }
  return (
    <>
      <VendorMPriceModal open={openUpdateVendorMPrice} onClose={handleCloseVendorMPriceModal} rowData={rowVendor} />
      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog" style={{ maxWidth: '40%' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Vendor Pages - {formatString(pageData[0]?.vendor_name)}</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <CustomTableV2
                columns={columns}
                data={pageData}
                // isLoading={false}
                // title={"Vendor-Pages"}
                tableName={'Vendor-Pages : Price'}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={activeTab === 'Tab1' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab1')}>
          Overview
        </button>
        <button className={activeTab === 'Tab2' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab2')}>
          Statistics
        </button>
        <button className={activeTab === 'Tab3' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab3')}>
          State/City Wise
        </button>
      </div>

      <div className="content">
        {activeTab === 'Tab1' && (
          <div>
            {filterData && (
              <div className="card">
                {vendorDetails && <VendorDetails vendorDetails={vendorDetails} setVendorDetails={setVendorDetails} />}
                <VendorWhatsappLinkModla />
                <div className="card-header flexCenterBetween">
                  <h5 className="card-title">Vendor : {vendorData?.length}</h5>
                  <div className="flexCenter colGap8">
                    <Link to={`/admin/pms-vendor-master`} className="btn cmnbtn btn_sm btn-outline-primary">
                      Add Vendor <i className="fa fa-plus" />
                    </Link>
                    <Link to={`/admin/pms-page-overview`} className="btn cmnbtn btn_sm btn-outline-primary">
                      Page <KeyboardArrowRightIcon />
                    </Link>
                  </div>
                </div>
                <div className="data_tbl thm_table table-responsive card-body p0">
                  {loading ? (
                    <Box mt={2} ml={2} mb={3} sx={{ width: '95%' }}>
                      <Grid container spacing={{ xs: 1, md: 10 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {Array.from(Array(5)).map((_, index) => (
                          <Grid item md={1} key={index}>
                            <Skeleton
                              sx={{
                                width: '100%',
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {Array.from(Array(30)).map((_, index) => (
                          <Grid item xs={2} sm={2} md={2} key={index}>
                            <Skeleton
                              animation="wave"
                              sx={{
                                width: '100%',
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (

                    <View
                      version={1}
                      columns={dataGridcolumns}
                      data={filterData}
                      isLoading={false}
                      title="Vendor Overview"
                      rowSelectable={true}
                      pagination={[100, 200, 1000]}
                      tableName="Vendor Overview"
                      selectedData={setGetRowData}
                      exportData={ExportData}
                    />
                  )}
                </div>
                <VendorBankDetailModal />
                <VendorPageModal />
                <VendorWhatsappLinkModla />
              </div>
            )}
          </div>
        )}
        {activeTab === 'Tab2' && (
          <div className="vendor-container">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with categories</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12" key={Math.random()}>
                      <div className="card" key={category} onClick={() => vendorWithCategories(category)}>
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <Brightness6Icon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{category}</h6>
                            <h6 className="mt4 fs_16">{count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card" onClick={vendorWithNoPages}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Vendor with 0 pages</h6>
                      <h6 className="mt4 fs_16">{tabFilterData.filter((item) => item.page_count == 0)?.length}</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card" onClick={vendorWithNoMobileNum}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Vendor with no mobile number</h6>
                      <h6 className="mt4 fs_16">{tabFilterData.filter((item) => item.mobile == 0)?.length}</h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card" onClick={vendorWithNoEmail}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Vendor with no email id</h6>
                      <h6 className="mt4 fs_16">{tabFilterData.filter((item) => item.email == '')?.length}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with platforms</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {platformCounts.map((item, index) => (
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12" key={index}>
                      <div className="card" key={index} onClick={() => vendorWithPlatforms(item.platform_id)}>
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <AccountCircleIcon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{item.platform_name}</h6>
                            <h6 className="mt4 fs_16">{item.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <VendorDocCount documents={vendordocumentCount} setVendorDocsCountData={setVendorDocsCountData} />
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor Closed By</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {closedByCount.map((item, index) => (
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12" key={index}>
                      <div className="card" key={index} onClick={() => vendorClosedBy(item.closed_by)}>
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <AccountCircleIcon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{item.user_name}</h6>
                            <h6 className="mt4 fs_16">{item.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* {console.log(platformCounts)} */}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'Tab3' && (
          <div className="vendor-container">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with State</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(stateDataS).map(([state, data]) => (
                    <div key={state} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div
                        className="card"
                        key={state}
                      // onClick={() => vendorWithCategories(state)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <HouseSidingIcon />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{state}</h6>
                            <h6 className="mt4 fs_16">{data.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with City</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(cityDataS).map(([city, data]) => (
                    <div key={city} className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div
                        className="card"
                        key={city}
                      // onClick={() => vendorWithCategories(city)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div className="iconBadge small bgPrimaryLight m-0">
                            <span>
                              <City size={32} />
                            </span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{city}</h6>
                            <h6 className="mt4 fs_16">{data.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorOverview;
