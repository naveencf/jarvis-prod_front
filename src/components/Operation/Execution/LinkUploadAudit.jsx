import React, { useEffect, useRef, useState } from "react";
import {
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
} from "../../Store/API/Purchase/DirectPurchaseApi";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";

const LinkUploadAudit = ({
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
  shortCodes,
  setShortCodes,
  setModalData,
  setToggleModal,
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

  const [record, setRecord] = useState(0);
  const updatevendorTab = useRef(false);
  const [vendor, setVendor] = useState("");
  const [otherPlatform, setOtherPlatform] = useState("");
  const [selectedOpUser, setSelectedOpUser] = useState("");
  const [amount, setAmount] = useState(0);
  const [file, setFile] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const platformID = useRef(null);

  useEffect(() => {
    if (vendor) {
      platformID.current = vendorListData?.find(
        (data) => data.vendor_id == vendor
      ).vendor_platform;
    }
  }, [vendor]);

  const { data: vendorListData, isLoading: loading } = useGetVendorsQuery({
    skip: record == 0,
  });

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
        type: "share",
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
    let otherData = {
      createdBy: token.id,
      phaseDate: phaseDate,
      campaignId: selectedPlan,
      postData: otherPlatform,
    };

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
        : {
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
          };
    let newIsValid =
      record == 2
        ? {
            vendor: !vendor,
            amount: !amount,
            service_description: !serviceName,
          }
        : record == 0
        ? {
            shortCodes: !shortCodes.length > 0 || otherPlatform.length > 0,
            department: !token.dept_id,
            userId: !token.id,
            phaseDate: !phaseDate,
            campaignId: !selectedPlan,
          }
        : {
            shortCodes: !shortCodes.length > 0 || otherPlatform.length > 0,
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
      if (record == 0) {
        await uploadOtherPlatformData(otherData);
      }
      const res =
        record == 2
          ? await uploadServiceData(serviceData)
          : record == 0
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
        record &&
        res?.data?.data?.shortCodeNotPresentInCampaign?.length > 0
      ) {
        setModalName("uploadMessage");
        setModalData(res);
        setToggleModal(true);
      }
      toastAlert("Plan Uploaded");
    } catch (err) {
      toastError("Error Uploading");
    }
  }
  function isValidISO8601(str) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return isoRegex.test(str);
  }

  function CheckDuplicateInPlan() {
    const duplicate = PlanData?.filter((data) => {
      return shortCodes.includes(data.shortCode);
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
    <>
      <div className="form-group">
        <label>Filter By Links</label>
        <div className="row">
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
          {record == 1 || record == 2 ? (
            vendorListData?.length > 0 && (
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
            )
          ) : (
            <>
              {/* <div className="col-md-4">
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
              </div> */}
              {/* {phaseList?.length > 0 && (
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
              )} */}
            </>
          )}
          {record == 2 && (
            <>
              {/* <div className="col-md-6">
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
              </div> */}
            </>
          )}
          {/* {record != 2 && (
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
          )} */}
          {/* <button
            className="cmnbtn btn-primary mt-4 ml-3"
            disabled={
              record != 2
                ? notnewLine ||
                  !shortCodes.length ||
                  uploadLoading ||
                  vendorLoading
                : false || serviceLoading || vendorLoading
            }
            onClick={() => handleUpload()}
          >
            {record == 2
              ? "Add Service"
              : record == 0
              ? "Record"
              : "Update Vendor"}
          </button> */}
        </div>
      </div>

      <div className="card d-none">
        <div className="card-header">
          <div
            className={`pointer header-tab ${record == 0 && "header-active"}`}
            onClick={() => {
              setRecord(0);
            }}
          >
            Filter By Links
          </div>
          {/* <div
          className={`pointer header-tab ${record == 1 && "header-active"}`}
          onClick={() => {
            setRecord(1);
          }}
        >
          Update Vendor{" "}
        </div>
        <div
          className={`pointer header-tab ${record == 2 && "header-active"}`}
          onClick={() => {
            setRecord(2);
          }}
        >
          Service{" "}
        </div> */}
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
            {record == 1 || record == 2 ? (
              vendorListData?.length > 0 && (
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
              )
            ) : (
              <>
                {/* <div className="col-md-4">
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
              </div> */}
                {/* {phaseList?.length > 0 && (
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
              )} */}
              </>
            )}
            {record == 2 && (
              <>
                {/* <div className="col-md-6">
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
              </div> */}
              </>
            )}
            {/* {record != 2 && (
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
          )} */}
            {/* <button
            className="cmnbtn btn-primary mt-4 ml-3"
            disabled={
              record != 2
                ? notnewLine ||
                  !shortCodes.length ||
                  uploadLoading ||
                  vendorLoading
                : false || serviceLoading || vendorLoading
            }
            onClick={() => handleUpload()}
          >
            {record == 2
              ? "Add Service"
              : record == 0
              ? "Record"
              : "Update Vendor"}
          </button> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default LinkUploadAudit;
