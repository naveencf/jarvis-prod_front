import React from "react";
import FormContainer from "../../FormContainer";
import View from "../Account/View/View";
import RecordServices from "../Account/CreateRecordServices";
import { useGetAllRecordServicesQuery } from "../../../Store/API/Sales/RecordServicesApi";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useGlobalContext } from "../../../../Context/Context";
import { useGetAllBrandQuery } from "../../../Store/API/Sales/BrandApi";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const ExecutionData = ({ selectedRowData }) => {
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  const { userContextData, contextData } = useAPIGlobalContext();
  if (contextData?.find((data) => data?._id == 64)?.view_value !== 1) {
    loginUserId = token.id;
  }
  const { toastAlert, toastError } = useGlobalContext();
  const {
    data: RecordServiceData,
    isLoading: RecordsLoading,
    isError: RecordsError,
  } = useGetAllRecordServicesQuery(loginUserId);
  const {
    data: BrandData,
    isLoading: BrandLoading,
    isError: BrandError,
  } = useGetAllBrandQuery();

  const column = [
    {
      key: "serial",
      name: "S.No",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 50,
    },
    {
      key: "records",
      name: "Records",
      renderRowCell: (row, index) => (
        <div>{`RecordService ` + (index + 1)}</div>
      ),
      width: 100,
    },
    {
      key: "amount",
      name: "Amount",
      renderRowCell: (row) => {
        return RecordServiceData?.find(
          (data) => data?._id == row?.record_service_id
        )?.amount;
      },
      width: 100,
    },
    {
      key: "execution_token",
      name: "Token",
      width: 100,
    },
    {
      key: "Action",
      name: "Actions",
      renderRowCell: (row) => (
        <button
          className="icon-1"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`
                Campaign Name: ${selectedRowData?.campaign_name}
                Account Name: ${selectedRowData?.account_name}
                Brand Name: ${
                  BrandData?.find(
                    (data) => data?._id === selectedRowData.brand_id
                  ).brand_name
                }
                Token No.: ${row?.execution_token}`);
              toastAlert("Token Copied");
            } catch (err) {
              toastError("Failed to copy text");
            }
          }}
        >
          <i className="bi bi-clipboard"></i>
        </button>
      ),
      width: 100,
    },
  ];

  return (
    <div>
      <FormContainer mainTitle={"Records"} link={true} />
      <View
        data={selectedRowData?.executionData}
        columns={column}
        isLoading={RecordsLoading || BrandLoading}
        tableName={"ExecutionDataTable"}
        title={"Overview"}
      />
    </div>
  );
};

export default ExecutionData;
