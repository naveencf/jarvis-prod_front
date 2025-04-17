import React, { useEffect, useRef, useState } from "react";
import {
  useAddStoryDataMutation,
  usePlanDataUploadMutation,
  usePlanDataUploadPlatformWiseMutation,
  useUpdateVendorMutation,
} from "../../../Store/API/Operation/OperationApi";
import FieldContainer from "../../../AdminPanel/FieldContainer";
import { useGetPmsPlatformQuery } from "../../../Store/reduxBaseURL";
import {
  useAddServiceMutation,
  useGetVendorsQuery,
  useRefetchPostPriceMutation,
} from "../../../Store/API/Purchase/DirectPurchaseApi";
import { useAPIGlobalContext } from "../../../AdminPanel/APIContext/APIContext";
import { useGetExeCampaignsNameWiseDataQuery } from "../../../Store/API/Sales/ExecutionCampaignApi.js";
import { Select } from "antd";
import { Campaign } from "@mui/icons-material";
import { ArrowClockwise } from "@phosphor-icons/react";
import CustomSelect from "../../../ReusableComponents/CustomSelect.jsx";
import { useGlobalContext } from "../../../../Context/Context.jsx";

const LinkUploadOperation = ({
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
  const updatevendorTab = useRef(false);
  const [vendor, setVendor] = useState("");
  const [otherPlatform, setOtherPlatform] = useState("");
  const [selectedOpUser, setSelectedOpUser] = useState("");
  const [amount, setAmount] = useState(0);
  const [file, setFile] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const platformID = useRef(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    if (vendor) {
      platformID.current = vendorListData?.find(
        (data) => data.vendor_id == vendor
      ).vendor_platform;
    }
  }, [vendor]);

  useEffect(() => {
    // console.log(selectedData);
    if (record == 1) {
      let data = selectedData.map((data) => data.ref_link);
      setLinks(data.join("\n"));
    }
  }, [selectedData]);

  useEffect(() => {
    if (selectedPlan == 0 || selectedPlan == null || selectedPlan == "null") {
      setRecord(3);
    } else setRecord(0);
  }, [selectedPlan]);

  const { data: vendorListData, isLoading: loading } = useGetVendorsQuery({
    skip: record == 0,
  });

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

  const [
    uploadPlanData,
    {
      data: uploadData,
      error: uploadError,
      isLoading: uploadLoading,
      isSuccess: uploadSuccess,
    },
  ] = usePlanDataUploadMutation();

  const [
    uploadOtherPlatformData,
    {
      isLoading: uploadOtherPlatformDataLoading,
      isSuccess: uploadOtherPlatformDataSuccess,
    },
  ] = usePlanDataUploadPlatformWiseMutation();

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

  async function handleFetchPricing() {
    try {
      let payload;
      if (selectedData.length > 0) {
        payload = {
          shortCodes: selectedData?.map((data) => data.shortCode),
        };
      } else {
        payload = {
          campaignId: selectedPlan,
        };
      }
      let res = await fetchPricing(payload).unwrap();
      if (res.error) throw new Error(res.error);
      await refetchPlanData();
      toastAlert("Pricing Fetched");
    } catch (err) {
      console.log(err);
      toastError("Error Fetching Pricing");
    }
  }

  const extractShortCodes = () => {
    const uniqueLinks = filterDuplicateLinks();
    const shortCodes = uniqueLinks
      .map((link) => {
        const match = link.match(/\/(reel|p)\/([A-Za-z0-9-_]+)/);
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
        name: "X",
        regex: /https?:\/\/x\.com\/[^\/]+\/status\/(\d+)/,
        type: "status",
      },
      {
        name: "Threads",
        regex: /https?:\/\/www\.threads\.net\/@[^\/]+\/post\/([a-zA-Z0-9_-]+)/,
        type: "post",
      },
      {
        name: "Facebook",
        regex: /https?:\/\/www\.facebook\.com\/share\/(?:p\/)?([a-zA-Z0-9]+)/,
        type: "post",
      },
      {
        name: "Facebook",
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
    let otherData = {
      createdBy: token.id,
      phaseDate: phaseDate,
      campaignId: selectedPlan,
      campaign_name: campaignsNameWiseData?.find(
        (data) => data._id == selectedPlan
      )?.exe_campaign_name,
      postData: otherPlatform,
    };
    if (record == 3) {
      otherData = {
        ...otherData,
        vendorId: vendorListData?.find((data) => data.vendor_id == vendor)?._id,
        vendor_name: vendorListData?.find((data) => data.vendor_id == vendor)
          ?.vendor_name,
        vendor_id: vendor,
      };
      delete otherData.phaseDate;
      delete otherData.campaignId;
      delete otherData.campaign_name;
    }

    let Data =
      record == 2
        ? {
          vendor_id: vendor,
          vendorId: vendorListData?.find((data) => data.vendor_id == vendor)
            ?._id,
          vendor_name: vendorListData?.find(
            (data) => data.vendor_id == vendor
          )?.vendor_name,
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
              vendorId: vendorListData?.find((data) => data.vendor_id == vendor)
                ?._id,
              vendor_name: vendorListData?.find(
                (data) => data.vendor_id == vendor
              )?.vendor_name,
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
        await uploadOtherPlatformData(otherData);
      }
      const res =
        record == 2
          ? await uploadServiceData(serviceData)
          : record == 0 || record == 3
            ? await uploadPlanData(Data)
            : await updateVendor(Data);
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

  // console.log("shortCodes", functionLoading);
  function isValidISO8601(str) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return isoRegex.test(str);
  }

  function CheckDuplicateInPlan() {
    const duplicate = PlanData?.filter((data) => {
      return shortCodes.some((item) => item?.shortCode === data?.shortCode);
    });

    const LinksArray = links.trim().split("\n");
    let duplicateShortCodes = [];
    let NewShortCodes = [];
    let duplicateLinks = "";
    let NewLinks = "";
    if (duplicate?.length > 0) {
      duplicateShortCodes = duplicate.map((data) => data.shortCode);
      NewShortCodes = shortCodes.filter(
        (code) => !duplicateShortCodes.includes(code)
      );
      const matchedLinks = [];
      const unmatchedLinks = [];
      LinksArray.forEach((link) => {
        const isMatched = duplicateShortCodes.some((shortcode) =>
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

  useEffect(() => {
    if (record == 0 && phaseDate) CheckDuplicateInPlan();
  }, [shortCodes, phaseDate]);

  return (
    <div className="card">
      <div className="card-header" >
        {!(
          selectedPlan == 0 ||
          selectedPlan == null ||
          selectedPlan == "null"
        ) && (
            <div
              className={`pointer header-tab ${record == 0 && "header-active"}`}
              onClick={() => {
                setRecord(0);
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
        </div>
        {!(
          selectedPlan == 0 ||
          selectedPlan == null ||
          selectedPlan == "null"
        ) && (
          <div
            className={`pointer header-tab ${record == 1 && "header-active"}`}
            onClick={() => {
              setRecord(1);
            }}
          >
            Update Vendor{" "}
          </div>
        )}
        {!(
          selectedPlan == 0 ||
          selectedPlan == null ||
          selectedPlan == "null"
        ) && (
          <div
            className={`pointer header-tab ${record == 2 && "header-active"}`}
            onClick={() => {
              setRecord(2);
            }}
          >
            Service{" "}
          </div>
        )} */}
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
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
          {vendorListData?.length > 0 && record != 0 && (
            <div className="col-md-6">
              <CustomSelect
                fieldGrid={12}
                label={"Vendor"}
                dataArray={vendorListData}
                optionId={"vendor_id"}
                optionLabel={"vendor_name"}
                selectedId={vendor}
                setSelectedId={(value) => {
                  setVendor(value);
                  setIsValid((prev) => ({ ...prev, vendor: false }));
                }}
              />
              {isValid?.vendor && (
                <p className="form-error">Please select the vendor</p>
              )}
            </div>
          )}

          {record == 0 && (
            <>
              <div className="col-md-4">
                <FieldContainer
                  className="mb-3"
                  fieldGrid={12}
                  type="date"
                  label="Phase Date"
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
          {record != 2 && record != 3 && (
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
          {/* {record == 0 && (
            <button
              className="btn cmnbtn btn-primary mt-4 ml-3"
              onClick={() => handleFetchPricing()}
            >
              {selectedData.length > 0
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
              (record != 2
                ? notnewLine ||
                !shortCodes.length ||
                uploadLoading ||
                vendorLoading
                : false || serviceLoading || vendorLoading) || functionLoading
            }
            onClick={() => handleUpload()}
          >
            {record == 2
              ? "Add Service"
              : record == 0 || record == 3
                ? "Record"
                : "Update Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default LinkUploadOperation;
