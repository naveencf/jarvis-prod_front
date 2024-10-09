import { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { useParams } from "react-router";
import Select from "react-select";
import "./Tagcss.css";
import { useNavigate } from "react-router-dom";
import {
  useGetAllPageCategoryQuery,
  useGetAllPageSubCategoryQuery,
  useGetAllPageListQuery,
  useGetAllProfileListQuery,
  useGetMultiplePagePriceQuery,
} from '../../Store/PageBaseURL';
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import { useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetOwnershipTypeQuery } from "../../Store/PageBaseURL";
import formatString from "../Operation/CampaignMaster/WordCapital";

const Page = () => {
  const {
    // data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery();
  const navigate = useNavigate();
  const { pageMast_id } = useParams();
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  const dispatch = useDispatch();
  const { toastAlert } = useGlobalContext();
  const [rowCount, setRowCount] = useState([
    { page_price_type_id: '', price: '' },
  ]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [priceTypeList, setPriceTypeList] = useState([]);

  const [pageName, setPageName] = useState('');
  const [link, setLink] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [platformId, setPlatformId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [tag, setTag] = useState([]);
  const [pageLevel, setPageLevel] = useState('');
  const [pageStatus, setPageStatus] = useState('');
  const [userData, setUserData] = useState([]);
  const [closeBy, setCloseBy] = useState("");
  const [pageType, setPageType] = useState("");
  const [content, setContent] = useState("");
  const [ownerType, setOwnerType] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [followCount, setFollowCount] = useState("");
  const [profileId, setProfileId] = useState("");
  const [platformActive, setPlatformActive] = useState();
  const [rate, setRate] = useState('');
  const [description, setDescription] = useState('');
  const [singlePage, setSinglePage] = useState({})

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const [priceDataNew, setPriceDataNew] = useState([]);
  const [rateType, setRateType] = useState('Fixed');

  const [engagment, setEngagment] = useState(0);
  const [singleVendor, setSingleVendor] = useState({})
  const [p_id, setP_id] = useState();

  const [allUsers, setAllUsers] = useState([]);
  const token = sessionStorage.getItem("token");

  // useEffect(() => {
  //   axios.get(baseUrl + 'get_all_users').then((res) => {
  //     setAllUsers(res.data.data);
  //   });
  // }, []);

  const PageLevels = [
    { value: 'Level 1 (High)', label: 'Level 1 (High)' },
    { value: 'Level 2 (Medium)', label: 'Level 2 (Medium)' },
    { value: 'Level 3 (Low)', label: 'Level 3 (Low)' },
  ];

  const PageStatus = [
    { value: 0, label: 'Active' },
    { value: 1, label: 'Inactive' },
    { value: 2, label: 'Disabled' },
    { value: 3, label: 'Semiactive' },
  ];

  const PageTypes = [
    { value: 'Non Adult', label: 'Non Adult' },
    { value: 'Adult', label: 'Adult' },
  ];

  const Contents = [
    { value: 'By Vendor', label: 'By Vendor' },
    { value: 'By CF', label: 'By CF' },
    { value: 'Both', label: 'Both' },
  ];

  const RateTypes = [
    { value: 'Fixed', label: 'Fixed' },
    { value: 'Variable', label: 'Variable' },
  ];

  const [variableType, setVariableType] = useState({
    value: "Per Thousand",
    label: "Per Thousand",
  });

  const getData = () => {
    axios.get(baseUrl + 'get_all_users').then((res) => {
      setUserData(res.data.data);
    });

    axios
      .get(baseUrl + `v1/pagePriceMultipleByPageId/${pageMast_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data.data,"hdssdj")
        setPriceDataNew(res.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const {
    data: category,
    error: categoryError,
    isLoading: categoryIsLoading,
  } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];

  const {
    data: subCategory,
    error: subCategoryError,
    isLoading: subCategoryIsLoading,
  } = useGetAllPageSubCategoryQuery();
  const subCategoryData = subCategory?.data || [];

  const {
    data: platform,
    error: platformError,
    isLoading: platformIsLoading,
  } = useGetPmsPlatformQuery();

  const platformData = platform?.data || [];

  const {
    data: vendor,
    error: vendorError,
    isLoading: vendorIsLoading,
  } = useGetAllVendorQuery();

  const vendorData = vendor?.data || [];

  const {
    data: profile,
    error: profileError,
    isLoading: profileIsLoading,
  } = useGetAllProfileListQuery();

  const profileData = profile?.data || [];

  // const handlePriceTypeChange = (e, index) => {
  //   rowCount[index].page_price_type_id = e.value;
  //   handleFilterPriceType();
  // };

  const handlePriceTypeChange = (e, index) => {
    const updatedRowCount = [...rowCount];
    updatedRowCount[index] = {
      ...updatedRowCount[index],
      page_price_type_id: e.value,
    };
    setRowCount(updatedRowCount);
    handleFilterPriceType();
  };

  const handlePriceChange = (e, index) => {
    const updatedRowCount = [...rowCount];
    updatedRowCount[index] = {
      ...updatedRowCount[index],
      price: e.target.value,
    };
    setRowCount(updatedRowCount);
  };

  const handleFilterPriceType = (_id) => {
    let filteredData = priceTypeList.filter((row) => {
      // Check if row's page_price_type_id exists in priceTypeList
      return !rowCount.some(
        (e) => e.page_price_type_id == row.page_price_type_id
      );
    });
    axios.delete(baseUrl + `v1/pagePriceMultiple/${_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    setFilterPriceTypeList(filteredData);
  };

  useEffect(() => {
    if (platformId) {
      setPriceTypeList([]);
      let priceData = platformData?.find(
        (role) => role?._id == platformId
      )?._id;
      axios
        .get(baseUrl + `v1/pagePriceTypesForPlatformId/${platformId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setPriceTypeList(res?.data?.data);
          // setFilterPriceTypeList(res?.data?.data);
        });
    }
  }, [platformId]);

  const addPriceRow = () => {
    if (rowCount.length > 0) {
      setRowCount((rowCount) => [
        ...rowCount,
        { page_price_type_id: '', price: '' },
      ]);
    } else {
      setRowCount([{ page_price_type_id: '', price: '' }]);
    }
  };

  const { data: priceData } = useGetMultiplePagePriceQuery(pageMast_id, {
    skip: !pageMast_id,
  });

  useEffect(() => {
    if (priceData) {
      setRowCount(priceData);
    }
  }, [priceData]);


  // console.log(isPageListLoading,"kdshk",priceTypeList)
  useEffect(() => {
    axios
      .get(baseUrl + `v1/pageMaster/${pageMast_id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = [res.data.data];
        setPlatformId(data[0].platform_id);
        setPageName(data[0].page_name);
        setLink(data[0].page_link);
        setCategoryId(data[0].page_category_id);
        setSubCategoryId(data[0].page_sub_category_id);
        // setTag(data[0].tag_category);
        const tagFilter = categoryData.filter((e) =>
          data[0].tags_page_category.includes(e._id)
        );
        setTag(
          tagFilter.map((e) => {
            return { value: e._id, label: e.page_category };
          })
        );
        // setPageLevel(data[0].page_level);
        // setPageStatus(data[0].status == 0 ? "Active" : "Inactive");
        setPageLevel(data[0].preference_level);
        setPageStatus(data[0].page_mast_status);
        setCloseBy(data[0].page_closed_by);
        setPageType(data[0].page_name_type);
        setContent(data[0].content_creation);
        setOwnerType(data[0].ownership_type);
        setVendorId(data[0].vendor_id);
        setFollowCount(data[0].followers_count);
        setProfileId(data[0].page_profile_type_id);
        const platformActive = platformData.filter((e) =>
          data[0].platform_active_on.includes(e._id)
        );
        setPlatformActive(
          platformActive.map((e) => {
            return { value: e._id, label: e.platform_name };
          })
        );
        setRate(data[0].engagment_rate);
        setRateType(data[0].rate_type);
        setEngagment(data[0]?.engagment_rate);
        setDescription(data[0].description);
        setP_id(data[0].pageMast_id);
        setSinglePage(data[0])
        // const { execounthismodels } = data[0];
        // setExecounthismodels(execounthismodels);

        axios.get(baseUrl + `v1/vendor/${singlePage.vendor_id}`,{
          headers: {
            'Content-Type':'application/json',
            Authorization: `Bearer ${token}`
          }
        }).then((res) => {
          setSingleVendor(res?.data?.data)
        })
      });
  }, [platformData]);

  const handleSubmit = async (e, flag) => {
    // console.log("first",pageStatus)
    e.preventDefault();
    if (!pageName) {
      toastAlert('Page Name is required');
      return;
    } else if (!link) {
      toastAlert('Link is required');
      return;
    } else if (!platformId) {
      toastAlert('Platform ID is required');
      return;
    } else if (!categoryId) {
      toastAlert('Category is required');
      return;
    } else if (!subCategoryId) {
      toastAlert('Sub Category is required');
      return;
    } else if (!pageLevel) {
      toastAlert('Page Level is required');
      return;
    } 
    // else if (!pageStatus) {
    //   toastAlert('Page Status is required');
    //   return;
    // } 
    else if (!closeBy) {
      toastAlert('Close by is required');
      return;
    } else if (!pageType) {
      toastAlert('Page Name Type is required');
      return;
    } else if (!content) {
      toastAlert('Content Creation is required');
      return;
    } else if (!ownerType) {
      toastAlert('Ownership type is required');
      return;
    } else if (!vendorId) {
      toastAlert('Vendor is required');
      return;
    } else if (!followCount) {
      toastAlert('Followers Count is required');
      return;
    } else if (!profileId) {
      toastAlert('Profile Type is required');
      return;
    }
    //  else if (!platformActive) {
    //   toastAlert('Platform active on is required');
    //   return;
    // }
    // else if (!rate) {
    //   toastAlert("Engagement Rate is required");
    //   return;
    // }

    const payload = {
      page_name: pageName,
      link: link,
      platform_id: platformId,
      page_category_id: categoryId,
      page_sub_category_id: subCategoryId,
      tags_page_category: tag.map((e) => e.value),
      preference_level: pageLevel,
      page_mast_status: pageStatus,
      // status: pageStatus == 'Active' ? 1 : 0,
      // page_status: pageStatus == 'Active' ? 1 : 0,
      page_closed_by: closeBy,
      page_name_type: pageType,
      content_creation: content,
      ownership_type: ownerType,
      vendor_id: vendorId,
      followers_count: followCount,
      page_profile_type_id: profileId,
      // platform_active_on: platformActive.map((e) => e.value),
      rate_type: rateType || '',
      description: description,
      updated_by: userID,
      engagment_rate: engagment || 0,
      variable_type: rateType == "Variable" ? variableType.value : null
    };

   await axios
      .put(baseUrl + `v1/pageMaster/${pageMast_id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // setIsFormSubmitted(true);
        // toastAlert("Submitted");
        const  cat_name = categoryData?.find((item) => item?._id == singlePage?.page_category_id)?.page_category;
        const payload = {
          p_id: singlePage.p_id,
          page_name: pageName,
          page_link: link,
          temp_vendor_id: singleVendor.vendor_id,
          story: singlePage.story,
          post: singlePage.post,
          both_: singlePage.both_,
          m_post_price: singlePage.m_post_price,
          m_story_price: singlePage.m_story_price,
          m_both_price: singlePage.m_both_price,
          followers_count: followCount,
          preference_level: pageLevel,
          temp_page_cat_id: cat_name
          //temp_page_cat_id: singlePage.temp_page_cat_id
        }
        axios.post(baseUrl + `node_data_to_php_update_page`,payload)
        .then(()=>{})
        .catch((err)=>{
          console.log(err)
        })

        if (flag) {
          toastAlert("Submitted");
          refetchPageList();
          navigate("/admin/pms-page-overview")
        }
        if (!flag) {
          toastAlert("Submitted");
        }
      });

    for (let i = 0; i < rowCount.length; i++) {
      let matchingObject = priceDataNew.find(obj => obj.page_price_type_id === rowCount[i].page_price_type_id);

      if (matchingObject) {
        if (matchingObject.price !== rowCount[i].price) {
          axios.put(baseUrl + `v1/pagePriceMultiple/${matchingObject._id}`, {
            price: rowCount[i].price,
          }, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          })
            .then(response => {
              console.log(`Updated object ${i} with _id ${matchingObject._id}:`, response.data);
            })
            .catch(error => {
              console.error(`Error updating object ${i} with _id ${matchingObject._id}:`, error);
            });
        }
      } else {
        rowCount[i].created_by = 229;
        rowCount[i].page_master_id = pageMast_id;
        rowCount[i].price = Number(rowCount[i].price);

        axios.post(baseUrl + `v1/pagePriceMultiple`, rowCount[i], {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            console.log(`Added new object ${i}:`, response.data);
          })
          .catch(error => {
            console.error(`Error adding new object ${i}:`, error);
          });
      }
    }
  };

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
  };

  return (
    <>
      <div>
        <button
          type="submit"
          className="btn btn-primary mt-2 btn-sm"
          style={{ width: '15%', float:'right' }}
          onClick={(e) => {
            handleSubmit(e,0);
          }}
        >
          Save
        </button>
      </div>

      <FieldContainer
        label="Page Name *"
        value={pageName}
        required={true}
        onChange={(e) => {
          setPageName(e.target.value);
          e.preventDefault();
        }}
      />

      <FieldContainer
        label="Link *"
        value={link}
        required={true}
        onChange={(e) => setLink(e.target.value)}
      />

      <div className="form-group col-6">
        <label className="form-label">
          Platform ID <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          options={platformData.map((option) => ({
            value: option._id,
            label: option.platform_name,
          }))}
          value={{
            value: platformId,
            label:
              platformData.find((role) => role._id === platformId)
                ?.platform_name || '',
          }}
          onChange={(e) => {
            setPlatformId(e.value);
          }}
        ></Select>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Category <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          options={categoryData.map((option) => ({
            value: option._id,
            label: option.page_category,
          }))}
          value={{
            value: categoryId,
            label:
              categoryData.find((role) => role._id === categoryId)
                ?.page_category || '',
          }}
          onChange={(e) => {
            setCategoryId(e.value);
          }}
        ></Select>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Sub Category <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          options={subCategoryData?.map((option) => ({
            value: option._id,
            label: option.page_sub_category,
          }))}
          value={{
            value: subCategoryId,
            label:
              subCategoryData.find((role) => role._id === subCategoryId)
                ?.page_sub_category || '',
          }}
          onChange={(e) => {
            setSubCategoryId(e.value);
          }}
        ></Select>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Tags
          {/* <sup style={{ color: "red" }}>*</sup> */}
        </label>
        <Select
          isMulti
          options={categoryData.map((option) => ({
            value: option._id,
            label: option.page_category,
          }))}
          required={false}
          value={tag}
          onChange={(e) => setTag(e)}
        ></Select>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Page Level <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          name="page level"
          options={PageLevels}
          className="basic-multi-select"
          classNamePrefix="select"
          value={PageLevels.find((option) => option.value === pageLevel)}
          onChange={(selectedOption) => setPageLevel(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Page Status <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          name="page status"
          options={PageStatus}
          className="basic-multi-select"
          classNamePrefix="select"
          value={PageStatus.find((option) => option.value === Number(pageStatus))} 
          onChange={(selectedOption) => setPageStatus(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Close by <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          options={userData.map((option) => ({
            value: option.user_id,
            label: option.user_name,
          }))}
          value={{
            value: closeBy,
            label:
              userData.find((role) => role.user_id === closeBy)?.user_name ||
              '',
          }}
          onChange={(e) => {
            setCloseBy(e.value);
          }}
        ></Select>
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Page Name Type <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          name="page name type"
          options={PageTypes}
          className="basic-multi-select"
          classNamePrefix="select"
          value={PageTypes.find((option) => option.value == pageType)}
          onChange={(selectedOption) => setPageType(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Content Creation <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          name="Content creation"
          options={Contents}
          className="basic-multi-select"
          classNamePrefix="select"
          value={Contents.find((option) => option.value == content)}
          onChange={(selectedOption) => setContent(selectedOption.value)}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Ownership Type <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          className="w-100"
          options={ownerShipData?.map((option) => ({
            value: option.company_type_name,
            label: option.company_type_name,
          }))}
          required={true}
          value={{
            value: ownerType,
            label:
              ownerShipData?.find(
                (role) => role.company_type_name === ownerType
              )?.company_type_name || '',
          }}
          onChange={(e) => {
            setOwnerType(e.value);
          }}
        />
      </div>

      <div className="form-group col-6">
        <label className="form-label">
          Vendor <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          options={vendorData.map((option) => ({
            value: option._id,
            label: formatString(option.vendor_name),
          }))}
          value={{
            value: vendorId,
            label:
              vendorData.find((role) => role._id === vendorId)?.vendor_name ||
              '',
          }}
          onChange={(e) => {
            setVendorId(e.value);
          }}
        ></Select>
      </div>
      <FieldContainer
        label="Followers Count *"
        type="number"
        value={followCount}
        required={true}
        onChange={(e) => setFollowCount(e.target.value)}
      />

      <div className="form-group col-6">
        <label className="form-label">
          Profile Type <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          options={profileData.map((option) => ({
            value: option._id,
            label: option.profile_type,
          }))}
          value={{
            value: profileId,
            label:
              profileData.find((role) => role._id === profileId)
                ?.profile_type || '',
          }}
          onChange={(e) => {
            setProfileId(e.value);
          }}
        ></Select>
      </div>

      {/* <div className="form-group col-6">
        <label className="form-label">
          Platform Active On <sup style={{ color: 'red' }}>*</sup>
        </label>
        <Select
          required={true}
          options={platformData.map((option) => ({
            value: option._id,
            label: option.platform_name,
          }))}
          isMulti
          value={platformActive}
          onChange={(e) => {
            setPlatformActive(e);
          }}
        ></Select>
      </div> */}

      <div className="col-md-6 mb16">
        <div className="form-group m0">
          <label className="form-label">
            Rate Type <sup style={{ color: 'red' }}>*</sup>
          </label>
          <Select
            options={RateTypes.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            required={true}
            value={RateTypes.find((option) => option.value == rateType)}
            onChange={(selectedOption) => { setRateType(selectedOption.value) }}
          />
        </div>
      </div>

      <div className="col-md-6 mb16">
        {rateType == "Variable" && (
          <div className="form-group m0">
            <label className="form-label">
              Variable Type <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={["Per Thousand", "Per Million"].map((option) => ({
                value: option,
                label: option,
              }))}
              required={true}
              value={{
                value: variableType.value,
                label: variableType.label,
              }}
              onChange={handleVariableTypeChange}
            />
          </div>
        )}
      </div>

      <FieldContainer
        label="Description"
        value={description}
        required={false}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="col-md-6 p0 mb16">
        <FieldContainer
          label="Engagement Rate"
          type="text"
          fieldGrid={12}
          value={engagment}
          required={false}
          onChange={(e) => {
            // if (
            //   e.target.value !== "" &&
            //   (e.target.value < 0 || isNaN(e.target.value))
            // ) {
            //   return;
            // }
            setEngagment(e.target.value);
          }}
        />
      </div>

      <div className="col-12 row">
        {rowCount &&
          rowCount.length > 0 &&
          rowCount.map((row, index) => (
            <>
              <div className="form-group col-5 row">
                <label className="form-label">
                  Price Type <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  // options={priceTypeList?.map((option) => ({
                  //   value: option?._id,
                  //   label: option?.name,
                  // }))}
                  options={priceTypeList
                    ?.filter((option) =>
                      rowCount.every(
                        (r, i) =>
                          i === index || r.page_price_type_id !== option._id
                      )
                    )
                    ?.map((option) => ({
                      value: option?._id,
                      label: option?.name,
                    }))}
                  required={true}
                  value={{
                    label: priceTypeList?.find(
                      (role) =>
                        role?._id === rowCount[index]?.page_price_type_id
                    )?.name,
                    value: rowCount[index]?.page_price_type_id,
                  }}
                  onChange={(e) => handlePriceTypeChange(e, index)}
                  isDisabled={row.price !== ''}
                />
              </div>
              <FieldContainer
                label=" Price *"
                required={true}
                type="number"
                onChange={(e) => handlePriceChange(e, index)}
                value={rowCount[index].price}
              />
              {index !== 0 && (
                <button
                  className="btn btn-sm btn-danger mt-4 ml-2 col-1 mb-3"
                  type="button"
                  onClick={() => {
                    setRowCount(
                      (prev) => prev.filter((e, i) => i !== index),
                      handleFilterPriceType(rowCount[index]._id)
                    );
                  }}
                >
                  Remove
                </button>
              )}
            </>
          ))}
        <div className="text-center">
          <button
            type="button"
            onClick={addPriceRow}
            className="btn btn-sm btn-primary"
          >
            Add Price
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <button type="submit" className="btn btn-primary mt-2 btn-sm" style={{ width: '45%' }} onClick={(e) => {
          handleSubmit(e, 1);
        }}>
          Submit
        </button>
        <button
          type="submit"
          className="btn btn-primary mt-2 btn-sm"
          style={{ width: '45%' }}
          onClick={(e) => {
            handleSubmit(e, 0);
          }}
        >
          Save
        </button>
      </div>
    </>
  );
};

const PageEdit = () => {
  const { pageMast_id } = useParams();
  const navigate = useNavigate();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  // if (isFormSubmitted) {
  //   return <Navigate to="/admin/pms-page-overview" />;
  // }

  const accordionButtons = ['Edit Page', 'Page Health', 'Performance'];

  const goBack = () => {
    navigate(-1);
  };

  const PerformanceDashboard = () => {
    return (
      <>
      </>
    );
  };

  return (
    <>
      <div
        style={{
          backgroundColor: '#52b2d6',
          width: '3%',
          padding: '7px',
          marginBottom: '10px',
          cursor: 'pointer',
        }}
      >
        <ArrowBackIcon onClick={goBack} />
      </div>
      <FormContainer
        mainTitle="Page Edit"
        title="Page Edit"
        // handleSubmit={handleSubmit}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        submitButton={true}
      >
        {activeAccordionIndex === 0 && <Page />}
        {/* {activeAccordionIndex === 1 && <PageHealth />} */}
        {activeAccordionIndex === 1 &&
          navigate(`/admin/exe-history/${pageMast_id}`)}
        {activeAccordionIndex === 2 && <PerformanceDashboard />}
      </FormContainer>
    </>
  );
};

export default PageEdit;