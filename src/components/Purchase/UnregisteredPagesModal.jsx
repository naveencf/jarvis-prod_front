import { Modal, Box, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UnregisteredPagesModal = ({ open, handleClose, unregisteredPages }) => {
    const navigate = useNavigate();

    const handleNavigation = (username) => {
        navigate(`/admin/pms-page-master?username=${encodeURIComponent(username)}`);
    };
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                    Unregistered Pages
                </Typography>
                <List>
                    {unregisteredPages?.usernames?.map((username, index) => (
                        <ListItem key={index} onClick={() => handleNavigation(username)} style={{ cursor: "pointer", backgroundColor: "#f5f5f5" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e0e0e0"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"} 
                            >
                            <ListItemText primary={username} />
                        </ListItem>

                    ))}
                </List>

                <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default UnregisteredPagesModal;
