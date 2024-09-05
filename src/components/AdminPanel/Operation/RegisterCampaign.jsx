import {
  Button,
  TextField,
  Autocomplete,
  FormControl,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";

import { use, useEffect, useState } from "react";
import AddPage from "./AddPage";
//import { LocalizationProvider } from "@mui/x-date-pickers";
//import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import FormContainer from "../FormContainer";

const platform = [
  { plt_id: 1, plat_name: "Instagram" },
  { plt_id: 2, plat_name: "Facebook" },
  { plt_id: 3, plat_name: "Whatsapp" },
  { plt_id: 4, plat_name: "Youtube" },
  { plt_id: 5, plat_name: "x" },
];

const brandURL = baseUrl + "";
export default function RegisterCampaign() {
  const [salesUsers, setSalesUsers] = useState([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { toastAlert, toastError } = useGlobalContext();
  const [openModal, setOpenModal] = useState(false);
  const [showPageDetails, setShowPageDetails] = useState(false);
  const [campaignDetailing, setCampaignDetailing] = useState("");
  const [showBrandName, setShowBrandName] = useState([]);
  const [xlxsData, setXlxsData] = useState([]);
  const [fields, setFields] = useState([{ selectValue: 0, textValue: 0 }]);
  const [showAlert, setShowAlert] = useState(false);
  const [campignData, setCampignData] = useState([{}]);
  const [campaign, setCampaign] = useState();
  const [industry, setIndustry] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [goal, setGoal] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [agencyList, setAgencyList] = useState([]);
  const [master, setMaster] = useState(null);
  const [campaignClosedBy, setCampaignClosedBy] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [SubCategoryString, setSubCategoryString] = useState();
  const [brandName, setBrandName] = useState("");
  const [userName, setUserName] = useState([]);
  const [errBrandName, setErrBrandName] = useState();
  const [isModalOpenForCampaign, setIsModalOpenForCampaign] = useState(false);
  const [campaignModalPayload, setCampaignModalPayload] = useState({
    exeCmpName: "",
    exeRemark: "",
  });
  const [loading, setLoading] = useState(false);

  const [postData, setPostData] = useState({
    brand_name: "",
    category_id: "",
    sub_category_id: "",
  });

  const navigate = useNavigate();
  const createExcel = () => {
    const ws = XLSX.utils.json_to_sheet(xlxsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (!brandName) {
      hasError = true;
    }

    if (!campaign) {
      hasError = true;
    }

    if (!selectedDate) {
      hasError = true;
    }

    if (!campaignClosedBy) {
      hasError = true;
    }

    if (hasError) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);

    const blob = createExcel();
    const form = new FormData();
    form.append("brand_id", brandName);
    form.append("brnad_dt", selectedDate);
    form.append("commitment", JSON.stringify(fields));
    form.append("excel_file", blob);
    form.append("exeCmpId", campaign?.value);
    form.append("detailing", campaignDetailing);
    form.append("status", 0);
    form.append("stage", 0);
    form.append("captions", caption);
    form.append("hashtags", hashtag);
    form.append("agency", selectedAgency);
    form.append("industry", selectedIndustry);
    form.append("goal", selectedGoal);
    form.append("campaignClosedBy", campaignClosedBy);
    setLoading(true);
    axios
      .post(baseUrl + "register_campaign", form)
      .then(() => {
        setBrandName([]);
        setSelectedDate(null);
        setFields([{ selectValue: "", textValue: "" }]);
        setXlxsData([]);
        setShowBrandName([]);
        setBrandName([]);
        setFields([]);
        setLoading(false);
        navigate("/admin/registered-campaign");
        toastAlert("Campaign Regrister Successfully");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const commitmentOptions = [
    "Reach",
    "Engagement",
    "Story views",
    "Reels views",
  ];

  const handleAddField = () => {
    const newField = { selectValue: 0, textValue: 0 };
    setFields([...fields, newField]);
  };
  const handleRemoveField = (e, i) => {
    setFields(fields.filter((field, index) => index !== i));
  };

  const handleSelectChange = (event, index) => {
    const updatedFields = [...fields];
    updatedFields[index].selectValue = event.target.value;
    setFields(updatedFields);
  };

  const handleTextChange = (event, index) => {
    const updatedFields = [...fields];
    const inputValue = event.target.value;
    const isNumeric = /^[0-9]+$/.test(inputValue);

    if (isNumeric) {
      updatedFields[index].textValue = inputValue;
      setFields(updatedFields);
    } else {
    }
  };

  const [campaignList, setCampignList] = useState([]);
  const handleChange = (event) => {
    setBrandName(
      showBrandName.filter((e) => event.target.value == e.brand_name)[0]
        ?.brand_id
    );
  };
  const handleChangeBrand = (event) => {
    const { name, value } = event.target;

    if (name === "brand_name") {
      if (!value === "") {
        setErrBrandName("Brand should not be blank.");
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        setErrBrandName("Brand should be characters.");
      } else {
        setErrBrandName(" ");
      }
    }
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const [selectedDate, setSelectedDate] = useState(dayjs());
  useEffect(() => {
    setSelectedDate(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    getAllData();
  }, []);


  const getAllData = () => {
    axios
      .get(baseUrl + "get_brands")
      .then((response) => {
        const data = response.data.data;
        setShowBrandName(data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl + "get_all_commitments")
      .then((response) => {
        setCampignList(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(baseUrl + "exe_campaign")
      .then((response) => {
        const data = response.data.data;
        setCampignData(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl + "agency")
      .then((response) => {
        const data = response?.data?.result;
        setAgencyList(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl + "goal")
      .then((response) => {
        const data = response.data.result;
        setGoal(data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(baseUrl + "industry")
      .then((response) => {
        const data = response.data.result;
        setIndustry(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllData();
  }, []);

  const handleHashtagChange = (event) => {
    setHashtag(event.target.value);
  };
  const handleAgencyChange = (event, newValue) => {
    setSelectedAgency(newValue);
  };
  const handleGoalChange = (event, newValue) => {
    setSelectedGoal(newValue);
  };
  const handleIndusrtyChange = (event, newValue) => {
    setSelectedIndustry(newValue);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const addCampaignData = () => {
    setMaster("Campaign");
    setIsModalOpenForCampaign(true);
  };

  const addBrandData = () => {
    setMaster("Brand");
    setIsModalOpen(true);
  };

  const fetchSalesUsers = () => {
    axios
      .get(`${baseUrl}get_all_sales_users`)
      .then((response) => {
        setSalesUsers(response.data); // Assuming the API returns an array of sales users
      })
      .catch((err) => {
        console.log(err);
        toastError("Failed to fetch sales users");
      });
  };

  useEffect(() => {
    fetchSalesUsers();
    // Call other necessary functions like getAllData here
  }, []);

  const handleChangeBrnad = () => { };

  const handlePlatfromChange = (index, value) => {
    const updatedpages = [...userName];
    updatedpages[index] = value;
    setUserName(updatedpages);
  };

  const handleClose = () => {
    setCampaignModalPayload({ exeCmpName: "", exeRemark: "" });
    setSelectedPages([]);
    setIsModalOpen(false);
    setIsModalOpenForCampaign(false);
  };

  const categoryData = () => {
    axios.get(baseUrl + "projectxCategory").then((res) => {
      setCategoryOptions(res.data.data);
    });
  };
  useEffect(() => {
    categoryData();
  }, []);

  const subCategoryDataOnEdit = () => {
    axios.get(baseUrl + "projectxSubCategory").then((res) => {
      const filteredData = res.data.data.filter((item) => {
        return item.category_id == postData.category_id;
      });

      setSubCategoryOptions(filteredData);
      // setLoading(false);
    });
  };

  useEffect(() => {
    subCategoryDataOnEdit();
  }, [postData.category_id, postData]);

  const handleSave = (e) => {
    e.preventDefault();
    const platformsData = selectedPages.reduce((acc, platform, index) => {
      const key = platform.plat_name;
      const value = userName[index] || "";
      acc[key] = value;
      return acc;
    }, {});
    const updatedPostData = {
      ...postData,
      platform: platformsData,
    };
    if (
      !updatedPostData.brand_name ||
      !updatedPostData.category_id ||
      !updatedPostData.sub_category_id
    ) {
      alert(" * Please fill in all required fields ");
    } else {
      axios
        .post(`${brandURL}add_brand`, updatedPostData)
        .then((response) => {
          response.data.message
            ? toastError(response.data.message)
            : toastAlert("Add Successfully");
          setPostData("");
          setReload(!reload);
          getAllData();
        })
        .catch((error) => {
          console.error("Error saving data:", error);
          toastError("Error adding data. Please try again later.");
        });
      setIsModalOpen(false);
    }
  };

  const handleCampaignAdd = async () => {
    if (campaignModalPayload.exeCmpName == "") {
      toastError("Campaign Name is required");
    } else {
      try {
        const response = await axios.post(
          `${baseUrl}exe_campaign`,
          campaignModalPayload
        );
        toastAlert("Campaign Added");
        setCampaignModalPayload({ exeCmpName: "", exeRemark: "" });
        setIsModalOpenForCampaign(false);
        getAllData();
      } catch (error) { }
    }
  };
  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Register Campaign"
            link="true"
          />
        </div>
        {/* <h2 className="form-heading">Register Campaign</h2> */}
        <div className="action_btns" >
          <Link to="/admin/brandmaster" style={{ marginRight: "5px" }}>
            <button type="button" className="btn cmnbtn btn-outline-primary btn_sm">
              Brand Master
            </button>
          </Link>
          <Link to="/admin/overview/agency" style={{ marginRight: "5px" }}>
            <button type="button" className="btn cmnbtn btn-outline-primary btn_sm">
              Agency Master
            </button>
          </Link>
          <Link to="/admin/overview/industry" style={{ marginRight: "5px" }}>
            <button type="button" className="btn cmnbtn btn-outline-primary btn_sm">
              Industry Master
            </button>
          </Link>
          <Link to="/admin/overview/goal" style={{ marginRight: "5px" }}>
            <button type="button" className="btn cmnbtn btn-outline-primary btn_sm">
              Goal Master
            </button>
          </Link>
          <Link to="/admin/contentcreater" style={{ marginRight: "5px" }}>
            <button type="button" className="btn cmnbtn btn-outline-primary btn_sm">
              Commitment Master
            </button>
          </Link>
        </div>
      </div>
      < >
        {/* Alert to display when there are validation errors */}
        {showAlert && (
          <div className="alert alert-danger mt-3" role="alert">
            Please fill in all the required fields.
          </div>
        )}
      </>
      <div className="card body-padding" style={{ marginTop: "20px" }}>
        <>
          <Box>
            <Box
              className="row"
            >
              <div className="form-group col-4">
                <Autocomplete
                  disablePortal
                  options={showBrandName.map((option) => option.brand_name)}
                  require={true}
                  value={
                    showBrandName.filter((e) => brandName == e.brand_id)[0]
                      ?.brand_name
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Brand Name *" />
                  )}
                  onSelect={handleChange}
                />
              </div>
              <div className="form-group col-2">
                <button
                  className="btn btn-primary cmnbtn  mt-2 "
                  onClick={addBrandData}
                >
                  Add Brand
                </button>
              </div>

              <div className="form-group col-4">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={campignData.map((option) => ({
                    label: option.exeCmpName,
                    value: option.exeCmpId,
                  }))}
                  require={true}
                  value={campaign?.label}
                  onChange={(e, newValue) => setCampaign(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Campaign *" />
                  )}
                />
              </div>
              <div className="form-group col-2">
                <button
                  className="btn btn-primary cmnbtn  mt-2"
                  onClick={addCampaignData}
                >
                  Add Campaign
                </button>
              </div>

              <div className="form-group col-4">
                <TextField
                  label="Date and Time *"
                  value={selectedDate}
                  disabled
                  fullWidth
                  sx={{ width: 300 }}
                />
              </div>
              <div className="form-group col-4">
                <Autocomplete
                  disablePortal
                  id="agency-dropdown"
                  options={
                    industry?.length > 0 &&
                    industry.map((option) => option.name)
                  }
                  value={selectedIndustry}
                  onChange={handleIndusrtyChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Industry" />
                  )}
                />
              </div>
              <div className="form-group col-4">
                <Autocomplete
                  disablePortal
                  id="agency-dropdown"
                  options={
                    agencyList?.length > 0 &&
                    agencyList?.map((option) => option?.name)
                  }
                  value={selectedAgency}
                  onChange={handleAgencyChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Agency" />
                  )}
                />
              </div>
              <div className="form-group col-4">

                <Autocomplete
                  disablePortal
                  id="agency-dropdown"
                  options={
                    goal?.length > 0 && goal?.map((option) => option?.name)
                  }
                  value={selectedGoal}
                  onChange={handleGoalChange}
                  renderInput={(params) => <TextField {...params} label="Goal" />}
                />
              </div>
              <div className="form-group col-4">

                <TextField
                  label="Hashtag"
                  value={hashtag}
                  onChange={handleHashtagChange}
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className="form-group col-4">

                <Autocomplete
                  disablePortal
                  id="campaign-closed-by-dropdown"
                  options={
                    salesUsers?.length > 0 &&
                    salesUsers?.map((user) => user.user_name)
                  }
                  value={campaignClosedBy}
                  onChange={(event, newValue) => {
                    setCampaignClosedBy(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Campaign Closed By *" />
                  )}
                />
              </div>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 1 }}>
            <TextField
              label="Campaign Detail"
              fullWidth
              multiline
              value={campaignDetailing}
              onChange={(e) => setCampaignDetailing(e.target.value)}
              sx={{ mr: 1 }}
            />

            <TextField
              label="Caption"
              value={caption}
              multiline
              onChange={(e) => setCaption(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Box>
          <>
            {fields.length > 0 && (
              <FormControl sx={{ mr: 1 }}>
                {fields.map((field, index) => (
                  <div key={index} className="mt-2 mb-2 d-flex">
                    <FormControl sx={{ width: "900px", marginRight: "10px" }}>
                      <Autocomplete
                        required
                        disablePortal
                        value={
                          campaignList.filter(
                            (e) => e.cmtName == field.selectValue
                          )[0]?.cmtName
                        }
                        onChange={(event, newValue) => {
                          handleSelectChange(
                            {
                              target: {
                                value: campaignList.filter(
                                  (e) => e.cmtName == newValue
                                )[0].cmtId,
                              },
                            },
                            index
                          );
                        }}
                        options={campaignList
                          .filter(
                            (e) =>
                              !fields
                                .map((e) => e.selectValue)
                                .includes(e.cmtId)
                          )
                          .map((option) => option.cmtName)}
                        renderInput={(params) => (
                          <TextField {...params} label="Commitment *" />
                        )}
                      />
                    </FormControl>

                    <TextField
                      required
                      label="Value"
                      value={field.textValue}
                      type="number"
                      fullWidth
                      onChange={(event) => handleTextChange(event, index)}
                    />
                    <Button onClick={(e) => handleRemoveField(e, index)}>
                      <i className="fas fa-close"></i>
                    </Button>
                  </div>
                ))}
              </FormControl>
            )}
          </>
        </>

        <div className="d-flex justify-content-between">
          <div>
            {commitmentOptions.filter(
              (e) => !fields.map((e) => e.selectValue).includes(e)
            ).length > 0 && (
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  color="secondary"
                  className="btn btn-primary cmnbtn btn_sm"
                  onClick={handleAddField}
                >
                  Add Row
                </Button>
              )}
            {/* <Button
              variant="outlined"
              onClick={togglePageDetails}
              sx={{ mt: 2, ml: 2 }}
            >
              {showPageDetails ? " Remove Excel " : " Fetch Excel"}
            </Button> */}
          </div>
        </div>

        <br />
      </div>

      {/* {showPageDetails && <AddPage setXlxsData={setXlxsData} />} */}

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
          variant="outlined"
          size="large"
          color="secondary"
          className="btn btn-primary cmnbtn  mt-3 mb-3"
          disabled={loading}
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      </Box>
      <>
        <Dialog open={isModalOpenForCampaign} onClose={handleClose}>
          <DialogTitle>Add Campaign</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1 },
              }}
            >
              <>
                <TextField
                  id="outlined-password-input"
                  label="  * Campaign"
                  name="exeCmpName"
                  type="text"
                  // value={}
                  onChange={(e) => {
                    setCampaignModalPayload({
                      ...campaignModalPayload,
                      exeCmpName: e.target.value,
                    });
                  }}
                  sx={{ width: "100%" }}
                />
                <TextField
                  id="outlined-password-input"
                  label="Remark"
                  name="exeRemark"
                  type="text"
                  // value={campaignModalPayload.exeCmpName}
                  onChange={(e) => {
                    setCampaignModalPayload({
                      ...campaignModalPayload,
                      exeRemark: e.target.value,
                    });
                  }}
                  sx={{ width: "100%" }}
                />
              </>
            </Box>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button> */}
            <Button
              variant="contained"
              onClick={handleCampaignAdd}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isModalOpen} onClose={handleClose}>
          <DialogTitle>Add Record</DialogTitle>

          <DialogContent>
            <Box
              sx={{
                "& .MuiTextField-root": { m: 1 },
              }}
            >
              <div>
                <>
                  <TextField
                    id="outlined-password-input"
                    label="  * Brand"
                    name="brand_name"
                    type="text"
                    value={postData.brand_name}
                    onChange={handleChangeBrand}
                    sx={{ width: "100%" }}
                  />
                  <span style={{ color: "red" }}>{errBrandName}</span>
                </>

                <>
                  <Autocomplete
                    disablePortal
                    options={categoryOptions.map((option) => ({
                      label: option.category_name,
                      value: option.category_id,
                    }))}
                    renderInput={(params) => (
                      <TextField {...params} label="  * Category" />
                    )}
                    onChange={(event, newValue) => {
                      setPostData({
                        ...postData,
                        category_id: newValue.value,
                      });
                    }}
                  />
                </>
                <>
                  <Autocomplete
                    disablePortal
                    options={subcategoryOptions.map((item) => ({
                      label: item.sub_category_name,
                      value: item.sub_category_id,
                    }))}
                    renderInput={(params) => (
                      <TextField {...params} label="  * Subcategory" />
                    )}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setPostData({
                          ...postData,
                          sub_category_id: newValue.value,
                        });
                        setSubCategoryString(newValue.label);
                      }
                    }}
                  />
                </>

                <Autocomplete
                  id="combo-box-demo"
                  multiple
                  options={platform}
                  getOptionLabel={(option) => option.plat_name}
                  value={selectedPages}
                  onChange={(event, newValue) => {
                    setSelectedPages(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="  * Platform" />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.plt_id === value.plt_id
                  }
                />

                {selectedPages?.map((page, index) => (
                  <Box key={index} sx={{ display: "flex", mb: 1 }}>
                    <TextField
                      label="Page Name"
                      value={page.plat_name}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="User name"
                      value={userName[index]}
                      fullWidth
                      onChange={(e) =>
                        handlePlatfromChange(index, e.target.value)
                      }
                      sx={{ m: 2 }}
                    />
                  </Box>
                ))}

                <div></div>
              </div>
            </Box>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleClose} color="primary">
            Cancel
          </Button> */}
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
}
