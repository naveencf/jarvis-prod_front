import React from 'react';
import { Modal, Box, Typography, Divider, Button } from '@mui/material';

const PreviewModal = ({
  open,
  onClose,
  previewData,
  bankRows,
  payData,
  bankName,
  docDetails,
  handleFinalSubmit,
}) => {
  console.log(previewData);
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-preview-title"
      aria-describedby="modal-preview-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Typography id="modal-preview-description" sx={{ mt: 2 }}>
          Vendor Name: {previewData.vendor_name || 'N/A'}
        </Typography>
        <Typography>
          Country Code: {previewData.country_code || 'N/A'}
        </Typography>
        <Typography>Mobile: {previewData.mobile || 'N/A'}</Typography>
        <Typography>
          Alternate Mobile: {previewData.alternate_mobile || 'N/A'}
        </Typography>
        <Typography>Email: {previewData.email || 'N/A'}</Typography>
        <Typography>Vendor Type: {previewData.vendor_type || 'N/A'}</Typography>
        <Typography>
          Vendor Platform: {previewData.vendor_platform || 'N/A'}
        </Typography>
        <Typography>Pay Cycle: {previewData.pay_cycle || 'N/A'}</Typography>
        <Typography>
          Company Name: {previewData.company_name || 'N/A'}
        </Typography>
        <Typography>
          Company Address: {previewData.company_address || 'N/A'}
        </Typography>
        <Typography>
          Company City: {previewData.company_city || 'N/A'}
        </Typography>
        <Typography>
          Company Pincode: {previewData.company_pincode || 'N/A'}
        </Typography>
        <Typography>
          Company State: {previewData.company_state || 'N/A'}
        </Typography>
        <Typography>
          Threshold Limit: {previewData.threshold_limit || 'N/A'}
        </Typography>
        <Typography>
          Home Address: {previewData.home_address || 'N/A'}
        </Typography>
        <Typography>Home City: {previewData.home_city || 'N/A'}</Typography>
        <Typography>Home State: {previewData.home_state || 'N/A'}</Typography>
        <Typography>
          Home Pincode: {previewData.home_pincode || 'N/A'}
        </Typography>
        <Typography>
          Vendor Category: {previewData.vendor_category || 'N/A'}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Bank Details:
        </Typography>

        {bankRows?.length > 0 ? (
          bankRows.map((row, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography>
                <strong>Payment Method:</strong>{' '}
                {payData?.find((option) => option._id === row.payment_method)
                  ?.payMethod_name || 'N/A'}
              </Typography>

              {row.payment_method === '666856874366007df1dfacde' && (
                <>
                  <Typography>
                    <strong>Bank Name:</strong> {row?.bank_name || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Account Type:</strong> {row.account_type || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Account Number:</strong>{' '}
                    {row.account_number || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>IFSC Code:</strong> {row?.ifcs || 'N/A'}
                  </Typography>
                </>
              )}

              {row.payment_method === '666856754366007df1dfacd2' && (
                <Typography>
                  <strong>UPI ID:</strong> {row.upi_id || 'N/A'}
                </Typography>
              )}

              {(row.payment_method === '66681c3c4366007df1df1481' ||
                row.payment_method === '666856624366007df1dfacc8') && (
                <Typography>
                  <strong>Registered Mobile Number:</strong>{' '}
                  {row.registered_number || 'N/A'}
                </Typography>
              )}

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))
        ) : (
          <Typography>No bank details provided.</Typography>
        )}

        <Typography variant="h6" sx={{ mt: 2 }}>
          Document Details:
        </Typography>
        {docDetails?.map((doc, index) => (
          <div className="row" key={index}>
            <div className="col-md-4">
              <Typography>
                <strong>Document Name:</strong> {doc?.docName}
              </Typography>
            </div>
            <div className="col-md-4">
              <Typography>
                <strong>Document Number:</strong> {doc?.docNumber}
              </Typography>
            </div>
          </div>
        ))}

        {/* <Typography>
          Vendor Links (WhatsApp, etc.): {previewData.vendorLinks || 'N/A'}
        </Typography> */}
        {/* <Typography>Created By: {previewData.created_by || 'N/A'}</Typography>
        <Typography>Closed By: {previewData.closed_by || 'N/A'}</Typography> */}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleFinalSubmit} color="primary">
            Confirm & Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PreviewModal;
