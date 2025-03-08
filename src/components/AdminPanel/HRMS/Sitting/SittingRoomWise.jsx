import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Slider from "react-slick"; // Import Slider
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS
import View from "../../Sales/Account/View/View";
import { baseUrl } from "../../../../utils/config";

const OfficeSittingRoomWise = () => {
  const { selectedRoom, shift } = useParams(); // Extract param from URL
  const [fetchSittingModalData, setFetchSittingModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSittingData = async () => {
      try {
        const response = await axios.post(`${baseUrl}get_all_data_of_sitting`, {
          roomName: selectedRoom,
          shift_id: Number(shift),
        });
        setFetchSittingModalData(response?.data);
        console.log(response?.data, "tata");
      } catch (error) {
        console.error("Error fetching sitting data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedRoom) {
      fetchSittingData();
    }
  }, [selectedRoom]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const Columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
    },
    {
      key: "image",
      name: "Profile",
      renderRowCell: (row) => (
        <img
          style={{ height: "60px", width: "60px", borderRadius: "50%" }}
          src={row.image}
          alt=""
        />
      ),
      width: 100,
    },
    {
      key: "user_name",
      name: "Employee ID",
      width: 100,
    },
    {
      key: "dept_name",
      name: "Department",
      width: 100,
    },
  ];
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
    <div>
      <>
        <div className="scrollRow">
          <Slider {...sliderSettings}>
            {fetchSittingModalData?.data && (
              <div className="timeDataCard card">
                <div className="card-header">
                  <div className="titleCard w-100">
                    <div className="titleCardImg bgPrimary border-0">
                      <i className="bi bi-pc-display-horizontal"></i>
                    </div>
                    <div className="titleCardText w-75">
                      <h2 className="colorPrimary">{selectedRoom}</h2>
                      <h3>
                        Total Seats:{" "}
                        {fetchSittingModalData?.data[0]?.totalNumberOfSeats}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="timeDataCardInfo">
                    <ul>
                      <li>
                        <span>Total Assigned</span>
                        <div className="growthBadge growthSuccess">
                          {fetchSittingModalData?.data[0]?.allocated}
                        </div>
                      </li>
                      <li>
                        <span>Total Not Assigned</span>
                        <div className="growthBadge growthWarning">
                          {fetchSittingModalData?.data[0]?.not_allocated}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {fetchSittingModalData.departmentCounts?.map((d, index) => (
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
                        {/* <h2 className="colorPrimary">{d.roomName}</h2> */}
                        <h3>
                          Department wise Card:
                          {/* {d.counts.allocated + d.counts.not_allocated} */}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="timeDataCardInfo">
                      <ul>
                        <li>
                          <span>{d.dept_name}</span>
                          <div className="growthBadge growthSuccess">
                            {d.count}
                          </div>
                        </li>
                        <li>
                          <span>.</span>
                          <div className="growthBadge growthWarning">
                            {/* {d.counts.not_allocated} */}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <View
          columns={Columns}
          data={fetchSittingModalData.data?.slice(1)} // Exclude first index
          title={"Selected Room Wise Details"}
          pagination={[100, 200]}
          tableName={""}
        />
      </>
    </div>
  );
};

export default OfficeSittingRoomWise;
