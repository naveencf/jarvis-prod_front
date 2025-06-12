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
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import Select from "react-select";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

const CommonRoom = () => {
  const { userContextData } = useAPIGlobalContext();
  const [userList, setUserList] = useState("");
  const UserList = userContextData?.filter(
    (user) => user.user_status === "Active" && user.job_type === "WFO"
  );
  const [getDataofSelectedUser, setGetDataofSelectedUser] = useState([]);

  console.log(getDataofSelectedUser, "getDataofSelectedUser");
  const [totalSittingCount, setTotalSittingCount] = useState({});
  const [selectedShift, setSelectedShift] = useState(1); // Default shift
  const token = sessionStorage.getItem("token");

  const totalSittingDataCount = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_total_counts`);
      setTotalSittingCount(res.data);
    } catch (error) {
      console.error("Error fetching total counts:", error);
    }
  };

  useEffect(() => {
    const fetchUserSittingData = async () => {
      if (!userList) return;

      try {
        const res = await axios.get(
          `${baseUrl}get_user_sitting_data?user_id=${userList}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGetDataofSelectedUser(res.data.data);
        console.log("User Sitting Data:", res.data.data);
      } catch (error) {
        console.error("Error fetching user sitting data:", error);
      }
    };

    fetchUserSittingData();
  }, [userList]);

  useEffect(() => {
    totalSittingDataCount();
  }, []);

  const matchedUser = UserList?.find(
    (user) => user.user_id == getDataofSelectedUser?.userData?.user_id || ""
  );
  console.log(matchedUser, "matchedUser");

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
        <Link to={`/admin/user/sitting-overview/${selectedShift}`}>
          <button className="btn cmnbtn btn_sm btn-primary">
            Customize Rooms
          </button>
        </Link>

        <div className="col-3">
          <label className="form-label">User List</label>
          <Select
            className=""
            options={UserList.map((option) => ({
              value: option.user_id,
              label: `${option.user_name}`,
            }))}
            value={{
              value: userList,
              label:
                UserList.find((user) => user.user_id === userList)?.user_name ||
                "",
            }}
            onChange={(e) => {
              setUserList(e.value);
            }}
          />
        </div>
      </div>
      <Box mt={2}>
        {!getDataofSelectedUser?.userData && userList ? (
          <Card sx={{ maxWidth: 345, boxShadow: 3, mt: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={100}
              >
                <CircularProgress />
              </Box>
            </CardContent>
          </Card>
        ) : (
          matchedUser?.user_id &&
          getDataofSelectedUser?.userData && (
            <Card sx={{ maxWidth: 345, boxShadow: 3, mt: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={matchedUser?.image_url}
                    alt={matchedUser?.user_name}
                    sx={{ width: 64, height: 64 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {getDataofSelectedUser?.userData?.employee}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getDataofSelectedUser?.shift_id === 1
                        ? "Day Shift"
                        : "Night Shift"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Seat No:{" "}
                      {getDataofSelectedUser?.userData?.seat_no || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Room: {getDataofSelectedUser?.roomName || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        )}
      </Box>

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
                to={`/admin/user/office-mast-overview/Room_104/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room104} alt="Room 104" />
                </div>
              </Link>
              <div className="room">
                <img src={cabin104} alt="Cabin 104" />
              </div>
              <Link
                to={`/admin/user/office-mast-overview/Room_105(A)/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room105A} alt="Room 105(A)" />
                </div>
              </Link>
              <Link
                to={`/admin/user/office-mast-overview/Room_105(B)/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room105B} alt="Room 105(B)" />
                </div>
              </Link>
              <Link
                to={`/admin/user/office-mast-overview/Room_106/${selectedShift}`}
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
                to={`/admin/user/office-mast-overview/Room_101/${selectedShift}`}
              >
                <div className="room roomEnable">
                  <img src={room101} alt="Room 101" />
                </div>
              </Link>
              <Link
                to={`/admin/user/office-mast-overview/Room_102/${selectedShift}`}
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
