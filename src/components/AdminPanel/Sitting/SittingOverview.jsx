import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect,
  Transformer,
  Text,
  Image,
  Path,
} from "react-konva";
import Draggable from "react-draggable";
import Viewer from "./Viewer";

export default function SittingOverview() {
  const [layouts, setLayouts] = useState({});
  console.log(layouts,"layouts");
  

  const saveLayout = (roomName, elements, floor) => {
    setLayouts({ ...layouts, [roomName]: { ele: elements, bg: floor } });
  };

  return (
    <div>
      <Editor onSave={saveLayout} />
      <Viewer layouts={layouts} />
    </div>
  );
}


const Editor = ({ onSave }) => {
  const [elements, setElements] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [selectedIds, setSelectedIds] = useState([]); // Track multiple selected elements
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [chairSVG, setChairSVG] = useState(null); // Store the SVG path data
  const [posSpacing, setPosSpacing] = useState({ x: 50, y: 50, spacing: 60 });
  const [rotationDegree, setRotationDegree] = useState(0); // State for rotation degree
  const transformerRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    // Load the SVG file
    fetch("/Blank.svg")
      .then((res) => res.text())
      .then(setChairSVG);
  }, []);

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
      width: 72,
      height: 63.6,
      type,
      rotation: 0, // Initialize rotation
    };
    setElements([...elements, newElement]);
  };

  const toggleSelection = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id) // Deselect
        : [...prevSelected, id] // Select
    );
  };

  const removeElement = () => {
    if (selectedIds.length === 0) {
      alert("Please select elements to remove.");
      return;
    }
    const updatedElements = elements.filter((el) => !selectedIds.includes(el.id));
    setElements(updatedElements);
    setSelectedIds([]);
  };

  const handleTransformEnd = (node, id) => {
  
    
    const updatedElements = elements.map((el) => {
      return el.id === id
        ? {
            ...el,
            x: node.x(),
            y: node.y(),
            width: Math.max(72, node.width() * node?.scaleX()),
            height: Math.max(63.6, node.height() * node?.scaleY()),
          }
        : el;
    });
    setElements(updatedElements);

    node.scaleX(1);
    node.scaleY(1);
  };

  const saveLayout = () => {
    if (!roomName.trim()) {
      alert("Please enter a room name.");
      return;
    }
    onSave(roomName, elements, backgroundImage);
    setRoomName("");
    setElements([]);
    setBackgroundImage(null);
    alert(`Layout for "${roomName}" saved.`);
  };

  const alignChairsHorizontally = () => {
    const selectedChairs = elements.filter(
      (el) => el.type === "Chair" && selectedIds.includes(el.id)
    );

   
    let xOffset = posSpacing?.x;

    const updatedElements = elements.map((el) => {
      
      if (selectedIds.includes(el.id)) {
        const updatedElement = { ...el, x: xOffset, y: posSpacing?.y };
        xOffset +=posSpacing?.spacing;
        return updatedElement;
      }
      return el;
    });

    setElements(updatedElements);
  };

  const alignChairsVertically = () => {
    const selectedChairs = elements.filter(
      (el) => el.type === "Chair" && selectedIds.includes(el.id)
    );

   
    let yOffset = posSpacing.y;

    const updatedElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        const updatedElement = { ...el, x: posSpacing?.x, y: yOffset };
        yOffset += posSpacing?.spacing;
        return updatedElement;
      }
      return el;
    });

    setElements(updatedElements);
  };

  const rotateSelectedChairs = () => {
    const updatedElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return { ...el, rotation: el.rotation+rotationDegree };
      }
      return el;
    });
    setElements(updatedElements);
  };

  const handleDragEnd = (e) => {
    const draggedNode = e.target;
  
    // Only update positions for selected elements
    const updatedElements = elements.map((element) => {
      if (selectedIds.includes(element.id)) {
        const node = layerRef.current.findOne(`#element-${element.id}`);
        return {
          ...element,
          x: node.x(),
          y: node.y(),
        };
      }
      return element;
    });
  
    setElements(updatedElements);
  };
  

  return (
    <div>
      <h3>Office Layout Editor</h3>
      <div>
        <button onClick={() => addElement("Chair")}>Add Chair</button>
        <button onClick={removeElement}>Remove Selected</button>
        <input
          type="number"
          value={posSpacing.x}
          onChange={(e) =>
            setPosSpacing((prev) => ({
              ...prev,
              x: Number(e.target.value),
            }))
          }
        />
        <input
          type="number"
          value={posSpacing.y}
          onChange={(e) =>
            setPosSpacing((prev) => ({
              ...prev,
              y: Number(e.target.value),
            }))
          }
        />
        <input
          type="number"
          value={posSpacing.spacing}
          onChange={(e) =>
            setPosSpacing((prev) => ({
              ...prev,
              spacing: Number(e.target.value),
            }))
          }
        />
        <button onClick={() => alignChairsHorizontally()}>
          Align Selected Chairs Horizontally
        </button>
        <button onClick={() => alignChairsVertically()}>
          Align Selected Chairs Vertically
        </button>
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
      <div>
        <label>Rotation (degrees): </label>
        <input
          type="number"
          value={rotationDegree}
          onChange={(e) => setRotationDegree(Number(e.target.value))}
        />
        <button onClick={rotateSelectedChairs}>Rotate Selected Chairs</button>
      </div>
      <Stage
        width={1100}
        height={600}
        onMouseDown={(e) => {
          if(selectedIds.includes(e.id))
          setSelectedIds([]);
        
      }}
       
      >
        <Layer ref={layerRef}>
          {backgroundImage && (
            <Image image={backgroundImage} width={1100} height={600} onMouseDown={(e) => {
                setSelectedIds([]);
              
            }} />
          )}
          {elements.map((el) => {
            if (el.type === "Chair" && chairSVG) {
              
              return (
                <Path
                  key={el.id}
                  id={`element-${el.id}`}
                  x={el.x}
                  y={el.y}
                  rotation={el.rotation} // Apply rotation
                  scale={{ x: el.width / 100, y: el.height / 100 }}
                  data={chairSVG}
                  fill={selectedIds.includes(el.id) ? "blue" : "white"}
                  stroke="grey"
                  draggable
                  onClick={() => toggleSelection(el.id)}
                  onDragEnd={handleDragEnd}
                  onTransformEnd={(e) => handleTransformEnd(e.target, el.id)}
                />
              );
            }
          })}
          {selectedIds.length > 0 && (
            <Transformer
              ref={transformerRef}
              nodes={selectedIds.map((id) =>
                layerRef.current.findOne(`#element-${id}`)
              )}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};


