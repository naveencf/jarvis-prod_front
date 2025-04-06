import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useGetPageLogsByIdQuery } from "../../Store/PageBaseURL";

export default function PageLogsModel({ open, onClose, rowData }) {
  const { data, isLoading } = useGetPageLogsByIdQuery(rowData._id);

  const getChangedFields = (before, after) => {
    const changes = [];

    Object.keys(after || {}).forEach((key) => {
      const beforeVal = before?.[key];
      const afterVal = after?.[key];

      const beforeStr = JSON.stringify(beforeVal ?? "", null, 2);
      const afterStr = JSON.stringify(afterVal ?? "", null, 2);

      if (beforeStr !== afterStr) {
        changes.push({ key, before: beforeVal, after: afterVal });
      }
    });

    return changes;
  };

  // Helper to render values nicely
  const renderValue = (val) => {
    if (Array.isArray(val)) {
      if (val.every((item) => typeof item === "object" && item !== null)) {
        // Array of objects
        return (
          <List dense sx={{ ml: 2, mt: 0.5 }}>
            {val.map((obj, idx) => (
              <Paper key={idx} sx={{ p: 1, mb: 1, backgroundColor: "#f5f5f5" }}>
                {Object.entries(obj).map(([k, v]) => (
                  <Typography
                    variant="caption"
                    key={k}
                    sx={{ display: "block" }}
                  >
                    • <strong>{k}</strong>: {String(v)}
                  </Typography>
                ))}
              </Paper>
            ))}
          </List>
        );
      } else {
        // Array of primitives
        return val.join(", ");
      }
    } else if (typeof val === "object" && val !== null) {
      return (
        <List dense sx={{ ml: 2 }}>
          {Object.entries(val).map(([k, v]) => (
            <Typography variant="caption" key={k} sx={{ display: "block" }}>
              • <strong>{k}</strong>: {String(v)}
            </Typography>
          ))}
        </List>
      );
    } else {
      return String(val);
    }
  };

  const renderLogs = () => {
    if (!data || data.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="textSecondary">
            No log data available.
          </Typography>
        </Box>
      );
    }

    return data.map((log, index) => {
      const { before_update_page_data, after_update_page_data, updated_at } =
        log;
      const changes = getChangedFields(
        before_update_page_data,
        after_update_page_data
      );

      return (
        <Paper
          key={log._id}
          variant="outlined"
          sx={{ mb: 3, p: 2, borderRadius: 3 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Update #{index + 1}
            </Typography>
            <Chip
              icon={<AccessTimeIcon fontSize="small" />}
              label={new Date(updated_at).toLocaleString()}
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
                        <>
                          <Typography
                            variant="body2"
                            color="error"
                            sx={{ whiteSpace: "pre-line" }}
                          >
                            <strong>Before:</strong> {renderValue(before)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="success.main"
                            sx={{ whiteSpace: "pre-line" }}
                          >
                            <strong>After:</strong> {renderValue(after)}
                          </Typography>
                        </>
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
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Page Change Logs</DialogTitle>
      <DialogContent dividers>
        {isLoading ? <Typography>Loading...</Typography> : renderLogs()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
