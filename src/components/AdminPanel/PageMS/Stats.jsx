import { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import {
  Autocomplete,
  Button,
  InputAdornment,
  TextField,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { Country } from "country-state-city";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseUrl } from "../../../utils/config";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";

export default function Stats() {
  const [statesFor, setStatesFor] = useState(null);
  const [stateForIsValid, setStateForIsValid] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState("");
  const [quater, setQuater] = useState("");
  const [stateForIsNotQuater, setStateForIsNotQuater] = useState(false);
  const [reach, setReach] = useState();
  const [reachValidation, setReachValidation] = useState(true);
  const [reachImgSrc, setReachImgSrc] = useState(null);
  const [reachImg, setReachImg] = useState(null);
  const [impression, setImpression] = useState();
  const [impressionValidation, setImpressionValidation] = useState(true);
  const [impressionImgSrc, setImpressionImgSrc] = useState(null);
  const [impressionImg, setImpressionImg] = useState(null);
  const [engagementImg, setEngagementImg] = useState();
  const [storyViewImg, setStoryViewImg] = useState();
  const [storyViewVideo, setStoryViewVideo] = useState();
  const [city1, setCity1] = useState();
  const [city2, setCity2] = useState();
  const [city3, setCity3] = useState();
  const [city4, setCity4] = useState();
  const [city5, setCity5] = useState();
  const [city1Percentage, setCity1Percentage] = useState();
  const [city2Percentage, setCity2Percentage] = useState();
  const [city3Percentage, setCity3Percentage] = useState();
  const [city4Percentage, setCity4Percentage] = useState();
  const [city5Percentage, setCity5Percentage] = useState();
  const [cityImg, setCityImg] = useState();
  const [malePercentage, setMalePercentage] = useState();
  const [femalePercentage, setFemalePercentage] = useState();
  const [age1Percentage, setAge1Percentage] = useState();
  const [age2Percentage, setAge2Percentage] = useState();
  const [age3Percentage, setAge3Percentage] = useState();
  const [age4Percentage, setAge4Percentage] = useState();
  const [age5Percentage, setAge5Percentage] = useState();
  const [age6percentage, setAge6Percentage] = useState();
  const [age7Percentage, setAge7Percentage] = useState();
  const [ageImg, setAgeImg] = useState("");
  const [profileVisit, setProfileVisit] = useState();
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [cityListTemp, setCityListTemp] = useState();
  const [country1, setCountry1] = useState("");
  const [country2, setCountry2] = useState("");
  const [country3, setCountry3] = useState("");
  const [country4, setCountry4] = useState("");
  const [country5, setCountry5] = useState("");
  const [country1Percentage, setCountry1Percentage] = useState();
  const [country2Percentage, setCountry2Percentage] = useState();
  const [country3Percentage, setCountry3Percentage] = useState();
  const [country4Percentage, setCountry4Percentage] = useState();
  const [country5Percentage, setCountry5Percentage] = useState();
  const [countryImg, setCountryImg] = useState();

  const [totalPercentage, setTotalPercentage] = useState();
  const [engagementImgSrc, setEngagementImgSrc] = useState(null);
  const [storyViewImgSrc, setStoryViewImgSrc] = useState(null);
  const [storyViewVideoSrc, setStoryViewVideoSrc] = useState(null);
  const [countryImgSrc, setCountryImgSrc] = useState(null);
  const [cityImgSrc, setCityImgSrc] = useState(null);
  const [ageImgSrc, setAgeImgSrc] = useState(null);
  const [engagement, setEngagement] = useState();
  const [engagementValidation, setEngagementValidation] = useState(true);
  const [storyView, setStoryView] = useState();
  const [storyViewValidation, setStoryViewValidation] = useState(true);
  const [storyViewDate, setStoryViewDate] = useState("");
  const [countryListTemp, setCountryListTemp] = useState([]);
  const rowData= useSelector((state) => state.executon.row);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const { toastAlert } = useGlobalContext();
const navigation = useNavigate();
  const dropdownStaticData = [
    "Daily",
    "Weekly",
    "Fortnight",
    "Monthly",
    "Quarterly",
  ];

  const QuarterStaticData = [
    "Quater 1 (Jan-Mar)",
    "Quater 2 (Apr-Jun)",
    "Quater 3 (Jul-Sep)",
    "Quater 4 (Oct-Dec)",
  ];

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleStartDateChange = (newValue) => {
    const date = new Date(newValue.$d);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    const date = new Date(newValue.$d);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    setEndDate(newValue);
  };

  const handleStoryViewDateChange = (newValue) => {
    const date = new Date(newValue.$d);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    setStoryViewDate(newValue);
  };

  const cityCopyValidation = (selectedCity) => {
    setTimeout(() => {
        // console.log(selectedCity,"selectedCity, city")
      if (selectedCity === null || selectedCity == "") {
        let temp = cityListTemp.filter(
          (city) => ![city1, city2, city3, city4, city5].includes(city)
        );
        setCityList(prev=>[...temp, prev]);
        return;
      }
      const newCityList = cityListTemp.filter(
        (city) =>
          city !== selectedCity &&
          ![city1, city2, city3, city4, city5].includes(city)
      );
      setCityList(newCityList);
    }, 400);
  };

  const handlePercentageChange = (value, setter) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setter(newValue);
    }
  };

  useEffect(() => {
    setCountryList(Country.getAllCountries());
    setCountryListTemp(Country.getAllCountries());
    axios.get(baseUrl + "get_all_cities").then((res) => {
        setCityListTemp(res.data.data.map((city) => city.city_name));
        setCityList(res.data.data.map((city) => city.city_name));
      });
  
  }, []);

  const countryCopyValidation = (selectedCountry, country) => {
    setTimeout(() => {
      if (selectedCountry === null) {
        let temp = countryListTemp.filter(
          (e) =>
            ![country1, country2, country3, country4, country5].includes(e.name)
        );
        const addCountry = countryListTemp.filter((e) => e.name === country);
        setCountryList([...temp, ...addCountry]);
        return;
      }

      const newCountryList = countryListTemp.filter(
        (country) =>
          country.name !== selectedCountry &&
          ![country1, country2, country3, country4, country5].includes(
            country.name
          )
      );

      setCountryList(newCountryList);
    }, 400);
  };

  const saveStats = async (e) => {
    e.preventDefault();

    const preSDate = new Date(startDate);
    preSDate.setDate(preSDate.getDate() + 1);
    const sDate = preSDate.toISOString();

    const preEDate = new Date(endDate);
    preEDate.setDate(preEDate.getDate() + 1);
    const eDate = preEDate.toISOString();

    const preSVDate = new Date(storyViewDate);
    preSVDate.setDate(preSVDate.getDate() + 1);
    const svDate = preSVDate != "Invalid Date" ? preSVDate?.toISOString() : "";

    const formData = new FormData();
    // console.log(rowData[0], "rowdata")
    // console.log(rowData[0].pageMast_id, "rowdata")
    // formData.append("p_id", rowData[0].exepurchasemodel.p_id);
    formData.append("pageMast_id", rowData[0]?.pageMast_id);
    formData.append("reach", reach);
    formData.append("impression", impression ? impression : 0);
    formData.append("engagement", engagement ? engagement : 0);
    formData.append("story_view", storyView ? storyView : 0);
    // demoFile ? formData.append("media", demoFile) : "";
    quater ? formData.append("quater", quater) : "";
    formData.append("start_date", sDate);
    formData.append("story_view_date", svDate);
    formData.append("end_date", eDate);
    formData.append("stats_for", statesFor);
    formData.append("impression_upload_image", impressionImg);
    formData.append("reach_upload_image", reachImg);
    formData.append("engagement_upload_image", engagementImg);
    formData.append("story_view_upload_image", storyViewImg);
    formData.append("story_view_upload_video", storyViewVideo);
    formData.append("city_image_upload", cityImg);
    formData.append("Age_upload", ageImg);
    formData.append("city1_name", city1);
    formData.append("city2_name", city2);
    formData.append("city3_name", city3);
    formData.append("city4_name", city4);
    formData.append("city5_name", city5);
    formData.append(
      "percentage_city1_name",
      city1Percentage ? city1Percentage : 0
    );
    formData.append(
      "percentage_city2_name",
      city2Percentage ? city2Percentage : 0
    );
    formData.append(
      "percentage_city3_name",
      city3Percentage ? city3Percentage : 0
    );
    formData.append(
      "percentage_city4_name",
      city4Percentage ? city4Percentage : 0
    );
    formData.append(
      "percentage_city5_name",
      city5Percentage ? city5Percentage : 0
    );
    formData.append("male_percent", malePercentage ? malePercentage : 0);
    formData.append("female_percent", femalePercentage ? femalePercentage : 0);
    formData.append("Age_13_17_percent", age1Percentage ? age1Percentage : 0);
    formData.append("Age_18_24_percent", age2Percentage ? age2Percentage : 0);
    formData.append("Age_25_34_percent", age3Percentage ? age3Percentage : 0);
    formData.append("Age_35_44_percent", age4Percentage ? age4Percentage : 0);
    formData.append("Age_45_54_percent", age5Percentage ? age5Percentage : 0);
    formData.append("Age_55_64_percent", age6percentage ? age6percentage : 0);
    formData.append("Age_65_plus_percent", age7Percentage ? age7Percentage : 0);
    formData.append("profile_visit", profileVisit ? profileVisit : 0);
    formData.append("country1_name", country1);
    formData.append("country2_name", country2);
    formData.append("country3_name", country3);
    formData.append("country4_name", country4);
    formData.append("country5_name", country5);
    formData.append(
      "percentage_country1_name",
      country1Percentage ? country1Percentage : 0
    );
    formData.append(
      "percentage_country2_name",
      country2Percentage ? country2Percentage : 0
    );
    formData.append(
      "percentage_country3_name",
      country3Percentage ? country3Percentage : 0
    );
    formData.append(
      "percentage_country4_name",
      country4Percentage ? country4Percentage : 0
    );
    formData.append(
      "percentage_country5_name",
      country5Percentage ? country5Percentage : 0
    );
    formData.append("country_image_upload", countryImg);
    formData.append("user_id", userID);

    axios
    //   .post(`${baseUrl}` + `add_exe_pid_history`, formData, {
      .post(`${baseUrl}` + `add_exe_history`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        // setReachkey((perv) => perv + 1);
        // callDataForLoad();
        setQuater("");
        setStatesFor(null);
        setStartDate(null);
        setEndDate(null);
        setReach();
        setImpression();
        setEngagement();
        setStoryView();
        // setRowData({});
        setCity1("");
        setCity2("");
        setCity3("");
        setCity4("");
        setCity5("");
        setCity1Percentage();
        setCity2Percentage();
        setCity3Percentage();
        setCity4Percentage();
        setCity5Percentage();
        setMalePercentage();
        setFemalePercentage();
        setAge1Percentage();
        setAge2Percentage();
        setAge3Percentage();
        setAge4Percentage();
        setAge5Percentage();
        setAge6Percentage();
        setAge7Percentage();
        setAgeImg(null);
        setCityImg(null);
        setReachImg(null);
        setImpressionImg(null);
        setEngagementImg("");
        setStoryViewImg("");
        setStoryViewVideo("");
        setProfileVisit();
        setCountry1("");
        setCountry2("");
        setCountry3("");
        setCountry4("");
        setCountry5("");
        setCountry1Percentage();
        setCountry2Percentage();
        setCountry3Percentage();
        setCountry4Percentage();
        setCountry5Percentage();
        setCountryImg();
        setCityImgSrc(null);
        setCountryImgSrc(null);
        setAgeImgSrc(null);
        // setReachAndImpressionimgSrc(null);
        setImpressionImgSrc(null);
        setEngagementImgSrc(null);
        setStoryViewImgSrc(null);
        setStoryViewVideoSrc(null);
        setStoryViewDate(null);

        toastAlert("Form Submitted success");
      return  navigation("/admin/pms-page-overview");
      });
  };

  return (
    <div>
      <FormContainer mainTitle="Add Stats" link="/ip-master" />
      <div className="card">
        <div className="card-body sb flex-row">
          <h4 className="ml-3 w-25">Stats History</h4>
          <div className="flex-row  justify-content-end w-100 gap16">
            <div></div>
            <Autocomplete
              sx={{ minWidth: 300, maxWidth: 400 }}
              className="w-100"
              disablePortal
              id="combo-box-demo"
              options={dropdownStaticData}
              onChange={(e, value) => {
                setStatesFor(value),
                  value !== "Quarterly"
                    ? setStateForIsNotQuater(true)
                    : setStateForIsNotQuater(false);
                value?.length > 0
                  ? setStateForIsValid(true)
                  : setStateForIsValid(false);
                value == "Daily" ? setStartDate(dayjs()) : setStartDate("");
                value == "Daily" ? setEndDate(dayjs()) : setEndDate("");
              }}
              value={statesFor}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stats for *"
                  helperText={!stateForIsValid ? "Please select an option" : ""}
                />
              )}
            />

            {statesFor !== "Quarterly" && statesFor !== null && (
              // stateForIsNotQuater &&
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date *"
                  format="DD/MM/YY"
                  value={startDate}
                  onChange={(newValue) => {
                    handleStartDateChange(newValue);
                    statesFor == "Daily" ? setEndDate(newValue) : "";
                  }}
                />
              </LocalizationProvider>
            )}

            {statesFor !== null && statesFor !== "Quarterly" && (
              // stateForIsNotQuater &&
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date *"
                  format="DD/MM/YY"
                  value={endDate}
                  onChange={(newValue) => {
                    handleEndDateChange(newValue);
                  }}
                />
              </LocalizationProvider>
            )}
            {statesFor == "Quarterly" && !stateForIsNotQuater && (
              // !stateForIsNotQuater &&
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={QuarterStaticData}
                onChange={(e, value) => {
                  setQuater(value);
                }}
                value={quater}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Quater *"
                    // error={!quaterIsValid}
                    // helperText={!quaterIsValid ? "Please select an option" : ""}
                  />
                )}
              />
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Followers Bifurcation</h4>
        </div>
        <div className="card-body body-padding gap16 flex-col">
          <div className="row">
            <div className="col-md-6">
              <div className=" flex-col gap16">
                <TextField
                  label="Reach *"
                  type="number"
                  value={reach}
                  onChange={(e) => {
                    e.target.value > 0
                      ? setReachValidation(true)
                      : setReachValidation(false),
                      setReach(e.target.value);
                  }}
                  error={!reachValidation}
                  helperText={
                    !reachValidation ? "Please enter a valid Count" : ""
                  }
                />
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  className="btn cmnbtn btn-wid btn_sm btn-primary"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  title="Reach"
                >
                  Image
                  <VisuallyHiddenInput
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const imageUrl = URL.createObjectURL(uploadedFile);
                        setReachImgSrc(imageUrl);
                        setReachImg(uploadedFile);
                      }
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>

                {reachImgSrc && (
                  <div className="d-flex thm_pr">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={reachImgSrc}
                      className="mt-1"
                      alt="Uploaded"
                    />{" "}
                    <Button
                      className="btn cmnbtn btn-wid btn_sm btn-primary"
                      size="small"
                      onClick={() => {
                        setReachImgSrc(null);
                        setReachImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="flex-col gap16">
                <TextField
                  label="Impressions *"
                  type="number"
                  value={impression}
                  // fieldGrid={4}
                  onChange={(e) => {
                    e.target.value > 0
                      ? setImpressionValidation(true)
                      : setImpressionValidation(false),
                      setImpression(e.target.value);
                  }}
                  error={!impressionValidation}
                  helperText={
                    !impressionValidation ? "Please enter a valid Count" : ""
                  }
                />
                <Button
                  component="label"
                  variant="contained"
                  className="btn cmnbtn btn-wid btn_sm btn-primary"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  title="Impression"
                >
                  Image
                  <VisuallyHiddenInput
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const imageUrl = URL.createObjectURL(uploadedFile);
                        setImpressionImgSrc(imageUrl);
                        setImpressionImg(uploadedFile);
                      }
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>

                {impressionImgSrc && (
                  <div className="d-flex thm_pr">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={impressionImgSrc}
                      className="mt-1"
                      alt="Uploaded"
                    />{" "}
                    <Button
                      size="small"
                      className="btn cmnbtn btn-wid btn_sm btn-primary"
                      onClick={() => {
                        setImpressionImgSrc(null);
                        setImpressionImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="flex-col gap16">
                <TextField
                  label="Engagement *"
                  type="number"
                  value={engagement}
                  // fieldGrid={4}
                  onChange={(e) => {
                    const enteredValue = e.target.value;
                    if (enteredValue >= 0) {
                      setEngagementValidation(true);
                      setEngagement(enteredValue);
                    } else {
                      setEngagementValidation(false);
                    }
                  }}
                  error={!engagementValidation}
                  helperText={
                    !engagementValidation ? "Please enter a valid Count" : ""
                  }
                />
                <Button
                  component="label"
                  variant="contained"
                  className="btn cmnbtn btn-wid btn_sm btn-primary"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                >
                  Image
                  <VisuallyHiddenInput
                    onChange={(e) => {
                      const uploadedFile = e.target.files[0];
                      if (uploadedFile) {
                        const imageUrl = URL.createObjectURL(uploadedFile);
                        setEngagementImgSrc(imageUrl);
                        setEngagementImg(uploadedFile);
                      }
                    }}
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>
                {engagementImgSrc && (
                  <div className="flexCenter colgap16 gap16">
                    <img
                      style={{ width: "50px", height: "50px" }}
                      src={engagementImgSrc}
                      alt="Uploaded"
                    />

                    <Button
                      className="btn cmnbtn btn-wid btn_sm btn-primary"
                      size="small"
                      onClick={() => {
                        setEngagementImgSrc(null);
                        setEngagementImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="flex-col gap16">
                <TextField
                  label="Story View *"
                  type="number"
                  value={storyView}
                  // fieldGrid={4}
                  onChange={(e) => {
                    e.target.value > 0
                      ? setStoryViewValidation(true)
                      : setStoryViewValidation(false),
                      setStoryView(e.target.value);
                  }}
                  error={!storyViewValidation}
                  helperText={
                    !storyViewValidation ? "Please enter a valid Count" : ""
                  }
                />
                <div className="flex-row  gap16">
                  <Button
                    className="btn cmnbtn btn-wid btn_sm btn-primary"
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    size="small"
                  >
                    image
                    <VisuallyHiddenInput
                      onChange={(e) => {
                        const uploadedFile = e.target.files[0];
                        if (uploadedFile) {
                          const imageUrl = URL.createObjectURL(uploadedFile);
                          setStoryViewImgSrc(imageUrl);
                          setStoryViewImg(uploadedFile);
                        }
                      }}
                      type="file"
                      accept="image/png, image/jpeg"
                    />
                  </Button>
                  <Button
                    component="label"
                    variant="contained"
                    className="btn cmnbtn btn-wid btn_sm btn-primary"
                    startIcon={<CloudUploadIcon />}
                    size="small"
                  >
                    Video
                    <VisuallyHiddenInput
                      onChange={(e) => {
                        const uploadedFile = e.target.files[0];
                        if (uploadedFile) {
                          const videoUrl = URL.createObjectURL(uploadedFile);
                          setStoryViewVideoSrc(videoUrl); // Set the video URL in state for preview
                          setStoryViewVideo(uploadedFile); // Set the uploaded video in state
                        }
                      }}
                      type="file"
                      accept="video/mp4,video/avi"
                    />
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="flexCenter colgap16">
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Story View Date"
                      format="DD/MM/YY"
                      value={storyViewDate}
                      onChange={(newValue) => {
                        handleStoryViewDateChange(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </>

                {storyViewImgSrc && (
                  <div className="d-flex">
                    <img
                      style={{ height: "50px", width: "50px" }}
                      src={storyViewImgSrc}
                      alt="Uploaded"
                    />{" "}
                    <Button
                      size="small"
                      className="btn cmnbtn btn-wid btn_sm btn-primary"
                      onClick={() => {
                        setStoryViewImgSrc(null);
                        setStoryViewImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
                {storyViewVideoSrc && (
                  <div className="d-flex align-items-center">
                    <video
                      style={{ height: "50px", width: "50px" }}
                      src={storyViewVideoSrc}
                      // controls

                      alt="Uploaded Video"
                    />
                    <Button
                      size="small"
                      className="btn cmnbtn btn-wid btn_sm btn-primary"
                      onClick={() => {
                        setStoryViewVideoSrc(null);
                        setStoryViewVideo(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <TextField
                className="w-100"
                label="Profile Visit"
                type="number"
                value={profileVisit}
                onChange={(e) => setProfileVisit(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">City</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  className="w-100"
                  id="combo-box-demo"
                  value={city1}
                  options={cityList.map((city) => city)}
                  onChange={(e, value) => {
                    cityCopyValidation(value);
                    setCity1(value);
                  }}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="City 1" />
                  )}
                />
                <TextField
                  className="w-50"
                  type="number"
                  value={city1Percentage}
                  onChange={(e) => {
                    setCity1Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  className="w-100"
                  id="combo-box-demo"
                  value={city2}
                  options={cityList.map((city) => city)}
                  onChange={(e, value) => {
                    setCity2(value);
                    cityCopyValidation(value);
                  }}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="City 2" />
                  )}
                />
                <TextField
                  className="w-50"
                  value={city2Percentage}
                  onChange={(e) => {
                    setCity2Percentage(e.target.value);
                  }}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  className="w-100"
                  id="combo-box-demo"
                  value={city3}
                  options={cityList.map((city) => city)}
                  onChange={(e, value) => {
                    setCity3(value);
                    cityCopyValidation(value);
                  }}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="City 3" />
                  )}
                />
                <TextField
                  className="w-50"
                  type="number"
                  value={city3Percentage}
                  onChange={(e) => {
                    setCity3Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  className="w-100"
                  id="combo-box-demo"
                  value={city4}
                  options={cityList.map((city) => city)}
                  onChange={(e, value) => {
                    setCity4(value);
                    cityCopyValidation(value);
                  }}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="City 4" />
                  )}
                />
                <TextField
                  className="w-50"
                  type="number"
                  value={city4Percentage}
                  onChange={(e) => {
                    setCity4Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  className="w-100"
                  id="combo-box-demo"
                  value={city5}
                  options={cityList.map((city) => city)}
                  onChange={(e, value) => {
                    setCity5(value);
                    cityCopyValidation(value);
                  }}
                  sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="City 5" />
                  )}
                />
                <TextField
                  className="w-50"
                  type="number"
                  value={city5Percentage}
                  onChange={(e) => {
                    setCity5Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  className="btn cmnbtn btn-wid btn_sm btn-primary"
                  onChange={(e) => {
                    const uploadedFile = e.target.files[0];
                    if (uploadedFile) {
                      const imageUrl = URL.createObjectURL(uploadedFile);
                      setCityImgSrc(imageUrl);
                      setCityImg(uploadedFile);
                    }
                  }}
                >
                  Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                {cityImgSrc && (
                  <div className="d-flex align-items-center">
                    <img
                      style={{ height: "50px", width: "50px" }}
                      src={cityImgSrc}
                      className="mt-1"
                      alt="Image Uploaded"
                    />
                    <Button
                      size="small"
                      className="btn cmnbtn btn-wid btn_sm btn-primary"
                      onClick={() => {
                        setCityImgSrc(null);
                        setCityImg(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Country</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  className="w-100"
                  id="combo-box-demo"
                  value={country1}
                  options={countryList.map((country) => country.name)}
                  onChange={(e, value) => {
                    countryCopyValidation(value);
                    setCountry1(value);
                  }}
                  // sx={{ width: 250 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 1" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="w-50"
                  type="number"
                  value={country1Percentage}
                  onChange={(e) => {
                    setCountry1Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  disablePortal
                  value={country2}
                  onChange={(e, value) => {
                    countryCopyValidation(value);
                    setCountry2(value);
                  }}
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 2" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="w-50"
                  value={country2Percentage}
                  onChange={(e) => {
                    setCountry2Percentage(e.target.value);
                  }}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  disablePortal
                  value={country3}
                  onChange={(e, value) => {
                    setCountry3(value);
                    countryCopyValidation(value);
                  }}
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 3" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="w-50"
                  type="number"
                  value={country3Percentage}
                  onChange={(e) => {
                    setCountry3Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  value={country4}
                  onChange={(e, value) => {
                    setCountry4(value);
                    countryCopyValidation(value);
                  }}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 4" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="w-50"
                  type="number"
                  value={country4Percentage}
                  onChange={(e) => {
                    setCountry4Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={countryList.map((country) => country.name)}
                  value={country5}
                  onChange={(e, value) => {
                    setCountry5(value);
                    countryCopyValidation(value);
                  }}
                  // sx={{ width: 150 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Country 5" />
                  )}
                />
                <TextField
                  // style={{ width: "10%" }}
                  className="w-50"
                  type="number"
                  value={country5Percentage}
                  onChange={(e) => {
                    setCountry5Percentage(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="flex-col gap16">
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                  className="btn cmnbtn btn-wid btn_sm btn-primary"
                  onChange={(e) => {
                    const uploadedFile = e.target.files[0];
                    if (uploadedFile) {
                      const imageUrl = URL.createObjectURL(uploadedFile);
                      setCountryImgSrc(imageUrl);
                      setCountryImg(uploadedFile);
                    }
                  }}
                >
                  Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/png, image/jpeg"
                  />
                </Button>
                {countryImgSrc && (
                  <div className="d-flex align-items-center">
                    <img
                      style={{ height: "50px", width: "50px" }}
                      src={countryImgSrc}
                      className="mt-1"
                      alt="Country Image Uploaded"
                    />
                    <Button
                      size="small"
                      className="btn cmnbtn btn-wid btn_sm btn-primary"
                      onClick={() => {
                        setCountryImg(null);
                        setCountryImgSrc(null);
                      }}
                    >
                      <CloseTwoToneIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Age Group</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-4 mb-3">
              <TextField
                label="13-17"
                type="number"
                className="w-100"
                value={age1Percentage}
                onChange={(e) =>
                  handlePercentageChange(e.target.value, setAge1Percentage)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4 mb-3">
              <TextField
                label="18-24"
                type="number"
                className="w-100"
                value={age2Percentage}
                onChange={(e) =>
                  handlePercentageChange(e.target.value, setAge2Percentage)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4 mb-3">
              <TextField
                label="25-34"
                type="number"
                className="w-100"
                value={age3Percentage}
                onChange={(e) =>
                  handlePercentageChange(e.target.value, setAge3Percentage)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4 mb-3">
              <TextField
                label="35-44"
                type="number"
                className="w-100"
                value={age4Percentage}
                onChange={(e) =>
                  handlePercentageChange(e.target.value, setAge4Percentage)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4 mb-3">
              <TextField
                label="45-54"
                type="number"
                className="w-100"
                value={age5Percentage}
                onChange={(e) =>
                  handlePercentageChange(e.target.value, setAge5Percentage)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4 mb-3">
              <TextField
                label="55-64"
                type="number"
                className="w-100"
                value={age6percentage}
                onChange={(e) => {
                  setAge6Percentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4 mb-3">
              <TextField
                label="65+"
                type="number"
                className="w-100"
                value={age7Percentage}
                onChange={(e) => {
                  setAge7Percentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4 mb-3">
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                size="small"
                className="btn cmnbtn btn-wid btn_sm btn-primary"
                onChange={(e) => {
                  const uploadedFile = e.target.files[0];
                  if (uploadedFile) {
                    const imageUrl = URL.createObjectURL(uploadedFile);
                    setAgeImgSrc(imageUrl);
                    setAgeImg(uploadedFile);
                  }
                }}
              >
                Image
                <VisuallyHiddenInput
                  type="file"
                  accept="image/png, image/jpeg"
                />
              </Button>

              {ageImgSrc && (
                <div className="d-flex align-items-center">
                  <img
                    style={{ height: "50px", width: "50px" }}
                    src={ageImgSrc}
                    className="mt-1"
                    alt="Age Image Uploaded"
                  />
                  <Button
                    size="small"
                    className="btn cmnbtn btn-wid btn_sm btn-primary"
                    onClick={() => {
                      setAgeImgSrc(null);
                      setAgeImg(null);
                    }}
                  >
                    <CloseTwoToneIcon />
                  </Button>
                </div>
              )}
            </div>
            <div className="col-sm-4 mb-3">
              {totalPercentage < 98 && (
                <span style={{ color: "red" }}>
                  Total percentage must be at least 98%
                </span>
              )}
              {totalPercentage > 100 && (
                <span style={{ color: "red" }}>
                  Total percentage cannot exceed 100%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Gender</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-4">
              <TextField
                label="Male"
                className="w-100"
                type="number"
                value={malePercentage}
                onChange={(e) => {
                  setMalePercentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
            <div className="col-sm-4">
              <TextField
                label="Female"
                type="number"
                className="w-100"
                value={femalePercentage}
                onChange={(e) => {
                  setFemalePercentage(e.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={saveStats}
        type="button"
        className="btn cmnbtn btn-success mt-3 mb-3"
        data-dismiss="modal"
      >
        Save
      </button>
    </div>
  );
}
