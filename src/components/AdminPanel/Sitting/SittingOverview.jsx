import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'
import { useAPIGlobalContext } from "../APIContext/APIContext";

const SittingOverview = () => {
  const {id} = useParams()
  const {userContextData} = useAPIGlobalContext ()
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}`+`get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  useEffect(() => {
    axios
      .get(`${baseUrl}get_total_sitting_by_room/${id}`)
      .then((res) => {
        setFilterData(res.data.room)
        console.log(res.data.room , 'sitting')
      })
      .catch((error) => console.error("Error fetching room details:", error));
  }, [id]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Sitting Ref No.",
      selector: (row) => row.sitting_ref_no,
      sortable: true,
    },
    {
      name: "Sitting Area",
      selector: (row) => row.sitting_area,
      sortable: true,
    },
    {
      name: "User Name",
      cell: (row) => userContextData?.find((user) => user.user_id === row.user_id)
      ?.user_name || "Not Alloted",
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remarks,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[7] &&
            contextData[7].update_value === 1 && (
              <Link to={`/admin/sitting-update/${row.sitting_id}`}>
                <button
                  title="Edit"
                  className="btn btn-outline-primary btn-sm user-button"
                >
                  <FaEdit />{" "}
                </button>
              </Link>
            )}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];
  return (
    <>
      <FormContainer
        mainTitle="Sitting"
        link="/"
      />
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Sitting Overview"
            columns={columns}
            data={filterData}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
      </div>
    </>
  );
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
// import { baseUrl } from "../../../utils/config";

// export default function SittingOverview() {
//   const [layouts, setLayouts] = useState({});
//   console.log(layouts, "layouts");

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
//         setLayouts({ ...layouts, [roomName]: { elements, backgroundImage } });
//       })
//       .catch((error) => {
//         console.error("Error saving layout:", error);
//         alert("Failed to save layout.");
//       });
//   };

//   return (
//     <div>
//       <Editor onSave={saveLayout} />
//       <Viewer/>
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
//           ? { ...el, x: xOffset, y: posSpacing.y, xOffset: xOffset += posSpacing.spacing }
//           : el
//       )
//     );
//   };

//   const alignChairsVertically = () => {
//     let yOffset = posSpacing.y;
//     setElements((prevElements) =>
//       prevElements.map((el) =>
//         selectedIds.includes(el.id)
//           ? { ...el, y: yOffset, x: posSpacing.x, yOffset: yOffset += posSpacing.spacing }
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
//     setElements((prevElements) =>
//       prevElements.map((el) =>
//         selectedIds.includes(el.id)
//           ? { ...el, x: draggedNode.x(), y: draggedNode.y() }
//           : el
//       )
//     );
//   };

//   return (
//     <div>
//       <h3>Office Layout Editor</h3>
//       <div>
//         <button onClick={() => addElement("Chair")}>Add Chair</button>
//         <button onClick={removeElement}>Remove Selected</button>
//         <input
//           type="number"
//           value={posSpacing.x}
//           onChange={(e) =>
//             setPosSpacing((prev) => ({
//               ...prev,
//               x: Number(e.target.value),
//             }))
//           }
//         />
//         <input
//           type="number"
//           value={posSpacing.y}
//           onChange={(e) =>
//             setPosSpacing((prev) => ({
//               ...prev,
//               y: Number(e.target.value),
//             }))
//           }
//         />
//         <input
//           type="number"
//           value={posSpacing.spacing}
//           onChange={(e) =>
//             setPosSpacing((prev) => ({
//               ...prev,
//               spacing: Number(e.target.value),
//             }))
//           }
//         />
//         <button onClick={alignChairsHorizontally}>
//           Align Selected Chairs Horizontally
//         </button>
//         <button onClick={alignChairsVertically}>
//           Align Selected Chairs Vertically
//         </button>
//         <input type="file" accept="image/*" onChange={handleBackgroundUpload} />
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="Enter room name"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//         />
//         <button onClick={saveLayout}>Save Layout</button>
//       </div>
//       <div>
//         <label>Rotation (degrees): </label>
//         <input
//           type="number"
//           value={rotationDegree}
//           onChange={(e) => setRotationDegree(Number(e.target.value))}
//         />
//         <button onClick={rotateSelectedChairs}>Rotate Selected Chairs</button>
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
