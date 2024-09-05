import React, { useEffect, useState } from "react";
import { useAddExeCampaignMutation } from "../../../Store/API/Sales/ExecutionCampaignApi";
import { useGlobalContext } from "../../../../Context/Context";
import FieldContainer from "../../FieldContainer";
// import CustomSelect from "../../../ReusableComponents/CustomSelect";
// import { useGetAllAgenciesQuery } from "../../../Store/API/Sales/AgencyApi";

const CampaignModal = ({
  loginUserId,
  closeModal,
  selectedBrand,
  allBrands,
  setCampaignName,
}) => {
  // const {
  //   data: allAgencyData,
  //   error: allAgencyError,
  //   isLoading: allAgencyLoading
  // } = useGetAllAgenciesQuery()
  const { toastAlert, toastError } = useGlobalContext();
  const [campaignName1, setCampaignName1] = useState("");
  const [hashTag, setHashTag] = useState("");
  const [brandId, setBrandId] = useState("");
  const [userId, setUserId] = useState("");
  // const [agencyId, setAgencyId] = useState("");
  // const [campaignImage, setCampaignImage] = useState(null);
  const [addExeCampaign, { isLoading, isSuccess, isError }] =
    useAddExeCampaignMutation();

  // const handleImageChange = (e) => {
  //   setCampaignImage(e.target.files[0]);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("exe_campaign_name", campaignName1);
    formData.append("exe_hash_tag", hashTag);
    formData.append("brand_id", selectedBrand);
    formData.append("user_id", loginUserId);
    formData.append("created_by", loginUserId);

    try {
      const response = await addExeCampaign(formData).unwrap();
      setCampaignName(response?.data?._id);
      setCampaignName1("");
      setHashTag("");
      setBrandId("");
      setUserId("");
      // setAgencyId("");
      // setCampaignImage(null);
      toastAlert("Campaign added successfully");
      closeModal();
    } catch (error) {
      toastError(error.data.message);
    }
  };

  return (
    <div>
      <h2 className="mb-2">Campaign</h2>
      <hr className="mb-2" />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <FieldContainer
          fieldGrid={12}
          label={"Campaign Name"}
          placeholder={"Campaign Name"}
          type={"text"}
          id={"campaignName"}
          value={campaignName1}
          onChange={(e) => setCampaignName1(e.target.value)}
          required
          astric
        />
        <div style={{ color: "red" }} className="mb-3">
          Please ensure to add campaign name <br /> For example: <br /> 1: Movie
          / Product launch- (Movie name + Launch) <br /> 2: Brand offer sale-
          (Brand name + Winter sales, Anniversary sale etc)
        </div>
        {/* <FieldContainer
          fieldGrid={12}

          label={"Hash Tag"}
          type={"text"}
          id={"hashTag"}
          value={hashTag}
          onChange={(e) => setHashTag(e.target.value)}
          required={false}

        /> */}
        {/* {console.log(allAgencyData)} */}
        <FieldContainer
          fieldGrid={12}
          label={"Brand"}
          type={"text"}
          id={"brandId"}
          value={
            allBrands?.find((data) => data._id === selectedBrand)?.brand_name
          }
          onChange={(e) => setBrandId(selectedBrand)}
          required
          astric
          disabled
        />
        {/* <CustomSelect
          fieldGrid={12}
          label={"Agency"}
          dataArray={allAgencyData}
          optionId={"_id"}
          optionLabel={"agency_name"}
          selectedId={agencyId}
          setSelectedId={setAgencyId}

          required
          astric
        />
        <FieldContainer
          fieldGrid={12}
          label={"Campaign Image"}
          type={"file"}
          id={"campaignImage"}
          onChange={handleImageChange}
          required={false}

        />
 */}
        <button
          type="submit"
          className="btn cmnbtn btn_sm mt-2 ml-3 btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CampaignModal;
