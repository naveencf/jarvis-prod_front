import React from 'react';
import { Modal, Box, Typography, Divider, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardContent, Grid } from '@mui/material';
import {
  useGetPmsPayCycleQuery,
  useGetPmsPlatformQuery,
  useGetAllVendorTypeQuery
} from "../../../Store/reduxBaseURL";
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
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data;
  const { data: cycle } = useGetPmsPayCycleQuery();
  const cycleData = cycle?.data;
  const { data: vendor } = useGetAllVendorTypeQuery();
  const typeData = vendor?.data;

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
        <Typography id="modal-preview-title" variant="h6" component="h2">
          Vendor Information Preview
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Vendor Details Table */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table aria-label="vendor-details-table">
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography variant="subtitle1" fontWeight="bold">Vendor Details</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries({
                'Vendor Name': previewData.vendor_name,
                'Country Code': previewData.country_code,
                'Mobile': previewData.mobile,
                'Alternate Mobile': previewData.alternate_mobile,
                'Email': previewData.email,
                'Vendor Type': typeData?.find((item) => item?._id == previewData?.vendor_type)
                  ?.type_name,
                'Vendor Platform': platformData?.find((item) => item?._id == previewData.vendor_platform)
                  ?.platform_name,
                'Pay Cycle': cycleData?.find((item) => item?._id == previewData?.pay_cycle)
                  ?.cycle_name,
                'Company Name': previewData.company_name,
                'Company Address': previewData.company_address,
                'Company City': previewData.company_city,
                'Company Pincode': previewData.company_pincode,
                'Company State': previewData.company_state,
                'Threshold Limit': previewData.threshold_limit,
                'Home Address': previewData.home_address,
                'Home City': previewData.home_city,
                'Home State': previewData.home_state,
                'Home Pincode': previewData.home_pincode,
                'Vendor Category': previewData.vendor_category,
              }).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>{key}</TableCell>
                  <TableCell>{value || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Bank Details Section */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
          Bank Details:
        </Typography>

        {bankRows?.length > 0 ? (
          bankRows.map((row, i) => (
            <Card key={i} sx={{ mb: 3, p: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  <strong>Payment Method:</strong>{' '}
                  {payData?.find((option) => option._id === row.payment_method)?.payMethod_name || 'N/A'}
                </Typography>

                {/* Payment method-specific details */}
                <Grid container spacing={2}>
                  {row.payment_method === '666856874366007df1dfacde' && (
                    <>
                      <Grid item xs={6}>
                        <Typography><strong>Bank Name:</strong> {row?.bank_name || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Account Type:</strong> {row.account_type || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>Account Number:</strong> {row.account_number || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography><strong>IFSC Code:</strong> {row?.ifsc || 'N/A'}</Typography>
                      </Grid>
                    </>
                  )}

                  {row.payment_method === '666856754366007df1dfacd2' && (
                    <Grid item xs={12}>
                      <Typography><strong>UPI ID:</strong> {row.upi_id || 'N/A'}</Typography>
                    </Grid>
                  )}

                  {(row.payment_method === '66681c3c4366007df1df1481' ||
                    row.payment_method === '666856624366007df1dfacc8') && (
                      <Grid item xs={12}>
                        <Typography><strong>Registered Mobile Number:</strong> {row.registered_number || 'N/A'}</Typography>
                      </Grid>
                    )}
                </Grid>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No bank details provided.</Typography>
        )}

        {/* Document Details Section */}
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Document Details:</Typography>
        {docDetails?.map((doc, index) => (
          <TableContainer component={Paper} sx={{ my: 1 }} key={index}>
            <Table aria-label="document-details-table">
              <TableBody>
                <TableRow>
                  <TableCell><strong>Document Name:</strong> {doc?.docName || 'N/A'}</TableCell>
                  <TableCell><strong>Document Number:</strong> {doc?.docNumber || 'N/A'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ))}

        {/* Action Buttons */}
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
