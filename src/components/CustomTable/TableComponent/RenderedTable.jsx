import React, { useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import SkeletonLoader from "./SkeletonLoader";
import axios from "axios";
import CustomSelect from "../../ReusableComponents/CustomSelect";
import FieldContainer from "../../AdminPanel/FieldContainer";

const RenderedTable = ({
  headref,
  applyFlag,
  setApplyFlag,
  originalData,
  setColSearch,
  colSearch,
  tableref,
  data,
  fixedHeader,
  visibleColumns,
  rowSelectable,
  columnsheader,
  ascFlag,
  selectAll,
  currentPage,
  itemsPerPage,
  setSelectedRowsIndex,
  setSelectAll,
  setSortKey,
  setAscFlag,
  setResizing,
  setSortDirection,
  resizing,
  widths,
  setWidths,
  setColumns,
  sortedData,
  setSortedData,
  selectedRowsIndex,
  dataLoading,
  editableRows,
  loginUserId,
  baseUrl,
  tableName,
  setSelectedId,
  selectedId,
  filterCondition,
  setFilterCondition,
  oldSortKey,
  setOldSortKey,
  sortKey,
  fetchCreatedTable,
}) => {
  const [preventSelect, setPreventSelect] = useState(false);
  const [editflag, setEditFlag] = useState(false);
  const [rowColour, setRowColour] = useState(
    columnsheader.filter((col) => col.hasOwnProperty("colorRow"))[0]
  );
  const [lastTap, setLastTap] = useState(0);
  const tapTimeout = useRef(null);
  useEffect(() => {
    setRowColour(
      columnsheader.filter((col) => col.hasOwnProperty("colorRow"))[0]
    );
  }, [columnsheader]);

  const filterObject = [
    {
      name: "None",
      key: "none",
    },
    {
      name: "Is Empty",
      key: "isEmpty",
    },
    {
      name: "Is Not Empty",
      key: "isNotEmpty",
    },
    {
      name: "Text contains",
      key: "contains",
    },
    {
      name: "Text does not contain",
      key: "doesNotContain",
    },
    {
      name: "Text is exactly",
      key: "isExactly",
    },
    {
      name: "Text starts with",
      key: "startsWith",
    },
    {
      name: "Text ends with",
      key: "endsWith",
    },
    {
      name: "Greater than",
      key: "greaterThan",
    },
    {
      name: "Greater than or equal to",
      key: "greaterThanOrEqualTo",
    },
    {
      name: "Less than",
      key: "lessThan",
    },
    {
      name: "Less than or equal to",
      key: "lessThanOrEqualTo",
    },
    {
      name: "is equal to",
      key: "equalTo",
    },
    {
      name: "Is not equal to",
      key: "notEqualTo",
    },
    {
      name: "Is between",
      key: "between",
    },
    {
      name: "Is not between",
      key: "notBetween",
    },
  ];

  const valuefiller = (val) => {
    if (val === "none") {
      return { key: val, value1: "", value2: "", field: false };
    }
    if (val === "isEmpty" || val === "isNotEmpty") {
      return { key: val, value1: "", value2: "", field: false };
    } else if (
      val === "contains" ||
      val === "doesNotContain" ||
      val === "isExactly" ||
      val === "startsWith" ||
      val === "endsWith" ||
      val === "equalTo" ||
      val === "notEqualTo"
    ) {
      return { key: val, value1: "", value2: "", field: true };
    } else if (
      val === "greaterThan" ||
      val === "greaterThanOrEqualTo" ||
      val === "lessThan" ||
      val === "lessThanOrEqualTo"
    ) {
      return { key: val, value1: "", value2: "", field: true, type: "number" };
    } else if (val === "between" || val === "notBetween") {
      return { key: val, value1: "", value2: "", field: true, type: "number" };
    }
  };

  // Sync selectedId with colSearch
  useEffect(() => {
    // Create a new array of column search criteria based on selectedId
    const newColSearch = columnsheader?.map((column, index) => {
      if (!visibleColumns[index]) return []; // Skip invisible columns

      return selectedId[index]?.map((value) => ({
        [column.key]: value,
      }));
    });

    // Only update colSearch if it's actually different
    setColSearch((prevColSearch) => {
      if (JSON.stringify(prevColSearch) !== JSON.stringify(newColSearch)) {
        return newColSearch;
      }
      return prevColSearch;
    });
  }, [selectedId, columnsheader, visibleColumns, setColSearch]);

  const handleRowSelection = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    setSelectedRowsIndex((prevState) => {
      if (prevState.includes(actualIndex)) {
        return prevState.filter((i) => i !== actualIndex);
      } else {
        return [...prevState, actualIndex];
      }
    });
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedRowsIndex(data?.map((_, index) => index));
    } else {
      setSelectedRowsIndex([]);
    }
  };

  const sortFunc = (key, direction) => {
    setOldSortKey(sortKey);
    setSortKey(key);

    setAscFlag((prevState) => ({
      ...prevState,
      [direction]: !prevState[direction],
    }));
    setSortDirection(ascFlag[direction] ? "asc" : "desc");
  };

  const onMouseDown = (index) => (e) => {
    setResizing({
      index,
      startPos: e.clientX,
      startWidth: widths[index].width,
    });
    setPreventSelect(true);
  };

  const onMouseMove = (e) => {
    if (!resizing) return;
    const newWidths = [...widths];
    newWidths[resizing.index].width =
      resizing.startWidth + (e.clientX - resizing.startPos);
    setWidths(newWidths);
  };

  const onMouseUp = () => {
    setResizing(null);
    setPreventSelect(false);
  };

  useEffect(() => {
    if (resizing !== null) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [resizing, widths]);

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("dragged", index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, target) => {
    const draggedIndex = e.dataTransfer.getData("dragged");
    const newColumns = [...columnsheader];
    const draggedColumn = newColumns[draggedIndex];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(target, 0, draggedColumn);
    const arrayOfColumnsName = newColumns.map((column, index) => ({
      name: column.name,
      visibility: visibleColumns[index],
    }));

    await axios
      .put(`${baseUrl}` + "edit_dynamic_table_data", {
        user_id: loginUserId,
        table_name: tableName,
        column_order_Obj: arrayOfColumnsName,
      })
      .then(() => {
        setColumns(newColumns);
        fetchCreatedTable();
      })
      .catch((error) => {
        console.error("Error editing dynamic table data:", error);
      });
  };

  const handelchange = (e, index, column) => {
    let newData = [...sortedData];
    newData[index] = { ...newData[index], [column?.key]: e.target.value };
    setSortedData(newData);

    if (e.target.value === "" || editflag === false) {
      let prevData = [...sortedData];
      prevData[index] = {
        ...prevData[index],
        [column?.key]: data[index][column?.key],
      };
      setSortedData(prevData);
    }
  };

  const handleCheckboxChange = (colIndex, key, value) => {
    const newSelectedId = [...selectedId];
    const valueExists = newSelectedId[colIndex].includes(value);

    if (valueExists) {
      // Remove the value if it exists
      newSelectedId[colIndex] = newSelectedId[colIndex].filter(
        (val) => val !== value
      );
    } else {
      // Add the value if it does not exist
      newSelectedId[colIndex].push(value);
    }

    const updatedColSearch = colSearch.map((criteriaList, i) => {
      if (i === colIndex) {
        if (valueExists) {
          return criteriaList.filter((item) => item[key] !== value);
        } else {
          return [...criteriaList, { [key]: value }];
        }
      }
      return criteriaList;
    });

    setSelectedId(newSelectedId);
    setColSearch(updatedColSearch);
  };

  return (
    <>
      {dataLoading ? (
        <SkeletonLoader />
      ) : (
        <table className={`${preventSelect ? "prevent-select" : ""}`}>
          <thead className={fixedHeader ? "sticky-header" : ""}>
            <tr ref={headref}>
              {visibleColumns?.some((value) => value) && rowSelectable && (
                <th
                  style={{
                    width: "40px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "4px",
                    padding: "0",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columnsheader?.map(
                (column, index) =>
                  visibleColumns?.[index] && (
                    <th
                      key={index}
                      style={{
                        width: column.width ? `${column.width}px` : "auto",
                      }}
                    >
                      <div className="table-header">
                        <div
                          className="header-title"
                          key={index}
                          draggable
                          onDragStart={(e) => onDragStart(e, index)}
                          onDragOver={onDragOver}
                          onDrop={(e) => onDrop(e, index)}
                          onClick={() => {
                            sortFunc(column?.key, index);
                          }}
                        >
                          <p>{column.name}</p>
                        </div>
                        {originalData && column && (
                          <div className="wrapper-filed">
                            {column?.name?.toUpperCase().trim() !== "ACTIONS" &&
                              column?.name?.toUpperCase().trim() !== "S.NO" && (
                                <Dropdown
                                  tableref={tableref}
                                  btnHtml={
                                    <div className="col-opt">
                                      <svg
                                        width="15px"
                                        height="30px"
                                        viewBox="0 0 16 16"
                                        fill="#959DA3"
                                        className="bi bi-three-dots-vertical"
                                      >
                                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                      </svg>
                                    </div>
                                  }
                                >
                                  <DropdownElement
                                    filterObject={filterObject}
                                    filterCondition={filterCondition}
                                    index={index}
                                    originalData={originalData}
                                    column={column}
                                    selectedId={selectedId}
                                    setApplyFlag={setApplyFlag}
                                    applyFlag={applyFlag}
                                    handleCheckboxChange={handleCheckboxChange}
                                    setFilterCondition={setFilterCondition}
                                    valuefiller={valuefiller}
                                    setSelectedId={setSelectedId}
                                  />
                                </Dropdown>
                              )}
                            <div
                              className="resizable"
                              onMouseDown={onMouseDown(index)}
                            >
                              |
                            </div>
                          </div>
                        )}
                      </div>
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData?.length === undefined ? (
              <tr>
                <td colSpan={columnsheader.length}>
                  <div className="empty-state">
                    <h3>Oops Error!</h3>
                  </div>
                </td>
              </tr>
            ) : sortedData?.length === 0 ? (
              <tr>
                <td colSpan={columnsheader.length}>
                  <div className="empty-state">
                    <h3>No Data Found</h3>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData?.map((row, index) => (
                <tr
                  key={index}
                  style={{ background: rowColour?.colorRow(row, index) }}
                >
                  {visibleColumns?.some((value) => value) && rowSelectable && (
                    <td
                      style={{
                        paddingTop: "4px",
                        paddingLeft: "14px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRowsIndex.includes(
                          (currentPage - 1) * itemsPerPage + index
                        )}
                        onChange={() => handleRowSelection(index)}
                      />
                    </td>
                  )}

                  {columnsheader?.map(
                    (column, colIndex) =>
                      visibleColumns?.[colIndex] && (
                        <td
                          key={colIndex}
                          onClick={() => {
                            const now = Date.now();
                            const timeSinceLastTap = now - lastTap;

                            clearTimeout(tapTimeout.current);

                            if (
                              timeSinceLastTap < 1000 &&
                              timeSinceLastTap > 0
                            ) {
                              setEditFlag((prev) => {
                                if (prev === index) {
                                  return false;
                                } else {
                                  return index;
                                }
                              });
                            } else {
                              // Set timeout to detect double tap
                              tapTimeout.current = setTimeout(() => {
                                // Handle single tap if needed
                                setLastTap(0);
                              }, 300);
                            }
                            setLastTap(now);
                          }}
                        >
                          {editableRows[colIndex] && editflag === index ? (
                            column?.customEditElement ? (
                              column?.customEditElement(
                                row,
                                (currentPage - 1) * itemsPerPage + index,
                                setEditFlag,
                                editflag,
                                handelchange,
                                column
                              )
                            ) : (
                              <input
                                className="form-control"
                                type="text"
                                placeholder={row[column?.key]}
                                onChange={(e) => handelchange(e, index, column)}
                              />
                            )
                          ) : column?.renderRowCell ? (
                            column?.renderRowCell(
                              row,
                              (currentPage - 1) * itemsPerPage + index,
                              setEditFlag,
                              editflag,
                              handelchange,
                              column
                            )
                          ) : (
                            row?.[column?.key]
                          )}
                        </td>
                      )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </>
  );
};

function DropdownElement({
  filterObject,
  filterCondition,
  index,
  originalData,
  column,
  selectedId,
  setApplyFlag,
  applyFlag,
  handleCheckboxChange,
  setFilterCondition,
  valuefiller,
  setSelectedId,
  setIsOpen,
}) {
  return (
    <>
      <div className="dropdownIn">
        <ul className="flex-col">
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-toggle="collapse"
              data-target="#filterbycondition"
              aria-expanded="true"
              aria-controls="collapseTwom8"
            >
              Filter by condition
            </a>
            <div
              id="filterbycondition"
              className="collapse show"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <CustomSelect
                className="form-control form_sm"
                fieldGrid={12}
                dataArray={filterObject}
                optionId="key"
                optionLabel="name"
                selectedId={filterCondition[index]?.key}
                setSelectedId={(value) => {
                  setFilterCondition(
                    filterCondition.map((item, i) =>
                      i === index
                        ? {
                            ...item,
                            ...valuefiller(value),
                          }
                        : item
                    )
                  );
                }}
              />
              {filterCondition[index]?.field && (
                <FieldContainer
                  className="form-control form_sm"
                  fieldGrid={12}
                  type={filterCondition[index].type || "text"}
                  fieldLabel="Value"
                  placeholder={"Enter value"}
                  value={filterCondition[index].value1}
                  onChange={(e) => {
                    setFilterCondition(
                      filterCondition.map((item, i) =>
                        i === index
                          ? {
                              ...item,
                              value1: e.target.value,
                            }
                          : item
                      )
                    );
                  }}
                />
              )}

              {(filterCondition[index]?.key === "notBetween" ||
                filterCondition[index]?.key === "between") && (
                <FieldContainer
                  className="form-control form_sm"
                  fieldGrid={12}
                  fieldLabel="Value"
                  placeholder={"Enter value"}
                  type={
                    filterCondition[index]?.type !== undefined
                      ? filterCondition[index].type
                      : "text"
                  }
                  value={filterCondition[index].value2}
                  onChange={(e) => {
                    setFilterCondition(
                      filterCondition.map((item, i) =>
                        i === index
                          ? {
                              ...item,
                              value2: e.target.value,
                            }
                          : item
                      )
                    );
                  }}
                />
              )}
            </div>
          </li>

          <li className="nav-item">
            <div
              className="nav-link collapsed"
              data-toggle="collapse"
              data-target="#filterbyvalues"
              aria-expanded="true"
              aria-controls="collapseTwom8"
            >
              Filter by values
            </div>
            <div
              id="filterbyvalues"
              className="collapse show"
              aria-labelledby="headingTwo"
              data-parent="#accordionSidebar"
            >
              <CustomSelect
                dataArray={Object.values(
                  originalData?.reduce((acc, item) => {
                    // if (column?.compare) {
                    //   const render = column?.renderRowCell;
                    //   item = {
                    //     ...item,
                    //     [column.key]: render(item),
                    //   };
                    // }
                    acc[item[column?.key]] = item;
                    return acc;
                  }, {})
                )}
                optionId={column?.key}
                optionLabel={column?.key}
                selectedId={selectedId[index]}
                setSelectedId={(value) =>
                  setSelectedId(
                    selectedId.map((item, i) => (i === index ? value : item))
                  )
                }
                multiple={true}
                fieldGrid={12}
              />
              <div className="row groupCustomSelect">
                {Object.values(
                  originalData.reduce((acc, item) => {
                    // if (column?.compare) {
                    //   const render = column?.renderRowCell;
                    //   item = {
                    //     ...item,
                    //     [column.key]: render(item),
                    //   };
                    // }
                    acc[item[column.key]] = item;
                    return acc;
                  }, {})
                ).map((row, indices) => (
                  <div className="col form-check  dt-toggle" key={indices}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`flexSwitchCheckDefault-${indices}`}
                      checked={selectedId[index]?.includes(row[column.key])}
                      onChange={() =>
                        handleCheckboxChange(index, column.key, row[column.key])
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`flexSwitchCheckDefault-${indices}`}
                    >
                      {row[column.key]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="dropdownFooter">
        <button
          className="cmnbtn btn btn-success btn_sm ml-auto"
          onClick={() => {
            setApplyFlag(!applyFlag);
            setIsOpen((prev) => !prev);
          }}
        >
          Apply
        </button>
      </div>
    </>
  );
}

export default RenderedTable;
