import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import Select from 'react-select';
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from '../../../Store/reduxBaseURL';
import UploadBulkVendorPages from './BulkVendor/UploadBulkVendorPages';
import { useGetAllPageCategoryQuery } from '../../../Store/PageBaseURL';
import jwtDecode from 'jwt-decode';
import { FormatName } from '../../../../utils/FormatName';
import CustomSelect from '../../../ReusableComponents/CustomSelect';
import formatString from '../../Operation/CampaignMaster/WordCapital';

export default function BulkVendorUploadModal({ open, onClose, rowData }) {
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const token = sessionStorage.getItem('token');
  const [rateType, setRateType] = useState();
  const [vendorName, setVendorName] = useState([]);
  const [activePlatformId, setActivePlatformId] = useState(
    '666818824366007df1df1319'
  );
  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const [categoryName, setCategoryName] = useState('');

  const { data: vendorData } = useGetAllVendorQuery();
  const { data: category } = useGetAllPageCategoryQuery({
    decodedToken,
    token,
  });
  const categoryData = category?.data || [];
  const handlePlatform = (id) => {
    setActivePlatformId(id);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={true}
      maxWidth="md"
      PaperProps={{
        style: {
          height: '550px',
          maxHeight: '80vh',
        },
      }}
    >
      <DialogTitle>{'Upload Bulk Vendor '}</DialogTitle>
      {vendorData && (
        <DialogContent>
          <div className="row">
            <div className="form-group col-6">
              <label className="form-label">
                Vendor Name <sup className="form-error">*</sup>
              </label>
              <Select
                className=""
                options={vendorData.map((option) => ({
                  value: option._id,
                  label: `${option.vendor_name}`,
                }))}
                value={{
                  value: vendorName,
                  label:
                    vendorData.find((d) => d._id === vendorName)?.vendor_name ||
                    '',
                }}
                onChange={(e) => {
                  setVendorName(e.value);
                }}
                required
              />{' '}
            </div>
            <div className="form-group col-6">
              <label className="form-label">
                Rate Type <sup className="form-error">*</sup>{' '}
              </label>
              <Select
                className=""
                options={[
                  { value: 'fixed', label: 'Fixed' },
                  { value: 'variable', label: 'Variable' },
                ]}
                onChange={(e) => {
                  setRateType(e.value); // Update the rate_type based on selection
                }}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col-6">
              <label className="form-label">
                Category Name <sup className="form-error">*</sup>
              </label>
              <Select
                className=""
                options={categoryData.map((option) => ({
                  value: option._id,
                  label: `${FormatName(option.page_category)}`,
                }))}
                onChange={(e) => {
                  setCategoryName(e);
                }}
                required
              />
            </div>
            <div className="form-group col-6">
              <CustomSelect
                label="Select Platform"
                fieldGrid="12"
                dataArray={platformData?.map((item) => ({
                  value: item._id,
                  label: formatString(item.platform_name),
                }))}
                optionId="value"
                optionLabel="label"
                selectedId={activePlatformId}
                setSelectedId={handlePlatform}
              />
            </div>
          </div>
          <div></div>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <UploadBulkVendorPages
          getRowData={vendorName}
          category={categoryName?.value}
          onClose={onClose}
          rateType={rateType}
          activePlatformId={activePlatformId}
          from={'pages'}
        />
      </DialogActions>
    </Dialog>
  );
}
