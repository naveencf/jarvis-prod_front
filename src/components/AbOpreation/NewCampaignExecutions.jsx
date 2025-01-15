import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import Select from "react-select";
import { baseUrl } from "../../utils/config";
import axios from "axios";
import formatString from "../../utils/formatString";
import View from "../AdminPanel/Sales/Account/View/View";
import OpreationLinkUpdateDirect from "./OpreationLinkUpdateDirect";
import { useGetAllPlanXDataQuery } from "../Store/API/Opreation/OpreationApi";
import OpreationColumns from "./OpreationColumns";
const storedToken = sessionStorage.getItem("token");

const NewCampaignExecutions = () => {
  const { data: PlanX } = useGetAllPlanXDataQuery();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [palnWisePage, setPalnWisePage] = useState([]);
  const [shortcode, setShortcode] = useState("");
  const [pageId, setPageId] = useState("");
 
  const getPlanWisePages = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}operation/operation_execution_master/${selectedCampaign}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setPalnWisePage(res?.data?.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    getPlanWisePages();
  }, [selectedCampaign]);

  const handleSelectChange = (selectedOption) => {
    setSelectedCampaign(selectedOption?.value);
  };

  const handleUpdateRow = async (row) => {
    if (!storedToken) {
      console.error("Token not found in sessionStorage");
      return;
    }
  
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      };
  
      const updatePayload = {
        all_comments: row?.all_comments,
        all_like: row?.all_like, 
        all_view: row?.all_view,
        share: row?.share,
        impression: row?.impression,
        reach: row?.reach,
      };
      const res = await axios.put(
        `${baseUrl}operation/operation_execution_master/${row?._id}`,
        updatePayload,
        config
      );
      console.log("Update successful:", res.data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  
  const handleChangeComment = (rowId, value) => {
    setPalnWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, all_comments: Number(value) } : row
      )
    );
  };
  const handleChangeViews = (rowId, value) => {
    setPalnWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, all_view: Number(value) } : row
      )
    );
  };
  const handleChangeLike = (rowId, value) => {
    setPalnWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, all_like: Number(value) } : row
      )
    );
  };
  const handleChangeShare = (rowId, value) => {
    setPalnWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, share: Number(value) } : row
      )
    );
  };
  const handleChangeImpression = (rowId, value) => {
    setPalnWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, impression: Number(value) } : row
      )
    );
  };
  const handleChangeReach = (rowId, value) => {
    setPalnWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, reach: Number(value) } : row
      )
    );
  };

     //  filter hashtags and tags -->
    const extractTags = (title) => {
      if (!title) return { tags: [], hashtags: [], tagCount: 0, hashtagCount: 0 };
      const tagRegex = /@(\w+)/g;
      const tagMatches = title.match(tagRegex);
      const tags = tagMatches
        ? tagMatches.map((match) => match.substring(1))
        : [];
      const tagCount = tags.length;
      const hashtagRegex = /#(\w+)/g;
      const hashtagMatches = title.match(hashtagRegex);
      const hashtags = hashtagMatches
        ? hashtagMatches.map((match) => match.substring(1))
        : [];
      const hashtagCount = hashtags.length;
  
      return { tags, hashtags, tagCount, hashtagCount };
    };
    //  Opreation columns 
  const columns = OpreationColumns({
    handleChangeLike,
    handleChangeComment,
    handleChangeViews,
    handleChangeShare,
    handleChangeImpression,
    handleChangeReach,
    handleUpdateRow,
    extractTags,
    shortcode,
    setShortcode,
    setPageId,
  });

  useEffect(() => {
    const fetchPageDetails = async (index) => {
      if (shortcode) {
        const regex = /\/(reel|p)\/([A-Za-z0-9-_]+)/;
        const match = shortcode?.match(regex);
        try {
          const payload = {
            shortCode: match[2],
            department: "660ea4d1bbf521bf783ffe18",
            userId: 15,
          };
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          
          const response = await axios.post(
            `https://insights.ist:8080/api/v1/getpostDetailFromInsta`,
            payload,
            config
          );
          if (response.data.success === true) {
            console.log(response.data?.data?.owner_info?.username);
            
            try {
              const config = {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };

              const updatePayload = {
                post_url: shortcode,
                all_comments: response?.data?.data?.comment_count,
                all_like: response?.data?.data?.like_count,
                all_view: response?.data?.data?.play_count,
                creator_follower_count:
                  response?.data?.data?.owner_info?.followers,
                // creator_name : '',
                post_image: response.data.data?.postImage,
                title: response.data.data?.post_caption,
                post_type: response.data.data?.postType,
                posted_on: response.data.data?.postedOn,
              };

              const res = await axios.put(
                `${baseUrl}operation/operation_execution_master/${pageId}`,
                updatePayload,
                config
              );
            } catch (error) {
              console.error("Error updating data:", error);
            }
          }
        } catch (error) {
          console.error("Error fetching page details:", error);
        }
      } else {
        console.log("No match found or invalid shortcode.");
      }
    };
    fetchPageDetails();
  }, [shortcode]);

  return (
    <>
      <FormContainer link={true} mainTitle={"Execution Campaign"} />
      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Execution</div>
          <div className="form-group w-25">
            <label className="form-label">All Plan</label>
            <Select
              options={PlanX?.map((option) => ({
                value: option._id,
                label: `${formatString(option.plan_name)}`,
              }))}
              onChange={handleSelectChange}
              placeholder="Select plan"
            />
          </div>
        </div>
        <div className="card-body">
          <OpreationLinkUpdateDirect
            setShortcode={setShortcode}
            palnWisePage={palnWisePage}
            setPalnWisePage={setPalnWisePage}
          />
          <View
            columns={columns}
            data={palnWisePage}
            isLoading={false}
            Pagination={[100, 200, 1000]}
            tableName={"Op_executions"}
          />
        </div>
      </div>
    </>
  );
};

export default NewCampaignExecutions;
