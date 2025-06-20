/* eslint-disable react/prop-types */

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const PageDialog = ({ open, onClose, notFoundPages }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Unfetched Pages</DialogTitle>
      <DialogTitle>Total Unfetched Pages : {notFoundPages?.length}</DialogTitle>

      <DialogContent>
        <Typography sx={{ mt: 2 }}>The following pages were not found:</Typography>
        <ul>
          {notFoundPages?.map((page, index) => (
            <li key={index} style={{ color: 'red' }}>
              {page}
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PageDialog;
