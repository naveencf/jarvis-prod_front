import CustomTable from "../../../../CustomTable/CustomTable";
import CustomTableWrapper from "../../../../ReusableComponents/CustomTableWrapper";
import CustomTableV2 from "../../../../CustomTable_v2/CustomTableV2";
import React, { memo, useCallback } from "react";

//c
const View = ({
  data,
  columns,
  isLoading,
  title,
  rowSelectable = false,
  pagination = false,
  tableName,
  selectedData,
  showTotal = false,
  addHtml,
  version = 1,
  exportData,
  getFilteredData,
  cloudPagination = false,
  pageNavigator = {
    prev: {},
    next: {},
    totalRows: 0,
    currentPage: 1,
  },
  tableSelectedRows,
  setTableSelectedRows
}) => {
  const Version = useCallback(!version ? CustomTableV2 : CustomTable, [
    version,
  ]);

  return (
    <CustomTableWrapper title={title} addHtml={addHtml}>
      <Version
        columns={columns}
        data={data}
        fixedHeader
        dataLoading={isLoading}
        Pagination={pagination}
        rowSelectable={rowSelectable}
        tableName={tableName}
        selectedData={selectedData}
        showTotal={showTotal}
        exportData={exportData}
        getFilteredData={getFilteredData}
        cloudPagination={cloudPagination}
        pageNavigator={pageNavigator}
        tableSelectedRows={tableSelectedRows}
        setTableSelectedRows={setTableSelectedRows}
      />
    </CustomTableWrapper>
  );
};

export default memo(View);
