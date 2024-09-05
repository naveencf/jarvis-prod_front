import React, { useState } from "react";
import { useAddBrandCategoryTypeMutation } from "../../../Store/API/Sales/BrandCategoryTypeApi";
import { useGlobalContext } from "../../../../Context/Context";
import Loader from "../../../Finance/Loader/Loader";

const CreateBrandCategory = ({ loginUserId, closeModal }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [brandName, setBrandName] = useState("");
  const [addBrandCategoryType, { isLoading, isSuccess, isError }] =
    useAddBrandCategoryTypeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBrandCategoryType({
        brand_category_name: brandName,
        created_by: loginUserId,
      }).unwrap();
      setBrandName("");
      closeModal();
      toastAlert("Industry Category added successfully");
    } catch (err) {
      console.error("Failed to add industry category:", err);
      toastError("Failed to add industry category");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="brandName">Add Industry</label>
          <span style={{ color: "red" }}>*</span>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="form-control"
            required
          />
        </div>
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

export default CreateBrandCategory;
