import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { InstaContext } from "../InstaApiContext";
import { useEffect } from "react";

export default function PleaseWait() {
  const { users, userID } = useContext(InstaContext);
  // useEffect(() => {
  //   const userName = users.find((res) => {
  //     res.user_id == userID;
  //   });
  //   //console.log(userName, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  // }, [users]);
  return (
    <Card sx={{ maxWidth: 345, ml: "40%", mb: 2 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="/pleasewait.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Ruko BHAI Thoda
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please Wait ! While we are fetching data for you.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We appreciate your coporation. Thankyou so much for your Patience.
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
