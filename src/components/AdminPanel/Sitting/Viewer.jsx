import { useEffect, useState } from "react";
import { Stage, Layer, Path, Text, Image } from "react-konva";
import Select from "react-select";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const Viewer = ({ layouts }) => {
  const { userContextData } = useAPIGlobalContext();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [elements, setElements] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [chairSVG, setChairSVG] = useState(null);

  useEffect(() => {
    // Load the SVG file
    fetch("/Blank.svg")
      .then((res) => res.text())
      .then(setChairSVG);
  }, []);

  // Watch for changes in `layouts` to reload the selected room
  useEffect(() => {
    if (selectedRoom && layouts[selectedRoom]) {
      const roomData = layouts[selectedRoom];
      setElements(roomData.ele);
      setBackgroundImage(roomData.bg);
    }
  }, [layouts, selectedRoom]);

  const loadLayout = (roomName) => {
    setSelectedRoom(roomName);
  };

  const assignEmployee = (employeeName) => {
    if (!selectedId) {
      alert("Please select a seat to assign an employee.");
      return;
    }
    const updatedElements = elements.map((el) =>
      el.id === selectedId ? { ...el, employee: employeeName } : el
    );
    setElements(updatedElements);
    alert(`Employee "${employeeName}" assigned to seat ID ${selectedId}.`);
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
    alert(`Employee assignment removed from seat ID ${selectedId}.`);
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
                { value: null, label: "Not Assigned" }, // Add "Not Assigned" option
                ...userContextData?.map((option) => ({
                  value: option.user_name,
                  label: option.user_name,
                })),
              ]}
              placeholder="Select an Employee"
              onChange={(e) => {
                if (e?.value) {
                  assignEmployee(e.value);
                } else {
                  removeAssignment(); // Remove assignment when "Not Assigned" is selected
                }
              }}
            />
          </div>
          <Stage width={1100} height={600} onMouseLeave={() => setHoveredElement(null)}>
            <Layer>
              {backgroundImage && (
                <Image image={backgroundImage} width={1100} height={600} />
              )}
              {elements.map((el) => (
                <Path
                  key={el.id}
                  id={el.id}
                  data={chairSVG}
                  x={el.x}
                  y={el.y}
                  scale={{ x: el.width / 100, y: el.height / 100 }}
                  rotation={el.rotation} // Ensure rotation is applied
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
