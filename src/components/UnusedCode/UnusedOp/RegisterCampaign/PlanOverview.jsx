import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Button, Box } from "@mui/material"; //Tooltip
import DeleteIcon from "@mui/icons-material/Delete";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReplacePagesModal from "./ReplacePagesModal";
import CampaignDetailes from "./CampaignDetailes";
import PageOverview from "./PageOverview";
import { baseUrl } from "../../../utils/config";
import FormContainer from "../FormContainer";
import { tr } from "date-fns/locale";

const PlanOverview = () => {
  const [selectData, setSelectData] = useState([]);
  const [render, setRender] = useState(false);

  const param = useParams();
  const id = param.id;

  const getSelectPage = async () => {
    const newPlan = await axios.get(
      `${baseUrl}` + `campaignplan/${id}`
    );
    console.log(newPlan, "dfsldfksdl");
    const x = newPlan.data.data.filter((page) => {
      if (
        (page.replacement_status == "pending" ||
          page.replacement_status == "replacement" ||
          page.replacement_status == "inactive") && (page.delete_status == 'inactive')
      ) {
      }
      return page;
    });
    setSelectData(x);
  };

  useEffect(() => {
    getSelectPage();
  }, []);

  const renderHard = () => {
    getSelectPage();
  };

  return (
    <div>
      <FormContainer
        mainTitle={"Plan Overview"}
        link={true}
      />

      <CampaignDetailes cid={id} />
      <PageOverview
        selectData={selectData}
        setrender={renderHard}
        stage={"plan"}
        id={id}
      />
    </div>
  );
};

export default PlanOverview;
