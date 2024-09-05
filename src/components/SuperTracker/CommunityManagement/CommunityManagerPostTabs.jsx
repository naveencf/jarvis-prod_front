import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import postIcon from "../../../../public/iconpack/post.svg";
import carouselIcon from "../../../../public/iconpack/carousel.svg";
import reelIcon from "../../../../public/iconpack/reels.svg";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useState } from "react";
import { useEffect } from "react";
import DatePickerCf from "../../CommonTool/DatePickerCf";
import dayjs from "dayjs";
import PageOverViewinPage from "../../PageProfile/PageOverViewinPage";
import PagePaidPosts from "../../PageProfile/PagePaidPosts";


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CommunityManagerPostTabs({
  rows,
  setRows,
  campaignrows,
  setCampaignRows,
  requestedData,
  setRequestedData,
  endDate,
  setEndDate,
  startDate,
  setStartDate,
}) {
  const [value, setValue] = useState(1);
  const [overViewvalue, setOverViewValue] = useState(9);
  const [key2, setKey2] = useState("interpretor_decision");
  const [value2, setValue2] = useState(1);
  const [engagementArray, setEngagementArray] = useState(null);
  const [engagementArrayDateWise, setEngagementArrayDateWise] = useState(null);

  const handleChange = (event, newValue) => {
    if (newValue == 0) {
      setKey2("interpretor_decision"), setValue2(1);
    } else if (newValue == 1) {
      setKey2("interpretor_decision"), setValue2(2);
    } else if (newValue == 2) {
      setKey2("interpretor_decision"), setValue2(3);
    } else if (newValue == 3) {
      setKey2("brand_id"), setValue2(1292);
    } else if (newValue == 4) {
      setKey2("posttype_decision"), setValue2(11);
    } else if (newValue == 5) {
      setKey2("posttype_decision"), setValue2(0);
    } else if (newValue == 6) {
      setKey2("posttype_decision"), setValue2(1);
    } else if (newValue == 7) {
      setKey2("selector_decision"), setValue2(5);
    }
    setValue(newValue);
    setRequestedData({});
    // setEndDate(null);
    // setStartDate(null);
  };
  const minSelectableDate = dayjs("2023-11-01");
  
  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const handleOverViewChange = (event, newValue) => {
    const now = new Date();
    // let startDate, endDate;

    if (newValue == 0) {
      // Today
      setStartDate(new Date(now.setHours(0, 0, 0, 0)));
      setEndDate(new Date(now.setDate(now.getDate() + 1)));
      // setEndDate(new Date(now.setHours(23, 59, 59, 999)));
    } else if (newValue == 1) {
      // This Week

      setStartDate(new Date(now.setDate(now.getDate() - now.getDay())));
      setEndDate(new Date(now.setDate(now.getDate() + 6 - now.getDay())));
    } else if (newValue == 2) {
      // This Month
      setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    } else if (newValue == 3) {
      // This Year
      setStartDate(new Date(now.getFullYear(), 0, 1));
      setEndDate(new Date(now.getFullYear(), 11, 31));
    } else if (newValue == 4) {
      // Previous Week
      setStartDate(new Date(now.setDate(now.getDate() - now.getDay() - 7)));
      setEndDate(new Date(now.setDate(now.getDate() + 6 - now.getDay())));
    } else if (newValue == 5) {
      // Previous Month
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 1, 3));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 2));
    } else if (newValue == 6) {
      // Previous Year
      setStartDate(new Date(now.getFullYear() - 1, 0, 1)); 
      setEndDate(new Date(now.getFullYear() - 1, 11, 31));
    } else if (newValue == 7) {
      // Custom (Example: Last 30 days)
      setStartDate(new Date(now.setDate(now.getDate() - 30)));
      setEndDate(new Date());
    } else if (newValue === 8) {
      // Yesterday
      setStartDate(new Date(now.setDate(now.getDate() - 2))); // Yesterday
      setEndDate(new Date(now.setDate(now.getDate()+1 ))); // Today (end of day)
    } else if (newValue === 9) {
      // Yesterday
      setStartDate(null); // Yesterday
      setEndDate(null); // Today (end of day)
    }else if (newValue === 10) {
      // Previous Three Months
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 3, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    } else if (newValue === 11) {
      // Previous Six Months
      setStartDate(new Date(now.getFullYear(), now.getMonth() - 6, 1));
      setEndDate(new Date(now.getFullYear(), now.getMonth(), 0));
    }

    setOverViewValue(newValue);
  };

  const formatNumber = (value) => {
    if (!value) {
      return 0;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k`;
    } else {
      return Math.round(value).toString();
    }
  };
  return (
    <>
      <div className="card pgTab">
        <TabContext value={overViewvalue}>
          <div className="card-header flex_center_between">
            <h5 className="cardHeaderTitle">Page Details  {startDate ? `From -${formatDate(startDate)}`: ""}</h5>
            <TabList
              className="tabSM"
              onChange={handleOverViewChange}
              aria-label="lab API tabs example"
            >
              <Tab label="All" value={9} />
              {/* <Tab label="Today" value={0} /> */}
              <Tab label="Yesterday" value={8} />
              <Tab label="This Week" value={1} />
              <Tab label="This Month" value={2} />
              {/* <Tab label="This Year" value={3} /> */}
              <Tab label="Last Week" value={4} />
              <Tab label="Last Month" value={5} />
              <Tab label="Quaterly" value={10} />
              <Tab label="Half Yearly" value={11} />
              {/* <Tab label="Last Year" value={6} /> */}
              <Tab label="Custom" value={7} />
            </TabList>
          </div>
          {overViewvalue == 7 && (
            <DatePickerCf
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              minSelectableDate={minSelectableDate}
            />
          )}
          <PageOverViewinPage
            value={overViewvalue}
            engagementArray={engagementArray}
           
          />
        </TabContext>
      </div>

      {engagementArray && (
        <div className="card">
          <div className="card-header">
            <h5 className="cardHeaderTitle">
              Separate Stats   - {engagementArray?.count}
            </h5>
          </div>
          <div className="card-body pl0 pr0">
            <div className="row pgRechRow m0">
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 pgRechCol">
                <div className="pgRechBox">
                  <h2 className="pgRechBoxTitle">
                    <span>
                      <img src={postIcon} alt="post" />
                    </span>
                    Post -
                    {formatNumber(engagementArray?.postTypeCounts[0]?.count)}
                  </h2>
                  <div className="pgRechBoxData_New">
                    <div className="pgRechBoxItems_New row">
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Views</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[0]?.allViewCounts
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Likes</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[0]?.allLikesCount
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Comments</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[0]?.allComments
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Engagement Rate</span> 23.9%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 pgRechCol">
                <div className="pgRechBox">
                  <h2 className="pgRechBoxTitle">
                    <span>
                      <img src={carouselIcon} alt="carousel" />
                    </span>
                    Carousel -{" "}
                    {formatNumber(engagementArray?.postTypeCounts[1]?.count) ||
                      0}
                  </h2>
                  <div className="pgRechBoxData_New">
                    <div className="pgRechBoxItems_New row">
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Views</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[1]?.allViewCounts
                          ) || 0}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Likes</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[1]?.allLikesCount
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Comments</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[1]?.allComments
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Engagement Rate</span> 23.9%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 pgRechCol">
                <div className="pgRechBox">
                  <h2 className="pgRechBoxTitle">
                    <span>
                      <img src={reelIcon} alt="reel" />
                    </span>
                    Reels -{" "}
                    {formatNumber(engagementArray?.postTypeCounts[2]?.count)}
                  </h2>
                  <div className="pgRechBoxData_New">
                    <div className="pgRechBoxItems_New row">
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Views</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[2]?.allViewCounts
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Likes</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[2]?.allLikesCount
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Avg. Comments</span>{" "}
                          {formatNumber(
                            engagementArray?.postTypeCounts[2]?.allComments
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Engagement Rate</span> 23.9%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card border pgTab">
        {/* <div className="card-header">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Paid Post" {...a11yProps(0)} />
            <Tab label="Non-Paid" {...a11yProps(1)} />
            <Tab label="Not-Sure" {...a11yProps(2)} />
            <Tab label="Deleted-Post" {...a11yProps(3)} />
            <Tab label="Bot-X" {...a11yProps(4)} />
            <Tab label="Selector" {...a11yProps(5)} />
            <Tab label="Interpretor" {...a11yProps(6)} />
            <Tab label="Logo" {...a11yProps(7)} />
          </Tabs>
        </div> */}
        <div className="card-body p0">
          <CustomTabPanel value={value} index={value}>
            <PagePaidPosts
              rows={rows}
              setRows={setRows}
              campaignrows={campaignrows}
              setCampaignRows={setCampaignRows}
              key2={key2}
              value2={value2}
              setKey2={setKey2}
              setValue2={setValue2}
              setEngagementArray={setEngagementArray}
              setEngagementArrayDateWise={setEngagementArrayDateWise}
              requestedData={requestedData}
              tabvalue={value}
              setValue={setValue}
              setRequestedData={setRequestedData}
              endDate={endDate}
              setEndDate={setEndDate}
              startDate={startDate}
              setStartDate={setStartDate}
            />
          </CustomTabPanel>
        </div>
      </div>
    </>
  );
}
