import axios from "axios";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";
import { Box, Tab, Tabs, Typography } from "@mui/material";

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
        <Box>
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

function ManagerTarget() {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.name;
  const userID = decodedToken.id;
  const [value, setValue] = useState(1);
  const [todayPostCount, setTodayPostCount] = useState(0);
  const [todayStoryCount, setTodayStoryCount] = useState(0);
  const [lastWeekStoryCount, setLastWeekStoryCount] = useState(0);
  const [lastWeekPostCount, setLastWeekPostCount] = useState(0);
  const [lastMonthPostCount, setLastMonthPostCount] = useState(0);
  const [lastMonthStoryCount, setLastMonthStoryCount] = useState(0);

  const seldecslider = {
    centerMode: false,
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

//   useEffect(() => {
//     axios
//       .post("https://insights.ist:8080/api/interpretortodayworked", {
//         userID: userID,
//       })
//       .then((res) => {
//         if (res.data.data.todayPostCount.length > 0) {
//           setTodayPostCount(res.data.data.todayPostCount[0]?.recordsCount);
//         }
//         if (res.data.data.todayStoryCount.length > 0) {
//           setTodayStoryCount(res.data.data.todayStoryCount[0]?.recordsCount);
//         }
//       });

//     axios
//       .post("https://insights.ist:8080/api/interpretorweekworked", {
//         userID: userID,
//       })
//       .then((res) => {
//         if (res.data.data.lastWeekPostCount.length > 0) {
//           setLastWeekPostCount(
//             res.data.data.lastWeekPostCount[0]?.recordsCount
//           );
//         }
//         if (res.data.data.lastWeekStoryCount.length > 0) {
//           setLastWeekStoryCount(
//             res.data.data.lastWeekStoryCount[0]?.recordsCount
//           );
//         }
//         //console.log(res.data.data);
//       });
//     axios
//       .post("https://insights.ist:8080/api/interpretormonthworked", {
//         userID: userID,
//       })
//       .then((res) => {
//         if (res.data.data.lastMonthPostCount.length > 0) {
//           setLastMonthPostCount(
//             res.data.data.lastMonthPostCount[0]?.recordsCount
//           );
//         }
//         if (res.data.data.lastMonthStoryCount.length > 0) {
//           setLastMonthStoryCount(
//             res.data.data.lastMonthStoryCount[0]?.recordsCount
//           );
//         }
//       });
//   }, []);


  return (
    <CustomTabPanel value={value} index={1}>
      <div className="selDecArea">
        <Slider className="selDecSlider" {...seldecslider}>
          <div>
            <div className="selDecBox selDecBoxDaily">
              <div className="selDecBoxHead">
                <div className="selDecBoxHeadIcon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.5 8.33333V5M12.5 8.33333V5M5.41667 13.3333H34.5833M5 20C5 12.9283 5 11.06 7.19667 8.86333C9.39333 6.66667 12.93 6.66667 20 6.66667C27.0717 6.66667 30.6067 6.66667 32.8033 8.86333C35 11.06 35 12.93 35 20C35 27.0717 35 30.6067 32.8033 32.8033C30.6067 35 27.07 35 20 35C12.9283 35 9.39333 35 7.19667 32.8033C5 30.6067 5 27.07 5 20Z"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>1</span>
                </div>
                <div className="selDecBoxHeadTitle">
                  <h2>Weekly Target</h2>
                  <h3>{todayPostCount + todayStoryCount}</h3>
                </div>
              </div>
              <div className="selDecBoxContent">
                <ul>
                  <li>
                    <span>Post</span>
                    {todayPostCount}
                  </li>
                  <li>
                    <span>Story</span>
                    {todayStoryCount}
                  </li>
                  <li>
                    <span>Follower</span>
                    {todayStoryCount}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="selDecBox selDecBoxWeekly">
              <div className="selDecBoxHead">
                <div className="selDecBoxHeadIcon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.5 8.33333V5M12.5 8.33333V5M5.41667 13.3333H34.5833M5 20C5 12.9283 5 11.06 7.19667 8.86333C9.39333 6.66667 12.93 6.66667 20 6.66667C27.0717 6.66667 30.6067 6.66667 32.8033 8.86333C35 11.06 35 12.93 35 20C35 27.0717 35 30.6067 32.8033 32.8033C30.6067 35 27.07 35 20 35C12.9283 35 9.39333 35 7.19667 32.8033C5 30.6067 5 27.07 5 20Z"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>7</span>
                </div>
                <div className="selDecBoxHeadTitle">
                  <h2>Monthly Target</h2>
                  <h3>{lastWeekPostCount+lastWeekStoryCount}</h3>
                </div>
              </div>
              <div className="selDecBoxContent">
                <ul>
                  <li>
                    <span>Post</span>{lastWeekPostCount}
                  </li>
                  <li>
                    <span>Story</span>{lastWeekStoryCount}
                  </li>
                  <li>
                    <span>Follower</span>
                    {todayStoryCount}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <div className="selDecBox selDecBoxMonthly">
              <div className="selDecBoxHead">
                <div className="selDecBoxHeadIcon">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M27.5 8.33333V5M12.5 8.33333V5M5.41667 13.3333H34.5833M5 20C5 12.9283 5 11.06 7.19667 8.86333C9.39333 6.66667 12.93 6.66667 20 6.66667C27.0717 6.66667 30.6067 6.66667 32.8033 8.86333C35 11.06 35 12.93 35 20C35 27.0717 35 30.6067 32.8033 32.8033C30.6067 35 27.07 35 20 35C12.9283 35 9.39333 35 7.19667 32.8033C5 30.6067 5 27.07 5 20Z"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>31</span>
                </div>
                <div className="selDecBoxHeadTitle">
                  <h2>Quaterly Target</h2>
                  <h3>{lastMonthStoryCount+lastMonthPostCount}</h3>
                </div>
              </div>
              <div className="selDecBoxContent">
                <ul>
                  <li>
                    <span>Post</span>{lastMonthPostCount}
                  </li>
                  <li>
                    <span>Story</span>{lastMonthStoryCount}
                  </li>
                  <li>
                    <span>Follower</span>
                    {todayStoryCount}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </CustomTabPanel>
  );
}

export default ManagerTarget;
