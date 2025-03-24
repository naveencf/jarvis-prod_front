import React, { useState } from "react";
import FieldContainer from "../../AdminPanel/FieldContainer.jsx";
import CustomSelect from "../../ReusableComponents/CustomSelect.jsx";
import { useGetExeCampaignsNameWiseDataQuery } from "../../Store/API/Sales/ExecutionCampaignApi.js";
import {
  useAddStoryDataMutation,
  useGetAllPagessByPlatformQuery,
  useGetPlanByIdQuery,
} from "../../Store/API/Operation/OperationApi.js";
import { useGetVendorsQuery } from "../../Store/API/Purchase/DirectPurchaseApi.js";
import { useGlobalContext } from "../../../Context/Context.jsx";

const StoryModal = ({
  record,
  setToggleModal,
  selectedPlan,
  type = "single",
}) => {
  const [storyLink, setStoryLink] = useState("");
  const [storyImage, setStoryImage] = useState(null);
  const [storyDate, setStoryDate] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedVendor, setselectedVendor] = useState({
    vendorId: "",
    vendor_id: "",
  });
  const [storyEntries, setStoryEntries] = useState([{ link: "", image: null }]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { toastAlert, toastError } = useGlobalContext();

  const [addStory, { isLoading: storyloading }] = useAddStoryDataMutation();

  const { data: vendorListData } = useGetVendorsQuery({ skip: record == 0 });
  const { data: allPages } = useGetAllPagessByPlatformQuery("instagram");
  const { data: campaignsNameWiseData } = useGetExeCampaignsNameWiseDataQuery();
  const { refetch: refetchPlanData, data: PlanData } = useGetPlanByIdQuery(
    record === 3 ? { id: selectedCampaign } : { id: selectedPlan }
  );

  const handleAddStoryEntry = () =>
    setStoryEntries([...storyEntries, { link: "", image: null }]);

  const handleStoryEntryChange = (index, key, value) => {
    const updatedEntries = [...storyEntries];
    updatedEntries[index][key] = value;
    setStoryEntries(updatedEntries);
  };

  const handleRemoveStoryEntry = (index) => {
    const updatedEntries = storyEntries.filter((_, i) => i !== index);
    setStoryEntries(updatedEntries);
  };

  const resetAllFields = () => {
    setStoryLink("");
    setStoryImage(null);
    setStoryDate("");
    setSelectedPage("");
    setSelectedCampaign("");
    setselectedVendor({ vendorId: "", vendor_id: "" });
    setStoryEntries([{ link: "", image: null }]);
  };

  async function handleStoryUploads() {
    try {
      if (type === "single") {
        const data = new FormData();
        data.append("story_link", storyLink);
        data.append("image", storyImage);
        data.append("page_name", selectedPage);
        if (record == 3) {
          data.append("campaignId", selectedCampaign);
          data.append(
            "campaign_name",
            campaignsNameWiseData?.find((item) => item._id == selectedCampaign)
              ?.exe_campaign_name || ""
          );
          data.append("vendorId", selectedVendor.vendorId);
          data.append("vendor_name", selectedVendor.vendor_name);
          data.append("vendor_id", selectedVendor.vendor_id);
        } else {
          data.append("phaseDate", storyDate);
          data.append("campaignId", selectedPlan);
          data.append(
            "campaign_name",
            campaignsNameWiseData?.find((item) => item._id == selectedPlan)
              ?.exe_campaign_name || ""
          );
        }
        const res = await addStory(data);
        if (res.error) throw new Error(res.error);
        await refetchPlanData();
        resetAllFields();
        toastAlert("Story Added Successfully", "success");
        setToggleModal(false);
      } else {
        setIsUploading(true);
        for (let i = 0; i < storyEntries.length; i++) {
          const entry = storyEntries[i];
          const data = new FormData();
          data.append("story_link", entry.link);
          data.append("image", entry.image);
          data.append("page_name", selectedPage);
          if (record == 3) {
            data.append("campaignId", selectedCampaign);
            data.append(
              "campaign_name",
              campaignsNameWiseData?.find(
                (item) => item._id == selectedCampaign
              )?.exe_campaign_name || ""
            );
            data.append("vendorId", selectedVendor.vendorId);
            data.append("vendor_name", selectedVendor.vendor_name);
            data.append("vendor_id", selectedVendor.vendor_id);
          } else {
            data.append("phaseDate", storyDate);
            data.append("campaignId", selectedPlan);
            data.append(
              "campaign_name",
              campaignsNameWiseData?.find((item) => item._id == selectedPlan)
                ?.exe_campaign_name || ""
            );
          }

          const res = await addStory(data);
          if (res.error) throw new Error(res.error);

          setUploadProgress(Math.round(((i + 1) / storyEntries.length) * 100));
        }
        await refetchPlanData();
        resetAllFields();
        toastAlert("All Stories Uploaded Successfully", "success");
        setToggleModal(false);
      }
    } catch (error) {
      toastError("Upload failed. Please check entries and try again.");
      setIsUploading(false);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      {!isUploading && (
        <button className="icon-1" onClick={() => setToggleModal(false)}>
          x
        </button>
      )}
      <div className="card">
        <div className="card-body">
          {isUploading ? (
            <div className="my-3">
              <p>Uploading stories... {uploadProgress}% completed</p>
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: "rgba(0, 0, 255, 0.5)",
                  }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          ) : (
            <div className="row">
              {type === "multiple" ? (
                storyEntries.map((entry, index) => (
                  <div key={index} className="row w-100">
                    <FieldContainer
                      fieldGrid={5}
                      type="text"
                      label={`Story Link ${index + 1}`}
                      value={entry.link}
                      onChange={(e) =>
                        handleStoryEntryChange(index, "link", e.target.value)
                      }
                    />
                    <FieldContainer
                      fieldGrid={4}
                      type="file"
                      label={`Image ${index + 1}`}
                      onChange={(e) =>
                        handleStoryEntryChange(
                          index,
                          "image",
                          e.target.files[0]
                        )
                      }
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        className="icon-1 mt25"
                        onClick={() => handleRemoveStoryEntry(index)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <FieldContainer
                    fieldGrid={6}
                    type="text"
                    label="Add Story Link"
                    value={storyLink}
                    onChange={(e) => setStoryLink(e.target.value)}
                  />
                  <FieldContainer
                    fieldGrid={6}
                    type="file"
                    label="Add Story Image"
                    onChange={(e) => setStoryImage(e.target.files[0])}
                  />
                </>
              )}

              {record == 0 && (
                <FieldContainer
                  fieldGrid={6}
                  type="date"
                  label="Phase Date"
                  value={storyDate}
                  onChange={(e) => setStoryDate(e.target.value)}
                />
              )}

              {record == 3 && (
                <CustomSelect
                  label={"Select Vendor"}
                  fieldGrid={6}
                  dataArray={vendorListData}
                  optionId="_id"
                  optionLabel="vendor_name"
                  selectedId={selectedVendor.vendorId}
                  setSelectedId={(val) => {
                    const vendor = vendorListData.find(
                      (item) => item._id == val
                    );
                    if (vendor) {
                      setselectedVendor({
                        vendorId: val,
                        vendor_id: vendor.vendor_id,
                        vendor_name: vendor.vendor_name,
                      });
                    }
                  }}
                />
              )}

              <CustomSelect
                disabled={record == 3 ? selectedVendor.vendorId == "" : false}
                label={"Select Page"}
                fieldGrid={6}
                dataArray={
                  record === 3
                    ? allPages?.pageData?.filter(
                        (data) =>
                          data?.temp_vendor_id === selectedVendor.vendor_id
                      )
                    : allPages?.pageData
                }
                optionId="page_name"
                optionLabel={"page_name"}
                selectedId={selectedPage}
                setSelectedId={setSelectedPage}
              />

              {record == 3 && (
                <CustomSelect
                  label={"Select Campaign"}
                  fieldGrid={6}
                  dataArray={campaignsNameWiseData}
                  optionId="_id"
                  optionLabel="exe_campaign_name"
                  selectedId={selectedCampaign}
                  setSelectedId={setSelectedCampaign}
                />
              )}

              <div className="sb w-100">
                {type !== "single" && (
                  <button
                    type="button"
                    className="btn cmnbtn btn-primary mt-4 ml-3"
                    onClick={handleAddStoryEntry}
                  >
                    Add More Story
                  </button>
                )}

                <button
                  type="button"
                  className="btn cmnbtn btn-primary mt-4 ml-3"
                  disabled={storyloading || isUploading}
                  onClick={handleStoryUploads}
                >
                  {storyloading || isUploading ? "Uploading..." : "Submit"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StoryModal;
