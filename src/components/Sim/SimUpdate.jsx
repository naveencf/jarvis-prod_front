import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";
import { baseUrl } from "../../utils/config";
import titleimg from '/bg-img.png'
const SimUpdate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [assetsName, setAssetsName] = useState("");
  const [assetsID, setAssetsID] = useState("");
  const [assetsOtherID, setAssetsOtherID] = useState("");
  const [isValidcontact, setValidContact] = useState(false);
  // const [isContactTouched, setisContactTouched] = useState(false);

  const [assetType, setAssetType] = useState(null);
  const [assetsCategory, setAssetsCategory] = useState(null);
  const [subCategory, setSubCategory] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [invoiceCopy, setInvoiceCopy] = useState("");
  const [inWarranty, setInWarranty] = useState("");
  const [warrantyDate, setWarrantyDate] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");
  const [selfAuditPeriod, setSelfAuditPeriod] = useState("");
  const [selfAuditUnit, setSelfAuditUnit] = useState("");
  const [hrselfAuditPeriod, setHrSelfAuditPeriod] = useState("");
  const [hrselfAuditUnit, setHrSelfAuditUnit] = useState("");

  const [imageType, setImageType] = useState("HR");
  const [assetsImg1, setAssetsImg1] = useState("");
  const [assetsImg2, setAssetsImg2] = useState("");
  const [assetsImg3, setAssetsImg3] = useState("");
  const [assetsImg4, setAssetsImg4] = useState("");

  const [assetsValue, setAssetsValue] = useState("");
  const [assetsCurrentValue, setAssetsCurrentValue] = useState("");

  const [remark, setRemark] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [categoryData, setCategoryData] = useState([]);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [vendorData, setVendorData] = useState([]);

  const [finacialType, setFinacialType] = useState("");
  const [depreciation, setDescription] = useState(0);

  const [invoiceCopyURL, setInvoiceCopyURL] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const inWarrantyOption = ["No", "Yes"];
  const IMGType = ["HR", "User"];
  const assettype = ["New", "Old"];
  const FinacinalType = [
    "Current assets",
    "Fixed assets",
    " Tangible assets",
    "Intangible assets",
    "Operating assets",
    "Non-operating assets",
  ];
  const { id } = useParams();
  const [modalData, setModalData] = useState([]);
  const [modalName, setModalName] = useState("");

  const [brandData, setBrandData] = useState([]);
  const [brandName, setBrandName] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (brandName) {
      axios
        .get(baseUrl + `get_asset_modal_by_asset_brandId/${brandName}`)
        .then((res) => {
          setModalData(res.data);
        });
    }
  }, [brandName]);

  // All Category , subcategory and vendor api here
  const getAllCategory = () => {
    axios.get(baseUrl + "get_all_asset_category").then((res) => {
      setCategoryData(res.data.data.asset_categories);
    });
  };
  const getAllSubCategory = () => {
    if (assetsCategory) {
      axios
        .get(`${baseUrl}` + `get_single_asset_sub_category/${assetsCategory}`)
        .then((res) => {
          setSubCategoryData(res.data);
        });
    }
  };
  useEffect(() => {
    const selectedSubcat = subcategoryData.filter(
      (d) => d.sub_category_id === subCategory
    );
    if (selectedSubcat) {
      setInWarranty(selectedSubcat[0]?.inWarranty);
    }
  }, [subCategory, subcategoryData]);
  const getAllVendor = () => {
    axios.get(baseUrl + "get_all_vendor").then((res) => {
      setVendorData(res.data);
    });
  };

  // async function getModalData() {
  //   const res = await axios.get(baseUrl + "get_all_asset_modals");
  //   setModalData(res.data);
  // }
  async function getBrandData() {
    const res = await axios.get(baseUrl + "get_all_asset_brands");
    setBrandData(res.data.data);
  }
  useEffect(() => {
    const selectedCategory = categoryData.filter(
      (d) => d.category_id === assetsCategory
    );
    if (selectedCategory) {
      setSelfAuditPeriod(selectedCategory[0]?.selfAuditPeriod);
      setSelfAuditUnit(selectedCategory[0]?.selfAuditUnit);
      setHrSelfAuditPeriod(selectedCategory[0]?.hrAuditPeriod);
      setHrSelfAuditUnit(selectedCategory[0]?.hrAuditUnit);
    }
  }, [categoryData, assetsCategory]);
  useEffect(() => {
    getBrandData();
    // getModalData();
    getAllCategory();
    // getAllSubCategory();
    getAllVendor();
  }, []);

  useEffect(() => {
    getAllSubCategory();
  }, [assetsCategory]);

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_single_sim/${id}`).then((res) => {
      const fetchedData = res.data.data;
      //if (fetchedData.length > 0) {

      const {
        asset_type,
        assetsName,
        asset_id,
        assetsOtherID,
        category_id,
        sub_category_id,
        vendor_id,
        inWarranty,
        warrantyDate,
        asset_brand_id,
        asset_modal_id,
        assetsValue,
        assetsCurrentValue,
        dateOfPurchase,
        asset_financial_type,
        depreciation_percentage,
        Remarks,
        invoiceCopy,
      } = fetchedData;
      setAssetsName(assetsName);
      setAssetsID(asset_id);
      setAssetType(asset_type);
      setInvoiceCopy(invoiceCopy);
      setInvoiceCopyURL(invoiceCopy);
      // setAssetType(s_type);

      setModalName(asset_modal_id);
      setBrandName(asset_brand_id);

      setAssetsOtherID(assetsOtherID);
      setAssetsCategory(category_id);
      setSubCategory(sub_category_id);
      setVendorName(vendor_id);
      setInWarranty(inWarranty);
      setWarrantyDate(warrantyDate?.split("T")?.[0]);
      setDateOfPurchase(dateOfPurchase?.split("T")?.[0]);
      setAssetsValue(assetsValue);
      setAssetsCurrentValue(assetsCurrentValue);
      setFinacialType(asset_financial_type);
      setDescription(depreciation_percentage);
      setRemark(Remarks);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inWarranty == "Yes" && (!warrantyDate || warrantyDate == "")) {
      toastError("Warrnaty Date is Required");
      return;
    }
    if (inWarranty == "Yes" && !dateOfPurchase) {
      toastError("Date Of Purchase is Required");
      return;
    }
    if (inWarranty == "Yes" && !invoiceCopy) {
      toastError("Invoice Copy is Required");
      return;
    }
    if (!assetType || assetType == "") {
      toastError("Asset Type is Required");
      return;
    } else if (!assetsCategory || !assetsCategory.category_id == "") {
      toastError("Assets Category is required");
      return;
    } else if (!subCategory || !subCategory.sub_category_id == "") {
      toastError("Assets SubCategory is required");
      return;
    } else if (!brandName || brandName == "") {
      toastError("Brand Name is Required");
      return;
    } else if (!modalName || modalName == "") {
      toastError("Modal Name is Required");
      return;
    } else if (!assetsName || assetsName == "") {
      toastError("Asset Name is Required");
      return;
    } else if (!assetsID || assetsID === "") {
      toastError("Assets ID is required");
      return;
    } else if (!vendorName || !vendorName.vendor_id == "") {
      toastError("Vendor Name is required");
      return;
    }

    const formData = new FormData();

    formData.append("id", id);
    formData.append("assetsName", assetsName);
    formData.append("sim_no", assetsID);
    formData.append("assetsOtherID", assetsOtherID);
    formData.append("s_type", assetType);

    formData.append("asset_modal_id", modalName);
    formData.append("asset_brand_id", brandName);

    formData.append("warrantyDate", warrantyDate);
    formData.append("inWarranty", inWarranty);
    formData.append("dateOfPurchase", dateOfPurchase);
    formData.append("category_id", assetsCategory);
    formData.append("sub_category_id", subCategory);
    formData.append("vendor_id", vendorName);
    formData.append("invoiceCopy", invoiceCopy);
    formData.append("selfAuditPeriod", Number(selfAuditPeriod) || 0);
    formData.append("selfAuditUnit", selfAuditUnit);
    formData.append("hrselfAuditPeriod", Number(hrselfAuditPeriod) || 0);
    formData.append("hrselfAuditUnit", hrselfAuditUnit);
    formData.append("assetsValue", Number(assetsValue));
    formData.append("assetsCurrentValue", Number(assetsCurrentValue));
    formData.append("asset_financial_type", finacialType);
    formData.append("depreciation_percentage", Number(depreciation));
    formData.append("remark", remark);
    formData.append("created_by", loginUserId);
    formData.append("status", "Available");

    try {
      const response = await axios.put(baseUrl + "update_sim", formData);
      const imageData = new FormData();
      imageData.append("sim_id", id);
      imageData.append("uploaded_by", loginUserId);
      imageData.append("type", imageType);
      imageData.append("img1", assetsImg1);
      imageData.append("img2", assetsImg2);
      imageData.append("img3", assetsImg3);
      imageData.append("img4", assetsImg4);
      axios.put(baseUrl + "update_assets_images", imageData);

      if (response.status === 200) {
        toastAlert("Form Submitted successfully");
        setIsFormSubmitted(true);
      } else {
        toastError("Form submission failed. Please try again later.");
      }
    } catch (error) {
      toastError("Form submission failed. Please try again later.");
    }
  };

  if (isFormSubmitted) {
    return <Navigate to={`/sim-overview/${0}`} />;
  }
  const location = useLocation();
  const activeLink = location.pathname;
  return (
    <div className="master-card-css" style={{ margin: "0 0 0 10%", width: "80%" }}>
      <UserNav />
      <div className="form-heading">
      <img className="img-bg" src={titleimg} alt="" width={160} />
        <div className="form_heading_title">
          <h1>Assets Update</h1>
          <div className="pack">
            <i class="bi bi-house"></i> {activeLink.slice(1).charAt(0).toUpperCase()+ activeLink.slice(2)}
            </div>
        </div>
      </div>
      <form mainTitle="Assets" title="Assets Register" onSubmit={handleSubmit}>
        <div className="card body-padding">
          <div className="row">
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  // sx={{ width: 600 }}
                  id="combo-box-demo"
                  options={assettype}
                  value={assetType}
                  onChange={(e, newvalue) => setAssetType(newvalue)}
                  // defaultValue={assetcondition[0]}
                  renderInput={(params) => (
                    <TextField {...params} label="Asset Type" />
                  )}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={categoryData?.map((cat) => ({
                    label: cat?.category_name,
                    value: cat?.category_id,
                  }))}
                  value={
                    categoryData?.find(
                      (cat) => cat.category_id === assetsCategory
                    )?.category_name || ""
                  }
                  onChange={(e, newValue) => {
                    if (newValue != null) {
                      setAssetsCategory(newValue.value);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Assets Category *" />
                  )}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={subcategoryData?.map((sub) => ({
                    label: sub?.sub_category_name,
                    value: sub?.sub_category_id,
                  }))}
                  // value={subCategory}
                  value={
                    subcategoryData?.find(
                      (sub) => sub.sub_category_id === subCategory
                    )?.sub_category_name || ""
                  }
                  onChange={(e, newvalue) => {
                    setSubCategory(newvalue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Sub Category *" />
                  )}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={brandData.map((cat) => ({
                    label: cat.asset_brand_name,
                    value: cat._id,
                  }))}
                  value={
                    brandData?.find((brand) => brand._id === brandName)
                      ?.asset_brand_name || ""
                  }
                  onChange={(e, newvalue) => {
                    // if (newvalue != null) {
                    setBrandName(newvalue.value);
                    // }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Brand Name *" />
                  )}
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group ">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  label="Assets Name *"
                  type="text"
                  value={assetsName}
                  onChange={(e) => setAssetsName(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={modalData?.map((cat) => ({
                    label: cat?.asset_modal_name,
                    value: cat?.asset_modal_id,
                  }))}
                  value={
                    modalData?.find(
                      (modal) => modal.asset_modal_id === modalName
                    )?.asset_modal_name || ""
                  }
                  onChange={(e, newvalue) => {
                    setModalName(newvalue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Add Model *" />
                  )}
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  label="Assets ID *"
                  type="text"
                  value={assetsID}
                  onChange={(e) => setAssetsID(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  label="Assets Other ID"
                  type="text"
                  value={assetsOtherID}
                  onChange={(e) => setAssetsOtherID(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  fullWidth={true}
                  id="combo-box-demo"
                  disabled
                  options={inWarrantyOption}
                  value={inWarranty}
                  onChange={(e, newvalue) => setInWarranty(newvalue)}
                  defaultValue={inWarrantyOption[0]}
                  renderInput={(params) => (
                    <TextField {...params} label="In Warranty" />
                  )}
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="Date of Purchase"
                  type="date"
                  value={dateOfPurchase}
                  onChange={(e) => setDateOfPurchase(e.target.value)}
                  inputProps={{
                    min: today, // Restrict dates before today
                  }}
                />
              </div>
            </div>

            {inWarranty == "Yes" && (
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
                <div className="form-group">
                  <TextField
                    fullWidth={true}
                    id="outlined-basic"
                    InputLabelProps={{ shrink: true }}
                    label="Warranty Date"
                    type="date"
                    value={warrantyDate}
                    onChange={(e) => setWarrantyDate(e.target.value)}
                    inputProps={{
                      min: dateOfPurchase, // Ensure warranty date is on or after purchase date
                    }}
                  />
                </div>
              </div>
            )}

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={vendorData.map((vendor) => ({
                    label: vendor.vendor_name,
                    value: vendor.vendor_id,
                  }))}
                  value={
                    vendorData?.find(
                      (vendor) => vendor.vendor_id === vendorName
                    )?.vendor_name || ""
                  }
                  onChange={(e, newvalue) => {
                    setVendorName(newvalue.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Vendor Name *" />
                  )}
                />
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="Invoice Copy"
                  type="file"
                  onChange={(e) => setInvoiceCopy(e.target.files[0])}
                />
                <span
                  style={{
                    color: "green",
                  }}
                >
                  {invoiceCopy?.name}

                  <span style={{ color: "red" }}></span>
                  {invoiceCopyURL}
                </span>
              </div>
            </div>

            <h5 className="mb-3">User Audit</h5>
            {/* <hr className="mb-3 mt-2" /> */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  disabled={true}
                  key={selfAuditPeriod}
                  id="outlined-basic"
                  label="Self Audit Period in dasy"
                  type="number"
                  value={selfAuditPeriod}
                  onChange={(e) => setSelfAuditPeriod(e.target.value)}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  disabled={true}
                  id="outlined-basic"
                  label="Self Audit Unit"
                  value={selfAuditUnit}
                  onChange={(e) => setSelfAuditUnit(e.target.value)}
                />
              </div>
            </div>
            <hr className="mb-2" />
            <h5 className="mb-3">HR Audit</h5>
            {/* <hr className="mb-4 mt-2" /> */}

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  disabled={true}
                  fullWidth={true}
                  id="outlined-basic"
                  label="HR Self Audit Period in days"
                  type="number"
                  value={hrselfAuditPeriod}
                  onChange={(e) => setHrSelfAuditPeriod(e.target.value)}
                />
              </div>
            </div>

            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  disabled={true}
                  id="outlined-basic"
                  label="HR Self Audit Unit"
                  value={hrselfAuditUnit}
                  onChange={(e) => setHrSelfAuditUnit(e.target.value)}
                />
              </div>
            </div>

            <h5 className="mb-3">Assets Image</h5>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 1"
                  type="file"
                  onChange={(e) => setAssetsImg1(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 2"
                  type="file"
                  onChange={(e) => setAssetsImg2(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 3"
                  type="file"
                  onChange={(e) => setAssetsImg3(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  InputLabelProps={{ shrink: true }}
                  label="IMG 4"
                  type="file"
                  onChange={(e) => setAssetsImg4(e.target.files[0])}
                />
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  disabled
                  id="combo-box-demo"
                  options={IMGType}
                  value={imageType}
                  onChange={(e, newvalue) => setImageType(newvalue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Type" />
                  )}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  label="Assets Value"
                  type="number"
                  value={assetsValue}
                  // onChange={(e) => setAssetsValue(e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    setAssetsValue(value);
                    if (assetType == "New") {
                      setAssetsCurrentValue(value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  label="Assets Current Value"
                  type="number"
                  value={assetsCurrentValue}
                  onChange={(e) => setAssetsCurrentValue(e.target.value)}
                />
              </div>
            </div>
            {/* <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  label="Assets Finacial Type"
                  type="number"
                  value={finacialType}
                  onChange={(e) => setFinacialType(e.target.value)}
                />
              </div>
            </div> */}
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group form_select">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={FinacinalType}
                  value={finacialType}
                  onChange={(e, newvalue) => setFinacialType(newvalue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Assets Finacial Type" />
                  )}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  fullWidth={true}
                  id="outlined-basic"
                  label="
                  Depreciation Percentage"
                  type="number"
                  value={depreciation}
                  InputLabelProps={{ shrink: true }}
                  // onChange={(e) => setDescription(e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value <= 100) {
                      setDescription(value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <div className="form-group">
                <TextField
                  id="outlined-basic"
                  label="Remark"
                  Tag="textarea"
                  rows="3"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary">Submit</button>
          </div>
        </div>
        {/* </div> */}
      </form>
    </div>
  );
};

export default SimUpdate;
