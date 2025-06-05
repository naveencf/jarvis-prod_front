import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import {
  useAuditedDataUploadMutation,
  useGetDeleteStoryDataQuery,
  useGetPlanByIdQuery,
  useGetPostDetailofPagenVendorMutation,
  useGetPostDetailsBasedOnFilterMutation,
  usePostDataUpdateMutation,
  useUpdateMultipleAuditStatusMutation,
  useUpdatePriceforPostMutation,
  useUpdateVendorMutation,
} from "../../Store/API/Operation/OperationApi";

import View from "../../AdminPanel/Sales/Account/View/View";
import getDecodedToken from "../../../utils/DecodedToken";
import { useGlobalContext } from "../../../Context/Context";
import { formatDate, formatDateAsDDMMYY } from "../../../utils/formatDate";
import Modal from "react-modal";
import {
  useGetAdvancedPaymentsByVendorQuery,

  useVerifyAdvancePurchaseMutation,
} from "../../Store/API/Sales/ExecutionCampaignApi";
import { ArrowClockwise, Pencil } from "@phosphor-icons/react";
import PageEdit from "../../AdminPanel/PageMS/PageEdit";
import { useGetPmsPlatformQuery } from "../../Store/reduxBaseURL";
import { Autocomplete } from "@mui/lab";
import { TextField } from "@mui/material";
import {
  useGetVendorsQuery,
  useGetVendorsWithSearchQuery,
  useUpdateMultiplePurchasedStatusDataMutation,
} from "../../Store/API/Purchase/DirectPurchaseApi";
import formatDataObject from "../../../utils/formatDataObject";
import StringLengthLimiter from "../../../utils/StringLengthLimiter.js";
import Carousel from "/copy.png";
import Reel from "/reel.png";
import Image from "/more.png";
import ConvertDateToOpposite from "../../../ConvertDateToOpposite.js";
import Swal from "sweetalert2";
import Loader from "../../Finance/Loader/Loader.jsx";
import PriceUpdateModal from "../../Purchase/PriceUpdateModal.jsx";
import LinkUploadVendorSales from "./LinkUploadVendorSales.jsx";
import PhaseTab from "../../Operation/Execution/PhaseTab.jsx";
import StoryModal from "../../Operation/Execution/StoryModal.jsx";
import PhotoPreview from "../../Operation/Execution/PhotoPreview.jsx";
import MultipleService from "../../Operation/Execution/MultipleService.jsx";
import DuplicayModal from "../../Operation/Execution/DuplicayModal.jsx";
import AuditedDataView from "../../Operation/Execution/AuditedDataView.jsx";
import BulkCampaignUpdate from "../../Operation/Execution/BulkCampaignUpdate.jsx";
import {
  useGetAllVendorSalesPostLinksByVendorIdQuery,
  useGetAllVendorSalesPostLinksQuery,
  useUpdateVendorSalesPostLinkByIdMutation,
} from "../../Store/API/VendorSale/VendorSaleApi.js";
import { debounce } from "../../../utils/helper.js";
import EditVendorModal from "./EditVendorModal.jsx";
import formatString from "../Operation/CampaignMaster/WordCapital.jsx";

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
const VendorSalesOverview = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phaseList, setPhaseList] = useState([]);
  const [advancedPaymentLoading, setAdvancedPaymentLoading] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [toggleModal, setToggleModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [modalName, setModalName] = useState("");
  const [duplicateMsg, setDuplicateMsg] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [links, setLinks] = useState("");
  const [phaseDate, setPhaseDate] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [pageName, setPageName] = useState({ page_name: "" });
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [price, setPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState("single");
  const [actTab, setActTab] = useState("all");
  const [linkData, setLinkData] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [platfromId, setPlatformId] = useState(null);
  const [allPages, setAllpages] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const vendorList = useRef(null);
  const maxTabs = useRef(4);
  const memoValue = useRef(null);

  const removeStory = useRef(null);
  const [visibleTabs, setVisibleTabs] = useState(
    Array.from({ length: maxTabs.current }, (_, i) => i)
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const page_id = useRef(null);
  const token = getDecodedToken();
 
  const [verifyAdvancePurchase] = useVerifyAdvancePurchaseMutation();

  // const {
  //   data: allPages,
  //   isLoading: allPagesLoading,
  //   isFetching: allPagesFetching,
  // } = useGetAllPagessByPlatformQuery(platformName, { skip: !platformName });
 

 

  const { data: vendorsList, isLoading: vendorsLoading } =
    useGetVendorsWithSearchQuery(vendorSearchQuery);

  // const {
  //   data: allVendors,
  //   isLoading: allVendorsLoading,
  //   isFetching: allVendorsFetching,
  // } = useGetVendorSalesInventoryQuery();

 
  const [
    bulkAudit,
    { isLoading: bulkAuditLoading, isSuccess: bulkAuditSuccess },
  ] = useUpdateMultipleAuditStatusMutation();

  const {
    data: advancedPayments,
    isLoading: isAdvancedPaymentsLoading,
    refetch: refetchAdvancedPayments,
  } = useGetAdvancedPaymentsByVendorQuery(selectedVendor);
  // console.log("advancedPayments",advancedPayments);

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

  const {
    data: vendorSalesPostLinks,
    refetch: refetchVendorSalesPostLinks,
    isLoading: isVendorSalesPostLinksLoading,
    isError: isVendorSalesPostLinksError,
  } = useGetAllVendorSalesPostLinksByVendorIdQuery(selectedVendorId);
  // } =   useGetAllVendorSalesPostLinksByVendorIdQuery(selectedVendorId);

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
    updateVendorSalesPostLinkById,
    {
      isLoading: isUpdatingPostLink,
      isError: isPostLinkUpdateError,
      data: updatedPostLinkData,
    },
  ] = useUpdateVendorSalesPostLinkByIdMutation();

  const [
    updateVendor,
    { error: vendorError, isLoading: vendorLoading, isSuccess: vendorSuccess },
  ] = useUpdateVendorMutation();

  const [
    getDataByFilter,
    { isLoading: filterLoading, isSuccess: filterSuccess },
  ] = useGetPostDetailsBasedOnFilterMutation();

  const useDebouncedSetter = (setter, delay = 500) => {
    return useCallback(
      debounce((value) => {
        setter(value);
      }, delay),
      [setter, delay]
    );
  };

  const debouncedSetSearchQuery = useDebouncedSetter(setVendorSearchQuery);

  const handlePaymentSelect = async (selectedOption) => {
    if (!selectedOption) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with the advanced payment option?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const invalidReasons = [];

    const allAudited = selectedData.every(
      (item) => item.audit_status === "audited"
    );
    if (!allAudited) {
      invalidReasons.push("One or more posts are not audited.");
    }

    const allPageMatch = selectedData.every(
      (item) =>
        item.page_name?.toLowerCase() ===
        selectedOption.page_name?.toLowerCase()
    );
    if (!allPageMatch) {
      invalidReasons.push(
        `All selected posts must belong to the page: ${selectedOption.page_name}`
      );
    }

    selectedData.forEach((item, index) => {
      const errors = [];
      if (item.amount === 0) errors.push("amount is 0");
      if (!item.vendor_name) errors.push("vendor_name is missing");
      // if (!item.campaignId) errors.push("campaignId is missing");
      if (!item.platform_name) errors.push("platform_name is missing");

      if (errors.length > 0) {
        invalidReasons.push(
          `Post ${index + 1} (${
            item.shortCode || item.page_name
          }): ${errors.join(", ")}`
        );
      }
    });

    const netAmount =
      selectedOption.remaining_advance_amount - selectedOption.gst_amount;
    const totalSelectedAmount = selectedData.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );

    if (netAmount < totalSelectedAmount) {
      invalidReasons.push(
        `Insufficient balance. Required: ₹${totalSelectedAmount}, Available: ₹${netAmount}`
      );
    }

    if (invalidReasons.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        html: `<ul style="text-align: left;">${invalidReasons
          .map((reason) => `<li>${reason}</li>`)
          .join("")}</ul>`,
      });
      return;
    }

    const shortCodes = selectedData
      .map((item) => item.shortCode)
      .filter((code) => code);

    if (shortCodes.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No ShortCodes Found",
        text: "No valid shortCodes were found in the selected posts.",
      });
      return;
    }
    const payload = {
      shortCodes: shortCodes,
      advancedPaymentIds: [selectedOption._id],
    };
    setAdvancedPaymentLoading(true);
    try {
      const { data } = await verifyAdvancePurchase(payload);
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Advance purchase verification was successful!",
        });
        if (actTab == 5) handleFilterLinks();
        else await refetchVendorSalesPostLinks();
        await refetchAdvancedPayments();
      } else {
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: data?.message,
        });
      }
      setAdvancedPaymentLoading(false);
    } catch (error) {
      console.log("Verification failed:", error);
      Swal.fire({
        icon: "error",
        title: "Advance purchase Failed",
        text: "Something went wrong",
      });
    }
    setAdvancedPaymentLoading(false);
  };
  const getChangedFields = (original, updated) => {
    const changes = {};
    for (const key in updated) {
      if (typeof updated[key] === "object" && updated[key] !== null) {
        if (JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
          changes[key] = updated[key];
        }
      } else if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    }
    return changes;
  };

  const handleEditVendorSubmit = async (updatedData) => {
    try {
      if (!updatedData?._id) {
        toastError("No ID found for update.");
        return;
      }

      const changedFields = getChangedFields(editData, updatedData);

      if (Object.keys(changedFields).length === 0) {
        toastAlert("No changes detected.");
        return;
      }

      const res = await updateVendorSalesPostLinkById({
        id: updatedData._id,
        body: changedFields,
      });

      if (res?.error) throw new Error(res.error);
      toastAlert("Post link updated successfully!");
      await refetchVendorSalesPostLinks();
    } catch (error) {
      console.error("Update failed:", error);
      toastError("Failed to update vendor sales post link.");
    }
  };

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!vendorId || !platfromId) return;

  //     const payload = {
  //       vendor_id: vendorId,
  //       platform_id: platfromId,
  //     };
  //     try {
  //       const response = await getData(payload);
  //       setAllpages(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [platfromId, vendorId]);

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
        (data) => data.value == cachedData[selectedPlan]["activeTab"]
      );
      if (tabIndex == -1) {
        setActiveTabIndex(0);
      }
      // console.log(
      //   "tabIndex",
      //   tabIndex,
      //   cachedData[selectedPlan]["activeTabIndex"],
      //   phaseList
      // );
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
      if (actTab != 5 || actTab != 4) {
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

  function checkAbletoAudit() {
    return selectedData.every(
      (data) =>
        data.amount > 0 &&
        !!data.vendor_name &&
        data.audit_status !== "purchased" &&
        data.campaignId != null
    );
  }
  const phaseWiseData = useMemo(() => {
    let phasedData = [];
    // console.log(activeTab);
    if (
      vendorSalesPostLinks?.length > 0 &&
      !vendorSalesPostLinks.some((data) => data.phaseDate == activeTab)
    ) {
      return vendorSalesPostLinks;
    }
    if (actTab != 5) {
      phasedData = vendorSalesPostLinks?.filter((data) => {
        if (activeTab === "all") {
          return true;
        }
        return data.phaseDate === activeTab;
      });
    } else
      phasedData = linkData?.filter((data) => {
        if (activeTab === "all") {
          return true;
        }
        return data.phaseDate === activeTab;
      });
    return phasedData;
  }, [
    vendorSalesPostLinks,
    activeTab,
    fetchingPlanData,
    loadingPlanData,
    linkData,
  ]);

  // useEffect(() => {
  //   if (selectedPrice) {
  //     handlePriceUpdate(selectedPrice);
  //   }
  // }, [selectedPrice]);
  async function handlePriceUpdate(row) {
    try {
      const data = {
        shortCode: row.shortCode,
        platform_name: row.platform_name,
        price_key:
          row?.postType == ""
            ? ""
            : row?.postType == "REEL"
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
        toastError("Please fill the details and  save it");
        return;
      }

      const res = await updatePrice(data);
      if (res.error) throw new Error(res.error);
      await refetchVendorSalesPostLinks();
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
      if (
        selectedData.some(
          (data) =>
            data.audit_status === "purchased" ||
            data?.audit_status === "audited"
        )
      ) {
        toastError("You have selected purchased or audited data");
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
      else await refetchVendorSalesPostLinks();

      toastAlert("Status Updated");
    } catch (err) {
      toastError("Error Uploading Data");
    }
  }
  async function handleBulkPending() {
    if (selectedData.length === 0) {
      toastError("Please select the data to update");
      return;
    }
    try {
      if (
        selectedData.some(
          (data) =>
            data.audit_status === "purchased" ||
            data.audited_status === "pending"
        )
      ) {
        toastError("You have selected purchased or audited data");
        return;
      }

      const data = {
        audit_status: "pending",
        shortCodes: selectedData.map((data) => data.shortCode),
      };

      const res = await bulkAudit(data);
      if (res.error) throw new Error(res.error);
      if (actTab == 5) handleFilterLinks();
      else await refetchVendorSalesPostLinks();

      toastAlert("Status Updated");
    } catch (err) {
      toastError("Error Uploading Data");
    }
  }

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value)) {
      setPrice(value);
    }
  };

  const handleSave = () => {
    setShowModal(true);
  };
  async function handleAuditedDataUpload() {
    try {
      if (actTab == 5) {
        if (selectedData.length > 1) {
          toastError("Please select only one data to upload");
          return;
        }
        if (selectedData.length == 0) {
          toastError("Please select the data to upload");
          return;
        }
        if (selectedData[0].audit_status == "pending") {
          toastError("Please select the data which is audited");
          return;
        }
      }

      if (actTab == 4) {
        if (
          selectedData.length > 0 &&
          selectedData.every((data) => data.audit_status != "audited")
        ) {
          toastError("Please select the data which is audited");
          return;
        }
      }

      let data = {};
      data =
        actTab == 4 && selectedData.length > 0
          ? {
              userId: token.id,

              isVendorWise: true,
              vendor_id: vendorList.current,
              shortCodes: selectedData.map((data) => data.shortCode),
            }
          : actTab == 5 && selectedData.length === 1
          ? {
              userId: token.id,
              shortCodes: selectedData.map((data) => data.shortCode),
              campaignId: selectedData[0].campaignId,
            }
          : {
              userId: token.id,
              isVendorWise: true,
              vendor_id: vendorList.current,
            };

      const res = await uploadAudetedData(data);
      if (res.error) throw new Error(res.error);
      if (actTab == 5) handleFilterLinks();
      else await refetchVendorSalesPostLinks();
      toastAlert("Data Uploaded");
    } catch (err) {
      toastError("Error Uploading Data");
    }
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
      width: 100,
    },

    {
      name: "Short Code",
      key: "shortCode",
      width: 100,
    },
    {
      name: "Platform",
      key: "platform_name",
      renderRowCell: (row) => {
        return formatString(row.platform_name);
      },
      width: 100,
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
      width: 100,
      renderRowCell: (row) => formatString(row?.vendor_name),
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 100,
      renderRowCell: (row) => formatString(row?.owner_info?.username),
      compare: true,
    },
    {
      key: "status",
      name: "Status",
      width: 100,
      renderRowCell: (row) => formatString(row?.status),
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
      renderRowCell: (row) => (
        <button
          style={{
            backgroundColor: "transparent",
            border: "2px solid lightGray",
          }}
          disabled={row.status === "sales"}
          onClick={() => {
            setEditData(row);
            setShowEditModal(true);
          }}
        >
          <Pencil size={32} color="#facc15" weight="fill" />
        </button>
      ),
    },
    {
      key: "campaign_name",
      name: "Campaign Name",
      width: 100,
    },
    {
      name: "Phase Date",
      key: "phaseDate1",
      renderRowCell: (row) =>
        // ConvertDateToOpposite(
        // formatDateAsDDMMYY(row.phaseDate)?.replace(/T.*Z/, "").trim()
        row.phaseDate?.replace(/T.*Z/, "").trim(),
      // ),
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
    },
    {
      key: "story_link",
      name: "Story Link",
      width: 100,
    },

    {
      name: "Comment Count",
      key: "comment_count",
      width: 100,
    },

    {
      name: "Like Count",
      key: "like_count",
      width: 100,
    },

    {
      name: "Play Count",
      key: "play_count",
      renderRowCell: (row) => {
        return row.play_count;
      },
      width: 100,
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
      width: 100,
    },
    {
      name: "Post Type",
      key: "postType",
      width: 100,
    },

    {
      name: "Caption",
      key: "accessibility_caption",
      renderRowCell: (row) => StringLengthLimiter(row.accessibility_caption),
      width: 300,
    },
    {
      name: "Posted On",
      key: "postedOn1",
      renderRowCell: (row) => {
        // return ConvertDateToOpposite(utcToIst(row.postedOn));
        return ConvertDateToOpposite(
          formatDateAsDDMMYY(row.phaseDate)?.replace(/T.*Z/, "").trim()
        );
      },
      width: 150,
      compare: true,
    },

    {
      name: "Page Edit",
      key: "Pageedits",
      width: 100,
    },
  ];

  const handleConfirmUpdate = async () => {
    try {
      setShowModal(false);

      if (!selectedData || selectedData.length === 0) {
        toastError("No data selected for updating.");
        return;
      }

      const shortCodes = selectedData.map((data) => data.shortCode);
      if (shortCodes.length === 0) {
        toastError("No valid short codes found for updating.");
        return;
      }
      const isAllPurchased = selectedData.every(
        (item) => item.audit_status !== "purchased"
      );
      if (!isAllPurchased) {
        toastError("Only Audited and Pending Links can be updated.");
        return;
      }

      const payload = {
        dataToBeUpdate: { amount: Number(price) || 0 },
        shortCodes,
        // updatedBy: token.id,
      };

      const res = await updateVendor(payload);
      if (res?.error) throw new Error(res.error);
      if (res.data.success) {
        toastAlert("Price updated successfully!");
        await refetchVendorSalesPostLinks();
      }

      setPrice(null);
      setToggleModal(false);
      setSelectedData([]);
    } catch (error) {
      console.error("Error updating data:", error);
      toastError(`Update failed: ${error.message || "Something went wrong."}`);
    }
  };

  function disableAuditUpload() {
    if (selectedData?.length > 0) {
      if (
        selectedData?.some(
          (data) =>
            data?.audit_status !== "audited" ||
            data?.amount == 0 ||
            !data?.vendor_name ||
            !data?.campaignId ||
            !data?.platform_name
        )
      ) {
        return true;
      } else return false;
    }
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
    else if (name == "uploadMessage") {
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
          refetchPlanData={refetchVendorSalesPostLinks}
          setToggleModal={setToggleModal}
          setSelectedData={setSelectedData}
        />
      );
    return null;
  }
  if (advancedPaymentLoading) {
    return <Loader />;
  }
  console.log("vendorsList", vendorsList);
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
      <EditVendorModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        data={editData}
        onSubmit={handleEditVendorSubmit}
        pageOptions={phaseWiseData}
      />

      <FormContainer mainTitle={"Vendor Sales"} link={"true"} />
      <div className="card">
        <div className="card-body row">
       
          <div style={{ width: "20rem" }}>
            <Autocomplete
              fullWidth
              options={Array.isArray(vendorsList) ? vendorsList : []}
              getOptionLabel={(option) => option.vendor_name}
              value={vendorsList?.find(
                (item) => item.vendor_id === selectedVendorId
              )}
              onChange={(event, newValue) => {
                setSelectedVendorId(newValue?._id || null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Vendor"
                  variant="outlined"
                  onChange={(e) => debouncedSetSearchQuery(e.target.value)}
                />
              )}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <PriceUpdateModal
          selectedData={selectedData}
          price={price}
          // pricePerMillion={pricePerMillion}
          onConfirm={handleConfirmUpdate}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* {selectedData.length > 0 && <PostGenerator bulk={selectedData} />} */}
      <LinkUploadVendorSales
        vendorList={vendorList}
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
        setSelectedData={setSelectedData}
        phaseList={phaseList}
        token={token}
        refetchPlanData={refetchVendorSalesPostLinks}
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
        handlePriceChange={handlePriceChange}
        handleSave={handleSave}
        price={price}
        vendorId={selectedVendorId}
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
          PlanData={vendorSalesPostLinks}
        />
      )}

      <View
        rowSelectable={true}
        // version={1}
        data={phaseWiseData}
        columns={columns}
        title={`Vendor Sales`}
        tableName={"Vendor-sales"}
        isLoading={loadingPlanData || fetchingPlanData || filterLoading}
        pagination={[50, 100, 200]}
        selectedData={(data) => setSelectedData(data)}
        showTotal={true}
        tableSelectedRows={selectedData}
        addHtml={
          <div className="d-flex sb w-100">
            <div></div>
            <div className="d-flex">
              {/* <button
                title="Bulk Upload"
                disabled={selectedData.length === 0}
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
                Campaign Update
              </button> */}
              {actTab === 4 && selectedVendor ? (
                <Autocomplete
                  options={advancedPayments || []}
                  getOptionLabel={(option) => {
                    const netAmount =
                      option.remaining_advance_amount - option.gst_amount;
                    return `${option.page_name} - ₹${netAmount}`;
                  }}
                  sx={{ width: 200, marginRight: 2 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Advanced Payment"
                      variant="outlined"
                    />
                  )}
                  onChange={(event, newValue) => handlePaymentSelect(newValue)}
                />
              ) : (
                ""
              )}
              {phaseWiseData?.length > 0 && (actTab == 4 || actTab == 5) && (
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
                onClick={
                  actTab == 5 ? handleFilterLinks : refetchVendorSalesPostLinks
                }
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
              <button
                title="pending"
                className={`cmnbtn btn btn-sm btn-outline-primary ml-2`}
                onClick={() => {
                  handleBulkPending();
                }}
                disabled={bulkAuditLoading}
              >
                Pending
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

export default VendorSalesOverview;
