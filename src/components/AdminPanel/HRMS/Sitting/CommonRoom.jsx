import React, { useEffect, useState } from "react";
import floorBg from "../../../../assets/imgs/sitting/floor-bg.png";
import room104 from "../../../../assets/imgs/sitting/room-104.png";
import cabin104 from "../../../../assets/imgs/sitting/cabin-104.png";
import room105A from "../../../../assets/imgs/sitting/room-105-a.png";
import room105B from "../../../../assets/imgs/sitting/room-105-b.png";
import room106 from "../../../../assets/imgs/sitting/room-106.png";
import cafeteria from "../../../../assets/imgs/sitting/cafeteria.png";
import room103 from "../../../../assets/imgs/sitting/room-103.png";
import confrence from "../../../../assets/imgs/sitting/confrence.png";
import room102 from "../../../../assets/imgs/sitting/room-102.png";
import room101 from "../../../../assets/imgs/sitting/room-101.png";
import kitchen from "../../../../assets/imgs/sitting/kitchen.png";
import lift from "../../../../assets/imgs/sitting/lift.png";
import parkingBalcony from "../../../../assets/imgs/sitting/parking-balcony.png";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import axios from "axios";

const CommonRoom = () => {
  const [totalSittingCount, setTotalSittingCount] = useState({});
  const [selectedShift, setSelectedShift] = useState(1); // Default shift

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
  }, []);

  return (
    <div className="card">
      <div className="d-flex">
        <div className="card col-4">
          <div className="card-header">
            <div className="titleCard w-100">
              <div className="titleCardImg bgPrimary border-0">
                <i className="bi bi-pc-display-horizontal"></i>
              </div>
              <div className="titleCardText w-75">
                <h2 className="colorPrimary">All Rooms </h2>
                <h3>Total Seats: {totalSittingCount?.total?.total}</h3>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="timeDataCardInfo">
              <ul>
                <li>
                  <span>Total Assigned</span>
                  <div className="growthBadge growthSuccess">
                    {totalSittingCount?.total?.allocated}
                  </div>
                </li>
                <li>
                  <span>Total Not Assigned</span>
                  <div className="growthBadge growthWarning">
                    {totalSittingCount?.total?.not_allocated}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card col-4">
          <div className="card-header">
            <div className="titleCard w-100">
              <div className="titleCardImg bgPrimary border-0">
                <i className="bi bi-pc-display-horizontal"></i>
              </div>
              <div className="titleCardText w-75">
                <h2 className="colorPrimary">All Rooms (Day Shift)</h2>
                <h3>Total Seats: {totalSittingCount?.shift_1?.total}</h3>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="timeDataCardInfo">
              <ul>
                <li>
                  <span>Total Assigned</span>
                  <div className="growthBadge growthSuccess">
                    {totalSittingCount?.shift_1?.allocated}
                  </div>
                </li>
                <li>
                  <span>Total Not Assigned</span>
                  <div className="growthBadge growthWarning">
                    {totalSittingCount?.shift_1?.not_allocated}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card col-4">
          <div className="card-header">
            <div className="titleCard w-100">
              <div className="titleCardImg bgPrimary border-0">
                <i className="bi bi-pc-display-horizontal"></i>
              </div>
              <div className="titleCardText w-75">
                <h2 className="colorPrimary">All Rooms (Night Shift)</h2>
                <h3>Total Seats: {totalSittingCount?.shift_2?.total}</h3>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="timeDataCardInfo">
              <ul>
                <li>
                  <span>Total Assigned</span>
                  <div className="growthBadge growthSuccess">
                    {totalSittingCount?.shift_2?.allocated}
                  </div>
                </li>
                <li>
                  <span>Total Not Assigned</span>
                  <div className="growthBadge growthWarning">
                    {totalSittingCount?.shift_2?.not_allocated}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Shift Selection Buttons */}
      <div className="card-header flexCenterBetween">
        <h5 className="card-title">Creativefuel (Indore)</h5>
        <Link to={`/admin/sitting-overview/${selectedShift}`}>
          <button className="btn cmnbtn btn_sm btn-primary">
            Customize Rooms
          </button>
        </Link>
      </div>

      {/* Floor Plan */}
      <div className="card-body">
        <div>
          <button
            className={`btn cmnbtn btn_sm ${
              selectedShift === 1 ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setSelectedShift(1)}
          >
            Day Shift
          </button>
          <button
            className={`btn cmnbtn btn_sm ${
              selectedShift === 2 ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setSelectedShift(2)}
            style={{ marginLeft: "10px" }}
          >
            Night Shift
          </button>
        </div>
        <div className="floorPlanWrapper">
          <div className="floorPlan">
            <div className="floorPlanBg">
              <img src={floorBg} alt="Floor Plan" />
            </div>
            <div className="floorPlanUp">
              <Link
                to={`/admin/office-mast-overview/Room_104/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room104} alt="Room 104" />
                </div>
              </Link>
              <div className="room">
                <img src={cabin104} alt="Cabin 104" />
              </div>
              <Link
                to={`/admin/office-mast-overview/Room_105(A)/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room105A} alt="Room 105(A)" />
                </div>
              </Link>
              <Link
                to={`/admin/office-mast-overview/Room_105(B)/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room105B} alt="Room 105(B)" />
                </div>
              </Link>
              <Link
                to={`/admin/office-mast-overview/Room_106/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room106} alt="Room 106" />
                </div>
              </Link>
              <div className="room">
                <img src={cafeteria} alt="Cafeteria" />
              </div>
            </div>
            <div className="floorPlanDown">
              <div className="room">
                <img src={parkingBalcony} alt="Parking Balcony" />
              </div>
              <div className="room">
                <img src={lift} alt="Lift" />
              </div>
              <div className="room">
                <img src={kitchen} alt="Kitchen" />
              </div>
              <Link
                to={`/admin/office-mast-overview/Room_101/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room101} alt="Room 101" />
                </div>
              </Link>
              <Link
                to={`/admin/office-mast-overview/Room_102/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room102} alt="Room 102" />
                </div>
              </Link>
              <div className="room">
                <div className="confrenceRoom">
                  <img src={confrence} alt="Conference Room" />
                </div>
                <img src={room103} alt="Room 103" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonRoom;
