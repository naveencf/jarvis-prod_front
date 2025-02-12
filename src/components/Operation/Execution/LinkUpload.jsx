import React, { useEffect, useRef, useState } from "react";
import {
  usePlanDataUploadMutation,
  useUpdateVendorMutation,
} from "../../Store/API/Operation/OperationApi";
import FieldContainer from "../../AdminPanel/FieldContainer";
import CustomSelect from "../../ReusableComponents/CustomSelect";
import { useGlobalContext } from "../../../Context/Context";
import { useGetPmsPlatformQuery } from "../../Store/reduxBaseURL";
import { useGetVendorsQuery } from "../../Store/API/Purchase/DirectPuchaseApi";

const LinkUpload = ({
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
}) => {
  const { toastAlert, toastError } = useGlobalContext();

  const [notnewLine, setNotNewLine] = useState(false);
  const [isValid, setIsValid] = useState({
    shortCodes: false,
    department: false,
    userId: false,
    phaseDate: false,
    campaignId: false,
    vendor: false,
  });
  const [shortCodes, setShortCodes] = useState([]);
  const [record, setRecord] = useState(true);
  const [vendor, setVendor] = useState("");
  const platformID = useRef(null);

  console.log(record);

  useEffect(() => {
    if (vendor) {
      platformID.current = vendorListData?.find(
        (data) => data.vendor_id == vendor
      ).vendor_platform;
    }
  }, [vendor]);

  const { data: vendorListData, isLoading: loading } = useGetVendorsQuery({
    skip: record,
  });

  const {
    data: pmsPlatformData,
    isLoading: pmsPlatformLoading,
    error: pmsPlatformError,
  } = useGetPmsPlatformQuery({ skip: record });

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

  useEffect(() => {
    checkLinksForErrors();
    setShortCodes(extractShortCodes());
  }, [links]);

  const generateShortCode = () => {
    if (!links) return [];
    const uniqueLinks = Array.from(
      new Set(links.split("\n").filter((link) => link.startsWith("https")))
    );
    return uniqueLinks;
  };

  const extractShortCodes = () => {
    const uniqueLinks = generateShortCode();
    const shortCodes = uniqueLinks
      .map((link) => {
        const match = link.match(/\/(reel|p)\/([A-Za-z0-9-_]+)/);
        return match ? match[2] : null;
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

  async function handleUpload() {
    let Data = record
      ? {
          shortCodes: shortCodes,
          department: token.dept_id,
          userId: token.id,
          phaseDate: phaseDate,
          campaignId: selectedPlan,
        }
      : {
          shortCodes: shortCodes,
          platform_name: pmsPlatformData?.data?.find(
            (data) => data._id == platformID.current
          ).platform_name,
          vendor_id: vendor,
        };

    let newIsValid = record
      ? {
          shortCodes: !shortCodes.length > 0,
          department: !token.dept_id,
          userId: !token.id,
          phaseDate: !phaseDate,
          campaignId: !selectedPlan,
        }
      : {
          shortCodes: !shortCodes.length > 0,
          vendor: !vendor,
        };

    setIsValid(newIsValid);

    if (Object.values(newIsValid).includes(true)) {
      return;
    }
    try {
      const res = record
        ? await uploadPlanData(Data)
        : await updateVendor(Data);

      if (res.error) throw new Error(res.error);

      await refetchPlanData();
      setLinks("");
      setPhaseDate("");
      setVendor("");
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
    if (record && phaseDate) CheckDuplicateInPlan();
  }, [shortCodes, phaseDate]);

  return (
    <div className="card">
      <div className="card-header">
        <div
          className={`pointer header-tab ${record && "header-active"}`}
          onClick={() => {
            setRecord(true);
          }}
        >
          Record Links
        </div>
        <div
          className={`pointer header-tab ${!record && "header-active"}`}
          onClick={() => {
            setRecord(false);
          }}
        >
          Direct Purchase Vendor{" "}
        </div>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <textarea
              className="text-area"
              placeholder={`Please enter the insta links here. Each link should start from a new line. \nexample: \nhttps://www.instagram.com/reel/abc123 \nhttps://www.instagram.com/p/def456sbhv`}
              value={links}
              onChange={(e) => setLinks(e.target.value)}
            />

            {notnewLine && (
              <p className="form-error">
                Please start each link from a new line
              </p>
            )}
          </div>

          {!record ? (
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

          <button
            className="cmnbtn btn-primary mt-4 ml-3"
            disabled={
              notnewLine || !shortCodes.length || uploadLoading || vendorLoading
            }
            onClick={() => handleUpload()}
          >
            {record ? "Record" : "Update Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkUpload;
