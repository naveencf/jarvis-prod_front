import React from "react";
import FormContainer from "../../FormContainer";
import View from "../Account/View/View";
import RecordServices from "../Account/CreateRecordServices";
import { useGetAllRecordServicesQuery } from "../../../Store/API/Sales/RecordServicesApi";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useGlobalContext } from "../../../../Context/Context";

const ExecutionData = ({ selectedRowData }) => {
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  if (loginUserRole !== 1) {
    loginUserId = token.id;
  }
  const { toastAlert, toastError } = useGlobalContext();
  console.log(selectedRowData);
  const {
    data: RecordServiceData,
    isLoading: RecordsLoading,
    isError: RecordsError,
  } = useGetAllRecordServicesQuery(loginUserId);
  console.log(RecordServiceData);
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
              await navigator.clipboard.writeText(row?.execution_token);
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
        isLoading={RecordsLoading}
        tableName={"ExecutionDataTable"}
        title={"Overview"}
      />
    </div>
  );
};

export default ExecutionData;
