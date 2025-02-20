import React, { useEffect, useRef, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import {
  useAuditedDataUploadMutation,
  useGetPlanByIdQuery,
  usePostDataUpdateMutation,
  useVendorDataQuery,
} from "../../Store/API/Operation/OperationApi";
import View from "../../AdminPanel/Sales/Account/View/View";
import CustomSelect from "../../ReusableComponents/CustomSelect";
import getDecodedToken from "../../../utils/DecodedToken";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { formatDate } from "../../../utils/formatDate";
import Modal from "react-modal";
import { useGetAllExeCampaignsQuery } from "../../Store/API/Sales/ExecutionCampaignApi";
import { ArrowClockwise } from "@phosphor-icons/react";
import LinkUpload from "./LinkUpload";
import PhaseTab from "./PhaseTab";
import AuditedDataView from "./AuditedDataView";
import PageEdit from "../../AdminPanel/PageMS/PageEdit";
import PurchasePagesStats from "../../Purchase/PurchaseVendor/PurchasePagesStats";
import DuplicayModal from "./DuplicayModal";

const CampaignExecution = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phaseList, setPhaseList] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [toggleModal, setToggleModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [modalName, setModalName] = useState("");
  const [duplicateMsg, setDuplicateMsg] = useState(false);
  const [links, setLinks] = useState("");
  const [phaseDate, setPhaseDate] = useState("");

  const maxTabs = useRef(4);
  const [visibleTabs, setVisibleTabs] = useState(
    Array.from({ length: maxTabs.current }, (_, i) => i)
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const page_id = useRef(null);
  const token = getDecodedToken();

  const {
    data: campaignList,
    isFetching: fetchingCampaignList,
    isLoading: loadingCampaignList,
  } = useGetAllExeCampaignsQuery();

  const {
    refetch: refetchPlanData,
    data: PlanData,
    isFetching: fetchingPlanData,
    isSuccess: successPlanData,
    isLoading: loadingPlanData,
  } = useGetPlanByIdQuery(selectedPlan, { skip: !selectedPlan });

  const [updateData, { isLoading, isSuccess }] = usePostDataUpdateMutation();
  const [uploadAudetedData, { isLoading: AuditedUploading }] =
    useAuditedDataUploadMutation();

  const {
    data: vendorList,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
    isSuccess: vendorSuccess,
    isError: vendorError,
  } = useVendorDataQuery(vendorName, { skip: !vendorName });

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem("tab"));
    if (cachedData?.[selectedPlan]) {
      setActiveTab(cachedData[selectedPlan]["activeTab"]);
      setActiveTabIndex(cachedData[selectedPlan]["activeTabIndex"]);
      let tabIndex = phaseList.findIndex(
        (data) => data.value === cachedData[selectedPlan]["activeTab"]
      );
      if (phaseList.length > 1) {
        tabIndex++;
      }

      if (maxTabs.current - 1 < tabIndex) {
        setVisibleTabs(
          Array.from(
            { length: maxTabs.current },
            (_, i) => i + maxTabs.current * (tabIndex % maxTabs.current)
          )
        );
      }
    } else {
      setActiveTabIndex(0);
      setVisibleTabs(Array.from({ length: maxTabs.current }, (_, i) => i));
      if (phaseList.length === 1) {
        setActiveTab(phaseList[0].value);
      }
      if (phaseList.length > 1) {
        setActiveTab("all");
      }
    }
  }, [phaseList]);

  async function handledataUpdate(row) {
    const data = columns.reduce((acc, col) => {
      if (
        col.key !== "Sr.No" &&
        col.key !== "action" &&
        col.key !== "postedOn1" &&
        col.key !== "phaseDate1" &&
        col.key != "postLinks" &&
        col.key !== "pageedits"
      ) {
        acc[col.key] = row[col.key];
      }
      return acc;
    }, {});

    const formData = new FormData();
    formData.append("sponsored", true);
    formData.append("_id", row._id);
    formData.append("postedOn", row.postedOn);
    formData.append("phaseDate", row.phaseDate);

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "postImage") {
          formData.append("image", value);
        } else formData.append(key, value);
      }
    });

    try {
      console.log("here");

      const res = await updateData(formData);
      if (res.error) throw new Error(res.error);
      await refetchPlanData();

      toastAlert("Data Updated with amount " + row.amount);
      setToggleModal(false);
    } catch (err) {
      toastError("Error while Uploading");
    }
  }

  useEffect(() => {
    if (duplicateMsg) {
      setToggleModal(true);
      setModalName("duplicacyModal");
    }
  }, [duplicateMsg]);

  useEffect(() => {
    // creating unique phase list
    const cachedData = JSON.parse(localStorage.getItem("tab"));
    if (cachedData) {
      const firstKey = Object.keys(cachedData)[0];
      if (firstKey == selectedPlan || !selectedPlan) {
        setSelectedPlan(firstKey);
      }
    }
    if (selectedPlan && successPlanData) {
      const uniqPhaseList = PlanData?.reduce((acc, curr) => {
        if (!acc.some((item) => item.value === curr.phaseDate)) {
          acc.push({
            value: curr.phaseDate,
            label: formatDate(curr?.phaseDate)?.replace(/T.*Z/, ""),
          });
        }
        return acc;
      }, []);
      setPhaseList(uniqPhaseList);
    }
  }, [selectedPlan, fetchingPlanData]);

  function utcToIst(utcDate) {
    let date = new Date(utcDate);
    date.setHours(date.getHours() + 5, date.getMinutes() + 30); // IST is UTC +5:30

    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  async function handleAuditedDataUpload() {
    try {
      const data = {
        campaignId: selectedPlan,
        userId: token.id,
        phaseDate: activeTab,
      };

      const res = await uploadAudetedData(data);
      if (res.error) throw new Error(res.error);
      await refetchPlanData();
      toastAlert("Data Uploaded");
    } catch (err) {
      toastError("Error Uploading Data");
    }
  }
  function istToUtc(istDate) {
    let [day, month, year] = istDate.split("/").map(Number);
    let date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    date.setHours(date.getHours() - 5, date.getMinutes() - 30); // Convert IST to UTC

    return date.toISOString(); // Returns ISO UTC string
  }

  let columns = [
    {
      name: "S.No",
      key: "Sr.No",
      width: 40,
      renderRowCell: (row, index) => index + 1,
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 100,
      renderRowCell: (row) => row?.owner_info?.username,
      compare: true,
    },
    {
      name: "Short Code",
      key: "shortCode",
      width: 100,
    },
    {
      name: "Phase Date",
      key: "phaseDate1",
      renderRowCell: (row) => formatDate(row.phaseDate)?.replace(/T.*Z/, ""),
      width: 100,
      compare: true,
    },
    {
      name: "Post Links",
      key: "postLinks",
      renderRowCell: (row) => {
        return (
          <div className="d-flex gap-2">
            <a
              href={`https://www.instagram.com/p/${row.shortCode}`}
              className="icon-1"
              target="blank_"
            >
              <i className="bi bi-arrow-up-right"></i>
            </a>
            <div
              title="Copy Link"
              className="icon-1"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://www.instagram.com/p/${row.shortCode}`
                );
                toastAlert("Link Copied");
              }}
            >
              <i className="bi bi-clipboard"></i>
            </div>
          </div>
        );
      },
      width: 100,
    },
    {
      name: "Vendor Name",
      key: "vendor_name",
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        if (editflag == false) setVendorName("");
        else setVendorName(row.page_name);
        return (
          <div className="row" style={{ width: "300px", display: "flex" }}>
            <CustomSelect
              fieldGrid={12}
              dataArray={vendorFetching ? [] : vendorList}
              optionId={"vendor_id"}
              optionLabel={"vendor_name"}
              selectedId={row?.vendor_id}
              setSelectedId={(name) => {
                const vendorDetail = vendorList.find(
                  (item) => item.vendor_id === name
                );
                page_id.current = vendorDetail._id;
                const vendorData = {
                  vendor_id: vendorDetail.vendor_id,
                  vendor_name: vendorDetail.vendor_name,
                };

                handelchange(vendorData, index, column, true);
              }}
            />
          </div>
        );
      },
      width: 300,
      editable: true,
    },
    // {
    //   name: "Plan ID",
    //   key: "campaignId",
    //   width: 100,
    // },
    // {
    //   name: "Request ID",
    //   key: "requestId",
    //   width: 100,
    // },
    // {
    //   name: "Created At",
    //   key: "createdAt",
    //   width: 150,
    // },
    // {
    //   name: "Updated At",
    //   key: "updatedAt",
    //   width: 150,
    // },

    {
      name: "Amount",
      key: "amount",
      editable: true,
      // customEditElement:(
      //   row,
      //   index,
      //   setEditFlag,
      //   editflag,
      //   handelchange,
      //   column
      // )=>{

      // }
      width: 100,
    },
    {
      name: "Accessibility Caption",
      key: "accessibility_caption",
      width: 150,
      editable: true,
    },
    {
      name: "Comment Count",
      key: "comment_count",
      width: 100,
      editable: true,
    },
    // {
    //   name: "Is Paid Partnership",
    //   key: "is_paid_partnership",
    //   width: 150,
    //   editable: true,
    // },
    {
      name: "Like Count",
      key: "like_count",
      width: 100,
      editable: true,
    },
    {
      name: "Location",
      key: "location",
      width: 150,
      editable: true,
    },
    // {
    //   name: "Music Info",
    //   key: "music_info",
    //   width: 150,
    // },
    // {
    //   name: "Phase Name",
    //   key: "phaseName",
    //   width: 150,
    // },
    {
      name: "Play Count",
      key: "play_count",
      renderRowCell: (row) => {
        return row.play_count;
      },
      width: 100,
      editable: true,
    },
    {
      name: "Post Image",
      key: "postImage",
      renderRowCell: (row) => (
        <a
          href={row?.postImage}
          target="_blank"
          className="icon-1"
          title="View Image"
        >
          <img
            src={row?.postImage}
            style={{
              aspectRatio: "6/9",
            }}
          />
        </a>
      ),

      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        return (
          <div className="row" style={{ width: "300px", display: "flex" }}>
            <FieldContainer
              fieldGrid={12}
              type="file"
              onChange={(e) => {
                const data = {
                  target: { value: e.target.files[0] },
                };
                handelchange(data, index, column, false, "postImage");
              }}
            />
          </div>
        );
      },
      width: 150,
      editable: true,
    },
    {
      name: "Post Type",
      key: "postType",
      width: 100,
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        return (
          <div className="row" style={{ width: "300px", display: "flex" }}>
            <CustomSelect
              fieldGrid={12}
              dataArray={[
                { postType: "REEL" },
                { postType: "COROUSEL" },
                { postType: "IMAGE" },
              ]}
              optionId={"postType"}
              optionLabel={"postType"}
              selectedId={row?.postType}
              setSelectedId={(val) => {
                const data = {
                  postType: val,
                };
                handelchange(data, index, column, true);
              }}
            />
          </div>
        );
      },
      editable: true,
    },
    // {
    //   name: "Post Type Decision",
    //   key: "postTypeDecision",
    //   width: 150,
    // },
    {
      name: "Posted On",
      key: "postedOn1",
      renderRowCell: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        return utcToIst(row.postedOn);
      },
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        return (
          <div className="row" style={{ width: "300px", display: "flex" }}>
            <FieldContainer
              fieldGrid={12}
              type="date"
              value={row.postedOn}
              onChange={(e) => {
                const data = {
                  postedOn: e.target.value,
                  postedOn1: e.target.value,
                };
                handelchange(data, index, column, true);
              }}
            />
          </div>
        );
      },
      width: 150,
      editable: true,
      compare: true,
    },
    // {
    //   name: "Sponsored",
    //   key: "sponsored",
    //   customEditElement: (
    //     row,
    //     index,
    //     setEditFlag,
    //     editflag,
    //     handelchange,
    //     column
    //   ) => {
    //     return (
    //       <div className="row" style={{ width: "300px", display: "flex" }}>
    //         <CustomSelect
    //           fieldGrid={12}
    //           dataArray={[
    //             { sponsored: true, label: "Yes" },
    //             { sponsored: false, label: "No" },
    //           ]}
    //           optionId={"sponsored"}
    //           optionLabel={"label"}
    //           selectedId={row?.sponsored}
    //           setSelectedId={(val) => {
    //             const data = {
    //               sponsored: val,
    //             };
    //             handelchange(data, index, column, true);
    //           }}
    //         />
    //       </div>
    //     );
    //   },
    //   width: 100,
    //   editable: true,
    // },
    // {
    //   name: "Tagged Users",
    //   key: "tagged_users",
    //   width: 150,
    // },

    {
      name: "Audit Status",
      key: "audit_status",
      editable: true,
      renderRowCell: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        if (row.amount <= 0 || row.vendor_name == "") {
          return (
            <p>
              Amount should be greater than 0 and select the vendor for the page
            </p>
          );
        } else
          return (
            <button
              disabled={
                row.audit_status === "purchased" ||
                row.amount <= 0 ||
                row?.vendor_name == ""
              }
              onClick={() => {
                const data = {
                  audit_status:
                    row.audit_status === "pending"
                      ? "audited"
                      : row.audit_status === "audited"
                      ? "pending"
                      : row.audit_status,
                };
                handledataUpdate({
                  ...row,
                  audit_status: data.audit_status,
                });
                handelchange(data, index, column, true);
              }}
              className={`pointer badge ${
                row.audit_status === "pending"
                  ? "btn btn-sm cmnbtn btn-primary"
                  : row.audit_status !== "audited"
                  ? "bg-success"
                  : "btn btn-sm cmnbtn btn-primary"
              }`}
            >
              {row.audit_status}
            </button>
          );
      },
      width: 300,
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        let data = ["audited", "pending"];

        if (row?.audit_status === "purchased") return <p>Purchased</p>;

        if (Number(row?.amount) <= 0)
          return (
            <p>
              Amount should be greater than 0 and select the vendor for the page
            </p>
          );

        return (
          // <div className="row" style={{ width: "300px", display: "flex" }}>
          //   <CustomSelect
          //     fieldGrid={12}
          //     dataArray={[
          //       { audit_status: "pending" },
          //       { audit_status: "audited" },
          //     ]}
          //     optionId={"audit_status"}
          //     optionLabel={"audit_status"}
          //     selectedId={row?.audit_status}
          //     setSelectedId={(val) => {
          //       const data = {
          //         audit_status: val,
          //       };
          //       handelchange(data, index, column, true);
          //     }}
          //   />
          // </div>
          <button
            className="btn btn-primary btn-sm cmnbtn"
            onClick={() => {
              const data = {
                audit_status:
                  row.audit_status === "pending" ? "audited" : "pending",
              };
              handelchange(data, index, column, true);
            }}
          >
            {row.audit_status === "pending" ? "pending" : "audited"}
          </button>
        );
      },
      colorRow: (row) => {
        if (!row?.owner_info?.username) return "#ff00009c";
        return row.audit_status !== "pending"
          ? "#c4fac4"
          : row.amoumt == 0 || row.vendor_name == ""
          ? "#ffff008c"
          : "";
      },
    },
    {
      name: "Action",
      key: "action",
      width: 100,
      renderRowCell: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => (
        <div className="d-flex gap-2">
          <button
            className="icon-1"
            onClick={() => {
              setModalName("auditedData");
              setToggleModal(true);
              setModalData(row);
            }}
            title="View"
          >
            <i className="bi bi-eye"></i>
          </button>

          {editflag === index && (
            <button
              className="btn btn-sm cmnbtn btn-primary"
              onClick={() => handledataUpdate(row)}
              title="Save"
              disabled={
                row.audit_status === "purchased" ||
                Number(row.amount) <= 0 ||
                !row.vendor_name
              }
            >
              save
            </button>
          )}
        </div>
      ),
    },
    {
      name: "Page Edit",
      key: "Pageedits",
      customEditElement: (row) => {
        if (page_id.current === null)
          return "Please select the vendor for this page";
        return (
          <button
            className="btn btn-primary btn-sm cmnbtn"
            onClick={() => {
              setModalName("PageEdit");
              setToggleModal(true);
            }}
          >
            edit Page
          </button>
        );
      },
      width: 100,
      editable: true,
    },
  ];

  function disableAuditUpload() {
    if (activeTab === "all") return true;
    const phaseData = PlanData?.filter((data) => data.phaseDate === activeTab);
    const hasPending = phaseData?.some(
      (data) => data.audit_status === "pending"
    );
    const allPurchased = phaseData?.every(
      (data) => data.audit_status === "purchased"
    );
    return hasPending || allPurchased;
  }

  function modalViewer(name) {
    if (name === "auditedData")
      return (
        <AuditedDataView
          columns={columns}
          modalData={modalData}
          setToggleModal={setToggleModal}
        />
      );
    else if (name === "PageEdit")
      return (
        <PageEdit
          pageMast_id={page_id.current}
          handleEditClose={() => setToggleModal(false)}
        />
      );
    else if (name == "duplicacyModal") {
      return (
        <DuplicayModal
          duplicateMsg={duplicateMsg}
          setToggleModal={setToggleModal}
          setLinks={setLinks}
          refetchPlanData={refetchPlanData}
          phaseDate={phaseDate}
          setPhaseDate={setPhaseDate}
          token={token}
          selectedPlan={selectedPlan}
          setModalName={setModalName}
          setModalData={setModalData}
          campaignName={
            campaignList.find((data) => data._id == selectedPlan)
              ?.exe_campaign_name
          }
        />
      );
    } else if (name == "uploadMessage") {
      return (
        <>
          <button
            className=" icon-1"
            onClick={() => {
              setToggleModal(false);
            }}
          >
            X
          </button>
          <div className="d-flex flex-column justify-content-center align-items-center">
            {modalData?.data?.data?.shortCodeNotPresentInCampaign?.length ==
            modalData?.data?.data?.requestStatsUpdate?.length ? (
              <h4 className="text-center mb-3">
                we found these{" "}
                {modalData?.data?.data?.shortCodeNotPresentInCampaign?.length}{" "}
                links are present in different Campaign. Please Upload Different
                links.
              </h4>
            ) : (
              <h4 className="text-center mb-3">
                we found these{" "}
                {modalData?.data?.data?.shortCodeNotPresentInCampaign?.length}{" "}
                links are present in different Campaign and other links are
                uploaded Succesfully
              </h4>
            )}

            <div className="d-flex flex-column gap-2">
              {modalData?.data?.data?.shortCodeNotPresentInCampaign?.map(
                (data, index) => (
                  <p key={data}>{`https://www.instagram.com/p/${data}`}</p>
                )
              )}
            </div>
          </div>
        </>
      );
    }
    return null;
  }

  return (
    <>
      <Modal
        className="salesModal"
        isOpen={toggleModal}
        contentLabel="modal"
        appElement={document.getElementById("root")}
        style={{
          overlay: {
            position: "fixed",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            height: "100vh",
          },
          content: {
            position: "absolute",

            border: "1px solid #ccc",
            background: "#fff",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            maxHeight: "650px",
          },
        }}
      >
        <>{modalViewer(modalName)}</>
      </Modal>

      <FormContainer mainTitle={"Record Purchase"} link={"true"} />
      {selectedPlan && (
        <>
          <PurchasePagesStats
            // phaseList={phaseList}
            PlanData={PlanData?.filter((data) =>
              activeTab === "all" ? data : data.phaseDate === activeTab
            )}
          /> 

          <LinkUpload
            phaseList={phaseList}
            token={token}
            refetchPlanData={refetchPlanData}
            selectedPlan={selectedPlan}
            PlanData={PlanData}
            setDuplicateMsg={setDuplicateMsg}
            links={links}
            setLinks={setLinks}
            phaseDate={phaseDate}
            setPhaseDate={setPhaseDate}
            setModalName={setModalName}
            setModalData={setModalData}
            setToggleModal={setToggleModal}
          />
        </>
      )}

      {phaseList.length > 1 && (
        <PhaseTab
          maxTabs={maxTabs}
          phaseList={phaseList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTabIndex={activeTabIndex}
          setActiveTabIndex={setActiveTabIndex}
          visibleTabs={visibleTabs}
          setVisibleTabs={setVisibleTabs}
          selectedPlan={selectedPlan}
          PlanData={PlanData}
        />
      )}

      <View
        version={1}
        data={PlanData?.filter((data) =>
          activeTab === "all" ? data : data.phaseDate === activeTab
        )}
        columns={columns}
        title={`Records`}
        tableName={"PlanX-execution"}
        isLoading={loadingPlanData || fetchingPlanData}
        pagination={[50, 100, 200]}
        addHtml={
          <div className="d-flex sb w-75">
            <div></div>
            <div className="d-flex gap-2">
              <CustomSelect
                fieldGrid={12}
                dataArray={campaignList?.filter(
                  (data) => data?.is_sale_booking_created
                )}
                optionId={"_id"}
                optionLabel={"exe_campaign_name"}
                selectedId={selectedPlan}
                setSelectedId={setSelectedPlan}
                label={"Plans"}
              />
              {activeTab !== "all" && selectedPlan && (
                <button
                  title="Upload Audited Data"
                  className={`cmnbtn btn btn-sm btn-outline-primary`}
                  onClick={handleAuditedDataUpload}
                  disabled={disableAuditUpload() || AuditedUploading}
                >
                  Submit
                </button>
              )}
              <button
                title="Reload Data"
                className={`icon-1 btn-outline-primary  ${
                  fetchingPlanData && "animate_rotate"
                }`}
                onClick={refetchPlanData}
              >
                <ArrowClockwise />
              </button>
            </div>
          </div>
        }
      />
    </>
  );
};

export default CampaignExecution;
