/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, DownloadSimple, Eye, FloppyDiskBack, StackMinus } from '@phosphor-icons/react';
import { Box, Typography, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tooltip, IconButton, TextField } from '@mui/material';
import * as XLSX from 'xlsx-js-style';
// import ExcelJS from 'exceljs';
import ExcelPreviewModal from './ExcelPreviewModal';
import formatString from '../../../utils/formatString';
import axios from 'axios';
import { baseUrl } from '../../../utils/config';
import { downloadExcel, getPlatformName } from './downloadExcel';
import { formatIndianNumber } from '../../../utils/formatIndianNumber';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { calculatePrice } from './helper';
import { useUploadExcelMutation } from '../../Store/reduxBaseURL';

// Function to download an image as base64 using ArrayBuffer and Uint8Array
// async function downloadImageToBase64(url) {
//   const response = await axios.get(url, { responseType: 'arraybuffer' });
//   const binary = new Uint8Array(response.data);
//   const binaryString = binary.reduce(
//     (acc, byte) => acc + String.fromCharCode(byte),
//     ''
//   );
//   return `data:image/jpeg;base64,${btoa(binaryString)}`; // Adjust for correct image type if necessary
// }

const LeftSideBar = ({
  totalFollowers,
  totalCost,
  totalPostsPerPage,
  id,
  setMergeCatList,
  totalPagesSelected,
  totalDeliverables,
  totalStoriesPerPage,
  pageCategoryCount,
  selectedRows,
  handleToggleBtn,
  selectedRow,
  totalStoryCount,
  postCount,
  handleOwnPage,
  category,
  storyPerPage,
  handleTotalOwnCostChange,
  totalPostCount,
  planData,
  sendPlanDetails,
  setLeftSideBarDataUpdate,
  // searchInputValue,
  // allrows,
  // handleSearchChange,
  // clearRecentlySelected,
  // clearSearch,
  // filterData,
  // pageList,
  ownPages,
  planDetails,
  checkedDescriptions,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [pageDetails, setPageDetails] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [agencyFees, setAgencyFees] = useState(0);
  const [deliverableText, setDeliverableText] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [planBrief, setPlanBrief] = useState(planDetails?.[0]?.brief);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [planName, setPlanName] = useState(formatString(planDetails?.[0]?.plan_name));
  const [isdownloadExcel, setIsDownloadExcel] = useState(false);
  const [updatedCategories, setUpdatedCategories] = useState({});
  const [uploadExcel, { isLoading, isSuccess, isError }] = useUploadExcelMutation();
  const navigate = useNavigate();
  // const [expanded, setExpanded] = useState(false);

  // Function to handle opening the modal and setting the page details
  const handleOpenModal = (type) => {
    setPageDetails(selectedRow?.filter((page) => page?.ownership_type === type) || []);
    setOpenModal(true); // Open the modal
  };

  const formatFollowers = (followers) => {
    return (followers / 1000000).toFixed(1) + 'M';
  };
  const location = useLocation();
  const isPlanPrice = location?.pathname?.split('/')[2] === 'pms-plan-pricing' ? true : false;

  const planStatus = planDetails && planDetails[0]?.plan_status;
  // Function to get the platform name based on the platform ID
  // const getPlatformName = (platformId) => {
  //   const platformMap = {
  //     '666818824366007df1df1319': 'Instagram',
  //     '666818a44366007df1df1322': 'Facebook',
  //     '666856d34366007df1dfacf6': 'YouTube',
  //     '666818c34366007df1df1328': 'Twitter',
  //     '666856e04366007df1dfacfc': 'Snapchat',
  //   };
  //   return platformMap[platformId] || 'Unknown';
  // };

  const HandleSavePlan = async () => {
    try {
      const result = await Swal.fire({
        title: 'Do you want to close the plan?',
        text: 'You can either save the plan or close it directly.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Save Plan',
        cancelButtonText: 'Close Plan',
        reverseButtons: true,
      });
      const planStatus = result.isConfirmed ? 'open' : 'close';
      const payload = {
        id: id,
        plan_status: isPlanPrice ? 'open' : planStatus,
        plan_saved: true,
        post_count: totalPostCount,
        story_count: totalStoryCount,
        no_of_pages: selectedRows?.length,
        cost_price: totalCost,
        own_pages_cost_price: ownPagesCost,
      };
      const [fetchResponse] = await Promise.all([sendPlanxLogs('v1/planxlogs', payload), sendPlanDetails(planData, planStatus)]);

      if (fetchResponse.ok) {
        Swal.fire({
          title: result.isConfirmed ? 'Plan Saved!' : 'Plan Closed!',
          text: result.isConfirmed ? 'Plan has been saved successfully.' : 'Plan has been closed successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/admin/inventory/pms-plan-making');
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save or close the plan. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Error processing plan:', error);

      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const platformCategory = Object.keys(updatedCategories).length > 0 ? updatedCategories : category;

  const handleDownload = async () => {
    setIsDownloading(true);
    setIsDownloadExcel(true);
    try {
      await downloadExcel(selectedRow, platformCategory, postCount, storyPerPage, planDetails, checkedDescriptions, agencyFees, deliverableText, isdownloadExcel);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGetSpreadSheet = async () => {
    setIsDownloading(true);
    setIsDownloadExcel(false);
    try {
      const result = await downloadExcel(selectedRow, category, postCount, storyPerPage, planDetails, checkedDescriptions, agencyFees, deliverableText, isdownloadExcel);
      const formData = new FormData();
      formData.append('file', result);

      try {
        await uploadExcel(formData).unwrap();
        alert('File uploaded successfully!');
      } catch (uploadError) {
        console.error('File upload failed:', uploadError);
        alert('Failed to upload the file.');
      }
    } catch (downloadError) {
      console.error('Error downloading Excel:', downloadError);
    } finally {
      setIsDownloading(false);
    }
  };

  // const getPriceDetail = (priceDetails, key) => {
  //   const detail = priceDetails?.find((item) => item[key] !== undefined);
  //   return detail ? detail[key] : 0;
  // };
  const getPriceDetail = (priceDetails, key) => {
    const keyType = key.split('_')[1];

    const detail = priceDetails?.find((item) => {
      return Object.keys(item).some((priceKey) => priceKey.includes(keyType));
    });

    return detail ? detail[Object.keys(detail).find((key) => key.includes(keyType))] : 0;
  };

  const handlePreviewExcel = () => {
    const preview = selectedRow?.map((page) => {
      const platformName = getPlatformName(page.platform_id);
      const postCountForPage = postCount[page._id] || 0;
      const storyCountForPage = storyPerPage[page._id] || 0;
      return {
        'Page Name': page.page_name,
        Platform: platformName,
        Followers: page.followers_count,
        page_id: page._id,
        platform_id: page.platform_id,
        'Post Count': postCountForPage,
        'Story Count': storyCountForPage,
        'Post Price': getPriceDetail(page.page_price_list, 'platform_post'),
        'Story Price': getPriceDetail(page.page_price_list, 'platform_story'),
        'Total Post Cost': postCountForPage * getPriceDetail(page.page_price_list, 'platform_post'),
        'Total Story Cost': storyCountForPage * getPriceDetail(page.page_price_list, 'platform_story'),
        category: page.page_category_id,
      };
    });
    setPreviewData(preview);
    setOpenPreviewModal(true);
  };

  // const calculatePrice = (rate_type, pageData, type) => {
  //   if (rate_type === 'Variable') {
  //     // Calculate for post price (followers_count / 10,000) * m_post_price
  //     if (type === 'post') {
  //       const postPrice =
  //         (pageData.followers_count / 1000000) * pageData.m_post_price;
  //       return postPrice;
  //     } else if (type === 'story') {
  //       const storyPrice =
  //         (pageData.followers_count / 1000000) * pageData.m_story_price;
  //       return storyPrice;
  //     } else {
  //       const bothPrice =
  //         (pageData.followers_count / 1000000) * pageData.m_both_price;
  //       return bothPrice;
  //     }
  //   }
  // };

  // const formatFollowers = (followers) => `${followers} Followers`;
  // Function to calculate ownership counts and total costs based on selected rows
  const calculateOwnershipCounts = (selectedRow = [], postCount = {}, storyPerPage = {}) =>
    selectedRow
      ?.filter((page) => page && page._id)
      ?.reduce(
        (acc, page) => {
          const postCountForPage = Number(postCount[page._id] || 0);
          const storyCountForPage = Number(storyPerPage[page._id] || 0);
          const postPrice = getPriceDetail(page.page_price_list, 'instagram_post');
          const storyPrice = getPriceDetail(page.page_price_list, 'instagram_story');
          const rateType = page.rate_type === 'Fixed';
          const finalPostCost = rateType ? Math.floor(postPrice) : calculatePrice(page.rate_type, page, 'post');
          const finalStoryCost = rateType ? Math.floor(storyPrice) : calculatePrice(page.rate_type, page, 'story');
          const totalCost = postCountForPage * (finalPostCost || 0) + storyCountForPage * (finalStoryCost || 0);
          if (page.ownership_type === 'Own') {
            acc.own.count += 1;
            acc.own.totalCost += totalCost;
          } else if (page.ownership_type === 'Vendor') {
            acc.vendor.count += 1;
            acc.vendor.totalCost += totalCost;
          }
          return acc;
        },
        {
          own: { count: 0, totalCost: 0 },
          vendor: { count: 0, totalCost: 0 },
        }
      );

  // Memoized calculation of ownership counts for performance optimization
  const ownershipCounts = useMemo(() => calculateOwnershipCounts(selectedRow, postCount, storyPerPage), [selectedRow, postCount, storyPerPage]);

  const ownpages = selectedRow.filter((item) => item.ownership_type === 'Own');

  const sendPlanxLogs = async (endpoint, payload) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return response;
    } catch (error) {
      console.error('Error making API request:', error);
      throw error;
    }
  };

  function truncateString(inputString, maxLength = 10) {
    return inputString?.length > maxLength ? inputString?.slice(0, maxLength) + '...' : inputString;
  }

  const handleSave = async () => {
    setLeftSideBarDataUpdate(true)
    const payload = {
      id: planDetails && planDetails[0]._id,
      plan_status: 'open',
      plan_name: planName,
      selling_price: sellingPrice,
      brief: planBrief,
      // plan_saved: true,
      // post_count: totalPostCount,
      // story_count: totalStoryCount,
      // no_of_pages: selectedRows?.length,
      // cost_price: totalCost,
    };
    const response = await sendPlanxLogs('v1/planxlogs', payload);
    if (response.status === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Entry',
        text: 'Plan with the same name already exists',
        confirmButtonText: 'OK',
      });
      setPlanName(planDetails?.[0]?.plan_name)
    }
    setIsEditing(false);
  };
  const ownPagesCost = ownershipCounts.own.totalCost;
  useEffect(() => {
    handleTotalOwnCostChange(ownPagesCost);
  }, [ownPagesCost]);

  const handleEditing = () => {
    setIsEditing(!isEditing);
    setSellingPrice(planDetails?.[0]?.selling_price);
  };
  const groupCategoriesByPlatform = (rows) => {
    const platformWiseCategories = {};

    rows.forEach((row) => {
      const platform = row.platform_name || 'Unknown Platform';
      const category = row.page_category_name || 'Unknown Category';

      if (!platformWiseCategories[platform]) {
        platformWiseCategories[platform] = {};
      }

      if (!platformWiseCategories[platform][category]) {
        platformWiseCategories[platform][category] = 0;
      }

      platformWiseCategories[platform][category]++;
    });

    return platformWiseCategories;
  };
  const platformCategories = groupCategoriesByPlatform(selectedRows);

  return (
    <div className="planLeftSideWrapper">
      <div className="planLeftSideBody">
        <div className="planSmall">
          {' '}
          <div>
            <Button variant="text" onClick={() => handleEditing()}>
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>{' '}
            {isEditing && (
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            )}
            <h6>
              Selling Price:
              {isEditing ? (
                <TextField
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '6px',
                  }}
                  type="number"
                />
              ) : (
                <span>{formatIndianNumber(sellingPrice || planDetails?.[0]?.selling_price)}</span>
              )}
            </h6>
            <h6>
              Plan Brief:
              {isEditing ? (
                <TextField
                  value={planBrief || planDetails?.[0]?.brief || ''}
                  onChange={(e) => setPlanBrief(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '6px',
                  }}
                  type="test"
                />
              ) : (
                <span style={{ cursor: 'pointer' }} title={formatString(planBrief || planDetails?.[0]?.brief)}>
                  {truncateString(formatString(planBrief || planDetails?.[0]?.brief))}
                </span>
              )}
            </h6>
            <h6>
              Plan Name:
              {isEditing ? (
                <TextField
                  value={planName || planDetails?.[0]?.plan_name || ''}
                  onChange={(e) => setPlanName(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    color: 'white',
                  }}
                />
              ) : (
                <Tooltip title={planName || planDetails?.[0]?.plan_name}>
                  <p style={{ cursor: 'pointer', color: 'white' }}>{planName || planDetails?.[0]?.plan_name}</p>
                </Tooltip>
              )}
            </h6>
          </div>
          <h6>
            Account Name
            <span>{planDetails && formatString(planDetails[0]?.account_name)}</span>
          </h6>
        </div>
        <div className="planSmall">
          <h6>
            Total Profit
            <span>{planDetails && formatIndianNumber(Math.floor(planDetails?.[0]?.selling_price - totalCost))}</span>
          </h6>
          <h6>
            Total Followers
            <span>{formatFollowers(totalFollowers)}</span>
          </h6>
          <h6>
            Total Cost
            <span>{formatIndianNumber(Math.floor(totalCost))}</span>
          </h6>
          <h6>
            Actual Cost
            <span>{formatIndianNumber(Math.floor(totalCost - ownershipCounts['own'].totalCost))}</span>
          </h6>
          <h6>
            Total Posts
            {/* / Page */}
            <span>{totalPostsPerPage}</span>
          </h6>
          <h6>
            Total Stories
            {/* / Page */}
            <span>{totalStoriesPerPage}</span>
          </h6>
          <h6>
            Total Deliverable
            <span>{totalDeliverables}</span>
          </h6>
          <h6>
            Total Pages
            <span>{totalPagesSelected}</span>
          </h6>
          <h6>
            Own Pages
            <span> {ownpages?.length}</span>
          </h6>
          <h6>
            Own Remaining Pages
            <span> {ownPages?.length - selectedRow?.length > 0 ? ownPages?.length - selectedRow?.length : 0}</span>
          </h6>
        </div>
        <div className="planSmall">
          {/* <h6>
            Bollywood
            <span>1</span>
          </h6>
          <h6>
            Meme
            <span>1</span>
          </h6> */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#111C42', borderRadius: '2px' }}>
            {Object.entries(platformCategories).map(([platform, categories]) => (
              <div key={platform} style={{ flex: '1 1 300px', padding: '0.4rem', backgroundColor: '#1D284C', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <h6
                  onClick={handleToggleBtn}
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '0.8rem',
                    borderBottom: '2px solid #666',
                  }}
                >
                  {formatString(platform)}
                </h6>
                {Object.entries(categories).map(([category, count]) => (
                  <div key={category} style={{ marginBottom: '0.6rem', paddingLeft: '0.5rem' }}>
                    <p style={{ margin: 0, color: 'white', fontSize: '1rem', lineHeight: '1.4' }}>
                      {formatString(category)}: <span style={{ fontWeight: 'bold', color: '#00d4ff' }}>{count}</span>
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <ExcelPreviewModal open={openPreviewModal} setMergeCatList={setMergeCatList} updatedCategories={updatedCategories} setUpdatedCategories={setUpdatedCategories} onClose={() => setOpenPreviewModal(false)} previewData={previewData} categories={category} agencyFees={agencyFees} setAgencyFees={setAgencyFees} selectedRow={selectedRow} category={category} postCount={postCount} storyPerPage={storyPerPage} planDetails={planDetails} checkedDescriptions={checkedDescriptions} setDeliverableText={setDeliverableText} deliverableText={deliverableText} isDownloading={isDownloading} downloadExcel={handleDownload} handleGetSpreadSheet={handleGetSpreadSheet} />
        <div className="planSmall planLarge">
          {['own', 'vendor'].map((type) => (
            <div className="pointer" onClick={handleOwnPage} key={type}>
              <h6 onClick={() => handleOpenModal(type.charAt(0).toUpperCase() + type.slice(1))}>
                {type.charAt(0).toUpperCase() + type.slice(1)} Pages : {ownershipCounts[type].count} <br />
                Total Post & Story Cost : ₹ {Math.round(ownershipCounts[type].totalCost)}
                {/* <h6 className=""></h6> */}
              </h6>
            </div>
          ))}
        </div>
      </div>
      <div className="planLeftSideFooter">
        {/* <button className="btn icon">
          <Tooltip title="Clear Recently Selected">
            <IconButton>
              <StackMinus />
            </IconButton>
          </Tooltip>
        </button> */}
        <button className="btn icon" onClick={handlePreviewExcel}>
          {' '}
          <Tooltip title="Preview Excel">
            <IconButton>
              <Eye />{' '}
            </IconButton>
          </Tooltip>
        </button>
        {/* <button
          className="btn icon"
          onClick={() =>
            downloadExcel(
              selectedRow,
              category,
              postCount,
              storyPerPage,
              planDetails,
              checkedDescriptions
            )
          }
        >
          {' '}
          <Tooltip title="Download Excel">
            <IconButton>
              <DownloadSimple />{' '}
            </IconButton>
          </Tooltip>
        </button> */}
        <button className="btn icon" onClick={() => HandleSavePlan(planStatus)}>
          <Tooltip title="Save Plan">
            <IconButton>
              <FloppyDiskBack />{' '}
            </IconButton>
          </Tooltip>
        </button>
      </div>

      <div className="d-none">
        <div className="links">
          {/* Repeated sections for Total Metrics */}
          {[
            {
              label: 'Total Followers',
              value: formatFollowers(totalFollowers),
            },
            { label: 'Total Cost', value: totalCost },
            { label: 'Total Posts / Page', value: totalPostsPerPage },
            { label: 'Total Stories / Page', value: totalStoriesPerPage },
            { label: 'Total Deliverable', value: totalDeliverables },
            { label: 'Total Pages', value: totalPagesSelected },
          ].map(({ label, value }, idx) => (
            <div className="nav-item nav-item-single" key={idx}>
              <div className="nav-btn nav-link">
                <div className="col-lg-2 col-md-4 col-sm-6 col-12">
                  <div className="flexCenter colGap12 border-right">
                    <h6 className="colorMedium">{label}</h6>
                    <h6 className="colorDark">{value}</h6>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Category Count */}
          <div className="nav-item nav-item-single">
            <div className="row pl16 pr16 border-bottom">
              {Object.entries(pageCategoryCount)?.map(([categoryId, count]) => {
                const categoryName = category?.find((item) => item._id === categoryId)?.page_category || 'Unknown';

                return (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={categoryId}>
                    <div>
                      <div className="flexCenter colGap14">
                        <div className="iconBadge small bgPrimaryLight m-0" onClick={handleToggleBtn}>
                          <h5>{count}</h5>
                        </div>
                        <div>
                          <h6 className="colorMedium">Category</h6>
                          <h6 className="mt4 fs_16">{categoryName}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Own Remaining Pages */}
          <div className="nav-item nav-item-single">
            <div className="row p16 border-bottom">
              <div className="col-lg-3 col-md-4 col-sm-6 col-12">
                <div onClick={handleOwnPage}>
                  <div className="flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <h5>{Math.max(ownPages?.length - selectedRow?.length, 0)}</h5>
                    </div>
                    <div>
                      <h6 className="colorMedium">Own Remaining Pages</h6>
                      <h6 className="mt4">{Math.max(ownPages?.length - selectedRow?.length, 0)}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ownership Types */}
          <div className="nav-item nav-item-single">
            <div className="row p16">
              {['own', 'vendor'].map((type) => (
                <div className="col-lg-4 col-md-4 col-sm-6 col-12" key={type}>
                  <div onClick={handleOwnPage}>
                    <div className="flexCenter colGap14">
                      <div
                        className="iconBadge small bgInfoLight m-0"
                        onClick={() =>
                          handleOpenModal(
                            type.charAt(0).toUpperCase() + type.slice(1) // Open modal for ownership type
                          )
                        }
                      >
                        <ArrowUpRight />
                      </div>
                      <div>
                        <h6>
                          {type.charAt(0).toUpperCase() + type.slice(1)} Pages : {ownershipCounts[type]?.count || 0}
                        </h6>
                        <h6 className="mt4">Total Post & Story Cost : ₹ {ownershipCounts[type]?.totalCost || 0}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying page details */}
      <Modal
        open={openModal} // Control modal open state
        onClose={() => setOpenModal(false)} // Close modal handler
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Close button for modal */}
          <Button
            onClick={() => setOpenModal(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            Close
          </Button>

          <Typography id="modal-title" variant="h6" component="h2">
            Page Details
          </Typography>

          {/* Table to display page details */}
          <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No.</TableCell>
                  <TableCell>Page Name</TableCell>
                  <TableCell>Ownership Type</TableCell>
                  <TableCell>Followers</TableCell>
                  <TableCell>Post Count</TableCell>
                  <TableCell>Story Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(pageDetails || [])?.map((page, index) => (
                  <TableRow key={page?._id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{page?.page_name || 'N/A'}</TableCell>
                    <TableCell>{page?.ownership_type || 'Unknown'}</TableCell>
                    <TableCell>{page?.followers_count || 0}</TableCell>
                    <TableCell>{postCount?.[page?._id] || 0}</TableCell>
                    <TableCell>{storyPerPage?.[page?._id] || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </div>
  );
};

export default LeftSideBar;
