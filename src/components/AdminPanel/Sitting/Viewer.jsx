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
import { useAPIGlobalContext } from "../APIContext/APIContext";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import selectedChair from "../../../../public/icon/chair/selected.png";
import assignedChair from "../../../../public/icon/chair/assigned.png";
import notassignedChair from "../../../../public/icon/chair/not-assign.png";

import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

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
  roomNameCard,
  totalSittingDataCount,
  fetchAllocationCounts,
}) => {
  const { userContextData } = useAPIGlobalContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [elements, setElements] = useState([]);
  console.log(elements, "elelelel");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [chairSVG, setChairSVG] = useState(null);
  const [layouts, setLayouts] = useState({});
  const [id, setID] = useState("");

  const [showChairsWithNames, setShowChairsWithNames] = useState(false);

  const [matchData, setMatchData] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track selected dropdown value

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
  useEffect(() => {
    axios
      .get(baseUrl + "get_all_arrangement")
      .then((response) => {
        const layoutsData = response.data.reduce((acc, layout) => {
          acc[layout.roomName] = layout; // Group by room name
          return acc;
        }, {});
        setLayouts(layoutsData);

        const matchedData = response.data?.find(
          (d) => d.roomName === selectedRoom
        );
        setMatchData(matchedData);
        setID(matchedData ? matchedData._id : "");
      })
      .catch((error) => {
        console.error("Error fetching layouts:", error);
        alert("Failed to load layouts.");
      });
  }, [selectedRoom]);

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
        elements, // Pass the updated elements array
      };
      await axios.put(`${baseUrl}update_sitting_arrangement`, updatedData);
      alert("Layout updated successfully.");
      setSelectedEmployee(null); // Reset dropdown value after save
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

  return (
    <>
      <div className="card roomCard">
        <div className="card-header flexCenterBetween">
          <Link to={`/admin/office-sitting-room-wise/${selectedRoom}`}>
            <button className="btn btn-warning btn-sm">{selectedRoom}</button>
          </Link>
          {selectedRoom && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowChairsWithNames(!showChairsWithNames)}
              style={{
                position: "absolute",
                top: 10,
                left: 130,
                padding: "8px 10px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {showChairsWithNames
                ? "Hide Employee Names"
                : "Show Employee Names"}
            </button>
          )}
          <div className="d-flex">
            <div
              style={{
                width: "300px",
              }}
            >
              <Select
                value={selectedEmployee} // Bind to state
                options={[
                  { value: "", label: "Not Assigned" },
                  ...userData
                    ?.filter(
                      (option) =>
                        !elements.some((el) => el.user_id === option.user_id)
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
            <button
              className="btn cmnbtn btn_sm btn-success ml-2"
              onClick={updateAssignment}
            >
              Save
            </button>
            {roomNameCard && (
              <button
                className="btn cmnbtn btn_sm btn-primary ml-2"
                onClick={() => SittingExcelRoomWise(matchData)}
              >
                Excel
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="roomInner">
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

            <div className="floor">
              {selectedRoom ? (
                <Stage
                  width={1100}
                  height={600}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <Layer>
                    {backgroundImage && (
                      <KonvaImage
                        image={backgroundImage}
                        width={1100}
                        height={600}
                      />
                    )}
                    {chairSVG &&
                      elements?.map((el) => (
                        <Path
                          key={el.id}
                          id={el.id}
                          data={chairSVG}
                          x={el.x}
                          y={el.y}
                          scale={{ x: el.width / 100, y: el.height / 100 }}
                          rotation={el.rotation}
                          fill={
                            selectedId === el.id
                              ? "green"
                              : el.employee
                              ? "grey"
                              : "white"
                          }
                          stroke={selectedId === el.id ? "green" : "black"}
                          strokeWidth={selectedId === el.id ? 2 : 1}
                          draggable={false}
                          onClick={() => setSelectedId(el.id)}
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
                            textY = el.y - 55;
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
                              fontSize={10}
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

                    {hoveredElement?.user_id ? (
                      (() => {
                        const matchedUser = userContextData?.find(
                          (user) => user?.user_id === hoveredElement.user_id
                        );
                        if (!matchedUser) return null;

                        const defaultX = 100;
                        const defaultY = 100;

                        return (
                          <>
                            {/* Card Background */}
                            <Rect
                              x={850} // Fixed x position for the top-right corner
                              y={10} // Fixed y position for the top-right corner
                              width={200}
                              height={120}
                              fill="white"
                              shadowBlur={5}
                              cornerRadius={5}
                              stroke="black"
                            />
                            {matchedUser.image_url &&
                            matchedUser.image_url !==
                              "https://storage.googleapis.com/node-prod-bucket/" ? (
                              <AvatarImage
                                url={matchedUser.image_url}
                                x={920} // Adjusted to align inside the card
                                y={20} // Adjusted to align inside the card
                                width={50}
                                height={50}
                                style={{
                                  border: "2px solid orange",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <>
                                {/* Circle for the background */}
                                <Circle
                                  x={945} // Center position for the fallback icon
                                  y={45}
                                  radius={25} // Circle radius
                                  fill="light-grey"
                                />
                                {/* Text inside the circle */}
                                <Text
                                  text="👤"
                                  fontSize={30}
                                  fill="white"
                                  x={940 - 10}
                                  y={45 - 10}
                                />
                              </>
                            )}
                            <Text
                              text={`Employee: ${
                                matchedUser.user_name || "N/A"
                              }`}
                              fontSize={12}
                              fontStyle="bold"
                              x={860}
                              y={80}
                              fill="black"
                            />
                            <Text
                              text={`Designation: ${
                                matchedUser.designation_name || "N/A"
                              }`}
                              fontSize={12}
                              fontStyle="bold"
                              x={860}
                              y={95}
                              fill="black"
                            />
                            <Text
                              text={`Department: ${
                                matchedUser.department_name || "N/A"
                              }`}
                              fontSize={12}
                              fontStyle="bold"
                              x={860}
                              y={110}
                              fill="black"
                            />
                          </>
                        );
                      })()
                    ) : (
                      <Text
                        text=""
                        fontSize={14}
                        x={(hoveredElement?.x ?? 100) - 20}
                        y={(hoveredElement?.y ?? 100) - 25}
                        fill="gray"
                      />
                    )}
                  </Layer>
                  {/* {hoveredElement && (
                      <div className="roomTooltip">
                        {hoveredElement.image && (
                          <AvatarImage
                            url={hoveredElement.image}
                            x={hoveredElement.x - 0}
                            y={hoveredElement.y - 65}
                            width={50}
                            height={50}
                            style={{
                              border: "2px solid orange",
                              borderRadius: "50%", // Optional for rounded borders
                            }}
                          />
                        )}
                        <Text
                          text={
                            hoveredElement.employee
                              ? hoveredElement.employee
                              : "Not assigned"
                          }
                          fontSize={16}
                          x={hoveredElement.x - 20}
                          y={hoveredElement.y - 25} // Position above avatar
                        />
                      </div>
                    )} */}
                </Stage>
              ) : (
                <div className="no-room-message">
                  <h3>Please select a room to view its layout.</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Viewer;
