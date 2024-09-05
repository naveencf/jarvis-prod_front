import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import ExePageDetailes from "../ExePageDetailes";
import axios from "axios";
import jwtDecode from "jwt-decode";
// import RequestAssignPage from "../RequestAssignPage";
import { baseUrl } from '../../../../utils/config'
import { Autocomplete, TextField } from "@mui/material";
import TempExecutionDetails from "./TempExecutionDetails";


const accordionButtons = [
  "All",
  // "Assignment",

];
const verification_status = [
  "verified",
  "pending"
]

const TempExecution = () => {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [assignmentData, setAssignmentData] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([])
  const [expert, setExpert] = useState({})
  const [filteredAssignment, setFilteredAssignment] = useState([])
  const [status, setStatus] = useState("pending" || "verified")
  const [campaignSelect, setCampaignSelect] = useState(null)



  const getExpertee = async () => {
    const res = await axios.get(
      `${baseUrl}` + `expertise/user/${decodedToken.id}`
    );
    setExpert(res.data.data)
  };

  const getExpertAssignment = async () => {
    const res = await axios.get(`${baseUrl}tempassignment/${expert._id}`)

    setAssignmentData(res.data.result)
    setFilteredAssignment(res.data.result)
    let camp = []
    let camp2 = []
    for (const ass of res.data.result) {
      if (!camp.includes(ass.assignment.plan.campaignName)) {
        camp2.push({ id: ass.assignment.plan.campaignId._id, campaignName: ass.assignment.plan.campaignName })
        camp.push(ass.assignment.plan.campaignName)
      }
    }
    setCampaignOptions(camp2)
  }

  console.log(campaignOptions)
  useEffect(() => {
    getExpertee()
  }, [])

  useEffect(() => {
    if (expert._id) {
      getExpertAssignment()

    }
  }, [expert])


  const HardRender = () => {
    getExpertAssignment()
  }

  const tab1 = (
    <TempExecutionDetails assignmentData={filteredAssignment} status={status} HardRender={HardRender} />
  );
  //   const tab2 = (

  //   );



  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  return (
    <>

      <FormContainer
        submitButton={false}
        mainTitle="Execution Campaign"
        title="Execution Campaign"
        execusion={true}
        link={true}
        accordionButtons={accordionButtons}
        activeAccordionIndex={activeAccordionIndex}
        onAccordionButtonClick={handleAccordionButtonClick}
      >



      </FormContainer>
      <div className="pack">
        <button className="btn cmnbtn btn_sm btn-primary" onClick={() => HardRender()}>All</button>

      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            Details
          </div>
          <div className="pack">
            <div className="row">
              <div className="col-md-6">

                <Autocomplete
                  id={(option) => option.id}
                  options={campaignOptions}
                  getOptionLabel={(option) => option.campaignName}
                  className={option => option.campaignId}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Select Campaign" variant="outlined" />}
                  onChange={(e, selectedId) => {
                    if (selectedId) {

                      const filter = assignmentData.filter(item => {
                        return item?.assignment?.plan?.campaignId._id == selectedId?.id
                      })
                      setCampaignSelect(selectedId)
                      setFilteredAssignment(filter)
                    }

                    else {
                      setCampaignSelect(null)
                      setFilteredAssignment(assignmentData)
                    }
                  }}
                />
              </div>
              <div className="col-md-6">

                <Autocomplete
                  id={(option) => option.id}
                  options={verification_status}
                  getOptionLabel={(option) => option}
                  className={option => option}
                  style={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Status" variant="outlined" />}
                  onChange={(e, selectedId) => {
                    if (selectedId) {
                      if (campaignSelect) {

                        const filteredData = assignmentData.filter(item => {
                          // Check if any commit item matches the selected verification status
                          return item.commit.some(commit => commit.verification_status === selectedId);
                        });

                        setFilteredAssignment(filteredData.filter(item => {
                          return item?.assignment?.plan?.campaignId._id == campaignSelect?.id
                        }))
                      } else {
                        const filteredData = assignmentData.filter(item => {
                          // Check if any commit item matches the selected verification status
                          return item.commit.some(commit => commit.verification_status === selectedId);
                        });

                        setFilteredAssignment(filteredData)

                      }

                    } else {
                      if (campaignSelect) {
                        const x = assignmentData.filter(item => {
                          return item?.assignment?.plan?.campaignId._id == campaignSelect?.id
                        })
                        setFilteredAssignment(x)
                      } else setFilteredAssignment(assignmentData)
                    }

                  }}
                />
              </div>

            </div>


          </div>
        </div>
        <div className="card-body">
          {activeAccordionIndex === 0 && tab1}
          {activeAccordionIndex === 1 && tab2}
        </div>
      </div>
    </>
  );
};

export default TempExecution;
