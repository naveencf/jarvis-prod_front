import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CampaignDetailes from "./CampaignDetailes";
import { Link, Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DataGrid, GridExpandMoreIcon } from "@mui/x-data-grid";
import PageDetaling from "./PageDetailing";

import {
  Paper,
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  AccordionDetails,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordioan from "./Accordioan";
import { useNavigate } from "react-router-dom";
import PageOverview from "./PageOverview";
import PageDetailingNew from "./PageDetailingNew";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
import FormContainer from "../FormContainer";

const PhasecreationNew = () => {
  const param = useParams();
  const id = param.id;
  const { toastAlert, toastError } = useGlobalContext();
  const naviagte = useNavigate();
  const [allPageData, setAllPageData] = useState([]);
  const [phaseData, setPhaseData] = useState("");
  const [phaseDataError, setPhaseDataError] = useState("");
  const [phaseDcripation, setPhaseDcripation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [campaignName, setCampaignName] = useState([]);
  const [modalSearchPageStatus, setModalSearchPageStatus] = useState(false);
  const [cmpName, setCmpName] = useState("");
  const [allPhaseData, setAllPhaseData] = useState([]);
  const [showPageDetails, setShowPageDetails] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [assignAll, setAssignAll] = useState(false);
  const [stopCreate, setStopCreate] = useState(false);
  const [campaignData, setCampaignData] = useState({});

  useEffect(() => {
    getPhaseData();
  }, []);

  const getPhaseData = async () => {
    const data = await axios.get(`${baseUrl}` + `campaignphase/${id}`);
    const pageD = await axios.get(`${baseUrl}` + `campaignplan/${id}`);
    setAllPhaseData(data?.data?.result);
    setAllPageData(pageD?.data?.data);
  };

  const getCampaignName = (detail, cmp, cmpData) => {
    setCmpName(cmp);
    if (assignAll) {
      const det = detail.map((item) => {
        return { ...item, value: item.max };
      });
      setCampaignName(det);
    } else setCampaignName(detail);

    setCampaignData(cmpData);
  };

  const togglePageDetails = () => {
    setShowPageDetails(!showPageDetails);
    setAssignAll(false);
  };

  const handleAllAssign = () => {
    setShowPageDetails(!showPageDetails);
    setAssignAll(true);
  };

  console.log(allPageData);
  useEffect(() => {
    if (allPhaseData.length > 0) {
      let flag = false;
      allPageData.forEach((page) => {
        if (Number(page.postRemaining) > 0 || Number(page.storyRemaining) > 0) {
          flag = true;
        }
      });

      if (flag == true) {
        setStopCreate(false);
      } else setStopCreate(true);
    }
  }, [allPageData]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderHard = () => {
    getPhaseData();
  };
  const handlePlanDashboard = () => {
    naviagte(`/admin/planOverview/${id}`);
  };

  return (
    <div className="master-card-css">
    <FormContainer
      mainTitle="Phase Creation"
      link="true"
    />
      
      <CampaignDetailes cid={id} getCampaign={getCampaignName} />
      {/* add Accordion for show phase------------------- */}
      <Paper>
        {allPhaseData?.map((item,index)=>(
          <Paper key={index}>
            <Link
              to={`/admin/createAssign/${item.phase_id}`}
              style={{
                margin: "2px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" color="primary" size="small">
                Create Assignment
              </Button>
              {/* {
                allPhaseData.length == 0 &&
                <Button variant="contained" color="primary" size="small">
                  assign all
                </Button>
              } */}
            </Link>
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                // aria-controls={`panel${index}bh-content`}
                // id={`panel${index}bh-header`}
              >
                <Typography>{`Phase ${index + 1}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <Accordioan data={item} /> */}

                <PageOverview
                  selectData={item.pages}
                  phaseIndex={`Phase ${index + 1}`}
                  stage={"phase"}
                  setRender={renderHard}
                  phase_id={item.phase_id}
                />
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Paper>
      {/* add Accordion for show end phase------------------- */}

      {!stopCreate && (
        <>
          <Button
            variant="outlined"
            onClick={togglePageDetails}
            sx={{ mt: 2, mb: 2 }}
          >
            {showPageDetails ? "Hide Page Details" : "Create New Phase"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleAllAssign}
            sx={{ m: 2, mb: 2 }}
          >
            create final phase
          </Button>

          <Button variant="outlined"  onClick={handlePlanDashboard}sx={{ m: 2, mb: 2 }}>
            Plan Overview
          </Button>
        </>
      )}

      {showPageDetails && (
        <>
          <Typography
            variant="h6"
            sx={{
              boxShadow: 4,
              mb: 2,
              borderRadius: "15px",
              padding: "5px",
            }}
            color="secondary"
          >
            Phase Details
          </Typography>
          <Paper>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <TextField
                label="Phase"
                defaultValue={`Phase ${allPhaseData.length + 1}`}
                onChange={(e) => {
                  setPhaseData(e.target.value);
                  // if (phaseDataError) {
                  //   setPhaseDataError("");
                  // }
                }}
                sx={{ m: 1, width: "300px" }}
                // error={!!phaseDataError}
                // helperText={phaseDataError}
              />

              <TextField
                label="Description"
                value={phaseDcripation}
                onChange={(e) => setPhaseDcripation(e.target.value)}
                sx={{ m: 1, width: "300px" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date *"
                  format="DD/MM/YY"
                  value={startDate}
                  onChange={(e) => setStartDate(e.$d)}
                  sx={{ m: 1, width: "300px" }}
                />
                <DatePicker
                  label="End Date *"
                  format="DD/MM/YY"
                  value={endDate}
                  onChange={(e) => setEndDate(e.$d)}
                  sx={{ m: 1, width: "300px" }}
                />
              </LocalizationProvider>
            </Box>

            {campaignName?.map((cmp, index) => {
              return (
                <Box
                  sx={{ display: "flex", justifyContent: "space-around" }}
                  key={index}
                >
                  <TextField
                    disabled
                    value={cmp?.commitment}
                    sx={{ m: 1 }}
                    fullWidth
                  />
                  <TextField
                    label="Value"
                    type="number"
                    value={assignAll ? cmp?.max : cmp.value}
                    disabled={assignAll ? true : false}
                    onChange={(e) => {
                      if (e.target.value > Number(cmp?.max)) {
                        e.target.value = cmp?.max;
                      }
                      let x = [...campaignName];
                      x.splice(index, 1, {
                        commitment: cmp?.commitment,
                        value: Number(e.target.value),
                        max: cmp?.max,
                      });
                      setCampaignName(x);
                    }}
                    sx={{ m: 1 }}
                    fullWidth
                  />
                </Box>
              );
            })}
          </Paper>

          <PageDetailingNew
            pageName={"phaseCreation"}
            data={{ campaignName: cmpName, campaignId: id }}
            phaseInfo={{
              phaseName: phaseData,
              description: phaseDcripation,
              commitment: campaignName,
              phaseDataError: phaseDataError,
              getPhaseData,
              setExpanded,
              setShowPageDetails,
              
              assignAll,
            }}
            setPhaseDataError={setPhaseDataError}
          />
        </>
      )}
    </div>
  );
};

export default PhasecreationNew;
