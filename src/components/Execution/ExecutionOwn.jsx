import React from "react";
import Stack from "@mui/material/Stack";
import {
  Autocomplete,
  Button,
  Checkbox,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

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
import ContentLoader from "react-content-loader";

import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from '../../utils/config'
import FormContainer from "../AdminPanel/FormContainer";
import { FacebookLogo, InstagramLogo, TelegramLogo, ThreadsLogo, TwitterLogo, YoutubeLogo } from "@phosphor-icons/react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function ExecutionOwn() {
  const { toastAlert } = useGlobalContext();
  const [rows, setRows] = useState([]);
  const [pagemode, setPagemode] = useState(1);
  const [alldata, setAlldata] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [copiedData, setCopiedData] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [reach, setReach] = useState(0);
  const [impression, setImpression] = useState(0);
  const [engagement, setEngagement] = useState(0);
  const [storyView, setStoryView] = useState(0);
  const [rowData, setRowData] = useState({});
  const [statesFor, setStatesFor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [demoFile, setDemoFile] = useState();
  const [stateForIsValid, setStateForIsValid] = useState(false);
  const [stateForIsNotQuater, setStateForIsNotQuater] = useState(false);
  const [quater, setQuater] = useState("");
  const [quaterIsValid, setQuaterIsValid] = useState(false);
  const [startDateIsValid, setStartDateIsValid] = useState(false);
  const [endDateIsValid, setEndDateIsValid] = useState(false);
  const [reachValidation, setReachValidation] = useState(true);
  const [impressionValidation, setImpressionValidation] = useState(true);
  const [engagementValidation, setEngagementValidation] = useState(true);
  const [storyViewValidation, setStoryViewValidation] = useState(true);
  const [contextData, setContextData] = useState(false);
  const [alert, setAlert] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const navigate = useNavigate();

  const handleCloseExeModal = () => {
    setQuater("");
    setStatesFor(null);
    setStartDate(null);
    setEndDate(null);
    setReach(0);
    setImpression(0);
    setEngagement(0);
    setStoryView(0);
    setDemoFile();
    setRowData({});
  };

  const dropdownStaticData = [
    "Daily",
    "Weekly",
    "Fortnight",
    "Monthly",
    "Quarterly",
  ];

  const QuarterStaticData = ["Quater 1", "Quater 2", "Quater 3", "Quater 4"];
  const handleFileChange = (event) => {
    setDemoFile(event.target.files[0]);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "rgb(13, 110, 253)",
      },
      //   secondary: purple,
    },
  });

  useEffect(() => {
    const formData = new URLSearchParams();
    formData.append("loggedin_user_id", 36);
    // formData.append("filter_criteria", "m");
    // formData.append("pendingorcomplete", "pending");
    console.log(formData);
    axios
      .post(
        "https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        const filterVendorId = res.data.body.filter(
          (check) => check.vendor_id == "8"
        );
        // console.log("filtervendorid",filterVendorId);
        setAlldata(filterVendorId);
        // let tempdata = alldata.filter((ele) => {
        let tempdata = filterVendorId.filter((ele) => {
          return ele.platform == "Instagram";
        });
        setRows(tempdata);
        // console.log('after',alldata);
      });
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
  }, []);
  const converttoclipboard = (copydata) => {
    const copyData = copydata
      .map((row) => {
        // Modify this loop to construct your desired data format
        let rowData = "";
        for (const key in row) {
          rowData += `${key}: ${row[key]}\n`;
        }
        return rowData;
      })
      .join("\n");

    // Copy data to the clipboard
    navigator.clipboard
      .writeText(copyData)
      .then(() => {
        // Data successfully copied to the clipboard
        console.log("Copied to clipboard: ", copyData);
      })
      .catch((err) => {
        // Handle errors
        console.error("Unable to copy to clipboard: ", err);
      });
  };
  const option = ["Story", "Post", "Both", "Note"];
  const copySelectedRows = (id) => {
    console.log(id);
    // console.log(rowSelectionModel);
    let copydata = [];
    let set = new Set();

    for (let i = 0; i < rowSelectionModel.length; i++) {
      set.add(rowSelectionModel[i]);
    }

    // console.log(set);
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
    console.log(copydata);

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
      // }
    }
    copydata.push([rows.length, Followerscount]);
    converttoclipboard(copydata);
  };

  const handlefilter = (name, id) => {
    console.log(name, "check", id);
    let ftrdata = alldata.filter((ele) => {
      return ele.platform == name;
    });
    // console.log(ftrdata);
    setRows(ftrdata);
    setPagemode(id);
  };

  const handleStartDateChange = (newValue) => {
    const date = new Date(newValue.$d);

    // Adjusting for the local time zone offset
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    // Getting ISO string after adjustment
    const isoDate = date.toISOString();

    console.log(isoDate);
    console.log(isoDate.replace("Z", "+00:00"));

    setStartDate(newValue);
  };
  const handleEndDateChange = (newValue) => {
    const date = new Date(newValue.$d);

    // Adjusting for the local time zone offset
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);

    // Getting ISO string after adjustment
    const isoDate = date.toISOString();

    console.log(isoDate);
    console.log(isoDate.replace("Z", "+00:00"));

    setEndDate(newValue);
  };

  const handleHistoryRowClick = (row) => {
    console.log(row.p_id);
    navigate(`/exe-history/${row.p_id}`, { state: row });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
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
        // width: 150,
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
        // width: 160,
        renderCell: (params) => {
          const date = params.row.page_link;
          // console.log(date);
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
          // width: 160,
          renderCell: (params) => {
            const date = params.row.account_link;
            // console.log(date);
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
          // width: 160,
          renderCell: (params) => {
            const date = params.row.channel_link;
            // console.log(date);
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
        // width: 150,
      }
      : pagemode == 2
        ? ({
          field: "follower_count",
          headerName: "Followers",
          // width: 150,
        },
        {
          field: "page_likes",
          headerName: "Page Likes",
        })
        : {
          field: "subscribers",
          headerName: "Subscribers",
          // width: 150,
        },

    contextData && {
      headerName: "Update",
      renderCell: (params) => {
        return (
          <button
            type="button"
            className="btn btn-primary"
            data-toggle="modal"
            data-target="#myModal1"
            onClick={() => handleRowClick(params.row)}
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
            className="btn btn-primary"
            onClick={() => handleHistoryRowClick(params.row)}
          >
            See History
          </button>
        );
      },
    },
  ];

  const handleRowClick = (row) => {
    setRowData(row);
  };

  const saveStats = async (e) => {
    e.preventDefault();
    console.log("save stats");
    const formData = new FormData();
    formData.append("p_id", rowData.p_id);
    formData.append("reach", reach);
    formData.append("impression", impression);
    formData.append("engagement", engagement);
    formData.append("story_view", storyView);
    demoFile ? formData.append("media", demoFile) : "";
    quater ? formData.append("quater", demoFile) : "";
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("stats_for", statesFor);

    axios
      .post(`${baseUrl}` + `add_exe_pid_history`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setQuater("");
        setStatesFor(null);
        setStartDate(null);
        setEndDate(null);
        setReach(0);
        setImpression(0);
        setEngagement(0);
        setStoryView(0);
        setDemoFile();
        setRowData({});

        // toast("Form Submitted success");
        toastAlert("Form Submitted success");
      });
  };

  function CustomColumnMenu(props) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          // Hide `columnMenuColumnsItem`
          columnMenuColumnsItem: null,
        }}
      />
    );
  }
  const handleOptionChange = (event, value) => {
    setSelectedOptions(value);
    console.log(value);
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <div style={{}}> */}
        <div>

          <FormContainer
            mainTitle={"Pages Owned"}
            link={true}
          />

          <div
            className="card body-padding"
          >
            {/* <Typography>h1. Heading</Typography> */}
            <Stack direction="row" sx={{}} justifyContent="space-between">
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
              <div className="sb gap16">
                <Button
                  size="small"
                  variant="outlined"
                  className="btn cmnbtn btn-primary"
                  startIcon={<ContentCopyOutlinedIcon />}
                  onClick={() => copySelectedRows(1)}
                >
                  Copy Selected Pages
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  className="btn cmnbtn btn-primary"

                  startIcon={<CopyAllOutlinedIcon />}
                  onClick={copyAllRows}
                >
                  Copy All Pages
                </Button>
                <Button
                  size="small"
                  className="btn cmnbtn btn-primary"

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


            <Stack className="flexCenter flex-row gap16">
              <Button
                size="medium"
                variant="contained"
                className="btn btn_sm cmnbtn btn-primary"

                onClick={() => handlefilter("Instagram", 1)}
              >
                <InstagramLogo />
                Instagram
              </Button>
              <Button
                size="medium"
                variant="contained"
                className="btn btn_sm cmnbtn btn-primary"

                onClick={() => handlefilter("Facebook", 2)}
              >
                <FacebookLogo />
                Facebook
              </Button>
              <Button
                size="medium"
                variant="contained"
                className="btn btn_sm cmnbtn btn-primary"

                onClick={() => handlefilter("Telegram", 3)}
              >
                <TelegramLogo /> Telegram
              </Button>
              <Button
                size="medium"
                className="btn btn_sm cmnbtn btn-primary"

                variant="contained"
                onClick={() => handlefilter("Threads", 4)}
              >
                <ThreadsLogo /> Threads
              </Button>
              <Button
                size="medium"
                variant="contained"
                className="btn btn_sm cmnbtn btn-primary"

                onClick={() => handlefilter("X", 5)}
              >
                <TwitterLogo />  X
              </Button>
              <Button
                size="medium"
                variant="contained"
                onClick={() => handlefilter("Youtube", 6)}
                className="btn btn_sm cmnbtn btn-primary"

              >
                <YoutubeLogo /> YouTube
              </Button>
            </Stack>
          </div>
          {/* Third Paper */}


          <div
            className="card"
          >
            <div className="card-header sb">
              <div className="card-tittle">Rate Of Conversion</div> <div className="pack w-75">
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
              </div>
            </div>
            <div className="card-body">

              {rows != [] ? (
                <div className="thm_table">

                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.p_id}
                    // rowModesModel={rowModesModel}
                    // onRowModesModelChange
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 50,
                        },
                      },
                    }}
                    // processRowUpdate={processRowUpdate}
                    slots={{ toolbar: GridToolbar, columnMenu: CustomColumnMenu }}
                    pageSizeOptions={[5, 25, 50, 100, 500]}
                    // processRowUpdate={processRowUpdate}
                    // onRowClick={handleCheckBox}
                    checkboxSelection
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                      setRowSelectionModel(newRowSelectionModel);
                      // console.log(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    unstable_ignoreValueFormatterDuringExport
                  />
                </div>


              ) : (
                // <CircularWithValueLabel />
                <ContentLoader
                  width={2000}
                  height={700}
                  viewBox="0 30 2000 700"
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
      </ThemeProvider >

      <div id="myModal1" className="modal fade" role="dialog">
        <div
          className="modal-dialog"
          style={{ marginLeft: "25%", height: "40%", marginTop: "-5%" }}
        >
          <div
            className="modal-content"
            style={{ width: "150%", height: "200%" }}
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
              <Autocomplete
                className="my-3"
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
                sx={{ width: 300 }}
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
              {statesFor !== "Quarterly" &&
                statesFor !== null &&
                stateForIsNotQuater && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="my-3"
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

              {statesFor !== null &&
                statesFor !== "Quarterly" &&
                stateForIsNotQuater && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className="my-3 mx-3"
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
                <Autocomplete
                  className="my-3"
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
              )}
              <div className="row">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
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
                      handleSaveButtonValidation();
                    }}
                    error={!impressionValidation}
                    helperText={
                      !impressionValidation ? "Please enter a valid Count" : ""
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 my-3">
                  <TextField
                    label="Engagement *"
                    type="number"
                    value={engagement}
                    // fieldGrid={4}
                    onChange={(e) => {
                      e.target.value > 0
                        ? setEngagementValidation(true)
                        : setEndDateIsValid(false),
                        setEngagement(e.target.value);
                      handleSaveButtonValidation();
                    }}
                    error={!engagementValidation}
                    helperText={
                      !engagementValidation ? "Please enter a valid Count" : ""
                    }
                  />
                </div>
                <div className="col-md-6 my-3">
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
                      handleSaveButtonValidation();
                    }}
                    error={!storyViewValidation}
                    helperText={
                      !storyViewValidation ? "Please enter a valid Count" : ""
                    }
                  />
                </div>
              </div>

              <OutlinedInput
                // variant="outlined"
                type="file"
                accept="image/png, image/jpeg, video/mp4, video/avi"
                inputProps={{
                  accept: ".pdf, .doc, .docx, .mp4, .avi, .png, .jpeg",
                }}
                sx={{ width: "42%" }}
                onChange={(event) => handleFileChange(event)}
              />
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
                disabled={
                  !impression ||
                    !reach ||
                    !engagement ||
                    !statesFor ||
                    !storyView ||
                    statesFor == "Quarterly"
                    ? !quater
                    : !startDate || !endDate
                }
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

export default ExecutionOwn;
