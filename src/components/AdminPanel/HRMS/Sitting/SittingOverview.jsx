import React from "react";
import UpdateSitting from "./UpdateSitting";

const SittingOverview = () => {
  return <UpdateSitting />;
};

export default SittingOverview;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   Stage,
//   Layer,
//   Rect,
//   Transformer,
//   Text,
//   Image,
//   Path,
// } from "react-konva";
// import axios from "axios";
// import Viewer from "./Viewer";
// import { baseUrl } from "../../../../utils/config";

// export default function SittingOverview() {
//   const [layouts, setLayouts] = useState({});

//   const saveLayout = (roomName, elements, backgroundImage) => {
//     const layoutData = {
//       roomName,
//       elements,
//       backgroundImage: backgroundImage ? backgroundImage.src : null,
//     };

//     // Post layout data to backend
//     axios
//       .post(baseUrl + "add_sitting_arrangement", layoutData)
//       .then((response) => {
//         alert("Layout saved successfully!");
//         setLayouts({ ...layouts, [roomName]: { elements } });
//       })
//       .catch((error) => {
//         console.error("Error saving layout:", error);
//         alert("Failed to save layout.");
//       });
//   };

//   return (
//     <div>
//       <Editor onSave={saveLayout} />
//       {/* <Viewer /> */}
//     </div>
//   );
// }

// const Editor = ({ onSave }) => {
//   const [elements, setElements] = useState([]);
//   const [roomName, setRoomName] = useState("");
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [backgroundImage, setBackgroundImage] = useState(null);
//   const [chairSVG, setChairSVG] = useState(null);
//   const [posSpacing, setPosSpacing] = useState({ x: 50, y: 50, spacing: 60 });
//   const [rotationDegree, setRotationDegree] = useState(0);
//   const transformerRef = useRef(null);
//   const layerRef = useRef(null);

//   useEffect(() => {
//     if (transformerRef.current) {
//       const nodes = selectedIds.map((id) =>
//         layerRef.current.findOne(`#element-${id}`)
//       );
//       transformerRef.current.nodes(nodes);
//       transformerRef.current.getLayer().batchDraw();
//     }
//   }, [selectedIds, elements]);

//   useEffect(() => {
//     // Load the SVG file
//     fetch("/Blank.svg")
//       .then((res) => res.text())
//       .then(setChairSVG);
//   }, []);

//   const handleBackgroundUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         const img = new window.Image();
//         img.src = reader.result;
//         img.onload = () => setBackgroundImage(img);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const addElement = (type) => {
//     const newElement = {
//       id: Date.now(),
//       x: 50,
//       y: 50,
//       user_id: 0,
//       // employeeName:"",
//       width: 72,
//       height: 63.6,
//       type,
//       rotation: 0,
//     };
//     setElements([...elements, newElement]);
//   };

//   const toggleSelection = (id) => {
//     setSelectedIds((prevSelected) =>
//       prevSelected.includes(id)
//         ? prevSelected.filter((selectedId) => selectedId !== id)
//         : [...prevSelected, id]
//     );
//   };

//   const removeElement = () => {
//     if (selectedIds.length === 0) {
//       alert("Please select elements to remove.");
//       return;
//     }
//     setElements(elements.filter((el) => !selectedIds.includes(el.id)));
//     setSelectedIds([]);
//   };

//   const handleTransformEnd = (node, id) => {
//     setElements((prevElements) =>
//       prevElements.map((el) =>
//         el.id === id
//           ? {
//               ...el,
//               x: node.x(),
//               y: node.y(),
//               width: Math.max(72, node.width() * node.scaleX()),
//               height: Math.max(63.6, node.height() * node.scaleY()),
//             }
//           : el
//       )
//     );
//     node.scaleX(1);
//     node.scaleY(1);
//   };

//   const saveLayout = () => {
//     if (!roomName.trim()) {
//       alert("Please enter a room name.");
//       return;
//     }

//     onSave(roomName, elements, backgroundImage);
//     setRoomName("");
//     setElements([]);
//     setBackgroundImage(null);
//     alert(`Layout for "${roomName}" saved.`);
//   };

//   const alignChairsHorizontally = () => {
//     let xOffset = posSpacing.x;
//     setElements((prevElements) =>
//       prevElements.map((el) =>
//         selectedIds.includes(el.id)
//           ? {
//               ...el,
//               x: xOffset,
//               y: posSpacing.y,
//               xOffset: (xOffset += posSpacing.spacing),
//             }
//           : el
//       )
//     );
//   };

//   const alignChairsVertically = () => {
//     let yOffset = posSpacing.y;
//     setElements((prevElements) =>
//       prevElements.map((el) =>
//         selectedIds.includes(el.id)
//           ? {
//               ...el,
//               y: yOffset,
//               x: posSpacing.x,
//               yOffset: (yOffset += posSpacing.spacing),
//             }
//           : el
//       )
//     );
//   };

//   const rotateSelectedChairs = () => {
//     setElements((prevElements) =>
//       prevElements.map((el) =>
//         selectedIds.includes(el.id)
//           ? { ...el, rotation: el.rotation + rotationDegree }
//           : el
//       )
//     );
//   };

//   const handleDragEnd = (e) => {
//     const draggedNode = e.target;
//     const draggedId = Number(draggedNode.id().split("-")[1]);

//     setElements((prevElements) =>
//       prevElements.map((el) => {
//         if (selectedIds.includes(el.id) || el.id === draggedId) {
//           setPosSpacing((prev) => ({
//             ...prev,
//             x: draggedNode.x(),
//             y: draggedNode.y(),
//           }));

//           return {
//             ...el,
//             x: draggedNode.x(),
//             y: draggedNode.y(),
//           };
//         } else return el;
//       })
//     );
//   };

//   return (
//     <div>
//       <h3>Office Layout Editor</h3>

//       <div className="d-flex mb-3 mt-2">
//         <button
//           className="btn cmnbtn btn_sm btn-outline-primary mr-2"
//           onClick={() => addElement("Chair")}
//         >
//           Add Chair
//         </button>
//         <button
//           className="btn cmnbtn btn_sm btn-outline-danger"
//           onClick={removeElement}
//         >
//           Remove Selected
//         </button>
//       </div>
//       <div className="mb-2">
//         <div className="d-flex">
//           <div>
//             <label>x position</label>
//             <input
//               type="number"
//               value={posSpacing.x}
//               onChange={(e) =>
//                 setPosSpacing((prev) => ({
//                   ...prev,
//                   x: Number(e.target.value),
//                 }))
//               }
//             />
//           </div>
//           <div>
//             <label>y position</label>
//             <input
//               type="number"
//               value={posSpacing.y}
//               onChange={(e) =>
//                 setPosSpacing((prev) => ({
//                   ...prev,
//                   y: Number(e.target.value),
//                 }))
//               }
//             />
//           </div>
//           <div>
//             <label>spacing</label>
//             <input
//               type="number"
//               value={posSpacing.spacing}
//               onChange={(e) =>
//                 setPosSpacing((prev) => ({
//                   ...prev,
//                   spacing: Number(e.target.value),
//                 }))
//               }
//             />
//           </div>

//           <button
//             className="btn cmnbtn btn_sm btn-outline-primary ml-2 mr-2"
//             onClick={alignChairsHorizontally}
//           >
//             Align Selected Chairs Horizontally
//           </button>
//           <button
//             className="btn cmnbtn btn_sm btn-outline-primary"
//             onClick={alignChairsVertically}
//           >
//             Align Selected Chairs Vertically
//           </button>
//         </div>
//       </div>
//       <div className="d-flex mb-2">
//         <div>
//           <label>Rotation (degrees): </label>
//           <input
//             type="number"
//             value={rotationDegree}
//             onChange={(e) => setRotationDegree(Number(e.target.value))}
//           />
//         </div>
//         <button
//           className="btn cmnbtn btn_sm btn-outline-primary ml-2"
//           onClick={rotateSelectedChairs}
//         >
//           Rotate Selected Chairs
//         </button>
//       </div>
//       <div className="d-flex mb-2">
//         <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
//         <input
//           type="text"
//           placeholder="Enter room name"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//         />
//         <button
//           className="btn cmnbtn btn_sm btn-success ml-2"
//           onClick={saveLayout}
//         >
//           Save Layout
//         </button>
//       </div>

//       <Stage
//         width={1100}
//         height={600}
//         onMouseDown={(e) => {
//           if (e.target === e.target.getStage()) setSelectedIds([]);
//         }}
//       >
//         <Layer ref={layerRef}>
//           {backgroundImage && (
//             <Image
//               image={backgroundImage}
//               width={1100}
//               height={600}
//               onMouseDown={() => setSelectedIds([])}
//             />
//           )}
//           {elements.map((el) => (
//             <Path
//               key={el.id}
//               id={`element-${el.id}`}
//               x={el.x}
//               y={el.y}
//               rotation={el.rotation}
//               scale={{ x: el.width / 100, y: el.height / 100 }}
//               data={chairSVG}
//               fill={selectedIds.includes(el.id) ? "blue" : "white"}
//               stroke="grey"
//               draggable
//               onClick={() => toggleSelection(el.id)}
//               onDragEnd={handleDragEnd}
//               onTransformEnd={(e) => handleTransformEnd(e.target, el.id)}
//             />
//           ))}
//           {selectedIds.length > 0 && (
//             <Transformer
//               ref={transformerRef}
//               nodes={selectedIds.map((id) =>
//                 layerRef.current.findOne(`#element-${id}`)
//               )}
//             />
//           )}
//         </Layer>
//       </Stage>
//     </div>
//   );
// };
