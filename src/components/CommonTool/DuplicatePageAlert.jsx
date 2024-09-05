import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import { InstaContext } from "../InstaApiContext";
import { useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function DuplicatePageAlert({
  setDuplicatePageAlert,
  activeusername,
  userID,
}) {
  const navigate = useNavigate();
  const { creatorName } = useParams();
  const { users } = useContext(InstaContext);
  const [open, setOpen] = useState(true);
  const [username, setUserName] = useState("SomeOne");
  const [shown, setShown] = useState(false);

  const handleRedirect = () => {
    navigate("/admin/instaapi");
  };

  const handleClose = () => {
    axios.put("https://insights.ist:8080/api/page_uniqueness", {
      user_id: userID,
      creator_name: creatorName,
    });
    setOpen(false);
    setDuplicatePageAlert(false);
  };
  if (!shown) {
    const userdetail = activeusername.find((ele) => {
      return ele.creator_name == creatorName;
    });
    ////console.log(userdetail, activeusername);
    const onsamepage = users.find((ele) => {
      return ele.user_id == userdetail?.user_id;
    });
    setUserName(onsamepage?.user_name);
    setShown(true);
  }
  // ////console.log(userdetail);
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        // scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Alert : Someone else found on this Page
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            // ref={descriptionElementRef}
            tabIndex={-1}
          >
            {/* <img src="opps.png" alt="someone found" /> */}
            <List sx={{ pt: 0, m: 10 }}>
              <ListItem disableGutters>
                <ListItemButton>
                  {/* onClick={() => handleListItemClick(email)} */}
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "green", color: "blue" }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    {username} is working on same page
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Override</Button>
          <Button onClick={handleRedirect}>other-Pages</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
