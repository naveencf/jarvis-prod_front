import { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
// import { useSendPlanDetails } from './apiServices';
import { useParams } from "react-router-dom";
import formatString from "../../../utils/formatString";
import { Faders, X } from "@phosphor-icons/react";
import { useSendPlanDetails } from "../plan-making/apiServices";
import { useGetOperationContentCostQuery } from "../../Store/PageBaseURL";

const ExcelPreviewModalBeta = ({
  open,
  onClose,
  sellingPrice,
  handleSave,
  ugcVideoCost,
  twitterTrendCost,
  setVideoUgcCost,
  setTwitterTrendCost,
  ugcVideoCount,
  setUgcVideoCount,
  setTwitterTrendCount,
  twitterTrendCount,
  setUpdatedCategories,
  updatedCategories,
  previewData,
  categories,
  subCategory,
  setAgencyFees,
  agencyFees,
  selectedRow,
  handleAutomaticSelection,
  postCount,
  storyPerPage,
  planDetails,
  checkedDescriptions,
  downloadExcel,
  isDownloading,
  deliverableText,
  setDeliverableText,
  handleGetSpreadSheet,
  setRenamedCategories,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [mainCategory, setMainCategory] = useState("");
  const { data: getOperationContentCost, isLoading } =
    useGetOperationContentCostQuery();

  const [mergedCategories, setMergedCategories] = useState([]);
  // const [previewDataMerge, setPreviewDataMerge] = useState([]);
  const [updatedCategoryData, setUpdatedCategoryData] = useState(false);
  const [oldCategoryName, setOldCategoryName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const { id } = useParams();
  const { sendPlanDetails, planSuccess } = useSendPlanDetails(id);

  useEffect(() => {
    // const categorizedData = {};
    // previewData?.forEach((item) => {
    //   const categoryName = categories?.find((cat) => cat._id === item.category)?.page_category || 'Unknown';

    //   if (!categorizedData[categoryName]) {
    //     categorizedData[categoryName] = [];
    //   }
    //   categorizedData[categoryName].push(item);
    // });
    const grouped = {};

    previewData.forEach((item) => {
      const key = item.page_sub_category_name;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(item);
    });
    setCategoryData(grouped);
  }, [previewData]);

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
      totalPostCount += parseInt(item["Post Count"], 10) || 0;
      totalStoryCount += parseInt(item["Story Count"], 10) || 0;
      totalPostCost += parseFloat(item["Total Post Cost"]) || 0;
      totalStoryCost += parseFloat(item["Total Story Cost"]) || 0;
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
  // const handleDownloadSheet = async () => {
  //   try {
  //     // const response = await fetch('https://script.google.com/macros/s/AKfycby2DIbzReLGVTh_aaY-Fnv7rJofDz6D9urlsc1T2OFsQAMVdrWr0lISur3fGy5XadjF/exec', {
  //     const response = await fetch('http://35.226.216.249:8080/api/get_google_sheet_url', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         pages: previewData,
  //         categories: categories,
  //         deliverables: deliverableText,
  //         agencyFees: agencyFees,
  //         notes: checkedDescriptions,
  //         sellingPrice: sellingPrice,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const data = await response.json();
  //     if (data.data.url) {
  //       window.open(data.data.url, '_blank');
  //     }
  //   } catch (error) {
  //     console.error('Error during the API request:', error);
  //   }
  // };

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

    const categoryMap = subCategory?.reduce((acc, cat) => {
      acc[cat.page_sub_category.trim().toLowerCase()] = cat._id;
      return acc;
    }, {});

    const normalizedMainCategory = mainCategory.trim().toLowerCase();
    const normalizedMergedCategories = mergedCategories.map((c) =>
      c.trim().toLowerCase()
    );
    const mainCategoryId = categoryMap[normalizedMainCategory];

    if (!mainCategoryId) {
      console.error("Main category ID not found");
      return;
    }

    const updatedPreviewData = previewData.map((item) => {
      const itemCategory = item.page_sub_category_name?.trim().toLowerCase();
      if (normalizedMergedCategories.includes(itemCategory)) {
        return {
          ...item,
          category: mainCategoryId,
          page_sub_category_name: mainCategory,
        };
      }
      return item;
    });

    const newGrouped = {};
    updatedPreviewData.forEach((item) => {
      const key = item.page_sub_category_name;
      if (!newGrouped[key]) newGrouped[key] = [];
      newGrouped[key].push(item);
    });

    setCategoryData(newGrouped);
    setUpdatedCategoryData(true);
    setMergedCategories([]);

    sendPlanDetails(
      updatedPreviewData.map((item) => ({
        page_name: item["Page Name"] || "Unknown Page",
        post_count: item["Post Count"] || 0,
        story_count: item["Story Count"] || 0,
        _id: item["page_id"] || "Unknown ID",
        category_name: item.page_sub_category_name,
        platform_name: item["Platform"]?.toLowerCase(),
        platform_id: item["platform_id"],
      }))
    );
  };

  const handleClose = () => {
    onClose();
    if (updatedCategoryData) {
      window.location.reload();
    }
    setUpdatedCategoryData(false);
  };

  const handleCategoryChange = (event, newValue) => {
    setMainCategory(newValue.toLowerCase());
  };
  // const renameCategory = (oldCategoryName, newCategoryName) => {
  //   if (!oldCategoryName || !newCategoryName) return;

  //   const updatedCategoriesData = subCategory.map((category) => {
  //     if (category?.page_sub_category === oldCategoryName) {
  //       return { ...category, page_sub_category: newCategoryName };
  //     }
  //     return category;
  //   });

  //   setUpdatedCategories(updatedCategoriesData);

  //   const updatedCategoryData = { ...categoryData };
  //   Object.keys(updatedCategoryData).forEach((categoryName) => {
  //     if (categoryName === oldCategoryName) {
  //       updatedCategoryData[newCategoryName] =
  //         updatedCategoryData[categoryName];
  //       delete updatedCategoryData[categoryName];
  //     }
  //   });
  //   console.log("updatedCatData", updatedCategoryData);
  //   setCategoryData(updatedCategoryData);
  // };
  const renameCategory = (oldCategoryName, newCategoryName) => {
    if (!oldCategoryName || !newCategoryName) return;

    const matchedCategory = subCategory?.find(
      (cat) =>
        cat.page_sub_category.toLowerCase() === oldCategoryName.toLowerCase()
    );

    if (!matchedCategory) {
      console.warn(`Category "${oldCategoryName}" not found.`);
      return;
    }
    const categoryId = matchedCategory._id;
    setRenamedCategories((prev) => ({
      ...prev,
      [categoryId]: newCategoryName,
    }));

    setCategoryData((prevData) => {
      const updated = { ...prevData };

      if (updated[oldCategoryName]) {
        updated[newCategoryName] = updated[oldCategoryName];
        delete updated[oldCategoryName];
      }

      return updated;
    });
  };

  const handleRenameCategory = () => {
    renameCategory(oldCategoryName, newCategoryName);
    setOldCategoryName("");
    setNewCategoryName("");
  };

  const handleTwitterMultiplierChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTwitterTrendCount(value === "" ? "" : parseFloat(value));
    }
  };

  const handleUgcMultiplierChange = (e) => {
    const value = parseFloat(e.target.value);
    if (/^\d*$/.test(value)) {
      setUgcVideoCount(value === "" ? "" : parseFloat(value));
    }
  };
  const handleUgcCostChange = (e) => {
    const value = parseFloat(e.target.value);
    if (/^\d*$/.test(value))
      setVideoUgcCost(value === "" ? "" : parseFloat(value));
  };

  const handleTwitterTrendCostChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setTwitterTrendCost(value === "" ? "" : parseFloat(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };
  const totalTwitterTrendCost =
    planDetails && planDetails[0]?.twitter_trend_cost
      ? planDetails[0]?.twitter_trend_cost / planDetails[0]?.twitter_trend_count
      : getOperationContentCost?.twitter_trend_cost || 1;
  const multipliedCostTwitter = totalTwitterTrendCost * twitterTrendCount;

  const totalUgcVideoCost =
    planDetails && planDetails[0]?.ugc_video_cost
      ? planDetails[0]?.ugc_video_cost / planDetails[0]?.ugc_video_count
      : getOperationContentCost?.ugc_video_cost || 1;
  const multipliedCostUgc = totalUgcVideoCost * ugcVideoCount;
  return (
    <Modal
      className="excelDataModalDialog modal-dialog modal-xl modal-dialog-scrollable"
      open={open}
      onClose={onClose}
      aria-labelledby="preview-modal-title"
      aria-describedby="preview-modal-description"
    >
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
        <div className="modal-header flexCenterBetween">
          <h4 id="preview-modal-title" className="modal-title">
            Excel Data Preview
          </h4>
          <div className="flexCenter colGap8">
            <button
              className="icon"
              type="button"
              data-toggle="collapse"
              data-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <Faders />
            </button>

            <Button
              className="icon sm"
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <X />
            </Button>
          </div>
        </div>
        <div className="modal-body">
          <div className="collapse show" id="collapseExample">
            <form onSubmit={handleSubmit}>
              <div className="row form_small">
                <div className="col">
                  <div className="form-group">
                    <label>Twitter Trend</label>
                    <input
                      type="text"
                      value={twitterTrendCount}
                      onChange={handleTwitterMultiplierChange}
                      className="form-control"
                      placeholder="Enter Twitter Trend Count"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />

                    {/* <span style={{ color: 'green', fontSize: '12px' }}>Total Post Cost : {isNaN(multipliedCostTwitter) ? totalTwitterTrendCost : multipliedCostTwitter} </span> */}
                    <span style={{ color: "green", fontSize: "12px" }}>
                      Twitter Trend Cost per video : {totalTwitterTrendCost}{" "}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>Total Twitter Trend Cost:</label>
                    <input
                      type="text"
                      value={twitterTrendCost}
                      onChange={handleTwitterTrendCostChange}
                      className="form-control"
                      placeholder="Enter Total Twitter Trend Cost"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>UGC Video</label>
                    {/* <input type="text" value={ugcVideoCount} onChange={handleUgcMultiplierChange} className="form-control" placeholder="Enter UGC Video Count" pattern="[0-9]*" inputMode="numeric" /> <span style={{ color: 'green', fontSize: '12px' }}>Total Video Cost : {isNaN(multipliedCostUgc) ? totalUgcVideoCost : multipliedCostUgc} </span> */}
                    <input
                      type="text"
                      value={ugcVideoCount}
                      onChange={handleUgcMultiplierChange}
                      className="form-control"
                      placeholder="Enter UGC Video Count"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />{" "}
                    <span style={{ color: "green", fontSize: "12px" }}>
                      UGC Video Cost (per video): {totalUgcVideoCost}{" "}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label>Total UGC Video Cost:</label>
                    <input
                      type="text"
                      value={ugcVideoCost}
                      onChange={handleUgcCostChange}
                      className="form-control"
                      placeholder="Enter Total Operation Cost"
                      pattern="[0-9]*"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <div className="col">
                  <button
                    style={{
                      marginTop: "26px",
                    }}
                    type="submit"
                    className="btn cmnbtn w-100 btn-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
            <div className="row">
              <div className="col-12 mb4">
                <h6>Rename Category</h6>
              </div>
            </div>
            <div className="row form_small">
              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <label htmlFor="old-category">Old Category</label>
                  <Autocomplete
                    value={oldCategoryName}
                    onChange={(event, newValue) =>
                      setOldCategoryName(newValue || "")
                    }
                    options={Object.keys(categoryData)}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <label htmlFor="new-category">New Category Name</label>
                  <input
                    className="form-control"
                    id="new-category"
                    type="text"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <button
                    className="cmnbtn w-100"
                    onClick={handleRenameCategory}
                    disabled={!oldCategoryName || !newCategoryName}
                    style={{
                      marginTop: "26px",
                      padding: "10px 20px",
                      backgroundColor:
                        !oldCategoryName || !newCategoryName
                          ? "#ccc"
                          : "#007BFF",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor:
                        !oldCategoryName || !newCategoryName
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Rename Category
                  </button>
                </div>
              </div>
              {/* Agency Fee Percentage */}
              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <label htmlFor="agency-fee">Agency Fee Percentage</label>
                  <input
                    className="form-control"
                    id="agency-fee"
                    type="number"
                    value={agencyFees || ""}
                    onChange={handleAgencyFeeChange}
                    placeholder="Enter Agency Fee %"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              {/* Deliverable Text */}
              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <label htmlFor="deliverable-text">Deliverable Text</label>
                  <input
                    className="form-control"
                    id="deliverable-text"
                    type="text"
                    value={deliverableText || ""}
                    onChange={handleDeliverableTextChange}
                    placeholder="Write Deliverable text"
                  />
                </div>
              </div>
              {/* downloadExcel(selectedRow, category, postCount, storyPerPage, planDetails, checkedDescriptions, agencyFees, deliverableText, isdownloadExcel); */}
              <div className="col-lg-4 col-md-4 col-sm-12 col-12 mb-4">
                <button
                  className="btn cmnbtn btn-primary w-100"
                  disabled={isDownloading}
                  style={{
                    marginTop: "26px",
                  }}
                  onClick={() =>
                    downloadExcel(
                      selectedRow,
                      updatedCategories,
                      postCount,
                      storyPerPage,
                      planDetails,
                      checkedDescriptions
                    )
                  }
                >
                  {isDownloading ? "Downloading..." : "Download Excel"}
                </button>
                {/* <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                  <button
                    className="btn cmnbtn btn-primary w-100"
                    // disabled={isDownloading}
                    style={{
                      marginTop: '26px',
                    }}
                    onClick={handleDownloadSheet}
                  >
                    Get SpreadSheet
                  </button>
                </div> */}
              </div>
              {/* <button
                style={{
                  marginTop: "26px",
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

              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <label>Main Sub Category</label>
                  <Autocomplete
                    // value={`${mainCategory}`}
                    onChange={handleCategoryChange || []}
                    // getOptionLabel={(option) => option.label}
                    options={
                      subCategory?.map((cat) =>
                        formatString(cat.page_sub_category)
                      ) || []
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                  />
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <label>Merge Sub Categories</label>
                  <Autocomplete
                    multiple
                    disableCloseOnSelect
                    value={mergedCategories}
                    onChange={(event, newValue) => {
                      if (newValue.includes("All")) {
                        const allOthers = Object.keys(categoryData).filter(
                          (categoryName) =>
                            formatString(categoryName) !==
                            formatString(mainCategory)
                        );
                        setMergedCategories(allOthers);
                      } else {
                        setMergedCategories(newValue);
                      }
                    }}
                    options={[
                      "All",
                      ...Object.keys(categoryData).filter(
                        (categoryName) =>
                          formatString(categoryName) !==
                          formatString(mainCategory)
                      ),
                    ]}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                  />
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-12 col-12">
                <div>
                  <Button
                    className="btn cmnbtn btn-primary w-100"
                    variant="contained"
                    onClick={handleMergeCategories}
                    disabled={!mainCategory || mergedCategories.length === 0}
                  >
                    Merge Sub Categories
                  </Button>
                </div>
              </div>
            </div>
            <hr />
          </div>

          <div className="card excelDataTab">
            <div className="card-header flexCenterBetween border-0">
              <h4>&nbsp;</h4>
              <Tabs
                className="pgTab tabSM"
                value={selectedTab}
                onChange={handleTabChange}
                centered
              >
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
                  <div className="row">
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card mb12">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">
                            Total Post Count
                          </h6>
                          <h4>{overallTotals.totalPostCount}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card mb12">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">
                            Total Story Count
                          </h6>
                          <h4>{overallTotals.totalStoryCount}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card mb12">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">
                            Total Post Cost
                          </h6>
                          <h4>₹{overallTotals.totalPostCost.toFixed(2)}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-12 col-12">
                      <div className="card mb12">
                        <div className="card-body p12">
                          <h6 className="fs_14 mb4 colorMedium">
                            Total Story Cost
                          </h6>
                          <h4>₹{overallTotals.totalStoryCost.toFixed(2)}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Table Section */}
                  <div className="excelDataTable">
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "left",
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
                            <td>{item["Page Name"]}</td>
                            <td>{item.Platform}</td>
                            <td>{item.Followers}</td>
                            <td>{item["Post Count"]}</td>
                            <td>{item["Story Count"]}</td>
                            <td>{item["Post Price"]}</td>
                            <td>{item["Story Price"]}</td>
                            <td>{item["Total Post Cost"]}</td>
                            <td>{item["Total Story Cost"]}</td>
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
                            width: "100%",
                            borderCollapse: "collapse",
                            textAlign: "left",
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
                                <td>{item["Page Name"]}</td>
                                <td>{item.Platform}</td>
                                <td>{item.Followers}</td>
                                <td>{item["Post Count"]}</td>
                                <td>{item["Story Count"]}</td>
                                <td>{item["Post Price"]}</td>
                                <td>{item["Story Price"]}</td>
                                <td>{item["Total Post Cost"]}</td>
                                <td>{item["Total Story Cost"]}</td>
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

export default ExcelPreviewModalBeta;
