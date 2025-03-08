import { Stack } from '@mui/material';
import FieldContainer from '../../FieldContainer';
import { Button, Modal } from 'react-bootstrap';

const VendorPreviewModal = ({ open, onClose, vendorData }) => {
  // console.log("vendordata", vendorData);
  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-content">
        <h2>Vendor Details Preview</h2>
        <div>
          <FieldContainer
            label="Vendor Name"
            value={vendorData.vendorName}
            required={true}
          />
          <FieldContainer
            label="Country Code"
            value={vendorData.countryCode}
            required={false}
          />
          <FieldContainer
            label="Mobile"
            value={vendorData.mobile}
            required={true}
          />
          <FieldContainer
            label="Alt Mobile"
            value={vendorData.altMobile}
            required={false}
          />
          <FieldContainer
            label="Email"
            value={vendorData.email}
            required={true}
          />
          <FieldContainer label="GST" value={vendorData.gst} required={false} />
          <FieldContainer
            label="Company Name"
            value={vendorData.compName}
            required={false}
          />
          <FieldContainer
            label="Company Address"
            value={vendorData.compAddress}
            required={false}
          />
          <FieldContainer
            label="Company City"
            value={vendorData.compCity}
            required={false}
          />
          <FieldContainer
            label="Company Pin"
            value={vendorData.compPin}
            required={false}
          />
          <FieldContainer
            label="Company State"
            value={vendorData.compState}
            required={false}
          />
          <FieldContainer
            label="Threshold Limit"
            value={vendorData.limit}
            required={false}
          />
          <FieldContainer
            label="Home Address"
            value={vendorData.homeAddress}
            required={false}
          />
          <FieldContainer
            label="Home City"
            value={vendorData.homeCity}
            required={false}
          />
          <FieldContainer
            label="Home Pincode"
            value={vendorData.homePincode}
            required={false}
          />
          <FieldContainer
            label="Other Country"
            value={vendorData.otherCountry}
            required={false}
          />
          <FieldContainer
            label="Home State"
            value={vendorData.homeState}
            required={false}
          />
          <FieldContainer
            label="Vendor Category"
            value={vendorData.vendorCategory}
            required={false}
          />
          <FieldContainer
            label="Whatsapp Links"
            value={vendorData.whatsappLink.join(', ')}
            required={false}
          />
        </div>
        <Stack direction="row" spacing={2} style={{ marginTop: '20px' }}>
          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </div>
    </Modal>
  );
};

export default VendorPreviewModal;
