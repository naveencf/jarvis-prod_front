import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import "./newAssetCard.css";
import { baseUrl } from "../../../utils/config";

const NewAssetRequestOverview = ({ newAssetData, handleRelodenewData }) => {
  const { userID } = useAPIGlobalContext();
  const { toastAlert, toastError } = useGlobalContext();
  const [assetsName, setAssetName] = useState("");
  const [assetStatus, setAssetStatus] = useState("");
  const [row, setRow] = useState("");
  const [getAssetDataContext, setAssetData] = useState([]);

  const [selectedAsset, setSelectedAsset] = useState([]);

  const [isModalOpenRemark, setIsModalOpenRemark] = useState(false);
  const closeModalRemark = () => {
    setIsModalOpenRemark(false);
  };
  const [rejectRemark, setRejectRemark] = useState("");
  const [idForReject, setIdForReject] = useState("");
  const handleRejectRemarkOpen = (row) => {
    setIdForReject(row._id);
    setIsModalOpenRemark(true);
  };

  const handleStatusUpdate = (row, status) => {
    setAssetStatus(status);
    setRow(row);
  };
  useEffect(() => {
    async function getShowAssetWithStatus() {
      if (row && row.sub_category_id) {
        try {
          const response = await axios.get(
            `${baseUrl}get_asset_by_sub_cat/${row.sub_category_id}`
          );
          setAssetData(response.data.data);
        } catch (error) {
          console.error("Failed to fetch asset data:", error);
        }
      }
    }

    getShowAssetWithStatus();
  }, [row, assetsName]);

  const getAllAssetData = async () => {
    try {
      const res = await axios.get(baseUrl + "get_all_sims");
      setSelectedAsset(res.data.data.filter((d) => d.sim_id == assetsName));
    } catch {}
  };

  useEffect(() => {
    getAllAssetData();
  }, [assetsName]);
  // const text = getAssetDataContext.filter((d) => d.sim_id === assetsName);

  const handleRejectStatus = async () => {
    if (!rejectRemark || rejectRemark == "") {
      toastError("Remark is Required");
      return;
    }
    try {
      await axios.put(baseUrl + "assetrequest", {
        _id: idForReject,
        asset_request_status: "Rejected",
        reject_reason: rejectRemark,
      });

      setIsModalOpenRemark(false);
      handleRelodenewData();
      toastAlert("Request Success");
    } catch (error) {
      console.log(error);
    }
  };
  const handleAssignedSubmit = async () => {
    try {
      await axios.put(baseUrl + "assetrequest", {
        _id: row._id,
        asset_request_status: assetStatus,
        request_by: row.request_by,
      });

      await axios.post(baseUrl + "add_sim_allocation", {
        user_id: row.request_by,
        status: "Allocated",
        sim_id: assetsName,
        // sub_category_id: row.sub_category_id,
        // category_id: row.category_id,
        created_by: userID,
      });

      await axios.put(baseUrl + "update_sim", {
        id: assetsName,
        status: "Allocated",
      });

      handleRelodenewData();
      toastAlert("Request Success");
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <>{index + 1}</>,
      sortable: true,
      width: "80px",
    },
    {
      name: "Requested By",
      selector: (row) => row.request_by_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row?.asset_request_status === "ApprovedByManager" ? (
            <span className="badge badge-warning border-round">
              Approve By Manager
            </span>
          ) : row.asset_request_status === "Approved" ? (
            <span className="badge badge-success border-round">Assigned</span>
          ) : row.asset_request_status === "RejectedByManager" ? (
            <span className="badge badge-danger border-round">
              Rejected By Manager
            </span>
          ) : row.asset_request_status === "Requested" ? (
            <span className="badge badge-danger border-round">Requested</span>
          ) : row.asset_request_status === "Rejected" ? (
            <span className="badge badge-danger border-round">Rejected</span>
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
      width: "150px",
    },
    {
      name: "Detail",
      cell: (row) => (
        <div style={{ maxHeight: "100px", overflowY: "auto" ,margin:"5px"}}>
          {row.detail}
        </div>
      ),
      width: "250px",
      sortable: true,
    },

    {
      name: "Request Date",
      selector: (row) =>
        row.date_and_time_of_asset_request
          .split("-")
          .reverse()
          .join("-")
          .substring(
            0,
            row.date_and_time_of_asset_request
              .split("-")
              .reverse()
              .join("-")
              .indexOf("T")
          ) +
        row.date_and_time_of_asset_request
          .split("-")
          .reverse()
          .join("-")
          .substring(
            row.date_and_time_of_asset_request
              .split("-")
              .reverse()
              .join("-")
              .indexOf("Z") + 1
          ),
      sortable: true,
    },

    (newAssetData[0]?.asset_request_status === "Rejected" ||
      newAssetData[0]?.asset_request_status === "ApprovedByManager") && {
      name: "Reject Reason",
        cell: (row) =>(
        <div style={{ maxHeight: "100px", overflowY: "auto" }}> {row.reject_reason}</div>
       ),
      sortable: true,
      width: "200px",
      
    },

    (newAssetData[0]?.asset_request_status === "ApprovedByManager" ||
      newAssetData[0]?.asset_request_status === "Requested") && {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            type="button"
            data-toggle="modal"
            data-target="#sidebar-right"
            size="small"
            onClick={() => handleStatusUpdate(row, "Approved")}
            className="btn btn-success btn-sm"
          >
            Assign
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm ml-2"
            // onClick={() => handleRejectStatus(row, "Rejected")}
            onClick={() => handleRejectRemarkOpen(row)}
          >
            Reject
          </button>
        </>
      ),
      width: "250px",
    },
  ];

  return (
    <>
      <div className="">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              columns={columns}
              data={newAssetData}
              // fixedHeader
              pagination
              // fixedHeaderScrollHeight="50vh"
              exportToCSV
              highlightOnHover
              subHeader
            />
          </div>
        </div>
      </div>

      {/* Sidebar Right */}
      <div className="right-modal">
        <div
          className="modal fade right"
          id="sidebar-right"
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
                <h4 className="modal-title">Assigned By HR</h4>
              </div>
              <div className="modal-body">
                <div className="form-group col-12">
                  <label className="form-label">
                    Asset Name <sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={getAssetDataContext.map((opt) => ({
                      value: opt.sim_id,
                      label: opt.assetsName,
                    }))}
                    value={{
                      value: assetsName,
                      label:
                        getAssetDataContext.find(
                          (user) => user.sim_id === assetsName
                        )?.assetsName || "",
                    }}
                    onChange={(e) => {
                      setAssetName(e.value);
                    }}
                    required
                  />
                </div>

                <div>
                  {selectedAsset.map((d) => (
                    // <h1>{d.asset_id}</h1>
                    <div className="mt-5">
                      <figure className="one_card one_card--normal">
                        <figcaption className="one_card__caption">
                          <h1 className="one_card__name">Asset Details</h1>
                          <table className="one_card__stats">
                            <tbody>
                              <tr>
                                <th>Asset Name</th>
                                <td>{d.assetsName}</td>
                              </tr>
                              <tr>
                                <th>Asset ID</th>
                                <td>{d.asset_id}</td>
                              </tr>
                              <tr>
                                <th>Asset Brand</th>
                                <td>{d.asset_brand_name}</td>
                              </tr>
                              <tr>
                                <th>Asset Modal</th>
                                <td>{d.asset_modal_name}</td>
                              </tr>
                              <tr>
                                <th>Type</th>
                                <td>{d.asset_type}</td>
                              </tr>
                              <tr>
                                <th>Warranty</th>
                                <td>{d.inWarranty}</td>
                              </tr>
                              <tr>
                                <th>Category</th>
                                <td>{d.category_name}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="one_card__abilities">
                            <h4 className="one_card__ability">
                              <span className="one_card__label">
                                Vendor Name
                              </span>
                              {d.vendor_name}
                            </h4>
                            <h4 className="one_card__ability">
                              <span className="one_card__label">Status</span>
                              {d.status}
                            </h4>
                          </div>
                        </figcaption>
                      </figure>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  data-dismiss="modal"
                  className=" btn btn-primary ml-2"
                  onClick={handleAssignedSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal  */}
      <div
        className={`modal fade ${isModalOpenRemark ? "show" : ""}`}
        id="sidebar-right"
        tabIndex={-1}
        role="dialog"
        style={{ display: isModalOpenRemark ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="AllocationModal">
                Remark
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={() => closeModalRemark()}>
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <form className="modal_formdata">
                <div className="modal_formbx row thm_form">
                  <div className="form-group col-12">
                    <label className="form-label">
                      Reject Remark <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      value={rejectRemark}
                      onChange={(e) => setRejectRemark(e.target.value)}
                      className="form-control"
                      type="textarea"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleRejectStatus}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAssetRequestOverview;
