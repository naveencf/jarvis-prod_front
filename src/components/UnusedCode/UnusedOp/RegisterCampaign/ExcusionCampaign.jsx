import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import ExePageDetailes from "./ExePageDetailes";
import axios from "axios";
import jwtDecode from "jwt-decode";
import RequestAssignPage from "./RequestAssignPage";
import { baseUrl } from '../../../utils/config'
import { Autocomplete, TextField } from "@mui/material";
import AssignmentExcusionPage from "../../UnusedCode/UnusedOp/ExcusionTab/AssignmentExcusionPage";

const ExcusionCampaign = () => {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [assignmentData, setAssignmentData] = useState([]);
  const [executedData, setExecutedData] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [requestAssign, SetRequestAssign] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [unfilteredAssignment, setUnfilteredAssignment] = useState([])


  const getExpertee = async () => {
    const expert = await axios.get(
      `${baseUrl}` + `expertise/user/${decodedToken.id}`
    );
    getAssignment(expert.data.data.exp_id);
  };

  useEffect(() => {
    let x = []
    for (const pages of unfilteredAssignment) {
      if (!x.some(item => pages.ass_page?.campaignName == item?.campaignName)) {
        x.push({ campaignName: pages.ass_page?.campaignName, campaignId: pages?.campaignId })
      }
    }
    // setCampaignOptions(x)    
  }, [unfilteredAssignment, requestAssign, selectedCampaign])

  useEffect(() => {
    getExpertee();
  }, [activeAccordionIndex]);

  const RequestAssign = async () => {
    const reqAss = await axios.get(    
      `${baseUrl}` + `preassignment/${decodedToken.id}`
    );
    const data = reqAss?.data?.data.filter((item) => {
      if (!selectedCampaign) {
        return item.status == "pending"

      } else return (item.status == "pending" && item.campaignId == selectedCampaign)
    })
    const data2 = reqAss?.data?.data.filter((item) => {
      return item.status == "pending"
    })

    setUnfilteredAssignment(data2)
    SetRequestAssign(data);
  };

  useEffect(() => {
    RequestAssign();
    getAssignment()
  }, [selectedCampaign]);

  const getAssignment = async (id) => {
    const getData = await axios.get(
      `${baseUrl}` + `assignment/all/${decodedToken.id}`
    );

    const getCampaigns = Object.values(getData.data.data.reduce((acc, cur) => {
      acc[cur.campaignId] = { campaignId: cur.campaignId, campaignName: cur.campaignName };
      return acc;
    }, {}));
    setCampaignOptions(getCampaigns)

    const assigned = getData?.data?.data.filter(
      (item) => {
        if (!selectedCampaign) {
          return item.ass_status == "assigned" || item.ass_status == "pending"
        } else {
          return (item.ass_status == "assigned" || item.ass_status == "pending") && item.campaignId == selectedCampaign
        }
      }
    ).reverse()

    const excuted = getData?.data?.data.filter(
      (item) => {
        if (!selectedCampaign) {
          return item.ass_status == "executed"
        } else {
          return item.ass_status == "executed" && item.campaignId == selectedCampaign
        }
      }
    ).reverse();
    const verified = getData?.data?.data.filter(
      (item) => {
        if (!selectedCampaign) {
          return item.ass_status == "verified"
        } else {
          return item.ass_status == "verified" && item.campaignId == selectedCampaign
        }
      }
    ).reverse();
    const rejected = getData?.data?.data.filter(
      (item) => {
        if (!selectedCampaign) {
          return item.ass_status == "rejected"
        } else {
          return item.ass_status == "rejected" && item.campaignId == selectedCampaign
        }
      }
    ).reverse();
    setAssignmentData(assigned);
    // setPendingData(pending);
    setExecutedData(excuted);
    setVerifiedData(verified);
    setRejectedData(rejected);
  };
  useEffect(() => {
    // getAssignment();
    getExpertee();
  }, []);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const tab1 = (
    <RequestAssignPage data={requestAssign} RequestAssign={RequestAssign} />
  );

  const tab2 = (
    // <ExePageDetailes
    //   data={assignmentData}
    //   status={"assigned"}
    //   selectedCampaign={selectedCampaign}
    //   // setActiveAccordionIndex={setActiveAccordionIndex}
    //   setActiveAccordionIndex={setActiveAccordionIndex}
    //   activeAccordion="1"
    //   getAssignment={getAssignment}
    // />
    <AssignmentExcusionPage
          selectedCampaign={selectedCampaign}
          data={assignmentData}
          selectedCamp={selectedCampaign}
          getAssignment={getAssignment}
          status={"assigned"}
    />
  );
  const tab3 = (
    <ExePageDetailes
      data={executedData}
      status={"executed"}
      setActiveAccordionIndex={setActiveAccordionIndex}
      activeAccordion="3"
      getAssignment={getAssignment}
    />
  );
  const tab4 = (
    <ExePageDetailes
      data={verifiedData}
      status={"verified"}
      setActiveAccordionIndex={setActiveAccordionIndex}
      activeAccordion="4"
      getAssignment={getAssignment}
    />
  );
  const tab5 = (
    <ExePageDetailes
      data={rejectedData}
      status={"rejected"}
      setActiveAccordionIndex={setActiveAccordionIndex}
      getAssignment={getAssignment}
    />
  );

  const accordionButtons = [
    "Requested Assign",
    "Assignment",
    // "Pending Excuation",
    "Executed",
    "Verified",
    "Rejected",
  ];

  return (
    <div>
      <FormContainer
        submitButton={false}
        mainTitle="Execution Campaign"
        title="Execution Campaign"
        execusion={true}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
        link={true}
      >


      </FormContainer>
      <div className="tab">
        {
          accordionButtons.map((button, index) => (
            <div className={`named-tab ${activeAccordionIndex === index ? "active-tab" : ""}`} onClick={() => handleAccordionButtonClick(index)}>
              {button}
            </div>
          ))
        }
      </div>
      <div className="card">
        <div className="card-header sb">
          <div className="card-title">
            Execution Campaign
          </div>
          <div className="pack w-75">
            <Autocomplete
              id="campaigns"
              options={campaignOptions}
              getOptionLabel={(option) => option.campaignName}
              className={option => option.campaignId}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Select Campaign" variant="outlined" />}
              onChange={(e, value) => {
                setSelectedCampaign(value.campaignId)
              }}
            />
          </div>
        </div>
        <div className="card-body thm_table fx-head nt-head">
          {activeAccordionIndex === 0 && tab1}
          {activeAccordionIndex === 1 && tab2}
          {activeAccordionIndex === 2 && tab3}
          {activeAccordionIndex === 3 && tab4}
          {activeAccordionIndex === 4 && tab5}
        </div>
      </div>
    </div>
  );
};

export default ExcusionCampaign;