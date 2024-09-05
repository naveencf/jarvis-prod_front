import { useState, useEffect } from "react";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import axios from "axios";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const AssetSubCategoryMaster = () => {
  const { toastAlert, toastError, categoryDataContext } = useGlobalContext();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [subCategoryName, setSubCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [inWarranty, setInWarranty] = useState("");
  const warranty = ["Yes", "No"];

  // const [categoryName, setCategoryName] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(baseUrl+"get_all_asset_category")
  //     .then((res) => {
  //       setCategoryName(res.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching categories:", error);
  //     });
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subCategoryName || subCategoryName == "") {
      return toastError("Sub Category is Mendatory");
    } else if (!selectedCat || selectedCat == "") {
      return toastError("Category is Mendatory");
    } else if (!inWarranty || inWarranty == "") {
      return toastError("In Warranty is Mendatory");
    }
    try {
      const response = await axios.post(baseUrl + "add_asset_sub_category", {
        sub_category_name: subCategoryName,
        category_id: selectedCat,
        inWarranty: inWarranty,
        description: description,
        created_by: loginUserId,
        last_updated_by: loginUserId,
      });

      toastAlert("Data posted successfully!");
      setSubCategoryName("");
      setDescription("");
      if (response.status === 200) {
        navigate("/asset/subCategory/overview");
      }
    } catch (error) {
      toastAlert(error.message);
    }
  };

  return (
    <>
      <UserNav />
      <div style={{ width: "80%", margin: "40px 0 0 10%" }}>
        <FormContainer
          mainTitle="Sub Category"
          title="Create Sub Category "
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            label="Sub Category"
            astric
            required={false}
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
          />

          <div className="form-group col-6">
            <label className="form-label">
              Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={categoryDataContext?.map((opt) => ({
                value: opt.category_id,
                label: opt.category_name,
              }))}
              value={{
                value: selectedCat,
                label:
                  categoryDataContext?.find(
                    (user) => user.category_id === selectedCat
                  )?.category_name || "",
              }}
              onChange={(e) => {
                setSelectedCat(e.value);
              }}
              required
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">
              In Warranty <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={warranty.map((option) => ({
                value: `${option}`,
                label: `${option}`,
              }))}
              value={{
                value: inWarranty,
                label: `${inWarranty}`,
              }}
              onChange={(e) => {
                setInWarranty(e.value);
              }}
              required={true}
            />
          </div>

          {/* <FieldContainer
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          /> */}
        </FormContainer>
      </div>
    </>
  );
};

export default AssetSubCategoryMaster;
