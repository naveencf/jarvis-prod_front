import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { Stack } from "@mui/material";
import DiamondIcon from "@mui/icons-material/Diamond";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CategoryIcon from "@mui/icons-material/Category";

export default function ReadOnlyCaseStudyFields({ rowData }) {
  console.log(rowData, "row data ---->>>");

  // const accData = rowData?.[0];

  // if (!accData) {
  //   return null;
  // }
  return (
    <div>
      {/* {rowData &&
        rowData?.map((accData) => ( */}
      <Stack direction="row">
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DiamondIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={rowData[0]?.account_type_name || ""}
              secondary="Type"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={rowData[0]?.account_name || ""}
              secondary="Account Name"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={rowData[0]?.brand_name || ""}
              secondary="Brand Name"
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              // primary={accData.request_amount}
              secondary="Brand Profile Picture"
            />
          </ListItem>
        </List>
        {/* // 2nd list */}
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CategoryIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={rowData[0]?.category_name || ""}
              secondary=" Category"
            />
          </ListItem>

          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CloudDoneIcon />
              </Avatar>
            </ListItemAvatar>
            {/* <ListItemText primary={rowData.address} secondary="Service" /> */}
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DiamondIcon />
              </Avatar>
            </ListItemAvatar>
            {/* <ListItemText primary={rowData.gst} secondary="Type" /> */}
          </ListItem>
        </List>
      </Stack>
      {/* ))} */}
    </div>
  );
}
