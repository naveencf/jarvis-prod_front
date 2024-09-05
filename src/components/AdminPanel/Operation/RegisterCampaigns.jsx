import {
  Button,
  TextField,
  Autocomplete,
  FormControl,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { baseUrl } from "../../../utils/config";
import FormContainer from "../FormContainer";
import CreateCampaign from "./CampaignMaster/CreateCampaign";
import OverViewCampaign from "./CampaignMaster/OverViewCampaign";
import { useGetAllExeCampaignsQuery } from "../../Store/API/Sales/ExecutionCampaignApi";
import { useGetAllAgenciesQuery } from "../../Store/API/Sales/AgencyApi";
import formatString from "./CampaignMaster/WordCapital";
import { useGetAllBrandQuery } from "../../Store/API/Sales/BrandApi";

export default function RegisterCampaigns() {
  const { data: exeCampaignData } = useGetAllExeCampaignsQuery();
  const { data: allBrandData } = useGetAllBrandQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const saleBookingId = location.state?.sale_id;
  const [openCamp, setOpenCamp] = useState(false);
  const [openCampView, setOpenCampView] = useState(false);
  const handleOpenCampaign = () => setOpenCamp(true);
  const handleCloseCampaign = () => setOpenCamp(false);

  const handleViewCampaign = () => setOpenCampView(true);
  const handleCloseCampaignView = () => setOpenCampView(false);

  const [salesUsers, setSalesUsers] = useState([]);
  const { toastAlert, toastError } = useGlobalContext();
  const [campaignDetailing, setCampaignDetailing] = useState("");
  const [instaBrnadname, setInstaBrnadname] = useState("");
  const [majorCategory, setMajorCategory] = useState("");
  const [xlxsData, setXlxsData] = useState([]);
  const [fields, setFields] = useState([{ selectValue: "", textValue: "" }]);
  const [showAlert, setShowAlert] = useState(false);
  const [campignData, setCampignData] = useState([{}]);
  const [industry, setIndustry] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [goal, setGoal] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("");
  const [agencyList, setAgencyList] = useState([]);
  const [campaignClosedBy, setCampaignClosedBy] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [campaignList, setCampignList] = useState([]);
  const [dataEx, setDataEx] = useState({});
  const [agencyName, setAgencyName] = useState("");
  const { data: agencyData } = useGetAllAgenciesQuery();

  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    if (
      fields.length === 0 ||
      fields.some((field) => !field.selectValue || !field.textValue)
    ) {
      hasError = true;
    }
    if (!selectedGoal) {
      hasError = true;
    }
    if (!selectedDate) {
      hasError = true;
    }
    if (!goal) {
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
    const payload = {
      pre_brand_id: dataEx?.brand_id,
      brnad_dt: selectedDate,
      commitments: JSON.stringify(fields),
      pre_campaign_id: dataEx?.campaign_id,
      details: campaignDetailing,
      captions: caption,
      hash_tag: hashtag,
      pre_goal_id: selectedGoal,
      campaign_closed_by: campaignClosedBy,
      sale_booking_id: saleBookingId,
    };
    setLoading(true);
    axios
      .post(baseUrl + "opcampaign", payload)
      .then(() => {
        setBrandName([]);
        setSelectedDate(null);
        setFields([{ selectValue: "", textValue: "" }]);
        setXlxsData([]);
        setBrandName([]);
        setFields([]);
        setLoading(false);
        navigate("/admin/op-registered-campaign");
        toastAlert("Campaign Regrister Successfully");
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const commitmentOptions = [
    "Reach",
    "Engagement",
    "Story views",
    "Reels views",
  ];

  const handleAddField = () => {
    const newField = { selectValue: "", textValue: "" };
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

  useEffect(() => {
    setSelectedDate(dayjs().format("YYYY-MM-DD HH:mm:ss"));
    getAllData();
  }, []);

  useEffect(() => {
    const getExeCampData = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}get_single_sale_booking_data_new_table/${saleBookingId}`
        );
        const saleBookingData = res.data.data;
        setDataEx(saleBookingData);
      } catch (error) {
        console.error("Error fetching sale booking data:", error);
      }
    };

    getExeCampData();
  }, [saleBookingId]);

  useEffect(() => {
    if (dataEx) {
      const brand = allBrandData?.find(
        (item) => item?._id === dataEx?.brand_id
      );
      const brnadname = brand?.instaBrandName;
      const majorCategory = brand?.majorCategory;
      setMajorCategory(majorCategory);
      setInstaBrnadname(brnadname);
      const campaign = exeCampaignData?.find(
        (item) => item._id === dataEx?.campaign_id
      );
      const agencyID = campaign?.agency_id;
      const agency = agencyData?.find((item) => item?._id === agencyID);
      const agencyName = agency?.agency_name;
      setAgencyName(agencyName);
    }
  }, [exeCampaignData, dataEx, agencyData, allBrandData]);

  const getAllData = async () => {
    try {
      const [commitmentsRes, campaignRes, agencyRes, goalRes, industryRes] =
        await Promise.all([
          axios.get(baseUrl + "get_all_commitments"),
          axios.get(baseUrl + "exe_campaign"),
          axios.get(baseUrl + "agency"),
          axios.get(baseUrl + "goal"),
          axios.get(baseUrl + "industry"),
        ]);
      setCampignList(commitmentsRes.data.data);
      setCampignData(campaignRes.data.data);
      setAgencyList(agencyRes?.data?.result);
      setGoal(goalRes.data.result);
      setIndustry(industryRes.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleHashtagChange = (event) => {
    setHashtag(event.target.value);
  };
  const handleAgencyChange = (event) => {
    setSelectedAgency(
      agencyList.filter(
        (e) => event.target.value.toLowerCase() == e.name.toLowerCase()
      )[0]?._id
    );
  };
  const handleGoalChange = (event) => {
    setSelectedGoal(
      goal.filter(
        (e) => event.target.value.toLowerCase() == e.name.toLowerCase()
      )[0]?._id
    );
  };

  const handleIndusrtyChange = (event) => {
    setSelectedIndustry(
      industry.filter(
        (e) => event.target.value.toLowerCase() == e.name.toLowerCase()
      )[0]?._id
    );
  };

  const handleCampaignClose = (event) => {
    setCampaignClosedBy(
      salesUsers.filter(
        (e) => event.target.value.toLowerCase() == e.user_name.toLowerCase()
      )[0]?.user_id
    );
  };

  const fetchSalesUsers = () => {
    axios
      .get(`${baseUrl}get_all_sales_users`)
      .then((response) => {
        setSalesUsers(response.data);
      })
      .catch((err) => {
        toastError("Failed to fetch sales users");
      });
  };

  const categoryData = () => {
    axios.get(baseUrl + "projectxCategory").then((res) => {
      setCategoryOptions(res.data.data);
    });
  };
  useEffect(() => {
    categoryData();
    fetchSalesUsers();
  }, []);
  useEffect(() => {
    getAllData();
  }, [instaBrnadname, majorCategory]);

  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle="Register Campaign" link="true" />
        </div>
        <div className="action_btns">
          <Link to="/admin/overview/industry" style={{ marginRight: "5px" }}>
            <button
              type="button"
              className="btn cmnbtn btn-outline-primary btn_sm"
            >
              Industry Master
            </button>
          </Link>
          <Link to="/admin/overview/goal" style={{ marginRight: "5px" }}>
            <button
              type="button"
              className="btn cmnbtn btn-outline-primary btn_sm"
            >
              Goal Master
            </button>
          </Link>
          <Link to="/admin/contentcreater" style={{ marginRight: "5px" }}>
            <button
              type="button"
              className="btn cmnbtn btn-outline-primary btn_sm"
            >
              Commitment Master
            </button>
          </Link>
        </div>
      </div>
      <>
        {showAlert && (
          <div className="alert alert-danger mt-3" role="alert">
            Please fill in all the required fields.
          </div>
        )}
      </>
      <div className="card body-padding">
        <>
          <Box>
            <Box className="row">
              <div className="col-md-4 ">
                <div className="form-group">
                  <div className="input-group inputAddGroup">
                    {/* <Autocomplete
                      options={campignData.map((option) => ({
                        label: formatString(option.exe_campaign_name),
                        value: option._id,
                      }))}
                      require={true}
                      value={campaign?.label}
                      onChange={(e, newValue) => setCampaign(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} label="Campaign *" />
                      )}
                    /> */}
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                      label={
                        <>
                          Campaign <sup style={{ color: "red" }}>*</sup>
                        </>
                      }
                      value={formatString(dataEx?.campaign_name)}
                      className="mr-4"
                    />
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{ shrink: true }}
                      label={
                        <>
                          Agency <sup style={{ color: "red" }}>*</sup>
                        </>
                      }
                      value={agencyName}
                      className="ml-4"
                    />
                    {/* 
                    <IconButton
                      onClick={handleOpenCampaign}
                      variant="contained"
                      color="primary"
                      aria-label="Add Platform.."
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleViewCampaign}
                      variant="contained"
                      color="primary"
                      aria-label="Platform Info.."
                    >
                      <InfoIcon />
                    </IconButton> */}
                  </div>
                </div>
              </div>
              <div className="form-group col-4">
                {/* <Autocomplete
                  disablePortal
                  options={showBrandName?.map((option) =>
                    formatString(option.instaBrandName)
                  )}
                  require={true}
                  value={
                    showBrandName.filter((e) => brandName == e._id)[0]
                      ?.instaBrandName
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Brand Name *" />
                  )}
                  onSelect={handleChange}
                /> */}
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <>
                      Brand <sup style={{ color: "red" }}>*</sup>
                    </>
                  }
                  value={instaBrnadname}
                  className="mr-4"
                />
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  label={
                    <>
                      Major Category <sup style={{ color: "red" }}>*</sup>
                    </>
                  }
                  value={majorCategory}
                  className="ml-4"
                />
              </div>

              <div className="form-group col-2">
                <TextField
                  label={
                    <>
                      Date and Time <sup style={{ color: "red" }}>*</sup>
                    </>
                  }
                  value={selectedDate}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ width: 300 }}
                />
              </div>
              {/* <div className="form-group col-4">
                <Autocomplete
                  options={
                    industry?.length > 0 &&
                    industry.map((option) => option.name)
                  }
                  value={
                    industry.filter((e) => selectedIndustry == e._id)[0]?.name
                  }
                  onSelect={handleIndusrtyChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Industry" />
                  )}
                />
              </div> */}
              {/* <div className="form-group col-4">
                <Autocomplete
                  options={
                    agencyList?.length > 0 &&
                    agencyList?.map((option) => option?.name)
                  }
                  value={
                    agencyList.filter((e) => selectedAgency == e._id)[0]?.name
                  }
                  onSelect={handleAgencyChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Agency" />
                  )}
                />
              </div> */}
              <div className="form-group col-4">
                <Autocomplete
                  options={
                    goal?.length > 0 && goal?.map((option) => option?.name)
                  }
                  value={goal.filter((e) => selectedGoal == e._id)[0]?.name}
                  onSelect={handleGoalChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <>
                          Goal <sup style={{ color: "red" }}>*</sup>
                        </>
                      }
                    />
                  )}
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
                  options={
                    salesUsers?.length > 0 &&
                    salesUsers?.map((user) => formatString(user.user_name))
                  }
                  value={
                    salesUsers.filter((e) => campaignClosedBy == e._id)[0]
                      ?.user_name
                  }
                  onSelect={handleCampaignClose}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <>
                          Campaign Closed <sup style={{ color: "red" }}>*</sup>
                        </>
                      }
                    />
                  )}
                />
              </div>
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-around", mb: 0.5 }}
          >
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
                  <div key={index} className="mt-1  d-flex">
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
                          <TextField
                            {...params}
                            label={
                              <>
                                Commitment <sup style={{ color: "red" }}>*</sup>
                              </>
                            }
                          />
                        )}
                      />
                    </FormControl>

                    <TextField
                      requiredx
                      label="Value"
                      value={field.textValue}
                      type="number"
                      fullWidth
                      onChange={(event) => handleTextChange(event, index)}
                    />
                    {fields.length > 1 && (
                      <Button onClick={(e) => handleRemoveField(e, index)}>
                        <i className="fas fa-close"></i>
                      </Button>
                    )}
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
          </div>
        </div>
        <br />
      </div>

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <button
          onClick={(e) => {
            handleSubmit(e);
          }}
          variant="outlined"
          color="secondary"
          className="btn btn-primary cmnbtn  mt-3 mb-3"
          disabled={loading}
        >
          {loading ? "Submitting" : "Submit"}
        </button>
      </Box>
      <>
        <>
          {/* Create Campaign */}
          <CreateCampaign
            openCamp={openCamp}
            handleOpenCampaign={handleOpenCampaign}
            handleCloseCampaign={handleCloseCampaign}
          />
          <OverViewCampaign
            openCamp={openCampView}
            handleOpenCampaign={handleViewCampaign}
            handleCloseCampaign={handleCloseCampaignView}
          />
        </>
      </>
    </div>
  );
}
