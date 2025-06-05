import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import FormContainer from "../../AdminPanel/FormContainer";
import {
  useAuditedDataUploadMutation,
  useGetAllPagessByPlatformQuery,
  useGetPlanByIdQuery,
  useGetPostDetailsBasedOnFilterMutation,
  usePostDataUpdateMutation,
  useUpdateMultipleAuditStatusMutation,
  useVendorDataQuery,
} from "../Store/API/Operation/OperationApi";
import View from "../AdminPanel/Sales/Account/View/View";
import CustomSelect from "../ReusableComponents/CustomSelect";
import getDecodedToken from "../../utils/DecodedToken";
import { useGlobalContext } from "../../Context/Context";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Modal from "react-modal";
import { formatDate } from "../../utils/formatDate";
import {
  useGetAllExeCampaignListQuery,
  useGetAllExeCampaignsQuery,
  useGetNewExeCampaignsNameWiseDataQuery,
} from "../Store/API/Sales/ExecutionCampaignApi";
import { ArrowClockwise } from "@phosphor-icons/react";
import PageEdit from "../AdminPanel/PageMS/PageEdit";
import FieldContainer from "../AdminPanel/FieldContainer";
import PhaseTab from "../Operation/Execution/PhaseTab";
import { Autocomplete } from "@mui/material";
import AuditedDataView from "../Operation/Execution/AuditedDataView";
import DuplicayModal from "../Operation/Execution/DuplicayModal";
import Calendar from "./Calender";
import {
  useGetVendorsWithSearchQuery,
  useRecordPurchaseMutation,
  useRefetchPostPriceMutation,
  useUpdateMultiplePurchasedStatusDataMutation,
  useUpdatePurchasedStatusDataMutation,
  useUpdatePurchasedStatusVendorMutation,
} from "../Store/API/Purchase/DirectPurchaseApi";
import LinkUploadAudit from "../Operation/Execution/LinkUploadAudit";
import PriceUpdateModal from "./PriceUpdateModal";
import Swal from "sweetalert2";
import { TextField } from "@mui/material";
import { useGetPmsPlatformQuery } from "../Store/reduxBaseURL";
import { useAPIGlobalContext } from "../AdminPanel/APIContext/APIContext";
import formatString from "../../utils/formatString";
import { utcToIst } from "../../utils/helper";
import formatDataObject from "../../utils/formatDataObject";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BulkCampaignUpdatePurchased from "./BulkCampaignUpdatePurchased";

const AuditPurchase = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { contextData } = useAPIGlobalContext();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phaseList, setPhaseList] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [toggleModal, setToggleModal] = useState(false);
  const [priceUpdateLoading, setPriceUpdateLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [pageName, setPageName] = useState({ page_name: "" });
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentTab, setcurrentTab] = useState("Tab1");
  const [platform, setPlatform] = useState("");
  const [campaignPlanData, setCampainPlanData] = useState();
  const [filterBy, setFilterBy] = useState("phase");
  const [modalName, setModalName] = useState("");
  const [duplicateMsg, setDuplicateMsg] = useState(false);
  const [links, setLinks] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [shortCodes, setShortCodes] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorNumericId, setVendorNumericId] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [campaignId, setCampaingnId] = useState("");
  const [phaseDate, setPhaseDate] = useState(null);

  const maxTabs = useRef(4);
  const prevPlatformName = useRef("");

  const [visibleTabs, setVisibleTabs] = useState(
    Array.from({ length: maxTabs.current }, (_, i) => i)
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { data: vendorsList, isLoading: vendorsLoading } =
    useGetVendorsWithSearchQuery(vendorSearchQuery);
  const page_id = useRef(null);
  const token = getDecodedToken();
  const {
    data: campaignList,
    isFetching: fetchingCampaignList,
    isLoading: loadingCampaignList,
  } = useGetNewExeCampaignsNameWiseDataQuery({
    search: campaignSearchQuery,
    page: 1,
    limit: 10,
  });
  const {
    data: allPages,
    isLoading: allPagesLoading,
    isFetching: allPagesFetching,
  } = useGetAllPagessByPlatformQuery(platform?.platform_name, {
    skip: !platform?.platform_name,
  });
  const [updateData] = usePostDataUpdateMutation();
  // { isLoading, isSuccess }
  const {
    data: pmsPlatform,
    isLoading: pmsPlatformLoading,
    isFetching: pmsPlatformFetching,
  } = useGetPmsPlatformQuery();

  const [refetchPostPrice, { data, error }] = useRefetchPostPriceMutation();

  const [updatePurchasedStatus, { isLoading: isUpdatingPurchasedStatus }] =
    useUpdatePurchasedStatusDataMutation();
  const [
    updatePurchasedStatusMultiple,
    { isLoading: isUpdatingPurchasedStatusMultiple },
  ] = useUpdateMultiplePurchasedStatusDataMutation();
  const [getPostDetailsBasedOnFilter, { isLoading: isFetchingPostDetails }] =
    useGetPostDetailsBasedOnFilterMutation();
  const [updatePurchasedStatusVendor, { isLoading, isError, isSuccess }] =
    useUpdatePurchasedStatusVendorMutation();

  const handleSelection = (newSelectedData) => {
    setSelectedData(newSelectedData);
  };

  const [
    bulkAudit,
    { isLoading: bulkAuditLoading, isSuccess: bulkAuditSuccess },
  ] = useUpdateMultipleAuditStatusMutation();

  const [price, setPrice] = useState("");
  const [pricePerMillion, setPricePerMillion] = useState("");

  // const handleSave = () => {
  //     // console.log("Price:", price);
  //     // handledataUpdate()
  //     selectedData.map((item)=> (handledataUpdate(item)))
  //     // console.log("Price per Million:", pricePerMillion);
  // };
  // async function handledataUpdate(row, setEditFlag) {
  //   const data = columns.reduce((acc, col) => {
  //     if (
  //       col.key !== "Sr.No" &&
  //       col.key !== "action" &&
  //       col.key !== "postedOn1" &&
  //       col.key !== "phaseDate1" &&
  //       col.key != "postLinks" &&
  //       col.key !== "pageedits" &&
  //       col.key !== "postStatus"
  //     ) {
  //       acc[col.key] = row[col.key];
  //     }
  //     return acc;
  //   }, {});

  //   const formData = new FormData();
  //   formData.append("sponsored", true);
  //   formData.append("_id", row._id);
  //   formData.append("postedOn", row.postedOn);
  //   formData.append("phaseDate", row.phaseDate);
  //   formData.append("campaignId", row.campaignId);

  //   if (vendorName) {
  //     formData.append(
  //       "vendor_id",
  //       vendorsList?.find((item) => item.vendor_name === row.vendor_name)
  //         ?.vendor_id
  //     );
  //     formData.append(
  //       "vendorId",
  //       vendorsList?.find((item) => item.vendor_name === row.vendor_name)?._id
  //     );
  //   }

  //   Object.entries(data).forEach(([key, value]) => {
  //     if (value !== null && value !== undefined) {
  //       if (key === "postImage") {
  //         formData.append("image", value);
  //       } else formData.append(key, value);
  //       if (!pageName) {
  //         formData.delete("page_name");
  //       }
  //     }
  //   });

  //   try {
  //     const res = await updateData(formatDataObject(formData));
  //     if (res?.error) throw new Error(res.error);
  //     await refetchPlanData();

  //     toastAlert("Data Updated with amount " + row.amount);
  //     setToggleModal(false);
  //     setEditFlag && setEditFlag(false);
  //     setVendorName("");
  //     setPageName("");
  //   } catch (err) {
  //     toastError("Error while Uploading");
  //   }
  // }

  const handleSave = () => {
    setShowModal(true);
  };

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
        (item) => item.audit_status === "purchased"
      );
      if (!isAllPurchased) {
        toastError("Only purchased items can be updated.");
        return;
      }

      const payload = {
        amount: Number(price) || 0,
        shortCodes,
        updatedBy: token.id,
      };

      const res = await updatePurchasedStatusMultiple(payload);
      if (res?.error) throw new Error(res.error);

      // Fetch updated campaign data
      const response = await fetchFilteredPosts();
      if (response?.isSuccess && response?.data) {
        setCampainPlanData(response.data);
      }

      setPrice(null);
      setToggleModal(false);
      toastAlert(res?.data?.message || "Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      toastError(`Update failed: ${error.message || "Something went wrong."}`);
    }
  };

  function checkAbletoAudit() {
    return selectedData.every(
      (data) =>
        data.amount > 0 &&
        !!data.vendor_name &&
        data.audit_status !== "purchased"
    );
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
      const response = await fetchFilteredPosts();
      if (response.isSuccess && response.data) {
        setCampainPlanData(response.data);
        toastAlert("Status Updated");
      }
    } catch (err) {
      toastError("Error Uploading Data");
    }
  }

  const handleRefetchPrice = async () => {
    setPriceUpdateLoading(true);
    const sCodes = selectedData.map(({ shortCode }) => shortCode);
    let payload = {};
    if (selectedData.length) {
      payload = { shortCodes: sCodes };
    } else if (selectedPlan && currentTab === "Tab1") {
      payload = { campaignId: selectedPlan };
    } else if (selectedVendorId) {
      payload = { vendorId: selectedVendorId };
    }

    try {
      const response = await refetchPostPrice(payload);
      const res = await fetchFilteredPosts();
      if (res?.data?.success && res?.data?.data?.length) {
        setCampainPlanData(res.data.data);
        setPriceUpdateLoading(false);
        toastAlert(response?.data?.message);
      }
    } catch (err) {
      console.error("Failed to fetch price:", err);
    }
    setSelectedData([]);
  };

  const fetchFilteredPosts = async () => {
    const sCodes = shortCodes.map(({ shortCode }) => shortCode);
    const payload = (() => {
      switch (currentTab) {
        case "Tab4":
          return { shortCodes: sCodes };
        case "Tab3":
          return selectedVendorId &&
            (shortCodes?.length || (startDate && endDate) || selectedPlan)
            ? {
                ...(selectedVendorId && { vendorId: selectedVendorId }),
                ...(shortCodes?.length && { shortCodes: sCodes }),
                ...(startDate &&
                  endDate && { startDate: startDate, endDate: endDate }),
                // ...(endDate && { endDate }),
                ...(selectedPlan && { campaignId: selectedPlan }),
                isFlagForDateFilter: filterBy === "created" ? 1 : 2,
              }
            : {};
        case "Tab2":
          return startDate && endDate ? { startDate, endDate } : {};
        case "Tab1":
          return selectedPlan ? { campaignId: selectedPlan } : {};
        default:
          return {};
      }
    })();
    if (Object.keys(payload).length === 0) return;
    try {
      const response = await getPostDetailsBasedOnFilter(payload);
      setCampainPlanData(response.data.data);
      return response;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const {
    refetch: refetchPlanData,
    data: PlanData,
    isFetching: fetchingPlanData,
    isSuccess: successPlanData,
    isLoading: loadingPlanData,
  } = useGetPlanByIdQuery({ id: selectedPlan }, { skip: !selectedPlan });
  const [recordPurchase, { Success: recordPurcaseSuccess }] =
    useRecordPurchaseMutation();
  // const [updateData, { isLoading, isSuccess }] = usePostDataUpdaxpteMutation();

  // const {
  //   data: vendorList,
  //   isLoading: vendorLoading,
  //   isFetching: vendorFetching,
  //   isSuccess: vendorSuccess,
  //   isError: vendorError,
  // } = useVendorDataQuery(vendorName, { skip: !vendorName });

  // const { data: vendorListData, isLoading: loading } = useGetVendorsQuery({
  //   skip: true,
  // });

  useEffect(() => {
    const cachedData = JSON.parse(localStorage.getItem("tab"));
    if (cachedData?.[selectedPlan]) {
      setActiveTab(cachedData[selectedPlan]["activeTab"]);
      setActiveTabIndex(cachedData[selectedPlan]["activeTabIndex"]);
      let tabIndex = phaseList?.findIndex(
        (data) => data.value === cachedData[selectedPlan]["activeTab"]
      );
      if (phaseList?.length > 1) {
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
      if (phaseList?.length === 1) {
        setActiveTab(phaseList[0].value);
      }
      if (phaseList?.length > 1) {
        setActiveTab("all");
      }
    }
  }, [phaseList]);

  async function handledataUpdate(row, setEditFlag) {
    // console.log('row', row);
    const followerCount = row?.owner_info?.followers
      ? row.owner_info.followers / 1000000
      : 0;
    const priceMillionWise = followerCount * pricePerMillion;
    if (row.audit_status === "purchased") {
      try {
        const payload = {
          amount: priceMillionWise
            ? Math.floor(priceMillionWise)
            : price
            ? Number(price)
            : null,
          shortCode: row.shortCode,
          pageName: pageName?.page_name,
          updatedBy: token.id,
          campaignId: campaignId,
          platform_name: platform?.platform_name,
          platform_id: platform?._id,
          phaseDate: phaseDate,
        };

        const filteredPayload = Object.fromEntries(
          Object.entries(payload).filter(([_, v]) => v != null && v !== "")
        );
        const res = await updatePurchasedStatus(filteredPayload);
        if (res.error) throw new Error(res.error);
        const response = await fetchFilteredPosts();
        if (response.isSuccess && response.data) {
          setCampainPlanData(response.data);
        }
        setPrice(null);
        // toastAlert("Data Updated with amount " + row.amount);
        toastAlert(res?.data?.message);
        setToggleModal(false);
        setEditFlag && setEditFlag(false);
      } catch (err) {
        toastError("Error while Uploading");
      }
    } else {
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
      formData.append("platform_id", platform._id);

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
        const response = await fetchFilteredPosts();
        if (response.isSuccess && response.data) {
          setCampainPlanData(response.data);
        }
        toastAlert("Data Updated successfully ");
        setPrice(null);
        setToggleModal(false);
        // setEditFlag && setEditFlag(false);
        setVendorName("");
        setPageName("");
        setEditFlag && setEditFlag(false);
      } catch (err) {
        toastError("Error while Uploading");
      }
    }
  }
  const fetchPlanData = async () => {
    const response = await fetchFilteredPosts();
    if (response.isSuccess && response.data) {
      setCampainPlanData(response.data);
    }
  };
  const handleUpdateStatus = async (vendorId) => {
    let uniqueVendor =
      new Set(selectedData.map((item) => item.vendor_name)).size === 1;
    if (!uniqueVendor) {
      Swal.fire({
        title: "Invalid Selection!",
        text: "Please select one vendor at a time.",
        icon: "warning",
      });
      return;
    }

    const allPurchased = selectedData.every(
      (item) => item.audit_status === "purchased"
    );
    if (!allPurchased) {
      Swal.fire({
        title: "Action Denied!",
        text: "All selected vendors must have 'purchased' status.",
        icon: "warning",
      });
      return;
    }

    const shortCode = selectedData.map((item) => item.shortCode);

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to update the Vendor!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      try {
        const response = await updatePurchasedStatusVendor({
          shortCodes: shortCode,
          vendor_id: vendorId,
          userId: token.id,
        });

        if (response?.error) {
          console.error("Error updating vendor status:", response.error);
          Swal.fire({
            title: "Error!",
            text:
              response.error.data.message ||
              "Something went wrong while updating the vendor status.",
            icon: "error",
          });
          return;
        }

        if (response?.data?.success) {
          const refetchResponse = await refetchPlanData();
          if (refetchResponse.isSuccess && refetchResponse.data) {
            setCampainPlanData(refetchResponse.data);
          }

          Swal.fire({
            title: "Updated!",
            text: "Vendor status has been updated successfully.",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("Unexpected Error:", error);
        Swal.fire({
          title: "Error!",
          text: "An unexpected error occurred while updating the vendor status.",
          icon: "error",
        });
      }
    }
  };

  useEffect(() => {
    if (duplicateMsg) {
      setToggleModal(true);
      setModalName("duplicacyModal");
    }
  }, [duplicateMsg]);

  useEffect(() => {
    // creating unique phase list
    // const cachedData = JSON.parse(localStorage.getItem("tab"));
    // if (cachedData) {
    //   const firstKey = Object.keys(cachedData)[0];
    //   if (firstKey == selectedPlan || !selectedPlan) {
    //     setSelectedPlan(firstKey);
    //   }
    // }
    if (selectedPlan && successPlanData) {
      const uniqPhaseList = campaignPlanData?.reduce((acc, curr) => {
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
    // fetchFilteredPosts()
  }, [selectedPlan, fetchingPlanData]);
  // console.log("fetchingPlanData",fetchingPlanData);
  useEffect(() => {
    if (selectedPlan == null) {
      setCampainPlanData([]);
    }
    if (
      selectedVendorId ||
      (startDate && endDate) ||
      selectedPlan ||
      shortCodes.length
    ) {
      fetchFilteredPosts();
    }
  }, [
    selectedVendorId,
    startDate,
    endDate,
    selectedPlan,
    shortCodes,
    filterBy,
  ]);
  // const filteredData = useMemo(() => {
  //     if (!shortCodes.length) return campaignPlanData;
  //     return shortCodes.flatMap(item => campaignPlanData.filter(data => data.shortCode === item.shortCode));
  // }, [shortCodes, campaignPlanData]);

  // useEffect(() => {
  //     setCampainPlanData(filteredData);
  // }, [filteredData]);
  function disableAuditUpload() {
    const phaseData = campaignPlanData;
    // const hasPending = phaseData?.some(
    //   (data) => data.audit_status === "pending"
    // );
    const allPurchased = phaseData?.every(
      (data) => data.audit_status === "purchased"
    );
    return allPurchased;
  }

  async function handleAuditedDataUpload() {
    try {
      if (selectedData.length < 1) {
        toastError("Please Select atleast one row.");
        return;
      }

      const shortCodes = selectedData.map((item) => item.shortCode);
      const auditedData = selectedData.every(
        (item) => item.audit_status === "audited"
      );
      if (!auditedData) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: 'All rows must have status as "audited".',
        });
        return;
      }

      const data = {
        vendor_id: vendorNumericId,
        userId: token.id,
        isVendorWise: true,
        shortCodes,
      };

      const res = await recordPurchase(data);
      if (res.error) throw new Error(res.error);

      const response = await fetchFilteredPosts();
      if (response.isSuccess && response.data) {
        setCampainPlanData(response.data);
      }
      toastAlert("All audited data is now purchased and its ledger is updated");
      setSelectedData([]);
    } catch (err) {
      toastError("Error Uploading Data");
    }
  }

  function istToUtc(istDate) {
    let [day, month, year] = istDate.split("/").map(Number);
    let date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    date.setHours(date.getHours() - 5, date.getMinutes() - 30);

    return date.toISOString();
  }
  const handlePriceChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value)) {
      setPrice(value);
    }
  };

  const handleTabClick = (tab) => {
    setcurrentTab(tab);
    switch (tab) {
      case "Tab1":
        setCampainPlanData([]);
        setSelectedPlan(null);
        setStartDate(null);
        setEndDate(null);
        setSelectedData([]);
        // setSelectedVendorId(null);
        // setShortCodes([]);
        break;
      case "Tab2":
        setCampainPlanData([]);
        setSelectedPlan(null);
        setStartDate(null);
        setEndDate(null);
        setSelectedData([]);
        // setShortCodes([]);
        // setSelectedPlan(null);
        // setSelectedVendorId(null);
        break;
      case "Tab3":
        setCampainPlanData([]);
        setSelectedPlan(null);
        setStartDate(null);
        setEndDate(null);
        setSelectedData([]);
        // setShortCodes([]);
        // setStartDate(null);
        // setEndDate(null);
        // setSelectedVendorId(null);
        // setSelectedPlan(null);
        break;
      case "Tab4":
        setCampainPlanData([]);
        setStartDate(null);
        setEndDate(null);
        setSelectedData([]);
        // setShortCodes([]);
        // setSelectedPlan(null);
        break;
      default:
        break;
    }
  };

  let columns = [
    {
      name: "S.No",
      key: "Sr.No",
      width: 40,
      renderRowCell: (row, index) => index + 1,
    },
    {
      name: "Platform",
      key: "platform_name",
      editable: true,
      renderRowCell: (row) => {
        return formatString(row?.platform_name);
      },
      customEditElement: (
        row,
        index,
        setEditFlag,
        editflag,
        handelchange,
        column
      ) => {
        // setPlatformName(row.platform_name);
        return (
          <CustomSelect
            fieldGrid={12}
            dataArray={pmsPlatform.data || []}
            optionId={"_id"}
            optionLabel={"platform_name"}
            selectedId={platform?._id}
            setSelectedId={(val) => {
              const selectedOption = pmsPlatform.data.find(
                (option) => option._id === val
              );
              if (!selectedOption) return;

              const selectedData = {
                _id: selectedOption._id,
                platform_name: selectedOption.platform_name,
              };
              const platformData = {
                platform_name: selectedOption.platform_name,
              };
              prevPlatformName.current = row?.platform_name;
              setPlatform(selectedData);
              handelchange(platformData, index, column, true);
            }}
          />
        );
      },
      width: 300,
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 200,
      renderRowCell: (row) => formatString(row?.owner_info?.username),
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
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <Autocomplete
              options={
                Array.isArray(allPages?.pageData)
                  ? allPages.pageData?.filter(
                      (data) => data?.temp_vendor_id === vendorName
                    )
                  : []
              }
              getOptionLabel={(option) => option.page_name || ""}
              isOptionEqualToValue={(option, value) =>
                option?._id === value?._id
              }
              renderInput={(params) => (
                <TextField {...params} label="Page Name" variant="outlined" />
              )}
              value={
                pageName && pageName.page_name
                  ? allPages?.pageData?.find(
                      (data) => data.page_name === pageName.page_name
                    ) || null
                  : null
              }
              onChange={(event, newValue) => {
                page_id.current = newValue?._id || null;
                setPageName(newValue || null);
                const data = {
                  page_name: newValue?.page_name || "",
                };
                setVendorName(newValue?.page_name || "");
                handelchange(data, index, column, true);
              }}
            />
          </div>
        );
      },
    },
    {
      name: "Short Code",
      key: "shortCode",
      width: 100,
    },
    {
      name: "ref_link",
      key: "Link",
      width: 100,
    },

    {
      name: "Phase Date",
      key: "phaseDate1",
      // renderRowCell: (row) => formatDate(row.phaseDate)?.replace(/T.*Z/, "")?.trim(),
      renderRowCell: (row) => row.phaseDate?.replace(/T.*Z/, "")?.trim(),
      width: 200,
      compare: true,
      editable: true,
      customEditElement: (row) => {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Phase Date"
              value={phaseDate ? phaseDate : dayjs(row.phaseDate)}
              onChange={(newValue) => setPhaseDate(newValue)}
              maxDate={dayjs()}
              renderInput={(params) => <TextField {...params} fullWidth />}
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
        );
      },
    },
    {
      name: "Post Links",
      key: "postLinks",
      renderRowCell: (row) => {
        return (
          <div className="flexCenter colGap8">
            <a
              href={`https://www.instagram.com/p/${row.shortCode}`}
              className="icon-1 btn_sm"
              target="blank_"
            >
              <i className="bi bi-arrow-up-right"></i>
            </a>
            <div
              title="Copy Link"
              className="icon-1 btn_sm"
              onClick={() => {
                navigator.clipboard.writeText(row.ref_link);
                toastAlert("Link Copied");
              }}
            >
              <i className="bi bi-clipboard"></i>
            </div>
          </div>
        );
      },
      width: 100,
      compare: true,
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
              setCampaingnId(data.campaignId);
              handelchange(data, index, column, true);
            }}
          />
        );
      },
    },
    {
      name: "Vendor Name",
      key: "vendor_name",
      renderRowCell: (row) => formatString(row?.vendor_name),
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
              disabled={true}
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
      name: "Amount",
      key: "amount",
      editable: true,
      getTotal: true,
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
              type="number"
              value={price}
              onChange={(e) => {
                handelchange(e, index, column, false);
                setPrice(e.target.value);
              }}
            />
          </div>
        );
      },
      width: 150,
    },
    {
      name: "Accessibility Caption",
      key: "accessibility_caption",
      width: 150,
      editable: true,
      renderRowCell: (row) => formatString(row?.accessibility_caption),
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
      name: "Views",
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
          rel="noreferrer"
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

    {
      name: "Purchased Status",
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
              {formatString(row.audit_status)}
            </button>
          );
      },
      width: 120,
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
        if (!row?.owner_info?.username) return "#ff00009c"; // Red for missing username
        if (row.audit_status === "purchased") return "#c4fac4"; // Green for purchased
        if (row.audit_status === "audited") return "#FFA500"; // Orange for audited
        if (row.amount == 0 || row.vendor_name == "") return "#ffff008c"; // Yellow for empty amount or vendor
        return ""; // Default (no color)
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

          {editflag === index &&
            contextData &&
            contextData[66]?.view_value == 1 && (
              <button
                className="btn btn-sm cmnbtn btn-primary"
                onClick={() => handledataUpdate(row, setEditFlag)}
                title="Save"
                disabled={isUpdatingPurchasedStatus}
                // disabled={row.audit_status !== "purchased"}
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
    else if (name == "bulkUpload")
      return (
        <BulkCampaignUpdatePurchased
          selectedData={selectedData}
          refetchPlanData={refetchPlanData}
          setToggleModal={setToggleModal}
          setSelectedData={setSelectedData}
          setCampainPlanData={setCampainPlanData}
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
            className="icon-1"
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
  const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };
  const useDebouncedSetter = (setter, delay = 500) => {
    return useCallback(
      debounce((value) => {
        setter(value);
      }, delay),
      [setter, delay]
    );
  };

  // Usage
  const debouncedSetSearchQuery = useDebouncedSetter(setVendorSearchQuery);
  const debouncedSetSearchQueryForCampName = useDebouncedSetter(
    setCampaignSearchQuery
  );
  // const phaseWiseData = useMemo(() => {
  //   const phasedData = campaignPlanData?.filter((data) => {
  //     if (activeTab === "all") {
  //       return true;
  //     }
  //     return data.phaseDate === activeTab;
  //   });
  //   return phasedData;
  // }, [campaignPlanData, activeTab, fetchingPlanData, loadingPlanData]);

  // // console.log("PlanData", PlanData);
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

      {showModal && (
        <PriceUpdateModal
          selectedData={selectedData}
          price={price}
          pricePerMillion={pricePerMillion}
          onConfirm={handleConfirmUpdate}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="card">
        <div className="card-header flexCenterBetween">
          <h5 className="card-title w-100">Purchased Purchase</h5>
          <div className="tabs sm m0">
            <button
              className={
                currentTab === "Tab1" ? "active btn btn-primary" : "btn"
              }
              onClick={() => handleTabClick("Tab1")}
            >
              Campaign Wise
            </button>
            <button
              className={
                currentTab === "Tab2" ? "active btn btn-primary" : "btn"
              }
              onClick={() => handleTabClick("Tab2")}
            >
              Date Wise
            </button>
            <button
              className={
                currentTab === "Tab3" ? "active btn btn-primary" : "btn"
              }
              onClick={() => handleTabClick("Tab3")}
            >
              Vendor Wise
            </button>
            <button
              className={
                currentTab === "Tab4" ? "active btn btn-primary" : "btn"
              }
              onClick={() => handleTabClick("Tab4")}
            >
              Filter By Link
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            {
              <div className="col-lg-6 col-md-6 col-12">
                <div className="form-group">
                  {/* <label>Update Vendor</label> */}

                  <Autocomplete
                    fullWidth
                    options={vendorsList}
                    getOptionLabel={(option) => option.vendor_name}
                    value={
                      vendorsList?.find(
                        (item) => item.vendor_id === selectedVendorId
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleUpdateStatus(newValue.vendor_id);
                      } else {
                        handleUpdateStatus(null);
                      }
                    }}
                    disabled={!selectedData?.length}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Update Vendor"
                        variant="outlined"
                        onChange={(e) =>
                          debouncedSetSearchQuery(e.target.value)
                        }
                      />
                    )}
                  />
                </div>
              </div>
            }

            {currentTab === "Tab1" && (
              <Autocomplete
                sx={{ gridColumn: "span 6", width: "500px" }}
                options={
                  campaignList?.filter(
                    (data) => data?.is_sale_booking_created
                  ) || []
                }
                getOptionLabel={(option) => option?.exe_campaign_name || ""}
                value={
                  campaignList?.find((data) => data._id === selectedPlan) ||
                  null
                }
                onChange={(event, newValue) =>
                  setSelectedPlan(newValue?._id || null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Plans"
                    variant="outlined"
                    onChange={(e) =>
                      debouncedSetSearchQueryForCampName(e.target.value)
                    }
                  />
                )}
                isOptionEqualToValue={(option, value) =>
                  option._id === value?._id
                }
                clearOnEscape
              />
            )}

            {currentTab === "Tab1" && (
              <>
                <div className="col-12 mb16">
                  <button
                    className="btn btn-primary btn-sm cmnbtn"
                    onClick={handleRefetchPrice}
                    disabled={!campaignPlanData?.length > 0}
                  >
                    Fetch price of all links
                    <ArrowClockwise
                      className={priceUpdateLoading ? "animate_rotate" : ""}
                    />
                  </button>
                </div>
              </>
            )}

            {currentTab === "Tab2" && (
              <div className="col-lg-6 col-md-6 col-12">
                <Calendar
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
              </div>
            )}

            {currentTab === "Tab3" && (
              <>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="form-group">
                    {/* <label>Select Vendor</label> */}
                    <Autocomplete
                      fullWidth
                      options={vendorsList}
                      getOptionLabel={(option) =>
                        formatString(option.vendor_name)
                      }
                      value={
                        vendorsList?.find(
                          (item) => item._id === selectedVendorId
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setSelectedVendorId(newValue._id);
                          setVendorNumericId(newValue.vendor_id);
                        } else {
                          setSelectedVendorId(null);
                          setVendorNumericId(null);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Vendor"
                          variant="outlined"
                          onChange={(e) =>
                            debouncedSetSearchQuery(e.target.value)
                          }
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-12 p0">
                  <Autocomplete
                    sx={{ gridColumn: "span 6" }}
                    options={
                      campaignList?.filter(
                        (data) => data?.is_sale_booking_created
                      ) || []
                    }
                    getOptionLabel={(option) => option?.exe_campaign_name || ""}
                    value={
                      campaignList?.find((data) => data._id === selectedPlan) ||
                      null
                    }
                    onChange={(event, newValue) =>
                      setSelectedPlan(newValue?._id || null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Plans"
                        variant="outlined"
                        onChange={(e) =>
                          debouncedSetSearchQueryForCampName(e.target.value)
                        }
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value?._id
                    }
                    clearOnEscape
                  />
                </div>

                <div className="col-lg-6 col-md-6 col-12">
                  <Calendar
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                  />
                </div>

                {selectedData?.length && currentTab === "Tab3" ? (
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="row">
                      <div className="col-md-10">
                        <div className="form-group">
                          <label className="form-label">Price</label>
                          <input
                            type="text"
                            className="form-control"
                            value={price}
                            onChange={handlePriceChange}
                            placeholder="Enter price"
                          />
                        </div>
                      </div>
                      <div className="col-md-2 pl-0">
                        <button
                          className="btn cmnbtn btn-primary mt28 w-100"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}

                {currentTab === "Tab3" && (
                  <div className="col-lg-6 col-md-6 col-12">
                    <button
                      className="btn btn-primary btn-sm cmnbtn mt28"
                      onClick={handleRefetchPrice}
                      disabled={!campaignPlanData?.length > 0}
                    >
                      Fetch price of all links
                      <ArrowClockwise
                        className={priceUpdateLoading && "animate_rotate"}
                      />
                    </button>
                  </div>
                )}
                <div className="col-lg-6 col-md-6 col-12">
                  <label className="form-label d-block mb-2">Filter By</label>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="filterByDate"
                      id="filterByPhase"
                      value="phase"
                      checked={filterBy === "phase"}
                      onChange={(e) => setFilterBy(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="filterByPhase">
                      Phase Date
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="filterByDate"
                      id="filterByCreated"
                      value="created"
                      checked={filterBy === "created"}
                      onChange={(e) => setFilterBy(e.target.value)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="filterByCreated"
                    >
                      Created Date
                    </label>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-12">
                  <LinkUploadAudit
                    phaseList={phaseList}
                    token={token}
                    refetchPlanData={refetchPlanData}
                    shortCodes={shortCodes}
                    setShortCodes={setShortCodes}
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
                </div>
                {campaignPlanData?.length > 0 && (
                  <div className="col-12 mb16">
                    <button
                      title="Upload Audited Data"
                      className={`cmnbtn btn btn-sm ${
                        disableAuditUpload()
                          ? "btn-outline-primary"
                          : "btn-primary"
                      }`}
                      onClick={handleAuditedDataUpload}
                      disabled={disableAuditUpload()}
                    >
                      Record Purchase
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="col-lg-12 col-md-12 col-12">
              {currentTab === "Tab4" && (
                <LinkUploadAudit
                  phaseList={phaseList}
                  token={token}
                  refetchPlanData={refetchPlanData}
                  shortCodes={shortCodes}
                  setShortCodes={setShortCodes}
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
              )}
            </div>
          </div>
        </div>
      </div>

      {phaseList?.length > 1 && (
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
          PlanData={campaignPlanData}
        />
      )}

      <View
        // version={1}
        data={campaignPlanData}
        showTotal={true}
        // data={phaseWiseData}
        columns={columns}
        title={`Records`}
        rowSelectable={true}
        showExport={true}
        selectedData={handleSelection}
        tableName={"PlanX-execution"}
        isLoading={isFetchingPostDetails || loadingPlanData || fetchingPlanData}
        pagination={[50, 100, 200]}
        tableSelectedRows={selectedData}
        addHtml={
          <div className="flexCenterBetween colGap8 ml-auto">
            <button
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
            </button>
            <button
              title="Reload Data"
              className={`icon-1 btn_sm btn-outline-primary  ${
                fetchingPlanData && "animate_rotate"
              }`}
              onClick={fetchPlanData}
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
          </div>
        }
      />
    </>
  );
};

export default AuditPurchase;
