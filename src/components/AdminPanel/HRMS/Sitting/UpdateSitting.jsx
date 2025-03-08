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
import { Link } from "react-router-dom";
import Slider from "react-slick"; // Import Slider
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS
import noRoomSelect from "../../../../assets/imgs/other/no-room-selected.jpg";
import room104 from "../../../../assets/imgs/sitting/room-104.png";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";

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

const UpdateSitting = ({
  roomNameCard,
  totalSittingDataCount,
  fetchAllocationCounts,
}) => {
  const { usersDataContext } = useGlobalContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [elements, setElements] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [chairSVG, setChairSVG] = useState(null);
  const [layouts, setLayouts] = useState({});
  const [id, setID] = useState("");

  const [showChairsWithNames, setShowChairsWithNames] = useState(false);

  const [matchData, setMatchData] = useState("");

  const [roomWiseCount, setRoomWiseCount] = useState([]);
  console.log(roomWiseCount, "room wise count");

  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track selected dropdown value
  // const userData = usersDataContext.filter(
  //   (d) => d.user_status === "Active" && d.job_type === "WFO"
  // );

  useEffect(() => {
    // Load chair SVG
    fetch("/Blank.svg")
      .then((res) => res.text())
      .then(setChairSVG);
  }, []);

  const handleGetAllRooms = async () => {
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

  useEffect(() => {
    handleGetAllRooms();
  }, []);

  const handleCardClick = (room, d) => {
    loadLayout(room);
  };

  // Fetch room layouts from API
  useEffect(() => {
    axios
      .get(baseUrl + "get_all_arrangement")
      .then((response) => {
        const layoutsData = response?.data?.reduce((acc, layout) => {
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
    console.log(elements, "update elelment");
    try {
      const updatedData = {
        _id: id,
        elements: elements,
      };
      await axios.put(baseUrl + "update_sitting_arrangement", updatedData);
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

  const addNewChair = () => {
    const newChair = {
      id: Date.now(), // Unique ID
      x: 100, // Default X position
      y: 100, // Default Y position
      width: 72,
      height: 63.6,
      rotation: 0, // Default rotation
      employee: null, // No assigned employee initially
    };

    setElements([...elements, newChair]);
  };
  const removeChair = () => {
    if (!selectedId) {
      alert("Please select a chair to remove.");
      return;
    }

    const updatedElements = elements.filter((el) => el.id !== selectedId); // Remove the selected chair
    setElements(updatedElements);
    setSelectedId(null); // Reset selection
  };

  const handleDragEnd = (e, id) => {
    const newX = e.target.x();
    const newY = e.target.y();

    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, x: newX, y: newY } : el
    );

    setElements(updatedElements);
  };

  const updateRotation = (angle) => {
    if (!selectedId) {
      alert("Please select a chair to rotate.");
      return;
    }

    const updatedElements = elements.map((el) =>
      el.id === selectedId ? { ...el, rotation: angle } : el
    );

    setElements(updatedElements);
  };

  return (
    <>
      <div className="scrollRow mb-2">
        <Slider {...sliderSettings}>
          {roomWiseCount?.map((d, index) => (
            <div className="RoomSlideCard" key={index}>
              <div
                className="timeDataCard card"
                onClick={() => handleCardClick(d.roomName, d)}
              >
                <div className="card-body p16">
                  <div className="titleCard w-100">
                    <div className="titleCardImg bgPrimary border-0">
                      <i className="bi bi-pc-display-horizontal"></i>
                    </div>
                    <div className="titleCardText w-75">
                      <h2 className="colorPrimary">{d.roomName}</h2>
                      <h3>
                        Total Seats:
                        {d.counts.allocated + d.counts.not_allocated}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {selectedRoom ? (
        <div className="roomLayoutCard card">
          <div className="card-body roomLayoutCardIn row">
            <div className="roomLayoutCardLeft col">
              {selectedRoom && (
                <Link to={`/admin/office-sitting-room-wise/${selectedRoom}`}>
                  <h5 className="card-title mb16">{selectedRoom}</h5>
                </Link>
              )}

              <div className="floorStage">
                <Stage
                  width={820}
                  height={480}
                  onMouseLeave={() => setHoveredElement(null)}
                  onClick={() => setSelectedId(null)} // Deselect chair when clicking outside
                >
                  <Layer>
                    {backgroundImage && (
                      <KonvaImage
                        image={backgroundImage}
                        width={820}
                        height={480}
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
                          scale={{ x: el.width / 125, y: el.height / 115 }}
                          rotation={el.rotation}
                          fill={
                            selectedId === el.id
                              ? "green"
                              : el.employee
                                ? "white"
                                : "white"
                          }
                          stroke={selectedId === el.id ? "green" : "black"}
                          strokeWidth={selectedId === el.id ? 2 : 1}
                          draggable={true}
                          onClick={(e) => {
                            e.cancelBubble = true; // Prevents stage click from triggering when clicking on a chair
                            setSelectedId(el.id);
                          }}
                          onMouseEnter={() => setHoveredElement(el)}
                          onMouseLeave={() => setHoveredElement(null)}
                          onDragEnd={(e) => handleDragEnd(e, el.id)}
                        />
                      ))}

                    {showChairsWithNames &&
                      elements?.map((el) => {
                        const matchedUser = usersDataContext?.find(
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
                        const matchedUser = usersDataContext?.find(
                          (user) => user?.user_id === hoveredElement.user_id
                        );
                        if (!matchedUser) return null;
                        return (
                          <>
                            {/* Card Background */}
                            {/* <Rect
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
                                
                                <Circle
                                  x={945} // Center position for the fallback icon
                                  y={45}
                                  radius={25} // Circle radius
                                  fill="light-grey"
                                />
                                
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
                            /> */}
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
                </Stage>
              </div>
            </div>
            <div className="roomLayoutCardRight col">
              <h5 className="card-title mb16">Edit Room</h5>
              <div className="row">
                <div className="col-6">
                  <button
                    className="btn cmnbtn w-100 btn-warning"
                    onClick={addNewChair}
                  >
                    Add Chair
                  </button>
                </div>
                <div className="col-6">
                  <button
                    onClick={removeChair}
                    disabled={!selectedId}
                    className="btn cmnbtn w-100 btn-danger"
                  >
                    Remove Chair
                  </button>
                </div>
                <div className="col-12">
                  <div className="rotation-control form-group mt8">
                    <label>Rotate Chair: </label>
                    <select
                      className="form-control"
                      value={
                        elements.find((el) => el.id === selectedId)?.rotation ||
                        0
                      }
                      onChange={(e) => updateRotation(parseInt(e.target.value))}
                      disabled={!selectedId} // Disable if no chair is selected
                    >
                      <option value="0">0°</option>
                      <option value="90">90°</option>
                      <option value="180">180°</option>
                      <option value="270">270°</option>
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    className="btn cmnbtn w-100 btn-success"
                    onClick={updateAssignment}
                  >
                    Update Sitting
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="blankWarning">
          <div className="blankWarningImg">
            <img src={noRoomSelect} />
          </div>
          <div className="blankWarningTxt">
            <h4>No Room selected!</h4>
            <p>
              Please select a Room first, then you can edit room sittings by
              drag and drop chairs.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateSitting;
