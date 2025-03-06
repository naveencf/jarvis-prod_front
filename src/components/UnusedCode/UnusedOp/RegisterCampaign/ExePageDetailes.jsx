import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { baseUrl } from "../../../utils/config";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ReplacePagesModal from "./ReplacePagesModal";
import ReplacePagesModalExe from "./ReplacePagesModalExe";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  borderRadius: "10px",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

const ExePageDetailes = ({ data, activeAccordion, getAssignment,selectedCampaign }) => {
  console.log(selectedCampaign,"page saim");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [singlePhase, setSinglePhase] = useState([]);
  const [assignedData, setAssignedData] = useState({});
  const [assignmentCommits, setAssignmentCommits] = useState([]);
  const [commitPayload, setCommitPayload] = useState([]);
  const [posts, setPosts] = useState([]);
  const [story, setStory] = useState([]);
  const [ass_id, setAss_id] = useState(null);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);
  const [pageDetails, setPageDetails] = useState([]);
  const [shortcode, setShortcode] = useState([]);
  const [selectedPostDetails, setSelectedPostDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelections] = useState();

  console.log(selection);
  const handleShortcodeChange = (event, index) => {
    const newShortcodes = [...shortcode];
    newShortcodes[index] = event.target.value;
    setShortcode(newShortcodes);
  };

  const handleButtonClick = async (row) => {
    const postCount = row.postPerPage;
    setPosts(Array.from({ length: postCount }));
    const storyCount = row.storyPerPage;
    setStory(Array.from({ length: storyCount }));
    setAssignedData({
      ass_id: row.ass_id,
      campaignId: row.campaignId,
      phase_id: row.phase_id,
      execute: false,
    });
    setAss_id(row.ass_id);
    setOpen(true);
  };

  const finalExecute = async () => {
    const response = await axios.post(baseUrl + "assignment/commit", {
      ass_id: ass_id,
      execute: true,
    });
    alert("executed successfully");
    getAssignment();
    setOpen(false);
  };

  const handleUpdate = async (params) => {
    const response = await axios.get(
      `${baseUrl}` + `campaignphase/singlephase/${params.row.phase_id}`
    );
    setSinglePhase(response?.data?.data?.commitment);

    const assCommit = await axios.get(
      `${baseUrl}` + `assignment/commit/single/${params.row.ass_id}`
    );
    setAssignmentCommits(assCommit.data.data);
    setCommitPayload(assCommit.data.data);
    setOpen2(true);
  };

  const handleCommitChange = (e, field, param) => {
    const data = commitPayload.map((commit) => {
      if (commit.comm_id == param.row.comm_id) {
        return { ...commit, [field]: e.target.value };
      } else return commit;
    });

    setCommitPayload(data);
  };

  const handleExecute = async (params) => {
    const response = await axios.post(baseUrl + "assignment/status", {
      ass_id: params.row.ass_id,
      campaignId: params.row.campaignId,
      ass_status: "executed",
    });

    getAssignment();
  };

  const updateSingleCommitment = async (params) => {
    const payload = commitPayload.find(
      (commit) => commit.comm_id == params.comm_id
    );
    const response = await axios.put(
      `${baseUrl}` + `assignment/commit/single/${params.comm_id}`,
      payload
    );
    alert("updated successfully");
    getAssignment();
  };

  const column = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = data?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "page Name",
      width: 150,
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
      field: "storyPerPage",
      headerName: "Story",
      width: 150,
    },
    {
      field: "replace",
      headerName: "Replace Pages",
      width: 150,
      editable: true,
      renderCell: (params) => {
        return (
          <Button>
            <PublishedWithChangesIcon
              onClick={() => handleOpenModal(params.row)}
            />
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => {
        if (activeAccordion == 1) {
          return (
            <Button onClick={() => handleButtonClick(params.row)}>
              Start Execution
            </Button>
          );
        }
        if (activeAccordion == "2") {
          return (
            <div style={{ marginLeft: "5px" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleUpdate(params)}
              >
                update
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleExecute(params)}
              >
                Excute
              </Button>
            </div>
          );
        } else {
          return (
            <Button onClick={() => handleUpdate(params)}>commitment</Button>
          );
        }
      },
    },
  ];

  const columnForAssCommit = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = data?.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "link",
      headerName: "link",
      width: 150,
    },

    {
      field: "likes",
      name: "likes",
      headerName: "likes",
      width: 150,

      renderCell: (params) => {
        const x = singlePhase.some((element) => {
          return element.commitment == "Likes";
        });

        if (x) {
          return (
            <TextField
              type="number"
              // value={params.row.comments || commitPayload.comments}
              //  value={activeAccordion!="2" ? params.row.likes:""}
              placeholder={params.row.likes}
              onChange={(e) => handleCommitChange(e, "likes", params)}
            />
          );
        }

        return <p>N/A</p>;
      },
    },
    {
      field: "comments",
      headerName: "comments",
      width: 150,
      renderCell: (params) => {
        const x = singlePhase.some((element) => {
          return element.commitment == "comments";
        });
        if (x == true) {
          return (
            <TextField
              type="number"
              // value={params.row.comments || commitPayload.comments}
              //  value={activeAccordion!="2" && params.row.comments}
              placeholder={params.row.comments}
              onChange={(e) => handleCommitChange(e, "comments", params)}
            />
          );
        }

        return <p>N/A</p>;
      },
    },
    {
      field: "engagement",
      headerName: "engagement",
      width: 150,

      renderCell: (params) => {
        const x = singlePhase.some((element) => {
          return element.commitment == "engagement";
        });
        if (x == true) {
          return (
            <TextField
              type="number"
              // value={params.row.comments || commitPayload.comments}
              //  value={activeAccordion!="2" && params.row.engagement}
              placeholder={params.row.engagement}
              onChange={(e) => handleCommitChange(e, "engagement", params)}
            />
          );
        }

        return <p>N/A</p>;
      },
    },
    {
      field: "reach",
      headerName: "reach",
      width: 150,
      renderCell: (params) => {
        const x = singlePhase.some((element) => {
          return element.commitment == "reach";
        });
        if (x == true) {
          return (
            <TextField
              type="number"
              // value={params.row.comments || commitPayload.comments}
              //  value={activeAccordion!="2" && params.row.reach}
              placeholder={params.row.reach}
              onChange={(e) => handleCommitChange(e, "reach", params)}
            />
          );
        }

        return <p>N/A</p>;
      },
    },
    {
      field: "snapshot",
      headerName: "snapshot",
      width: 150,
      renderCell: (params) => {
        return (
          <TextField
            type="text"
            placeholder={params.row.snapshot}
            onChange={(e) => handleCommitChange(e, "snapshot", params)}
          />
        );
      },
    },
    activeAccordion == "2" && {
      field: "action",
      headerName: "action",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "8px" }}
            onClick={() => updateSingleCommitment(params.row)}
          >
            update
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchPageDetails = async (index) => {
      if (shortcode[index]) {
        const regex = /\/(reel|p)\/([A-Za-z0-9-_]+)/;
        const match = shortcode[index].match(regex);
        if (match && match.length > 2) {
          try {
            setPageDetails((prevPageDetails) => {
              const updatedPageDetails = [...prevPageDetails];
              updatedPageDetails[index] = "Getting details...";
              return updatedPageDetails;
            });

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
              `http://35.200.154.203:8080/api/v1/getpostDetailFromInsta`,
              payload,
              config
            );

            setPageDetails((prevPageDetails) => {
              const updatedPageDetails = [...prevPageDetails];
              updatedPageDetails[index] = response?.data?.data;
              return updatedPageDetails;
            });
          } catch (error) {
            console.error("Error fetching page details:", error);
          }
        } else {
          console.log("No match found or invalid shortcode.");
        }
      }
    };
    shortcode.forEach((_, index) => {
      fetchPageDetails(index);
    });
  }, [shortcode]);

  const handlePostCaptionClick = (index) => {
    setSelectedPostDetails(pageDetails[index]);
    setOpen2(true);
  };

  const handleOpenModal = (row) => {
    setSelections(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [selectData, setSelectData] = useState([]);

  const getSelectPage = async () => {
    const newPlan = await axios.get(
      `${baseUrl}`+`campaignplan/${selection?.campaignId}`
    );
    const x = newPlan.data.data.filter((page) => {
      if (
       ( page.replacement_status == "pending" ||
        page.replacement_status == "replacement" ||
        page.replacement_status == "inactive") && (page.delete_status=='inactive')
      ) {
      }
      return page;
    });
    setSelectData(x);
  };

  useEffect(() => {
    getSelectPage();
  }, []);

  return (
    <>
      <DataGrid
        rows={data}
        columns={column}
        getRowId={(row) => row.p_id}
        pagination
      />
      <>
        {/* frist modal-----------------> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h5" component="h2" sx={{ ml: 1 }}>
              Execution
            </Typography>
            <Box sx={{}}>
              <Box>
                {posts.map((index, i) => (
                  <div key={i}>
                    <TextField
                      sx={{ m: 1 }}
                      label="Page Link"
                      type="text"
                      value={shortcode[i]}
                      onChange={(event) => handleShortcodeChange(event, i)}
                    />

                    <TextField
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ width: "80px", m: 1 }}
                      label="Likes"
                      value={pageDetails[i]?.like_count}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ m: 1, width: "90px" }}
                      label="Comments"
                      value={pageDetails[i]?.comment_count}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ m: 1, width: "150px" }}
                      label="Post Count"
                      value={pageDetails[i]?.owner_info?.post_count}
                    />
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ m: 1, width: "150px" }}
                      label=" Caption"
                      value={pageDetails[i]?.post_caption}
                      onClick={() => handlePostCaptionClick(i)}
                    />
                    {pageDetails[i]?.postImage && (
                      <div
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                        }}
                      >
                        <img
                          src={pageDetails[i]?.postImage}
                          alt="Profile Pic"
                        />
                      </div>
                    )}
                    {/* <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ marginRight: "8px" }}
                      // onClick={handleAssignedSubmit}
                      onClick={() => shortcode[i] && getPageDetails(i)}
                      sx={{ mt: 2 }}
                      disabled={pageDetails[i] === "Getting details..."}
                    >
                      {pageDetails[i]?.is_paid_partnership
                        ? pageDetails[i]?.is_paid_partnership
                        : "Get Details"}
                    </Button> */}
                  </div>
                ))}
              </Box>
              {/* <Box>
                {story.map((index) => (
                  <div key={index}>
                    <TextField
                      key={index}
                      label=" Story / Page"
                      type="text"
                      onChange={(e) =>
                        setAssignedData({
                          ...assignedData,
                          link: e.target.value,
                          commitType:"story"
                        })
                      }
                      sx={{ m: 1 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                    onClick={handleAssignedSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                ))}
              </Box> */}
              <Button
                variant="contained"
                color="success"
                onClick={finalExecute}
              >
                execute
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
      <>
        {/* second modal ============> */}

        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {selectedPostDetails && (
              <div>
                <Typography>Post Caption</Typography>
                {selectedPostDetails.post_caption}
              </div>
            )}
          </Box>
        </Modal>
      </>
      <>
      <ReplacePagesModalExe
            open={isModalOpen}
            handleClose={handleCloseModal}
            selectedCampaign={selectedCampaign}
          />
      </>
    </>
  );
};

export default ExePageDetailes;
