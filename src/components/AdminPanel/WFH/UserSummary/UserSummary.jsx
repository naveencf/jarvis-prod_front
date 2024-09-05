import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import UserSummaryOverview from "./UserSummaryOverview";

const UserSummary = () => {
  const { userID } = useAPIGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [docDatas, setDocDatas] = useState([]);

  // New tab
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Bank Details", "Documents"];

  const tab1 = <UserSummaryOverview filterData={filterData} tabOne="tabOne" />;
  const tab2 = <UserSummaryOverview filterData={docDatas} tabTwo="tabTwo" />;

  useEffect(() => {
    getData();
    getDocumentData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_single_user/${userID}`
      );
      setFilterData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDocumentData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `get_doc_by_userid/${userID}`
      );
      setDocDatas(response.data);
      console.log(response.data, "response data ");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="master-card-css">
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle="User Summary"
            title=""
            link="true"
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && tab1}
            {activeAccordionIndex === 1 && tab2}
          </FormContainer>
        </div>
        <div className="tab">
          {accordionButtons.map((button, index) => (
            <div
              key={index}
              className={`named-tab ${
                activeAccordionIndex === index ? "active-tab" : ""
              }`}
              onClick={() => handleAccordionButtonClick(index)}
            >
              {button}
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-header">User Summary</div>
          <div className="card-body body-padding">
            {activeAccordionIndex === 0 && tab1}
            {activeAccordionIndex === 1 && tab2}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSummary;
