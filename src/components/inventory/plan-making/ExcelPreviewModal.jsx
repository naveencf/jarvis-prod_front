import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tabs,
  Tab,
  TextField,
} from '@mui/material';

const ExcelPreviewModal = ({
  open,
  onClose,
  previewData,
  categories,
  setAgencyFees,
  agencyFees,
  selectedRow,
  category,
  postCount,
  storyPerPage,
  planDetails,
  checkedDescriptions,
  downloadExcel,
  isDownloading,
  deliverableText,
  setDeliverableText,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [categoryData, setCategoryData] = useState({});

  // Prepare data categorized by category when the modal opens
  useEffect(() => {
    const categorizedData = {};
    previewData?.forEach((item) => {
      const categoryName =
        categories?.find((cat) => cat._id === item.category)?.page_category ||
        'Unknown';

      if (!categorizedData[categoryName]) {
        categorizedData[categoryName] = [];
      }
      categorizedData[categoryName].push(item);
    });
    setCategoryData(categorizedData);
  }, [previewData, categories]);

  // Handler for changing tabs
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Function to calculate totals for a category
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

  // Calculate totals for all preview data
  const overallTotals = calculateTotals(previewData);

  // Handle agency fee percentage change
  const handleAgencyFeeChange = (event) => {
    const value = event.target.value;
    if (value >= 0 && value <= 100) {
      setAgencyFees(value);
    }
  };
  const handleDeliverableTextChange = (event) => {
    const value = event.target.value;
    setDeliverableText(value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="preview-modal-title"
      aria-describedby="preview-modal-description"
    >
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
          onClick={onClose}
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

        {/* Agency Fees Input */}
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
            <TextField
              value={deliverableText || ''}
              onChange={handleDeliverableTextChange}
              label="Write Deliverable text"
              sx={{ mt: 1, width: '11rem' }}
            />
          </div>
          <div className="col d-flex justify-content-center align-items-center">
            <button
              className="btn cmnbtn btn-primary btn_sm"
              disabled={isDownloading}
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
              {isDownloading ? 'Downloading...' : 'Download Excel'}
            </button>
          </div>
        </div>
        {/* Tabs for Total and Category-wise view */}
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
            <Typography variant="body1">
              Total Post Count: {overallTotals.totalPostCount}
            </Typography>
            <Typography variant="body1">
              Total Story Count: {overallTotals.totalStoryCount}
            </Typography>
            <Typography variant="body1">
              Total Post Cost: ₹{overallTotals.totalPostCost.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Total Story Cost: ₹{overallTotals.totalStoryCost.toFixed(2)}
            </Typography>

            {/* Render Overall Data Table */}
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 300, overflowY: 'auto', mt: 2 }}
            >
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
                  {previewData?.map((item, index) => (
                    <TableRow key={index}>
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

        {Object.keys(categoryData)?.map(
          (categoryName, index) =>
            selectedTab === index + 1 && (
              <Box key={index}>
                <Typography variant="h6" component="h4" sx={{ mt: 2 }}>
                  {categoryName} Costs
                </Typography>

                {/* Render category-specific data */}
                <TableContainer
                  component={Paper}
                  sx={{ maxHeight: 300, overflowY: 'auto', mt: 2 }}
                >
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
                      {categoryData[categoryName].map((item, index) => (
                        <TableRow key={index}>
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
            )
        )}
      </Box>
    </Modal>
  );
};

export default ExcelPreviewModal;
