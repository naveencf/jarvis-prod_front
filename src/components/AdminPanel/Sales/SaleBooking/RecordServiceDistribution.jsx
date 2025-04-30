import React from "react";
import { useGetDistributionQuery } from "../../../Store/API/Sales/SaleBookingApi.js";
import FormContainer from "../../FormContainer.jsx";
import View from "../Account/View/View.jsx";
import FieldContainer from "../../FieldContainer.jsx";
import { useAPIGlobalContext } from "../../APIContext/APIContext.jsx";
import { useGetAllSaleServiceQuery } from "../../../Store/API/Sales/SalesServiceApi.js";
import CustomSelect from "../../../ReusableComponents/CustomSelect.jsx";
import { formatNumber } from "../../../../utils/formatNumber.js";
import { formatIndianNumber } from "../../../../utils/formatIndianNumber.js";

const RecordServiceDistribution = () => {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [sales_service_master_id, setSalesServiceMasterId] = React.useState("");
  const [sale_executive_id, setSaleExecutiveId] = React.useState("");
  const { userContextData, contextData } = useAPIGlobalContext();
  const {
    data: distributionData,
    isLoading: distributionLoading,
    isError: distributionError,
  } = useGetDistributionQuery({
    sales_service_master_id,
    sale_executive_id,
    start_date: startDate,
    end_date: endDate,
  });
  const { data: serviceTypes } = useGetAllSaleServiceQuery();
  console.log("Distribution Data:", distributionData);
  const columns = [
    {
      name: "S No.",
      key: "sr_no",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      name: "Service Name",
      key: "sales_service_master_name",
      renderRowCell: (row) => row?.sales_service_master_name || "-",
      width: 150,
    },
    {
      name: "Service ID",
      key: "sales_service_master_id",
      renderRowCell: (row) => row?.sales_service_master_id || "-",
      width: 250,
    },
    {
      name: "Total Record Service Amount",
      key: "total_record_service_amount",
      renderRowCell: (row) =>
        formatIndianNumber(row?.total_record_service_amount) || 0,
      width: 200,
    },
    {
      name: "Total Record Service Count",
      key: "total_record_service_count",
      renderRowCell: (row) => row?.total_record_service_count || 0,
      width: 180,
    },
    {
      name: "Total Sale Booking Count",
      key: "total_sale_booking_count",
      renderRowCell: (row) => row?.total_sale_booking_count || 0,
      width: 180,
    },
  ];

  return (
    <>
      <FormContainer mainTitle={"Record Service Distribution"} link={true} />
      <div className="card">
        <div className="card-body">
          <div className="row">
            <CustomSelect
              label="Service"
              fieldGrid={3}
              dataArray={serviceTypes}
              optionId="_id"
              optionLabel="service_name"
              selectedId={sales_service_master_id}
              setSelectedId={(value) => setSalesServiceMasterId(value)}
              required
            />
            <CustomSelect
              label="Sales Executive Name"
              fieldGrid={3}
              dataArray={userContextData?.filter((item) => item.dept_id == 36)}
              optionId="user_id"
              optionLabel="user_name"
              selectedId={sale_executive_id}
              setSelectedId={setSaleExecutiveId}
            />
            <FieldContainer
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
              fieldGrid={3}
            />
            <FieldContainer
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
              fieldGrid={3}
            />
          </div>
        </div>
      </div>
      <View
        columns={columns}
        data={distributionData}
        loading={distributionLoading}
        pagination={true}
        title={"Distribution Overview"}
        tableName={"Distribution"}
      />
    </>
  );
};

export default RecordServiceDistribution;
