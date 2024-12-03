import React from "react";

const SittingOverview = () => {
  return <div>SittingOverview</div>;
};

export default SittingOverview;

/*
import "./styles.css";
import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Transformer, Text, Image} from "react-konva";
import Draggable from "react-draggable";

export default function App() {
  const [layouts, setLayouts] = useState({});

  const saveLayout = (roomName, elements,floor) => {
    setLayouts({ ...layouts, [roomName]: {"ele":elements,bg:floor} });
  };


  return (
    <div>
      <Editor onSave={saveLayout} />
      <Viewer layouts={layouts} />
    </div>
  );
}

const Viewer = ({ layouts }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [backgroundImage,setBackgroundImage] = useState(null);

  const loadLayout = (roomName) => {
    setSelectedRoom(roomName);
    setElements(layouts[roomName]["ele"]);
    setSelectedId(null);
    setBackgroundImage(layouts[roomName]["bg"])
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

  return (
    <div>
      <h1>Office Layout Viewer</h1>
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
          <input
            type="text"
            placeholder="Enter employee name"
            onKeyDown={(e) => {
              if (e.key === "Enter") assignEmployee(e.target.value);
            }}
          />
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseLeave={() => setHoveredElement(null)}
          >
            <Layer>
            {backgroundImage && (
            <Image
              image={backgroundImage}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          )}
              {elements.map((el) => (
                <Rect
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  width={el.width}
                  height={el.height}
                  fill={el.type === "Table" ? "lightblue" : "lightgreen"}
                  stroke={selectedId === el.id ? "blue" : "black"}
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
                  x={hoveredElement.x + hoveredElement.width / 2}
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

const Editor = ({ onSave }) => {
  const [elements, setElements] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const transformerRef = useRef(null);
  const layerRef = useRef(null);

  // Load the image from file
  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new window.Image();
        img.src = reader.result;
        img.onload = () => setBackgroundImage(img);
      };
      reader.readAsDataURL(file);
    }
  };

  const addElement = (type) => {
    const newElement = {
      id: elements.length + 1,
      x: 50,
      y: 50,
      width: type === "Table" ? 100 : 50,
      height: type === "Table" ? 50 : 50,
      type,
      employee: null,
    };
    setElements([...elements, newElement]);
  };

  const removeElement = () => {
    if (!selectedId) {
      alert("Please select an element to remove.");
      return;
    }
    const updatedElements = elements.filter((el) => el.id !== selectedId);
    setElements(updatedElements);
    setSelectedId(null);
  };

  const handleTransformEnd = (node, id) => {
    const updatedElements = elements.map((el) =>
      el.id === id
        ? {
            ...el,
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * node.scaleX()),
            height: Math.max(20, node.height() * node.scaleY()),
          }
        : el
    );
    setElements(updatedElements);
    node.scaleX(1);
    node.scaleY(1);
  };

  const saveLayout = () => {
   
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }
    onSave(roomName, elements,backgroundImage);
    setRoomName("");
    setElements([]);
    setBackgroundImage(null);
    alert(`Layout for "${roomName}" saved.`);
  };

  return (
    <div>
      <h1>Office Layout Editor</h1>
      <div>
        <button onClick={() => addElement("Table")}>Add Table</button>
        <button onClick={() => addElement("Chair")}>Add Chair</button>
        <button onClick={removeElement}>Remove Selected</button>
        <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button onClick={saveLayout}>Save Layout</button>
      </div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={(e) => {
          if (e.target === e.target.getStage()) {
            setSelectedId(null);
          }
        }}
      >
        <Layer ref={layerRef}>
          {backgroundImage && (
            <Image
              image={backgroundImage}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          )}
          {elements.map((el) => (
            <Rect
              key={el.id}
              id={`element-${el.id}`}
              x={el.x}
              y={el.y}
              width={el.width}
              height={el.height}
              fill={el.type === "Table" ? "lightblue" : "lightgreen"}
              stroke={selectedId === el.id ? "blue" : "black"}
              strokeWidth={selectedId === el.id ? 2 : 1}
              draggable
              onClick={() => setSelectedId(el.id)}
              onDragEnd={(e) => {
                const updatedElements = elements.map((element) =>
                  element.id === el.id
                    ? { ...element, x: e.target.x(), y: e.target.y() }
                    : element
                );
                setElements(updatedElements);
              }}
              onTransformEnd={(e) => handleTransformEnd(e.target, el.id)}
            />
          ))}
          {selectedId && (
            <Transformer
              ref={transformerRef}
              nodes={
                selectedId
                  ? [layerRef.current.findOne(`#element-${selectedId}`)]
                  : []
              }
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

*/
