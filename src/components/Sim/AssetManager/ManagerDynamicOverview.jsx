import DataTable from "react-data-table-component";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";
import { baseUrl } from "../../../utils/config";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import PropTypes from "prop-types";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useState } from "react";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";

const ManagerDynamicOverview = ({
  filterData,
  hardRender,
  tabOne,
  tabTwo,
  tabThree,
}) => {
  const { toastAlert } = useGlobalContext();
  const { userID } = useAPIGlobalContext();

  // Return Recover Asset
  const [id, setID] = useState(0);
  const [reoverStatus, setRecoverStatus] = useState("");
  const [returnRecoverRemark, setReturnRecoverRemark] = useState("");
  const [returnRecoverImg1, setReturnRecoverImg1] = useState(null);
  const [returnRecoverImg2, setReturnRecoverImg2] = useState(null);

  const handleStatusUpdate = async (row, status) => {
    try {
      await axios.put(baseUrl + "assetrequest", {
        _id: row._id,
        asset_request_status: status,
      });

      hardRender();
      toastAlert("Request Success");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRepairStatusUpdate = async (row, status) => {
    try {
      await axios.put(`${baseUrl}update_repair_request`, {
        repair_id: row.repair_id,
        status: status,
      });

      hardRender();
      toastAlert("Request Success");
    } catch (error) {
      console.log(error);
    }
  };

  const handleReturnAssetRecover = (row, status) => {
    setID(row._id);
    setRecoverStatus(status);
  };
  const handleAssetReturnRecoverSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("_id", id);
      formData.append("asset_return_recover_by_remark", returnRecoverRemark);
      formData.append("recover_asset_image_1", returnRecoverImg1);
      formData.append("recover_asset_image_2", returnRecoverImg2);
      formData.append("asset_return_recover_by", userID);
      formData.append("asset_return_status", reoverStatus);

      await axios.put(baseUrl + "assetreturn", formData);

      hardRender();
      toastAlert("Requested Success");
      setReturnRecoverRemark("");
      setReturnRecoverImg1("");
      setReturnRecoverImg2("");
    } catch (error) {
      console.log(error);
    }
  };

  const columnsTab1 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      sortable: true,
      width: "80px",
    },

    {
      name: "Requested By",
      selector: (row) => row.req_by_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_repair_request_status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.asset_repair_request_status === "Accept" ? (
            <span className="badge badge-success">Accept</span>
          ) : row.asset_repair_request_status === "Rejected" ? (
            <span className="badge badge-danger">Rejected</span>
          ) : row.asset_repair_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning">Approve By Manager</span>
          ) : row.asset_repair_request_status === "Recover" ? (
            <span className="badge badge-warning">Recover</span>
          ) : row.asset_repair_request_status === "Resolved" ? (
            <span className="badge badge-success">Resolved</span>
          ) : null}
        </>
      ),
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },

    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      sortable: true,
      width: "150px",
    },

    {
      name: "Detail",
      selector: (row) => row.problem_detailing,
      sortable: true,
    },
    {
      name: "Request Date",
      selector: (row) => row.repair_request_date_time?.split("T")?.[0],
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <>
          {row.asset_repair_request_status !== "Resolved" &&
            row.asset_repair_request_status !== "Accept" &&
            row.asset_repair_request_status !== "Recover" &&
            row.asset_repair_request_status !== "ApprovedByManager" && (
              <button
                type="button"
                data-toggle="modal"
                data-target="#resolvedModal"
                size="small"
                color="primary"
                onClick={() =>
                  handleRepairStatusUpdate(row, "ApprovedByManager")
                }
                className="btn btn-success btn-sm ml-2"
              >
                Approval
              </button>
            )}
        </>
      ),
      sortable: true,
    },
  ];
  const columnsTab2 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Request By",
      selector: (row) => row.req_by_name,
      sortable: true,
    },
    {
      name: "Request Date",
      selector: (row) => row.req_date?.split("T")?.[0],
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_new_request_status === "Requested" ? (
            <span className="badge badge-danger">Requested</span>
          ) : row.asset_new_request_status === "Approved" ? (
            <span className="badge badge-success">Assigned</span>
          ) : row.asset_new_request_status === "Rejected" ? (
            <span className="badge badge-warning">Rejected</span>
          ) : row.asset_new_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning">Approve By Manager</span>
          ) : row.asset_new_request_status === "RejectedByManager" ? (
            <span className="badge badge-danger">Reject By Manager</span>
          ) : null}
        </>
      ),
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.priority,
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.sub_category_name,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          {row.asset_new_request_status == "Approved" ||
            row.asset_new_request_status == "ApprovedByManager" ||
            row.asset_new_request_status == "RejectedByManager" ||
            row.asset_new_request_status == "Rejected" || (
              <>
                <button
                  type="button"
                  data-toggle="modal"
                  data-target="#resolvedModal"
                  size="small"
                  color="primary"
                  onClick={() => handleStatusUpdate(row, "ApprovedByManager")}
                  className="btn btn-success btn-sm ml-2"
                >
                  Approval
                </button>
                <button
                  type="button"
                  data-toggle="modal"
                  data-target="#exampleModal1"
                  size="small"
                  color="primary"
                  className="btn btn-danger btn-sm ml-2"
                  onClick={() => handleStatusUpdate(row, "RejectedByManager")}
                >
                  Reject
                </button>
              </>
            )}
        </>
      ),
      sortable: true,
    },
  ];

  const columnsTab3 = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      width: "6%",
      sortable: true,
    },
    {
      name: "Retun By Name",
      selector: (row) => row.asset_return_by_name,
    },
    {
      name: "Asset ID",
      selector: (row) => row.asset_id,
    },

    {
      name: "Asset Name",
      selector: (row) => row.assetName,
    },
    {
      name: "Return Date",
      selector: (row) => DateISOtoNormal(row.return_asset_data_time),
    },
    {
      name: "Remark",
      selector: (row) => row.asset_return_remark,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_return_status === "RecovedByHR" ? (
            <span className="badge badge-success">Recoved By HR</span>
          ) : row.asset_return_status === "RecoverdByManager" ? (
            <span className="badge badge-warning">Recovered By Manager</span>
          ) : row.asset_return_status === "Pending" ? (
            <span className="badge badge-danger">Pending</span>
          ) : (
            "N/A"
          )}
        </>
      ),
      sortable: true,
    },
    // console.log(filterData.asset_return_status == "RecovedByHR", "fsfafasfsd"),
    // filterData[0]?.asset_return_status !== "RecovedByHR" && {
    //   name: "Return",
    //   cell: (row) => (
    //     <>
    //       {row.asset_return_status !== "RecoverdByManager" && (
    //         <button
    //           type="button"
    //           data-toggle="modal"
    //           data-target="#return-asset-modal"
    //           size="small"
    //           className="btn btn-outline-primary btn-sm"
    //           onClick={() => handleReturnAssetRecover(row, "RecoverdByManager")}
    //         >
    //           Recover
    //         </button>
    //       )}
    //     </>
    //   ),
    // },
  ];

  //   const activeColumns = tabOne ? columnsTab1 : columnsTab2;
  let activeColumns = [];

  if (tabOne) {
    activeColumns = columnsTab1;
  } else if (tabTwo) {
    activeColumns = columnsTab2;
  } else if (tabThree) {
    activeColumns = columnsTab3;
  }

  return (
    <>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Assets"
              columns={activeColumns}
              data={filterData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              exportToCSV
              highlightOnHover
              subHeader
            />
          </div>
        </div>
      </div>

      {/* Return Asset Recover modal */}
      <div className="right-modal">
        <div
          className="modal fade right"
          id="return-asset-modal"
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true" style={{ marginRight: "250px" }}>
                    ×
                  </span>
                </button>
                <h4 className="modal-title">Recover Asset</h4>
              </div>
              <div className="modal-body">
                <FieldContainer
                  label="Recover Remark"
                  Tag="textarea"
                  value={returnRecoverRemark}
                  onChange={(e) => setReturnRecoverRemark(e.target.value)}
                  required
                />
                <FieldContainer
                  label="Image 1"
                  type="file"
                  fieldGrid={12}
                  onChange={(e) => setReturnRecoverImg1(e.target.files[0])}
                  required
                />
                <FieldContainer
                  label="Image 2"
                  type="file"
                  fieldGrid={12}
                  onChange={(e) => setReturnRecoverImg2(e.target.files[0])}
                  required
                />
                <button
                  type="button"
                  data-dismiss="modal"
                  className=" btn btn-primary ml-2"
                  onClick={handleAssetReturnRecoverSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagerDynamicOverview;

ManagerDynamicOverview.propTypes = {
  filterData: PropTypes.array.isRequired, // 'filterData' prop should be an array and is required
  hardRender: PropTypes.func.isRequired, // 'hardRender' prop should be a function and is required
  tabOne: PropTypes.bool.isRequired, // 'tabOne' prop should be a boolean and is required
  tabTwo: PropTypes.bool.isRequired, // 'tabTwo' prop should be a boolean and is required
  tabThree: PropTypes.bool.isRequired, // 'tabThree' prop should be a boolean and is required
};
