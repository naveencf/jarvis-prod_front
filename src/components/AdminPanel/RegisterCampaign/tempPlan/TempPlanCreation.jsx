import CampaignDetailes from "../CampaignDetailes";
import { useParams } from "react-router-dom";
import { useState} from "react";
import PageDetailingNew from "../PageDetailingNew";
import FormContainer from "../../FormContainer";

const TempPlanCreation = () => {

    const [campaignName, setCampaignName] = useState(null);

    const param = useParams();
    const id = param.id;

    const getCampaignName = (data, cmpName) => {
        setCampaignName(cmpName);
        // console.log(cmpName)
    };

    return (
        <>
           
            <FormContainer 
            mainTitle="Plan Creation"
            link="true"
            />
            <CampaignDetailes cid={id} getCampaign={getCampaignName} />

            <PageDetailingNew
                
                pageName={"tempPlanCreation"}
               
                data={{ campaignId: id, campaignName }}
                
            />
        </>
    )
}

export default TempPlanCreation