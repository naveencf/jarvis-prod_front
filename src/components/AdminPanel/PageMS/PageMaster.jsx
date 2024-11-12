import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AppContext, useGlobalContext } from '../../../Context/Context';
import FieldContainer from '../FieldContainer';
import FormContainer from '../FormContainer';
import { baseUrl } from '../../../utils/config';
import jwtDecode from 'jwt-decode';
import { useLocation } from 'react-router';
import Select, { components } from 'react-select';
import './Tagcss.css';
import { IconButton, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import { useDispatch, useSelector } from 'react-redux';
import {
  setModalType,
  setOpenShowAddModal,
  setOpenShowPageInfoModal,
} from '../../Store/PageMaster';
import PageAddMasterModal from './PageAddMasterModal';
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetAllProfileListQuery,
  useGetOwnershipTypeQuery,
  useGetPageByIdQuery,
  useGetPlatformPriceQuery,
  useGetAllPageSubCategoryQuery,
} from '../../Store/PageBaseURL';
import PageInfoModal from './PageInfoModal';
import {
  handleChangeVendorInfoModal,
  setShowAddVendorModal,
  setModalType as setVendorModalType,
} from '../../Store/VendorMaster';
import VendorTypeInfoModal from './VendorTypeInfoModal';
import AddVendorModal from './AddVendorModal';
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from '../../Store/reduxBaseURL';
import { useParams, useNavigate } from 'react-router';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import formatString from '../Operation/CampaignMaster/WordCapital';
import { useContext } from 'react';

const PageMaster = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const vendorDetails = {
    _id: queryParams.get('_id'),
  };

  const { pageMast_id } = useParams();
  const vendorInfoModalOpen = useSelector(
    (state) => state.vendorMaster.showVendorInfoModal
  );
  const pageInfoModlaOpen = useSelector(
    (state) => state.pageMaster.showInfoModal
  );

  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [pagequery, setpagequery] = useState('');
  const { toastAlert, toastError } = useGlobalContext();
  const [pageName, setPageName] = useState('');
  const [link, setLink] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [platformId, setPlatformId] = useState('666818824366007df1df1319');
  const [primary, setPrimary] = useState({ value: 'Yes', label: 'Yes' });
  const [categoryId, setCategoryId] = useState('');
  const [subCategoryId, setSubCategoryId] = useState('');
  const [tag, setTag] = useState([]);
  const [pageLevel, setPageLevel] = useState('');
  const [pageStatus, setPageStatus] = useState('super_active');
  const [languages, setLanguages] = useState([]);

  const [closeBy, setCloseBy] = useState("");
  const [pageType, setPageType] = useState("Non Adult");
  const [content, setContent] = useState("By CF");
  const [ownerType, setOwnerType] = useState({ value: "Vendor", label: "Vendor" });
  const [vendorId, setVendorId] = useState("");
  const [languageId, setLanguageId] = useState([]);
  const [followCount, setFollowCount] = useState('');
  const [profileId, setProfileId] = useState('');
  const [platformActive, setPlatformActive] = useState();
  const [rate, setRate] = useState('');
  const [description, setDescription] = useState('');
  const [bio, setBio] = useState('');
  const [priceTypeList, setPriceTypeList] = useState([]);
  const [filterPriceTypeList, setFilterPriceTypeList] = useState([]);
  const [activeTab, setActiveTab] = useState('666818824366007df1df1319');
  const [singleVendor, setSingleVendor] = useState({});

  const [rateType, setRateType] = useState({ value: 'Fixed', label: 'Fixed' });
  const [variableType, setVariableType] = useState({
    value: 'Per Thousand',
    label: 'Per Thousand',
  });

  const [validateFields, setValidateFields] = useState({
    pageName: false,
    link: false,
    platformId: false,
    categoryId: false,
    subCategoryId: false,
    pageLevel: false,
    pageStatus: false,
    closeBy: false,
    pageType: false,
    content: false,
    ownerType: false,
    vendorId: false,
    followCount: false,
    profileId: false,
    platformActive: false,
    description: false,
    bio: false,
    rateType: false,
    variableType: false,
    primary: false,
  });

  const handleVariableTypeChange = (selectedOption) => {
    setVariableType(selectedOption);
  };
  const [rowCount, setRowCount] = useState([
    { page_price_type_name: '', page_price_type_id: '', price: '' },
  ]);

  const dispatch = useDispatch();
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  const { data: profileData } = useGetAllProfileListQuery();
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data || [];
  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];
  const { data: subCategory } = useGetAllPageSubCategoryQuery();
  const subCategoryData = subCategory?.data || [];
  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor || [];
  const { data: singlePageData, isLoading: singlePageLoading } =
    useGetPageByIdQuery(pageMast_id, { skip: !pageMast_id });

    const {
      data: pageList,
      refetch: refetchPageList,
      isLoading: isPageListLoading,
    } = useGetAllPageListQuery({ decodedToken, userID, pagequery });
    
  const { data: platformPriceData, isLoading: isPriceLoading } =
    useGetPlatformPriceQuery();

  const [existError, setExistError] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const { usersDataContext } = useContext(AppContext);
  const getLanguage = async () => {
    try {
      const res = await axios.get(`${baseUrl}v1/get_all_page_languages`);
      setLanguages(res?.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLanguage();
  }, []);

  useEffect(() => {
    if (rowCount.length > 0) {
      let data = priceTypeList?.filter(
        (e) => !rowCount.map((row) => row.page_price_type_id).includes(e._id)
      );
      const updatedPrices = data.filter(
        (item) => item.platfrom_id == platformId
      );
      setFilterPriceTypeList(updatedPrices);
    }
  }, [rowCount, priceTypeList, platformId]);

  useEffect(() => {
    if (platformPriceData?.length > 0) {
      setPriceTypeList(platformPriceData);
      setFilterPriceTypeList(platformPriceData);
    } else {
      console.log('Condition not met');
    }
  }, [platformPriceData, isPriceLoading]);

  const PageLevels = [
    { value: 'high', label: 'Level 1 (High)', index: 0 },
    { value: 'medium', label: 'Level 2 (Medium)', index: 1 },
    { value: 'low', label: 'Level 3 (Low)', index: 2 },
  ];

  const PageStatus = [
    { value: 'super_active', label: 'Super Active' },
    { value: 'active', label: 'Active' },
    { value: 'semi_active', label: 'Semi Active' },
    { value: 'dead', label: 'Dead' },
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

  const handleAddProfileTypeClick = () => {
    dispatch(setOpenShowAddModal());
    dispatch(setModalType('Profile Type'));
  };

  const handleProfileTypeInfoClick = () => {
    dispatch(setOpenShowPageInfoModal());
    dispatch(setModalType('Profile Type Info'));
  };

  const handleAddPlatformClick = () => {
    dispatch(setShowAddVendorModal());
    dispatch(setVendorModalType('Platform'));
  };

  const handlePlatformInfoClick = () => {
    dispatch(handleChangeVendorInfoModal());
    dispatch(setVendorModalType('Platform'));
  };

  const handleOpenPageModal = (type) => {
    return () => {
      dispatch(setOpenShowAddModal());
      dispatch(setModalType(type));
    };
  };

  const handleOpenInfoModal = (type) => {
    return () => {
      dispatch(setOpenShowPageInfoModal());
      dispatch(setModalType(type));
    };
  };

  const handleRateTypeChange = (selectedOption) => {
    setRateType(selectedOption);
  };

  const handlePrimaryChange = (selectedOption) => {
    setPrimary(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pageName === '') {
      setValidateFields((prev) => ({ ...prev, pageName: true }));
    }
    if (link === '') {
      setValidateFields((prev) => ({ ...prev, link: true }));
    }
    if (platformId === '') {
      setValidateFields((prev) => ({ ...prev, platformId: true }));
    }
    if (categoryId === '') {
      setValidateFields((prev) => ({ ...prev, categoryId: true }));
    }
    if (subCategoryId === '') {
      setValidateFields((prev) => ({ ...prev, subCategoryId: true }));
    }
    if (pageLevel === '') {
      setValidateFields((prev) => ({ ...prev, pageLevel: true }));
    }
    if (pageStatus === '') {
      setValidateFields((prev) => ({ ...prev, pageStatus: true }));
    }
    if (closeBy === '') {
      setValidateFields((prev) => ({ ...prev, closeBy: true }));
    }
    if (pageType === '') {
      setValidateFields((prev) => ({ ...prev, pageType: true }));
    }
    if (content === '') {
      setValidateFields((prev) => ({ ...prev, content: true }));
    }
    if (ownerType === '') {
      setValidateFields((prev) => ({ ...prev, ownerType: true }));
    }
    if (vendorId === '') {
      setValidateFields((prev) => ({ ...prev, vendorId: true }));
    }
    if (followCount === '') {
      setValidateFields((prev) => ({ ...prev, followCount: true }));
    }
    if (profileId === '') {
      setValidateFields((prev) => ({ ...prev, profileId: true }));
    }
    if (description === '') {
      setValidateFields((prev) => ({ ...prev, description: true }));
    }
    if (bio === '') {
      setValidateFields((prev) => ({ ...prev, bio: true }));
    }
    if (rateType === '') {
      setValidateFields((prev) => ({ ...prev, rateType: true }));
    }
    // because db saving label not id of ownership


    // const convertOwnerIdToLabel =
    //   ownerShipData?.find((role) => role._id == ownerType)?.company_type_name ||
    //   "";



    if (
      pageName === '' ||
      link === '' ||
      platformId === '' ||
      categoryId === '' ||
      subCategoryId === '' ||
      pageLevel === '' ||
      pageStatus === '' ||
      closeBy === '' ||
      pageType === '' ||
      content === '' ||
      ownerType === '' ||
      vendorId === '' ||
      followCount === '' ||
      profileId === '' ||
      platformActive?.length == 0 ||
      // rate === "" ||
      rateType === '' ||
      // tag.length == 0 ||
      (rateType.value == 'Variable' && variableType === '') ||
      rowCount.some((e) => e.page_price_type_id === '' || e.price === '')
    ) {
      return toastError('Please Fill All Required Fields');
    }

    const payload = {
      page_name: pageName,
      page_link: link,
      platform_id: platformId,
      platform_name: platformData
        ?.find((res) => res._id == platformId)
        ?.platform_name?.toLowerCase(),
      page_category_id: categoryId,
      page_category_name: categoryData
        ?.find((role) => role._id === categoryId)
        ?.page_category?.toLowerCase(),
      page_sub_category_id: subCategoryId,
      page_sub_category_name: subCategoryData.find(
        (role) => role._id === subCategoryId
      )?.page_sub_category,
      tags_page_category: tag?.map((e) => e?.value),
      tags_page_category_name: tag?.map((e) => e?.label?.toLowerCase()), //send name of category
      preference_level: pageLevel?.value,
      page_activeness: pageStatus,
      page_closed_by: closeBy,
      page_name_type: pageType,
      content_creation: content,
      ownership_type: ownerType?.value,
      vendor_id: vendorId,

      temp_vendor_id: vendorData?.find((vendor) => vendor._id === vendorId)?.vendor_id,

      vendor_name: vendorData
        ?.find((vendor) => vendor._id === vendorId)
        ?.vendor_name?.toLowerCase(),
      followers_count: followCount,
      page_profile_type_id: profileId,
      page_profile_type_name: profileData?.data
        ?.find((role) => role?._id === profileId)
        ?.profile_type?.toLowerCase(),
      engagment_rate: rate,
      description: description,
      bio: bio,
      created_by: userID,
      rate_type: rateType.value,
      variable_type: rateType.value == 'Variable' ? variableType.value : null,
      page_price_multiple: rowCount,
      page_language_id: languageId.map((item) => item?.value),
      page_language_name: languageId.map((item) => item?.label),
      primary_page: primary.value,
      page_price_list: rowCount.map((item) => {
        return { [item.page_price_type_name]: item.price };
      }),

    };

    // return;

    if (pageMast_id) {
      payload.last_updated_by = userID;
      delete payload.created_by;
      return await axios
        .put(`${baseUrl}v1/pageMaster/${pageMast_id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          refetchPageList();
          toastAlert(' Data Updated  saim create 1 put Successfully');
          setIsFormSubmitted(true);
        })
        .catch((error) => {
          toastError(error.response.data.message);
        });
    } else {
      return await axios
        .post(baseUrl + 'v1/pageMaster', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          const pltname = formatString(res?.data?.data?.savingObj?.platform_name)
          const instagramList = pageList?.map((item) => item?.platform_name).filter((op) => op === res?.data?.data?.savingObj?.platform_name);
          const instagramCount = instagramList.length;
          console.log(instagramCount, 'instagramCount');
          refetchPageList();
          setIsFormSubmitted(true);
          toastAlert(`${pltname} - (${instagramCount}) , Data Submitted Successfully`

          );
        })
        .catch((error) => {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes('E11000')) {
            toastError('Duplicate Page Name.');
          } else {
            toastError(errorMessage);
          }
        });
    }
  };

  if (isFormSubmitted) {
    return navigate('/admin/pms-page-overview');
  }

  const addPriceRow = () => {
    setRowCount((rowCount) => [
      ...rowCount,
      { page_price_type_name: '', page_price_type_id: '', price: 0 },
    ]);
  };

  const handlePriceTypeChange = (e, index) => {
    const newRowCount = [...rowCount];
    newRowCount[index].page_price_type_id = e.value;
    newRowCount[index].page_price_type_name = e.label;
    setRowCount(newRowCount);
  };

  //Milion convert format function
  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}k`;
    } else {
      return value?.toString();
    }
  };

  const handlePriceChange = (e, index) => {
    if (
      e.target.value !== '' &&
      (e.target.value < 0 || isNaN(e.target.value))
    ) {
      return;
    }
    const newRowCount = [...rowCount];
    newRowCount[index].price = e.target.value;
    setRowCount(newRowCount);
  };
  const calculateFollowerCount = (index) => {
    const val = variableType.value === 'Per Thousand' ? 1000 : 1000000;
    return ((followCount / val) * (rowCount[index]?.price || 0)).toFixed(2);
  };

  const getInitialValue = () => {
    const initialId = vendorId || vendorDetails._id;
    const initialVendor = vendorData.find((vendor) => vendor._id === initialId);
    return initialVendor
      ? {
        value: initialVendor._id,
        label: formatString(initialVendor.vendor_name),
      }
      : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await axios.get(`${baseUrl}v1/vendor/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setSingleVendor(getData?.data?.data);
        setCloseBy(getData?.data?.data?.closed_by);

        const matchedProfile = profileData?.data.find(
          (profile) =>
            profile?.profile_type == getData?.data?.data?.vendor_category
        );
        setProfileId(matchedProfile?._id);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [vendorId]);

  const goBack = () => {
    navigate(-1);
  };

  const getPageFollowers = (value) => {
    const payload = {
      creators: [value],
      department: '65c38781c52b3515f77b0815',
      userId: 111111,
    };
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8';

    axios
      .post(`https://insights.ist:8080/api/v1/creators_details_v3`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((result) => {
        setFollowCount(result?.data?.data[0]?.creatorDetails?.followers);
      })
      .catch((error) => {
        console.error('Error fetching followers:', error);

        const fallbackPayload = {
          creators: [value],
          department: '65c38781c52b3515f77b0815',
          userId: 111111,
          creatorType: 0,
        };

        axios
          .post(
            `https://insights.ist:8080/api/v1/creator_details_operation_multiple`,
            fallbackPayload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          )
          .then((fallbackResult) => {
            setFollowCount(
              fallbackResult?.data?.data[0]?.creatorDetails?.followers
            );
          })
          .catch((fallbackError) => {
            console.error(
              'Error fetching followers from the fallback API:',
              fallbackError
            );
          });
      });
  };

  const setPageNameFun = (e) => {
    setPageName(e);
    // const checkPageExist = pageList.find(
    //   (item) => item.page_name.toLowerCase() == e.toLowerCase()
    // );
    // console.log(e,"eeee",pageList)
    // if (checkPageExist == undefined) {
    //   setExistError("Page Is Not Exist, You Can Use This");
    //   setMessageColor("green");
    // } else {
    //   setExistError("Page Is Already Exist, Enter Another One");
    //   setMessageColor("red");
    // }
  };

  const handleUpadteFollowers = async () => {
    const payload = {
      creators: [pageName.toLowerCase()],
      department: '65c38781c52b3515f77b0815',
      userId: 111111,
    };
    const payloadUpdate = {
      creators: [pageName.toLowerCase()],
      department: '65c38781c52b3515f77b0815',
      userId: 111111,
      creatorType: 0,
    };
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(
        `https://insights.ist:8080/api/v1/creators_details_v3`,
        payload,
        { headers }
      );

      if (response.status === 200) {
        if (response?.data?.data[0]?.isCreatorExists == true) {
          const followerData =
            response?.data?.data[0]?.creatorDetails?.followers;
          setFollowCount(followerData);
          toastAlert('Followers updated successfully!');
        } else {
          const res = await axios.post(
            `https://insights.ist:8080/api/v1/creator_details_operation_multiple`,
            payloadUpdate,
            { headers }
          );
          toastError(res?.data?.data[0]?.message);
        }
      } else {
        console.log('Response was not successful:', response.status);
      }
    } catch (error) {
      console.error('Error fetching followers:', error);
      toastError('An error occurred while updating followers.');
    }
  };



  const handleOwnerTypeChange = (selectedOption) => {
    // console.log(selectedOption)
    setOwnerType(selectedOption);
    setValidateFields({ ...validateFields, ownerType: !selectedOption });
  };


  return (
    <>
      <FormContainer
        mainTitle={!pageMast_id ? 'Profile Master' : ''}
        link={true}
        submitButton={false}
      />
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

      <div className="parent_of_tab" style={{ display: 'flex' }}>
        {platformData?.map((item) => (
          <div key={item._id} className="tabs">
            <button
              className={
                activeTab === item._id ? 'active btn btn-info' : 'btn btn-link'
              }
              onClick={() => {
                setActiveTab(item._id);
                setPlatformId(item._id);
                setRowCount([
                  {
                    page_price_type_name: '',
                    page_price_type_id: '',
                    price: 0,
                  },
                ]);
              }}
            >
              {formatString(item.platform_name)}
            </button>
          </div>
        ))}
      </div>

      <div className={!pageMast_id ? 'card' : ''}>
        {!pageMast_id && (
          <div className="card-header">
            <h5 className="card-title">Profile Master</h5>
            <button
              type="button"
              title="Update Followers"
              // className="btn btn-primary mt-2 btn-sm"
              className="btn cmnbtn btn_sm btn-primary"
              onClick={() => handleUpadteFollowers()}
            >
              Update Followers
            </button>
          </div>
        )}
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Vendor <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  options={vendorData.map((option) => ({
                    value: option._id,
                    label: formatString(option.vendor_name),
                  }))}
                  required={true}
                  value={getInitialValue()}
                  onChange={(selectedOption) => {
                    setVendorId(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        vendorId: false,
                      }));
                    }
                  }}
                />
                {validateFields.vendorId && (
                  <small style={{ color: 'red' }}>Please select Vendor</small>
                )}
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Language <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  options={languages.map((option) => ({
                    value: option._id,
                    label: formatString(option.language_name),
                  }))}
                  isMulti
                  required={true}
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions.map(
                      (option) => option
                    );
                    setLanguageId(selectedValues);
                    if (selectedValues.length > 0) {
                      setValidateFields((prev) => ({
                        ...prev,
                        vendorId: false,
                      }));
                    }
                  }}
                />
              </div>
            </div>
            {/* <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Platform <sup style={{ color: "red" }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={platformData?.map((option) => ({
                      value: option._id,
                      label: option.platform_name,
                    }))}
                    required={true}
                    value={{
                      value: platformId,
                      label:
                        platformData.find((role) => role._id === platformId)
                          ?.platform_name || "",
                    }}
                    onChange={(e) => {
                      setPlatformId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          platformId: false,
                        }));
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleAddPlatformClick}
                    variant="contained"
                    color="primary"
                    aria-label="Add Platform.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handlePlatformInfoClick}
                    variant="contained"
                    color="primary"
                    aria-label="Platform Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.platformId && (
                  <small style={{ color: "red" }}>Please select Platform</small>
                )}
              </div>
            </div> */}

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Is Profile Verified ? <sup style={{ color: 'red' }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="verified"
                        value=""
                      />
                      Yes
                    </label>
                  </div>
                  <div className="form-check-inline">
                    <label className="form-check-label">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="verified"
                        value=""
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Profile Type <sup style={{ color: 'red' }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={profileData?.data?.map((option) => ({
                      value: option?._id,
                      label: option?.profile_type,
                    }))}
                    required={true}
                    value={{
                      value: profileId,
                      label:
                        profileData?.data?.find(
                          (role) => role?._id === profileId
                        )?.profile_type || singleVendor?.vendor_category,
                    }}
                    onChange={(e) => {
                      setProfileId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          profileId: false,
                        }));
                      }
                    }}
                  />

                  <IconButton
                    onClick={handleAddProfileTypeClick}
                    variant="contained"
                    color="primary"
                    aria-label="Add Profile Type.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleProfileTypeInfoClick}
                    variant="contained"
                    color="primary"
                    aria-label="Profile Type Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.profileId && (
                  <small style={{ color: 'red' }}>
                    Please select Profile Type
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Activeness <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  name="Page status"
                  options={PageStatus}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageStatus.find(
                    (option) => option.value == pageStatus
                  )}
                  onChange={(selectedOption) => {
                    setPageStatus(selectedOption?.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageStatus: false,
                      }));
                    }
                  }}
                />
                {validateFields.pageStatus && (
                  <small style={{ color: 'red' }}>
                    Please select Profile Status
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Category <sup style={{ color: 'red' }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={categoryData?.map((option) => ({
                      value: option._id,
                      label: formatString(option.page_category),
                    }))}
                    required={true}
                    value={{
                      value: categoryId,
                      label:
                        formatString(
                          categoryData?.find((role) => role._id === categoryId)
                            ?.page_category
                        ) || '',
                    }}
                    onChange={(e) => {
                      setCategoryId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          categoryId: false,
                        }));
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleOpenPageModal('Category')}
                    variant="contained"
                    color="primary"
                    aria-label="Add Platform.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleOpenInfoModal('Category Info')}
                    variant="contained"
                    color="primary"
                    aria-label="Platform Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.categoryId && (
                  <small style={{ color: 'red' }}>Please select Category</small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Sub Category <sup style={{ color: 'red' }}>*</sup>
                </label>
                <div className="input-group inputAddGroup">
                  <Select
                    className="w-100"
                    options={subCategoryData.map((option) => ({
                      value: option._id,
                      label: formatString(option.page_sub_category),
                    }))}
                    required={true}
                    value={{
                      value: subCategoryId,
                      label: formatString(
                        subCategoryData.find(
                          (role) => role._id === subCategoryId
                        )?.page_sub_category || ''
                      ),
                    }}
                    onChange={(e) => {
                      setSubCategoryId(e.value);
                      if (e.value) {
                        setValidateFields((prev) => ({
                          ...prev,
                          subCategoryId: false,
                        }));
                      }
                    }}
                  />
                  <IconButton
                    onClick={handleOpenPageModal('Sub Category')}
                    variant="contained"
                    color="primary"
                    aria-label="Add Sub Category.."
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    onClick={handleOpenInfoModal('Sub Category Info')}
                    variant="contained"
                    color="primary"
                    aria-label="Sub Category Info.."
                  >
                    <InfoIcon />
                  </IconButton>
                </div>
                {validateFields.subCategoryId && (
                  <small style={{ color: 'red' }}>
                    Please select Sub Category
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">Tags</label>
                <Select
                  isMulti
                  options={categoryData.map((option) => ({
                    value: option._id,
                    label: option.page_category,
                  }))}
                  required={true}
                  value={tag}
                  onChange={(e) => {
                    setTag(e);
                    if (e) {
                      setValidateFields((prev) => ({ ...prev, tag: false }));
                    }
                  }}
                ></Select>
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Profile Name"
                fieldGrid={12}
                astric={true}
                value={pageName}
                required={true}
                onChange={(e) => {
                  // setPageName(e.target.value);
                  setPageNameFun(e.target.value);
                  // getPageFollowers(e.target.value);
                  if (e.target.value) {
                    if (
                      platformData.some(
                        (e) =>
                          e.platform_name.toLowerCase() === 'instagram' &&
                          e._id === platformId
                      )
                    ) {
                      setLink(
                        () => `https://www.instagram.com/${e.target.value}`
                      );
                      if (link) {
                        setValidateFields((prev) => ({ ...prev, link: false }));
                      }
                    }
                    setValidateFields((prev) => ({ ...prev, pageName: false }));
                  }
                }}
              />
              {validateFields.pageName && (
                <small style={{ color: 'red' }}>Please Fill Profile Name</small>
              )}
              {existError && (
                <small style={{ color: messageColor }}>{existError}</small>
              )}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                fieldGrid={12}
                label="Link"
                astric={true}
                value={link}
                required={true}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({ ...prev, link: false }));
                  }
                }}
              />
              {validateFields.link && (
                <small style={{ color: 'red' }}>Please Fill Link</small>
              )}
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Followers Count (10L = 1M)"
                fieldGrid={12}
                astric={true}
                type="text"
                value={followCount}
                required={true}
                onChange={(e) => {
                  if (
                    e.target.value !== '' &&
                    (e.target.value < 0 || isNaN(e.target.value))
                  ) {
                    return;
                  }
                  setFollowCount(e.target.value);
                  if (e.target.value) {
                    setValidateFields((prev) => ({
                      ...prev,
                      followCount: false,
                    }));
                  }
                }}
              />
              <small className="ml-3">{formatNumber(followCount)}</small>
              {validateFields.followCount && (
                <small style={{ color: 'red' }}>
                  Please Fill Followers Count
                </small>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Preference Level <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  name="Profile level"
                  options={PageLevels}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageLevels.find(
                    (option) => option.value === pageLevel
                  )}
                  onChange={(selectedOption) => {
                    setPageLevel(selectedOption);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageLevel: false,
                      }));
                    }
                  }}
                />
                {validateFields.pageLevel && (
                  <small style={{ color: 'red' }}>
                    Please select Preference Level
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Ownership Type<sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  className="w-100"
                  options={[
                    { value: "Own", label: "Own" },
                    { value: "Vendor", label: "Vendor" },
                    { value: "Partnership", label: "Partnership" },
                  ]}
                  required
                  value={ownerType}
                  onChange={handleOwnerTypeChange}
                  placeholder="Select Ownership Type"
                />
              </div>
              {validateFields.ownerType && (
                <small style={{ color: 'red' }}>
                  Please Select Ownership Type
                </small>
              )}
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Primary <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  options={['No', 'Yes'].map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  required={true}
                  value={{
                    value: primary.value,
                    label: primary.label,
                  }}
                  onChange={handlePrimaryChange}
                />
                {validateFields.primary && (
                  <small style={{ color: 'red' }}>
                    Please Fill Primary Type
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Close By <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  // components={{ MenuList }}
                  options={usersDataContext
                    // .filter((item)=>item?.department_name == "Finance")
                    .map((option) => ({
                      value: option.user_id,
                      label: option.user_name,
                    }))}
                  required={true}
                  value={{
                    value: singleVendor?.closed_by || closeBy,
                    label:
                      usersDataContext?.find(
                        (role) =>
                          role.user_id == singleVendor?.closed_by ||
                          role.user_id == closeBy
                      )?.user_name || '',
                  }}
                  onChange={(e) => {
                    setCloseBy(e.value);
                    if (e.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        closeBy: false,
                      }));
                    }
                  }}
                />
                {validateFields.closeBy && (
                  <small style={{ color: 'red' }}>Please select Close By</small>
                )}
              </div>
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Content Creation <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  name="Content creation"
                  options={Contents}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={Contents.find((option) => option.value == content)}
                  onChange={(selectedOption) => {
                    setContent(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        content: false,
                      }));
                    }
                  }}
                />
                {validateFields.content && (
                  <small style={{ color: 'red' }}>
                    Please select Content Creation
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Profile Name Type <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  name="profile name type"
                  options={PageTypes}
                  required={true}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={PageTypes.find((option) => option.value == pageType)}
                  onChange={(selectedOption) => {
                    setPageType(selectedOption.value);
                    if (selectedOption.value) {
                      setValidateFields((prev) => ({
                        ...prev,
                        pageType: false,
                      }));
                    }
                  }}
                />
                {
                  validateFields.pageType && (
                    <small style={{ color: 'red' }}>
                      Please select Profile Name Type
                    </small>
                  ) // Page Name Type
                }
              </div>
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Engagement Rate"
                type="text"
                fieldGrid={12}
                value={rate}
                required={true}
                onChange={(e) => {
                  if (
                    e.target.value !== '' &&
                    (e.target.value < 0 || isNaN(e.target.value))
                  ) {
                    return;
                  }
                  setRate(e.target.value);
                }}
              />
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Description"
                fieldGrid={12}
                value={description}
                required={false}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="col-md-6 p0 mb16">
              <FieldContainer
                label="Bio"
                fieldGrid={12}
                value={bio}
                required={false}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Rate Type <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  options={['Fixed', 'Variable'].map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  required={true}
                  value={{
                    value: rateType.value,
                    label: rateType.label,
                  }}
                  onChange={handleRateTypeChange}
                />
              </div>
            </div>
            <div className="col-md-6 mb16">
              {rateType.label == 'Variable' && (
                <div className="form-group m0">
                  <label className="form-label">
                    Variable Type <sup style={{ color: 'red' }}>*</sup>
                  </label>
                  <Select
                    options={['Per Thousand', 'Per Million'].map((option) => ({
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
          </div>
          <div className="row thm_form pagePriceRow">
            {rowCount?.map((row, index) => (
              <>
                <div key={index} className="col-md-6">
                  <div className="form-group m0">
                    <label className="form-label">
                      Price Type <sup style={{ color: 'red' }}>*</sup>
                    </label>
                    <div className="input-group inputAddGroup">
                      <Select
                        className="w-100"
                        options={filterPriceTypeList?.map((option) => ({
                          value: option?._id,
                          label: option?.name,
                        }))}
                        required={true}
                        value={{
                          label: priceTypeList?.find(
                            (role) =>
                              role._id === rowCount[index]?.page_price_type_id
                          )?.name,
                          value: rowCount[index]?.page_price_type_id,
                        }}
                        onChange={(e) => handlePriceTypeChange(e, index)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col p0">
                  <FieldContainer
                    label="Price"
                    fieldGrid={12}
                    astric={true}
                    required={true}
                    type="text"
                    onChange={(e) => handlePriceChange(e, index)}
                    value={rowCount[index].price}
                  />
                  {rateType.label == 'Variable' && (
                    <p className="ml-3" style={{ color: 'blue' }}>
                      This Profile Cost = {'  Rs '}{' '}
                      {calculateFollowerCount(index.toFixed(0))}
                    </p>
                  )}
                </div>
                <div className="col-md-1 text-center">
                  {index != 0 && (
                    <button
                      title="Remove"
                      className="btn tableIconBtn btn-outline-danger"
                      type="button"
                      onClick={() => {
                        setRowCount((prev) =>
                          prev.filter((e, i) => i !== index)
                        );
                      }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </>
            ))}
            <button
              title="Add Price"
              type="button"
              onClick={addPriceRow}
              className="btn tableIconBtn btn-outline-primary w-auto"
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>
          <div className="row thm_form">
            <div className="col-md-6 mb16"></div>
            <div className="col-md-6 mb16"></div>
          </div>
        </div>
        <div className="card-footer">
          <Stack direction="row" spacing={2}>
            <button
              className="btn cmnbtn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >
              {pageMast_id ? 'Update' : 'Submit'}
            </button>
          </Stack>
        </div>
      </div>
      <PageAddMasterModal />
      {pageInfoModlaOpen && <PageInfoModal />}
      {vendorInfoModalOpen && <VendorTypeInfoModal />}
      <AddVendorModal />
    </>
  );
};

export default PageMaster;
