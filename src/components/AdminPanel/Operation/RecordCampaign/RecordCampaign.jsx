import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FormContainer from "../../../AdminPanel/FormContainer";
import {
  useAuditedDataUploadMutation,
  useBulkCampaignUpdateMutation,
  useGetAllPagessByPlatformQuery,
  useGetDeleteStoryDataQuery,
  useGetPlanByIdQuery,
  usePlanDataUploadMutation,
  usePostDataUpdateMutation,
  useUpdateMultipleAuditStatusMutation,
  useUpdatePriceforPostMutation,
  useVendorDataQuery,
} from "../../../Store/API/Operation/OperationApi";
import View from "../../../AdminPanel/Sales/Account/View/View";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import getDecodedToken from "../../../../utils/DecodedToken";
import FieldContainer from "../../../AdminPanel/FieldContainer";
import Modal from "react-modal";
import { useGetAllExeCampaignsQuery, useGetNewExeCampaignsNameWiseDataQuery } from "../../../Store/API/Sales/ExecutionCampaignApi";
import { ArrowClockwise } from "@phosphor-icons/react";
import PageEdit from "../../../AdminPanel/PageMS/PageEdit";
import { useGetPmsPlatformQuery } from "../../../Store/reduxBaseURL";
// import { Autocomplete } from "@mui/lab";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import { useGetVendorsQuery } from "../../../Store/API/Purchase/DirectPurchaseApi";

import { formatDate } from "../../../../utils/formatDate.jsx";
import { useGlobalContext } from "../../../../Context/Context.jsx";
import PhaseTab from "../../../Operation/Execution/PhaseTab.jsx";
import AuditedDataView from "../../../Operation/Execution/AuditedDataView.jsx";
import DuplicayModal from "../../../Operation/Execution/DuplicayModal.jsx";
import PostGenerator from "../../../InstaPostGenerator/PostGenerator.jsx";
import PhotoPreview from "../../../Operation/Execution/PhotoPreview.jsx";
import formatDataObject from "../../../../utils/formatDataObject.js";
import StoryModal from "../../../Operation/Execution/StoryModal.jsx";
import MultipleService from "../../../Operation/Execution/MultipleService.jsx";
import StringLengthLimiter from "../../../../utils/StringLengthLimiter.js";
import BulkCampaignUpdate from "../../../Operation/Execution/BulkCampaignUpdate.jsx";
import LinkUploadOperation from "./LinkUploadOperation.jsx";
import formatString from "../../../../utils/formatString.js";
import axios from "axios";
import { baseUrl } from "../../../../utils/config.js";

const RecordCampaign = () => {
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
  const [selectedData, setSelectedData] = useState([]);
  const [platformName, setPlatformName] = useState("");
  const [pageName, setPageName] = useState({ page_name: "" });
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("single");
  const [selectedAction, setSelectedAction] = useState(null);
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("")
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [campaignSheetUrl, setCampaignSheetUrl] = useState(null);

  const {
    data: campaignList,
    isFetching: fetchingCampaignList,
    isLoading: loadingCampaignList,
  } = useGetNewExeCampaignsNameWiseDataQuery({
    search: campaignSearchQuery,
    page: 1,
    limit: 10
  });

  const maxTabs = useRef(4);

  const removeStory = useRef(null);
  const [visibleTabs, setVisibleTabs] = useState(
    Array.from({ length: maxTabs.current }, (_, i) => i)
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const page_id = useRef(null);
  const token = getDecodedToken();
  const { data: vendorsList, isLoading: vendorsLoading } = useGetVendorsQuery();


  const [
    uploadPlanData,
    {
      data: uploadData,
      error: uploadError,
      isLoading: uploadLoading,
      isSuccess: uploadSuccess,
    },
  ] = usePlanDataUploadMutation();


  const {
    data: pmsPlatform,
    isLoading: pmsPlatformLoading,
    isFetching: pmsPlatformFetching,
  } = useGetPmsPlatformQuery();

  const [
    bulkAudit,
    { isLoading: bulkAuditLoading, isSuccess: bulkAuditSuccess },
  ] = useUpdateMultipleAuditStatusMutation();



  const {
    refetch: refetchPlanData,
    data: PlanData,
    isFetching: fetchingPlanData,
    isSuccess: successPlanData,
    isLoading: loadingPlanData,
  } = useGetPlanByIdQuery(
    {
      id: selectedPlan,
      vendorId: selectedVendor,
      startDate,
      endDate,
    },
    { skip: selectedVendor && !(startDate && endDate) }
  );

  async function handleUploadUniqueLink(isBoth) {
    console.log("logged");
    console.log("duplicateMsg", duplicateMsg);
    try {
      const shortCodes = selectedData.map(item => ({
        ref_link: item.ref_link,
        shortCode: item.shortCode,
      }));

      const data = {
        campaignId: selectedPlan,
        department: token.dept_id,
        shortCodes: shortCodes,
        userId: token.id,
      };

      const res = await uploadPlanData(data);
      console.log('res', res);
      if (res.error) throw new Error(res.error);
      setLinks("");
      setPhaseDate("");
      setToggleModal(false);
      await refetchPlanData();
      toastAlert("States Fetched Successfully");
    } catch {
      toastError("Error in uploading Unique Links");
    }
  }


  const [updateData, { isLoading, isSuccess }] = usePostDataUpdateMutation();
  const [uploadAudetedData, { isLoading: AuditedUploading }] =
    useAuditedDataUploadMutation();

  const [
    updatePrice,
    { isLoading: PriceUpdateLoading, isSuccess: vendorUpdateSuccess },
  ] = useUpdatePriceforPostMutation();

  const {
    data: deleteStoryData,
    isLoading: deleteStoryLoading,
    isSuccess: deleteStorySuccess,
  } = useGetDeleteStoryDataQuery(removeStory.current, {
    skip: !removeStory.current,
  });
  useEffect(() => {
    if (deleteStorySuccess) {
      toastAlert("Story Deleted");
      removeStory.current = null;
    }
  }, [deleteStorySuccess, deleteStoryLoading]);

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
      if (phaseList.length > 1 || !selectedPlan) {
        setActiveTab("all");
      }
    }
  }, [phaseList]);

  async function handledataUpdate(row, setEditFlag) {
    const data = columns.reduce((acc, col) => {
      if (
        col.key !== "Sr.No" &&
        col.key !== "action" &&
        col.key !== "postedOn1" &&
        col.key !== "phaseDate1" &&
        col.key != "postLinks" &&
        col.key !== "pageedits" &&
        col.key !== "postStatus"
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
    formData.append("campaignId", row.campaignId);

    if (vendorName) {
      formData.append(
        "vendor_id",
        vendorsList?.find((item) => item.vendor_name === row.vendor_name)
          ?.vendor_id
      );
      formData.append(
        "vendorId",
        vendorsList?.find((item) => item.vendor_name === row.vendor_name)?._id
      );
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "postImage") {
          formData.append("image", value);
        } else formData.append(key, value);
        if (!pageName) {
          formData.delete("page_name");
        }
      }
    });

    try {
      const res = await updateData(formatDataObject(formData));
      if (res?.error) throw new Error(res.error);
      await refetchPlanData();

      toastAlert("Data Updated with amount " + row.amount);
      setToggleModal(false);
      setEditFlag && setEditFlag(false);
      setVendorName("");
      setPageName("");
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
        setSelectedPlan(firstKey == 0 ? 0 : firstKey);
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
    } else {
      setPhaseList([]);
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

  const phaseWiseData = useMemo(() => {
    const phasedData = PlanData?.filter((data) => {
      if (activeTab === "all") {
        return true;
      }
      return data.phaseDate === activeTab;
    });
    return phasedData;
  }, [PlanData, activeTab, fetchingPlanData, loadingPlanData]);


  const getRandomMultiplier = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;




  let columns = [
    {
      name: "Sr.No",
      key: "Sr.No",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "ref_link",
      name: "Link",
      renderRowCell: (row) => {
        return row?.ref_link.split("?")[0];
      },
      width: 200,
    },
    {
      key: "page_name",
      name: "Page Name",
      renderRowCell: (row) => {
        return formatString(row?.owner_info?.username);
      },
      width: 200,
    },
    {
      key: "reach",
      name: "Reach",
      renderRowCell: (row) => {
        const randomValue1 = getRandomMultiplier(19, 23);
        let views = row?.play_count || 0;
        if (views === 0 && row?.like_count > 0) {
          views = row.like_count * randomValue1;
        }
        const reach = views + (views / 100) * randomValue1;
        return Math.round(reach);
      },
      compare: true

    },
    {
      key: "impression",
      name: "Impression",
      renderRowCell: (row) => {
        const getRandomMultiplier = (min, max) =>
          Math.floor(Math.random() * (max - min + 1)) + min;

        let views = row?.play_count || 0;
        const randomValue1 = getRandomMultiplier(19, 23);
        const randomValue2 = getRandomMultiplier(23, 29);
        if (views === 0 && row?.like_count > 0) {
          views = row.like_count * randomValue2;
        }
        const reach = views + (views / 100) * randomValue1;
        const impression = reach + (reach / 100) * randomValue2;

        return Math.round(impression);
      },
      compare: true
    },
    {
      name: "Short Code",
      key: "shortCode",
      width: 100,
    },
    {
      name: "Platform",
      key: "platform_name",
      editable: true,
      renderRowCell: (row) => {
        return formatString(row.platform_name);
      },
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        setPlatformName(row.platform_name);
        return (
          <CustomSelect
            fieldGrid={12}
            dataArray={pmsPlatform.data || []}
            optionId={"platform_name"}
            optionLabel={"platform_name"}
            selectedId={row?.platform_name}
            setSelectedId={(val) => {
              setPlatformName(val);
              const data = {
                platform_name: val,
              };
              handelchange(data, index, column, true);
            }}
          />
        );
      },
      width: 150,
    },

    {
      name: "Post Status",
      key: "postStatus",
      width: 100,
      compare: true,
      renderRowCell: (row) => {
        if (row.like_count === -111111) {
          return <div className="badge badge-danger">Deleted / Private</div>;
        } else if (row.postTypeDecision == 0) {
          return <div className="badge badge-success">Fetched</div>;
        } else if (row.postTypeDecision == 1) {
          return <div className="badge badge-warning">Pending</div>;
        }
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
            <>
              <button
                className="btn btn-sm cmnbtn btn-primary"
                onClick={() => {
                  handledataUpdate(row, setEditFlag);
                  // handlePriceUpdate(row);
                }}
                title="Save"
              >
                save
              </button>
              <button
                className="btn btn-sm cmnbtn btn-danger ml-3"
                onClick={() => {
                  removeStory.current = row._id;
                }}
                disabled={
                  deleteStoryLoading ||
                  (row.story_link == "" && row.story_link == "")
                }
              >
                Delete Story
              </button>
            </>
          )}
        </div>
      ),
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
            <a href={row.ref_link} className="icon-1" target="blank_">
              <i className="bi bi-arrow-up-right"></i>
            </a>
            <div
              title="Copy Link"
              className="icon-1"
              onClick={() => {
                if (row.ref_link) {
                  navigator.clipboard.writeText(row.ref_link);
                  toastAlert("Link Copied");
                } else {
                  toastError("Link is not available");
                }
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
      key: "story_image",
      name: "Story Image",
      width: 100,
      renderRowCell: (row) =>
        row?.story_image && (
          <img
            src={row.story_image}
            style={{
              aspectRatio: "6/9",
              width: "50px",
            }}
          />
        ),
      editable: true,
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
                handelchange(data, index, column, false, "story_image");
              }}
            />
          </div>
        );
      },
    },
    {
      key: "story_link",
      name: "Story Link",
      width: 100,
      editable: true,
    },

    {
      name: "Comment",
      key: "comment_count",
      width: 100,
      editable: true,
    },
    {
      name: "Like",
      key: "like_count",
      width: 100,
      editable: true,
    },
    {
      name: "View",
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
        <img
          src={row?.postImage}
          style={{
            aspectRatio: "6/9",
            width: "50px",
          }}
          onClick={() => {
            setModalName("postPreview");
            setToggleModal(true);
          }}
        />
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
  ];




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
    } else if (name == "postPreview") {
      return (
        <PhotoPreview
          setToggleModal={setToggleModal}
          planData={phaseWiseData}
        />
      );
    } else if (name == "storyPost") {
      return (
        <StoryModal
          record={modalData}
          setToggleModal={setToggleModal}
          selectedPlan={selectedPlan}
          type={type}
        />
      );
    } else if (name == "multipleService")
      return (
        <MultipleService
          setModalData={setModalData}
          setToggleModal={setToggleModal}
        />
      );
    else if (name == "bulkUpload")
      return (
        <BulkCampaignUpdate
          selectedData={selectedData}
          refetchPlanData={refetchPlanData}
          setToggleModal={setToggleModal}
        />
      );
    return null;
  }
  // console.log(selectedPlan, "selectedPlan")

  const sendToGoogleSheet = async (options = {}) => {
    // const confirmed = window.confirm(`Are you sure you want to "${options.actionLabel}"?`);
    const confirmed = window.confirm(`Are you sure you want to "${options.label || 'this action'}"?`);
    // const CampaignSheetUrl = "https://docs.google.com/spreadsheets/d/1rl53FSMHtWsIz0l8-cVG4lRMjDFkD5pmNR11CC8eqC4/edit"
    if (!confirmed) return;
    if (campaignSheetUrl != "" && options.shouldOpenSheet) {
      window.open(campaignSheetUrl, "_blank");
      // ✅ Clear selected action
      setSelectedAction(null);
      return;
    }
    try {
      const response = await axios.post(
        baseUrl + `get_google_sheet_url`,
        {
          campaignId: selectedPlan,
          sheetUrl: campaignSheetUrl,
          phaseWiseData,
          ...options.payload
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      console.log("Google Sheet response:", response.data);
      if (response.data.success) {
        console.log("first")
        if (options.label == "Generate Tracker") {

          window.open(response.data.data.sheetUrl, "_blank");

        }
        toastAlert(response.data.message)
      } else if (!response.data.success && response.data.data.tracker_link != "") {
        window.open(response.data.data.tracker_link, "_blank");
        console.log("second")
      }
      // ✅ Clear selected action
      setSelectedAction(null);
    } catch (error) {
      console.error("Error sending to Google Sheet:", error);
      toastError("There is some error.Please try again later.")
    }
  };
  console.log(campaignSheetUrl, "campaignSheetUrl", selectedPlan)
  const sheetActions = [
    selectedPlan && campaignSheetUrl == "" && {
      label: "Generate Tracker",
      payload: {}, // triggers generation
      shouldOpenSheet: true
    },
    campaignSheetUrl != "" && {
      label: "Open Tracker",
      payload: {}, // triggers generation
      shouldOpenSheet: true
    },
    {
      label: "Update Stats (Only Highlight If Changed)",
      payload: { highlightOnlyIfChanged: true }
    },
    {
      label: "Update Stats (Highlight All Matched Links)",
      payload: { highlightAllMatched: true }
    },
    {
      label: "Update Stats (Don't Highlight)",
      payload: { highlightOnlyIfChanged: false }
    },
    {
      label: "Clear Row Backgrounds",
      payload: { clearCellBackground: true }
    },
    {
      label: "Sort Sheets A-Z",
      payload: { sortDirection: "asc" }
    },
    {
      label: "Sort Sheets Z-A",
      payload: { sortDirection: "desc" }
    }
  ];

  const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };


  const useDebouncedAsyncSetter = (setter, setLoading, delay = 500) => {
    const debouncedFn = useRef();

    useEffect(() => {
      debouncedFn.current = debounce(async (value) => {
        try {
          await setter(value);
        } finally {
          setLoading(false); // Stop loader after response
        }
      }, delay);
    }, [setter, delay, setLoading]);

    return (value) => {
      setLoading(true); // Show loader instantly
      debouncedFn.current(value); // Debounced call
    };
  };

  // Usage
  // const debouncedSetSearchQueryForCampName = useDebouncedSetter(setCampaignSearchQuery)
  const debouncedSetSearchQueryForCampName = useDebouncedAsyncSetter(setCampaignSearchQuery, setLoadingPlans);

  const handleCampaignName = (newValue) => {
    if (newValue) {

      setSelectedPlan(newValue?._id || null);
      setCampaignSheetUrl(newValue?.tracker_link)
    }

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

      <FormContainer mainTitle={""} link={"true"} />

      <div className="card">
        <div className="card-body row">
          <div className="col-md-6">

            <Autocomplete
              sx={{ gridColumn: 'span 6', width: '500px' }}
              options={campaignList?.filter((data) => data?.is_sale_booking_created) || []}
              getOptionLabel={(option) => option?.exe_campaign_name || ''}
              value={campaignList?.find((data) => data._id === selectedPlan) || null}
              // onChange={(event, newValue) => setSelectedPlan(newValue?._id || null)}
              onChange={(event, newValue) => handleCampaignName(newValue || null)}
              loading={loadingPlans}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Plans"
                  variant="outlined"
                  onChange={(event, value) => {
                    { console.log("testing") }
                    debouncedSetSearchQueryForCampName(value);
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingPlans ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}

                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value?._id}
              clearOnEscape
            />


          </div>
        </div>
      </div>
      {selectedData.length > 0 && <PostGenerator bulk={selectedData} />}
      <LinkUploadOperation
        setType={setType}
        type={"operation"}
        selectedData={selectedData}
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
        setSelectedPlan={setSelectedPlan}
      />

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
        rowSelectable={true}
        version={1}
        data={phaseWiseData}
        columns={columns}
        title={`Records`}
        tableName={"Campaign-execution"}
        isLoading={loadingPlanData || fetchingPlanData}
        pagination={[50, 100, 200]}
        selectedData={(data) => setSelectedData(data)}
        addHtml={
          <div className="d-flex sb w-100">
            <div></div>
            <div className="d-flex">
              {(
                <button
                  title="Bulk Upload"
                  className={`mr-3 cmnbtn btn btn-sm ${selectedData.length === 0
                    ? "btn-outline-primary"
                    : "btn-primary"
                    }`}
                  disabled={!selectedData.length > 0}
                  onClick={() => {
                    setModalName("bulkUpload");
                    setToggleModal(true);
                  }}
                >
                  Campaign Update
                </button>
              )}
              <button className="mr-3 cmnbtn btn btn-sm btn-primary" disabled={!selectedData.length || uploadLoading} onClick={() => handleUploadUniqueLink(true)}>Update Stats</button>
              {/* <button className="mr-3 cmnbtn btn btn-sm btn-primary"
                // disabled={!selectedData.length || uploadLoading} 
                onClick={() => sendToGoogleSheet(true)}>download excel</button> */}


              <Autocomplete
                options={sheetActions}
                getOptionLabel={(option) => option.label}
                value={selectedAction}
                onChange={(event, newValue) => {
                  if (newValue) {
                    sendToGoogleSheet(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Sheet Action" variant="outlined" size="small" />
                )}
                fullWidth
              />


              <button
                title="Reload Data"
                className={`mr-3 icon-1 btn-outline-primary  ${fetchingPlanData && "animate_rotate"
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

export default RecordCampaign;
