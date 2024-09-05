import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import DataTable from "react-data-table-component";
import HrVisibleToHrOverview from "./HrVisibleToHrOverview";
import axios from "axios";
import Modal from "react-modal";
import NewAssetRequestOverview from "./NewAssetRequestOverview";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";

const AssetVisibleToHr = () => {
  const { toastAlert } = useGlobalContext();
  const { userID } = useAPIGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [newAsseRequesttData, setNewAsseRequesttData] = useState([]);
  const [returnAssetData, setReturnAssetData] = useState([]);

  // Return Recover Asset
  const [returnRow, setReturnRow] = useState(0);
  const [reoverStatus, setRecoverStatus] = useState("");
  const [returnRecoverRemark, setReturnRecoverRemark] = useState("");
  const [returnRecoverImg1, setReturnRecoverImg1] = useState(null);
  const [returnRecoverImg2, setReturnRecoverImg2] = useState(null);

  // Parent Toggle Button section start------------------------------------------------
  const handleAccordionButtonClickParent = (index) => {
    setActiveAccordionIndexParent(index);
  };
  const accordionButtonsParent = [
    "Repair Asset Request",
    "New Asset Request",
    "Return Asset",
  ];
  const [activeAccordionIndexParent, setActiveAccordionIndexParent] =
    useState(0);

  const isButton1Active = activeAccordionIndexParent === 0;
  const isButton2Active = activeAccordionIndexParent === 1;
  const isButton3Active = activeAccordionIndexParent === 2;

  const accordionButtons1 = [
    `All (${newAsseRequesttData.length})`,
    `Requested (${
      newAsseRequesttData.filter((d) => d.asset_request_status == "Requested")
        .length
    })`,
    `Assigned (${
      newAsseRequesttData.filter((d) => d.asset_request_status == "Approved")
        .length
    })`,
    `Rejected (${
      newAsseRequesttData.filter((d) => d.asset_request_status == "Rejected")
        .length
    })`,
  ];

  const handleRelodenewData = () => {
    getData();
    getNewAssetData();
    getReturnAssetData();
  };

  const newAssetTab1 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData}
      handleRelodenewData={handleRelodenewData}
    />
  );
  const newAssetTab2 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData?.filter(
        (d) =>
          d.asset_request_status == "ApprovedByManager" ||
          d.asset_request_status == "Requested"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  const newAssetTab3 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData?.filter(
        (d) => d.asset_request_status == "Approved"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  const newAssetTab4 = (
    <NewAssetRequestOverview
      newAssetData={newAsseRequesttData?.filter(
        (d) => d.asset_request_status == "Rejected"
      )}
      handleRelodenewData={handleRelodenewData}
    />
  );
  // Parent Toggle Button section End

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = [
    `All (${data.length})`,
    `Requested (${data.filter((d) => d.status == "Requested").length})`,
    `Accepted (${data.filter((d) => d.status == "Accept").length})`,
    `Recovered (${data.filter((d) => d.status == "Recover").length})`,
    `Resolved (${data.filter((d) => d.status == "Resolved").length})`,
  ];

  const [activeAccordionIndex1, setActiveAccordionIndex1] = useState(0);

  // toggle button
  const handleAccordionButtonClick1 = (index) => {
    setActiveAccordionIndex1(index);
  };

  const hardRender = () => {
    getData();
    getNewAssetData();
    getReturnAssetData();
  };
  const tab1 = (
    <HrVisibleToHrOverview hrOverviewData={data} hardRender={hardRender} />
  );
  const tab2 = (
    <HrVisibleToHrOverview
      hrOverviewData={data?.filter(
        (d) => d.status == "Requested" || d.status == "ApprovedByManager"
      )}
      hardRender={hardRender}
    />
  );
  const tab3 = (
    <HrVisibleToHrOverview
      hrOverviewData={data?.filter((d) => d.status == "Accept")}
      hardRender={hardRender}
    />
  );
  const tab4 = (
    <HrVisibleToHrOverview
      hrOverviewData={data?.filter((d) => d.status == "Recover")}
      hardRender={hardRender}
    />
  );
  const tab5 = (
    <HrVisibleToHrOverview
      hrOverviewData={data?.filter((d) => d.status == "Resolved")}
      hardRender={hardRender}
    />
  );
  const getNewAssetData = () => {
    axios.get(baseUrl + "assetrequest").then((res) => {
      setNewAsseRequesttData(res.data.data);
    });
  };

  const getReturnAssetData = () => {
    axios.get(baseUrl + "assetreturn").then((res) => {
      setReturnAssetData(
        // res.data.singleAssetReturnRequest.filter(
        //   (d) => d.asset_return_status !== "RecovedByHR"
        // )
        res.data.singleAssetReturnRequest
      );
    });
  };
  useEffect(() => {
    getData();
    getNewAssetData();
    getReturnAssetData();
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return d?.asset_name?.toLowerCase()?.match(search?.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "show_asset_hr_data");
      setFilterData(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleReturnAssetRecover = (row, status) => {
    setReturnRow(row);
    setRecoverStatus(status);
  };
  const handleRecoverAssetSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("_id", returnRow._id);
      formData.append("asset_return_recover_by_remark", returnRecoverRemark);
      formData.append("recover_asset_image_1", returnRecoverImg1);
      formData.append("recover_asset_image_2", returnRecoverImg2);
      formData.append("asset_return_recover_by", userID);
      formData.append("asset_return_status", reoverStatus);

      await axios.put(baseUrl + "assetreturn", formData);

      await axios.put(baseUrl + "update_sim", {
        id: returnRow.sim_id,
        user_id: 0,
        status: "Available",
      });

      await axios.put(baseUrl + "update_allocationsim", {
        sim_id: returnRow.sim_id,
        allo_id: returnRow.allo_id,
        status: "Available",
        user_id: 0,
        submitted_by: userID,
        Last_updated_by: userID,
        Reason: returnRecoverRemark,
        submitted_at: returnRow.asset_return_recovered_date_time,
      });

      toastAlert("Requested Success");
      hardRender();
      setReturnRecoverRemark("");
      setReturnRecoverImg1("");
      setReturnRecoverImg2("");
    } catch (error) {
      console.log(error);
    }
  };

  const returnDataColumns = [
    {
      name: "Return By",
      selector: (row) => row.asset_return_by_name,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
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
            <span className="badge badge-success border-round">Recover By HR</span>
          ) : row.asset_return_status === "RecoverdByManager" ? (
            <span className="badge badge-warning border-round">Recovered By Manager</span>
          ) : row.asset_return_status === "Pending" ? (
            <span className="badge badge-warning border-round">Pending</span>
          ) : (
            "N/A"
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          {row.asset_return_status !== "RecovedByHR" && (
            <button
              type="button"
              data-toggle="modal"
              data-target="#return-asset-modal"
              size="small"
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleReturnAssetRecover(row, "RecovedByHR")}
            >
              Recover
            </button>
          )}
        </>
      ),
      width:"150px"
    },
  ];

  return (
    <>
      {/* parent toggle */}
      <div className="tab">
      {accordionButtonsParent.map((button, index) => (
        <div className={`named-tab ${activeAccordionIndexParent=== index ? "active-tab":""}`} id={index}  onClick={()=>{
          setActiveAccordionIndexParent(index)
        }}>{button}</div>
      ))}
      </div>
      {/* <FormContainer
        submitButton={false}
        mainTitle=""
        title=""
        accordionButtons={accordionButtonsParent}
        activeAccordionIndex={activeAccordionIndexParent}
        onAccordionButtonClick={handleAccordionButtonClickParent}
      ></FormContainer> */}
      <div className="action_heading ">
        <div className="action_title master-card-css">
          {isButton1Active && (
            <>
            <FormContainer
              submitButton={false}
              mainTitle="Repair Request To Hr"
              title=""
              link="true"
              accordionButtons={accordionButtons}
              activeAccordionIndex={activeAccordionIndex}
              onAccordionButtonClick={handleAccordionButtonClick}
            />
            <div className="tab">
              {
                accordionButtons.map((button, index) =>(<div key={index} className={`named-tab ${activeAccordionIndex === index?"active-tab":""}`} onClick={()=>{handleAccordionButtonClick(index)}}>{button}</div>))
              }
            </div>
            <div className="card">
              <div className="card-header">
              <h5>Repair Request Overview</h5>
              </div>
              <div className="card-body body-padding">
              {activeAccordionIndex === 0 && tab1}
              {activeAccordionIndex === 1 && tab2}
              {activeAccordionIndex === 2 && tab3}
              {activeAccordionIndex === 3 && tab4}
              {activeAccordionIndex === 4 && tab5}
              </div>
            </div>
            </>
          )}
          {isButton2Active && (
            <>
            <FormContainer
              submitButton={false}
              mainTitle="New Asset Request"
              title=""
              link="true"
              // accordionButtons={accordionButtons1}
              // activeAccordionIndex={activeAccordionIndex1}
              // onAccordionButtonClick={handleAccordionButtonClick1}
            />
            <div className="tab">
              {
                accordionButtons1.map((button, index) =>(<div key={index} className={`named-tab ${activeAccordionIndex1 === index?"active-tab":""}`} onClick={()=>{handleAccordionButtonClick1(index)}}>{button}</div>))
              }
            </div>
            <div className="card">
              <div className="card-header">
              <h5>New Asset Request Overview</h5>
              </div>
              <div className="card-body body-padding">
              {activeAccordionIndex1 === 0 && newAssetTab1}
              {activeAccordionIndex1 === 1 && newAssetTab2}
              {activeAccordionIndex1 === 2 && newAssetTab3}
              {activeAccordionIndex1 === 3 && newAssetTab4}
              </div>
            </div>
              </>
          )}
          {isButton3Active && (
            <div className="page_height">
              <div className="card mb-4">
                <div className="data_tbl table-responsive">
                  <DataTable
                    title="Asset Return Request"
                    columns={returnDataColumns}
                    data={returnAssetData}
                    // fixedHeader
                    // fixedHeaderScrollHeight="64vh"
                    exportToCSV
                    highlightOnHover
                    pagination
                  />
                </div>
              </div>
            </div>
          )}
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
                <h4 className="modal-title">Recover Asset</h4>
                <button type="button" className="close" data-dismiss="modal">
                  <span aria-hidden="true" style={{ marginLeft: "250px" }}>
                    ×
                  </span>
                </button>
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
                  onClick={handleRecoverAssetSubmit}
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

export default AssetVisibleToHr;
