import { useEffect, useMemo, useRef, useState } from "react";
// import FormContainer from "../../AdminPanel/FormContainer";
import {
  useAuditedDataUploadMutation,
  useGetAllPagessByPlatformQuery,
  useGetPlanByIdQuery,
  useGetPostDetailsBasedOnFilterMutation,
  usePostDataUpdateMutation,
  useVendorDataQuery,
} from "../Store/API/Operation/OperationApi";
import View from "../AdminPanel/Sales/Account/View/View";
import CustomSelect from "../ReusableComponents/CustomSelect";
import getDecodedToken from "../../utils/DecodedToken";
import { useGlobalContext } from "../../Context/Context";
import Modal from "react-modal";
import { formatDate } from "../../utils/formatDate";
import { useGetAllExeCampaignsQuery } from "../Store/API/Sales/ExecutionCampaignApi";
import { ArrowClockwise } from "@phosphor-icons/react";
import PageEdit from "../AdminPanel/PageMS/PageEdit";
import FieldContainer from "../AdminPanel/FieldContainer";
import PhaseTab from "../Operation/Execution/PhaseTab";
import { Autocomplete } from "@mui/lab";
import AuditedDataView from "../Operation/Execution/AuditedDataView";
import DuplicayModal from "../Operation/Execution/DuplicayModal";
import Calendar from "./Calender";
import {
  useGetVendorsWithSearchQuery,
  useRecordPurchaseMutation,
  useUpdatePurchasedStatusDataMutation,
  useUpdatePurchasedStatusVendorMutation,
} from "../Store/API/Purchase/DirectPurchaseApi";
import LinkUploadAudit from "../Operation/Execution/LinkUploadAudit";
import PriceUpdateModal from "./PriceUpdateModal";
import Swal from "sweetalert2";
import { TextField } from "@mui/material";
import { useGetPmsPlatformQuery } from "../Store/reduxBaseURL";
import { useAPIGlobalContext } from "../AdminPanel/APIContext/APIContext";

const AuditPurchase = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { contextData } = useAPIGlobalContext();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [phaseList, setPhaseList] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [toggleModal, setToggleModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [pageName, setPageName] = useState({ page_name: "" });
  const [activeTab, setActiveTab] = useState("tab1");
  const [currentTab, setcurrentTab] = useState("Tab1");
  const [platformName, setPlatformName] = useState("");
  const [campaignPlanData, setCampainPlanData] = useState();
  const [modalName, setModalName] = useState("");
  const [duplicateMsg, setDuplicateMsg] = useState(false);
  const [links, setLinks] = useState("");
  const [phaseDate, setPhaseDate] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [shortCodes, setShortCodes] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendorNumericId, setVendorNumericId] = useState(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false);

  const maxTabs = useRef(4);
  const [visibleTabs, setVisibleTabs] = useState(
    Array.from({ length: maxTabs.current }, (_, i) => i)
  );
   const { data: vendorsList, isLoading: vendorsLoading } = useGetVendorsWithSearchQuery(vendorSearchQuery.length >= 4 ? vendorSearchQuery:"" );
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const page_id = useRef(null);
  const token = getDecodedToken();
  const {
    data: campaignList,
    isFetching: fetchingCampaignList,
    isLoading: loadingCampaignList,
  } = useGetAllExeCampaignsQuery();

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

  const [updatePurchasedStatus] = useUpdatePurchasedStatusDataMutation();
  const [getPostDetailsBasedOnFilter] =
    useGetPostDetailsBasedOnFilterMutation();
  const [updatePurchasedStatusVendor, { isLoading, isError, isSuccess }] =
    useUpdatePurchasedStatusVendorMutation();

  const handleSelection = (newSelectedData) => {
    setSelectedData(newSelectedData);
  };

  const [price, setPrice] = useState("");
  const [pricePerMillion, setPricePerMillion] = useState("");

  // const handleSave = () => {
  //     // console.log("Price:", price);
  //     // handledataUpdate()
  //     selectedData.map((item)=> (handledataUpdate(item)))
  //     // console.log("Price per Million:", pricePerMillion);
  // };

  const handleSave = () => {
    setShowModal(true);
  };

  const handleConfirmUpdate = () => {
    setShowModal(false);
    selectedData.forEach((item) => {
      if (
        pricePerMillion &&
        (!item?.owner_info?.followers || pricePerMillion === "")
      ) {
        return;
      }
      handledataUpdate(item);
    });
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
              ...(startDate && { startDate }),
              ...(endDate && { endDate }),
              ...(selectedPlan && { campaignId: selectedPlan }),
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

    try {
      const response = await getPostDetailsBasedOnFilter(payload);
      setCampainPlanData(response.data.data);
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
  } = useGetPlanByIdQuery(selectedPlan, { skip: !selectedPlan });
  const [recordPurchase, { Success: recordPurcaseSuccess }] = useRecordPurchaseMutation()
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

  async function handledataUpdate(row,) {
    // console.log('row', row);
    const followerCount = row?.owner_info?.followers
      ? row.owner_info.followers / 1000000
      : 0;
    const priceMillionWise = followerCount * pricePerMillion;
    try {
      const res = await updatePurchasedStatus({
        amount: priceMillionWise
          ? Math.floor(priceMillionWise)
          : price
            ? price
            : row.amount,
        shortCode: row.shortCode,
        audit_status: row.audit_status
      });
      if (res.error) throw new Error(res.error);
      const response = await refetchPlanData();
      if (response.isSuccess && response.data) {
        setCampainPlanData(response.data);
      }
      toastAlert("Data Updated with amount " + row.amount);
      setToggleModal(false);
    } catch (err) {
      toastError("Error while Uploading");
    }
  }
  console.log("selectedData", selectedData);
  const handleUpdateStatus = async (vendorId) => {

    if (selectedData.length !== 1) {
      Swal.fire({
        title: "Invalid Selection!",
        text: "Please select only one vendor to update.",
        icon: "warning",
      });
      return;
    }

    const selectedItem = selectedData[0];

    if (selectedItem.audit_status !== "purchased") {
      Swal.fire({
        title: "Action Denied!",
        text: "The selected vendor does not have 'purchased' status.",
        icon: "warning",
      });
      return;
    }

    const sCodes = selectedItem.shortCode;

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
          shortCodes: [sCodes],
          vendor_id: vendorId,
          userId: token.id,
        });

        // Success alert
        if (response?.data?.success) {
          const response = await refetchPlanData();
          if (response.isSuccess && response.data) {
            setCampainPlanData(response.data);
          }
          Swal.fire({
            title: "Updated!",
            text: "Vendor status has been updated successfully.",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("Error updating vendor status:", error);

        // Error alert
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while updating the vendor status.",
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

  useEffect(() => {
    if (selectedPlan == null) {
      setCampainPlanData([])
    }
    if (
      selectedVendorId ||
      (startDate && endDate) ||
      selectedPlan ||
      shortCodes.length
    ) {
      fetchFilteredPosts();
    }
  }, [selectedVendorId, startDate, endDate, selectedPlan, shortCodes]);
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
        vendor_id: vendorNumericId,
        userId: token.id,
        isVendorWise: true,
      };

      const res = await recordPurchase(data);
      if (res.error) throw new Error(res.error);
      const response = await refetchPlanData();
      if (response.isSuccess && response.data) {
        setCampainPlanData(response.data);
      }
      toastAlert("Data Uploaded");
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
        setCampainPlanData([])
        setSelectedPlan(null);
        setStartDate(null);
        setEndDate(null);
        // setSelectedVendorId(null);
        // setShortCodes([]);
        break;
      case "Tab2":
        setCampainPlanData([])
        setSelectedPlan(null);
        setStartDate(null);
        setEndDate(null);
        // setShortCodes([]);
        // setSelectedPlan(null);
        // setSelectedVendorId(null);
        break;
      case "Tab3":
        setCampainPlanData([])
        setSelectedPlan(null);
        setStartDate(null);
        setEndDate(null);
        // setShortCodes([]);
        // setStartDate(null);
        // setEndDate(null);
        // setSelectedVendorId(null);
        // setSelectedPlan(null);
        break;
      case "Tab4":
        setCampainPlanData([])
        setStartDate(null);
        setEndDate(null);
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
              };
              handelchange(data, index, column, true);
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
              options={
                Array.isArray(allPages?.pageData)
                  ? allPages.pageData?.filter(
                    (data) => data?.temp_vendor_id === vendorName
                  )
                  : []
              }
              getOptionLabel={(option) => option.page_name || ""}
              // getOptionKey={(option) => option.page_name}
              renderInput={(params) => {
                return (
                  <TextField {...params} label="Page Name" variant="outlined" />
                );
              }}
              value={pageName}
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
    },
    {
      name: "Campaign name",
      key: "campaign_name",
      renderRowCell: (row) => row?.campaign_name,
      width: 100,
      compare: true,
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
              optionId={"_id"}
              optionLabel={"vendor_name"}
              selectedId={row?.vendorId}
              setSelectedId={(name) => {
                const vendorDetail = vendorsList.find(
                  (item) => item._id === name
                );
                page_id.current = vendorDetail._id;
                const vendorData = {
                  vendorId: vendorDetail._id,
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
              className={`pointer badge ${row.audit_status === "pending"
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

          {editflag === index && contextData && contextData[66]?.view_value == 1 && (
            <button
              className="btn btn-sm cmnbtn btn-primary"
              onClick={() => handledataUpdate(row)}
              title="Save"
              disabled={row.audit_status !== "purchased"}
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

  // function disableAuditUpload() {
  //   if (activeTab === "all") return true;
  //   const phaseData = PlanData?.filter((data) => data.phaseDate === activeTab);
  //   const hasPending = phaseData?.some(
  //     (data) => data.audit_status === "pending"
  //   );
  //   const allPurchased = phaseData?.every(
  //     (data) => data.audit_status === "purchased"
  //   );
  //   return hasPending || allPurchased;
  // }
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
  const phaseWiseData = useMemo(() => {
    const phasedData = campaignPlanData?.filter((data) => {
      if (activeTab === "all") {
        return true;
      }
      return data.phaseDate === activeTab;
    });
    return phasedData;
  }, [campaignPlanData, activeTab, fetchingPlanData, loadingPlanData]);

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
          <h5 className="card-title w-100">Audit Purchase</h5>
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
            {selectedData?.length ? (
              <CustomSelect
                label="Update Vendor"
                fieldGrid={6}
                dataArray={vendorsList}
                optionId="vendor_id"
                optionLabel="vendor_name"
                selectedId={selectedVendorId}
                setSelectedId={(id) => {
                  handleUpdateStatus(id);
                }}
              />
            ) : (
              ""
            )}

            {currentTab === "Tab1" && (
              <CustomSelect
                fieldGrid={6}
                dataArray={campaignList?.filter(
                  (data) => data?.is_sale_booking_created
                )}
                optionId="_id"
                optionLabel="exe_campaign_name"
                selectedId={selectedPlan}
                setSelectedId={setSelectedPlan}
                label="Plans"
                isClearable={true}
              />
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
                <div className="col-lg-6 col-md-6 col-12 p0">
                  <CustomSelect
                    label="Select Vendor"
                    fieldGrid={12}
                    dataArray={vendorsList}
                    optionId="_id"
                    optionLabel="vendor_name"
                    selectedId={selectedVendorId}
                    setSelectedId={(id) => {
                      setSelectedVendorId(id);
                      setVendorNumericId(vendorsList.find((item) => item._id == id).vendor_id)
                    }}
                    setSearchQuery={setVendorSearchQuery}

                  />
                </div>

                <div className="col-lg-6 col-md-6 col-12 p0">
                  <CustomSelect
                    fieldGrid={12}
                    dataArray={campaignList?.filter(
                      (data) => data?.is_sale_booking_created
                    )}
                    optionId="_id"
                    optionLabel="exe_campaign_name"
                    selectedId={selectedPlan}
                    setSelectedId={setSelectedPlan}
                    label="Plans"
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

                <div className="col-lg-12 col-md-12 col-12">
                  {selectedData?.length && currentTab === "Tab3" ? (
                    <div className="row">
                      <div className="col-md-11">
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
                      {/* <div className="col">
                        <div className="form-group">
                          <label className="form-label">
                            Price per Million
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={pricePerMillion}
                            onChange={(e) => setPricePerMillion(e.target.value)}
                            placeholder="Enter price per million"
                          />
                        </div>
                      </div> */}
                      <div className="col-md-1">
                        <button
                          className="btn cmnbtn btn-primary mt28 w-100"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
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
                  <button
                    title="Upload Audited Data"
                    className={`mr-3 cmnbtn btn btn-sm ${disableAuditUpload() ? "btn-outline-primary" : "btn-primary"
                      }`}
                    onClick={handleAuditedDataUpload}
                    disabled={disableAuditUpload()}
                  >
                    Record Purchase
                  </button>
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
        version={1}
        data={campaignPlanData}
        // data={phaseWiseData}
        columns={columns}
        title={`Records`}
        rowSelectable={true}
        selectedData={handleSelection}
        tableName={"PlanX-execution"}
        isLoading={loadingPlanData || fetchingPlanData}
        pagination={[50, 100, 200]}
        addHtml={
          <div className="flexCenterBetween colGap8 ml-auto">
            {/* {activeTab !== "all" && selectedPlan && (
              <button
                title="Upload Audited Data"
                className={`cmnbtn btn btn_sm btn-outline-primary`}
                onClick={handleAuditedDataUpload}
                disabled={disableAuditUpload() || AuditedUploading}
              >
                Submit
              </button>
            )} */}
            <button
              title="Reload Data"
              className={`icon-1 btn_sm btn-outline-primary  ${fetchingPlanData && "animate_rotate"
                }`}
              onClick={refetchPlanData}
            >
              <ArrowClockwise />
            </button>
          </div>
        }
      />
    </>
  );
};

export default AuditPurchase;
