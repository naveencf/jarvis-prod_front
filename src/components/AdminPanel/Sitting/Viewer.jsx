import { useEffect, useState } from "react";
import { Stage, Layer, Path, Text, Image as KonvaImage } from "react-konva";
import Select from "react-select";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import selectedChair from "../../../../public/icon/chair/selected.png";
import assignedChair from "../../../../public/icon/chair/assigned.png";
import notassignedChair from "../../../../public/icon/chair/not-assign.png";

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

const Viewer = ({ roomNameCard }) => {
  console.log(roomNameCard, "card");
  const { userContextData } = useAPIGlobalContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [elements, setElements] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [chairSVG, setChairSVG] = useState(null);
  const [layouts, setLayouts] = useState({});
  const [id, setID] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track selected dropdown value

  const totalSeats = elements.length;
  const assignedSeats = elements.filter((el) => el.employee).length;
  const notAssignedSeats = totalSeats - assignedSeats;

  const userData = userContextData.filter(
    (d) => d.user_status === "Active" && d.job_type === "WFO"
  );

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
      img.src = roomData.image;
      img.onload = () => setBackgroundImage(img);
    }
  }, [layouts, selectedRoom]);

  const loadLayout = (roomName) => {
    setSelectedRoom(roomName);
  };

  const updateAssignment = async () => {
    try {
      const updatedData = {
        _id: id,
        elements, // Pass the updated elements array
      };
      await axios.put(`${baseUrl}update_sitting_arrangement`, updatedData);
      alert("Layout updated successfully.");
      setSelectedEmployee(null); // Reset dropdown value after save
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
          <h4 class="card-title">{selectedRoom}</h4>
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
                    {elements.map((el) => (
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
                    {hoveredElement && (
                      <div className="roomTooltip">
                        {hoveredElement.image && (
                          <AvatarImage
                            url={hoveredElement.image}
                            x={hoveredElement.x - 25}
                            y={hoveredElement.y - 25}
                            width={40}
                            height={40}
                          />
                        )}
                        <Text
                          text={
                            hoveredElement.employee
                              ? hoveredElement.employee
                              : "Not assigned"
                          }
                          fontSize={16}
                          x={hoveredElement.x - 30}
                          y={hoveredElement.y - 50} // Position above avatar
                        />
                      </div>
                    )}
                  </Layer>
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
      {/* <div className="">
        <div className="d-flex">
          {Object.keys(layouts).map((roomName) => (
            <button
              className="btn cmnbtn btn_sm btn-primary ml-2 mt-2"
              key={roomName}
              onClick={() => loadLayout(roomName)}
            >
              {roomName}
            </button>
          ))}
        </div>
        {selectedRoom && (
          <>
            <div className="">
              <span className=" badge-success mr-2">Selected: Green</span>
              <span className=" badge-primary mr-2">Assigned: Grey</span>
              <span className=" badge-warning">Not Assigned: White</span>
            </div>

            <div className="d-flex justify-content-center"></div>
          </>
        )}
      </div> */}
    </>
  );
};

export default Viewer;
