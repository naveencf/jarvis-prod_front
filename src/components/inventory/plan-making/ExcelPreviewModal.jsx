import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Tabs, Tab, TextField, MenuItem, Select, FormControl, InputLabel, Autocomplete } from '@mui/material';
import { useSendPlanDetails } from './apiServices';
import { useParams } from 'react-router-dom';
import formatString from '../../../utils/formatString';

const ExcelPreviewModal = ({ open, onClose, previewData, categories, setAgencyFees, agencyFees, selectedRow, handleAutomaticSelection, category, postCount, storyPerPage, planDetails, checkedDescriptions, downloadExcel, isDownloading, deliverableText, setDeliverableText }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [mainCategory, setMainCategory] = useState('');
  const [mergedCategories, setMergedCategories] = useState([]);
  // const [previewDataMerge, setPreviewDataMerge] = useState([]);
  const [updatedCategoryData, setUpdatedCategoryData] = useState(false);
  const { id } = useParams();
  const { sendPlanDetails } = useSendPlanDetails(id);

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
    if (updatedCategoryData) {
      window.location.reload();
    }
    setUpdatedCategoryData(false);
  };
  const handleCategoryChange = (event, newValue) => {
    setMainCategory(newValue); // Update the selected value
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="preview-modal-title" aria-describedby="preview-modal-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          Close
        </Button>

        <Typography id="preview-modal-title" variant="h6" component="h2">
          Excel Data Preview
        </Typography>

        <div className="row">
          <div className="col d-flex justify-content-center align-items-center">
            <Typography variant="body1">Agency Fee Percentage</Typography>
            <TextField
              type="number"
              value={agencyFees || ''}
              onChange={handleAgencyFeeChange}
              label="Enter Agency Fee %"
              inputProps={{
                min: 0,
                max: 100,
              }}
              sx={{ mt: 1, width: '11rem' }}
            />
            <Typography variant="body1">Deliverable Text</Typography>
            <TextField value={deliverableText || ''} onChange={handleDeliverableTextChange} label="Write Deliverable text" sx={{ mt: 1, width: '11rem' }} />
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <button className="btn cmnbtn btn-primary btn_sm" disabled={isDownloading} onClick={() => downloadExcel(selectedRow, category, postCount, storyPerPage, planDetails, checkedDescriptions)}>
              {isDownloading ? 'Downloading...' : 'Download Excel'}
            </button>
          </div>
        </div>

        <FormControl sx={{ mt: 2, width: '200px' }}>
          <Autocomplete
            // value={`${mainCategory}`}
            onChange={handleCategoryChange || []}
            // getOptionLabel={(option) => option.label}
            options={categories?.map((cat) => formatString(cat.page_category)) || []}
            renderInput={(params) => <TextField {...params} label="Main Category" variant="outlined" />}
          />
        </FormControl>

        <FormControl sx={{ mt: 2, width: '200px' }}>
          <Autocomplete
            // value={`${mergedCategories}`}
            // getOptionLabel={(option) => option.label}
            onChange={(event, newValue) => setMergedCategories([newValue] || [])}
            options={Object.keys(categoryData).filter((categoryName) => formatString(categoryName) !== formatString(mainCategory))}
            renderInput={(params) => <TextField {...params} label="Merge Categories" variant="outlined" />}
          />
        </FormControl>

        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleMergeCategories} disabled={!mainCategory || mergedCategories.length === 0}>
          Merge Categories
        </Button>

        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Total" />
          {Object.keys(categoryData).map((categoryName, index) => (
            <Tab key={index} label={categoryName} />
          ))}
        </Tabs>

        {selectedTab === 0 && (
          <Box>
            <Typography variant="h6" component="h4" sx={{ mt: 2 }}>
              Overall Totals
            </Typography>
            <Typography variant="body1">Total Post Count: {overallTotals.totalPostCount}</Typography>
            <Typography variant="body1">Total Story Count: {overallTotals.totalStoryCount}</Typography>
            <Typography variant="body1">Total Post Cost: ₹{overallTotals.totalPostCost.toFixed(2)}</Typography>
            <Typography variant="body1">Total Story Cost: ₹{overallTotals.totalStoryCost.toFixed(2)}</Typography>

            <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto', mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Page Name</TableCell>
                    <TableCell>Platform</TableCell>
                    <TableCell>Followers</TableCell>
                    <TableCell>Post Count</TableCell>
                    <TableCell>Story Count</TableCell>
                    <TableCell>Post Price</TableCell>
                    <TableCell>Story Price</TableCell>
                    <TableCell>Total Post Cost</TableCell>
                    <TableCell>Total Story Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData?.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item['Page Name']}</TableCell>
                      <TableCell>{item.Platform}</TableCell>
                      <TableCell>{item.Followers}</TableCell>
                      <TableCell>{item['Post Count']}</TableCell>
                      <TableCell>{item['Story Count']}</TableCell>
                      <TableCell>{item['Post Price']}</TableCell>
                      <TableCell>{item['Story Price']}</TableCell>
                      <TableCell>{item['Total Post Cost']}</TableCell>
                      <TableCell>{item['Total Story Cost']}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {Object.keys(categoryData).map((categoryName, index) => (
          <div key={index}>
            {selectedTab === index + 1 && (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  mt: 2,
                }}
              >
                <Typography variant="h6" component="h4">
                  {categoryName} Data
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Page Name</TableCell>
                      <TableCell>Platform</TableCell>
                      <TableCell>Followers</TableCell>
                      <TableCell>Post Count</TableCell>
                      <TableCell>Story Count</TableCell>
                      <TableCell>Post Price</TableCell>
                      <TableCell>Story Price</TableCell>
                      <TableCell>Total Post Cost</TableCell>
                      <TableCell>Total Story Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryData[categoryName]?.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item['Page Name']}</TableCell>
                        <TableCell>{item.Platform}</TableCell>
                        <TableCell>{item.Followers}</TableCell>
                        <TableCell>{item['Post Count']}</TableCell>
                        <TableCell>{item['Story Count']}</TableCell>
                        <TableCell>{item['Post Price']}</TableCell>
                        <TableCell>{item['Story Price']}</TableCell>
                        <TableCell>{item['Total Post Cost']}</TableCell>
                        <TableCell>{item['Total Story Cost']}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        ))}
      </Box>
    </Modal>
  );
};

export default ExcelPreviewModal;
