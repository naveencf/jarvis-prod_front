import React, { useState } from "react";
import FormContainer from "../../FormContainer";
import View from "../../Sales/Account/View/View";
import PageLogsModel from "../PageLogsModel";
import { useGetRecentlyLogsQuery } from "../../../Store/PageBaseURL";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

const PageLogs = () => {
  const { data: recentLogsData, isLoading } = useGetRecentlyLogsQuery();
  const [openPageLogsModel, setOpenPageLogsModel] = useState(false);
  const [PageLogsId, setPageLogsId] = useState("");
  const handlePageLogs = (row) => {
    setOpenPageLogsModel(true);
    setPageLogsId(row);
  };
  const handleClosePageLogsModel = () => {
    setOpenPageLogsModel(false);
  };

  const mappedLogsData = recentLogsData?.data?.map((log) => ({
    ...log.after_update_page_data,
    _fullLog: log,
  }));
  const [openRecentLogsModel, setOpenRecentLogsModel] = useState(false);
  const [recentPageLogData, setRecentPageLogData] = useState([]);
  console.log(recentPageLogData, "------------------recentPageLogData");

  const handleCloseRecentLogsModel = () => {
    setOpenRecentLogsModel(false);
  };

  const handleRecentLogs = (row) => {
    setOpenRecentLogsModel(true);
    setRecentPageLogData(row._fullLog);
  };

  const columns = [
    {
      key: "Serial_no",
      name: "S.NO",
      renderRowCell: (row, index) => index + 1,
      width: 20,
      showCol: true,
      compare: true,
    },
    {
      key: "page_name",
      name: "Page Name",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "platform_name",
      name: "Platform Name",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "page_category_name",
      name: "Category ",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "after_created_by_name",
      name: "Updated By",
      showCol: true,
      width: 100,
      getTotal: true,
    },
    {
      key: "update_date",
      name: "Updated Date",
      showCol: true,
      width: 100,
      getTotal: true,
      renderRowCell: (row) => row.update_date?.split(" ")[0],
    },
    {
      key: "History",
      name: "History",
      renderRowCell: (row) => (
        <div className="d-flex justify-content-center">
          <button
            onClick={() => handlePageLogs(row)}
            className="btn cmnbtn btn-primary btn_sm mr-2"
          >
            History
          </button>
          <button
            onClick={() => handleRecentLogs(row)}
            className="btn cmnbtn btn-danger btn_sm mr-2 "
          >
            Recent Log
          </button>
        </div>
      ),
      showCol: true,
      width: 100,
    },
  ];

  return (
    <>
      <div className="action_title d-flex justify-content-between">
        <FormContainer mainTitle={"Page Logs"} link={true} />
      </div>

      <View
        columns={columns}
        data={mappedLogsData}
        isLoading={isLoading}
        title={"Overview"}
        tableName={"Logs-Overview"}
        pagination={true}
      />

      <PageLogsModel
        open={openPageLogsModel}
        onClose={handleClosePageLogsModel}
        rowData={PageLogsId}
      />

      <Dialog
        open={openRecentLogsModel}
        onClose={handleCloseRecentLogsModel}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Page Change Logs</DialogTitle>
        <DialogContent dividers>
          {recentPageLogData?.before_update_page_data &&
          recentPageLogData?.after_update_page_data ? (
            (() => {
              const changes = Object.keys(
                recentPageLogData.after_update_page_data
              ).reduce((acc, key) => {
                const before =
                  recentPageLogData.before_update_page_data[key] ?? "-";
                const after =
                  recentPageLogData.after_update_page_data[key] ?? "-";
                if (
                  key === "page_price_list" &&
                  JSON.stringify(before) !== JSON.stringify(after)
                ) {
                  acc.push({ key, before, after });
                } else if (before !== after) {
                  acc.push({ key, before, after });
                }
                return acc;
              }, []);

              return (
                <Paper variant="outlined" sx={{ mb: 2, p: 2, borderRadius: 3 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Page Update Log
                    </Typography>
                    <Chip
                      icon={<AccessTimeIcon fontSize="small" />}
                      label={new Date(
                        recentPageLogData?.updated_at
                      ).toLocaleString()}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>

                  {changes.length === 0 ? (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      No fields were changed.
                    </Typography>
                  ) : (
                    <List dense disablePadding>
                      {changes.map(({ key, before, after }, idx) => (
                        <React.Fragment key={`${key}-${idx}`}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                <CompareArrowsIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Chip
                                  label={`Field: ${key}`}
                                  variant="filled"
                                  color="primary"
                                  sx={{ mb: 1 }}
                                />
                              }
                              secondary={
                                key === "page_price_list" ? (
                                  <>
                                    <Typography
                                      variant="body2"
                                      color="error"
                                      sx={{ whiteSpace: "pre-line" }}
                                    >
                                      <strong>Before:</strong>{" "}
                                      {before
                                        .map(
                                          (item) =>
                                            `${Object.keys(item)[0]}: ${
                                              Object.values(item)[0]
                                            }`
                                        )
                                        .join(", ")}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="success.main"
                                      sx={{ whiteSpace: "pre-line" }}
                                    >
                                      <strong>After:</strong>{" "}
                                      {after
                                        .map(
                                          (item) =>
                                            `${Object.keys(item)[0]}: ${
                                              Object.values(item)[0]
                                            }`
                                        )
                                        .join(", ")}
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    <Typography
                                      variant="body2"
                                      color="error"
                                      sx={{ whiteSpace: "pre-line" }}
                                    >
                                      <strong>Before:</strong> {String(before)}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="success.main"
                                      sx={{ whiteSpace: "pre-line" }}
                                    >
                                      <strong>After:</strong> {String(after)}
                                    </Typography>
                                  </>
                                )
                              }
                            />
                          </ListItem>
                          {idx < changes.length - 1 && (
                            <Divider component="li" sx={{ ml: 7, my: 1 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </Paper>
              );
            })()
          ) : (
            <Typography>No changes available to show.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseRecentLogsModel}
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PageLogs;
