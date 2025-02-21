import React, { useEffect, useState } from "react";
import Slider from "react-slick"; // Import Slider
import Viewer from "./Viewer";
import axios from "axios";
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS
import { useParams } from "react-router-dom";
import SittingOverview from "./SittingOverview";
import { baseUrl } from "../../../../utils/config";

const OfficeMastOverview = () => {
  const { room } = useParams();
  const [roomWiseCount, setRoomWiseCount] = useState([]);
  const [selectedRoomName, setSelectedRoomName] = useState(null);
  const [totalSittingCount, setTotalSittingCount] = useState([]);

  const [assignedCounts, setAssignedCount] = useState([]);
  useEffect(() => {
    const fetchSittingData = async () => {
      try {
        const response = await axios.post(`${baseUrl}get_all_data_of_sitting`, {
          roomName: room,
        });
        setAssignedCount(response.data.data);
      } catch (error) {
        console.error("Error fetching sitting data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (room) {
      fetchSittingData();
    }
  }, [room]);

  const fetchAllocationCounts = async () => {
    try {
      const response = await axios.get(`${baseUrl}get_allocation_counts`);
      const dataWithDefaults = response.data.map((d) => ({
        ...d,
        counts: {
          allocated: d.counts?.allocated || 0,
          not_allocated: d.counts?.not_allocated || 0,
        },
      }));
      setRoomWiseCount(dataWithDefaults);
    } catch (error) {
      console.error("Error fetching allocation counts:", error);
    }
  };

  const totalSittingDataCount = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_total_counts`);
      setTotalSittingCount(res.data);
    } catch (error) {
      console.error("Error fetching total counts:", error);
    }
  };

  useEffect(() => {
    totalSittingDataCount();
    fetchAllocationCounts();
  }, []);

  // const handleCardClick = (room, d) => {
  //   setSelectedRoomName(room);
  // };

  useEffect(() => {
    setSelectedRoomName(room);
  }, [room]);

  // Slider Settings
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500, // Animation speed
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll
    centerPadding: "50px",
    responsive: [
      {
        breakpoint: 1024, // For medium screens
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For small screens
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For very small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* <SittingOverview /> */}
      {/* <div className="scrollRow">
        <Slider {...sliderSettings}>
          <div className="timeDataCard card">
            <div className="card-header">
              <div className="titleCard w-100">
                <div className="titleCardImg bgPrimary border-0">
                  <i className="bi bi-pc-display-horizontal"></i>
                </div>
                <div className="titleCardText w-75">
                  <h2 className="colorPrimary">All Rooms</h2>
                  <h3>Total Seats: {totalSittingCount?.total}</h3>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="timeDataCardInfo">
                <ul>
                  <li>
                    <span>Total Assigned</span>
                    <div className="growthBadge growthSuccess">
                      {totalSittingCount?.allocated}
                    </div>
                  </li>
                  <li>
                    <span>Total Not Assigned</span>
                    <div className="growthBadge growthWarning">
                      {totalSittingCount?.not_allocated}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {roomWiseCount?.map((d, index) => (
            <div className="RoomSlideCard" key={index}>
              <div
                className="timeDataCard card"
                onClick={() => handleCardClick(d.roomName, d)}
              >
                <div className="card-header">
                  <div className="titleCard w-100">
                    <div className="titleCardImg bgPrimary border-0">
                      <i className="bi bi-pc-display-horizontal"></i>
                    </div>
                    <div className="titleCardText w-75">
                      <h2 className="colorPrimary">{d.roomName}</h2>
                      <h3>
                        Total Seats:{" "}
                        {d.counts.allocated + d.counts.not_allocated}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="timeDataCardInfo">
                    <ul>
                      <li>
                        <span>Assigned</span>
                        <div className="growthBadge growthSuccess">
                          {d.counts.allocated}
                        </div>
                      </li>
                      <li>
                        <span>Not Assigned</span>
                        <div className="growthBadge growthWarning">
                          {d.counts.not_allocated}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div> */}
      {/* This is a room viewer componenent  */}
      <Viewer
        counts={assignedCounts}
        roomNameCard={selectedRoomName}
        totalSittingDataCount={totalSittingDataCount}
        fetchAllocationCounts={fetchAllocationCounts}
      />
    </>
  );
};

export default OfficeMastOverview;
