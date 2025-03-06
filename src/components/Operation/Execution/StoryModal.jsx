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

const StoryModal = ({ record, setToggleModal, selectedPlan }) => {
  const [storyLink, setStoryLink] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [storyImage, setStoryImage] = useState("");
  const [storyDate, setStoryDate] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedVendor, setselectedVendor] = useState({
    vendorId: "",
    vendor_id: "",
  });
  const { toastAlert, toastError } = useGlobalContext();

  const [
    addStory,
    { isLoading: storyloading, iserror: storyError, isSuccess: storySuccess },
  ] = useAddStoryDataMutation();

  const { data: vendorListData, isLoading: loading } = useGetVendorsQuery({
    skip: record == 0,
  });

  const {
    data: allPages,
    isLoading: allPagesLoading,
    isFetching: allPagesFetching,
  } = useGetAllPagessByPlatformQuery("instagram");

  const {
    data: campaignsNameWiseData,
    isLoading: campaignsNameWiseLoading,
    isError: campaignsNameWiseError,
  } = useGetExeCampaignsNameWiseDataQuery();

  const {
    refetch: refetchPlanData,
    data: PlanData,
    isFetching: fetchingPlanData,
    isSuccess: successPlanData,
    isLoading: loadingPlanData,
  } = useGetPlanByIdQuery(record === 3 ? selectedCampaign : selectedPlan);

  async function handlesStoryUplaods() {
    try {
      let data = new FormData();
      data.append("story_link", storyLink);
      data.append("image", storyImage);
      data.append("page_name", selectedPage);
      if (record == 3) {
        data.append("campaignId", selectedCampaign);
        data.append(
          "campaign_name",
          campaignsNameWiseData.find((item) => item._id == selectedCampaign)
            .exe_campaign_name
        );
        data.append("vendorId", selectedVendor.vendorId);
        data.append("vendor_name", selectedVendor.vendor_name);
        data.append("vendor_id", selectedVendor.vendor_id);
      } else {
        data.append("phaseDate", storyDate);
        data.append("campaignId", selectedPlan);
        data.append(
          "campaign_name",
          campaignsNameWiseData.find((item) => item._id == selectedPlan)
            .exe_campaign_name
        );
      }

      const res = await addStory(data);
      if (res.error) throw new Error(res.error);
      await refetchPlanData();
      setToggleModal(false);
      setStoryLink("");
      setStoryImage("");
      setStoryDate("");
      setSelectedPage("");
      setSelectedCampaign("");
      setselectedVendor({ vendorId: "", vendor_id: "" });

      toastAlert("Story Added Successfully", "success");
    } catch (error) {
      toastError("Failed to Add Story");
    }
  }
  return (
    <>
      <button className="icon-1" onClick={() => setToggleModal(false)}>
        x
      </button>
      <div className="card">
        <div className="card-body">
          <div className="row">
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
              onChange={(e) => setStoryImage(e.target.file[0])}
            />
            {record == 0 && (
              <FieldContainer
                fieldGrid={6}
                type="date"
                label="phase Date"
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
                  const data = {
                    vendorId: val,
                    vendor_id: vendorListData.find((item) => item._id == val)
                      .vendor_id,
                    vendor_name: vendorListData.find((item) => item._id == val)
                      .vendor_name,
                  };
                  setselectedVendor(data);
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

            <button
              className="btn cmnbtn btn-primary mt-4 ml-3"
              onClick={() => handlesStoryUplaods()}
            >
              Add Story
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryModal;
