import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab, TextField, MenuItem, Select, FormControl, InputLabel, Autocomplete } from '@mui/material';
import { useSendPlanDetails } from './apiServices';
import { useParams } from 'react-router-dom';
import formatString from '../../../utils/formatString';
import { X } from '@phosphor-icons/react';

const ExcelPreviewModal = ({ open, onClose, setUpdatedCategories, setMergeCatList, updatedCategories, previewData, categories, setAgencyFees, agencyFees, selectedRow, handleAutomaticSelection, category, postCount, storyPerPage, planDetails, checkedDescriptions, downloadExcel, isDownloading, deliverableText, setDeliverableText, handleGetSpreadSheet }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [mainCategory, setMainCategory] = useState('');
  const [mergedCategories, setMergedCategories] = useState([]);
  // const [previewDataMerge, setPreviewDataMerge] = useState([]);
  const [updatedCategoryData, setUpdatedCategoryData] = useState(false);
  const [oldCategoryName, setOldCategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const { id } = useParams();
  const { sendPlanDetails, planSuccess } = useSendPlanDetails(id);

  useEffect(() => {
    const categorizedData = {};
    previewData?.forEach((item) => {
      const categoryName = categories?.find((cat) => cat._id === item.category)?.page_category || 'Unknown';

      if (!categorizedData[categoryName]) {
        categorizedData[categoryName] = [];
      }
      categorizedData[categoryName].push(item);
    });
    setCategoryData(categorizedData);
  }, [previewData, categories]);

  const handleTabChange = (event, newValue) => {
    const validTabValue = Math.min(newValue, Object.keys(categoryData).length);
    setSelectedTab(validTabValue);
  };

  const calculateTotals = (data) => {
    let totalPostCost = 0;
    let totalStoryCost = 0;
    let totalPostCount = 0;
    let totalStoryCount = 0;

    data.forEach((item) => {
      totalPostCount += parseInt(item['Post Count'], 10) || 0;
      totalStoryCount += parseInt(item['Story Count'], 10) || 0;
      totalPostCost += parseFloat(item['Total Post Cost']) || 0;
      totalStoryCost += parseFloat(item['Total Story Cost']) || 0;
    });

    return { totalPostCount, totalStoryCount, totalPostCost, totalStoryCost };
  };

  const overallTotals = calculateTotals(previewData);

  const handleAgencyFeeChange = (event) => {
    const value = event.target.value;
    if (value >= 0 && value <= 100) {
      setAgencyFees(value);
    }
  };

  const handleDeliverableTextChange = (event) => {
    setDeliverableText(event.target.value);
  };

  const handleMainCategoryChange = (event) => {
    setMainCategory(event.target.value);
  };

  const handleMergedCategoriesChange = (event) => {
    setMergedCategories(event.target.value);
  };

  const handleMergeCategories = () => {
    if (!mainCategory || mergedCategories.length === 0) return;

    const categoryMap = categories?.reduce((acc, cat) => {
      acc[cat.page_category] = cat._id;
      return acc;
    }, {});

    const mainCategoryId = categoryMap[mainCategory];
    if (!mainCategoryId) {
      console.error('Main category ID not found');
      return;
    }

    // Clone the category data and update preview data
    const updatedCategoryData = { ...categoryData };
    const updatedPreviewData = [...previewData];

    // Loop through the merged categories
    mergedCategories.forEach((categoryName) => {
      if (updatedCategoryData[categoryName]) {
        updatedCategoryData[categoryName].forEach((item) => {
          const index = updatedPreviewData.findIndex((data) => data === item);
          if (index !== -1) {
            // Update the category ID in the preview data to the main category's ID
            updatedPreviewData[index].category = mainCategoryId;
          }
        });

        // Merge the category data into the main category
        updatedCategoryData[mainCategory] = [...(updatedCategoryData[mainCategory] || []), ...updatedCategoryData[categoryName]];

        // Delete the merged category
        delete updatedCategoryData[categoryName];
      }
    });

    // Transform updatedPreviewData to include dynamic fields
    const finalPreviewData = updatedPreviewData.map((item) => {
      const categoryName = categories?.find((cat) => cat._id === item.category)?.page_category || 'Unknown';
      return {
        page_name: item['Page Name'] || 'Unknown Page',
        post_count: item['Post Count'] || 0,
        story_count: item['Story Count'] || 0,
        _id: item['planxId'] || 'Unknown ID',
        category_name: categoryName,
      };
    });
    setUpdatedCategoryData(true);
    // Update state with the modified data
    setCategoryData(updatedCategoryData);
    // setPreviewDataMerge(finalPreviewData);
    sendPlanDetails(finalPreviewData);
    setMergedCategories([]);
  };

  const handleClose = () => {
    onClose();
    // if (updatedCategoryData) {
    //   window.location.reload();
    // }
    // setUpdatedCategoryData(false);
  };
  const handleCategoryChange = (event, newValue) => {
    setMainCategory(newValue.toLowerCase());
  };
  const renameCategory = (oldCategoryName, newCategoryName) => {
    if (!oldCategoryName || !newCategoryName) return;

    const updatedCategoriesData = categories.map((category) => {
      if (category?.page_category === oldCategoryName) {
        return { ...category, page_category: newCategoryName };
      }
      return category;
    });

    setUpdatedCategories(updatedCategoriesData);

    const updatedCategoryData = { ...categoryData };
    Object.keys(updatedCategoryData).forEach((categoryName) => {
      if (categoryName === oldCategoryName) {
        updatedCategoryData[newCategoryName] = updatedCategoryData[categoryName];
        delete updatedCategoryData[categoryName];
      }
    });

    setCategoryData(updatedCategoryData);
  };

  const handleRenameCategory = () => {
    renameCategory(oldCategoryName, newCategoryName);
    setOldCategoryName('');
    setNewCategoryName('');
  };
  useEffect(() => {
    if (planSuccess?.length) {
      setMergeCatList(planSuccess);
    }
  }, [planSuccess]);
  return (
    <Modal className="excelDataModalDialog modal-dialog modal-xl modal-dialog-scrollable" open={open} onClose={onClose} aria-labelledby="preview-modal-title" aria-describedby="preview-modal-description">
      <div
        className="modal-content"
        style={
          {
            // position: "absolute",
            // top: "55%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            // backgroundColor: "white",
            // boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.2)",
          }
        }
      >
        <div className="modal-header">
          <h4 id="preview-modal-title" className="modal-title">
            Excel Data Preview
          </h4>
          <Button
            className="icon sm"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <X />
          </Button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col-12 mb12">
              <h5>Rename Category</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <label htmlFor="old-category">Old Category</label>
                <Autocomplete value={oldCategoryName} onChange={(event, newValue) => setOldCategoryName(newValue || '')} options={Object.keys(categoryData)} renderInput={(params) => <TextField {...params} label="Old Category" variant="outlined" />} />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <label htmlFor="new-category">New Category Name</label>
                <input className="form-control" id="new-category" type="text" value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <button
                  className="cmnbtn w-100"
                  onClick={handleRenameCategory}
                  disabled={!oldCategoryName || !newCategoryName}
                  style={{
                    marginTop: '28px',
                    padding: '10px 20px',
                    backgroundColor: !oldCategoryName || !newCategoryName ? '#ccc' : '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: !oldCategoryName || !newCategoryName ? 'not-allowed' : 'pointer',
                  }}
                >
                  Rename Category
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="row mt16">
            {/* Agency Fee Percentage */}
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <label htmlFor="agency-fee">Agency Fee Percentage</label>
                <input className="form-control" id="agency-fee" type="number" value={agencyFees || ''} onChange={handleAgencyFeeChange} placeholder="Enter Agency Fee %" min="0" max="100" />
              </div>
            </div>
            {/* Deliverable Text */}
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <label htmlFor="deliverable-text">Deliverable Text</label>
                <input className="form-control" id="deliverable-text" type="text" value={deliverableText || ''} onChange={handleDeliverableTextChange} placeholder="Write Deliverable text" />
              </div>
            </div>
            {/* downloadExcel(selectedRow, category, postCount, storyPerPage, planDetails, checkedDescriptions, agencyFees, deliverableText, isdownloadExcel); */}
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <button
                className="btn cmnbtn btn-primary w-100"
                disabled={isDownloading}
                style={{
                  marginTop: '28px',
                }}
                onClick={() => downloadExcel(selectedRow, updatedCategories, postCount, storyPerPage, planDetails, checkedDescriptions)}
              >
                {isDownloading ? 'Downloading...' : 'Download Excel'}
              </button>
              {/* <button
                style={{
                  marginTop: "28px",
                }}
                className="btn cmnbtn btn-primary w-100"
                onClick={() =>
                  handleGetSpreadSheet(
                    selectedRow,
                    category,
                    postCount,
                    storyPerPage,
                    planDetails,
                    checkedDescriptions
                  )
                }
              >
                Get SpreadSheet
              </button> */}
            </div>
          </div>
          <hr />
          <div className="row mt20">
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <Autocomplete
                  // value={`${mainCategory}`}
                  onChange={handleCategoryChange || []}
                  // getOptionLabel={(option) => option.label}
                  options={categories?.map((cat) => formatString(cat.page_category)) || []}
                  renderInput={(params) => <TextField {...params} label="Main Category" variant="outlined" />}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <Autocomplete
                  // value={`${mergedCategories}`}
                  // getOptionLabel={(option) => option.label}
                  onChange={(event, newValue) => setMergedCategories([newValue] || [])}
                  options={Object.keys(categoryData).filter((categoryName) => formatString(categoryName) !== formatString(mainCategory))}
                  renderInput={(params) => <TextField {...params} label="Merge Categories" variant="outlined" />}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-12">
              <div>
                <Button className="btn cmnbtn btn-primary w-100" variant="contained" onClick={handleMergeCategories} disabled={!mainCategory || mergedCategories.length === 0}>
                  Merge Categories
                </Button>
              </div>
            </div>
          </div>
          <hr />
          <div className="card">
            <div className="card-header flexCenterBetween border-0">
              <h4>&nbsp;</h4>
              <Tabs className="pgTab tabSM" value={selectedTab} onChange={handleTabChange} centered>
                <Tab label="Total" />
                {Object.keys(categoryData).map((categoryName, index) => (
                  <Tab key={index} label={categoryName} />
                ))}
              </Tabs>
            </div>
            <div className="card-body">
              {selectedTab === 0 && (
                <>
                  <div className="excelTableHeading">
                    <h4>Overall Totals</h4>
                  </div>
                  {/* Overall Totals Section */}
                  <div className="row mb16">
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">Total Post Count</h6>
                          <h4>{overallTotals.totalPostCount}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">Total Story Count</h6>
                          <h4>{overallTotals.totalStoryCount}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">Total Post Cost</h6>
                          <h4>₹{overallTotals.totalPostCost.toFixed(2)}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">Total Story Cost</h6>
                          <h4>₹{overallTotals.totalStoryCost.toFixed(2)}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Table Section */}
                  <div className="excelDataTable">
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'left',
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Page Name</th>
                          <th>Platform</th>
                          <th>Followers</th>
                          <th>Post Count</th>
                          <th>Story Count</th>
                          <th>Post Price</th>
                          <th>Story Price</th>
                          <th>Total Post Cost</th>
                          <th>Total Story Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData?.map((item, id) => (
                          <tr key={id}>
                            <td>{item['Page Name']}</td>
                            <td>{item.Platform}</td>
                            <td>{item.Followers}</td>
                            <td>{item['Post Count']}</td>
                            <td>{item['Story Count']}</td>
                            <td>{item['Post Price']}</td>
                            <td>{item['Story Price']}</td>
                            <td>{item['Total Post Cost']}</td>
                            <td>{item['Total Story Cost']}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {Object.keys(categoryData).map((categoryName, index) => (
                <div key={index}>
                  {selectedTab === index + 1 && (
                    <>
                      <div className="excelTableHeading">
                        <h4>{categoryName} Data</h4>
                      </div>

                      <div className="excelDataTable">
                        <table
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            textAlign: 'left',
                          }}
                        >
                          <thead>
                            <tr>
                              <th>Page Name</th>
                              <th>Platform</th>
                              <th>Followers</th>
                              <th>Post Count</th>
                              <th>Story Count</th>
                              <th>Post Price</th>
                              <th>Story Price</th>
                              <th>Total Post Cost</th>
                              <th>Total Story Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categoryData[categoryName]?.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item['Page Name']}</td>
                                <td>{item.Platform}</td>
                                <td>{item.Followers}</td>
                                <td>{item['Post Count']}</td>
                                <td>{item['Story Count']}</td>
                                <td>{item['Post Price']}</td>
                                <td>{item['Story Price']}</td>
                                <td>{item['Total Post Cost']}</td>
                                <td>{item['Total Story Cost']}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExcelPreviewModal;
