import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Button,
    Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";

const NotFoundShortCodeDialog = ({ open, onClose, allPhases, unmatchedData, planWiseData }) => {

    const [postIndex, setPostIndex] = useState(0);
    const [userPhases, setUserPhases] = useState([]);
    useEffect(() => {
        if (unmatchedData.length > 0) {


            const userNamePhaseArray = planWiseData.filter((item) => item?.creator_name === unmatchedData[postIndex]?.owner_info?.username)
                .map((item) => item.phase)
            console.log(userNamePhaseArray, "userNamePhaseArray")
            setUserPhases(userNamePhaseArray);
        }
    }, [postIndex])

    const handleNextPostData = () => {
        const userNamePhaseArray = planWiseData.filter((item) => item?.creator_name === unmatchedData[postIndex]?.owner_info?.username)
            .map((item) => item.phase)
        console.log(userNamePhaseArray, "userNamePhaseArray", unmatchedData[postIndex], planWiseData)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Phase Details</DialogTitle>
            <DialogContent>
                <Typography variant="h6">All Phases</Typography>
                <List>
                    {allPhases.map((phase, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={phase} />
                        </ListItem>
                    ))}
                </List>

                <Typography variant="h6" style={{ marginTop: "20px" }}>
                    Phases with Matching Username
                </Typography>
                <List>
                    {userPhases.map((phase, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={phase} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                {/* <Button onClick={() => setPostIndex((postIndex + 1) % unmatchedData.length)} color="primary"> */}
                <Button onClick={handleNextPostData} color="primary">
                    Next
                </Button>
                {/* <Button onClick={onClose} color="primary">
                    Close
                </Button> */}
            </DialogActions>
        </Dialog>
    );
};

export default NotFoundShortCodeDialog;
