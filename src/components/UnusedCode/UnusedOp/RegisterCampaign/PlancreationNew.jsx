import CampaignDetailes from "./CampaignDetailes";
import { useParams } from "react-router-dom";
import { useState} from "react";
import PageDetailingNew from "./PageDetailingNew";

const PlancreationNew = () => {

    const [campaignName, setCampaignName] = useState(null);

    const param = useParams();
    const id = param.id;

    const getCampaignName = (data, cmpName) => {
        setCampaignName(cmpName);
        // console.log(cmpName)
    };

    return (
        <>
            <div>
                <div className="form_heading_title">
                    <h2 className="form-heading">Plan Creation</h2>
                </div>
            </div>
            <CampaignDetailes cid={id} getCampaign={getCampaignName} />

            <PageDetailingNew
                
                pageName={"planCreation"}
               
                data={{ campaignId: id, campaignName }}
                
            />
        </>
    )
}

export default PlancreationNew