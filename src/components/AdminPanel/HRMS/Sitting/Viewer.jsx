import { useEffect, useState } from "react";
import {
  Stage,
  Layer,
  Path,
  Text,
  Image as KonvaImage,
  Rect,
  Circle,
} from "react-konva";
import Select from "react-select";
import axios from "axios";
import selectedChair from "../../../../../public/icon/chair/selected.png";
import assignedChair from "../../../../../public/icon/chair/assigned.png";
import notassignedChair from "../../../../../public/icon/chair/not-assign.png";

import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { FileArrowDown, FileXls, FloppyDisk } from "@phosphor-icons/react";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import { baseUrl } from "../../../../utils/config";
import UnassignedUsersList from "./UnassignedUsersList";
import Loader from "../../../Finance/Loader/Loader";

const AvatarImage = ({ url, x, y, width = 50, height = 50 }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = url; // Set the image URL
    img.onload = () => setImage(img); // Load the image
  }, [url]);

  if (!image) return null; // Return nothing until the image is loaded

  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      cornerRadius={width / 2} // Make it circular
    />
  );
};

const Viewer = ({
  counts,
  shift,
  roomNameCard,
  totalSittingDataCount,
  fetchAllocationCounts,
}) => {
  const { userContextData } = useAPIGlobalContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [elements, setElements] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [chairSVG, setChairSVG] = useState(null);
  const [layouts, setLayouts] = useState({});
  const [id, setID] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [showChairsWithNames, setShowChairsWithNames] = useState(true);
  const [matchData, setMatchData] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track selected dropdown value

  const [unassignedUsersList, setUnassignedUsersList] = useState([]);
  const [unListData, setUnListData] = useState({});

  const totalSeats = elements.length;
  const assignedSeats = elements.filter((el) => el.employee).length;
  const notAssignedSeats = totalSeats - assignedSeats;

  const userData = userContextData.filter(
    (d) => d.user_status === "Active" && d.job_type === "WFO"
  );

  function SittingExcelRoomWise(element) {
    // Map the element's data to include tooltip details
    const formattedData = element?.elements?.map((row, index) => {
      const matchedUser = userContextData?.find(
        (user) => user?.user_id === row.user_id
      );

      return {
        "S.No": index + 1,
        "Employee Name": matchedUser?.user_name || "Not Assigned",
        Department: matchedUser?.department_name || "N/A",
        Designation: matchedUser?.designation_name || "N/A",
      };
    });

    // Define the file name
    const fileName = `${element.roomName}.xlsx`;
    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    // Write the workbook to a file
    XLSX.writeFile(workbook, fileName);
  }

  useEffect(() => {
    // Load chair SVG
    fetch("/Blank.svg")
      .then((res) => res.text())
      .then(setChairSVG);
  }, []);

  useEffect(() => {
    if (roomNameCard) {
      loadLayout(roomNameCard);
    }
  }, [roomNameCard]);

  // Fetch room layouts from API
  const fetchLayouts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(baseUrl + "get_all_arrangement");

      setUnListData(response.data);

      const shiftWiseData = response.data.filter(
        (res) => res.shift_id == shift
      );
      const layoutsData = shiftWiseData.reduce((acc, layout) => {
        acc[layout.roomName] = layout; // Group by room name
        return acc;
      }, {});
      setLayouts(layoutsData);

      const matchedData = shiftWiseData?.find(
        (d) => d.roomName === selectedRoom
      );
      setMatchData(matchedData);
      setID(matchedData ? matchedData._id : "");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching layouts:", error);
      alert("Failed to load layouts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchLayouts inside useEffect
  useEffect(() => {
    fetchLayouts();
  }, [selectedRoom]);

  useEffect(() => {
    if (unListData) {
      const extractedData = Object.values(unListData).flatMap(
        (room) =>
          room.unassigned_user?.map((user) => ({
            user_id: user.user_id,
            employee: user.employee,
            roomName: room.roomName,
            shift_id: room.shift_id,
            _id: room._id, // Add room _id here
          })) || []
      );
      setUnassignedUsersList(extractedData);
    }
  }, [unListData]);

  // Load selected room data
  useEffect(() => {
    if (selectedRoom && layouts[selectedRoom]) {
      const roomData = layouts[selectedRoom];

      setElements(roomData.elements);

      // Load background image
      const img = new window.Image();
      img.src = roomData.room_image;
      img.onload = () => setBackgroundImage(img);
    }
  }, [layouts, selectedRoom]);

  const loadLayout = (roomName) => {
    setSelectedRoom(roomName);
  };
  const updateAssignment = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee before saving the layout.");
      return;
    }
    try {
      const updatedData = {
        _id: id,
        elements,
      };
      await axios.put(`${baseUrl}update_sitting_arrangement`, updatedData);
      alert("Layout updated successfully.");
      setSelectedEmployee(null);
      setSelectedId(null);
      totalSittingDataCount();
      fetchAllocationCounts();
    } catch (error) {
      console.error("Error updating layout:", error);
      alert("Failed to update layout.");
    }
  };

  const assignEmployee = (employeeId, employeeName, image) => {
    if (!selectedId) {
      alert("Please select a seat to assign an employee.");
      return;
    }

    const updatedElements = elements.map((el) =>
      el.id === selectedId
        ? { ...el, employee: employeeName, user_id: employeeId, image: image }
        : el
    );
    setElements(updatedElements);
  };

  const removeAssignment = () => {
    if (!selectedId) {
      alert("Please select a seat to remove the assignment.");
      return;
    }

    const updatedElements = elements.map((el) =>
      el.id === selectedId ? { ...el, employee: "", user_id: 0, image: "" } : el
    );
    setElements(updatedElements);
  };

  const [multiSelectEnabled, setMultiSelectEnabled] = useState(false);
  const [selectedChairs, setSelectedChairs] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  // Function to handle chair selection
  const handleCheckboxChairSelection = (chair) => {
    if (!multiSelectEnabled) {
      // 🟢 Single Selection Mode
      setSelectedId(chair.id);
      setSelectedChairs([]);
      setSelectedEmployees([]);
      return;
    }

    // 🔵 Multi-Selection Mode
    setSelectedChairs((prevSelected) => {
      const alreadySelected = prevSelected.some((item) => item.id === chair.id);

      if (alreadySelected) {
        // Remove chair from selection
        return prevSelected.filter((item) => item.id !== chair.id);
      } else {
        // Add chair to selection
        return [...prevSelected, chair];
      }
    });
  };

  const handleAssignChairs = async () => {
    if (selectedChairs.length === 0 || selectedEmployees.length === 0) {
      alert("Please select at least one chair and one employee.");
      return;
    }

    // Create updated elements array with assigned users
    const updatedElements = elements.map((el) => {
      const chairIndex = selectedChairs.findIndex(
        (chair) => chair.id === el.id
      );

      if (chairIndex !== -1) {
        // Assign user_id & employee from selectedEmployees (loop through employees)
        const assignedEmployee =
          selectedEmployees[chairIndex % selectedEmployees.length];

        return {
          ...el,
          user_id: assignedEmployee.user_id,
          employee: assignedEmployee.employee,
        };
      }

      return el; // Keep existing chair assignments if not selected
    });

    // Get IDs of assigned users
    const assignedUserIds = selectedEmployees.map((emp) => emp.user_id);

    // Dynamically update `unassigned_user` for ALL affected rooms
    const updatedRooms = Object.values(unListData).map((room) => {
      const updatedUnassignedUsers = room.unassigned_user.filter(
        (user) => !assignedUserIds.includes(user.user_id) // Remove assigned users from unassigned list
      );

      return {
        ...room,
        unassigned_user: updatedUnassignedUsers,
      };
    });

    try {
      // Send updated data for ALL affected rooms
      const updatedData = updatedRooms.map((room) => ({
        _id: room._id,
        elements: room._id === id ? updatedElements : room.elements, // Update elements only for the active room
        unassigned_user: room.unassigned_user, // Updated unassigned users for each room
      }));

      // Send API request for each updated room
      await Promise.all(
        updatedData.map((data) =>
          axios.put(`${baseUrl}update_sitting_arrangement`, data)
        )
      );

      alert("Users assigned successfully.");
      fetchLayouts();
      // Update state and UI
      setElements(updatedElements);
      setSelectedChairs([]);
      setSelectedEmployees([]);
      totalSittingDataCount();
      fetchAllocationCounts();
    } catch (error) {
      console.error("Error assigning users:", error);
      alert("Failed to assign users.");
    }
  };

  const handleNotAssigned = async () => {
    if (!multiSelectEnabled || selectedChairs.length === 0) {
      alert(
        "Multi-select must be enabled, and at least one chair should be selected."
      );
      return;
    }

    // Extract unassigned data (user_id & employee) before clearing
    const unassigned = selectedChairs.map((chair) => ({
      user_id: chair.user_id || 0,
      employee: chair.employee || "",
    }));

    // Clear employee details for selected chairs
    const updatedElements = elements.map((el) =>
      selectedChairs.some((chair) => chair.id === el.id)
        ? { ...el, employee: "", user_id: 0, image: "" }
        : el
    );

    setElements(updatedElements);
    setSelectedChairs([]);

    try {
      const updatedData = {
        _id: id,
        elements: updatedElements, // Updated layout
        unassigned_user: unassigned, // Newly added unassigned payload
      };

      await axios.put(`${baseUrl}update_sitting_arrangement`, updatedData);
      alert("Layout updated successfully.");
      totalSittingDataCount();
      fetchAllocationCounts();
      fetchLayouts();
    } catch (error) {
      console.error("Error updating layout:", error);
      alert("Failed to update layout.");
    }
  };

  const handleUserSelectionCheckBox = (userIds) => {
    setSelectedEmployees(userIds);
  };

  return (
    <>
      <div className="roomLayoutCard card">
        <div className="card-header flexCenterBetween">
          {selectedRoom && (
            <>
              <button
                className="btn cmnbtn btn-primary btn_sm"
                onClick={() => {
                  setMultiSelectEnabled(!multiSelectEnabled);
                  setSelectedChairs([]); // Reset selection when toggling
                  setSelectedEmployees([]);
                }}
                style={{ cursor: "pointer" }}
              >
                {multiSelectEnabled
                  ? "Disable Multi-Select"
                  : "Enable Multi-Select"}
              </button>

              <button
                className="btn cmnbtn btn-danger btn_sm"
                onClick={handleNotAssigned}
                disabled={!multiSelectEnabled}
              >
                Un-Assigned
              </button>
              <button
                className="btn cmnbtn btn-success btn_sm"
                onClick={handleAssignChairs}
                disabled={
                  selectedChairs.length === 0 || selectedEmployees.length === 0
                }
              >
                Assign
              </button>
            </>
          )}
          {selectedRoom && (
            <Link
              to={`/admin/office-sitting-room-wise/${selectedRoom}/${shift}`}
            >
              <h5 className="card-title">{`${selectedRoom}(Department wise)`}</h5>
            </Link>
          )}
          {selectedRoom && (
            <button
              className="btn cmnbtn btn-primary btn_sm"
              onClick={() => setShowChairsWithNames(!showChairsWithNames)}
              style={{
                cursor: "pointer",
              }}
            >
              {showChairsWithNames
                ? "Hide Employee Names"
                : "Show Employee Names"}
            </button>
          )}
        </div>
        <div className="card-body roomLayoutCardIn roomCard row">
          <div className="roomLayoutCardLeft col">
            <h4>{shift == 1 ? "Day Shift" : "Night Shift"}</h4>
            {/* {isLoading ? (
              <Loader />
            ) : ( */}
            <div className="floorStage floor">
              <Stage
                width={820}
                height={480}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <Layer>
                  {backgroundImage && (
                    <KonvaImage
                      image={backgroundImage}
                      width={820}
                      height={480}
                    />
                  )}
                  {layouts &&
                    chairSVG &&
                    elements?.map((el) => (
                      <Path
                        key={el.id}
                        id={el.id}
                        data={chairSVG}
                        x={el.x}
                        y={el.y}
                        scale={{ x: el.width / 125, y: el.height / 115 }}
                        rotation={el.rotation}
                        fill={
                          selectedChairs.some((chair) => chair.id === el.id)
                            ? "blue" // Highlight selected chairs in multi-select mode
                            : selectedId === el.id
                            ? "green"
                            : el.employee
                            ? "grey"
                            : "white"
                        }
                        stroke={
                          selectedChairs.some((chair) => chair.id === el.id)
                            ? "blue"
                            : selectedId === el.id
                            ? "green"
                            : "black"
                        }
                        strokeWidth={
                          selectedChairs.some((chair) => chair.id === el.id) ||
                          selectedId === el.id
                            ? 2
                            : 1
                        }
                        draggable={false}
                        onClick={() => handleCheckboxChairSelection(el)}
                        onMouseEnter={() => setHoveredElement(el)}
                        onMouseLeave={() => setHoveredElement(null)}
                      />
                    ))}

                  {showChairsWithNames &&
                    elements?.map((el) => {
                      const matchedUser = userContextData?.find(
                        (user) => user?.user_id === el.user_id
                      );

                      if (!matchedUser) return null; // Skip if no user found

                      // Treat 180° as 0°
                      const correctedRotation =
                        el.rotation === 180 ? 0 : el.rotation;

                      // Default text position
                      let textX = el.x;
                      let textY = el.y;
                      let textRotation = correctedRotation; // Use corrected rotation value

                      switch (el.rotation) {
                        case 0: // Normal position (above chair)
                          textY = el.y + 55;
                          break;
                        case 90: // Rotated right (text to the right)
                          textX = el.x - 55;
                          textY = el.y;
                          break;
                        case 180: // Rotated right (text to the right)
                          textX = el.x - 40;
                          textY = el.y - 52;
                          break;
                        case 270: // Rotated left (text to the left)
                          textX = el.x + 60;
                          textY = el.y;
                          break;
                        case 450: // Rotated left (text to the left)
                          textX = el.x - 55;
                          textY = el.y;
                          break;
                        default:
                          textY = el.y - 15; // Fallback
                      }

                      return (
                        <>
                          {/* {matchedUser.image_url &&
                            matchedUser.image_url !==
                              "https://storage.googleapis.com/node-prod-bucket/" ? (
                              <AvatarImage
                                url={matchedUser.image_url}
                                x={textX - 15}
                                y={textY + 5}
                                width={30}
                                height={30}
                                style={{
                                  border: "2px solid orange",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : null} */}

                          <Text
                            key={el.id}
                            text={matchedUser.user_name || "N/A"}
                            fontSize={9}
                            fontStyle="bold"
                            x={textX}
                            y={textY}
                            fill="black"
                            align="center"
                            width={60}
                            rotation={textRotation} // Apply corrected rotation
                            offsetX={10} // Center adjustment
                            offsetY={10}
                          />
                        </>
                      );
                    })}
                </Layer>
              </Stage>
            </div>
            {/* )} */}
            <div className="ml-4">
              <Stage
                width={300}
                height={115}
                onMouseLeave={() => setHoveredElement(null)}
              >
                <Layer>
                  {hoveredElement?.user_id ? (
                    (() => {
                      const matchedUser = userContextData?.find(
                        (user) => user?.user_id === hoveredElement.user_id
                      );
                      if (!matchedUser) return null;

                      return (
                        <>
                          {/* Card Background */}
                          <Rect
                            x={10} // Small padding from the left
                            y={10} // Small padding from the top
                            width={280} // Width covering most of the Stage
                            height={100} // Height within Stage limits
                            fill="white"
                            shadowBlur={5}
                            cornerRadius={5}
                            stroke="black"
                          />

                          {/* Display Avatar if available */}
                          {matchedUser.image_url &&
                          matchedUser.image_url !==
                            "https://storage.googleapis.com/node-prod-bucket/" ? (
                            <AvatarImage
                              url={matchedUser.image_url}
                              x={20} // Position inside card
                              y={25} // Centered vertically
                              width={50}
                              height={50}
                              style={{
                                border: "2px solid orange",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <>
                              {/* Fallback User Icon */}
                              <Circle
                                x={45} // Center of the circle
                                y={45}
                                radius={25} // Circle radius
                                fill="lightgrey"
                              />
                              <Text
                                text="👤"
                                fontSize={24}
                                fill="white"
                                x={35} // Center inside the circle
                                y={35}
                              />
                            </>
                          )}

                          {/* Employee Details */}
                          <Text
                            text={`Employee: ${matchedUser.user_name || "N/A"}`}
                            fontSize={12}
                            fontStyle="bold"
                            x={80} // Next to avatar
                            y={25}
                            fill="black"
                          />
                          <Text
                            text={`Designation: ${
                              matchedUser.designation_name || "N/A"
                            }`}
                            fontSize={12}
                            x={80}
                            y={45}
                            fill="black"
                          />
                          <Text
                            text={`Department: ${
                              matchedUser.department_name || "N/A"
                            }`}
                            fontSize={12}
                            x={80}
                            y={65}
                            fill="black"
                          />
                        </>
                      );
                    })()
                  ) : (
                    <Text
                      text=""
                      fontSize={14}
                      x={140} // Center of the Stage
                      y={50}
                      fill="gray"
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </div>
          <div className="roomLayoutCardRight col p0">
            <div className="border-bottom p16 roomInner flexCenterBetween">
              <h6>Total Seats : {counts[0]?.totalNumberOfSeats}</h6>
              <h6>
                Assigned :{" "}
                <span className="colorSuccess">{counts[0]?.allocated}</span>
                <small className="colorLight">
                  /{counts[0]?.totalNumberOfSeats}
                </small>
              </h6>
            </div>
            <div className="border-bottom p16 roomInner">
              <ul className="seatInfo">
                <li>
                  <span>
                    <img src={selectedChair} />
                  </span>
                  Selected
                </li>
                <li>
                  <span>
                    <img src={assignedChair} />
                  </span>
                  Assigned
                </li>
                <li>
                  <span>
                    <img src={notassignedChair} />
                  </span>
                  Not Assigned
                </li>
              </ul>
            </div>
            <div className="border-bottom p16 roomInner">
              <div className="row">
                <div className="col-12 mb16">
                  <Select
                    value={selectedEmployee} // Bind to state
                    options={[
                      // { value: "", label: "Not Assigned" },
                      ...userData
                        ?.filter(
                          (option) =>
                            !elements.some(
                              (el) => el.user_id === option.user_id
                            )
                        )
                        .map((option) => ({
                          value: option.user_id,
                          label: option.user_name,
                          name: option.user_name,
                          image: option.image_url,
                        })),
                    ]}
                    placeholder="Select Employee"
                    onChange={(e) => {
                      setSelectedEmployee(e); // Update state when an employee is selected
                      if (e?.value) {
                        assignEmployee(e.value, e.name, e.image); // Pass user_id, user_name, and image
                      } else {
                        removeAssignment();
                      }
                    }}
                  />
                </div>
                <div className="col-6">
                  <button
                    className="btn cmnbtn w-100 btn-primary"
                    onClick={updateAssignment}
                  >
                    Save <FloppyDisk />
                  </button>
                </div>
                <div className="col-6">
                  {roomNameCard && (
                    <button
                      className="btn cmnbtn w-100 btn-success"
                      onClick={() => SittingExcelRoomWise(matchData)}
                    >
                      Excel <FileArrowDown />
                    </button>
                  )}
                </div>
                <div className="col-12">
                  <UnassignedUsersList
                    unassignedUsersList={unassignedUsersList}
                    onUserSelect={handleUserSelectionCheckBox}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Viewer;
