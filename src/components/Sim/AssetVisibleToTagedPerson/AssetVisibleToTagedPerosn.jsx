import { useEffect, useState } from "react";
import FormContainer from "../../AdminPanel/FormContainer";
import axios from "axios";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import TagedPersonOverview from "./TagedPersonOverview";
import { baseUrl } from "../../../utils/config";

const AssetVisibleToTagedPerosn = () => {
  const { userID } = useAPIGlobalContext();
  const [filterData, setFilterData] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [newAssetRequestData, setNewassetData] = useState([]);

  // New tab
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = ["Asset Repair Request", "New Asset Request"];

  const tab1 = <TagedPersonOverview filterData={filterData} tabOne="tabOne" />;
  const tab2 = (
    <TagedPersonOverview filterData={newAssetRequestData} tabTwo="tabTwo" />
  );

  useEffect(() => {
    getData();
    getNewAssetData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.asset_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `show_asset_repair_request_data_to_user/${userID}`
      );
      setFilterData(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getNewAssetData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `show_new_asset_user_data/${userID}`
      );
      setNewassetData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle="Tagged Asset Request"
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
          {
            accordionButtons.map((button, index) => (
              <div
                key={index}
                className={`named-tab ${activeAccordionIndex === index ? "active-tab" : ""}`}
                onClick={() => handleAccordionButtonClick(index)}
              >
                {button}
              </div>
            ))
          }
        </div>
        <div className="card">
          <div className="card-header">
            Assets
          </div>
          <div className="card-body thm_table">
            {activeAccordionIndex === 0 && tab1}
            {activeAccordionIndex === 1 && tab2}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetVisibleToTagedPerosn;
