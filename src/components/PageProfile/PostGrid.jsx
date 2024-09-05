import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid, IconButton, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { Link } from "react-router-dom";

export default function PostGrid({ rows, setRows, companyname, handlenextpage }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  function separateDateAndTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);

    // Extract date components
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');

    // Extract time components
    let hours = dateTime.getHours();
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    // const seconds = String(dateTime.getSeconds()).padStart(2, '0');

    // Convert hours to 12-hour format
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Adjusting 0 to 12 for midnight

    return {
      date: `${day}-${month}-${year}`,
      time: `${hours}:${minutes} ${meridiem}`
      // time: `${hours}:${minutes}:${seconds} ${meridiem}`
    };
  }

  const handleDelete = (index) => {
    // Implement your delete logic here, for example:
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
    // Update state or call a delete API, etc.
  };

  const handleshortCode = (ele) => {
    // //console.log(ele,"ele")
  }
  return (
    <div>

      {/* <Typography sx={{ ml: 5 }}>{companyname}</Typography> */}
      <Grid container spacing={4} sx={{ mt: 3, justifyContent: "center" }}>
        {rows.map((ele, index) => (
          <Grid item key={index}>
            <Paper
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                width: 200,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.1)", // Increase size on hover
                },
              }}
            >
              <Card >

                <CardActionArea>
                  <Link to={ele.postUrl} target="_blank" >

                    <CardMedia
                      component="img"
                      sx={{ objectFit: "fill", height: 200 }}
                      image={ele.postImage}

                      alt="Post Img"
                    />
                  </Link>
                  {hoveredCard === index && ( // Show additional fields only on hover
                    <CardContent >
                      <>
                        <Typography
                          variant="body2"
                          style={{ position: "absolute", top: 0, left: 0 }}
                        >
                          <IconButton sx={{ bgcolor: 'white' }} onClick={() => handleDelete(index)} aria-label="delete">
                            {index + 1}
                            <DeleteIcon />
                          </IconButton>
                        </Typography>
                        <Typography onClick={handleshortCode(ele)}
                          variant="body2"
                          style={{ position: "absolute", top: 0, right: 0, backgroundColor: 'white', color: 'balck' }}
                        >
                          {separateDateAndTime(ele.dateCol).date} {/* Display only date */}
                          <br />
                          {separateDateAndTime(ele.dateCol).time} {/* Display only time */}
                          <Typography variant="body2">Comments : {ele.allComments}</Typography>
                          <Typography variant="body2">Likes : {ele.allLike}</Typography>
                        </Typography>
                        <Typography variant="body2">{ele.title}</Typography>

                      </>

                    </CardContent>)}

                </CardActionArea>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
