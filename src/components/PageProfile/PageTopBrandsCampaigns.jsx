import React from "react";
import { useContext } from "react";
import { AnalyticsContext } from "../AnalyticsContextAPIs";
import { useState } from "react";
import Leaderboard from "../Dashboard/Leaderboard";
import TopPages from "../Dashboard/TopPages";
import TopBrands from "../Dashboard/TopBrands";
import { useEffect } from "react";
import TopCampaigninPages from "../Dashboard/TopCampaigninPages";

function PageTopBrandsCampaigns({ analyticsData,rows, setRows ,campaignrows, setCampaignRows,setRequestedData}) {
  const { dataForDecisionall, brands, allcampaign } = useContext(AnalyticsContext);
  // const [rows, setRows] = useState([]);
  // const [campaignrows, setCampaignRows] = useState([]);
  const [allrows, setAllRows] = useState([]);
  const [value, setValue] = useState(0);
  const [toppagesrow, setToppagesrow] = useState([]);

  useEffect(() => {
    if (brands && analyticsData?.brandIDs) {
      const topbrandsforpage = mergeArrays(analyticsData?.brandIDs, brands);

      // Ensure postcount is numeric
      const sortedData = [...topbrandsforpage].sort((a, b) => {
        // Handle cases where postcount might be null or undefined
        if (a.postcount == null && b.postcount == null) return 0;
        if (a.postcount == null) return 1;
        if (b.postcount == null) return -1;

        return b.postcount - a.postcount; // Sort in descending order
      });
      // console.log(sortedData,"brand data");
      setRows(sortedData);
      setAllRows(brands);
    }
  }, [brands, analyticsData]);

  
  useEffect(() => {
    if (allcampaign && analyticsData?.campaignIDs) {
      const topcampaignforpage = mergeArraysforCampaigns(analyticsData?.campaignIDs, allcampaign);
      
      // Ensure postcount is numeric
      const sortedData = [...topcampaignforpage].sort((a, b) => {
        // Handle cases where postcount might be null or undefined
        if (a.postcount == null && b.postcount == null) return 0;
        if (a.postcount == null) return 1;
        if (b.postcount == null) return -1;
        return b.postcount - a.postcount; // Sort in descending order
      });
      // console.log(sortedData,"campaign data");
      setCampaignRows(sortedData);
     }
  }, [allcampaign, analyticsData]);

  const mergeArraysforCampaigns = (analyticsArray, allcampaign) => {
    // console.log(analyticsArray,"analyticsArray",allcampaign);
    const analyticscampaignIds = new Set(
      analyticsArray.map((info) => info?.campaign_id)
    );

    return allcampaign
      .filter((campaignObj) => analyticscampaignIds.has(campaignObj?.campaign_id))
      .map((campaignObj) => {
        const matchingAnalyticsInfo = analyticsArray.find(
          (analyticsInfo) => analyticsInfo?.campaign_id === campaignObj?.campaign_id
        );

        return {
          ...campaignObj,
          postcount: matchingAnalyticsInfo.count,
          // Add other properties as needed
        };
      });
  };
  const mergeArrays = (analyticsArray, brandsArray) => {
    // First, create a Set of brand_ids present in the analyticsArray for faster lookup
    const analyticsBrandIds = new Set(
      analyticsArray.map((info) => info.brand_id)
    );

    // Filter brandsArray to only include brands with a matching brand_id in analyticsArray
    return brandsArray
      .filter((brandObj) => analyticsBrandIds.has(brandObj.instaBrandId))
      .map((brandObj) => {
        const matchingAnalyticsInfo = analyticsArray.find(
          (analyticsInfo) => analyticsInfo.brand_id === brandObj.instaBrandId
        );

        return {
          ...brandObj,
          postcount: matchingAnalyticsInfo.count,
          // Add other properties as needed
        };
      });
  };

  return (
    <div  style={{cursor:'pointer'}} className="row">
      <Leaderboard />
      <TopBrands rows={rows} setRows={setRows} setAllRows={setAllRows} setRequestedData={setRequestedData}/>
      <TopCampaigninPages
        rows={campaignrows}
        setRows={setCampaignRows}
        setAllRows={setAllRows} setRequestedData={setRequestedData}
      />
    </div>
  );
}

export default PageTopBrandsCampaigns;
