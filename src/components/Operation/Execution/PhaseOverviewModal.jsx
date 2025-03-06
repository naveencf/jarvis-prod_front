import React, { useState } from "react";
import { Modal, Box, Typography, Button, Tabs, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import formatString from "../../../utils/formatString";
import View from "../../AdminPanel/Sales/Account/View/View";

const PhaseOverviewModal = ({
  open,
  handleClose,
  activeTabData,
  handleTabChange,
  usernameCount,
  PlanData,
}) => {

  const uniquePlatforms = [
    ...new Set(PlanData?.map((item) => item?.platform_name)),
  ];
  const [selectedPlatform, setSelectedPlatform] = useState(
    uniquePlatforms[0] || ""
  );

  const filteredPlanData = PlanData?.filter(
    (item) => item?.platform_name === selectedPlatform
  );

  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [modalShortCodes, setModalShortCodes] = useState([]); // Store shortCodes

  const handlePlatformClick = (platform, count, shortCodes) => {
    setModalShortCodes(shortCodes || []); 
    setPlatformModalOpen(true);
  };

  const handlePlatformModalClose = () => {
    setPlatformModalOpen(false);
  };
  const usernameColumns = [
    {
      name: "S.No",
      key: "Sr.No",
      width: 40,
      renderRowCell: (row, index) => index + 1,
    },
    {
      name: "Page Name",
      key: "page_name",
      width: 100,
      renderRowCell: (row) => formatString(row?.username),
    },
    { name: "Count", key: "count", width: 100 },
    {
      name: "Short Codes",
      key: "shortCodes",
      width: 200,
      renderRowCell: (row) => (
        <Button
          variant="outlined"
          onClick={() =>
            handlePlatformClick(
              row.username,
              row.count,
              row.shortCodes?.split(", ")
            )
          }
        >
          View Link
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            height: 600,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Links Overview
          </Typography>

          <div className="card">
            <div className="card-header flexCenterBetween">
              <Tabs
                className="pgTab tabSM"
                value={activeTabData}
                onChange={handleTabChange}
                aria-label="tabs"
              >
                <Tab label="Pages Wise link" value={0} />
                <Tab label="Platform Wise" value={1} />
              </Tabs>
            </div>

            <div className="card-body p0 m0 table table-responsive ml-2">
              {activeTabData === 0 && (
                <div style={{ width: "600px", height: "400px" }}>
                  <View
                    version={1}
                    data={Object.entries(usernameCount).map(
                      ([username, data]) => ({
                        username,
                        count: data?.count,
                        shortCodes: data?.shortCodes?.join(", ") || "N/A",
                      })
                    )}
                    columns={usernameColumns}
                    title={`Records`}
                    tableName={"PlanX-execution"}
                    pagination={[50, 100, 200]}
                  />
                </div>
              )}
              {activeTabData === 1 && (
                <div>
                  <Tabs
                    value={selectedPlatform}
                    onChange={(event, newValue) =>
                      setSelectedPlatform(newValue)
                    }
                    aria-label="platform-tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {uniquePlatforms.map((platform) => (
                      <Tab key={platform} label={platform} value={platform} />
                    ))}
                  </Tabs>

                  <DataGrid
                    getRowId={(row) => row.id}
                    rows={filteredPlanData.map((item, index) => ({
                      id: index + 1,
                      shortCode: `https://www.instagram.com/p/${item?.shortCode}`,
                      postType: item.postType,
                      postImage: item.postImage,
                      like_count: item.like_count,
                      comment_count: item.comment_count,
                    }))}
                    columns={[
                      { field: "id", headerName: "S. No.", width: 80 },
                      {
                        field: "shortCode",
                        headerName: " Link",
                        width: 250,
                        renderCell: (params) => (
                          <a
                            href={params.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#1976d2",
                              textDecoration: "underline",
                            }}
                          >
                            {params?.value}
                          </a>
                        ),
                      },
                      { field: "like_count", headerName: "Likes", width: 100 },
                      {
                        field: "comment_count",
                        headerName: "Comments",
                        width: 120,
                      },
                    ]}
                    autoHeight
                    pageSizeOptions={[5]}
                  />
                </div>
              )}
             
            </div>
          </div>

          <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* New Modal for Platform Wise Count */}
      <Modal open={platformModalOpen} onClose={handlePlatformModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Short Codes</Typography>

          {modalShortCodes.length > 0 &&
            modalShortCodes.map((code, index) => (
              <Typography key={index} sx={{ mt: 1 }}>
                {code && code !== "N/A" ? (
                  <a
                    href={`https://www.instagram.com/p/${code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    {`https://www.instagram.com/p/${code}`}
                  </a>
                ) : (
                  <span>NA</span>
                )}
              </Typography>
            ))}

          <Button
            onClick={handlePlatformModalClose}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default PhaseOverviewModal;
