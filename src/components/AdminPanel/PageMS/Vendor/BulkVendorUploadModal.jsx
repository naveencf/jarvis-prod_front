import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField } from '@mui/material';
import Select from 'react-select';
import { useGetAllVendorQuery, useGetPmsPlatformQuery } from '../../../Store/reduxBaseURL';
import UploadBulkVendorPages from './BulkVendor/UploadBulkVendorPages';
import { useGetAllPageCategoryQuery, useGetAllPageSubCategoryQuery } from '../../../Store/PageBaseURL';
import jwtDecode from 'jwt-decode';
import { FormatName } from '../../../../utils/FormatName';
import CustomSelect from '../../../ReusableComponents/CustomSelect';
import formatString from '../../Operation/CampaignMaster/WordCapital';
import axios from 'axios';
import { baseUrl } from '../../../../utils/config';
import { useAPIGlobalContext } from '../../APIContext/APIContext';

export default function BulkVendorUploadModal({ open, onClose, rowData }) {
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const token = sessionStorage.getItem('token');
  const { data: subCategory } = useGetAllPageSubCategoryQuery();
  const subCategoryData = subCategory?.data || [];
  const {userContextData} = useAPIGlobalContext()

  const [rateType, setRateType] = useState();
  const [closeBy, setCloseBy] = useState('');
  const [vendorId, setVendorId] = useState([]);
  const [selectedSubCategory, setSelectedSubCateogry] = useState(null);
  const [activePlatformId, setActivePlatformId] = useState('666818824366007df1df1319');
  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;
  const [categoryName, setCategoryName] = useState('');
  const [tagCategoris, setTagCategories] = useState([]);
  const [singleVendor, setSingleVendor] = useState({});
  const [tag, setTag] = useState([]);
  const { data: vendorData } = useGetAllVendorQuery();
  const { data: category } = useGetAllPageCategoryQuery({
    decodedToken,
    token,
  });
  const categoryData = category?.data || [];
  const handlePlatform = (id) => {
    setActivePlatformId(id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getData = await axios.get(`${baseUrl}v1/vendor/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setSingleVendor(getData?.data?.data);
        setCloseBy(getData?.data?.data?.closed_by);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [vendorId]);

  useEffect(() => {
    if (tag.length) {
      const tagCat = tag.map((t) => t.label);
      setTagCategories(tagCat);
    }
  }, [tag]);

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
                  value: vendorId,
                  label: vendorData.find((d) => d._id === vendorId)?.vendor_name || '',
                }}
                onChange={(e) => {
                  setVendorId(e.value);
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
              <label className="form-label">
                Select Platform
                <sup className="form-error">*</sup>
              </label>
              <CustomSelect
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
          <div className="row">
            {/* <div className="col-6">
              <label className="form-label">
                Select Sub-Category
                <sup className="form-error">*</sup>
              </label>
              <Autocomplete
                options={subCategoryData}
                getOptionLabel={(option) => option.page_sub_category || 'Unknown Sub-Category'}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  setSelectedSubCateogry(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Select Sub-Category" variant="outlined" />}
              />
            </div> */}
            <div className="col-6">
              <label className="form-label">
                Select Tag Categories
                <sup className="form-error">*</sup>
              </label>
              <Autocomplete
                multiple
                options={categoryData.map((option) => ({
                  value: option._id,
                  label: option.page_category,
                }))}
                getOptionLabel={(option) => option.label || ''}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                value={tag}
                onChange={(event, newValue) => {
                  setTag(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Select Tag Categories" variant="outlined" required />}
              />
            </div>

            <div className="col-6">
              <label className="form-label">
                Closed By
                <sup className="form-error">*</sup>
              </label>
              <Autocomplete
                options={userContextData.map((option) => ({
                  value: option.user_id,
                  label: option.user_name,
                }))}
                getOptionLabel={(option) => option.label || ''}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                value={
                  userContextData
                    ?.map((option) => ({
                      value: option.user_id,
                      label: option.user_name,
                    }))
                    ?.find((option) => option.value === singleVendor?.closed_by || option.value === closeBy?.value) || null
                }
                onChange={(event, newValue) => {
                  setCloseBy(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Closed By" variant="outlined" required />}
              />
            </div>
            <div className="row mt-4">
              <div className="col-6">
                <Autocomplete
                  options={subCategoryData}
                  getOptionLabel={(option) => option.page_sub_category || 'Unknown Sub-Category'}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, newValue) => {
                    setSelectedSubCateogry(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} label="Select Sub-Category" variant="outlined" />}
                />
              </div>
            </div>
          </div>
          {/* <div className="row mt-5">
          
          </div> */}
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <UploadBulkVendorPages getRowData={vendorId} category={categoryName?.value} onClose={onClose} rateType={rateType} activePlatformId={activePlatformId} selectedSubCategory={selectedSubCategory} closeBy={closeBy?.value} tagCategoris={tagCategoris} from={'pages'} />
      </DialogActions>
    </Dialog>
  );
}
