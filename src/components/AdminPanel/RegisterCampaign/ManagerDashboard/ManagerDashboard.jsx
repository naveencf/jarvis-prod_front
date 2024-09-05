import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField } from "@mui/material";
import FormContainer from "../../FormContainer";
import Pending from "./Pending";
import Executed from "./Executed";
import Verified from "./Verified";
import Rejected from "./Rejected";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";

const ManagerDashboard = () => {
  const param = useParams();
  const Cid = param.id;
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [pending, setPending] = useState([]);
  const [executedData, setExecutedData] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);
  const [filterData, setfilterData] = useState("");

  const Assigndata = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}`+`assignment/campaign/${Cid}`
      );
      
    
      const assigned = response.data?.data?.filter(
        (item) =>  item.ass_status === "assigned" || item.ass_status === "pending"
         
      );
      const executed = response.data?.data?.filter(
        (item) => item.ass_status === "executed"
      );
      const verified = response.data?.data?.filter(
        (item) => item.ass_status === "verified"
      );
      const rejected = response.data?.data?.filter(
        (item) => item.ass_status === "rejected"
      );

      setPending(assigned);
      setExecutedData(executed);
      setVerifiedData(verified);
      setRejectedData(rejected);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    Assigndata();
  }, []);

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const handleFilterChange = (event) => {
    setfilterData(event.target.value);
  };

  // const filteredPending = pending?.filter((item) =>
  //   item?.exp_name?.toLowerCase().includes(filterData?.toLowerCase())
  // );
  // const filteredExecuted = executedData?.filter((item) =>
  //   item?.exp_name?.toLowerCase().includes(filterData?.toLowerCase())
  // );
  // const filteredVerified = verifiedData?.filter((item) =>
  //   item?.exp_name?.toLowerCase().includes(filterData?.toLowerCase())
  // );
  // const filteredRejected = rejectedData?.filter((item) =>
  //   item?.exp_name?.toLowerCase().includes(filterData?.toLowerCase())
  // );

  // console.log(filteredPending)

  const forceRender = () => {
    Assigndata();
  };

  const tab1 = <Pending pending={pending} forceRender={forceRender} />;
  const tab2 = (
    <Executed executed={executedData} forceRender={forceRender} />
  );
  const tab3 = (
    <Verified verified={verifiedData} forceRender={forceRender} />
  );
  const tab4 = (
    <Rejected rejected={rejectedData} forceRender={forceRender} />
  );

  const accordionButtons = ["Pending", "Executed", "Verified", "Rejected"];

  return (
    <>
      <FormContainer
        submitButton={false}
        mainTitle=" Campaign Progress Tab "
       link={true}
       handleSubmit={false}
      >
      
      </FormContainer>
      <div className="tab">
      {accordionButtons.map((item, index) => (
        <div className={`named-tab ${activeAccordionIndex === index ?"active-tab":""}`}
        onClick={()=>{handleAccordionButtonClick(index)}}>{item}</div>
      ))}
      </div>
      <div className="card">
        <div className="card-header">
          <div className="pack">
          <TextField
            label="Search Experts"
            type="text"
            value={filterData}
            onChange={handleFilterChange}
            sx={{ mb: 2, width: "20%" }}
          />
          </div>
        </div>
        <div className="card-body">
          {activeAccordionIndex === 0 && tab1}
          {activeAccordionIndex === 1 && tab2}
          {activeAccordionIndex === 2 && tab3}
          {activeAccordionIndex === 3 && tab4}
        </div>
      </div>
    </>
  );
};

export default ManagerDashboard;
