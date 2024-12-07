import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const ProgressDisplay = ({ pageList, displayPercentage }) => (
  pageList ? (
    <div className="flexCenter icon">
      <CircularProgress variant="determinate" value={displayPercentage} sx={{ position: 'absolute' }} />
      <Typography variant="h6" component="div" sx={{ color: 'primary.main', fontSize: '12px', textAlign: 'center' }}>
        {`${displayPercentage}%`}
      </Typography>
    </div>
  ) : null
);

export default ProgressDisplay;
