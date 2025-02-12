import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import Select from "react-select";
import { baseUrl } from "../../utils/config";
import axios from "axios";
import formatString from "../../utils/formatString";
import View from "../AdminPanel/Sales/Account/View/View";
import OpreationLinkUpdateDirect from "./OpreationLinkUpdateDirect";
import { useGetAllPlanXDataQuery } from "../Store/API/Operation/OperationApi";
import OpreationColumns from "./OpreationColumns";
import PhaseWisePages from "./PhaseWisePages";
import OperationShortcodeUpdater from "./OperationShortcodeUpdater";
const storedToken = sessionStorage.getItem("token");

const NewCampaignExecutions = () => {
  const { data: PlanX } = useGetAllPlanXDataQuery();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [planWisePage, setPlanWisePage] = useState([]);
  const [shortcode, setShortcode] = useState("");
  const [pageId, setPageId] = useState("");
  const [phaseWisePages, setPhaseWiseData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [showAllPages, setShowAllPages] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

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
      const data = res?.data?.data || [];
      const groupedPages = data.reduce((acc, item) => {
        if (item.posted_on?.trim()) {
          // const date = item.posted_on.split(" ")[0];
          const date = item?.phase?.split(" ")[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(item);
        }
        return acc;
      }, {});
      setPhaseWiseData(groupedPages);
      setPlanWisePage(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    getPlanWisePages();
  }, [selectedCampaign]);

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
        phase: "2025-01-15",
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
    setPlanWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, all_comments: Number(value) } : row
      )
    );
  };
  const handleChangeViews = (rowId, value) => {
    setPlanWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, all_view: Number(value) } : row
      )
    );
  };
  const handleChangeLike = (rowId, value) => {
    setPlanWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, all_like: Number(value) } : row
      )
    );
  };
  const handleChangeShare = (rowId, value) => {
    setPlanWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, share: Number(value) } : row
      )
    );
  };
  const handleChangeImpression = (rowId, value) => {
    setPlanWisePage((prevData) =>
      prevData.map((row) =>
        row._id === rowId ? { ...row, impression: Number(value) } : row
      )
    );
  };
  const handleChangeReach = (rowId, value) => {
    setPlanWisePage((prevData) =>
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
              getPlanWisePages();
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

  const handleShowAllPages = () => {
    setShowAllPages(true);
    setFilteredData([]);
    setSelectedDate(null);
  };

  const handleDateSelect = (pages, date) => {
    setFilteredData(pages);
    setShowAllPages(false);
    setSelectedDate(date);
  };

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
              onChange={(selectedOption) =>
                setSelectedCampaign(selectedOption?.value)
              }
              placeholder="Select plan"
            />
          </div>
        </div>
        <div className="card-body">
          {planWisePage.length > 0 && (
            <div>
              {/* <OpreationLinkUpdateDirect
                getPlanWisePages={getPlanWisePages}
                planWisePage={planWisePage}
                setShortcode={setShortcode}
              /> */}
              <OperationShortcodeUpdater
                fetchPlanWiseData={getPlanWisePages}
                planWiseData={planWisePage}
              />
              {/* <button
                className={`btn cmnbtn btn_sm ${showAllPages
                  ? "btn-primary"
                  : "btn-outline-primary"
                  } mr-1`}
                onClick={handleShowAllPages}
              >
                All Pages
              </button> */}
              <PhaseWisePages
                phaseWisePages={phaseWisePages}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                onShowAllPages={handleShowAllPages}
              />
            </div>
          )}
          <View
            columns={columns}
            data={
              showAllPages
                ? planWisePage
                : filteredData.length > 0
                ? filteredData
                : planWisePage
            }
            isLoading={false}
            tableName={"Op_executions"}
            pagination={[100, 200, 1000]}
          />
        </div>
      </div>
    </>
  );
};

export default NewCampaignExecutions;
