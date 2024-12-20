import CustomTable from "../../../../CustomTable/CustomTable";
import CustomTableWrapper from "../../../../ReusableComponents/CustomTableWrapper";
import CustomTableV2 from "../../../../CustomTable_v2/CustomTableV2";

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
  version = 0,
}) => {
  const Version = !version ? CustomTableV2 : CustomTable;

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
      />
    </CustomTableWrapper>
  );
};

export default View;
