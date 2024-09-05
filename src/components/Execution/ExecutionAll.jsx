import React from "react";
import Stack from "@mui/material/Stack";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { DataGrid, GridColumnMenu, GridToolbar } from "@mui/x-data-grid";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
// import CircularWithValueLabel from "../InstaApi.jsx/CircularWithValueLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../Context/Context";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { Country, City } from "country-state-city";
import { param } from "jquery";
import CloseTwoToneIcon from "@mui/icons-material/CloseTwoTone";
import { add, set } from "date-fns";
import ContentLoader, { Facebook } from "react-content-loader";
import { baseUrl } from "../../utils/config";
import FormContainer from "../AdminPanel/FormContainer";
import { FacebookLogo, InstagramLogo, TelegramLogo, ThreadsLogo, TwitterLogo } from "@phosphor-icons/react";
import { Twitter } from "@mui/icons-material";
import { YoutubeLogo } from "@phosphor-icons/react/dist/ssr";


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
const viewInOptions = ["Millions", "Thousands", "Default"];
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function ExecutionAll() {
  const { toastAlert } = useGlobalContext();
  const [rows, setRows] = useState([]);
  const [pagemode, setPagemode] = useState(1);
  const [alldata, setAlldata] = useState([]);
  const [viewType, setViewType] = useState("Default");
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [reach, setReach] = useState();
  const [impression, setImpression] = useState();
  const [engagement, setEngagement] = useState();
  const [storyView, setStoryView] = useState();
  const [rowData, setRowData] = useState({});
  const [statesFor, setStatesFor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [storyViewDate, setStoryViewDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [demoFile, setDemoFile] = useState();
  const [stateForIsValid, setStateForIsValid] = useState(false);
  const [stateForIsNotQuater, setStateForIsNotQuater] = useState(false);
  const [quater, setQuater] = useState("");
  const [quaterIsValid, setQuaterIsValid] = useState(false);
  const [reachValidation, setReachValidation] = useState(true);
  const [impressionValidation, setImpressionValidation] = useState(true);
  const [engagementValidation, setEngagementValidation] = useState(true);
  const [storyViewValidation, setStoryViewValidation] = useState(true);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [contextData, setContextData] = useState(false);
  const [alert, setAlert] = useState([]);
  const [openExeDialog, setOpenExeDialog] = React.useState(false);
  // const [reachandImpressionImg, setReachandImpressionImg] = useState();
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

  const [profileVisitError, setProfileVisitError] = useState(false);
  // const [reachAndImpressionimgSrc, setReachAndImpressionimgSrc] =
  //   useState(null);
  const [impressionImgSrc, setImpressionImgSrc] = useState(null);
  const [engagementImgSrc, setEngagementImgSrc] = useState(null);
  const [storyViewImgSrc, setStoryViewImgSrc] = useState(null);
  const [storyViewVideoSrc, setStoryViewVideoSrc] = useState(null);
  const [countryImgSrc, setCountryImgSrc] = useState(null);
  const [cityImgSrc, setCityImgSrc] = useState(null);
  const [ageImgSrc, setAgeImgSrc] = useState(null);
  const [reachImgSrc, setReachImgSrc] = useState(null);
  const [reachImg, setReachImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reachkey, setReachkey] = useState(1);
  const [countryListTemp, setCountryListTemp] = useState([]);
  const handlePercentageChange = (value, setter) => {
    const newValue = parseFloat(value);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setter(newValue);
    }
  };

  useEffect(() => {
    const sum =
      age1Percentage +
      age2Percentage +
      age3Percentage +
      age4Percentage +
      age5Percentage +
      +age6percentage +
      +age7Percentage;
    setTotalPercentage(sum);
  }, [
    age1Percentage,
    age2Percentage,
    age3Percentage,
    age4Percentage,
    age5Percentage,
    age6percentage,
    age7Percentage,
  ]);

  useEffect(() => {
    setCountryList(Country.getAllCountries());
    setCountryListTemp(Country.getAllCountries());

    axios.get(baseUrl + "get_all_cities").then((res) => {
      setCityListTemp(res.data.data.map((city) => city.city_name));
      setCityList(res.data.data.map((city) => city.city_name));
    });

    // setCityList([
    //   ...new Set(City.getCitiesOfCountry("IN").map((city) => city.name)),
    // ]);
  }, []);

  const cityCopyValidation = (selectedCity, city) => {
    setTimeout(() => {
      // Early exit if the selected city is null
      if (selectedCity === null) {
        let temp = cityListTemp.filter(
          (city) => ![city1, city2, city3, city4, city5].includes(city)
        );
        setCityList([...temp, city]);
        return;
      }

      // Filter out the selected city from the city list
      const newCityList = cityListTemp.filter(
        (city) =>
          city !== selectedCity &&
          ![city1, city2, city3, city4, city5].includes(city)
      );

      setCityList(newCityList);
    }, 400);
  };

  const countryCopyValidation = (selectedCountry, country) => {
    setTimeout(() => {
      // Early exit if the selected country is null
      if (selectedCountry === null) {
        let temp = countryListTemp.filter(
          (e) =>
            ![country1, country2, country3, country4, country5].includes(e.name)
        );
        const addCountry = countryListTemp.filter((e) => e.name === country);
        setCountryList([...temp, ...addCountry]);
        return;
      }
      // ... rest of your code

      // Filter out the selected country from the country list
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

  const handleClickOpenExeDialog = () => {
    setOpenExeDialog(true);
  };

  const navigate = useNavigate();

  const handleCloseExeModal = () => {
    setQuater("");
    setStatesFor(null);
    setStartDate(null);
    setEndDate(null);
    setReach();
    setImpression();
    setEngagement();
    setStoryView();
    setRowData({});
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
    setAgeImg();
    setCityImg();
    setImpressionImg();
    setEngagementImg();
    setStoryViewImg();
    setStoryViewVideo();
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
    setImpressionImg(null);
    setEngagementImgSrc(null);
    setStoryViewImgSrc(null);
    setStoryViewVideoSrc(null);
    setStoryViewDate(null);
    setStartDate(null);
    setEndDate(null);
  };

  const dropdownStaticData = [
    "Daily",
    "Weekly",
    "Fortnight",
    "Monthly",
    "Quarterly",
  ];

  const QuarterStaticData = [
    "Quarter 1 (Jan-Mar)",
    "Quarter 2 (Apr-Jun)",
    "Quarter 3 (Jul-Sep)",
    "Quarter 4 (Oct-Dec)",
  ];

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(13, 110, 253)",
      },
    },
  });

  const callDataForLoad = () => {
    setLoading(true);
    axios
      .get(baseUrl + "get_all_purchase_data")
      .then((res) => {
        setLoading(false);

        setAlldata(res.data.result);
        let tempdata = res.data.result.filter((ele) => {
          return ele.platform.toLowerCase() == "instagram";
        });

        setRows(tempdata);

        // for (let i = 0; i < tempdata.length; i++) {
        //   axios
        //     .post(`${baseUrl}`+`get_percentage`, {
        //       p_id: tempdata[i].p_id,
        //     })
        //     .then((res) => {
        //       if (res.status == 200) {
        //         setSetUpdatePercentage((prev) => [...prev, res.data]);
        //       }
        //     });
        // }

        // for (let i = 0; i < tempdata.length; i++) {
        //   axios
        //     .get(
        //       `${baseUrl}`+`get_stats_update_flag/${tempdata[i].p_id}`
        //     )
        //     .then((res) => {
        //       if (res.status == 200) {
        //         setSetStatsUpdateFlag((prev) => [...prev, res.data]);
        //       }
        //     });
        // }
      });
  };

  useEffect(() => {
    callDataForLoad();
    if (userID && contextData == false) {
      axios
        .get(
          `${baseUrl}` + `get_single_user_auth_detail/${userID}`
        )
        .then((res) => {
          if (res.data[33].view_value == 1) {
            setContextData(true);
            setAlert(res.data);
          }
        });
    }
    setTimeout(() => { }, 500);
  }, []);

  const converttoclipboard = (copydata) => {
    const copyData = copydata
      .map((row) => {
        let rowData = "";
        for (const key in row) {
          rowData += `${key}: ${row[key]}\n`;
        }
        return rowData;
      })
      .join("\n");

    // navigator.clipboard
    //   .writeText(copyData)
    //   .then(() => {})
    //   .catch((err) => {
    //     console.error("Unable to copy to clipboard: ", err);
    //   });
    const textarea = document.createElement("textarea");
    textarea.value = copyData;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };
  const option = ["Story", "Post", "Both", "Note"];
  const copySelectedRows = (id) => {
    let copydata = [];
    let set = new Set();

    for (let i = 0; i < rowSelectionModel.length; i++) {
      set.add(rowSelectionModel[i]);
    }
    for (let i = 0; i < rows.length; i++) {
      if (set.has(rows[i].p_id)) {
        let temp = [
          `Page Name : ${rows[i].page_name}`,
          `  Followers ${rows[i].follower_count}`,
          ` Page Link: ${rows[i].page_link}`,
        ];
        if (id == 1 && selectedOptions.includes("Story")) {
          temp.push(`Story : ${rows[i].story}`);
        }
        if (id == 1 && selectedOptions.includes("Post")) {
          temp.push(`Post : ${rows[i].post}`);
        }
        if (id == 1 && selectedOptions.includes("Both")) {
          temp.push(`Both : ${rows[i].both_}`);
        }
        if (id == 1 && selectedOptions.includes("Note")) {
          temp.push(`Note : ${rows[i].note}`);
        }
        copydata.push(temp);
      }
    }

    converttoclipboard(copydata);
  };

  const copyAllRows = () => {
    let copydata = [];
    let Followerscount = 0;
    for (let i = 0; i < rows.length; i++) {
      // if (set.has(alldata[i].p_id)) {
      let temp = [
        `Page Name : ${rows[i].page_name}`,
        `  Followers ${rows[i].follower_count}`,
        ` Page Link: ${rows[i].page_link}`,
      ];
      Followerscount += Number(rows[i].follower_count);
      copydata.push(temp);
    }
    copydata.push([rows.length, Followerscount]);
    converttoclipboard(copydata);
  };

  const handlefilter = (name, id) => {
    let ftrdata = alldata.filter((ele) => {
      return ele.platform == name;
    });

    setRows(ftrdata);
    setPagemode(id);
  };

  const handleStartDateChange = (newValue) => {
    // const date = new Date(newValue.$d);
    // const offset = date.getTimezoneOffset();
    // date.setMinutes(date.getMinutes() - offset);
    setStartDate(newValue.$d);
  };
  const handleStoryViewDateChange = (newValue) => {
    const date = new Date(newValue.$d);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    setStoryViewDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    const date = new Date(newValue.$d);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    setEndDate(newValue);
  };

  const handleHistoryRowClick = (row) => {
    navigate(`/admin/exe-history/${row.p_id}`, { state: row.p_id });
  };
  const formatNumberIndian = (num) => {
    if (!num) return "";
    var x = num.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
      afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
  };

  const handleUpdateRowClick = async (row) => {
    await axios
      .get(`${baseUrl}` + `get_exe_ip_count_history/${row.p_id}`)
      .then((res) => {
        let data = res.data.data.filter((e) => {
          return e.isDeleted !== true;
        });
        console.log(row.p_id, data, "data");
        data = data[data.length - 1];
        navigate(`/admin/exe-update/${data._id}`, { state: row.p_id });
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "platform",
      headerName: "Platform",
      // width: 150,
    },
    pagemode == 1 || pagemode == 2
      ? {
        field: "page_name",
        headerName: "Page Name",
        width: 250,
      }
      : pagemode == 3 || pagemode == 4
        ? {
          field: "account_name",
          headerName: "Account Name",
          // width: 150,
        }
        : {
          field: "channel_username",
          headerName: "Channel Name",
          // width: 150,
        },
    {
      field: "cat_name",
      headerName: "Account Category",
      width: 150,
    },
    pagemode == 1 || pagemode == 2
      ? {
        field: "page_link",
        headerName: "Link",
        renderCell: (params) => {
          const date = params.row.page_link;
          return (
            <div style={{ color: "blue" }}>
              <a href={date} target="blank">
                {date == "" ? "" : "Link"}
              </a>
            </div>
          );
        },
      }
      : pagemode == 3 || pagemode == 4
        ? {
          field: "account_link",
          headerName: "Link",
          renderCell: (params) => {
            const date = params.row.account_link;

            return (
              <div style={{ color: "blue" }}>
                <a href={date} target="blank">
                  {date == "" ? "" : "Link"}
                </a>
              </div>
            );
          },
        }
        : {
          field: "channel_link",
          headerName: "Link",
          renderCell: (params) => {
            const date = params.row.channel_link;
            return (
              <div style={{ color: "blue" }}>
                <a href={date} target="blank">
                  {date == "" ? "" : "Link"}
                </a>
              </div>
            );
          },
        },
    pagemode == 1 || pagemode == 4
      ? {
        field: "follower_count",
        headerName: "Followers",
        renderCell: (params) => {
          const followerCount = params.row.follower_count;
          if (viewType === "Millions") {
            return <span>{(followerCount / 1000000).toFixed(1)}M</span>;
          } else if (viewType === "Thousands") {
            return <span>{(followerCount / 1000).toFixed(2)}K</span>;
          } else {
            return <span>{formatNumberIndian(followerCount)}</span>;
          }
        },
        valueFormatter: (params) => formatNumberIndian(params.value),
      }
      : pagemode == 2
        ? ({
          field: "follower_count",
          headerName: "Followers",
          renderCell: (params) => {
            const followerCount = params.row.follower_count;
            if (viewType === "Millions") {
              return <span>{(followerCount / 1000000).toFixed(1)}M</span>;
            } else if (viewType === "Thousands") {
              return <span>{(followerCount / 1000).toFixed(2)}K</span>;
            } else {
              return <span>{formatNumberIndian(followerCount)}</span>;
            }
          },
          valueFormatter: (params) => formatNumberIndian(params.value),
        },
        {
          field: "page_likes",
          headerName: "Page Likes",
        })
        : {
          field: "subscribers",
          headerName: "Subscribers",
        },

    contextData && {
      field: "update",
      headerName: "Update",
      width: 130,
      renderCell: (params) => {
        const totalPercentage = params.row.totalPercentage;

        return (
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"
            data-toggle="modal"
            data-target="#myModal1"
            disabled={
              totalPercentage == 0 || totalPercentage == 100 ? false : true
            }
          >
            Set Stats
          </button>
        );
      },
    },
    {
      field: "history",
      width: 150,
      headerName: "History",
      renderCell: (params) => {
        return (
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"

            onClick={() => handleHistoryRowClick(params.row)}
            disabled={
              params?.row?.latestEntry?.stats_update_flag
                ? !params?.row?.latestEntry.stats_update_flag
                : true
            }
          >
            See History
          </button>
        );
      },
    },
    {
      field: "statsUpdate",
      width: 150,
      headerName: "Stats Update",
      renderCell: (params) => {
        return (
          <button
            type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"

            onClick={() => handleUpdateRowClick(params.row)}
            disabled={
              params?.row?.latestEntry?.stats_update_flag
                ? !params?.row?.latestEntry.stats_update_flag
                : true
            }
          >
            Update
          </button>
        );
      },
    },
    {
      field: "totalPercentage",
      width: 150,
      headerName: "Stats Update %",
      renderCell: (params) => {
        return Math.round(+params.row.totalPercentage) + "%";
      },
    },
    {
      field: "stats_update_flag ",
      width: 150,
      headerName: "Stats Update Flag",
      renderCell: (params) => {
        const num = params?.row?.latestEntry?.stats_update_flag
          ? params?.row?.latestEntry.stats_update_flag
          : false;
        return num ? "Yes" : "No";
      },
    },
  ];

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
    formData.append("p_id", rowData.p_id);
    formData.append("reach", reach);
    formData.append("impression", impression ? impression : 0);
    formData.append("engagement", engagement ? engagement : 0);
    formData.append("story_view", storyView ? storyView : 0);
    demoFile ? formData.append("media", demoFile) : "";
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
      .post(`${baseUrl}` + `add_exe_pid_history`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setReachkey((perv) => perv + 1);
        callDataForLoad();
        setQuater("");
        setStatesFor(null);
        setStartDate(null);
        setEndDate(null);
        setReach();
        setImpression();
        setEngagement();
        setStoryView();
        setRowData({});
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
      });
  };

  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuColumnsItem: null,
        }}
      />
    );
  }
  const handleOptionChange = (event, value) => {
    setSelectedOptions(value);
  };

  return (
    < >
      <ThemeProvider theme={theme}>
        <div>

          <FormContainer
            mainTitle={"Pages"}
            link={true}
          />
          <div
            className="card body-padding"
          >
            {/* <Typography>h1. Heading</Typography> */}
            < Stack direction="row" justifyContent="space-between">
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={option}
                disableCloseOnSelect
                size="small"
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      // onClick={handleoptions(props.key, props.aria - selected)}
                      // onClick={(e) => e.stopPropagation()}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                style={{ minWidth: 150 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Checkboxes"
                    placeholder="Select"
                  />
                )}
                value={selectedOptions}
                onChange={handleOptionChange}
              />

              <div className=" gap16  sb">

                <Button
                  className="btn  cmnbtn btn-primary"
                  size="small"
                  variant="outlined"
                  startIcon={<ContentCopyOutlinedIcon />}
                  onClick={() => copySelectedRows(1)}
                >
                  Copy Selected Pages
                </Button>
                <Button
                  className="btn  cmnbtn btn-primary"

                  size="small"
                  variant="outlined"
                  startIcon={<CopyAllOutlinedIcon />}
                  onClick={copyAllRows}
                >
                  Copy All Pages
                </Button>
                <Button
                  className="btn  cmnbtn btn-primary"

                  size="small"
                  variant="outlined"
                  startIcon={<ContentPasteIcon />}
                  onClick={() => copySelectedRows(0)}
                >
                  Copy Page Name & Links
                </Button>
              </div>


            </Stack>
          </div>
          {/* Second Paper */}
          <div
            className="card body-padding"
          >

            <Stack className="thm_form flex-row flexCenter colGap16" >

              <Button
                className="btn btn_sm cmnbtn btn-primary"

                size="medium"
                variant="contained"
                onClick={() => handlefilter("Instagram", 1)}
              >
                <InstagramLogo /> Instagram
              </Button>
              <Button
                className="btn btn_sm cmnbtn btn-primary"

                size="medium"
                variant="contained"
                onClick={() => handlefilter("Facebook", 2)}
              >
                <FacebookLogo /> Facebook
              </Button>
              <Button
                className="btn btn_sm cmnbtn btn-primary"

                size="medium"
                variant="contained"
                onClick={() => handlefilter("Telegram", 3)}
              >
                <TelegramLogo /> Telegram
              </Button>
              <Button
                className="btn btn_sm cmnbtn btn-primary"

                size="medium"
                variant="contained"
                onClick={() => handlefilter("Threads", 4)}

              >
                <ThreadsLogo />  Threads
              </Button>
              <Button
                className="btn btn_sm cmnbtn btn-primary"

                size="medium"
                variant="contained"
                onClick={() => handlefilter("X", 5)}
              >
                <TwitterLogo /> X
              </Button>
              <Button
                className="btn btn_sm cmnbtn btn-primary"

                size="medium"
                variant="contained"
                onClick={() => handlefilter("Youtube", 6)}
              >
                <YoutubeLogo /> YouTube
              </Button>
            </Stack>
          </div>
          {/* Third Paper */}

          <div
            className="card "

          >
            <div className="card-header sb flexCeneterBetween">
              <h3 className="card-title">
                Rate of Conversion
              </h3>
              <div className="flex-row">
                <TextField
                  label="Search by Page Name"
                  onChange={(e) => {
                    const temp = alldata.filter((ele) => {
                      return ele.page_name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase());
                    });
                    setRows(temp);
                  }}
                />
                <Autocomplete
                  disablePortal
                  value={viewType}
                  // defaultValue={compareFlagOptions[0].label}
                  id="combo-box-demo"
                  options={viewInOptions}
                  onChange={(event, newValue) => {
                    if (newValue === null) {
                      return setViewType({
                        newValue: "Default",
                      });
                    }

                    setViewType(newValue);
                  }}
                  sx={{ width: 250, ml: 2 }}
                  renderInput={(params) => <TextField {...params} label="View In" />}
                // onChange={(e) => setFollowerCoutnCompareFlag(e.target.value)}
                />
              </div>
            </div>
            <div className="card-body thm_table fx-head">

              {!loading ? (
                <DataGrid
                  rows={rows}
                  columns={columns}
                  getRowId={(row) => row.p_id}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 50,
                      },
                    },
                  }}
                  slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
                  pageSizeOptions={[5, 25, 50, 100, 500]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel);
                  }}
                  rowSelectionModel={rowSelectionModel}
                  onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                  unstable_ignoreValueFormatterDuringExport
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  unstable_headerFilters
                />
              ) : (
                // <CircularWithValueLabel />
                <ContentLoader
                  width={1000}
                  height={700}
                  viewBox="0 0 1000 700"
                  backgroundColor="#f0f0f0"
                  foregroundColor="#dedede"
                >
                  {/* <rect x="43" y="304" rx="4" ry="4" width="271" height="9" /> */}
                  {/* <rect x="44" y="323" rx="3" ry="3" width="119" height="6" /> */}
                  <rect x="42" y="77" rx="10" ry="10" width="1100" height="600" />
                </ContentLoader>
              )}
            </div>

          </div>
        </div>

      </ThemeProvider>

      <div id="myModal1" className="modal fade" role="dialog">
        <div
          className="modal-dialog"
          style={{ marginLeft: "20%", height: "100vh", marginTop: "-10%" }}
        >
          <div
            className="modal-content"
            style={{ width: "70vw", height: "auto" }}
          >
            <div className="modal-header">
              <h4 className="modal-title">Page Name :- {rowData.page_name}</h4>
              <button
                type="button"
                className="close"
                onClick={handleCloseExeModal}
                data-dismiss="modal"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="row" style={{ height: "auto" }}>
                <div className="mb-1 col-lg-3 me-3 p-1 ">
                  <Autocomplete
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
                      value == "Daily"
                        ? setStartDate(dayjs())
                        : setStartDate("");
                      value == "Daily" ? setEndDate(dayjs()) : setEndDate("");
                    }}
                    value={statesFor}
                    // sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Stats for *"
                        error={!stateForIsValid}
                        helperText={
                          !stateForIsValid ? "Please select an option" : ""
                        }
                      />
                    )}
                  />
                </div>
                {statesFor !== "Quarterly" &&
                  statesFor !== null &&
                  stateForIsNotQuater && (
                    <div className="mb-1 col-lg-3 me-3 p-1 ">
                      <LocalizationProvider
                        className=" col-lg-3 my-3 mx-3"
                        dateAdapter={AdapterDayjs}
                      >
                        <DatePicker
                          className="my-1"
                          label="Start Date *"
                          format="DD/MM/YY"
                          value={startDate}
                          onChange={(newValue) => {
                            handleStartDateChange(newValue);
                            statesFor == "Daily" ? setEndDate(newValue) : "";
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}

                {statesFor !== null &&
                  statesFor !== "Quarterly" &&
                  stateForIsNotQuater && (
                    <div className="mb-1 col-lg-3 me-3 p-1 ">
                      <LocalizationProvider
                        className=" col-lg-3 my-3 mx-3"
                        dateAdapter={AdapterDayjs}
                      >
                        <DatePicker
                          label="End Date *"
                          format="DD/MM/YY"
                          value={endDate}
                          onChange={(newValue) => {
                            handleEndDateChange(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                {statesFor == "Quarterly" && !stateForIsNotQuater && (
                  <div className="mb-1 col-lg-8  ">
                    <Autocomplete
                      className=" col-lg-4"
                      disablePortal
                      id="combo-box-demo"
                      options={QuarterStaticData}
                      onChange={(e, value) => {
                        setQuater(value);
                        value?.length > 0
                          ? setQuaterIsValid(true)
                          : setQuaterIsValid(false);
                      }}
                      value={quater}
                      sx={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Quarter *"
                          error={!quaterIsValid}
                          helperText={
                            !quaterIsValid ? "Please select an option" : ""
                          }
                        />
                      )}
                    />
                  </div>
                )}
              </div>
              <h4 className="h3 text-center">Followers Bifurcation</h4>
              <div className="row gap-4">
                <div className="card   col-sm-12 col-lg-3">
                  <div>
                    <div className="col-md-3 col-lg-12 d-block my-2">
                      <TextField
                        label="Reach"
                        type="number"
                        value={reach}
                        key={reachkey}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0) {
                            setReachValidation(true);
                            setReach(enteredValue);
                          } else {
                            setReachValidation(false);
                          }
                        }}
                        error={!reachValidation}
                        helperText={
                          !reachValidation ? "Please enter a valid count" : ""
                        }
                      />
                      <div className="col-md-3 py-1 mb-2  ">
                        <Button
                          component="label"
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                          size="small"
                          title="Reach"
                        >
                          Image
                          <VisuallyHiddenInput
                            onChange={(e) => {
                              const uploadedFile = e.target.files[0];
                              if (uploadedFile) {
                                const imageUrl =
                                  URL.createObjectURL(uploadedFile);
                                setReachImgSrc(imageUrl);
                                setReachImg(uploadedFile);
                              }
                            }}
                            type="file"
                            accept="image/png, image/jpeg"
                          />
                        </Button>

                        {reachImgSrc && (
                          <div className="d-flex">
                            <img
                              src={reachImgSrc}
                              className="mt-1"
                              alt="Uploaded"
                            />{" "}
                            <Button
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
                    <div className="col-md-3 col-lg-12 my-2">
                      <TextField
                        label="Impressions *"
                        type="number"
                        value={impression}
                        key={reachkey}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0) {
                            setImpressionValidation(true);
                            setImpression(enteredValue);
                          } else {
                            setImpressionValidation(false);
                          }
                        }}
                        error={!impressionValidation}
                        helperText={
                          !impressionValidation
                            ? "Please enter a valid count"
                            : ""
                        }
                      />
                    </div>
                    <div className="col-md-3 py-1 mb-2  ">
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        title="Impression"
                      >
                        Image
                        <VisuallyHiddenInput
                          onChange={(e) => {
                            const uploadedFile = e.target.files[0];
                            if (uploadedFile) {
                              const imageUrl =
                                URL.createObjectURL(uploadedFile);
                              setImpressionImgSrc(imageUrl);
                              setImpressionImg(uploadedFile);
                            }
                          }}
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>

                      {impressionImgSrc && (
                        <div className="d-flex">
                          <img
                            src={impressionImgSrc}
                            className="mt-1"
                            alt="Uploaded"
                          />{" "}
                          <Button
                            size="small"
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
                    <div className="col-md-3 col-lg-12 my-2">
                      <TextField
                        label="Engagement *"
                        key={reachkey}
                        type="number"
                        value={engagement}
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
                          !engagementValidation
                            ? "Please enter a valid count"
                            : ""
                        }
                      />
                    </div>
                    <div className="col-md-3 py-1 mb-2">
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                      >
                        Image
                        <VisuallyHiddenInput
                          onChange={(e) => {
                            const uploadedFile = e.target.files[0];
                            if (uploadedFile) {
                              const imageUrl =
                                URL.createObjectURL(uploadedFile);
                              setEngagementImgSrc(imageUrl);
                              setEngagementImg(uploadedFile);
                            }
                          }}
                          type="file"
                          accept="image/png, image/jpeg"
                        />
                      </Button>
                      {engagementImgSrc && (
                        <div className="d-flex">
                          <img
                            src={engagementImgSrc}
                            className="mt-1"
                            alt="Uploaded"
                          />{" "}
                          <Button
                            size="small"
                            onClick={() => setEngagementImgSrc(null)}
                          >
                            <CloseTwoToneIcon />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="col-md-3 col-lg-12  my-2">
                      <TextField
                        label="Story View *"
                        type="number"
                        value={storyView}
                        key={reachkey}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0) {
                            setStoryViewValidation(true);
                            setStoryView(enteredValue);
                          } else {
                            setStoryViewValidation(false);
                          }
                        }}
                        error={!storyViewValidation}
                        helperText={
                          !storyViewValidation
                            ? "Please enter a valid count"
                            : ""
                        }
                      />
                    </div>
                    <div className="col-md-3 col-lg-12 py-1 mb-2">
                      <LocalizationProvider
                        className=" col-lg-3 my-3 mx-3"
                        dateAdapter={AdapterDayjs}
                      >
                        <DatePicker
                          label="Story View Date"
                          format="DD/MM/YY"
                          value={storyViewDate}
                          onChange={(newValue) => {
                            handleStoryViewDateChange(newValue);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="col-md-3 col-lg-12 py-1 mb-2">
                      <Button
                        className="me-1"
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
                              const imageUrl =
                                URL.createObjectURL(uploadedFile);
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
                        startIcon={<CloudUploadIcon />}
                        size="small"
                      >
                        Video
                        <VisuallyHiddenInput
                          onChange={(e) => {
                            const uploadedFile = e.target.files[0];
                            if (uploadedFile) {
                              const videoUrl =
                                URL.createObjectURL(uploadedFile);
                              setStoryViewVideoSrc(videoUrl); // Set the video URL in state for preview
                              setStoryViewVideo(uploadedFile); // Set the uploaded video in state
                            }
                          }}
                          type="file"
                          accept="video/mp4,video/avi"
                        />
                      </Button>
                      <div>
                        {storyViewImgSrc && (
                          <div className="d-flex">
                            <img
                              style={{ height: "auto", width: "25%" }}
                              src={storyViewImgSrc}
                              className="mt-1"
                              alt="Uploaded"
                            />{" "}
                            <Button
                              size="small"
                              onClick={() => setStoryViewImgSrc(null)}
                            >
                              <CloseTwoToneIcon />
                            </Button>
                          </div>
                        )}
                        {storyViewVideoSrc && (
                          <div className="d-flex align-items-center">
                            <video
                              style={{ height: "auto", width: "25%" }}
                              src={storyViewVideoSrc}
                              // controls
                              className="mt-1"
                              alt="Uploaded Video"
                            />
                            <Button
                              size="small"
                              onClick={() => {
                                setStoryViewImgSrc(null);
                                setStoryViewVideo(null);
                              }}
                            >
                              <CloseTwoToneIcon />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-3 col-lg-12 my-2">
                      <TextField
                        label="Profile Visit"
                        key={reachkey}
                        type="number"
                        value={profileVisit}
                        onChange={(e) => {
                          const enteredValue = e.target.value;
                          if (enteredValue >= 0 || enteredValue === "") {
                            setProfileVisit(enteredValue);
                            setProfileVisitError(false); // Reset error state
                          } else {
                            setProfileVisitError(true); // Set error state for negative values
                          }
                        }}
                        error={profileVisitError}
                        helperText={
                          profileVisitError
                            ? "Please enter a non-negative number"
                            : ""
                        }
                      />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
                <div className="card  col-sm-12 col-lg-3">
                  <div>
                    <label className="mt-3 h6">City</label>
                    <Autocomplete
                      id="combo-box-demo"
                      value={city1}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        cityCopyValidation(value, city1);
                        setCity1(() => value);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 1" />
                      )}
                    />
                    <TextField
                      className="mb-1 "
                      type="number"
                      value={city1Percentage}
                      key={reachkey}
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
                    <Autocomplete
                      id="combo-box-demo"
                      value={city2}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity2(value);
                        cityCopyValidation(value, city2);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 2" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      value={city2Percentage}
                      key={reachkey}
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
                    <Autocomplete
                      id="combo-box-demo"
                      value={city3}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity3(value);
                        cityCopyValidation(value, city3);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 3" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      key={reachkey}
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
                    <Autocomplete
                      id="combo-box-demo"
                      value={city4}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity4(value);
                        cityCopyValidation(value, city4);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 4" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={city4Percentage}
                      key={reachkey}
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
                    <Autocomplete
                      id="combo-box-demo"
                      value={city5}
                      options={cityList.map((city) => city)}
                      onChange={(e, value) => {
                        setCity5(value);
                        cityCopyValidation(value, city5);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="City 5" />
                      )}
                    />
                    <TextField
                      type="number"
                      value={city5Percentage}
                      key={reachkey}
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
                    <div>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        className="mt-4"
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

                      {cityImgSrc && (
                        <div className="d-flex align-items-center">
                          <img
                            style={{ height: "auto", width: "25%" }}
                            src={cityImgSrc}
                            className="mt-1"
                            alt="Image Uploaded"
                          />
                          <Button
                            size="small"
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
                <div className="card  col-sm-12 col-lg-3">
                  <div>
                    <label className="mt-3 h6">Country</label>
                    <Autocomplete
                      id="combo-box-demo"
                      value={country1}
                      options={countryList.map((country) => country.name)}
                      onChange={(e, value) => {
                        countryCopyValidation(value, country1);
                        setCountry1(value);
                      }}
                      // sx={{ width: 250 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 1" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country1Percentage}
                      key={reachkey}
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
                    <Autocomplete
                      disablePortal
                      value={country2}
                      onChange={(e, value) => {
                        countryCopyValidation(value, country2);
                        setCountry2(value);
                      }}
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 2" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      value={country2Percentage}
                      key={reachkey}
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
                    <Autocomplete
                      disablePortal
                      value={country3}
                      onChange={(e, value) => {
                        setCountry3(value);
                        countryCopyValidation(value, country3);
                      }}
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 3" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country3Percentage}
                      key={reachkey}
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
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      value={country4}
                      onChange={(e, value) => {
                        setCountry4(value);
                        countryCopyValidation(value, country4);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 4" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country4Percentage}
                      key={reachkey}
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
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={countryList.map((country) => country.name)}
                      value={country5}
                      onChange={(e, value) => {
                        setCountry5(value);
                        countryCopyValidation(value, country5);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Country 5" />
                      )}
                    />
                    <TextField
                      className="mb-2"
                      type="number"
                      value={country5Percentage}
                      key={reachkey}
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
                    <div>
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        className="mt-3"
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
                            style={{ height: "auto", width: "25%" }}
                            src={countryImgSrc}
                            className="mt-1"
                            alt="Country Image Uploaded"
                          />
                          <Button
                            size="small"
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
                <div className="card  col-sm-12 col-lg-2">
                  <div>
                    <label className="h6 d-block">Age Group</label>
                    <div className="d-flex flex-col">
                      <TextField
                        label="13-17"
                        type="number"
                        className="mb-2"
                        value={age1Percentage}
                        key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge1Percentage(e.target.value)
                          )
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
                      <TextField
                        label="18-24"
                        type="number"
                        className="mb-2"
                        value={age2Percentage}
                        key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge2Percentage(e.target.value)
                          )
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
                      <TextField
                        label="25-34"
                        type="number"
                        className="mb-2"
                        value={age3Percentage}
                        key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge3Percentage(e.target.value)
                          )
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
                      <TextField
                        label="35-44"
                        type="number"
                        className="mb-2"
                        value={age4Percentage}
                        key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge4Percentage(e.target.value)
                          )
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
                      <TextField
                        label="45-54"
                        type="number"
                        className="mb-2"
                        value={age5Percentage}
                        key={reachkey}
                        onChange={(e) =>
                          handlePercentageChange(
                            setAge5Percentage(e.target.value)
                          )
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
                      <TextField
                        label="55-64"
                        type="number"
                        className="mb-2"
                        value={age6percentage}
                        key={reachkey}
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
                      <TextField
                        label="65+"
                        type="number"
                        className="mb-2"
                        value={age7Percentage}
                        key={reachkey}
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
                      <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        size="small"
                        className="mt-4"
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
                            style={{ height: "auto", width: "25%" }}
                            src={ageImgSrc}
                            className="mt-1"
                            alt="Age Image Uploaded"
                          />
                          <Button
                            size="small"
                            onClick={() => {
                              setAgeImgSrc(null);
                              setAgeImg(null);
                            }}
                          >
                            <CloseTwoToneIcon />
                          </Button>
                        </div>
                      )}
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
              <div className="card mt-2">
                <div className="card-body">
                  <label className="h6 d-block">Gender</label>
                  <div className="row">
                    <div className="col-sm-12 col-lg-2 mt-2">
                      <TextField
                        label="Male"
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
                    <div className="col-sm-12 col-lg-2 mt-2">
                      <TextField
                        label="Female"
                        type="number"
                        // className="mx-3"
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
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={handleCloseExeModal}
              >
                Cancel
              </button>
              <button
                onClick={saveStats}
                type="button"
                className="btn btn-success"
                data-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ExecutionAll;
