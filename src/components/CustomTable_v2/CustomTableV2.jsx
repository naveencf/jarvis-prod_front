import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Table.css";
import PaginationComp from "./TableComponent/PaginationComp";
import TableToolkit from "./TableComponent/TableToolkit";
import RenderedTable from "./TableComponent/RenderedTable";
import { baseUrl } from "../../utils/config";
import jwtDecode from "jwt-decode";
import axios from "axios";
import TotalRow from "./TableComponent/TotalRow";
// note: sync the table pagination and  sorted rows

const CustomTableV2 = ({
  columns,
  data,
  fixedHeader = true,
  Pagination = false,
  dataLoading = false,
  rowSelectable,
  tableName,
  showTotal = false,
  selectedData = (selecteddata) => {
    return selecteddata;
  },
  getFilteredData = (filterData) => {
    return filterData;
  },
  showExport
}) => {
  const tableref = useRef();
  const headref = useRef();
  const [apiColumns, setApiColumns] = useState([]);
  const [columnsheader, setColumns] = useState(columns);
  const [resizing, setResizing] = useState(null);
  const [widths, setWidths] = useState(columns);
  const [itemsPerPage, setItemsPerPage] = useState(
    Pagination && Pagination.length > 0 ? Pagination[0] : 10
  );
  const [originalData, setOriginalData] = useState(data || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [ascFlag, setAscFlag] = useState(columns?.map(() => true));
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((column) =>
      column.showCol === undefined ? true : column.showCol
    )
  );
  const [selectedRowsIndex, setSelectedRowsIndex] = useState([]);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [editablesRows, setEditablesRows] = useState(
    columns?.map((column) =>
      column.editable === undefined ? false : column.editable
    )
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [unSortedData, setUnSortedData] = useState([]);
  const [invadeFlag, setInvadeFlag] = useState(false);
  const [colSearch, setColSearch] = useState(columns.map(() => []));
  const [apiFilters, setApiFilters] = useState([]);
  const [filterCondition, setFilterCondition] = useState(
    columns.map((col) => ({
      colName: col.key,
      key: "none",
      value1: "",
      value2: "",
    }))
  );
  // Initialize selectedId for each column
  const [selectedId, setSelectedId] = useState(columnsheader.map(() => []));
  const [applyFlag, setApplyFlag] = useState(false);
  const [oldSortKey, setOldSortKey] = useState("");
  const pagination = useRef(
    Pagination?.length > 0 ? Pagination : [100, 50, 10]
  );

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  useEffect(() => {
    //// console.log("pagination");
    if (
      pagination?.current?.findIndex((item) => item === data?.length) === -1 &&
      data?.length > 0
    )
      pagination.current = [...pagination?.current, data?.length];
  }, [data, columns, tableName]);

  useEffect(() => {
    // // console.log("selected data");
    selectedData(selectedRowsData);
  }, [selectedRowsData]);

  const filteredData = searchQuery
    ? unSortedData?.filter((item) =>
      columnsheader
        .map((column) => column.key)
        .some((key) =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
    )
    : unSortedData;

  const filterFunctions = {
    none: () => true,

    isExactly: (itemValue, value1) => {
      if (typeof itemValue === "string") {
        return itemValue?.toLowerCase().trim() === value1?.toLowerCase().trim();
      } else {
        return itemValue?.toString().trim() === value1?.trim();
      }
    },

    isEmpty: (itemValue) => {
      return itemValue?.toString() == "";
    },

    isNotEmpty: (itemValue) => itemValue?.toString() != "",

    contains: (itemValue, value1) => {
      if (typeof itemValue === "string") {
        return itemValue?.toLowerCase().includes(value1?.toLowerCase());
      } else {
        return itemValue
          ?.toString()
          .toLowerCase()
          .includes(value1?.toLowerCase());
      }
    },

    doesNotContain: (itemValue, value1) => {
      if (typeof itemValue === "string") {
        return !itemValue?.toLowerCase().includes(value1?.toLowerCase());
      } else {
        return !itemValue
          ?.toString()
          .toLowerCase()
          .includes(value1?.toLowerCase());
      }
    },

    startsWith: (itemValue, value1) => {
      if (typeof itemValue === "string") {
        return itemValue?.startsWith(value1);
      } else {
        return itemValue?.toString().startsWith(value1);
      }
    },

    endsWith: (itemValue, value1) => {
      if (typeof itemValue === "string") {
        return itemValue?.endsWith(value1);
      } else {
        return itemValue?.toString().endsWith(value1);
      }
    },

    greaterThan: (itemValue, value1) => itemValue > parseInt(value1, 10),

    greaterThanOrEqualTo: (itemValue, value1) =>
      itemValue >= parseInt(value1, 10),

    lessThan: (itemValue, value1) => itemValue < value1,

    lessThanOrEqualTo: (itemValue, value1) => itemValue <= parseInt(value1, 10),

    equalTo: (itemValue, value1) => {
      if (typeof itemValue === "string") {
        return itemValue === value1;
      } else {
        return itemValue == parseInt(value1, 10);
      }
    },

    notEqualTo: (itemValue, value1) => {
      if (typeof itemValue === "string") {
        return itemValue === value1;
      } else {
        return itemValue == parseInt(value1, 10);
      }
    },

    between: (itemValue, value1, value2) =>
      itemValue > parseInt(value1, 10) && itemValue < parseInt(value2, 10),

    notBetween: (itemValue, value1, value2) =>
      itemValue <= parseInt(value1, 10) || itemValue >= parseInt(value2, 10),
  };

  useEffect(() => {
    // // console.log("filtering of data");
    const filterData = () => {
      const fd = originalData.filter((item) => {
        // Check filterCondition
        const conditionCheck = filterCondition.every((condition) => {
          const { key, value1, value2, colName } = condition;
          if (key === "none") return true; // Skip if no filter is applied or field is not specified
          const filterFunc = filterFunctions[key];

          return filterFunc(item[colName], value1, value2);
        });

        // Check colSearch
        const searchCheck = colSearch.every((searchArray, index) => {
          if (searchArray.length === 0) return true; // No search criteria means no filtering needed

          return searchArray.some((criteria) => {
            const field = Object.keys(criteria)[0]; // Get the field name from the criteria object
            const value = criteria[field]; // Get the search value for that field
            return item[field] === value; // Check if the item field matches the search value
          });
        });

        return conditionCheck && searchCheck; // Item must pass both conditions
      });
      return fd;
    };

    setUnSortedData(filterData());
  }, [applyFlag]);

  const toggleColumnVisibility = (index) => {
    setVisibleColumns(
      visibleColumns?.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  useEffect(() => {
    // // console.log("invade flag");

    if (invadeFlag) {
      cloudInvader();
    }
  }, [invadeFlag]);

  useEffect(() => {
    setSortedData(
      pagination
        ? filteredData?.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
        : unSortedData
    );
  }, [itemsPerPage, currentPage, searchQuery, unSortedData]);

  const memoize = (fn) => {
    const cache = new Map();
    return async (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = await fn(...args);
      cache.set(key, result);
      return result;
    };
  };

  const createTable = async () => {
    const arrayOfColumnsName = columnsheader.map((column) => ({
      name: column.name,
      visibility: column.showCol === undefined ? true : column.showCol,
    }));

    let Response;

    try {
      Response = await axios.post(`${baseUrl}add_dynamic_table_data`, {
        table_name: tableName,
        user_id: loginUserId,
        column_order_Obj: arrayOfColumnsName,
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // // console.log("table creation");

    memoize(createTable)();
  }, [tableName]);

  async function cloudInvader() {
    const arrayofvisiblecolumns = columnsheader?.map((column, index) => ({
      name: column.name,
      visibility: visibleColumns[index],
    }));
    try {
      await axios.put(`${baseUrl}edit_dynamic_table_data`, {
        user_id: loginUserId,
        table_name: tableName,
        column_order_Obj: arrayofvisiblecolumns,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setInvadeFlag(false);
      fetchCreatedTable();
    }
  }

  const fetchCreatedTable = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}get_dynamic_table_data?userId=${loginUserId}&tableName=${tableName}`
      );
      const responseData = response.data.data[0]?.column_order_Obj || [];
      const savedFiltersData = response.data.data[0]?.filter_array;
      setApiColumns(responseData);
      setApiFilters(savedFiltersData);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // // console.log("use to fetch columns");
    fetchCreatedTable();
  }, [loginUserId, tableName]);

  useEffect(() => {
    // // console.log("initializing columns to update ui");
    const getIndex = (colName) =>
      apiColumns?.findIndex((item) => item?.name?.trim() === colName?.trim());

    const sortedColumns = [...columns];
    sortedColumns.sort((a, b) => getIndex(a.name) - getIndex(b.name));

    setColumns(sortedColumns);

    setWidths(sortedColumns);
    setVisibleColumns(
      apiColumns?.length === 0
        ? columns?.map(() => true)
        : sortedColumns?.map((column, index) =>
          apiColumns[index]?.visibility === undefined ||
            apiColumns[index]?.visibility === null
            ? true
            : apiColumns[index]?.visibility
        )
    );
    setAscFlag(sortedColumns?.map(() => true));
    setEditablesRows(
      sortedColumns.map((column) =>
        column.editable === undefined ? false : column.editable
      )
    );

    // setTriggerSort(prev => !prev);
  }, [columns, apiColumns]);
  useEffect(() => {
    // // console.log("initializing data to update ui");

    if (data) {
      setUnSortedData(data);
      setUnSortedData((prev) =>
        prev.map((item) => {
          const cols = columnsheader.filter(
            (column) => column.compare === true
          );
          const additionalProps = cols.reduce((acc, column) => {
            acc[column.key] = column.renderRowCell(item);
            return acc;
          }, {});
          return {
            ...item,
            ...additionalProps,
          };
        })
      );
      setOriginalData(data);
      setOriginalData((prev) =>
        prev.map((item) => {
          const cols = columnsheader.filter(
            (column) => column.compare === true
          );
          const additionalProps = cols.reduce((acc, column) => {
            acc[column.key] = column.renderRowCell(item);
            return acc;
          }, {});
          return {
            ...item,
            ...additionalProps,
          };
        })
      );
    }
  }, [data]);

  const renderSort_v2 = useMemo(() => {
    // // console.log("sortKey", sortKey, oldSortKey);

    if (!sortKey) return unSortedData;
    let sorted = [...unSortedData];
    if (sortKey != oldSortKey) {
      let datatType = null;
      for (let i = 0; i < unSortedData.length; i++) {
        if (
          unSortedData[i][sortKey] != undefined &&
          unSortedData[i][sortKey] != null
        ) {
          datatType = typeof unSortedData[i][sortKey];
          break;
        }
      }
      if (datatType === "number") {
        // // console.log("number");

        sorted = [...unSortedData].sort((a, b) => {
          const val1 = a[sortKey] || -Infinity;
          const val2 = b[sortKey] || -Infinity;
          return val1 - val2;
        });
      } else if (datatType === "string") {
        // // console.log("string");
        sorted = [...unSortedData].sort((a, b) => {
          const val1 = a[sortKey] || "";
          const val2 = b[sortKey] || "";

          return val1.localeCompare(val2);
        });
      } else return sorted;
    } else sorted.reverse();

    setSortedData(sorted);
    setUnSortedData(sorted);

    // return sorted;
  }, [sortKey, sortDirection, originalData]);

  useEffect(() => {
    getFilteredData(unSortedData);
  }, [unSortedData]);

  return (
    <div className="table-pagination-container">
      <TableToolkit
        setApiFilters={setApiFilters}
        apiFilters={apiFilters}
        tableName={tableName}
        loginUserId={loginUserId}
        tableref={tableref}
        columnsheader={columnsheader}
        setVisibleColumns={setVisibleColumns}
        visibleColumns={visibleColumns}
        data={unSortedData}
        selectedRowsIndex={selectedRowsIndex}
        setSelectedRowsIndex={setSelectedRowsIndex}
        setSelectedRowsData={setSelectedRowsData}
        selectedRowsData={selectedRowsData}
        toggleColumnVisibility={toggleColumnVisibility}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        rowSelectable={rowSelectable}
        originalData={data}
        unSortedData={unSortedData}
        setUnSortedData={setUnSortedData}
        setColSearch={setColSearch}
        setInvadeFlag={setInvadeFlag}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        filterCondition={filterCondition}
        setFilterCondition={setFilterCondition}
        colSearch={colSearch}
        applyFlag={applyFlag}
        setColumns={setColumns}
        setApplyFlag={setApplyFlag}
        originalData1={originalData}
        sortedData={sortedData}
        fetchCreatedTable={fetchCreatedTable}
        showExport={showExport}
      />
      {showTotal && (
        <TotalRow
          columnsheader={columnsheader}
          unSortedData={unSortedData}
          visibleColumns={visibleColumns}
          rowSelectable={rowSelectable}
          headref={headref}
          tableref={tableref}
          applyFlag={applyFlag}
        />
      )}
      <div className="table-container" ref={tableref}>
        <RenderedTable
          setVisibleColumns={setVisibleColumns}
          sortKey={sortKey}
          oldSortKey={oldSortKey}
          setOldSortKey={setOldSortKey}
          headref={headref}
          setUnSortedData={setUnSortedData}
          applyFlag={applyFlag}
          setApplyFlag={setApplyFlag}
          filterCondition={filterCondition}
          setFilterCondition={setFilterCondition}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          originalData={data}
          setColSearch={setColSearch}
          colSearch={colSearch}
          tableref={tableref}
          dataLoading={dataLoading}
          data={unSortedData}
          setSortKey={setSortKey}
          fixedHeader={fixedHeader}
          rowSelectable={rowSelectable}
          visibleColumns={visibleColumns}
          columnsheader={columnsheader}
          ascFlag={ascFlag}
          selectAll={selectAll}
          setColumns={setColumns}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          selectedRowsIndex={selectedRowsIndex}
          setSelectedRowsIndex={setSelectedRowsIndex}
          setSelectAll={setSelectAll}
          setAscFlag={setAscFlag}
          resizing={resizing}
          setResizing={setResizing}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          widths={widths}
          setWidths={setWidths}
          sortedData={sortedData}
          setSortedData={setSortedData}
          editableRows={editablesRows}
          baseUrl={baseUrl}
          tableName={tableName}
          loginUserId={loginUserId}
          fetchCreatedTable={fetchCreatedTable}
        />
      </div>

      <PaginationComp
        data={unSortedData}
        Pagination={pagination?.current}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        originalData={data}
        columnsheader={columnsheader}
        isPagination={Pagination}
      />
    </div>
  );
};

export default CustomTableV2;
