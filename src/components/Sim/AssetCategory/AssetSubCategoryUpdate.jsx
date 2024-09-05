import { useEffect, useState } from "react";
import UserNav from "../../Pantry/UserPanel/UserNav";
import FormContainer from "../../AdminPanel/FormContainer";
import FieldContainer from "../../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const AssetSubCategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert, categoryDataContext } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const [description, setDescription] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [inWarranty, setInWarranty] = useState("");
  const warranty = ["Yes", "No"];

  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(baseUrl+"get_all_asset_category")
  //     .then((res) => setCategories(res.data))
  //     .catch((error) => console.error("Error fetching categories:", error));
  // }, []);

  const getData = () => {
    axios
      .get(`${baseUrl}` + `get_single_asset_cat/${id}`)
      .then((res) => {
        const response = res.data.data;
        setSelectedCat(response[0].category_id);
        setSubCategoryName(response[0].sub_category_name);
        setInWarranty(response[0].inWarranty);
        // setDescription(response[0].description);
      })
      .catch((error) => console.error("Error fetching subcategory:", error));
  };

  useEffect(() => {
    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const decodedToken = token ? jwtDecode(token) : null;
      const loginUserId = decodedToken ? decodedToken.id : null;

      const response = await axios.put(baseUrl + "update_asset_sub_category", {
        category_id: selectedCat,
        sub_category_id: id,
        inWarranty: inWarranty,
        sub_category_name: subCategoryName,
        description: description,
        created_by: loginUserId,
        last_updated_by: loginUserId,
      });

      if (response.status === 200) {
        toastAlert("Data Updated Successfully");
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
          mainTitle="Asset Sub Category"
          title="Sub Category Update"
          handleSubmit={handleSubmit}
          buttonAccess={false}
        >
          <FieldContainer
            label="Sub Category"
            value={subCategoryName}
            astric
            onChange={(e) => setSubCategoryName(e.target.value)}
          />
          <div className="form-group col-6">
            <label className="form-label">
              Category Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={categoryDataContext.map((opt) => ({
                value: opt.category_id,
                label: opt.category_name,
              }))}
              value={{
                value: selectedCat,
                label:
                  categoryDataContext.find(
                    (cat) => cat.category_id === selectedCat
                  )?.category_name || "",
              }}
              onChange={(e) => setSelectedCat(e.value)}
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
              required
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

export default AssetSubCategoryUpdate;
