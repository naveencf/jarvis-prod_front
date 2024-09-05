import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VendorDetailAccordion from './VendorDetailAccordion';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { baseUrl } from "../../../../utils/config";
import { useGetVendorCompanyDetailQuery } from '../../../Store/PageBaseURL';
import { Link } from "react-router-dom";

export default function VendorDetails({vendorDetails,setVendorDetails}) {
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');
  const [bankRows, setBankRows] = useState([]);
  const token = sessionStorage.getItem("token");
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    // setScroll(scrollType);
  };

  const sendingId = {
    _id: vendorDetails._id
  }
  const queryParams = new URLSearchParams(sendingId).toString();

  const handleClose = () => {
    setOpen(false);
    setVendorDetails(null)
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
      <Dialog
        open={open}
        // fullWidth={'lg'}
        maxWidth={'lg'}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Vendor Details </DialogTitle>
        <DialogContent dividers={scroll === 'paper'} >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
          <VendorDetailAccordion vendorDetails={vendorDetails} bankRows={bankRows}/>
                         
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to={`/admin/pms-page-master?${queryParams}`}><Button>Add Page</Button></Link>
          <Link to={`/admin/pms-vendor-master/${vendorDetails._id}`}><Button onClick={handleClose}>Edit</Button></Link>
          <Button onClick={handleClose}>Cancel</Button>
          {/* <Button onClick={handleClose}>Subscribe</Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
