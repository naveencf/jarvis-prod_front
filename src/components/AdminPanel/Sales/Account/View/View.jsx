import React from "react";
import CustomTable from "../../../../CustomTable/CustomTable";
import CustomTableWrapper from "../../../../ReusableComponents/CustomTableWrapper";

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
}) => {
  return (
    <CustomTableWrapper title={title} addHtml={addHtml}>
      <CustomTable
        columns={columns}
        data={data}
        fixedHeader
        dataLoading={isLoading}
        Pagination={pagination}
        rowSelectable={rowSelectable}
        tableName={tableName}
        selectedData={selectedData}
        showTotal={showTotal}
      />
    </CustomTableWrapper>
  );
};

export default View;
