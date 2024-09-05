import DataTable from "react-data-table-component";
import { useAPIGlobalContext } from "../../AdminPanel/APIContext/APIContext";
import { useGlobalContext } from "../../../Context/Context";
import axios from "axios";
import FormContainer from "../../AdminPanel/FormContainer";
import { useEffect, useState } from "react";
import ManagerDynamicOverview from "./ManagerDynamicOverview";
import { baseUrl } from "../../../utils/config";

const NewAssetRequestOverview = () => {
  const { userID } = useAPIGlobalContext();
  const [managerData, setManagerData] = useState([]);
  const { toastAlert } = useGlobalContext();

  const [assetReturnData, setReturnAssetData] = useState([]);
  const [repairRequestData, setRepairRequestData] = useState([]);

  // New tab
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  const accordionButtons = [
    "Asset Repair Request",
    "New Asset Request",
    "Return Asset",
  ];
  const hardRender = () => {
    getManagerData();
    getReturnAssetData();
    getRepairRequestData();
  };

  const tab1 = (
    <ManagerDynamicOverview
      filterData={repairRequestData}
      hardRender={hardRender}
      tabOne="tabOne"
    />
  );
  const tab2 = (
    <ManagerDynamicOverview
      filterData={managerData}
      hardRender={hardRender}
      tabTwo="tabTwo"
    />
  );
  const tab3 = (
    <ManagerDynamicOverview
      filterData={assetReturnData}
      hardRender={hardRender}
      tabThree="tabThree"
    />
  );
  const getRepairRequestData = () => {
    axios
      .get(`${baseUrl}show_repair_request_asset_data_to_reportL1/${userID}`)
      .then((res) => {
        setRepairRequestData(res.data.data);
      });
  };

  const getManagerData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}` + `show_asset_user_data_report/${userID}`
      );
      const data = response?.data.data;

      setManagerData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getReturnAssetData = () => {
    axios
      .get(`${baseUrl}show_return_asset_to_reportL1/${userID}`)
      .then((res) => {
        setReturnAssetData(res.data.data);
      });
  };

  useEffect(() => {
    getManagerData();
    getReturnAssetData();
    getRepairRequestData();
  }, []);

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            submitButton={false}
            mainTitle="Manager Panel Requests"
            title=""
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && tab1}
            {activeAccordionIndex === 1 && tab2}
            {activeAccordionIndex === 2 && tab3}
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default NewAssetRequestOverview;
