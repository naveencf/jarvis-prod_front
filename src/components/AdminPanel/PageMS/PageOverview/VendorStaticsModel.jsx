import View from "../../Sales/Account/View/View";

const VendorStaticsModel = ({ vendorData, dataGridcolumns }) => {
  return (
    <>
      <View
        columns={dataGridcolumns}
        data={vendorData}
        isLoading={false}
        // title={"Follower Logs"}
        pagination={[100, 200, 1000]}
        tableName={"F"}
      />
    </>
  );
};

export default VendorStaticsModel;
