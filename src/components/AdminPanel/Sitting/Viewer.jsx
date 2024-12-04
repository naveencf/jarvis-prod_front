import { useEffect, useState } from "react";
import { Stage, Layer, Path, Text, Image as KonvaImage } from "react-konva";
import Select from "react-select";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import axios from "axios";
import { baseUrl } from "../../../utils/config";

const Viewer = () => {
  const { userContextData } = useAPIGlobalContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [elements, setElements] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [chairSVG, setChairSVG] = useState(null);
  const [layouts, setLayouts] = useState({});

  useEffect(() => {
    // Load chair SVG
    fetch("/Blank.svg")
      .then((res) => res.text())
      .then(setChairSVG);
  }, []);

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
      })
      .catch((error) => {
        console.error("Error fetching layouts:", error);
        alert("Failed to load layouts.");
      });
  }, []);

  // Load selected room data
  useEffect(() => {
    if (selectedRoom && layouts[selectedRoom]) {
      const roomData = layouts[selectedRoom];

      // Adjust positions dynamically if all elements have the same coordinates
      const adjustedElements = roomData.elements.map((el, index) => ({
        ...el,
        x: el.x + (index % 5) * 80, // Adjust x position based on index
        y: el.y + Math.floor(index / 5) * 80, // Adjust y position in rows
      }));

      setElements(adjustedElements);

      // Load background image
      const img = new window.Image();
      img.src = roomData.image;
      img.onload = () => setBackgroundImage(img);
    }
  }, [layouts, selectedRoom]);

  const loadLayout = (roomName) => {
    setSelectedRoom(roomName);
  };

  const updateAssignment = async (seatId, employeeId, employeeName) => {
    try {
      await axios.put(`${baseUrl}update_sitting_arrangement`, {
        seatId,
        user_id: employeeId, // Include user_id in the payload
        employeeName,
      });
      alert(`Seat ID ${seatId} updated successfully.`);
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Failed to update assignment.");
    }
  };

  const assignEmployee = (employeeId, employeeName) => {
    if (!selectedId) {
      alert("Please select a seat to assign an employee.");
      return;
    }
    const updatedElements = elements.map((el) =>
      el.id === selectedId ? { ...el, employee: employeeName } : el
    );
    setElements(updatedElements);

    // Call API to update assignment
    updateAssignment(selectedId, employeeId, employeeName);
  };

  const removeAssignment = () => {
    if (!selectedId) {
      alert("Please select a seat to remove the assignment.");
      return;
    }
    const updatedElements = elements.map((el) =>
      el.id === selectedId ? { ...el, employee: null } : el
    );
    setElements(updatedElements);

    // Call API to remove assignment
    updateAssignment(selectedId, null, null);
  };

  return (
    <div>
      <div>
        <h2>Select a Room:</h2>
        {Object.keys(layouts).map((roomName) => (
          <button key={roomName} onClick={() => loadLayout(roomName)}>
            {roomName}
          </button>
        ))}
      </div>
      {selectedRoom && (
        <>
          <h2>Room: {selectedRoom}</h2>
          <div style={{ background: "white", width: "300px", marginBottom: "20px" }}>
            <Select
              options={[
                { value: "", label: "Not Assigned" },
                ...userContextData?.map((option) => ({
                  value: option.user_id, // Pass user_id as the value
                  label: option.user_name,
                  name: option.user_name, // Include user_name as an extra property
                })),
              ]}
              placeholder="Select an Employee"
              onChange={(e) => {
                if (e?.value) {
                  assignEmployee(e.value, e.name); // Pass user_id and user_name
                } else {
                  removeAssignment();
                }
              }}
            />
          </div>
          <Stage width={1100} height={600} onMouseLeave={() => setHoveredElement(null)}>
            <Layer>
              {backgroundImage && (
                <KonvaImage image={backgroundImage} width={1100} height={600} />
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
                  fill={selectedId === el.id ? "green" : el.employee ? "grey" : "white"}
                  stroke={selectedId === el.id ? "green" : "black"}
                  strokeWidth={selectedId === el.id ? 2 : 1}
                  draggable={false}
                  onClick={() => setSelectedId(el.id)}
                  onMouseEnter={() => setHoveredElement(el)}
                  onMouseLeave={() => setHoveredElement(null)}
                />
              ))}
              {hoveredElement && (
                <Text
                  text={
                    hoveredElement.employee
                      ? `Assigned to: ${hoveredElement.employee}`
                      : "Not assigned"
                  }
                  fontSize={16}
                  x={hoveredElement.x - 30}
                  y={hoveredElement.y - 20}
                  fill="black"
                  align="center"
                  width={150}
                />
              )}
            </Layer>
          </Stage>
        </>
      )}
    </div>
  );
};

export default Viewer;
