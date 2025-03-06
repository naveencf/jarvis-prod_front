import React, { useState } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import { useEditExeCampaignMutation } from "../../../Store/API/Sales/ExecutionCampaignApi";
import { tr } from "date-fns/locale";

const EditCampaign = ({
  loginUserId,
  closeModal,
  campaignName,
  campaignList,
}) => {
  const [editedCampaign, setEditedCampaign] = useState(
    campaignList?.find((data) => data?._id === campaignName)?.exe_campaign_name
  );
  const [updateCampaignName, { isLoading, isError }] =
    useEditExeCampaignMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      exe_campaign_name: editedCampaign,
      updated_by: loginUserId,
      id: campaignName,
    };
    try {
      await updateCampaignName(payload).unwrap();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex-col gap-2">
      <FieldContainer
        fieldGrid={12}
        label={"Campaign Name"}
        value={editedCampaign}
        onChange={(e) => setEditedCampaign(e.target.value)}
        required={true}
        astric
      />
      <button
        className="btn cmnbtn btn_sm btn-primary"
        disabled={
          isLoading ||
          editedCampaign ===
          campaignList?.find((data) => data?._id === campaignName)
            ?.exe_campaign_name
        }
        onClick={(e) => handleSubmit(e)}
      >
        Submit
      </button>
    </div>
  );
};

export default EditCampaign;
