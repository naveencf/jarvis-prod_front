import { Box, Modal, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ManagerModal = ({ open, onClose, managers }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Assigned Managers</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {managers?.length > 0 ? (
          managers.map((m) => (
            <Box key={m.user_id} mb={1}>
              <Typography> {m.user_name}</Typography>
            </Box>
          ))
        ) : (
          <Typography>No managers assigned.</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ManagerModal;
