import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { baseUrl } from '../../../../utils/config';
import View from '../../Sales/Account/View/View';
import { ApiContextData } from '../../APIContext/APIContext';
import { useGetAllPageListQuery } from '../../../Store/PageBaseURL';
import jwtDecode from 'jwt-decode';
import { TextField, Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useGlobalContext } from '../../../../Context/Context';

const UnFetchedPages = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const { data: pageList, refetch: refetchPageList, isLoading: isPageListLoading } = useGetAllPageListQuery({ decodedToken, userID });
  const { userContextData } = useContext(ApiContextData);

  const [unfatchedData, setUnfatchedData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [newSelectedData, setNewSelectedData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const fetchUnfetchedPages = async () => {
    try {
      const res = await axios.get(`${baseUrl}v1/get_all_not_available_pages`);
      const data = res?.data?.data
        .reverse()
        .filter((item) => item?.page_exist === false)
      setUnfatchedData(data);
    } catch (error) {
      console.error('Error fetching unfetched pages:', error);
    }
  };

  useEffect(() => {
    fetchUnfetchedPages();
  }, []);

  const handleSelection = (newSelectedData) => {
    if (newSelectedData?.length > 1) {
      alert('You can only select one page at a time.');
      return;
    }
    setSelectedData(newSelectedData);
  };

  const dataSecondGridColumns = [
    {
      key: 'S.NO',
      name: 'S.no',
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: 'page',
      name: 'Page',
      width: 200,
    },
    {
      key: 'plan_name',
      name: 'Plan Name',
      width: 200,
    },
    {
      key: 'sales_executive_id',
      name: 'Sales Executive',
      width: 200,
      renderRowCell: (row) => {
        const sales = userContextData?.find((item) => item?.user_id === row?.sales_executive_id)?.user_name;
        return sales || 'N/A';
      },
    },
    {
      key: 'description',
      name: 'Description',
      width: 200,
    },
    {
      key: 'plan_status',
      name: 'Plan Status',
      width: 200,
    },
    {
      key: 'page_exist',
      name: 'Page Exist',
      width: 200,
      renderRowCell: (row) => {
        if (row?.page_exist === false) {
          return 'False';
        }
      },
    },
  ];

  const handleChange = async (e, newValue) => {
    setNewSelectedData(newValue);
  };

  const handleUpdate = async () => {
    if (!selectedData || selectedData?.length === 0) {
      alert('Please Select Pages First !!');
      return;
    }
    if (!newSelectedData || newSelectedData?.length === 0) {
      alert('Please Select New Pages First !!');
      return;
    }
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await axios.put(`${baseUrl}v1/update_unfetched_pages`, {
        page: selectedData[0]?.page,
        new_value: newSelectedData,
      });
      setNewSelectedData(null);
      setSelectedData([]);
      if (res?.status === 200) {
        toastAlert('Update Successfully');
        fetchUnfetchedPages();
      }
      console.log(newSelectedData, 'newselected data');
    } catch (error) {
      console.error('Error updating pages:', error);
      alert('Error updating the page. Please try again.');
    } finally {
      setIsUpdating(false);
      setOpenModal(false);
    }
  };

  return (
    <>
      <div className="d-flex mb-2">
        <Autocomplete
          value={newSelectedData} // Controlled value
          options={pageList?.map((item) => item?.page_name)}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Pages " />}
          onChange={handleChange} // Handle change on selection
        />
        <button className="btn cmnbtn btn_sm btn-outline-primary ml-2" onClick={handleUpdate} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </div>

      <View columns={dataSecondGridColumns} data={unfatchedData} isLoading={false} title={'Un Fatched Page'} rowSelectable={true} pagination={[100, 200, 1000]} tableName={'Unfatched Pages'} selectedData={handleSelection} />

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleModalClose} aria-labelledby="confirmation-dialog-title" aria-describedby="confirmation-dialog-description">
        <DialogTitle id="confirmation-dialog-title">Confirm Update</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to update this page?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UnFetchedPages;
