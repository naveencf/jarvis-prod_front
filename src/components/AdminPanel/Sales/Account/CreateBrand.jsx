import React, { use, useEffect, useState } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import { useAddBrandMutation, useEditBrandMutation, useGetSingleBrandQuery } from "../../../Store/API/Sales/BrandApi";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import Loader from "../../../Finance/Loader/Loader";

const CreateBrand = ({
  loginUserId,
  closeModal,
  allBrandCatType,
  accountName,
  setSelectedBrand,
  setSelectedAccountType,
  // openModal,
  setSelectedCategoryParent,
  id,
  selectedBrand,
}) => {

  const { toastAlert, toastError } = useGlobalContext();
  const [selectedCategory, setSelectedCategory] = useState();
  const [brandName, setBrandName] = useState("");
  const [useAccountName, setUseAccountName] = useState(false);
  const [addBrand, { isLoading, isSuccess, isError }] = useAddBrandMutation();
  const [editBrand, { isEditLoading, isEditSuccess, isEditError }] = useEditBrandMutation();
  const { data: brandData } = useGetSingleBrandQuery(selectedBrand, { skip: !selectedBrand });

  useEffect(() => {
    if (brandData && id) {
      setBrandName(brandData.brand_name);
      setSelectedCategory(brandData.brand_category_id);
    }
  }, [brandData]);


  const handleCheckboxChange = (e) => {
    setUseAccountName(e.target.checked);
    if (e.target.checked) {
      setBrandName(accountName);
    } else {
      setBrandName("");
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("brand_name", brandName);
    formData.append("brand_category_id", selectedCategory);
    formData.append("created_by", loginUserId);

    try {
      let response
      if (id == 0)
        response = await addBrand(formData).unwrap();
      else
        response = await editBrand({ id: selectedBrand, ...formData }).unwrap();
      setSelectedCategoryParent(selectedCategory);
      setBrandName("");
      setUseAccountName(false);
      setSelectedBrand(response?.data?._id);
      // setSelectedAccountType("");
      closeModal();
      toastAlert("Brand added successfully");
    } catch (err) {
      console.error("Failed to add brand:", err);
      toastError("Failed to add brand");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="brandName">Add Brand</label>
          <span style={{ color: "red" }}>*</span>
          <input
            type="text"
            id="brandName"
            placeholder="Enter Brand"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="form-control"
            required
            disabled={useAccountName}
          />
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            id="useAccountName"
            checked={useAccountName}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="useAccountName">Use account name as brand name</label>
        </div>

        <CustomSelect
          fieldGrid={12}
          label="Industry"
          dataArray={allBrandCatType}
          optionId="_id"
          optionLabel="brand_category_name"
          selectedId={selectedCategory}
          setSelectedId={setSelectedCategory}
          required
        />

        {/* <div className="flex-row gap-2 mb28">
          <button
            type="button"
            className="btn iconBtn btn-outline-primary"
            onClick={() => openModal("brandCategory")}
          >
            +
          </button>
          <button
            type="button"
            className="btn iconBtn btn-outline-primary"
            onClick={() => openModal("viewBrandCategory")}
          >
            <i className="bi bi-eye" />
          </button>
        </div> */}
        <button
          type="submit"
          className="btn cmnbtn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {isSuccess && <p>Brand added successfully!</p>}
      {isError && <p>Failed to add brand. Please try again.</p>}
    </div>
  );
};

export default CreateBrand;
