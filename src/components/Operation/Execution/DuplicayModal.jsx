import React, { useState } from "react";
import {
  usePlanDataUploadMutation,
  useUpdatePhaseDateMutation,
} from "../../Store/API/Operation/OperationApi";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { toast } from "react-toastify";
import { useGlobalContext } from "../../../Context/Context";
import FormContainer from "../../AdminPanel/FormContainer";

const DuplicayModal = ({
  duplicateMsg,
  setToggleModal,
  setLinks,
  refetchPlanData,
  phaseDate,
  setPhaseDate,
  token,
  selectedPlan,
  setModalName,
  setModalData,
  campaignName,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [isValid, setIsValid] = useState({
    shortCodes: false,
    phaseDate: false,
  });

  const [
    updatePhaseDate,
    {
      isSuccess: updateSuccess,
      isLoading: updateLoading,
      isError: updateError,
    },
  ] = useUpdatePhaseDateMutation();
  const [
    uploadPlanData,
    {
      data: uploadData,
      error: uploadError,
      isLoading: uploadLoading,
      isSuccess: uploadSuccess,
    },
  ] = usePlanDataUploadMutation();

  async function handleUploadUniqueLink(isBoth) {
    try {
      let data = {
        shortCodes: !isBoth
          ? duplicateMsg?.NewShortCodes
          : [
              ...duplicateMsg?.NewShortCodes,
              ...duplicateMsg?.duplicateShortCodes,
            ],
        department: token.dept_id,
        userId: token.id,
        phaseDate: phaseDate,
        campaignId: selectedPlan,
      };
      let newIsValid = {
        shortCodes: !data?.shortCodes.length > 0,
        phaseDate: !phaseDate,
      };

      setIsValid(newIsValid);
      if (Object.values(newIsValid).includes(true)) {
        return;
      }
      const res = await uploadPlanData(data);
      if (res.error) throw new Error(res.error);
      setLinks("");
      setPhaseDate("");
      setToggleModal(false);
      await refetchPlanData();
      if (res?.data?.data?.shortCodeNotPresentInCampaign?.length > 0) {
        setModalName("uploadMessage");
        setModalData(res);
        setToggleModal(true);
      }
      toastAlert("Unique Links Uploaded Successfully");
    } catch {
      toastError("Error in uploading Unique Links");
    }
  }

  async function handleUpdatePhaseDate() {
    try {
      let data = {
        phaseDate: phaseDate,
        shortCodes: duplicateMsg?.duplicateShortCodes,
      };

      let newIsValid = {
        phaseDate: !phaseDate,
      };
      setIsValid(newIsValid);
      if (Object.values(newIsValid).includes(true)) {
        return;
      }

      const res = await updatePhaseDate(data);
      if (res.error) throw new Error(res.error);
      setLinks(duplicateMsg.NewLinks);
      localStorage.removeItem("tab");
      await refetchPlanData();
      setToggleModal(false);
      toastAlert("Phase Date Updated Successfully");
    } catch {
      toastError("Error in updating Phase Date");
    }
  }
  return (
    <>
      <div className="icon-1 mb-2" onClick={() => setToggleModal(false)}>
        x
      </div>
      <FormContainer link={"true"} mainTitle={campaignName} />
      <div className="form-error mb-3">
        We found some duplicate links in the plan.
      </div>
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Duplicate Links</label>
              <textarea
                className="text-area"
                value={duplicateMsg.duplicateLinks}
                // onChange={(e) => setLinks(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Unique Links</label>

              <textarea
                className="text-area"
                value={duplicateMsg.NewLinks}
                // onChange={(e) => setLinks(e.target.value)}
              />
            </div>
            <div className="col-md-12">
              <FieldContainer
                fieldGrid={12}
                type="date"
                label="Phase Date"
                value={phaseDate}
                onChange={(e) => {
                  setPhaseDate(e.target.value);
                  setIsValid((prev) => ({ ...prev, phaseDate: false }));
                }}
              />
              {isValid?.phaseDate && (
                <p className="form-error">Please select the phase date</p>
              )}
            </div>

            <button
              className="btn cmnbtn btn-sm btn-primary ml-3 mr-3 mb-3"
              onClick={() => handleUpdatePhaseDate()}
              disabled={
                updateLoading || duplicateMsg.duplicateShortCodes?.length < 1
              }
            >
              Update Phase Date of Duplicate Links
            </button>

            <button
              className="btn cmnbtn btn-sm btn-primary mr-3 mb-3"
              onClick={() => handleUploadUniqueLink(false)}
              disabled={
                uploadLoading || duplicateMsg?.NewShortCodes?.length < 1
              }
            >
              Record {duplicateMsg?.NewShortCodes?.length} Unique Links
            </button>
            <button
              className="btn cmnbtn btn-sm btn-primary mr-3 mb-3"
              onClick={() => handleUploadUniqueLink(true)}
              disabled={uploadLoading}
            >
              Upload All Links
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/*
 Data = {
          shortCodes: shortCodes,
          department: token.dept_id,
          userId: token.id,
          phaseDate: phaseDate,
          campaignId: selectedPlan,
        }
*/

export default DuplicayModal;
