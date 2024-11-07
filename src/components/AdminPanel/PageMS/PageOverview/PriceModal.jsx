import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FormatName } from '../../../../utils/FormatName';


const PriceModal = ({ setShowPriceModal, selectedRow, showPriceModal }) => {
  const handleClose = () => {
    setShowPriceModal(false);
  };

  return (
    <div>
      <Dialog
        open={showPriceModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Price Details</DialogTitle>
        <DialogContent>
          <table class="table">
            <thead>
              <tr>
                <th >S.No</th>
                <th >Type </th>
                <th >Price</th>
              </tr>
            </thead>

            {selectedRow && selectedRow.length > 0 &&
              selectedRow.map((item, index) => {
                const [key, value] = Object.entries(item)[0];
                return (
                  <tbody key={index}>
                    <tr >
                      <th >{index + 1}</th>
                      <td>{FormatName(key.replace('instagram_', ' '))}</td>
                      <td>{value}</td>
                    </tr>
                  </tbody>

                );
              })
            }
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PriceModal;
