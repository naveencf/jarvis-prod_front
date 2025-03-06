import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({ instaData, updateExe,handleClose }) {
  console.log(instaData)
  return (<>
    <Card sx={{maxWidth: 345,maxHeight:400,overflow:'scroll' }}>
      <CardMedia
        sx={{ height:200,objectFit:'cover', backgroundSize:'contain' }}
        image={`https://storage.googleapis.com/insta_backend_bucket/p/${instaData?.shortCode}.jpeg`}
       
      />
      <CardContent>
        <Typography gutterBottom variant="h8" sx={{marginBottom:5}} component="div">
          {instaData.caption}
        </Typography>
        <Typography gutterBottom variant="h8" component="div">
          Likes = {instaData?.likes}
        </Typography>
        <Typography gutterBottom variant="h8" component="div">
          comments = {instaData?.comment_count}
        </Typography>

      </CardContent>
    </Card>
      <CardActions>
        <Button size="small" onClick={()=>updateExe()}>Verify</Button>
        <Button size="small" onClick={()=>handleClose()}> Reject</Button>
      </CardActions>
  </>
  );
}