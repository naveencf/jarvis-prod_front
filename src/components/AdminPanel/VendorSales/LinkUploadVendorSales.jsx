import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useAddStoryDataMutation,
  usePlanDataUploadMutation,
  usePlanDataUploadPlatformWiseMutation,
  useUpdateVendorMutation,
} from "../../Store/API/Operation/OperationApi";
import FieldContainer from "../../AdminPanel/FieldContainer";
import CustomSelect from "../../ReusableComponents/CustomSelect";
import { useGlobalContext } from "../../../Context/Context";
import { useGetPmsPlatformQuery } from "../../Store/reduxBaseURL";
import {
  useAddServiceMutation,
  useGetVendorsQuery,
  useGetVendorsWithSearchQuery,
  useRefetchPostPriceMutation,
} from "../../Store/API/Purchase/DirectPurchaseApi";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGetExeCampaignsNameWiseDataQuery } from "../../Store/API/Sales/ExecutionCampaignApi.js";
import { Select } from "antd";
import { Campaign } from "@mui/icons-material";
import { ArrowClockwise } from "@phosphor-icons/react";
import { Autocomplete, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useAddPostStatsMutation } from "../../Store/API/VendorSale/VendorSaleApi.js";

const LinkUploadVendorSales = ({
  setLinkData,
  setActTab,
  handleFilterLinks,
  setType,
  phaseList,
  token,
  refetchPlanData,
  selectedPlan,
  PlanData,
  setDuplicateMsg,
  links,
  setLinks,
  phaseDate,
  setPhaseDate,
  setModalName,
  setModalData,
  setToggleModal,
  setSelectedPlan,
  selectedData,
  setSelectedData,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  selectedVendor,
  setSelectedVendor,
  vendorList,
  handlePriceChange,
  handleSave,
  price,
  vendorId,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [notnewLine, setNotNewLine] = useState(false);
  const { userContextData } = useAPIGlobalContext();
  const [isValid, setIsValid] = useState({
    shortCodes: false,
    department: false,
    userId: false,
    phaseDate: false,
    campaignId: false,
    vendor: false,
    amount: false,
    service_description: false,
  });
  const [functionLoading, setFunctionLoading] = useState(false);
  const [shortCodes, setShortCodes] = useState([]);
  const [record, setRecord] = useState(0);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const updatevendorTab = useRef(false);
  const [vendor, setVendor] = useState("");
  const [otherPlatform, setOtherPlatform] = useState("");
  const [selectedOpUser, setSelectedOpUser] = useState("");
  const [amount, setAmount] = useState(0);
  const [file, setFile] = useState(null);
  const [currentPlatformId, setCurrentPlatformId] = useState();
  const [serviceName, setServiceName] = useState("");
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const platformID = useRef(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // useEffect(() => {
  //   if (record == 5 && shortCodes.length > 0) {
  //     handleFilterLinks(shortCodes,record);
  //   }
  // }, [shortCodes]);

  // useEffect(() => {
  //   if (vendor) {
  //     platformID.current = vendorListData?.find(
  //       (data) => data.vendor_id == vendor
  //     ).vendor_platform;
  //   }
  // }, [vendor]);

  useEffect(() => {
    if(shortCodes.length){
        const platformName = extractPlatformName(links);
        const platformId = platformData?.find(
          (item) => item.platform_name === platformName
        )._id;
        setCurrentPlatformId(platformId)
    }
  }, [shortCodes]);


  useEffect(() => {
    if (record == 1 || record == 5) {
      let data = selectedData.map((data) => data.ref_link);
      setLinks(data.join("\n"));
    }
  }, [selectedData]);

  useEffect(() => {
    if (selectedPlan == 0 || selectedPlan == null || selectedPlan == "null") {
      setRecord(3);
    } else setRecord(0);
  }, [selectedPlan]);

  // const { data: vendorListData, isLoading: loading } = useGetVendorsQuery({
  //   skip: record == 0,
  // });

  const {
    data: campaignsNameWiseData,
    isLoading: campaignsNameWiseLoading,
    isError: campaignsNameWiseError,
  } = useGetExeCampaignsNameWiseDataQuery();

  const {
    data: pmsPlatformData,
    isLoading: pmsPlatformLoading,
    error: pmsPlatformError,
  } = useGetPmsPlatformQuery({ skip: record == 0 });

  const { data: vendorsList, isLoading: vendorsLoading } =
    useGetVendorsWithSearchQuery(vendorSearchQuery);

  const [
    uploadServiceData,
    {
      error: serviceError,
      isLoading: serviceLoading,
      isSuccess: serviceSuccess,
    },
  ] = useAddServiceMutation();

  const [
    updateVendor,
    { error: vendorError, isLoading: vendorLoading, isSuccess: vendorSuccess },
  ] = useUpdateVendorMutation();

  const [
    fetchPricing,
    {
      error: fetchPricingError,
      isLoading: fetchPricingLoading,
      isSuccess: fetchPricingSuccess,
    },
  ] = useRefetchPostPriceMutation();

  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;

  const [
    uploadPlanData,
    {
      data: uploadData,
      error: uploadError,
      isLoading: uploadLoading,
      isSuccess: uploadSuccess,
    },
  ] = usePlanDataUploadMutation();

  //   const [
  //     uploadOtherPlatformData,
  //     {
  //       isLoading: uploadOtherPlatformDataLoading,
  //       isSuccess: uploadOtherPlatformDataSuccess,
  //     },
  //   ] = usePlanDataUploadPlatformWiseMutation();

  const [addPostStats, { isLoading, isSuccess, isError }] =
    useAddPostStatsMutation();
 
  useEffect(() => {
    checkLinksForErrors();
    setShortCodes(extractShortCodes());
    setOtherPlatform(extractSocialMediaId());
  }, [links]);
  const filterDuplicateLinks = () => {
    if (!links) return [];
    const uniqueLinks = Array.from(
      new Set(links.split("\n").filter((link) => link.startsWith("https")))
    );
    return uniqueLinks;
  };

//   async function handleFetchPricing() {
//     try {
//       let payload;
//       if (selectedData.length > 0) {
//         payload = {
//           shortCodes: selectedData?.map((data) => data.shortCode),
//         };
//       } else {
//         payload = {
//           campaignId: selectedPlan,
//         };
//       }
//       let res = await fetchPricing(payload).unwrap();
//       if (res.error) throw new Error(res.error);
//       if (record == 5) handleFilterLinks();
//       else await refetchPlanData();
//       toastAlert("Pricing Fetched");
//       setSelectedData([]);
//     } catch (err) {
//       toastError("Error Fetching Pricing");
//     }
//     setSelectedData([]);
//   }

  function extractPlatformName(url) {
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split(".");

      const knownPrefixes = ["www", "m", "mobile", "en"];
      const domainParts = parts.filter((part) => !knownPrefixes.includes(part));

      const platform = domainParts[0];
      return platform;
    } catch (error) {
      return null;
    }
  }

  const extractShortCodes = () => {
    const uniqueLinks = filterDuplicateLinks();
    const shortCodes = uniqueLinks
      .map((link) => {
        const match = link.match(/\/(?:share\/)?(reel|p)\/([A-Za-z0-9-_]+)/);

        //https://www.instagram.com/reel/DGw_rSoCdLV/?igsh=MWVkYTU3dHViNWVqaw==  /\/(reel|p|share)\/([A-Za-z0-9-_]+)/
        return match
          ? {
              ref_link: link,
              shortCode: match[2],
            }
          : null;
      })
      .filter((code) => code !== null);
    return shortCodes.map((code) => code);
  };

  const checkLinksForErrors = () => {
    if (!links) return;
    const errorLinks = links
      ?.split("\n")
      .filter((link) => (link.match(/https/g) || [])?.length > 1);
    if (errorLinks.length > 0) {
      setNotNewLine(true);
    } else {
      setNotNewLine(false);
    }
  };

  function extractSocialMediaId() {
    let urls = filterDuplicateLinks();

    const platforms = [
      {
        name: "twitter",
        regex: /^https?:\/\/(www\.)?(x\.com|twitter\.com)/,
        type: "post",
      },
      {
        name: "threads",
        regex: /https?:\/\/www\.threads\.net\/@[^\/]+\/post\/([a-zA-Z0-9_-]+)/,
        type: "post",
      },
      {
        name: "facebook",
        regex: /https?:\/\/www\.facebook\.com\/share\/(?:p\/)?([a-zA-Z0-9]+)/,
        type: "post",
      },
      {
        name: "facebook",
        regex: /https?:\/\/www\.facebook\.com\/[0-9]+\/posts\/([a-zA-Z0-9]+)/,
        type: "post",
      },
      {
        name: "Facebook",
        regex:
          /https?:\/\/www\.facebook\.com\/stories\/([0-9]+)\/([a-zA-Z0-9=]+)\//,
        type: "story",
      },
    ];
    const result = [];

    for (const url of urls) {
      for (const platform of platforms) {
        const match = url.match(platform.regex);
        if (match) {
          result.push({
            platform_name: platform.name,
            postType: platform.type,
            shortCode: match.length > 2 ? match[2] : match[1],
            ref_link: url,
          });
        } else {
          continue;
        }
      }
    }

    return result;
  }

  async function handleUpload() {
    setFunctionLoading(true);
    if (record === 0) {
      if (!phaseDate) {
        toastAlert("Please Select the phase Date");
      }
    }
    let otherData = {
      userId: token.id,
      phaseDate: phaseDate,
      //   campaignId: selectedPlan,
      //   campaign_name: campaignsNameWiseData?.find(
      //     (data) => data._id == selectedPlan
      //   )?.exe_campaign_name,
    //   postData: otherPlatform,
      vendor_for_sales: vendorId,
      platform_id:  currentPlatformId,
      shortCodes:shortCodes,
      department: token.dept_id
    };
    if (record == 3) {
      otherData = {
        ...otherData,
        // vendorId: vendorListData?.find((data) => data.vendor_id == vendor)?._id,
        // vendor_name: vendorListData?.find((data) => data.vendor_id == vendor)
        //   ?.vendor_name,
        // vendor_id: vendor,
      };
      delete otherData.phaseDate;
      delete otherData.campaignId;
      delete otherData.campaign_name;
    }

    let Data =
      record == 2
        ? {
            vendor_id: vendor,
            // vendorId: vendorListData?.find((data) => data.vendor_id == vendor)
            //   ?._id,
            // vendor_name: vendorListData?.find(
            //   (data) => data.vendor_id == vendor
            // )?.vendor_name,
            amount: amount,
            service_description: serviceName,
            ref_link: links,
            campaignId: selectedPlan,
            campaign_name: campaignsNameWiseData?.find(
              (data) => data._id == selectedPlan
            ).exe_campaign_name,
            createdBy: token.id,
            record_purchase_by: token.id,
            audit_by: token.id,
            file: file,
          }
        : record == 0
        ? {
            shortCodes: shortCodes,
            department: token.dept_id,
            userId: token.id,
            phaseDate: phaseDate,
            campaignId: selectedPlan,
            manager: selectedOpUser,
          }
        : record == 1
        ? {
            dataToBeUpdate: {
              record_purchase_by: token.id,
            },
            shortCodes: [
              ...shortCodes.map((data) => data.shortCode),
              ...otherPlatform.map((data) => data.shortCode),
            ],
            platform_name: pmsPlatformData?.data?.find(
              (data) => data._id == platformID.current
            ).platform_name,
            vendor_id: vendor,
            manager: selectedOpUser,
          }
        : {
            vendor_id: vendor,
            // vendorId: vendorListData?.find((data) => data.vendor_id == vendor)
            //   ?._id,
            // vendor_name: vendorListData?.find(
            //   (data) => data.vendor_id == vendor
            // )?.vendor_name,
            shortCodes: shortCodes,
            department: token.dept_id,
            userId: token.id,
            campaignId: selectedCampaign,
            campaign_name: campaignsNameWiseData?.find(
              (data) => data._id == selectedCampaign
            )?.exe_campaign_name,
          };

    let arrData = shortCodes.length + otherPlatform.length;

    let newIsValid =
      record == 2
        ? {
            vendor: !vendor,
            amount: !amount,
            service_description: !serviceName,
          }
        : record == 0
        ? {
            shortCodes: !(arrData > 0),
            department: !token.dept_id,
            userId: !token.id,
            phaseDate: !phaseDate,
            campaignId: !selectedPlan,
          }
        : record == 1
        ? {
            shortCodes: !(arrData > 0),
            vendor: !vendor,
          }
        : {
            shortCodes: !(arrData > 0),
            vendor: !vendor,
          };

    setIsValid(newIsValid);

    if (Object.values(newIsValid).includes(true)) {
      return;
    }

    let serviceData = new FormData();
    if (record == 2)
      Object.keys(Data).forEach((key) => {
        serviceData.append(key, Data[key]);
      });

    try {
      if (record == 0 || record == 3) {
        await addPostStats(otherData);
      }
      const res =
        record == 2
          ? await uploadServiceData(serviceData)
          : record == 0 || record == 3
          ? await uploadPlanData(Data)
          : await updateVendor(Data);
      console.log("data", Data);
      if (res.error) throw new Error(res.error);
      await refetchPlanData();
      setLinks("");
      setPhaseDate("");
      setVendor("");
      setAmount(0);
      setServiceName("");
      setFile(null);
      setShortCodes([]);
      setOtherPlatform([]);

      if (
        (record == 0 || record == 3) &&
        res?.data?.data?.shortCodeNotPresentInCampaign?.length > 0
      ) {
        setModalName("uploadMessage");
        setModalData(res);
        setToggleModal(true);
      }
      toastAlert("Plan Uploaded");
    } catch (err) {
      toastError("Error Uploading");
    } finally {
      setFunctionLoading(false);
    }
  }

  // useEffect(() => {
  //   if (record == 4)
  //     vendorList.current = vendorListData?.find(
  //       (item) => item._id == selectedVendor
  //     )?.vendor_id;
  //   else vendorList.current = null;
  // }, [selectedVendor]);

  function isValidISO8601(str) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return isoRegex.test(str);
  }

  function CheckDuplicateInPlan() {
    const duplicate = PlanData?.filter((data) => {
      return shortCodes?.some((item) => item?.shortCode === data?.shortCode);
    });

    const LinksArray = Array.from(new Set((links || "").trim().split("\n")));

    let duplicateShortCodes = [];
    let NewShortCodes = [];
    let duplicateLinks = "";
    let NewLinks = "";
    if (duplicate?.length > 0) {
      duplicateShortCodes = duplicate.map((data) => data.shortCode);
      const duplicateShortCodesSet = new Set(duplicateShortCodes);
      NewShortCodes =
        shortCodes?.filter(
          (code) => !duplicateShortCodesSet.has(code.shortCode)
        ) || [];
      const matchedLinks = [];
      const unmatchedLinks = [];
      LinksArray.forEach((link) => {
        const isMatched = Array.from(duplicateShortCodesSet).some((shortcode) =>
          link.includes(shortcode)
        );
        isMatched ? matchedLinks.push(link) : unmatchedLinks.push(link);
      });
      duplicateLinks = matchedLinks.join(` \n`);
      NewLinks = unmatchedLinks.join(` \n`);
      setDuplicateMsg({
        duplicateLinks,
        NewLinks,
        NewShortCodes,
        duplicateShortCodes,
      });
    } else setDuplicateMsg(false);
  }
  const today = new Date().toISOString().split("T")[0];
  const handleUpdateStatus = async (vendorId) => {
    const shortCode = selectedData?.map((item) => item.shortCode);

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
        const paylaod = {
          shortCodes: shortCode,
          dataToBeUpdate: {
            record_purchase_by: token.id,
          },
          vendor_id: vendorId,
          // userId: token.id,
        };
        const response = await updateVendor(paylaod);

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
          setSelectedData([]);
          // if (refetchResponse.isSuccess && refetchResponse.data) {
          //   setCampainPlanData(refetchResponse.data);
          // }

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
  const debouncedSetSearchQuery = useDebouncedSetter(setVendorSearchQuery);
  useEffect(() => {
    if (record == 0 && phaseDate) CheckDuplicateInPlan();
  }, [shortCodes, phaseDate]);

  return (
    <div className="card">
      <div className="card-header">
        {!(
          selectedPlan == 0 ||
          selectedPlan == null ||
          selectedPlan == "null"
        ) && (
          <div
            className={`pointer header-tab ${record == 0 && "header-active"}`}
            onClick={() => {
              setRecord(0);
              setActTab("");
            }}
          >
            Record Links
          </div>
        )}
        {/* <div
          className={`pointer header-tab ${record == 3 && "header-active"}`}
          onClick={() => {
            setRecord(3);
            setSelectedPlan(null);
            localStorage.setItem(
              "tab",
              JSON.stringify({
                0: {
                  activeTab: "all",
                  activeTabIndex: 0,
                },
              })
            );
          }}
        >
          Add Vendor Links{" "}
        </div> */}
        {/* {
          <div
            className={`pointer header-tab ${record == 1 && "header-active"}`}
            onClick={() => {
              setRecord(1);
              setActTab("");
            }}
          >
            Update Vendor{" "}
          </div>
        } */}
        {!(
          selectedPlan == 0 ||
          selectedPlan == null ||
          selectedPlan == "null"
        ) && (
          <div
            className={`pointer header-tab ${record == 2 && "header-active"}`}
            onClick={() => {
              setRecord(2);
              setActTab("");
            }}
          >
            Service{" "}
          </div>
        )}

        {/* <div
          className={`pointer header-tab ${record == 4 && "header-active"}`}
          onClick={() => {
            setRecord(4);
            setActTab(4);
          }}
        >
          Vendor Wise Data{" "}
        </div> */}
        <div
          className={`pointer header-tab ${record == 5 && "header-active"}`}
          onClick={() => {
            setRecord(5);
            setActTab(5);
          }}
        >
          Filter by links
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          {record != 4 && (
            <div className={record == 5 ? "col-md-12" : "col-md-6"}>
              <textarea
                className="text-area"
                placeholder={
                  record !== 2
                    ? `Please enter the insta links here. Each link should start from a new line. \nexample: \nhttps://www.instagram.com/reel/abc123 \nhttps://www.instagram.com/p/def456sbhv`
                    : "Please enter the link here"
                }
                value={links}
                onChange={(e) => setLinks(e.target.value)}
              />
              {notnewLine && (
                <p className="form-error">
                  Please start each link from a new line
                </p>
              )}
            </div>
          )}
          {/* {vendorListData?.length > 0 && record != 0 && record != 5 && (
            <div className="col-md-6">
              <CustomSelect
                fieldGrid={12}
                label={"Vendor"}
                dataArray={vendorListData}
                optionId={record === 4 ? "_id" : "vendor_id"}
                optionLabel={"vendor_name"}
                selectedId={record === 4 ? selectedVendor : vendor}
                setSelectedId={(value) => {
                  record == 4 ? setSelectedVendor(value) : setVendor(value);
                  setIsValid((prev) => ({ ...prev, vendor: false }));
                }}
              />
              {isValid?.vendor && (
                <p className="form-error">Please select the vendor</p>
              )}
            </div>
          )} */}

          {record == 0 && (
            <>
              <div className="col-md-4">
                <FieldContainer
                  className="mb-3"
                  fieldGrid={12}
                  type="date"
                  label="Phase Date"
                  max={today}
                  value={
                    isValidISO8601(phaseDate)
                      ? phaseDate.replace(/T.*Z/, "")
                      : phaseDate
                  }
                  onChange={(e) => {
                    setPhaseDate(e.target.value),
                      setIsValid((prev) => ({ ...prev, phaseDate: false }));
                  }}
                />{" "}
                {isValid?.phaseDate && (
                  <p className="form-error">Please select the phase date</p>
                )}
              </div>
              {phaseList?.length > 0 && (
                <CustomSelect
                  label={"Existing Phase Date"}
                  dataArray={phaseList}
                  optionId={"value"}
                  optionLabel={"label"}
                  selectedId={phaseDate}
                  setSelectedId={(value) => {
                    setPhaseDate(value);
                  }}
                />
              )}
            </>
          )}
          {record == 2 && (
            <>
              <div className="col-md-6">
                <CustomSelect
                  fieldGrid={12}
                  label="Service Name"
                  dataArray={[
                    { lable: "Comments", value: "Comments" },
                    { lable: "Edit", value: "Edit" },
                    { lable: "Video", value: "Video" },
                    { lable: "Tweeter Trends", value: "Tweeter Trends" },
                    { lable: "Others", value: "Others" },
                  ]}
                  optionId={"value"}
                  optionLabel={"lable"}
                  selectedId={serviceName}
                  setSelectedId={(value) => {
                    setServiceName(value);
                    setIsValid((prev) => ({
                      ...prev,
                      service_description: false,
                    }));
                  }}
                />
                {isValid?.service_description && (
                  <p className="form-error">Please select the service</p>
                )}
              </div>
              <div className="col-md-4">
                <FieldContainer
                  fieldGrid={12}
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setIsValid((prev) => ({ ...prev, amount: false }));
                  }}
                />
                {isValid?.amount && (
                  <p className="form-error">Please enter amount </p>
                )}
              </div>
              <div className="col-md-4">
                <FieldContainer
                  fieldGrid={12}
                  label="Upload File"
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
              </div>
              <button
                className="btn cmnbtn btn-primary mt-4 ml-3"
                onClick={() => {
                  setToggleModal(true);
                  setModalName("multipleService");
                }}
              >
                Add Multiple Service
              </button>
            </>
          )}
          {record == 3 && campaignsNameWiseData?.length > 0 && (
            <CustomSelect
              fieldGrid={6}
              label={"Campaign"}
              dataArray={campaignsNameWiseData}
              optionId={"_id"}
              optionLabel={"exe_campaign_name"}
              selectedId={selectedCampaign}
              setSelectedId={setSelectedCampaign}
            />
          )}
          {record != 2 && record != 3 && record != 4 && record != 5 && (
            <div className="col-md-6">
              <CustomSelect
                fieldGrid={12}
                label={"Manager"}
                dataArray={userContextData}
                optionId={"user_id"}
                optionLabel={"user_name"}
                selectedId={selectedOpUser}
                setSelectedId={(value) => {
                  setSelectedOpUser(value);
                }}
              />
            </div>
          )}
          {(record == 0 || record == 3) && (
            <>
              <button
                className="btn cmnbtn btn-primary mt-4 ml-3"
                onClick={() => {
                  setToggleModal(true);
                  setModalName("storyPost");
                  setModalData(record);
                  setType("single");
                }}
              >
                Add Story
              </button>
              <button
                className="btn cmnbtn btn-primary mt-4 ml-3"
                onClick={() => {
                  setToggleModal(true);
                  setModalName("storyPost");
                  setModalData(record);
                  setType("multiple");
                }}
              >
                Add Multiple Story
              </button>
            </>
          )}

          {record == 4 && (
            <>
              <FieldContainer
                fieldGrid={6}
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
                label="Start Date"
                max={new Date().toISOString().split("T")[0]}
              />
              <FieldContainer
                fieldGrid={6}
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
                label="End Date"
                max={new Date().toISOString().split("T")[0]}
              />
            </>
          )}
          {/* {(record == 0 ||
            ((record == 4 || record == 5) && selectedData?.length > 0)) && (
            <button
              className="btn cmnbtn btn-primary mt-4 ml-3"
              onClick={() => handleFetchPricing()}
            >
              {selectedData?.length > 0
                ? "Fetch price of selected links"
                : "Fetch price of all links"}

              <ArrowClockwise
                className={fetchPricingLoading && "animate_rotate"}
              />
            </button>
          )} */}
          <button
            className="cmnbtn btn-primary mt-4 ml-3"
            disabled={
              record == 4
                ? false
                : record != 2
                ? notnewLine ||
                  !shortCodes.length ||
                  uploadLoading ||
                  vendorLoading
                : false || serviceLoading || vendorLoading
            }
            onClick={
              record == 5
                ? () => {
                    handleFilterLinks(shortCodes, record);
                  }
                : record == 4
                ? () => {
                    setSelectedVendor("");
                    setStartDate("");
                    setEndDate("");
                    setSelectedPlan((prev) => prev);
                    vendorList.current = null;
                  }
                : () => {
                    handleUpload();
                  }
            }
          >
            {record == 5 ? (
              "Search"
            ) : record == 4 ? (
              "clear"
            ) : record == 2 ? (
              <>
                {"Add Service"}
                {
                  <ArrowClockwise
                    className={serviceLoading && "animate_rotate"}
                  />
                }
              </>
            ) : record == 0 || record == 3 ? (
              "Record"
            ) : (
              "Update Vendor"
            )}
          </button>
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
                    placeholder="Update Price For Selected Links"
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
          {record == 5 && (
            <button
              className="btn-primary cmnbtn mt-4 ml-3"
              onClick={() => {
                setLinkData("");
                setActTab(null);
                setLinks("");
              }}
            >
              {" "}
              Clear
            </button>
          )}
          {
            <div className="col-lg-6 col-md-6 col-12 mt-4">
              <div className="form-group mt-1">
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
                      onChange={(e) => debouncedSetSearchQuery(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  );
};
export default LinkUploadVendorSales;
