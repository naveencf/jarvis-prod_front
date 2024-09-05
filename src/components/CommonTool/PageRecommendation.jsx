import * as React from "react";
import { useState, useEffect, useContext } from "react";

import {
  List,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Dialog,
  Typography,
} from "@mui/material";
import { InstaContext } from "../InstaApiContext";

import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function PageRecommendation({ setShowrecommendedpage }) {
  const navigate = useNavigate();
  const { creatorName } = useParams();
  const { pagecatmap, pageinDatabase, creatorNames, pagecategory } =
    useContext(InstaContext);
  const [open, setOpen] = useState(true);
  const [recommend, setRecommend] = useState([]);
  const [showrecommend, setShowrecommend] = useState([]);
  const [currpagecategory, setCurrpagecategory] = useState(false);

  useEffect(() => {
    if (pagecatmap.has(creatorName)) {
      ////console.log(pagecatmap.get(creatorName), "pageID");
      const pageID = pagecatmap.get(creatorName);
      setCurrpagecategory(
        pagecategory.find((ele) => ele.category_id == pageID)
      );
      // const remainingarray = pageinDatabase.filter((ele) => {
      //   return ele.page_category_id == pageID;
      // });

      let recommendedarray = [];
      for (let i = 0; i < creatorNames.length; i++) {
        if (pagecatmap.get(creatorNames[i]._id) == pageID) {
          recommendedarray.push(creatorNames[i]._id);
        }
        if (recommendedarray.length >= 5) {
          break;
        }
      }
      setRecommend(recommendedarray);
      setShowrecommend(true);
      ////console.log(recommendedarray, "recommendedarray");
    }
  }, []);
  const handleRedirect = () => {
    navigate("/admin/instaapi/");
  };

  const handleClose = () => {
    setOpen(false);
    setShowrecommendedpage(false);
  };
  const handleNavigationofPage = (creatorname) => {
    ////console.log(creatorname, "creator selected");
    navigate(`/admin/instaapi/${creatorname}`);
    // handleClose();
  };
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
          Suggestions : You can select next page of same Category
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            // ref={descriptionElementRef}
            tabIndex={-1}
          >
            {showrecommend && (
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {recommend.map((ele) => {
                  return (
                    <>
                   
                      <Link to={`/admin/instaapi/${ele}`}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar
                              alt="Remy Sharp"
                              src="/static/images/avatar/1.jpg"
                            />
                          </ListItemAvatar>

                          <ListItemText
                            primary={ele}
                            secondary={
                              <>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  Category
                                </Typography>
                                {` — ${currpagecategory?.category_name}`}
                              </>
                            }
                            // onClick={() => handleNavigationofPage(ele)}
                          />
                        </ListItem>
                      </Link>
                      <Divider variant="inset" component="li" />
                    </>
                  );
                })}
              </List>
            )}
            {/* {recommend.map((ele) => {
              return (
                <Button onClick={() => handleNavigationofPage(ele)}>
                  {ele}
                </Button>
              );
            })} */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRedirect}>All-Pages</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
