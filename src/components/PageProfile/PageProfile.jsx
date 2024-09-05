import React from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  Paper,
  Tab,
  Tabs,
  Stack,
  TextField,
  Chip,
} from "@mui/material";
import { useState } from "react";
import PostsTabs from "./PostsTabs";
import postIcon from "../../../../../assets/images/iconpack/post.svg";
import carouselIcon from "../../../../../assets/images/iconpack/carousel.svg";
import reelIcon from "../../../../../assets/images/iconpack/reels.svg";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import PageTopBrandsCampaigns from "./PageTopBrandsCampaigns";
import OurAnalytics from "./OurAnalytics";
import PageDateWiseStatus from "./PageDateWiseStatus";
import PageDetails from "./PageDetails";
import PageGrowthGraph from "./PageGrowthGraph";
import LogoLoader from "../../LogoLoader";

const data = [
  { name: "Post 1", Engagements: 400 },
  { name: "Post 2", Engagements: 300 },
  { name: "Post 3", Engagements: 200 },
  { name: "Post 4", Engagements: 278 },
  { name: "Post 5", Engagements: 189 },
  { name: "Post 6", Engagements: 239 },
  { name: "Post 7", Engagements: 349 },
  { name: "Post 8", Engagements: 200 },
  { name: "Post 9", Engagements: 278 },
  { name: "Post 10", Engagements: 189 },
];

const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
  },
  plotOptions: {
    bar: {
      columnWidth: "50%",
      distributed: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: data.map((item) => item.name),
  },
};

const chartSeries = [
  {
    name: "Engagements",
    data: data.map((item) => item.Engagements),
  },
];

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  // Extract and format the date parts
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  // const year = String(date.getFullYear()).slice(-2); // Get the last 2 digits of the year

  // Combine parts into the desired format
  const dateFormatted = `${day}-${month}-${year}`;

  // Format the time in 12-hour format with AM/PM
  const timeFormatted = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return { dateFormatted, timeFormatted };
};

const PageProfile = () => {
  const { creatorName } = useParams();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [cfanalyticsData, setCfAnalyticsData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rows, setRows] = useState([]);
  const [requestedData, setRequestedData] = useState({});
  const [campaignrows, setCampaignRows] = useState([]);
  const [creatorDetail, setCreatorDetail] = useState(null);
  const [creatorProgress, setCreatorProgress] = useState([]);

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k`;
    } else {
      return Math.round(value).toString();
    }
  };

  const formatString = (s) => {
    // Remove leading underscores
    let formattedString = s.replace(/^_+/, "");
    // Capitalize the first letter and make the rest lowercase
    if (formattedString) {
      formattedString =
        formattedString.charAt(0).toUpperCase() +
        formattedString.slice(1).toLowerCase();
    }
    return formattedString;
  };

  useEffect(() => {
    axios
      .post("https://insights.ist:8080/api/getCreatorAnalyticsV2", {
        creatorName: creatorName,
        startDate: startDate,
        endDate: endDate,
      })
      .then((res) => {
        setAnalyticsData(res.data.data);
      });
  }, []);

  useEffect(() => {
    axios
      .post("https://insights.ist:8080/api/getCreatorAnalytics", {
        creatorName: creatorName,
        startDate: startDate,
        endDate: endDate,
      })
      .then((res) => {
        // console.log(res.data.data);
        setCfAnalyticsData(res.data.data);
      });
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return { hours, minutes };
  };

  const AnalyticsBox = ({ title, icon, dataItems }) => (
    <div className="pgRechBox">
      <h2 className="pgRechBoxTitle">
        <span>
          <img src={icon} alt={title} />
        </span>
        {title}
      </h2>
      <div className="pgRechBoxData">
        <ul className="pgRechBoxItems">
          {dataItems.map((item, index) => (
            <li className="pgRechBoxItem" key={index}>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const highestPostInADay = cfanalyticsData?.highestPostInADay;
  const lowestPostInADay = cfanalyticsData?.lowestPostInADay;
  const maxDuration = formatTime(
    cfanalyticsData?.timeDifferenceBetweenPost?.max?.duration
  );
  const minDuration = formatTime(
    cfanalyticsData?.timeDifferenceBetweenPost?.min?.duration
  );

  const dateItems = [
    cfanalyticsData?.dateWithHighestPosts,
    cfanalyticsData?.dateWithLowestPosts,
    cfanalyticsData?.maxEarliestPostDate,
    cfanalyticsData?.maxLastPostDate,
    cfanalyticsData?.timeDifferenceBetweenPost?.max?.start,
    cfanalyticsData?.timeDifferenceBetweenPost?.min?.start,
  ].map((date) => (date ? formatDateTime(date)?.dateFormatted : ""));

  const timeItems = dateItems.map((date) =>
    date ? formatDateTime(date)?.timeFormatted : ""
  );
  // console.log(analyticsData);
  return (
    <>
      {analyticsData != null ? <div className="pgWrapper">
        <PageDetails
          creatorDetail={creatorDetail}
          setCreatorDetail={setCreatorDetail}
        />
        <OurAnalytics rows={rows} />

        <div className="card">
          <div className="card-header">
            <Stack
              direction="row"
              sx={{ alignItems: "center", justifyContent: "space-between" }}
            >
              <h5 className="cardHeaderTitle">
                {formatString(creatorName)} Overview
                {/* <span> Post-Count : </span> */}
              </h5>
              <Stack direction="row" spacing={1}>
                <Chip
                  color="primary"
                  label={`Store-Post : ${formatNumber(
                    analyticsData?.paidPostInfoObj?.totalPost +
                      analyticsData?.unPaidPostInfoObj?.totalPost
                  )}
                   `}
                />

                <Chip
                  color="primary"
                  label={`Post / Day : ${formatNumber(
                    (analyticsData?.paidPostInfoObj?.totalPost +
                      analyticsData?.unPaidPostInfoObj?.totalPost) /
                      analyticsData?.noOfDays
                  )}`}
                />
              </Stack>
            </Stack>
            {/* <span> Post/Day : </span>
             */}

            {/* <div className="pgRechBoxItem_New">
              <span>Post-Count : </span>
              {formatNumber(
                analyticsData?.paidPostInfoObj?.totalPost +
                  analyticsData?.unPaidPostInfoObj?.totalPost
              )}
            </div> */}
          </div>
          <div className="card-body pl0 pr0">
            <div className="row pgRechRow m0">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 pgRechCol">
                <div className="pgRechBox">
                  <div className="pgRechBoxData_New">
                    <div className="pgRechBoxItems_New row">
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Promotion</span>{" "}
                          {formatNumber(
                            analyticsData?.paidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Promotional/Day</span>{" "}
                          {formatNumber(
                            analyticsData?.paidPostInfoObj?.totalPost /
                              analyticsData?.noOfDays
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Views/Day</span>{" "}
                          {formatNumber(
                            analyticsData?.paidPostInfoObj?.totalViews /
                              analyticsData?.paidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Likes/Day</span>{" "}
                          {formatNumber(
                            analyticsData?.paidPostInfoObj?.totalLikes /
                              analyticsData?.paidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Comments/Day</span>
                          {formatNumber(
                            analyticsData?.paidPostInfoObj?.totalComments /
                              analyticsData?.paidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Engagement Rate</span>{" "}
                          {(
                            ((analyticsData?.paidPostInfoObj?.totalLikes +
                              analyticsData?.paidPostInfoObj?.totalComments) /
                              analyticsData?.paidPostInfoObj?.totalViews) *
                            100
                          ).toFixed(2)}{" "}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                  {/* 2nd row */}
                  <div className="pgRechBoxData_New">
                    <div className="pgRechBoxItems_New row">
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Non-Promotional</span>{" "}
                          {formatNumber(
                            analyticsData?.unPaidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Non-Promotional/Day</span>{" "}
                          {formatNumber(
                            analyticsData?.unPaidPostInfoObj?.totalPost /
                              analyticsData?.noOfDays
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Views/Day</span>{" "}
                          {formatNumber(
                            analyticsData?.unPaidPostInfoObj?.totalViews /
                              analyticsData?.unPaidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Likes/Day</span>{" "}
                          {formatNumber(
                            analyticsData?.unPaidPostInfoObj?.totalLikes /
                              analyticsData?.unPaidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>
                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Comments/Day</span>
                          {formatNumber(
                            analyticsData?.unPaidPostInfoObj?.totalComments /
                              analyticsData?.unPaidPostInfoObj?.totalPost
                          )}
                        </div>
                      </div>

                      <div className="col-md-2 col-sm-4 col-12 col">
                        <div className="pgRechBoxItem_New">
                          <span>Engagement Rate</span>{" "}
                          {(
                            ((analyticsData?.unPaidPostInfoObj?.totalLikes +
                              analyticsData?.unPaidPostInfoObj?.totalComments) /
                              analyticsData?.unPaidPostInfoObj?.totalViews) *
                            100
                          ).toFixed(2)}{" "}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <PageTopBrandsCampaigns
          analyticsData={analyticsData}
          rows={rows}
          setRows={setRows}
          campaignrows={campaignrows}
          setCampaignRows={setCampaignRows}
          setRequestedData={setRequestedData}
        />
        <PageGrowthGraph creatorProgress={creatorProgress} />
        <div className="card">
          <div className="card-header">
            <h5 className="cardHeaderTitle">CreativeFuel Analytics</h5>
          </div>

          <div className="card-body pl0 pr0 ">
            <div className="row pgRechRow m0">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 pgRechCol">
                <AnalyticsBox
                  title="Post"
                  icon={postIcon}
                  dataItems={[
                    "Max-Post",
                    "Min-Post",
                    "Earliest-Post",
                    "Late-Post",
                    "Max-Time-Difference",
                    "Min-Time-Difference",
                  ]}
                />
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 pgRechCol">
                <AnalyticsBox
                  title="Count"
                  icon={carouselIcon}
                  dataItems={[
                    highestPostInADay,
                    lowestPostInADay,
                    1,
                    1,
                    `${maxDuration.hours} hrs ${maxDuration.minutes} min`,
                    `${minDuration.hours} hrs ${minDuration.minutes} min`,
                  ]}
                />
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 pgRechCol">
                <AnalyticsBox
                  title="Date"
                  icon={reelIcon}
                  dataItems={dateItems}
                />
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12 pgRechCol">
                <AnalyticsBox
                  title="Time"
                  icon={reelIcon}
                  dataItems={timeItems}
                />
              </div>
            </div>
          </div>
        </div>
        <PageDateWiseStatus creatorDetail={creatorDetail}  creatorProgress={creatorProgress} setCreatorProgress={setCreatorProgress}/>
        <PostsTabs
          rows={rows}
          setRows={setRows}
          campaignrows={campaignrows}
          setCampaignRows={setCampaignRows}
          requestedData={requestedData}
          setRequestedData={setRequestedData}
          endDate={endDate}
          setEndDate={setEndDate}
          startDate={startDate}
          setStartDate={setStartDate}
        />
      </div>:
      <LogoLoader/>
      }
    </>
  );
};

export default PageProfile;
