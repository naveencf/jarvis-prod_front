import React, { useState, useEffect, useContext } from "react";
import PaidPostsPageView from "./PaidPostsPageView";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Autocomplete, Box, Paper, Stack, TextField } from "@mui/material";

function PagePaidPosts({
  rows,
  setRows,
  campaignrows,
  setCampaignRows,
  key2,
  value2,
  setKey2,
  setValue2,
  setEngagementArray,
  requestedData,
  tabvalue,
  setValue,
  setRequestedData,endDate, setEndDate,startDate, setStartDate,setEngagementArrayDateWise
}) {
  const { creatorName } = useParams();
  const [postrows, setPostRows] = useState([]);
  const [postupdated, setPostupdated] = useState(false);
  const [postdataloaded, setPostdataLoaded] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [tempSelectedBrand, setTempSelectedBrand] = useState(null);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [allFilterCampaign, setAllFilterCampaign] = useState([]);

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k`;
    } else {
      return Math.round(value).toString();
    }
  };

  // useEffect(() => {
  //   if (requestedData.instaBrandId) {
  //     console.log(requestedData);
  //     setKey2("brand_id");
  //     setValue2(requestedData.instaBrandId);
  //     setValue(0);
  //   } else if (requestedData.campaign_id) {
  //     console.log(requestedData);
  //     setKey2("campaign_id");
  //     setValue2(requestedData.campaign_id);
  //     setValue(0);
  //   }
  //   setPostdataLoaded(false);
  // }, [requestedData]);

  useEffect(() => {
    let tempmatchCondition = { postedOn : { $gte: startDate,$lte:endDate }};
    if(endDate == null){
      tempmatchCondition = ""
    }
    // axios
    //   .post(
    //     `https://insights.ist:8080/api/get_dynamic_multiple__key_value?page=1&perPage=300`,
    //     {
    //       request_key_1: "creatorName",
    //       request_value_1: creatorName,
    //       request_key_2: "creatorName",
    //       request_value_2: creatorName,
    //       flag: 2, // flag 1 for count and 2 for all data
    //       model: 1,
    //       matchCondition: tempmatchCondition ,
    //     }
    //   )
    //   .then((res) => {
        
    //     setPostRows(res.data);
    //     setPostdataLoaded(true);
    //     const sumOfMetrics = calculateAverageOfMetricsByPostType(res.data);
    //     setEngagementArrayDateWise(sumOfMetrics);
    //   });
    axios
      .post(
        `https://insights.ist:8080/api/get_dynamic_multiple__key_value`,
        {
          request_key_1: "creatorName",
          request_value_1: creatorName,
          request_key_2: "creatorName",
          request_value_2: creatorName,
          flag: 1, // flag 1 for count and 2 for all data
          model: 1,
          matchCondition: tempmatchCondition ,
        }
      )
      .then((res) => {
      //  console.log(res.data)
       setEngagementArray(res.data);
      });
   
      
  }, [creatorName, key2, value2,endDate ]);

  // useEffect(() => {
  //   axios
  //     .post("https://insights.ist:8080/api/campaignsInPerticularPage", {
  //       creatorName: creatorName,
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         handleBrandsInPaidPosts(res.data.data[0]?.brandIDs);
  //         handleCampaignsInPaidPosts(res.data.data[0]?.campaignIDs);
  //       }
  //     });
  // }, [rows, campaignrows]);

  function calculateAverageOfMetricsByPostType(rows) {
    let avgLikes = { REEL: 0, IMAGE: 0, CAROUSEL: 0 };
    let avgViews = { REEL: 0, IMAGE: 0, CAROUSEL: 0 };
    let avgComments = { REEL: 0, IMAGE: 0, CAROUSEL: 0 };
    let countByType = { REEL: 0, IMAGE: 0, CAROUSEL: 0 };
    let postCount = 0;

    rows.forEach((row) => {
      const postType = row.postType;
      avgLikes[postType] += row.allLike || 0;
      avgViews[postType] += row.allView || 0;
      avgComments[postType] += row.allComments || 0;
      countByType[postType]++;
      postCount++;
    });

    Object.keys(avgLikes).forEach((type) => {
      avgLikes[type] = Math.round(avgLikes[type] / (countByType[type] || 1));
      avgViews[type] = Math.round(avgViews[type] / (countByType[type] || 1));
      avgComments[type] = Math.round(avgComments[type] / (countByType[type] || 1));
    });

    return {
      avgLikes,
      avgViews,
      avgComments,
      postCount,
      carouselCount :countByType.CAROUSEL || 0,
      reelCount :countByType.REEL || 0
    };
  }

  const handleBrandsInPaidPosts = (brandIDArray) => {
    const filtered = rows.filter((brand) =>
      brandIDArray.some((pageBrand) => pageBrand.brand_id === brand.instaBrandId)
    );
    setFilteredBrands(filtered);
  };

  const handleCampaignsInPaidPosts = (campaignIDArray) => {
    const filtered = campaignrows.filter((camp) =>
      campaignIDArray.some((pageCamp) => pageCamp.campaign_id === camp.campaign_id)
    );
    setFilteredCampaigns(filtered);
    setAllFilterCampaign(filtered);
  };

 

  return (
    <div className="">
      {/* {tabvalue === 0 && (
        <Paper>
          <Stack direction="row" spacing={1} sx={{ m: 1 }}>
            <Autocomplete
              sx={{ width: "20%" }}
              disablePortal
              value={tempSelectedBrand ? { label: tempSelectedBrand.instaBrandName, value: tempSelectedBrand.postcount } : null}
              id="combo-box-demo"
              options={filteredBrands.map((br) => ({
                label: br.instaBrandName,
                value: br.postcount,
              }))}
              onChange={handleBrandChange}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label} ({formatNumber(option.value)})
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Brands"
                  variant="standard"
                />
              )}
            />
            <Autocomplete
              disablePortal
              sx={{ width: "20%" }}
              value={selectedCampaign ? { label: selectedCampaign.campaign_name, value: selectedCampaign.postcount } : null}
              id="combo-box-demo"
              options={filteredCampaigns.map((br) => ({
                label: br.campaign_name,
                value: br.postcount,
              }))}
              onChange={handleCampaignChange}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label} ({formatNumber(option.value)})
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Campaign Name"
                  variant="standard"
                />
              )}
            />
          </Stack>
        </Paper>
      )} */}
      {/* <PaidPostsPageView
        postrows={postrows}
        postdataloaded={postdataloaded}
        selectedcampaign={selectedCampaign}
        postupdated={postupdated}
        setPostupdated={setPostupdated}
        filteredCampaigns={filteredCampaigns}
        filteredBrands={filteredBrands}
      /> */}
    </div>
  );
}

export default PagePaidPosts;
