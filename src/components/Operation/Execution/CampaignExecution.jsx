import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import {
  useAuditedDataUploadMutation,
  useBulkCampaignUpdateMutation,
  useGetAllPagessByPlatformQuery,
  useGetDeleteStoryDataQuery,
  useGetPlanByIdQuery,
  useGetPostDetailsBasedOnFilterMutation,
  usePostDataUpdateMutation,
  useUpdateMultipleAuditStatusMutation,
  useUpdatePriceforPostMutation,
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
import PostGenerator from "../../InstaPostGenerator/PostGenerator";
import PhotoPreview from "./PhotoPreview";
import { useGetPmsPlatformQuery } from "../../Store/reduxBaseURL";
import { Autocomplete } from "@mui/lab";
import { TextField } from "@mui/material";
import { useGetVendorsQuery } from "../../Store/API/Purchase/DirectPurchaseApi";
import formatDataObject from "../../../utils/formatDataObject";
import StoryModal from "./StoryModal.jsx";
import MultipleService from "./MultipleService.jsx";
import { set } from "date-fns";
import StringLengthLimiter from "../../../utils/StringLengthLimiter.js";
import Carousel from "/copy.png";
import Reel from "/reel.png";
import Image from "/more.png";
import BulkCampaignUpdate from "./BulkCampaignUpdate.jsx";
import { render } from "react-dom";
import ConvertDateToOpposite from "../../../ConvertDateToOpposite.js";
import { Link } from "react-router-dom";

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
  const [selectedData, setSelectedData] = useState([]);
  const [platformName, setPlatformName] = useState("");
  const [pageName, setPageName] = useState({ page_name: "" });
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("single");
  const [actTab, setActTab] = useState("all");
  const [linkData, setLinkData] = useState([]);
  const maxTabs = useRef(4);
  const memoValue = useRef(null);

  const removeStory = useRef(null);
  const [visibleTabs, setVisibleTabs] = useState(
    Array.from({ length: maxTabs.current }, (_, i) => i)
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const page_id = useRef(null);
  const token = getDecodedToken();
  const { data: vendorsList, isLoading: vendorsLoading } = useGetVendorsQuery();

  const {
    data: allPages,
    isLoading: allPagesLoading,
    isFetching: allPagesFetching,
  } = useGetAllPagessByPlatformQuery(platformName, { skip: !platformName });

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
  } = useGetPlanByIdQuery({
    id: selectedPlan,
    vendorId: selectedVendor,
    startDate,
    endDate,
  });

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

  const [
    getDataByFilter,
    { isLoading: filterLoading, isSuccess: filterSuccess },
  ] = useGetPostDetailsBasedOnFilterMutation();

  async function handleFilterLinks(codes, tab) {
    setActTab(!memoValue?.current?.tab ? tab : memoValue?.current?.tab);
    try {
      const data = {
        shortCodes:
          memoValue?.current?.codes?.length > 0
            ? memoValue?.current?.codes?.map((code) => code.shortCode)
            : codes.map((code) => code.shortCode),
      };
      const res = await getDataByFilter(data);
      if (codes?.length > 0 && tab == 5)
        memoValue.current = { codes: codes, tab: tab };
      if (res.error) throw new Error(res.error);
      setLinkData(res.data.data);
      toastAlert("Data Fetched");
    } catch (err) {
      toastError("Error while fetching data", err);
    }
  }
  useEffect(() => {
    setLinkData([]);
    setActTab("");
  }, [selectedPlan]);

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
    row?.platform_id && formData.append("platform_id", row?.platform_id);

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

  const pageesOnvendor = useMemo(() => {
    return Array.isArray(allPages?.pageData)
      ? allPages.pageData?.filter((data) => data?.temp_vendor_id === vendorName)
      : [];
  }, [allPages, vendorName]);

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
      let uniqPhaseList = [];
      if (actTab != 5) {
        uniqPhaseList = PlanData?.reduce((acc, curr) => {
          if (!acc.some((item) => item.value === curr.phaseDate)) {
            acc.push({
              value: curr.phaseDate,
              label: formatDate(curr?.phaseDate)?.replace(/T.*Z/, ""),
            });
          }
          return acc;
        }, []);
      } else {
        uniqPhaseList = linkData?.reduce((acc, curr) => {
          if (!acc.some((item) => item.value === curr.phaseDate)) {
            acc.push({
              value: curr.phaseDate,

              label: formatDate(curr?.phaseDate)?.replace(/T.*Z/, ""),
            });
          }
          return acc;
        }, []);
      }

      setPhaseList(uniqPhaseList);
    } else {
      setPhaseList([]);
    }
  }, [selectedPlan, fetchingPlanData, linkData]);

  function utcToIst(utcDate) {
    let date = new Date(utcDate);
    date.setHours(date.getHours() + 5, date.getMinutes() + 30); // IST is UTC +5:30

    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function checkAbletoAudit() {
    return selectedData.every(
      (data) =>
        data.amount > 0 &&
        !!data.vendor_name &&
        data.audit_status !== "purchased"
    );
  }
  const phaseWiseData = useMemo(() => {
    let phasedData = [];
    if (actTab != 5)
      phasedData = PlanData?.filter((data) => {
        if (activeTab === "all") {
          return true;
        }
        return data.phaseDate === activeTab;
      });
    else
      phasedData = linkData?.filter((data) => {
        if (activeTab === "all") {
          return true;
        }
        return data.phaseDate === activeTab;
      });
    return phasedData;
  }, [PlanData, activeTab, fetchingPlanData, loadingPlanData, linkData]);

  // useEffect(() => {
  //   if (selectedPrice) {
  //     handlePriceUpdate(selectedPrice);
  //   }
  // }, [selectedPrice]);
  async function handlePriceUpdate(row) {
    try {
      const key = [
        { price_key: "instagram_post" },
        {
          price_key: "instagram_story",
        },
        {
          price_key: "instagram_reel",
        },
        {
          price_key: "instagram_carousel",
        },
        {
          price_key: "instagram_both",
        },
      ];

      const data = {
        shortCode: row.shortCode,
        platform_name: row.platform_name,
        price_key:
          row?.postType == "REEL"
            ? key[2].price_key
            : row?.postType == "CAROUSEL"
            ? key[3].price_key
            : row?.postType === "IMAGE"
            ? key[0].price_key
            : row?.story_link && row?.ref_link
            ? key[4].price_key
            : key[1].price_key,
      };
      if (!data.platform_name) {
        toastError("Please select the platform");
        return;
      }
      if (!data.price_key) {
        toastError("Please enter the price");
        return;
      }

      const res = await updatePrice(data);
      if (res.error) throw new Error(res.error);
      await refetchPlanData();
      setSelectedPrice("");
      toastAlert("Price Updated");
    } catch (error) {}
  }

  async function handleBulkAudit() {
    if (selectedData.length === 0) {
      toastError("Please select the data to update");
      return;
    }
    try {
      if (selectedData.some((data) => data.audit_status === "purchased")) {
        toastError("You have selected purchased data");
        return;
      }
      if (!checkAbletoAudit()) {
        toastError(
          "Please fill the amount and vendor name for all the selected data or you have selected purchased data"
        );
        return;
      }
      const data = {
        audit_status: "audited",
        shortCodes: selectedData.map((data) => data.shortCode),
      };

      const res = await bulkAudit(data);
      if (res.error) throw new Error(res.error);
      if (actTab == 5) handleFilterLinks();
      else await refetchPlanData();

      toastAlert("Status Updated");
    } catch (err) {
      toastError("Error Uploading Data");
    }
  }

  async function handleAuditedDataUpload() {
    try {
      const data = {
        campaignId: selectedPlan,
        userId: token.id,
        phaseDate:
          activeTab == "all"
            ? phaseList?.length == 1
              ? phaseList[0]?.value
              : ""
            : activeTab,
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
      name: "Short Code",
      key: "shortCode",
      width: 100,
    },
    {
      name: "Platform",
      key: "platform_name",
      editable: true,
      renderRowCell: (row) => {
        return row.platform_name;
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
                platform_id: pmsPlatform.data.find(
                  (item) => item.platform_name === val
                )?._id,
              };
              handelchange(data, index, column, true);
            }}
          />
        );
      },
      width: 300,
    },
    {
      key: "post_dec",
      name: "Logo",
      renderRowCell: (row) => (
        <div className="d-flex gap-2 align-items-center">
          <img
            className="mr-3"
            src={
              row?.postType == "REEL"
                ? Reel
                : row?.postType == "CAROUSEL"
                ? Carousel
                : Image
            }
            style={{ width: "20px", height: "20px" }}
            alt=""
          />

          <img
            className="icon-1"
            src={`https://storage.googleapis.com/insights_backend_bucket/cr/${row?.owner_info?.username}.jpeg`}
            alt=""
          />
        </div>
      ),
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
        setVendorName(row.vendor_id);
        return (
          <div className="row" style={{ width: "300px", display: "flex" }}>
            <CustomSelect
              fieldGrid={12}
              dataArray={vendorsList}
              optionId={"vendor_id"}
              optionLabel={"vendor_name"}
              selectedId={row?.vendor_id}
              setSelectedId={(name) => {
                const vendorDetail = vendorsList.find(
                  (item) => item.vendor_id === name
                );

                const vendorData = {
                  vendor_id: vendorDetail.vendor_id,
                  vendor_name: vendorDetail.vendor_name,
                };

                setVendorName(vendorDetail.temp_vendor_id);

                handelchange(vendorData, index, column, true);
              }}
            />
          </div>
        );
      },
      width: 300,
      editable: true,
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 200,
      renderRowCell: (row) => row?.owner_info?.username,
      compare: true,
      editable: true,
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        // if (!platformName || allPagesFetching || allPagesLoading)
        //   return <p>Please select the platform</p>;
        return (
          <div style={{ position: "relative", width: "100%" }}>
            {/* <input
              className="form-control"
              type="text"
              placeholder={row?.page_name}
              value={row?.owner_info?.username}
              onChange={(e) => {
                const data = {
                  ...row?.owner_info,
                  username: e.target.value,
                };

                handelchange({ owner_info: data }, index, column, true);
              }}
            /> */}
            <Autocomplete
              options={pageesOnvendor}
              getOptionLabel={(option) => option.page_name || ""}
              // getOptionKey={(option) => option.page_name}
              renderInput={(params) => {
                return (
                  <TextField {...params} label="Page Name" variant="outlined" />
                );
              }}
              value={pageName || row?.page_name}
              onChange={(event, newValue) => {
                page_id.current = newValue?._id;
                setPageName(newValue);
                const data = {
                  page_name: newValue?.page_name,
                };
                setVendorName(newValue?.page_name);
                handelchange(data, index, column, true);
              }}
            />
          </div>
        );
      },
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
      name: "Amount",
      key: "amount",
      editable: true,
      width: 100,
      getTotal: true,
    },
    {
      name: "Fetch Price",
      key: "fetch_price",
      width: 100,
      renderRowCell: (row, index) => (
        <button
          className={`icon-1`}
          onClick={() => handlePriceUpdate(row)}
          title="Fetch Price"
        >
          <i className={`bi bi-currency-dollar`}></i>
        </button>
      ),
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
                disabled={
                  row.audit_status === "purchased" ||
                  Number(row.amount) < 1 ||
                  !row.vendor_name ||
                  (row.audit_status == "audited" && editflag)
                }
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
        if (row.amount < 0 || row.vendor_name == "" || row.campaignId == null) {
          return (
            <p>
              Amount should be greater than or equal to 0 and select the vendor
              for the page
            </p>
          );
        } else
          return (
            <button
              title={
                row.audit_status === "purchased" ||
                row.amount < 0 ||
                row?.vendor_name == "" ||
                row?.campaignId == null
                  ? "Amount should be greater than or equal to 0 and select the vendor for the page or this link is not present in any campaign"
                  : ""
              }
              disabled={
                row.audit_status === "purchased" ||
                row.amount < 0 ||
                row?.vendor_name == "" ||
                row?.campaignId == null
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

        // if (row.amount < 1 || row.vendor_name == "" || row.campaignId == null)
        //   return (
        //     <p>
        //       Amount should be greater than 0 and select the vendor for the page
        //     </p>
        //   );

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
            disabled={
              row.amount < 0 || row.vendor_name == "" || row.campaignId == null
            }
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
        if (row?.phaseDate == null) {
          return "";
        }
        if (!row?.owner_info?.username) return "#ff00009c";
        return row.audit_status === "audited"
          ? "rgb(255 131 0 / 80%)"
          : row.audit_status === "purchased"
          ? "#c4fac4"
          : row.amoumt == 0 || row.vendor_name == ""
          ? "#ffff008c"
          : "";
      },
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      width: 150,
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
          <CustomSelect
            fieldGrid={12}
            dataArray={campaignList}
            optionId={"_id"}
            optionLabel={"exe_campaign_name"}
            selectedId={row?.campaignId}
            setSelectedId={(val) => {
              const data = {
                campaignId: val,
                campaign_name: campaignList.find((item) => item._id === val)
                  ?.exe_campaign_name,
              };
              handelchange(data, index, column, true);
            }}
          />
        );
      },
    },
    {
      name: "Phase Date",
      key: "phaseDate1",
      renderRowCell: (row) =>
        ConvertDateToOpposite(
          formatDate(row.phaseDate)?.replace(/T.*Z/, "").trim()
        ),
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

    // {
    //   key: "price_key",
    //   name: "Price Key",
    //   editable: true,
    //   customEditElement: (row) => {
    //     return (
    //       <CustomSelect
    //         fieldGrid={12}
    //         dataArray={[
    //           { price_key: "instagram_post" },
    //           {
    //             price_key: "instagram_story",
    //           },
    //           {
    //             price_key: "instagram_reel",
    //           },
    //           {
    //             price_key: "instagram_carousel",
    //           },
    //           {
    //             price_key: "instagram_both",
    //           },
    //         ]}
    //         optionId={"price_key"}
    //         optionLabel={"price_key"}
    //         selectedId={selectedPrice}
    //         setSelectedId={(val) => {
    //           let data = { ...row, price_key: val };
    //           setSelectedPrice(data);
    //         }}
    //       />
    //     );
    //   },
    //   width: 100,
    // },
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
    // {
    //   name: "Location",
    //   key: "location",
    //   width: 150,
    //   editable: true,
    // },
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
                { postType: "CAROUSEL" },
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
      name: "Caption",
      key: "accessibility_caption",
      renderRowCell: (row) => StringLengthLimiter(row.accessibility_caption),
      width: 300,
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
        return ConvertDateToOpposite(utcToIst(row.postedOn));
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
      name: "Page Edit",
      key: "Pageedits",
      customEditElement: (row) => {
        if (page_id.current === null)
          return "Please select the vendor and its page";
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
    const phaseData = phaseWiseData;
    // const hasPending = phaseData?.some(
    //   (data) => data.audit_status === "pending"
    // );
    const allPurchased = phaseData?.every(
      (data) => data.audit_status === "purchased"
    );
    return allPurchased;
  }

  const CampaignSelection = useMemo(
    () => [
      {
        _id: 0,
        exe_campaign_name: "Vendor Wise Data",
      },
      ...(campaignList
        ? campaignList.filter((data) => data?.is_sale_booking_created)
        : []),
    ],
    [campaignList]
  );

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
      <div className="card">
        <div className="card-body row">
          <div className="col-md-6">
            {selectedPlan == 0
              ? "Vendor Wise Data"
              : campaignList?.find((data) => data?._id == selectedPlan)
                  ?.exe_campaign_name}
          </div>
          <CustomSelect
            disabled={!!links}
            fieldGrid={6}
            dataArray={CampaignSelection}
            optionId={"_id"}
            optionLabel={"exe_campaign_name"}
            selectedId={selectedPlan}
            setSelectedId={(val) => {
              localStorage.setItem(
                "tab",
                JSON.stringify({ [val]: { activeTab, activeTabIndex } })
              );
              setSelectedPlan(val);
            }}
            label={"Plans"}
          />
          {/* <CustomSelect
            fieldGrid={6}
            dataArray={vendorsList}
            optionId={"_id"}
            optionLabel={"vendor_name"}
            selectedId={selectedVendor}
            setSelectedId={setSelectedVendor}
            label={"Vendor"}
          />
          <FieldContainer
            fieldGrid={6}
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            label="Start Date"
          />
          <FieldContainer
            fieldGrid={6}
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
            }}
            label="End Date"
          /> */}

          {/* <button
            className="btn cmnbtn btn-primary mt-4"
            onClick={() => {
              setSelectedVendor("");
              setStartDate("");
              setEndDate("");
              setSelectedPlan((prev) => prev);
            }}
          >
            Clear
          </button> */}
        </div>
      </div>
      {selectedData.length > 0 && <PostGenerator bulk={selectedData} />}
      <LinkUpload
        setLinkData={setLinkData}
        setActTab={setActTab}
        handleFilterLinks={handleFilterLinks}
        startDate={startDate}
        endDate={endDate}
        selectedVendor={selectedVendor}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setSelectedVendor={setSelectedVendor}
        setType={setType}
        type={type}
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
        isLoading={loadingPlanData || fetchingPlanData || filterLoading}
        pagination={[50, 100, 200]}
        selectedData={(data) => setSelectedData(data)}
        showTotal={true}
        addHtml={
          <div className="d-flex sb w-100">
            <div></div>
            <div className="d-flex">
              {selectedData.length > 0 && (
                <button
                  title="Bulk Upload"
                  className={`mr-3 cmnbtn btn btn-sm ${
                    selectedData.length === 0
                      ? "btn-outline-primary"
                      : "btn-primary"
                  }`}
                  onClick={() => {
                    setModalName("bulkUpload");
                    setToggleModal(true);
                  }}
                >
                  Bulk Upload
                </button>
              )}
              {phaseWiseData?.length > 0 && (
                <button
                  title="Upload Audited Data"
                  className={`mr-3 cmnbtn btn btn-sm ${
                    disableAuditUpload() ? "btn-outline-primary" : "btn-primary"
                  }`}
                  onClick={handleAuditedDataUpload}
                  disabled={disableAuditUpload() || AuditedUploading}
                >
                  Record Purchase
                </button>
              )}
              <button
                title="Reload Data"
                className={`mr-3 icon-1 btn-outline-primary  ${
                  fetchingPlanData && "animate_rotate"
                }`}
                onClick={actTab == 5 ? handleFilterLinks : refetchPlanData}
              >
                <ArrowClockwise />
              </button>
              <button
                title="audit"
                className={`cmnbtn btn btn-sm btn-outline-primary`}
                onClick={() => {
                  handleBulkAudit();
                }}
                disabled={bulkAuditLoading}
              >
                Audit
              </button>
              <div className="popover-container">
                <i
                  style={{ cursor: "pointer" }}
                  className="bi bi-info-circle-fill warningText ml-3 mt-3"
                />
                <div className="popover-content">
                  <div className="popover-item">
                    <span
                      className="rounded-circle mr-3"
                      style={{
                        backgroundColor: "#c4fac4",
                        width: "10px",
                        height: "10px",
                      }}
                    ></span>{" "}
                    <p>Purchased</p>
                  </div>
                  <div className="popover-item">
                    <span
                      className="rounded-circle mr-3"
                      style={{
                        backgroundColor: "rgb(255 131 0 / 80%)",
                        width: "10px",
                        height: "10px",
                      }}
                    ></span>{" "}
                    <p>Audited</p>
                  </div>{" "}
                  <div className="popover-item">
                    <span
                      className="rounded-circle mr-3"
                      style={{
                        backgroundColor: "#ffff008c",
                        width: "10px",
                        height: "10px",
                      }}
                    ></span>{" "}
                    <p>Amount is 0 or Vendor name is empty</p>
                  </div>
                  <div className="popover-item">
                    <span
                      className="rounded-circle mr-3"
                      style={{
                        backgroundColor: "#ff00009c",
                        width: "10px",
                        height: "10px",
                      }}
                    ></span>{" "}
                    <p>Data is not fetched</p>
                  </div>
                  <div className="popover-item">
                    <p>
                      No colour means all data is present and It's in pending
                      Stage
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};

export default CampaignExecution;
