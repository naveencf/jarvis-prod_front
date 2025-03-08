import { TextField, Button, Modal, Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import Select from "react-select";
// import FormContainer from "../../../FormContainer";
import CampaignExecutionSummary from "./CampaignExecutionSummary";
import ScreenRotationAltRoundedIcon from "@mui/icons-material/ScreenRotationAltRounded";
import { useGlobalContext } from "../../../../Context/Context";
import { useLocation } from "react-router-dom";
import formatString from "../CampaignMaster/WordCapital";
import FormContainer from "../../FormContainer";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CampaignExecutions = () => {
  const location = useLocation();
  const campaignIdFromPhase = location?.state?.campaignId ?? null;
  const [selectedRows, setSelectedRows] = useState([]);
  const { toastAlert } = useGlobalContext();
  const [shortcode, setShortcode] = useState([]);
  const [pageDetails, setPageDetails] = useState([]);
  const [assignData, setAssignData] = useState([]);
  const [allCampData, setAllCampData] = useState([]);
  console.log(allCampData, 'allCampData');

  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [shiftPages, setShiftPages] = useState("");
  const [allPhaseData, setAllPhaseData] = useState([]);
  const [allExecutedData, setAllExecutedData] = useState([]);
  const [allPhaseCommitCount, setAllPhaseCommitCount] = useState([]);
  const [overviewCommitData, setOverviewCommitData] = useState([]);
  const [phases, setphases] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [assId, setAssId] = useState("");
  const [phaseId, setPhaseId] = useState();
  const [allPages, setAllPages] = useState([]);
  const [newPage, setNewPage] = useState("");
  const [storyLink, setStoryLink] = useState("");
  const [storyViews, setStoryViews] = useState("");
  const [updateClicked, setUpdateClicked] = useState(false);
  const [updateParams, setUpdateParams] = useState(null);
  const [replaceData, setReplaceData] = useState();

  const openModal = (phase_id) => {
    setIsModalOpen(true);
    setPhaseId(phase_id);
  };

  const openModal2 = (phase_id) => {
    setIsModalOpen2(true);
    setPhaseId(phase_id);
  };

  const openModal3 = (row) => {
    setIsModalOpen3(true);
    setReplaceData(row);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  const closeModal3 = () => {
    setIsModalOpen3(false);
  };

  const getAllAssignments = async () => {
    const res = await axios.get(`${baseUrl}assignments`);
    setAssignData(res.data.data);
  };
  const getCampaign = async () => {
    const res = await axios.get(`${baseUrl}phase_created_campaign`);
    setAllCampData(res.data);
  };
  const getAllPhases = async () => {
    const res = await axios.get(
      `${baseUrl}get_all_phases_by_campid/${selectedCampaign}`
    );
    setAllPhaseData(res.data.data);
  };
  const allCommitInOverview = async () => {
    const res = await axios.get(
      `${baseUrl}get_camp_commitments/${selectedCampaign}`
    );
    setOverviewCommitData(res.data);
  };

  const handleAllCampaign = async () => {
    const res = await axios.get(
      `${baseUrl}get_all_exe_phases_by_campid/${selectedCampaign}`
    );
    setphases("all");
    setAllExecutedData(res?.data?.data);
  };

  useEffect(() => {
    getAllAssignments();
    getCampaign();
  }, []);

  useEffect(() => {
    getAllPhases();
    handleAllCampaign();
    allCommitInOverview();
  }, [selectedCampaign]);

  const handleUpdateDetailes = (params) => {
    setShortcode(
      params.post_link ? params.post_link : shortcode[params.row._id]
    );
    setAssId(params.ass_id);
    setUpdateParams(params);
    setUpdateClicked(true);
  };

  useEffect(() => {
    const fetchPageDetails = async (index) => {
      if (shortcode || (updateClicked && updateParams)) {
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
          if (response.data.success == true) {
            const res = await axios.put(`${baseUrl}opexecution`, {
              id: assId,
              post_link: shortcode,
              post_date: response.data.data?.postedOn,
              post_type: response.data.data?.postType,
              post_like: response.data.data?.like_count,
              post_comment: response.data.data?.comment_count,
              post_views: response.data.data?.play_count,
              post_captions: response.data.data?.post_caption,
              post_media: response.data.data?.postImage,
              story_link: storyLink,
              story_views: storyViews,
              last_link_hit_date: new Date(),
            });
            toastAlert("Add Details successful!");
            handleAllCampaign();
            setAssId("");
            setPageDetails((prevPageDetails) => {
              let updatedPageDetails;
              if (Array.isArray(prevPageDetails)) {
                updatedPageDetails = [...prevPageDetails];
              } else {
                updatedPageDetails = { ...prevPageDetails };
              }
              updatedPageDetails = response?.data?.data;
              return updatedPageDetails;
            });
          } else if (response.data.success == false) {
            setTimeout(fetchPageDetails, 1000);
          }
        } catch (error) {
          console.error("Error fetching page details:", error);
        }
        setUpdateClicked(false);
      } else {
        // console.log("No match found or invalid shortcode.");
      }
    };
    fetchPageDetails();
  }, [shortcode, updateClicked, updateParams]);

  //  filter hashtags and tags -->
  const extractTags = (caption) => {
    if (!caption)
      return { tags: [], hashtags: [], tagCount: 0, hashtagCount: 0 };

    const tagRegex = /@(\w+)/g;
    const tagMatches = caption.match(tagRegex);
    const tags = tagMatches
      ? tagMatches.map((match) => match.substring(1))
      : [];
    const tagCount = tags?.length;
    const hashtagRegex = /#(\w+)/g;
    const hashtagMatches = caption.match(hashtagRegex);
    const hashtags = hashtagMatches
      ? hashtagMatches.map((match) => match.substring(1))
      : [];
    const hashtagCount = hashtags?.length;

    return { tags, hashtags, tagCount, hashtagCount };
  };

  const Columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      editable: false,
      renderCell: (params) => {
        const rowIndex = allExecutedData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },

    phases === "all"
      ? ""
      : {
        field: "Shifting",
        headerName: "Shifting",
        width: 120,
        renderCell: (params) => {
          return (
            <Button
              variant="text"
              onClick={() => openModal(params.row.phase_id)}
            >
              <ScreenRotationAltRoundedIcon
                color="secondary"
                sx={{ fontSize: "1.5rem" }}
              />
            </Button>
          );
        },
      },
    {
      field: "last_link_hit_date",
      headerName: " Fetched D|T",
      width: 180,
    },

    {
      field: "page_name",
      headerName: "Page Name",
      width: 150,
      renderCell: (params) => {
        const link = params.row.page_link;
        const formattedPageName = formatString(params.row.page_name);

        return (
          <div style={{ color: "blue" }}>
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {formattedPageName}
              </a>
            )}
          </div>
        );
      },
    },
    {
      field: "follower_count",
      headerName: "Follower",
      width: 150,
    },
    {
      field: "postPerPage",
      headerName: "Post",
      width: 150,
    },
    {
      field: "post_link",
      headerName: "Link",
      width: 150,
    },
    {
      field: "storyPerPage",
      headerName: "Story",
      width: 150,
    },
    {
      field: "replacement",
      headerName: "Replacement",
      width: 150,
      renderCell: (params, i) => (
        <button
          className="btn btn-danger"
          onClick={() => openModal3(params.row)}
        >
          Replace page
        </button>
      ),
    },
    {
      field: "Story link",
      headerName: "Story Link",
      width: 150,
      renderCell: (params, i) => (
        <TextField
          fullWidth
          className="form-control"
          placeholder="Story Link"
          type="text"
          value={storyLink[params.row._id]}
          onChange={(e) => setStoryLink(e.target.value)}
        />
      ),
    },
    {
      field: " Story Views",
      headerName: "Story Views",
      width: 150,
      renderCell: (params, i) => (
        <TextField
          className="form-control"
          placeholder="Story Views"
          type="text"
          value={storyViews[params.row._id]}
          onChange={(e) => setStoryViews(e.target.value)}
        />
      ),
    },
    {
      field: "Post link",
      headerName: "Post Link",
      width: 250,
      renderCell: (params) => (
        <>
          <TextField
            fullWidth
            className="form-control"
            placeholder="Post Link"
            type="text"
            value={
              params.row.post_link
                ? params.row.post_link
                : shortcode[params.row._id]
            }
            onChange={(event) => {
              setShortcode(event.target.value);
              setAssId(params.row._id);
            }}
          />
        </>
      ),
    },
    {
      field: "Post Image",
      headerName: "Post Image",
      width: 150,
      renderCell: (params) => (
        <img
          src={params.row.post_media}
          alt="Post Image"
          style={{ width: "100%", height: "auto" }}
        />
      ),
    },

    {
      field: "post_date",
      headerName: "Post Date",
      width: 150,
    },
    {
      field: "post_type",
      headerName: "Post Type",
      width: 150,
    },

    {
      field: "post_like",
      headerName: "Like",
      width: 150,
    },
    {
      field: "post_comment",
      headerName: "Comments",
      width: 150,
    },
    {
      field: "post_views",
      headerName: "Views",
      width: 150,
    },
    {
      field: "post_captions",
      headerName: "Caption",
      width: 150,
    },
    {
      field: "Tags",
      headerName: "Tags",
      width: 150,
      valueGetter: (params) => {
        const { tags } = extractTags(params.row.post_captions);
        return tags.join(", ");
      },
    },
    {
      field: "Tag Count",
      headerName: "Tag Count",
      width: 150,
      valueGetter: (params) => {
        const { tags } = extractTags(params.row.post_captions);
        return tags.length;
      },
    },
    {
      field: "Hashtags",
      headerName: "Hashtags",
      width: 150,
      valueGetter: (params) => {
        const { hashtags } = extractTags(params.row.post_captions);
        return hashtags.join(", ");
      },
    },
    {
      field: "Hashtag Count",
      headerName: "Hashtag Count",
      width: 150,
      valueGetter: (params) => {
        const { hashtags } = extractTags(params.row.post_captions);
        return hashtags.length;
      },
    },
    {
      field: "Action",
      headerName: "Update",
      width: 150,
      renderCell: (params) => (
        <Button color="error" onClick={() => handleUpdateDetailes(params.row)}>
          Update
        </Button>
      ),
    },
  ];

  const handleClick = async (phaseName) => {
    setphases(phaseName);
    const res = await axios.get(
      `${baseUrl}get_all_phases_by_phaseName/${phaseName}`
    );
    setAllExecutedData(res.data.data);
    const response = await axios.get(
      `${baseUrl}get_phase_commitments/${phaseName}`
    );
    setAllPhaseCommitCount(response.data.data);
  };

  const handleShift = async () => {
    const res = await axios.post(`${baseUrl}assignment/get_shift_phases`, {
      _id: selectedCampaign,
      phaseId1: phaseId,
      phaseId2: shiftPages,
    });
  };

  const getPageData = async () => {
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    setAllPages(pageData.data.body);
  };

  useEffect(() => {
    getPageData();
  }, []);

  const handleAddPage = async () => {
    const res = await axios.post(`${baseUrl}assignment/add_new_page`, {
      _id: selectedCampaign,
      p_id: newPage,
      phase_id: shiftPages,
    });
  };

  const handleReplace = async () => {
    const res = await axios.post(`${baseUrl}replace_single_phase_pages`, {
      phase_id: replaceData?.phase_id,
      p_id: replaceData?.p_id,
      new_pId: newPage,
      _id: selectedCampaign,
    });
    closeModal3();
  };

  const handleSelectedPages = () => {
    // // console.log("new ");
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
  };

  const options = allCampData.map((option) => ({
    value: option._id,
    label: formatString(option.pre_campaign_id),
  }));

  useEffect(() => {
    if (campaignIdFromPhase) {
      setSelectedCampaign(campaignIdFromPhase);
    }
  }, [campaignIdFromPhase]);

  const handleSelectChange = (e) => {
    setSelectedCampaign(e.value);
  };

  return (
    <>
      <FormContainer link={true} mainTitle={"Execution Campaign"} />
      <div className="card">
        <div className="card-header sb">
          <div className="card-title">Execution</div>
          <div className="form-group w-25">
            <label className="form-label">All Campaign</label>
            <Select
              options={options}
              onChange={handleSelectChange}
              value={options.find(
                (option) => option.value === selectedCampaign
              )}
            />
          </div>
        </div>
        <div className="card-body">
          {phases === "all" ? (
            <div>
              {selectedCampaign == "" ? (
                ""
              ) : (
                <button
                  style={{ float: "right" }}
                  onClick={() => openModal2()}
                  className="btn btn-warning"
                >
                  Add Page
                </button>
              )}
              <CampaignExecutionSummary
                overviewCommitData={overviewCommitData}
              />
            </div>
          ) : (
            <>
              <div>Total Comment : {allPhaseCommitCount?.post_comments}</div>
              <div>Total Like : {allPhaseCommitCount?.post_likes}</div>
              <div>Total Views : {allPhaseCommitCount?.post_views}</div>
            </>
          )}
        </div>
        {selectedCampaign && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-outline-info rounded-pill mr-4"
              onClick={handleSelectedPages}
            >
              Selected Update Pages
            </button>
          </div>
        )}

        <div className="card-body">
          <div className="tab">
            <button
              className={`named-tab ${phases === "all" ? "active-tab" : ""} `}
              onClick={handleAllCampaign}
            >
              All Pages
            </button>
            {allPhaseData?.length >= 0 ? (
              allPhaseData.map((item, i) => (
                <button
                  key={i}
                  className={`named-tab ${phases === item?._id ? "active-tab" : ""
                    }`}
                  onClick={() => handleClick(item?.phaseName)}
                >
                  {formatString(item?.phaseName)}
                </button>
              ))
            ) : (
              <div>Phase not created</div>
            )}
          </div>

          <DataGrid
            rows={allExecutedData}
            columns={Columns}
            getRowId={(row) => row.p_id}
            pagination
            checkboxSelection
            onRowSelectionModelChange={(row) => handleSelectionChange(row)}
          />
        </div>
      </div>
      <>
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box sx={style}>
            <div className="form-group w-75">
              <label className="form-label">Shift Pages</label>
              <Select
                options={allPhaseData.map((option) => ({
                  value: option.phase_id,
                  label: option.phaseName,
                }))}
                onChange={(e) => {
                  setShiftPages(e.value);
                }}
              />
            </div>
            <Button onClick={handleShift}> Shift</Button>
          </Box>
        </Modal>

        <Modal open={isModalOpen2} onClose={closeModal2}>
          <Box sx={style}>
            <div className="form-group w-75">
              <label className="form-label">Select Page</label>
              <Select
                options={allPages.map((option) => ({
                  value: option.p_id,
                  label: option.page_name,
                }))}
                onChange={(e) => {
                  setNewPage(e.value);
                }}
              />
              <label className="form-label">Select Phase</label>
              <Select
                options={allPhaseData.map((option) => ({
                  value: option.phase_id,
                  label: option.phaseName,
                }))}
                onChange={(e) => {
                  setShiftPages(e.value);
                }}
              />
            </div>
            <Button onClick={handleAddPage}> Add Page</Button>
          </Box>
        </Modal>

        <Modal open={isModalOpen3} onClose={closeModal3}>
          <Box sx={style}>
            <div className="form-group w-75">
              <label className="form-label">Select Page To Replace with</label>
              <Select
                options={allPages.map((option) => ({
                  value: option.p_id,
                  label: option.page_name,
                }))}
                onChange={(e) => {
                  setNewPage(e.value);
                }}
              />
            </div>
            <Button onClick={handleReplace}> Replace</Button>
          </Box>
        </Modal>
      </>
    </>
  );
};

export default CampaignExecutions;




