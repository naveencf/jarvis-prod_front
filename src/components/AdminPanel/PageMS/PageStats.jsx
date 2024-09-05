import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PiImageSquareDuotone } from "react-icons/pi";
import {
  useAddPageStateMutation,
  useGetAllCitiesQuery,
  useGetPageStateByIdQuery,
  useUpdatePageStateMutation,
} from "../../Store/PageBaseURL";
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { Country } from "country-state-city";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { useSelector } from "react-redux";
import handlePercentage from "../../../utils/Percentage";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
// import avatarOne from "../../../assets/img/product/Avtrar1.png";
// import { Dropdown } from "react-bootstrap";
// import instaIcon from "../../../assets/img/icon/insta.svg";
// import ReactApexChart from "react-apexcharts";

export default function PageStats() {
  const navitage = useNavigate();
  const { data: cities, isLoading: citiesLoading,isError: citiesError } = useGetAllCitiesQuery();  
  const [reachImageURL, setReachImageURL] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const [copyCities, setCopyCities] = useState([]);
  const [copyCountries, setCopyCountries] = useState([]);
  const [modalImage, setModalImage] = useState('')
  const [newCity, setNewCity] = useState('')

  const [impressionImageURL, setImpressionImageURL] = useState("");
  const [engagementImageURL, setEngagementImageURL] = useState("");
  const [storyViewImageURL, setStoryViewImageURL] = useState("");
  const [cityImageURL, setCityImageURL] = useState("");
  const [countryImageURL, setCountryImageURL] = useState("");
  const [ageImageURL, setAgeImageURL] = useState("");
  const [imagePreview, setImagePreviews] = useState({
    cityImage: null,
    countryImage: null,
  });
  const [isFormsubmitting, setIsFormSubmitting] = useState(false);

  const handleFileChange = (event, imageKey) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prevState) => ({
          ...prevState,
          [imageKey]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  useEffect(() => {
    if (cities) {
      setCopyCities(cities);
    }
  }, [cities]);

  useEffect(() => {
    if (Country.getAllCountries()) {
      setCopyCountries(Country.getAllCountries());
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm({
    mode: "onChange",
  });

  const reachValue = watch("reach"); 
  const impressionValue = watch("impressions"); 

  useEffect(() => {
    let citiesArr = cities?.filter(
      (city) =>
        !(
          city.city_name === watch("city1") ||
          city.city_name === watch("city2") ||
          city.city_name === watch("city3") ||
          city.city_name === watch("city4") ||
          city.city_name === watch("city5")
        )
    );
    setCopyCities(citiesArr);
  }, [
    watch("city1"),
    watch("city2"),
    watch("city3"),
    watch("city4"),
    watch("city5"),
  ]);
  const countryList = Country.getAllCountries();

  useEffect(() => {
    let countriesArr = countryList?.filter(
      (country) =>
        !(
          country.name === watch("country1") ||
          country.name === watch("country2") ||
          country.name === watch("country3") ||
          country.name === watch("country4") ||
          country.name === watch("country5")
        )
    );
    setCopyCountries(countriesArr);
  }, [
    watch("country1"),
    watch("country2"),
    watch("country3"),
    watch("country4"),
    watch("country5"),
  ]);

  const { id } = useParams();
  const { data: pageStateData, isLoading: pageStateDataIsLoaidng } =
    useGetPageStateByIdQuery(id);

  // useEffect(() => {
  function CheckValidation() {
    let err;
    console.log("come to error");
    for (const key in errors) {
      if (Object.hasOwnProperty.call(errors, key)) {
        const element = errors[key];
        // console.log(element.message);

        // toastError(element.message)
        err = true;
      }
    }
    if (err) {
      toastError("Please Fill All The Required Fields");
    }
  }
  // }, [errors]);

  const isImageEmpty = !imagePreview.impressionsImage && !impressionImageURL;
  const isReachImageEmpty = !imagePreview.reachImage && !reachImageURL;
  const isEngagementImageEmpty =
    !imagePreview.engagementImage && !engagementImageURL;
  const isReachStoryViewEmpty =
    !imagePreview.storyViewImage && !storyViewImageURL;
  const isCityEmpty = !imagePreview.cityImage && !cityImageURL;
  const isCountryEmpty = !imagePreview.countryImage && !countryImageURL;
  const isAgeEmpty = !imagePreview.ageGroupImage && !ageImageURL;

  // let isStatsFor = watch("statsFor");
  // switch (isStatsFor) {
  //   case "daily":
  //     setValue("startDate", new Date().toISOString().split("T")[0]);
  //     setValue("endDate", new Date().toISOString().split("T")[0]);
  //     break;
  //   case "monthly":
  //     setValue("startDate", null);
  //     setValue("endDate", null);
  //     break;
  //   case "fortnight":
  //     setValue("startDate", null);
  //     setValue("endDate", null);
  //     break;
  //   case "quarterly":
  //     setValue("startDate", null);
  //     setValue("endDate", null);
  //     break;
  //   default:
  //     setValue("startDate", null);
  //     setValue("endDate", null);
  //     break;
  // }

  const [addPageState] = useAddPageStateMutation();
  const [updatePageState] = useUpdatePageStateMutation();

  useEffect(() => {
    // console.log("come here");
    if (pageStateData) {
      setReachImageURL(pageStateData?.reach_image_url);
      setImpressionImageURL(pageStateData?.impression_image_url);
      setEngagementImageURL(pageStateData?.engagement_image_url);
      setStoryViewImageURL(pageStateData?.story_view_image_url);
      setCityImageURL(pageStateData?.city_image_url);
      setCountryImageURL(pageStateData?.country_image_url);
      setAgeImageURL(pageStateData?.Age_upload_url);

      setValue("reach", pageStateData?.reach);

      setValue("impressions", pageStateData?.impression);

      setValue("engagement", pageStateData?.engagement);
      setValue("storyView", pageStateData?.story_view);
      // setValue("storyViewDate", pageStateData?.story_view_date);

      setValue(
        "city1",
        cities?.find((city) => city.city_name === pageStateData?.city1_name)
          ?.city_name
      );

      setValue("city1Percentage", pageStateData?.percentage_city1_name);
      setValue("city2", pageStateData?.city2_name);
      setValue("city2Percentage", pageStateData?.percentage_city2_name);
      setValue("city3", pageStateData?.city3_name);
      setValue("city3Percentage", pageStateData?.percentage_city3_name);
      setValue("city4", pageStateData?.city4_name);
      setValue("city4Percentage", pageStateData?.percentage_city4_name);
      setValue("city5", pageStateData?.city5_name);
      setValue("city5Percentage", pageStateData?.percentage_city5_name);

      setValue("country1", pageStateData?.country1_name);
      setValue("country1Percentage", pageStateData?.percentage_country1_name);
      setValue("country2", pageStateData?.country2_name);

      setValue("country2Percentage", pageStateData?.percentage_country2_name);
      setValue("country3", pageStateData?.country3_name);
      setValue("country3Percentage", pageStateData?.percentage_country3_name);
      setValue("country4", pageStateData?.country4_name);
      setValue("country4Percentage", pageStateData?.percentage_country4_name);
      setValue("country5", pageStateData?.country5_name);
      setValue("country5Percentage", pageStateData?.percentage_country5_name);

      setValue("statsFor", pageStateData?.stats_for);
      setValue("startDate", pageStateData?.start_date?.split("T")[0]);
      setValue("endDate", pageStateData?.end_date?.split("T")[0]);
      setValue("storyViewDate", pageStateData?.story_view_date?.split("T")[0]);
      setValue("profileVisit", pageStateData?.profile_visit);
      setValue("womenPercentage", pageStateData?.female_percent);
      setValue("menPercentage", pageStateData?.male_percent);
      setValue("ageGroup1", pageStateData?.Age_13_17_percent);
      setValue("ageGroup2", pageStateData?.Age_18_24_percent);
      setValue("ageGroup3", pageStateData?.Age_25_34_percent);
      setValue("ageGroup4", pageStateData?.Age_35_44_percent);
      setValue("ageGroup5", pageStateData?.Age_45_54_percent);
      setValue("ageGroup6", pageStateData?.Age_55_64_percent);
      setValue("ageGroup7", pageStateData?.Age_65_plus_percent);
    }
  }, [pageStateData]);

  const appendIfDefined = (formData, key, value) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  };

  const handleSubmitForm = (data) => {
    setIsFormSubmitting(true);
    const formData = new FormData();
    appendIfDefined(formData, "page_master_id", id);
    appendIfDefined(formData, "reach", data?.reach);
    appendIfDefined(formData, "impression", data?.impressions);
    appendIfDefined(formData, "engagement", data?.engagement);
    appendIfDefined(formData, "story_view", data?.storyView);
    appendIfDefined(formData, "story_view_date", data?.storyViewDate);
    appendIfDefined(formData, "profile_visit", data?.profileVisit);
    appendIfDefined(formData, "city1_name", data?.city1);
    appendIfDefined(formData, "percentage_city1_name", data?.city1Percentage);
    appendIfDefined(formData, "city2_name", data?.city2);
    appendIfDefined(formData, "percentage_city2_name", data?.city2Percentage);
    appendIfDefined(formData, "city3_name", data?.city3);
    appendIfDefined(formData, "percentage_city3_name", data?.city3Percentage);
    appendIfDefined(formData, "city4_name", data?.city4);
    appendIfDefined(formData, "percentage_city4_name", data?.city4Percentage);
    appendIfDefined(formData, "city5_name", data?.city5);
    appendIfDefined(formData, "percentage_city5_name", data?.city5Percentage);
    appendIfDefined(formData, "country1_name", data?.country1);
    appendIfDefined(
      formData,
      "percentage_country1_name",
      data?.country1Percentage
    );
    appendIfDefined(formData, "country2_name", data?.country2);
    appendIfDefined(
      formData,
      "percentage_country2_name",
      data?.country2Percentage
    );
    appendIfDefined(formData, "country3_name", data?.country3);
    appendIfDefined(
      formData,
      "percentage_country3_name",
      data?.country3Percentage
    );
    appendIfDefined(formData, "country4_name", data?.country4);
    appendIfDefined(
      formData,
      "percentage_country4_name",
      data?.country4Percentage
    );
    appendIfDefined(formData, "country5_name", data?.country5);
    appendIfDefined(
      formData,
      "percentage_country5_name",
      data?.country5Percentage
    );
    appendIfDefined(formData, "stats_for", data?.statsFor);
    appendIfDefined(formData, "start_date", data?.startDate);
    appendIfDefined(formData, "end_date", data?.endDate);

    appendIfDefined(formData, "male_percent", data?.menPercentage);
    appendIfDefined(formData, "female_percent", data?.womenPercentage);

    appendIfDefined(formData, "Age_13_17_percent", data?.ageGroup1);
    appendIfDefined(formData, "Age_18_24_percent", data?.ageGroup2);
    appendIfDefined(formData, "Age_25_34_percent", data?.ageGroup3);
    appendIfDefined(formData, "Age_35_44_percent", data?.ageGroup4);
    appendIfDefined(formData, "Age_45_54_percent", data?.ageGroup5);
    appendIfDefined(formData, "Age_55_64_percent", data?.ageGroup6);
    appendIfDefined(formData, "Age_65_plus_percent", data?.ageGroup7);
    appendIfDefined(formData, "created_by", userID);
    appendIfDefined(formData, "reach_image", data?.reachImage[0]);
    appendIfDefined(formData, "impression_image", data?.impressionsImage[0]);
    appendIfDefined(formData, "engagement_image", data?.engagementImage[0]);
    appendIfDefined(formData, "story_view_image", data?.storyViewImage[0]);
    appendIfDefined(formData, "city_image", data?.cityImage[0]);
    appendIfDefined(formData, "Age_upload", data?.ageGroupImage[0]);
    appendIfDefined(formData, "country_image", data?.countryImage[0]);

    if (!pageStateData?._id) {
      addPageState(formData)
        .unwrap()
        .then(() => {
          toastAlert("Stats Added Successfully");
          navitage(`/admin/pms-page-overview`);
        })
        .catch((err) => {
          toastError(`Something Went Wrong ${err.message}`);
        })
        .finally(() => setIsFormSubmitting(false));
    } else {
      delete formData.created_by;
      delete formData.page_master_id;
      updatePageState({
        id,
        formData,
      })
        .unwrap()
        .then(() => {
          toastAlert("Stats Updated Successfully");
          navitage(`/admin/pms-page-overview`);
        })
        .catch((err) => {
          toastError(`Something Went Wrong ${err.message}`);
        })
        .finally(() => setIsFormSubmitting());
    }
  };
  const handlePercentageMax = (event) => {
    const inputValue = event.target.value;
    if (!/[0-9.]/.test(event.key) || (event.key === '.' && inputValue.includes('.'))) {
      event.preventDefault();
    } else {
      const decimalIndex = inputValue.indexOf('.');
      if (decimalIndex !== -1 && inputValue.length - decimalIndex > 1) {
        event.preventDefault();
      } else {
        const value = inputValue + event.key;
        if (parseFloat(value) > 100) {
          event.preventDefault();
        }
      }
    }
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

  function addOneDay(date) {
    if (!date) return;
    const result = new Date(date);
    result?.setDate(result.getDate() + 1);
    return result?.toISOString().split("T")[0];
  }

  const handleModalImage = (imageUrl) =>{
    setModalImage(imageUrl)
  }

  const addNewCity = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}add_city`,{
      city_name: newCity
    })
    .then((res)=>{
      toastAlert('City added')
      setNewCity('')
    })
    .catch((error) => {
      if (error.response.data.error && error.response.data.error.includes('E11000')) {
        toastError('City already exists');
      }
    });
  }

  return (
    <>
      <div className="stateHistoryWrapper">
        <FormControl
          component={"form"}
          onSubmit={handleSubmit(handleSubmitForm, CheckValidation)}
        >
          <div className="card">
            <div className="card-body flexCenterBetween">
              <h5 className="card-title">
                {!pageStateDataIsLoaidng && !pageStateData?._id
                  ? "Add"
                  : "Update"}{" "}
                Stats
              </h5>
              {/* <div className="form-group flexCenter colGap8 w-40 m0">
                <label className="w-25 m0">Stats for</label>
                <select
                  className="form-control form_sm"
                  {...register("statsFor", {
                    required: "Please Select The Stats For",
                  })}
                  aria-invalid={errors.statsFor ? "true" : "false"}
                >
                  <option value="">All</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="fortnight">Fortnight</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <div className="h-2">
                  {errors.statsFor && (
                    <span role="alert" className="text-danger">
                      {errors.statsFor.message}
                    </span>
                  )}
                </div>
              </div> */}
              <div></div>

              {/* {isStatsFor && ( */}
              <>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Start Date <sup style={{ color: "red" }}>*</sup>{" "}
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      {...register("startDate", {
                        required: "Please Select The Start Date",
                      })}
                      aria-invalid={errors.startDate ? "true" : "false"}
                    />

                    <div className="h-3">
                      {errors.startDate && (
                        <span role="alert" className="text-danger">
                          {errors.startDate.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      End Date <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <input
                      type="date"
                      disabled={watch("startDate") ? false : true}
                      min={addOneDay(watch("startDate"))}
                      className="form-control"
                      {...register("endDate", {
                        required: "Please Select The End Date",
                      })}
                      aria-invalid={errors.endDate ? "true" : "false"}
                    />
                    <div className="h-3">
                      {errors.endDate && (
                        <span role="alert" className="text-danger">
                          {errors.endDate.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
              {/* )} */}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Followers Bifurcation</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Reach <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("reach", {
                          required: "Please Select The Reach",
                        })}
                        aria-invalid={errors.reach ? "true" : "false"}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />

                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          {...register("reachImage")}
                          onInputCapture={(event) =>
                            handleFileChange(event, "reachImage")
                          }
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                      {isReachImageEmpty ? (
                        <PiImageSquareDuotone size={50} />
                      ) : (
                        <>
                          {imagePreview.reachImage ? (
                            <img
                              className="profile-holder-1"
                              src={imagePreview.reachImage}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px" }}
                            />
                          ) : (
                            <img
                              className="profile-holder-1"
                              src={reachImageURL}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px", cursor:'pointer' }}
                              onClick={()=>handleModalImage(reachImageURL)}
                              data-toggle="modal" data-target="#myModal"
                            />
                          )}
                        </>
                      )}
                    </div>
                    {errors.reach && (
                      <span role="alert" className="text-danger">
                        {errors.reach.message}
                      </span>
                    )}
                    <small className="ml-3">{formatNumber(reachValue)}</small>
                  </div>
                </div>

                <div id="myModal" className="modal fade" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title"></h4>
                      </div>
                      <div className="modal-body">
                        <img src={modalImage} style={{height:'50%',width:'90%'}} />
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Impressions <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("impressions", {
                          required: "Please Select The Impressions",
                        })}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />

                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          {...register("impressionsImage")}
                          onInputCapture={(event) =>
                            handleFileChange(event, "impressionsImage")
                          }
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                      <>
                        {isImageEmpty ? (
                          <PiImageSquareDuotone size={50} />
                        ) : (
                          <>
                            {imagePreview.impressionsImage ? (
                              <img
                                className="profile-holder-1"
                                src={imagePreview.impressionsImage}
                                alt="Selected"
                                style={{ maxWidth: "50px", maxHeight: "50px" }}
                              />
                            ) : (
                              <img
                                className="profile-holder-1"
                                src={impressionImageURL}
                                alt="Selected"
                                style={{ maxWidth: "50px", maxHeight: "50px", cursor:'pointer' }}
                                onClick={()=>handleModalImage(impressionImageURL)}
                                data-toggle="modal" data-target="#myModal"
                              />
                            )}
                          </>
                        )}
                      </>
                    </div>
                    {errors.impressions && (
                      <span role="alert" className="text-danger">
                        {errors.impressions.message}
                      </span>
                    )}
                    <small className="ml-3">{formatNumber(impressionValue)}</small>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Engagement <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        accept="image/*"
                        className="form-control"
                        {...register("engagement", {
                          required: "Please Select The Engagement ",
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Please Enter Valid Engagement",
                          },
                        })}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        aria-invalid={errors.engagement ? "true" : "false"}
                      />
                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          {...register("engagementImage")}
                          onInputCapture={(event) =>
                            handleFileChange(event, "engagementImage")
                          }
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                      {isEngagementImageEmpty ? (
                        <PiImageSquareDuotone size={50} />
                      ) : (
                        <>
                          {imagePreview.engagementImage ? (
                            <img
                              className="profile-holder-1"
                              src={imagePreview.engagementImage}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px" }}
                            />
                          ) : (
                            <img
                              className="profile-holder-1"
                              src={engagementImageURL}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px", cursor:'pointer' }}
                              onClick={()=>handleModalImage(engagementImageURL)}
                              data-toggle="modal" data-target="#myModal"
                            />
                          )}
                        </>
                      )}
                    </div>
                    {errors.engagement && (
                      <span role="alert" className="text-danger">
                        {errors.engagement.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>
                      Story View <span className="dangerText">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        accept="image/*"
                        className="form-control"
                        {...register("storyView", {
                          required: "Please Enter Valid Story View",
                          pattern: {
                            value: /^[0-9]*$/,
                            message: "Please Enter Valid Story View",
                          },
                        })}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                      <label className="btn iconBtn btn-outline-border">
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          {...register("storyViewImage")}
                          onInputCapture={(event) =>
                            handleFileChange(event, "storyViewImage")
                          }
                        />
                        <i className="bi bi-cloud-arrow-up-fill"></i>
                      </label>
                      {isReachStoryViewEmpty ? (
                        <PiImageSquareDuotone size={50} />
                      ) : (
                        <>
                          {imagePreview.storyViewImage ? (
                            <img
                              className="profile-holder-1"
                              src={imagePreview.storyViewImage}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px" }}
                            />
                          ) : (
                            <img
                              className="profile-holder-1"
                              src={storyViewImageURL}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px", cursor:'pointer' }}
                              onClick={()=>handleModalImage(storyViewImageURL)}
                              data-toggle="modal" data-target="#myModal"
                            />
                          )}
                        </>
                      )}
                    </div>
                    <div className="h-3">
                      {errors.storyView && (
                        <span role="alert" className="text-danger">
                          {errors.storyView.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Story View Date</label>
                    <input
                      type="date"
                      className="form-control"
                      {...register("storyViewDate")}
                    />
                  </div>
                </div> */}
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Profile Visit</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("profileVisit")}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="card-title">City</h5>
              Add New City:- 
              <input type="text" value={newCity} className="form-control" onChange={(e)=>setNewCity(e.target.value)} style={{maxWidth:'20%'}} />
              <button className="btn btn-success" disabled={!newCity} onClick={addNewCity} style={{borderRadius:'15%'}}>Add</button>
            </div>
            <div className="card-body pb8">
              {cities && (
                <div className="row thm_form">
                  {["city1", "city2", "city3", "city4", "city5"].map(
                    (city, index) => (
                      <div className="col-md-4 col-sm-12" key={city}>
                        <div className="form-group">
                          <label>{`City ${index + 1}`}</label>
                          <div className="row m0">
                            <div className="col-md-9 p0 mr8">
                              <Controller
                                name={city}
                                control={control}
                                render={({ field }) => (
                                  <Autocomplete
                                    {...field}
                                    options={copyCities? copyCities: []}
                                    getOptionLabel={(option) =>
                                      option.city_name || ""
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                      option.city_name === value?.city_name
                                    }
                                    onChange={(event, value) =>
                                      setValue(city, value?.city_name || "")
                                    }
                                    value={
                                      cities?.find(
                                        (cityItem) =>
                                          cityItem.city_name === watch(city)
                                      ) || null
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select City"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                )}
                              />
                            </div>
                            <div className="col p0">
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control pl4 pr4 text-center"
                                  {...register(`${city}Percentage`)}
                                  onKeyPress={handlePercentageMax}
                                />
                                <span className="input-group-text">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <div className="col-md-4 col-sm-12">
                    <div className="form-group flex-row">
                      <input
                        type="file"
                        accept="image/*"
                        id="cityFileInput"
                        style={{ display: "none" }}
                        {...register("cityImage")}
                        onInputCapture={(event) =>
                          handleFileChange(event, "cityImage")
                        }
                      />

                      <button
                        type="button"
                        className="btn cmnbtn btn-primary mt-4"
                        onClick={() =>
                          document.getElementById("cityFileInput").click()
                        }
                      >
                        <i className="bi bi-cloud-arrow-up-fill"></i> Image
                      </button>
                      {isCityEmpty ? (
                        <PiImageSquareDuotone size={50} />
                      ) : (
                        <>
                          {imagePreview.cityImage ? (
                            <img
                              className="profile-holder-1 mt-4"
                              src={imagePreview.cityImage}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px" }}
                            />
                          ) : (
                            <img
                              className="profile-holder-1 mt-4"
                              src={cityImageURL}
                              alt="Selected"
                              style={{ maxWidth: "50px", maxHeight: "50px", cursor:'pointer' }}
                              onClick={()=>handleModalImage(cityImageURL)}
                              data-toggle="modal" data-target="#myModal"
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Country</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                {[
                  "country1",
                  "country2",
                  "country3",
                  "country4",
                  "country5",
                ].map((country, index) => (
                  <div className="col-md-4 col-sm-12" key={country}>
                    <div className="form-group">
                      <label>{`Country ${index + 1}`}</label>
                      <div className="row m0">
                        <div className="col-md-9 p0 mr8">
                          <Controller
                            name={country}
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                {...field}
                                options={copyCountries}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) =>
                                  option.name === value?.name
                                }
                                onChange={(event, value) =>
                                  setValue(country, value?.name || "")
                                }
                                value={
                                  countryList?.find(
                                    (countryItem) =>
                                      countryItem.name === watch(country)
                                  ) || null
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Country"
                                    variant="outlined"
                                  />
                                )}
                              />
                            )}
                          />
                        </div>
                        <div className="col p0">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control pl4 pr4 text-center"
                              {...register(`${country}Percentage`)}
                              onKeyPress={handlePercentageMax}
                            />
                            <span className="input-group-text">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-md-4 col-sm-12">
                  <div className="form-group flex-row">
                    {/* <button className="btn cmnbtn btn-primary mt24">
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button> */}
                    <input
                      type="file"
                      accept="image/*"
                      id="countryFileInput"
                      style={{ display: "none" }}
                      {...register("countryImage")}
                      onInputCapture={(event) =>
                        handleFileChange(event, "countryImage")
                      }
                    />

                    <button
                      type="button"
                      className="btn cmnbtn btn-primary mt-4 "
                      onClick={() =>
                        document.getElementById("countryFileInput").click()
                      }
                    >
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button>
                    {isCountryEmpty ? (
                      <PiImageSquareDuotone size={50} />
                    ) : (
                      <>
                        {imagePreview.countryImage ? (
                          <img
                            className="profile-holder-1 mt-4"
                            src={imagePreview.countryImage}
                            alt="Selected"
                            style={{ maxWidth: "50px", maxHeight: "50px" }}
                          />
                        ) : (
                          <img
                            className="profile-holder-1 mt-4"
                            src={countryImageURL}
                            alt="Selected"
                            style={{ maxWidth: "50px", maxHeight: "50px", cursor:'pointer'}}
                            onClick={()=>handleModalImage(countryImageURL)}
                            data-toggle="modal" data-target="#myModal"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Age Group</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>13 - 17</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={handlePercentageMax}
                        {...register("ageGroup1")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>18 - 24</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        // onKeyPress={(event) => {
                        //   if (!/[0-9]/.test(event.key)) {
                        //     event.preventDefault();
                        //   }
                        // }}
                        onKeyPress={handlePercentageMax}
                        {...register("ageGroup2")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>25 - 34</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={handlePercentageMax}
                        {...register("ageGroup3")}
                      />

                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>35 - 44</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={handlePercentageMax}
                        {...register("ageGroup4")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>45 - 54</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={handlePercentageMax}
                        {...register("ageGroup5")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>55 - 64</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={handlePercentageMax}
                        {...register("ageGroup6")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>65+</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onKeyPress={handlePercentageMax}
                        {...register("ageGroup7")}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group flex-row">
                    {/* <button className="btn cmnbtn btn-primary mt24">
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button> */}
                    <input
                      type="file"
                      accept="image/*"
                      id="ageFileInput"
                      style={{ display: "none" }}
                      {...register("ageGroupImage")}
                      onInputCapture={(event) =>
                        handleFileChange(event, "ageGroupImage")
                      }
                    />

                    <button
                      type="button"
                      className="btn cmnbtn btn-primary mt24"
                      onClick={() =>
                        document.getElementById("ageFileInput").click()
                      }
                    >
                      <i className="bi bi-cloud-arrow-up-fill"></i> Image
                    </button>
                    {isAgeEmpty ? (
                      <PiImageSquareDuotone size={50} />
                    ) : (
                      <>
                        {imagePreview.ageGroupImage ? (
                          <img
                            className="profile-holder-1 mt-4"
                            src={imagePreview.ageGroupImage}
                            alt="Selected"
                            style={{ maxWidth: "50px", maxHeight: "50px" }}
                          />
                        ) : (
                          <img
                            className="profile-holder-1 mt-4"
                            src={ageImageURL}
                            alt="Selected"
                            style={{ maxWidth: "50px", maxHeight: "50px" }}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <p className="mt24 dangerText">
                      Note: Total percentage must be at least 98%
                    </p>
                  </div>
                </div>    */}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Gender</h5>
            </div>
            <div className="card-body pb8">
              <div className="row thm_form">
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Male</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("menPercentage", {})}
                        onKeyPress={handlePercentageMax}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                    {<div className="h-2"></div>}
                  </div>
                </div>
                <div className="col-md-4 col-sm-12">
                  <div className="form-group">
                    <label>Female</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        {...register("womenPercentage")}
                        onKeyPress={handlePercentageMax}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flexCenter colGap16">
                <button
                  disabled={isFormsubmitting}
                  className="btn cmnbtn btn-primary"
                  type="submit"
                >
                  Save
                </button>
                <button className="btn cmnbtn btn-secondary" type="button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </FormControl>
      </div>
    </>
  );
}
