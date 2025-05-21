import React, { useState } from "react";
import { useBulkCampaignUpdateMutation } from "../../Store/API/Operation/OperationApi.js";
import CustomSelect from "../../ReusableComponents/CustomSelect.jsx";
import { useGetExeCampaignsNameWiseDataQuery } from "../../Store/API/Sales/ExecutionCampaignApi.js";
import { useGlobalContext } from "../../../Context/Context.jsx";

const BulkCampaignUpdate = ({
  selectedData,
  setToggleModal,
  refetchPlanData,
  setSelectedData
}) => {
  const [SelectedCampaign, setSelectedCampaign] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
  const [
    bulkCampaignUpdate,
    {
      isLoading: bulkCampaignUpdateLoading,
      isSuccess: bulkCampaignUpdateSuccess,
    },
  ] = useBulkCampaignUpdateMutation();

  const { data: planData, isLoading: PlanDataLoading } =
    useGetExeCampaignsNameWiseDataQuery();

  async function handleBulkCampaignUpdate() {
    try {
      const data = {
        campaignId: SelectedCampaign,
        shortCodes: selectedData.map((data) => data.shortCode),
      };

      const res = await bulkCampaignUpdate(data);
      if (res.error) throw new Error(res.error);
      await refetchPlanData();
      toastAlert("Data Updated");
      setToggleModal(false);
      setSelectedData([])
    } catch (err) {
      toastError("Error Uploading Data");
    }
  }
  return (
    <>
      <div className="card" style={{ width: "500px", height: "500px" }}>
        <div className="card-header sb">
          <h5>Bulk Campaign Update</h5>
          <button className="icon-1" onClick={() => setToggleModal(false)}>
            x
          </button>
        </div>
        <div className="card-body ">
          <div className="row">
            <CustomSelect
              fieldGrid={12}
              dataArray={planData}
              label="Select Campaign"
              optionLabel="exe_campaign_name"
              optionId={"_id"}
              selectedId={SelectedCampaign}
              setSelectedId={setSelectedCampaign}
            />
          </div>
          <button
            className="btn cmnbtn btn-primary"
            onClick={handleBulkCampaignUpdate}
            disabled={bulkCampaignUpdateLoading || !SelectedCampaign}
          >
            Update
          </button>
        </div>
      </div>
    </>
  );
};

export default BulkCampaignUpdate;
