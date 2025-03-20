import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import axios from "axios";
import FormContainer from "../FormContainer";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const ObjectOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(
          `${baseUrl}` + `get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  function getData() {
    axios.get(baseUrl + "get_all_objs").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return (
        d.obj_name?.toLowerCase().match(search.toLowerCase()) ||
        d.soft_name?.toLowerCase().match(search.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Object Name",
      selector: (row) => row.obj_name,
      sortable: true,
    },
    {
      name: "Software Name",
      selector: (row) => row.soft_name,
    },
    {
      name: "Department",
      selector: (row) => row.dept_name,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {contextData &&
            contextData[2] &&
            contextData[2].update_value === 1 && (
              <Link to={`/admin/object-update/${row.obj_id}`}>
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
        mainTitle="Object"
        link="/admin/object-master"
        buttonAccess={
          contextData &&
          contextData[2] &&
          contextData[2].insert_value === 1 &&
          true
        }
      />

      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Object Overview"
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

// import { useState, useEffect, useRef } from "react";
// import DataTable from "react-data-table-component";
// import { Link } from "react-router-dom";
// import { FaEdit } from "react-icons/fa";
// import DeleteButton from "../DeleteButton";
// import axios from "axios";
// import FormContainer from "../FormContainer";
// import jwtDecode from "jwt-decode";
// import { baseUrl } from "../../../utils/config";
// import { set } from "date-fns";

// const ObjectOverview = () => {
//   const [search, setSearch] = useState("");
//   const [datas, setData] = useState([]);
//   const [filterData, setFilterData] = useState([]);
//   const [contextData, setDatas] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [filters, setFilters] = useState([]);
//   const [savedFilters, setSavedFilters] = useState([]);
//   const [customFilterNames, setCustomFilterNames] = useState(
//     Array(savedFilters?.length)?.fill("")
//   );
//   const [editName, setEditName] = useState({ index: null, value: false });
//   const setToggleEdit = (index) => {
//     savedFilters.map((item, i) => {
//       if (i === index) {
//         setEditName({ index: index, value: true });
//       }
//     });
//   };

//   const storedToken = sessionStorage.getItem("token");
//   const decodedToken = jwtDecode(storedToken);
//   const userID = decodedToken.id;

//   // custom dynamic table code starts here

//   const getTableData = async () => {
//     try {
//       const response = await axios.get(
//         baseUrl +
//           `get_dynamic_table_data?userId=${userID}&tableName=${"object table"}`
//       );
//       const responseData = response.data;

//       const savedFiltersData = response.data.data[0]?.filter_array;
//       setSavedFilters(savedFiltersData);

//       if (responseData && responseData.data && responseData.data.length > 0) {
//         const initialColumns = responseData.data[0].column_order_Obj || [
//           "Created_by",
//           "Dept_id",
//           "dept_name",
//           "obj_id",
//           "obj_name",
//           "soft_name",
//           "_id",
//         ];
//         setColumns(initialColumns);
//       } else {
//         const defaultColumns = [
//           "Created_by",
//           "Dept_id",
//           "dept_name",
//           "obj_id",
//           "obj_name",
//           "soft_name",
//           "_id",
//         ];
//         setColumns(defaultColumns);
//       }
//     } catch (error) {
//       console.error("Error fetching dynamic table data:", error);
//       const defaultColumns = [
//         "Created_by",
//         "Dept_id",
//         "dept_name",
//         "obj_id",
//         "obj_name",
//         "soft_name",
//         "_id",
//       ];
//       setColumns(defaultColumns);
//     }
//   };

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [drawerOpen1, setDrawerOpen1] = useState(false);

//   const handleDragStart = (e, index) => {
//     e.dataTransfer.setData("text/plain", index);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e, targetIndex) => {
//     const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
//     const newColumns = [...columns];
//     const draggedColumn = newColumns[draggedIndex];
//     newColumns.splice(draggedIndex, 1);
//     newColumns.splice(targetIndex, 0, draggedColumn);

//     axios.put(`${baseUrl}` + `edit_dynamic_table_data`, {
//       user_id: userID,
//       table_name: "object table",
//       column_order_Obj: newColumns,
//     });
//     setColumns(newColumns);
//   };

//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };
//   const toggleDrawer1 = () => {
//     setDrawerOpen1(!drawerOpen1);
//   };

//   const toggleColumn = (columnName) => {
//     let newColumns;
//     if (columns.includes(columnName)) {
//       newColumns = columns.filter((col) => col !== columnName);
//     } else {
//       newColumns = [...columns, columnName];
//     }

//     axios
//       .put(`${baseUrl}` + `edit_dynamic_table_data`, {
//         user_id: userID,
//         table_name: "object table",
//         column_order_Obj: newColumns,
//       })
//       .then(() => {
//         setColumns(newColumns);
//         getTableData();
//       })
//       .catch((error) => {
//         console.error("Error editing dynamic table data:", error);
//       });
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const handleItemsPerPageChange = (event) => {
//     setItemsPerPage(parseInt(event.target.value));
//   };

//   const getPageCount = () => {
//     return Math.ceil(filterData.length / itemsPerPage);
//   };

//   const getPageData = () => {
//     const startIndex = currentPage * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filterData.slice(startIndex, endIndex);
//   };

//   // custom dynamic table code ends here

//   // multiple filter code start here

//   const addFilter = () => {
//     const defaultColumn = columns[0];
//     const newFilters = [...filters, { column: defaultColumn, value: "" }];
//     setFilters(newFilters);
//   };

//   const updateFilterColumn = (index, column) => {
//     const updatedFilters = [...filters];
//     updatedFilters[index].column = column;
//     setFilters(updatedFilters);
//   };

//   const getUniqueColumnValues = (columnName) => {
//     const uniqueValues = new Set();
//     datas.forEach((item) => {
//       if (columnName in item) {
//         uniqueValues.add(item[columnName]);
//       }
//     });
//     return Array.from(uniqueValues);
//   };

//   const filterDataFun = (filters) => {
//     let filteredData = [...datas];
//     filters.forEach((filter) => {
//       const { column, value } = filter;
//       if (value !== "") {
//         filteredData = filteredData.filter((item) => {
//           const itemValue = String(item[column]).toLowerCase();
//           return itemValue.includes(value.toLowerCase());
//         });
//       }
//     });
//     setFilterData(filteredData);
//   };

//   const handleFilterChange = (index, column, value) => {
//     const updatedFilters = [...filters];
//     updatedFilters[index] = { column, value };
//     setFilters(updatedFilters);
//     filterDataFun(updatedFilters);
//   };

//   const removeFilter = (indexToRemove) => {
//     const updatedFilters = filters.filter(
//       (_, index) => index !== indexToRemove
//     );
//     setFilters(updatedFilters);
//     filterDataFun(updatedFilters);
//   };

//   // multiple filter code end here

//   useEffect(() => {
//     if (userID && contextData.length === 0) {
//       axios
//         .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
//         .then((res) => {
//           setDatas(res.data);
//         });
//     }
//   }, [userID]);

//   function getData() {
//     axios.get(baseUrl + "get_all_objs").then((res) => {
//       setData(res.data.data);
//       setFilterData(res.data.data);
//     });
//   }

//   useEffect(() => {
//     getData();
//     getTableData();
//   }, []);

//   useEffect(() => {
//     const result = datas.filter((d) => {
//       return (
//         d.obj_name?.toLowerCase().match(search.toLowerCase()) ||
//         d.soft_name?.toLowerCase().match(search.toLowerCase())
//       );
//     });
//     setFilterData(result);
//   }, [search]);

//   // filter save code start here

//   const handleFilterNameChange = (index, name) => {
//     const updatedCustomFilterNames = [...customFilterNames];
//     updatedCustomFilterNames[index] = name;
//     setCustomFilterNames(updatedCustomFilterNames);
//   };

//   const saveFilterName = (index) => {
//     const updatedSavedFilters = [...savedFilters];
//     updatedSavedFilters[index].name =
//       customFilterNames[index] || `Filter ${index + 1}`;
//     setSavedFilters(updatedSavedFilters);
//     if (editName.index === index) {
//       setEditName({ index: null, value: false });
//     }

//     axios.put(baseUrl + "edit_dynamic_table_data", {
//       user_id: userID,
//       table_name: "object table",
//       filter_array: updatedSavedFilters,
//     });
//   };
//   console.log(editName);
//   const saveFilter = () => {
//     const newSavedFilters = [...savedFilters, { filters }];
//     setSavedFilters(newSavedFilters);
//     axios.put(baseUrl + "edit_dynamic_table_data", {
//       user_id: userID,
//       table_name: "object table",
//       filter_array: newSavedFilters,
//     });
//   };

//   const applySavedFilter = (savedFilter) => {
//     setFilters(savedFilter.filters);
//     filterDataFun(savedFilter.filters);
//   };

//   const deleteFilter = (index) => {
//     const updatedSavedFilters = savedFilters.filter((_, i) => i !== index);
//     setSavedFilters(updatedSavedFilters);
//     axios.put(baseUrl + "edit_dynamic_table_data", {
//       user_id: userID,
//       table_name: "object table",
//       filter_array: updatedSavedFilters,
//     });
//   };

//   // save filter code end here

//   return (
//     <div>
//       <FormContainer
//         mainTitle="Object"
//         link="/admin/object-master"
//         buttonAccess={
//           contextData &&
//           contextData[2] &&
//           contextData[2].insert_value === 1 &&
//           true
//         }
//       />
//       <div className="card">
//         <div className="card-body">
//           <div className="filter-container row">
//             {savedFilters?.map((savedFilter, index) => (
//               <div key={index} className="saved-filter-container col-md-3">
//                 <div className="filter-wrapper">
//                   <span>
//                     <Dropdown>
//                       <div className="drop-content">
//                         <div
//                           className="drop-option"
//                           onClick={() => setToggleEdit(index)}
//                         >
//                           {" "}
//                           <i className="bi bi-pencil"></i>
//                           <p className="w-100 pl-3">Edit Name</p>
//                         </div>
//                         <div
//                           className="drop-option mt-1"
//                           onClick={() => deleteFilter(index)}
//                         >
//                           {" "}
//                           <i className="bi bi-trash"></i>{" "}
//                           <p className="w-100 pl-3">Delete</p>
//                         </div>
//                       </div>
//                     </Dropdown>
//                   </span>
//                   <button
//                     className="btn cmnbtn btn_sm btn-warning"
//                     onClick={() => applySavedFilter(savedFilter)}
//                     style={{ marginRight: "10px" }}
//                   >
//                     {savedFilter.name
//                       ? savedFilter.name
//                       : `Filter ${index + 1}`}
//                   </button>
//                 </div>
//                 {editName.index === index && (
//                   <>
//                     <input
//                       type="text"
//                       value={customFilterNames[index]}
//                       required="true"
//                       onChange={(e) =>
//                         handleFilterNameChange(index, e.target.value)
//                       }
//                       placeholder={`Filter ${index + 1} Name`}
//                       className="form-control filter-name-input"
//                     />
//                     <button
//                       className="btn cmnbtn btn-success"
//                       onClick={() => saveFilterName(index)}
//                       style={{ marginTop: "10px" }}
//                     >
//                       Change filter name
//                     </button>
//                   </>
//                 )}
//                 {/* <button className="btn btn-danger" onClick={() => deleteFilter(index)}>Delete</button> */}
//               </div>
//             ))}
//           </div>
//           <button
//             className="btn cmnbtn btn-success mt-2"
//             onClick={saveFilter}
//             disabled={filters.length === 0}
//           >
//             Save Filter
//           </button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-body thm_table dt">
//           <div className="dt-toolbar border-toolbar  MuiDataGrid-toolbarContainer css-128fb87-MuiDataGrid-toolbarContainer sb">
//             <div className="flex-row gap16">
//               <div>
//                 <button
//                   onClick={toggleDrawer}
//                   className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall css-12k3ht8-MuiButtonBase-root-MuiButton-root"
//                 >
//                   Hide/Show Columns
//                 </button>
//                 {drawerOpen && (
//                   <div className="drawer">
//                     {Object.keys(datas[0]).map((key) => (
//                       <div
//                         className="form-check form-switch dt-toggle"
//                         key={key}
//                         onClick={() => toggleColumn(key)}
//                       >
//                         <input
//                           className="form-check-input "
//                           role="switch"
//                           id="flexSwitchCheckDefault"
//                           type="checkbox"
//                           checked={columns.includes(key)}
//                           readOnly
//                         />
//                         <label
//                           className="form-check-label"
//                           htmlFor="flexSwitchCheckDefault"
//                         >
//                           {" "}
//                           {key}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="flex-row gap16">
//                 {drawerOpen1 && (
//                   <div className="drawer">
//                     <button
//                       className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall css-12k3ht8-MuiButtonBase-root-MuiButton-root"
//                       onClick={addFilter}
//                     >
//                       {" "}
//                       Add Filter
//                     </button>

//                     {filters.map((filter, index) => (
//                       <div
//                         key={index}
//                         className="filter align-items-center flex-row gap16"
//                       >
//                         <select
//                           className="form-control"
//                           value={filter.column}
//                           onChange={(e) => {
//                             const column = e.target.value;
//                             updateFilterColumn(index, column);
//                           }}
//                         >
//                           {columns.map((column) => (
//                             <option key={column} value={column}>
//                               {column}
//                             </option>
//                           ))}
//                         </select>
//                         {filter.column && (
//                           <select
//                             className="form-control"
//                             value={filter.value}
//                             onChange={(e) =>
//                               handleFilterChange(
//                                 index,
//                                 filter.column,
//                                 e.target.value
//                               )
//                             }
//                           >
//                             <option value="">Select Value</option>
//                             {getUniqueColumnValues(filter.column).map(
//                               (value, i) => (
//                                 <option key={i} value={value}>
//                                   {value}
//                                 </option>
//                               )
//                             )}
//                           </select>
//                         )}
//                         <button
//                           className="MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall css-12k3ht8-MuiButtonBase-root-MuiButton-root"
//                           onClick={() => removeFilter(index)}
//                         >
//                           <i className="bi bi-trash" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <button
//                   onClick={toggleDrawer1}
//                   className=" flex-row align-items-center MuiButtonBase-root MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeSmall MuiButton-textSizeSmall css-12k3ht8-MuiButtonBase-root-MuiButton-root"
//                 >
//                   <span className="MuiButton-startIcon MuiButton-iconSizeSmall css-y6rp3m-MuiButton-startIcon">
//                     <span className="MuiBadge-root css-1c32n2y-MuiBadge-root">
//                       <svg
//                         className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
//                         focusable="false"
//                         aria-hidden="true"
//                         viewBox="0 0 24 24"
//                         data-testid="FilterListIcon"
//                       >
//                         <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path>
//                       </svg>
//                       <span className="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular MuiBadge-colorPrimary css-u5p6dm-MuiBadge-badge"></span>
//                     </span>
//                   </span>
//                   Filters
//                 </button>
//               </div>
//             </div>

//             <div className="MuiFormControl-root MuiTextField-root css-3be3ve-MuiFormControl-root-MuiTextField-root-MuiDataGrid-toolbarQuickFilter">
//               <div className="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-colorPrimary MuiInputBase-formControl MuiInputBase-adornedStart MuiInputBase-adornedEnd css-q25xu3-MuiInputBase-root-MuiInput-root">
//                 <div className="dt-center">
//                   <svg
//                     className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-ptiqhd-MuiSvgIcon-root"
//                     focusable="false"
//                     aria-hidden="true"
//                     viewBox="0 0 24 24"
//                     data-testid="SearchIcon"
//                   >
//                     <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
//                   </svg>
//                   <input
//                     className="MuiInputBase-input MuiInput-input MuiInputBase-inputTypeSearch MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd css-c63i49-MuiInputBase-input-MuiInput-input"
//                     type="search"
//                     id=":ra:"
//                     placeholder="Search"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="data_tbl table-responsive table_responsive">
//             <table className="table border m-0">
//               <thead>
//                 <tr>
//                   {columns.map((column, index) => (
//                     <th
//                       key={column}
//                       draggable
//                       onDragStart={(e) => handleDragStart(e, index)}
//                       onDragOver={handleDragOver}
//                       onDrop={(e) => handleDrop(e, index)}
//                     >
//                       <div className="MuiDataGrid-columnHeaderTitleContainer MuiDataGrid-columnHeader MuiDataGrid-columnHeader--sortable MuiDataGrid-columnHeader--sorted MuiDataGrid-withBorderColor">
//                         <div className="MuiDataGrid-columnHeaderTitleContainerContent">
//                           <div className=" MuiDataGrid-columnHeaderTitle css-t89xny-MuiDataGrid-columnHeaderTitle head-font ">
//                             {column}
//                           </div>
//                         </div>
//                       </div>
//                     </th>
//                   ))}
//                   <th>
//                     <div className="MuiDataGrid-columnHeaderTitleContainer MuiDataGrid-columnHeader MuiDataGrid-columnHeader--sortable MuiDataGrid-columnHeader--sorted MuiDataGrid-withBorderColor">
//                       <div className="MuiDataGrid-columnHeaderTitleContainerContent">
//                         <div className=" MuiDataGrid-columnHeaderTitle css-t89xny-MuiDataGrid-columnHeaderTitle head-font ">
//                           Action
//                         </div>
//                       </div>
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getPageData(filterData).map((row, index) => (
//                   <tr className="dt-row" key={row.id}>
//                     {columns.map((column) => (
//                       <td key={column}>
//                         <div className="dt-row-col">{row[column]}</div>
//                       </td>
//                     ))}
//                     <td>
//                       <div className="dt-row-col">
//                         <Link to={`/admin/object-update/${row.obj_id}`}>
//                           <button title="Edit" className="icon-1">
//                             <i className="bi bi-pencil"></i>
//                           </button>
//                         </Link>
//                         <DeleteButton
//                           endpoint={"obj_delete"}
//                           id={row.obj_id}
//                           getData={getData}
//                         />
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="border-pagination pagination MuiDataGrid-footerContainer MuiDataGrid-withBorderColor css-wop1k0-MuiDataGrid-footerContainer sb">
//             <div></div>
//             <div className="MuiToolbar-root MuiToolbar-gutters MuiToolbar-regular MuiTablePagination-toolbar css-78c6dr-MuiToolbar-root-MuiTablePagination-toolbar">
//               <span>
//                 {currentPage + 1} of {getPageCount()}
//               </span>
//               <div className="MuiTablePagination-actions mr-4">
//                 <button
//                   className={`MuiButtonBase-root MuiIconButton-root  MuiIconButton-colorInherit MuiIconButton-sizeMedium css-zylse7-MuiButtonBase-root-MuiIconButton-root ${
//                     currentPage === 0 ? "Mui-disabled" : ""
//                   }`}
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 0}
//                 >
//                   <svg
//                     className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
//                     focusable="false"
//                     aria-hidden="true"
//                     viewBox="0 0 24 24"
//                     data-testid="KeyboardArrowLeftIcon"
//                   >
//                     <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"></path>
//                   </svg>
//                 </button>
//                 <button
//                   className={`MuiButtonBase-root MuiIconButton-root  MuiIconButton-colorInherit MuiIconButton-sizeMedium css-zylse7-MuiButtonBase-root-MuiIconButton-root ${
//                     currentPage === getPageCount() - 1 ? "Mui-disabled" : ""
//                   }`}
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === getPageCount() - 1}
//                 >
//                   <svg
//                     className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
//                     focusable="false"
//                     aria-hidden="true"
//                     viewBox="0 0 24 24"
//                     data-testid="KeyboardArrowRightIcon"
//                   >
//                     <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path>
//                   </svg>
//                 </button>
//               </div>
//               <div className="MuiTablePagination-actions mr-4">
//                 <div className="MuiInputBase-root MuiInputBase-colorPrimary MuiTablePagination-input css-16c50h-MuiInputBase-root-MuiTablePagination-select">
//                   <label className="mr-4" htmlFor="itemsPerPage">
//                     Items Per Page
//                   </label>
//                   <select
//                     style={{
//                       borderRadius: "40px",
//                       background: "var(--white)",
//                       border: "none",
//                     }}
//                     id="itemsPerPage"
//                     value={itemsPerPage}
//                     onChange={handleItemsPerPageChange}
//                   >
//                     <option value={10}>10</option>
//                     <option value={20}>20</option>
//                     <option value={50}>50</option>
//                     <option value={100}>100</option>
//                   </select>
//                 </div>
//               </div>
//               <div className="mr-4">Total Rows: {datas.length}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const Dropdown = ({ children, btnName }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const ref = useRef();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (ref.current && !ref.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [ref]);
//   return (
//     <div className="dropdown1" ref={ref}>
//       <div className="dropdown-toggle1" onClick={() => setIsOpen(!isOpen)}>
//         <i className="bi bi-three-dots"></i>
//       </div>
//       {isOpen && <div className="dropdown-content1">{children}</div>}
//     </div>
//   );
// };
// export default ObjectOverview;




// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import FormContainer from "../FormContainer";
// import jwtDecode from "jwt-decode";
// import { baseUrl } from "../../../utils/config";
// import { Link } from "react-router-dom";
// import DeleteButton from "../DeleteButton";
// import DynamicTable from './DynamicTable'

// const ObjectOverview = () => {
//   const [contextData, setDatas] = useState([]);

//   const storedToken = sessionStorage.getItem("token");
//   const decodedToken = jwtDecode(storedToken);
//   const userID = decodedToken.id;

//   useEffect(() => {
//     if (userID && contextData.length === 0) {
//       axios
//         .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
//         .then((res) => {
//           setDatas(res.data);
//         });
//     }
//   }, [userID]);

//   const tableActions = [
//     {
//       label: "Edit",
//       icon: "bi bi-pencil",
//       header: "Edit Action",
//       action: (row) => (
//         <Link to={`/admin/object-update/${row.obj_id}`}>
//           <button title="Edit" className="icon-1">
//             <i className="bi bi-pencil"></i>
//           </button>
//         </Link>
//       ), 
//     },
//     {
//       label: "Delete",
//       icon: "bi bi-trash",
//       header: "Delete Action",
//       action: (row, getData) => (
//         <DeleteButton endpoint="obj_delete" id={row.obj_id} getData={getData} />
//       ),
//     }
//   ];  

//   return (
//     <div>
//       <FormContainer
//         mainTitle="Object"
//         link="/admin/object-master"
//         buttonAccess={
//           contextData &&
//           contextData[2] &&
//           contextData[2].insert_value === 1 &&
//           true
//         }
//       />

//       <DynamicTable 
//         tableName='object table' 
//         tableFields={["Created_by","Dept_id","dept_name","obj_id","obj_name","soft_name","_id"]} 
//         tableApi='get_all_objs'
//         tableActions={tableActions}
//       />
//     </div>
//   );
// };

export default ObjectOverview;