import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import axios from "axios";
import { data } from "jquery";
import NewPages from "./NewPages";
import {baseUrl} from '../../../../utils/config'

const ManagerCampaign = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [newPages, setNewPages] = useState([]);

  const Assigndata = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}`+`register_campaign`
      );
      console.log(response?.data?.data, "new camp data");
      setNewPages(response?.data?.data);
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

  const tab1 = <NewPages pages={newPages} />;
  const tab2 = "OldPages";

  const accordionButtons = ["NewPages", "OldPages"];

  return (
    <>
      <FormContainer
        submitButton={false}
        mainTitle="Manager Dashboard"
       handleSubmit={false}
       link={true}
      >
       
      </FormContainer>
      <div className="tab">
        {
          accordionButtons.map((button, index) => (

          <div className={`named-tab ${activeAccordionIndex === index ?"active-tab":""}` } onClick={()=>{
            handleAccordionButtonClick(index)
          }} >
            {
              button
            }
          </div>
          

          ))
        }
      </div>
      <div className="card body-padding">
      {activeAccordionIndex === 0 && tab1}
        {activeAccordionIndex === 1 && tab2}
      </div>
    </>
  );
};

export default ManagerCampaign;
