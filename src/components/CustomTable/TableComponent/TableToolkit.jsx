import React, { useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import "../Table.css";
import Modal from "react-modal";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import ExcelJS from "exceljs";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";

const TableToolkit = ({
  exportData,
  tableref,
  rowSelectable,
  setSearchQuery,
  searchQuery,
  toggleColumnVisibility,
  setVisibleColumns,
  columnsheader,
  visibleColumns,
  selectedRowsData,
  setSelectedRowsData,
  selectedRowsIndex,
  setSelectedRowsIndex,
  data,
  unSortedData,
  originalData,
  setUnSortedData,
  setColSearch,
  setInvadeFlag,
  selectedId,
  setSelectedId,
  setFilterCondition,
  filterCondition,
  colSearch,
  loginUserId,
  tableName,
  apiFilters,
  applyFlag,
  setApplyFlag,
  setApiFilters,
  setColumns,
  originalData1,
  sortedData,
  fetchCreatedTable,
  showTotal,
  showExport
}) => {
  const containerRef = useRef(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterList, setFilterList] = useState(apiFilters);
  const [checkedState, setCheckedState] = useState(
    new Array(filterList?.length).fill(false)
  );
  const [checkFlag, setcheckFlag] = useState(false);
  const [errorval, setErrorval] = useState(false);
  const [dragFlag, setDragFlag] = useState(false);
  const handleCheckboxChange = (index, filter) => {
    const updatedCheckedState = checkedState?.map((item, idx) =>
      idx === index ? !item : item
    );

    setCheckedState(updatedCheckedState);

    if (updatedCheckedState[index]) {
      setColSearch(filter.filter.cs);
      setFilterCondition(filter.filter.fc);
    } else {
      setColSearch(colSearch?.map(() => []));
      setFilterCondition(
        columnsheader.map((col) => ({
          colName: col.key,
          key: "none",
          value1: "",
          value2: "",
        }))
      );
    }
    setApplyFlag(!applyFlag);
  };

  useEffect(() => {
    setFilterList(apiFilters);
  }, [apiFilters]);

  useEffect(() => {
    setCheckedState(new Array(filterList?.length).fill(false));
  }, [filterList]);

  useEffect(() => {
    let selectedRowData = [];
    let sortedIndex = selectedRowsIndex.sort((a, b) => a - b);
    if (data.length === selectedRowsIndex.length) {
      selectedRowData = data;
    } else if (sortedIndex[sortedIndex.length - 1] > sortedData.length - 1) {
      selectedRowData = selectedRowsIndex?.map((index) => unSortedData[index]);
    } else {
      selectedRowData = selectedRowsIndex?.map((index) => sortedData[index]);
    }

    if (JSON.stringify(selectedRowData) !== JSON.stringify(selectedRowsData)) {
      setSelectedRowsData(selectedRowData);
    }
  }, [selectedRowsIndex]);

  const handleCloseModal = () => {
    setModalOpen(true);
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData("dragged", index);
    e.dataTransfer.effectAllowed = "move";
    // const container = containerRef.current;
    // const items = [...container.childNodes];
    // const dragItem = items[index];
    // const rect = dragItem.getBoundingClientRect();
    // dragItem.style.position = "fixed";
    // dragItem.style.top = `${rect.top}px`;
    // dragItem.style.left = `${rect.left}px`;
    // dragItem.style.width = `${rect.width}px`;
    // dragItem.style.height = `${rect.height}px`;
    // dragItem.style.zIndex = 5000;
    // dragItem.style.cursor = "grabbing";

    // const div = document.createElement("div");
    // div.id = "tempDiv";

    // div.style.pointerEvents = "none";
    // container.appendChild(div);
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

    // await axios
    //   .put(`${baseUrl}` + "edit_dynamic_table_data", {
    //     user_id: loginUserId,
    //     table_name: tableName,
    //     column_order_Obj: arrayOfColumnsName,
    //   })
    //   .then(() => {
    //
    //   })
    //   .catch((error) => {
    //     console.error("Error editing dynamic table data:", error);
    //   });

    setColumns(newColumns);
  };

  async function handleSave(setIsOpen) {
    const arrayOfColumnsName = columnsheader.map((column, index) => ({
      name: column.name,
      visibility: visibleColumns[index],
    }));
    try {
      await axios.put(`${baseUrl}` + "edit_dynamic_table_data", {
        user_id: loginUserId,
        table_name: tableName,
        column_order_Obj: arrayOfColumnsName,
      });
      setDragFlag(false);
      fetchCreatedTable();
    } catch (error) {
      console.error("Error editing dynamic table data:", error);
    } finally {
      setIsOpen((prev) => !prev);
    }
  }

  const cloudInvader = async (tag, index) => {
    let Payload;
    if (tag !== "delete") {
      Payload = [...(apiFilters || [])];

      if (filterName === "") {
        setErrorval(true);
        return;
      }

      Payload.push({
        filterName: filterName,
        filter: {
          cs: colSearch,
          fc: filterCondition,
        },
      });
    } else {
      Payload = [...filterList];
      Payload.splice(index, 1);
    }
    try {
      await axios.put(`${baseUrl}` + "edit_dynamic_table_data", {
        user_id: loginUserId,
        table_name: tableName,
        filter_array: Payload,
      });
      setModalOpen(false);
      setFilterList(Payload);
      setApiFilters(Payload);
      setFilterName("");
      fetchCreatedTable();
    } catch (error) {
      console.error(error);
    }
  };

  // const handleExport = () => {
  //   const ax = !rowSelectable ? data : selectedRowsData;

  //   const elxdata = ax?.map((item) => {
  //     const cols = columnsheader.filter((column) => column?.compare === true);
  //     const additionalProps = cols.reduce((acc, column) => {
  //       acc[column?.key] = column.renderRowCell(item);

  //       return acc;
  //     }, {});

  //     return {
  //       ...item,
  //       ...additionalProps,
  //     };
  //   });

  //   if (elxdata?.length === 0) return alert("No data to export");
  //   const formattedData = elxdata?.map((row, index) => {
  //     let formattedRow = {
  //       "Serial No": index + 1,
  //     };
  //     let obj = {};
  //     columnsheader.forEach((header, index) => {
  //       if (visibleColumns[index]) {
  //         obj[header.name] = row[header.key];
  //       }
  //     });

  //     return {
  //       ...formattedRow,
  //       ...obj,
  //     };
  //   });

  //   const fileName = "data.xlsx";
  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  //   const range = XLSX.utils.decode_range(worksheet["!ref"]);
  //   const headerRow = range.s.r;
  //   for (let C = range.s.c; C <= range.e.c; ++C) {
  //     const address = XLSX.utils.encode_cell({ c: C, r: headerRow });

  //     // if (!worksheet[address]) continue;
  //     worksheet[address].s = {
  //       font: { bold: true, color: { rgb: "#fff" } },
  //       alignment: { horizontal: "center", vertical: "center" },
  //       fill: { fgColor: { rgb: "#000" } },
  //       border: {
  //         top: { style: "thin" },
  //         bottom: { style: "thin" },
  //         left: { style: "thin" },
  //         right: { style: "thin" },
  //       },
  //     };
  //   }

  //   XLSX.writeFile(workbook, fileName);
  // };
 
  function calculateTotalAmount(func, rowData) {
    let amounts;
    if (typeof func !== "function") {
      amounts = rowData?.map((data) => data?.[func]);
    } else {
      amounts = rowData?.map((data) => func(data));
    }

    let total = 0;

    amounts?.forEach((amount) => {
      if (typeof amount === "number") {
        // If it's already a number, add it directly
        total += amount;
      } else if (typeof amount === "string") {
        // Remove the currency symbol and convert the string to a number
        let number = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(number)) {
          total += number;
        }
      }
    });

    return total.toFixed(2);
  }

  const handleExport = async () => {
    const elxdata = !rowSelectable ? data : selectedRowsData;
    if (elxdata?.length === 0) return alert("No data to export");

    const formattedData = elxdata?.map((row, index) => {
      let formattedRow = {
        "Serial No": index + 1,
      };
      let obj = {};
      columnsheader.forEach((header, ind) => {
        if (visibleColumns[ind]) {
          obj[header.name] = row[header.key];
        }
      });

      return {
        ...formattedRow,
        ...obj,
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");
    const logoUrl = "https://i.ibb.co/jZ3pgnS/logo.webp";
    const response = await fetch(logoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const imageId = workbook.addImage({
      buffer: uint8Array,
      extension: "png",
    });

    // worksheet.addBackgroundImage(imageId);
    // Add headers
    const headers = [
      "Serial No",
      ...columnsheader
        .filter((_, index) => visibleColumns[index])
        .map((header) => header.name),
    ];
    // worksheet.mergeCells(1, 1, 1, headers.length);
    // const titleCell = worksheet.getCell("A1");
    // titleCell.value = "Overview";
    // titleCell.font = { bold: true, size: 24, color: { argb: "101010" } };
    // titleCell.alignment = { horizontal: "center", vertical: "middle" };
    // titleCell.fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "FAFAFA" },
    // };
    // worksheet.getRow(1).height = 80;
    // const imageWidth = 70;
    // const imageHeight = 70;
    // const cellWidth = worksheet.getColumn(1).width * 7.5; // Approximate width in pixels
    // const cellHeight = worksheet.getRow(1).height * 1.33; // Approximate height in pixels
    // const imageLeftOffset = (cellWidth - imageWidth) / 2;
    // const imageTopOffset = (cellHeight - imageHeight) / 2 - 30; // 30px spacing

    // worksheet.addImage(imageId, {
    //   tl: { col: headers.length / 2 - 1, row: 0.2 },
    //   ext: { width: imageWidth, height: imageHeight },
    // });

    worksheet.addRow(headers);

    // Add data rows
    formattedData.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });
    if (showTotal) {
      let calcTotal = [
        "Total",
        ...columnsheader
          .filter((_, index) => visibleColumns[index])
          .map((column, index) => {
            if (column?.getTotal) {
              return calculateTotalAmount(
                column?.renderRowCell || column.key,
                elxdata
              );
            } else {
              return "";
            }
          }),
      ];
      worksheet.addRow(calcTotal);
    }

    // const titleRow=worksheet.getRow(1);
    // titleRow.eachCell((cell) => {
    //   cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    //   cell.fill = {
    //     type: "pattern",
    //     pattern: "solid",
    //     fgColor: { argb: "FF000000" },
    //   };
    //   cell.alignment = { horizontal: "center", vertical: "center" };
    //   cell.border = {
    //     top: { style: "thin" },
    //     bottom: { style: "thin" },
    //     left: { style: "thin" },
    //     right: { style: "thin" },
    //   };
    // });
    // Merge cells for the title

    // Style header row
    for (let index = 0; index <= elxdata.length; index++) {
      const element = worksheet.getRow(index + 1);
      element.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "100F0F" } };
        cell.alignment = { horizontal: "center", vertical: "center" };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "100F0F" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9CABD" },
      };
      cell.alignment = { horizontal: "center", vertical: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
    if (showTotal) {
      const totalRow = worksheet.getRow(worksheet.rowCount);
      totalRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "100F0F" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "D9CABD" },
        };
        cell.alignment = { horizontal: "center", vertical: "center" };
        cell.border = {
          top: { style: "none" },
          bottom: { style: "none" },
          left: { style: "none" },
          right: { style: "none" },
        };
      });
    }
    //style border for the table view

    // const firstrow = worksheet.getRow(1);
    // firstrow.eachCell((cell) => {
    //   cell.border = {
    //     top: { style: "thin" },
    //   };
    // });
    // firstrow.getCell(1).border = {
    //   top: { style: "thin" },
    //   bottom: { style: "none" },
    //   left: { style: "thin" },
    //   right: { style: "none" },
    // };
    // firstrow.getCell(headers.length).border = {
    //   top: { style: "thin" },
    //   bottom: { style: "none" },
    //   left: { style: "none" },
    //   right: { style: "thin" },
    // };

    const lastRow = worksheet.getRow(worksheet.rowCount);
    lastRow.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "none" },
        right: { style: "none" },
      };
    });
    lastRow.getCell(1).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "none" },
    };
    lastRow.getCell(headers.length).border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "none" },
      right: { style: "thin" },
    };

    // Adjust column widths
    worksheet.columns.forEach((column) => {
      column.width = column.values.reduce(
        (maxWidth, value) => Math.max(maxWidth, value?.toString().length || 0),
        10
      );
    });

    const fileName = "data.xlsx";
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return (
    <div className="table-toolkit">
      <Modal
        isOpen={ModalOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            width: "max-content",
            height: "max-content",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="flex-col table-pagination-container">
          <h5>Do you want to save filter ?</h5>
          <div className="flex-col mt-3 mb-3">
            <div className="tool-input">
              <input
                type="text"
                placeholder="Name*"
                value={filterName}
                onChange={(e) => {
                  setErrorval(e.target.false);
                  setFilterName(e.target.value);
                }}
              />
            </div>
            {errorval && (
              <p className="ml-1 form-error">Please Enter Filter Name</p>
            )}
          </div>
          <div className="flex-row sb">
            <button
              className="btn cmnbtn btn_sm btn-danger"
              onClick={() => {
                setModalOpen(false);
                setUnSortedData(originalData);
                setSelectedId(columnsheader.map(() => []));
                setColSearch(columnsheader.map(() => []));
                setCheckedState(new Array(filterList?.length).fill(false));
                setSelectedId(columnsheader?.map(() => []));
                setColSearch(columnsheader?.map(() => []));
                setApplyFlag(false);
                setFilterCondition(
                  columnsheader?.map((col) => ({
                    colName: col.key,
                    key: "none",
                    value1: "",
                    value2: "",
                  }))
                );
              }}
            >
              No
            </button>
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={() => {
                cloudInvader("");
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
      <div className="button-wrapper">
        <Dropdown
          tableref={tableref}
          btnHtml={<button className="dropdown-btn">Column</button>}
        >
          <DropdownElement
            handleSave={handleSave}
            dragFlag={dragFlag}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDragOver={onDragOver}
            toggleColumnVisibility={toggleColumnVisibility}
            columnsheader={columnsheader}
            containerRef={containerRef}
            setDragFlag={setDragFlag}
          />
        </Dropdown>
        {showExport&&exportData() && (
          <button className="tool-btn" onClick={() => handleExport()}>
            Export
          </button>
        )}
        <Dropdown
          tableref={tableref}
          btnHtml={<button className="dropdown-btn">Saved Filter</button>}
        >
          {filterList?.length === 0 && (
            <p>
              <span>:(</span> No Filter To Show
            </p>
          )}
          <ul>
            {filterList?.map((filter, index) => (
              <li className="flex-row sb w-100" key={index}>
                <div className="form-check dt-toggle ml20" key={index}>
                  <input
                    className="form-check-input"
                    id={`flexSwitchCheckDefault${index}`}
                    type="checkbox"
                    checked={checkedState[index]}
                    onChange={() => handleCheckboxChange(index, filter)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={"flexSwitchCheckDefault" + index}
                  >
                    {filter.filterName}
                  </label>
                </div>
                <button
                  className="btn"
                  onClick={() => {
                    cloudInvader("delete", index);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        </Dropdown>

        {unSortedData?.length !== originalData?.length && (
          <>
            <button
              className="tool-btn"
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Clear/Save Filter
            </button>
          </>
        )}
      </div>

      <div className="tool-input">
        <svg width="15" height="15" viewBox="0 0 24 24" id="search">
          <path
            d="M19.7555474,18.6065254 L16.3181544,15.2458256 L16.3181544,15.2458256 L16.2375905,15.1233001 C16.0877892,14.9741632 15.8829641,14.8901502 15.6691675,14.8901502 C15.4553709,14.8901502 15.2505458,14.9741632 15.1007444,15.1233001 L15.1007444,15.1233001 C12.1794834,17.8033337 7.6781476,17.94901 4.58200492,15.4637171 C1.48586224,12.9784243 0.75566836,8.63336673 2.87568494,5.31016931 C4.99570152,1.9869719 9.30807195,0.716847023 12.9528494,2.34213643 C16.5976268,3.96742583 18.4438102,7.98379036 17.2670181,11.7275931 C17.182269,11.9980548 17.25154,12.2921761 17.4487374,12.4991642 C17.6459348,12.7061524 17.9410995,12.794561 18.223046,12.7310875 C18.5049924,12.667614 18.7308862,12.4619014 18.8156353,12.1914397 L18.8156353,12.1914397 C20.2223941,7.74864367 18.0977423,2.96755391 13.8161172,0.941057725 C9.53449216,-1.08543846 4.38083811,0.250823958 1.68905427,4.08541671 C-1.00272957,7.92000947 -0.424820906,13.1021457 3.0489311,16.2795011 C6.5226831,19.4568565 11.8497823,19.6758854 15.5841278,16.7948982 L18.6276529,19.7705177 C18.9419864,20.0764941 19.4501654,20.0764941 19.764499,19.7705177 C20.0785003,19.4602048 20.0785003,18.9605974 19.764499,18.6502845 L19.764499,18.6502845 L19.7555474,18.6065254 Z"
            transform="translate(2 2)"
          ></path>
        </svg>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

function DropdownElement({
  setIsOpen,
  handleSave,
  dragFlag,
  visibleColumns,
  setVisibleColumns,
  onDragStart,
  onDrop,
  onDragOver,
  toggleColumnVisibility,
  columnsheader,
  containerRef,
  setDragFlag,
}) {
  return (
    <>
      <div className="w-100 sb">
        <div></div>
        <div className="flex-row gap-2">
          {dragFlag && (
            <button
              className="btn cmnbtn btn_sm btn-success"
              onClick={() => handleSave(setIsOpen)}
            >
              save
            </button>
          )}
          <button
            className={`btn cmnbtn btn_sm ${
              dragFlag ? "btn-danger" : "btn-primary"
            }`}
            onClick={() => setDragFlag(!dragFlag)}
          >
            {dragFlag ? "Cancel" : "Edit"}
          </button>
        </div>
      </div>
      <div className={`form-check dt-toggle ${dragFlag ? "editui" : ""}`}>
        {dragFlag && (
          <>
            <span>
              <p>:</p>
              <p>:</p>
              <p>:</p>
              <p>:</p>
            </span>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              checked={visibleColumns?.some((column) => column)}
              onChange={(e) => {
                setVisibleColumns(visibleColumns?.map(() => e.target.checked));
              }}
            />
          </>
        )}
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
          Show/Hide All
        </label>
      </div>
      <div className="container_drag" ref={containerRef}>
        {columnsheader?.map((column, index) => (
          <div
            className={`form-check dt-toggle ${dragFlag ? "editui" : ""}`}
            key={index}
            draggable={dragFlag}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
          >
            {dragFlag && (
              <>
                <span>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                </span>
                <input
                  className="form-check-input"
                  id={`flexSwitchCheckDefault${index}`}
                  type="checkbox"
                  checked={visibleColumns?.[index]}
                  onChange={() => toggleColumnVisibility(index)}
                />
              </>
            )}
            <label
              className="form-check-label"
              htmlFor={"flexSwitchCheckDefault" + index}
            >
              {column.name}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

export default TableToolkit;
