import React, { useState } from "react";
import { useGlobalContext } from "../../Context/Context";
import { useBulkCampaignUpdateMutation } from "../Store/API/Operation/OperationApi";
import { useGetExeCampaignsNameWiseDataQuery } from "../Store/API/Sales/ExecutionCampaignApi";
import CustomSelect from "../ReusableComponents/CustomSelect";
import { useUpdatePurchasedStatusDataMutation } from "../Store/API/Purchase/DirectPurchaseApi";
import getDecodedToken from "../../utils/DecodedToken";
  
const BulkCampaignUpdatePurchased = ({
  selectedData,
  setToggleModal,
  refetchPlanData,
  setSelectedData,
  setCampainPlanData
}) => {
  const [SelectedCampaign, setSelectedCampaign] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
    const [updatePurchasedStatus, { isLoading: isUpdatingPurchasedStatus }] =
      useUpdatePurchasedStatusDataMutation();
  const [
    bulkCampaignUpdate,
    {
      isLoading: bulkCampaignUpdateLoading,
      isSuccess: bulkCampaignUpdateSuccess,
    },
  ] = useBulkCampaignUpdateMutation();
  
  const { data: planData, isLoading: PlanDataLoading } =
    useGetExeCampaignsNameWiseDataQuery();
    const token = getDecodedToken();
    async function handleBulkCampaignUpdate() {
        try {
          const requests = selectedData
            .filter((row) => row.audit_status === "purchased")
            .map((row) => {
              const payload = {
                shortCode: row.shortCode,
                updatedBy: token?.id,
                campaignId: SelectedCampaign,
                 
              };
              const filteredPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, v]) => v != null && v !== "")
              );
      
              return updatePurchasedStatus(filteredPayload);
            });
      
          const responses = await Promise.all(requests);
      
          const hasError = responses.some((res) => res?.error);
          if (hasError) throw new Error("One or more updates failed");
      
          const refetchResponse = await refetchPlanData();
          if (refetchResponse.isSuccess && refetchResponse.data) {
            setCampainPlanData(refetchResponse.data);
          }
          toastAlert("All Data Updated Successfully");
          setToggleModal(false);
          setSelectedData([]);
        } catch (err) {
          toastError("Error Uploading One or More Items");
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
        <div className="card-body">
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

export default BulkCampaignUpdatePurchased;
