import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BadgeImage from "../../../public/icon/badge2.png";
import { Button } from "@mui/material";
import PageGrowthViewAll from "./PageGrowthViewAll";

export default function PageDateWiseStatus({
  startDate,
  endDate,
  creatorDetail,
  creatorProgress,
  setCreatorProgress,
}) {
  const { creatorName } = useParams();
  const [viewAll, setViewAll] = useState(false);

  const columnheader = [
    { headerName: "Follower", ranking: creatorDetail?.followersCountRanking },
    { headerName: "Following", ranking: creatorDetail?.followingCountRanking },
    { headerName: "Media", ranking: creatorDetail?.mediaCountRanking },
    { headerName: "Today-Post", ranking: creatorDetail?.postCountTodayRank },
  ];

  useEffect(() => {
    axios
      .post(`https://insights.ist:8080/api/getCreatorOverallReport`, {
        creatorName: creatorName,
        startDate: startDate,
        endDate: endDate,
      })
      .then((res) => {
        // console.log(res.data.data, "getCreatorOverallReport");
        setCreatorProgress(res.data.data);
      });
  }, [startDate, endDate]);

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k`;
    } else {
      return Math.round(value).toString();
    }
  };

  const getClassName = (difference) => {
    if (difference > 0) {
      return "highest";
    } else if (difference < 0) {
      return "lowest";
    } else {
      return ""; // No class for difference of 0
    }
  };

  const incrementValue = (value) => {
    if (value > 0) {
      return ` +${value}`;
    }
    return `${value}`;
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    dateObject.setDate(dateObject.getDate() - 1);
    return dateObject.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleChangeView = () => {
    setViewAll(!viewAll);
  };
  return (
    <>
      {!viewAll ? (
        <div className="card">
          <div className="card-body p0">
            <div className="brandCompareWrapper table-responsive">
              <div className="divTable">
                <div className="divTableHeading">
                  <div className="divTableRow">
                    <div className="divTableHead">
                      <h5>Page Performance</h5>
                    </div>
                    {columnheader.map((ele, index) => (
                      <div className="divTableHead" key={index}>
                        <div className="compBrandHead titleCard">
                          {/* <div className="titleCardImg">
                        <img
                          src={`https://s3.ap-south-1.amazonaws.com/nudges//tmp/${creatorName}.jpg`}
                          alt="i"
                        />
                      </div> */}
                          <div className="topLeaderRanking">
                            <img src={BadgeImage} alt="i" />
                            <span>{ele.ranking}</span>
                          </div>
                          <div className="titleCardText">
                            <h2>{ele.headerName}</h2>
                            <ul></ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {creatorProgress.length > 0 && (
                  <div className="divTableBody">
                    {creatorProgress.slice(0, 5).map((row, rowIndex) => (
                      <div className="divTableRow" key={rowIndex}>
                        <div className="divTableCell" data-label="Date">
                          <h6 className="divTableTH">
                            <span>
                              <ion-icon name="calendar-outline"></ion-icon>
                            </span>
                            {formatDate(row.createdAt)}
                          </h6>
                        </div>
                        <div className="divTableCell" data-label="Follower">
                          <p>
                            {formatNumber(row.followersCount)}{" "}
                            <span
                              className={getClassName(
                                row.todayVsYesterdayFollowersCountDiff
                              )}
                            >
                              {row?.todayVsYesterdayFollowersCountDiff != 0 && (
                                <>
                                  <i className="bi bi-caret-up-fill"></i>
                                  {incrementValue(
                                    row?.todayVsYesterdayFollowersCountDiff
                                  )}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="divTableCell" data-label="Following">
                          <p>
                            {formatNumber(row.followingCount)}{" "}
                            <span
                              className={getClassName(
                                row.todayVsYesterdayFollowingCountDiff
                              )}
                            >
                              {row?.todayVsYesterdayFollowingCountDiff != 0 && (
                                <>
                                  <i className="bi bi-caret-up-fill"></i>
                                  {incrementValue(
                                    row?.todayVsYesterdayFollowingCountDiff
                                  )}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="divTableCell" data-label="Media">
                          <p>
                            {row.mediaCount}{" "}
                            <span
                              className={getClassName(
                                row.todayVsYesterdayMediaCountDiff
                              )}
                            >
                              {row.todayVsYesterdayMediaCountDiff != 0 && (
                                <>
                                  <i className="bi bi-caret-up-fill"></i>
                                  {row.todayVsYesterdayMediaCountDiff}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="divTableCell" data-label="Today">
                          <p>
                            {formatNumber(row.todayPostCount)}{" "}
                            <span
                              className={getClassName(
                                row.todayVsYesterdayPostCountDiff
                              )}
                            >
                              {row.todayVsYesterdayPostCountDiff != 0 && (
                                <>
                                  <i className="bi bi-caret-up-fill"></i>
                                  {incrementValue(
                                    row.todayVsYesterdayPostCountDiff
                                  )}
                                </>
                              )}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button sx={{ ml: "80%" }} onClick={handleChangeView}>
                {`View All >>`}{" "}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>

        <PageGrowthViewAll
          startDate={startDate}
          endDate={endDate}
          creatorDetail={creatorDetail}
          creatorProgress={creatorProgress}
          setCreatorProgress={setCreatorProgress}
        />
         <Button sx={{ ml: "80%" }} onClick={handleChangeView}>
                {`View Less >>`}{" "}
              </Button>
        </>
      )}
    </>
  );
}
