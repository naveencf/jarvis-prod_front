import React, { useState } from 'react'
import { useGetAllVendorWiseListQuery } from '../../../../Store/reduxBaseURL'
import View from '../../../Sales/Account/View/View';
import axios from 'axios';
import { baseUrl } from '../../../../../utils/config';
import { Dialog, Box, Modal, Button } from '@mui/material';
import { FaEdit } from "react-icons/fa";
import BulkVendorUploadModal from '../BulkVendorUploadModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FieldContainer from '../../../FieldContainer';
import FormContainer from '../../../FormContainer';
import Select, { components } from "react-select";
import jwtDecode from 'jwt-decode';
import { useGetAllPageListQuery } from '../../../../Store/PageBaseURL';

const AllVendorWiseList = () => {
  const [isSingleVendorView, setIsSingleVendorView] = useState(false);

  const { data: vendorWiseList } = useGetAllVendorWiseListQuery()
  const vendorData = vendorWiseList?.data
  const storedToken = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [vendorWiseData, setVendorWiseData] = useState([])
  const [vendorName, setVendorName] = useState([])
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  // update
  const [id, setID] = useState('');
  const [venderName, setVenderName] = useState('');
  const [pageName, setPageName] = useState('');
  const [story, setStory] = useState('');
  const [post, setPost] = useState('');
  const [bothData, setBothData] = useState('');
  const [reel, setReel] = useState('');
  const [carousel, setCarousel] = useState('');
  const [m_story, setM_story] = useState('');
  const [m_post, setM_post] = useState('');
  const [m_both, setM_both] = useState('');

  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID });


  const handleUpdate = async (row) => {
    setModalOpenUpdate(true);
    try {
      const getSingleVendor = await axios.get(`${baseUrl}v1/get_single_bulk_vendor/${row._id}`);
      const vendorDetails = getSingleVendor?.data?.data
      setID(vendorDetails?._id)
      setVenderName(vendorDetails?.vendor_id)
      setPageName(vendorDetails?.page_name)
      setStory(vendorDetails?.story)
      setPost(vendorDetails?.post)
      setBothData(vendorDetails?.both)
      setReel(vendorDetails?.reel)
      setCarousel(vendorDetails?.carousel)
      setM_story(vendorDetails?.m_story)
      setM_post(vendorDetails?.m_post)
      setM_both(vendorDetails?.m_both)
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };
  const handleSubmitUpdate = async (e) => {
    try {
      const res = await axios.put(`${baseUrl}v1/edit_bulk_vendor_data`, {
        _id: id,
        page_name: pageName,
        story: story,
        post: post,
        both: bothData,
        m_post: m_post,
        m_story: m_story,
        m_both: m_both,
        reel: reel,
        carousel: carousel
      });
      if (res.status === 200) {
        // await handleClickCatData(id);
        console.log("Update Successfully");
      } else {
        console.log("Failed to update. Please try again.");
      }
      setModalOpenUpdate(false);
      alert(" Update SuccessFully")
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickCatData = async (row) => {

    setIsSingleVendorView(true)
    const res = await axios.get(`${baseUrl}v1/get_bulk_vendor_data_by_vendor_id/${row?._id}`)
    setVendorWiseData(res?.data?.data)
    setVendorName(row?.vendor_name)
  }

  const handleOpenModal = (rowData) => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

  };
  const handleClose = () => {
    setModalOpenUpdate(false);

  };


  const dataGridcolumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      renderRowCell: (row) => (
        <> {(row?.vendor_name)}   </>
      ),
    },
    {
      key: "page_count",
      name: "Page Count",
      width: 200,
      renderRowCell: (row) => (
        <div>
          {
            <button
              title="View Pages"
              onClick={() => handleClickCatData(row)}
              className="btn cmnbtn btn_sm btn-outline-primary"
              style={{ minWidth: "120px", color: "blue" }}
            >
              {row.page_count}
            </button>
          }
        </div>
      ),
    },
    {
      key: "avg_post_price",
      name: "Avg Post",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.avg_post_price)}   </>
      ),
    },

    {
      key: "iii",
      name: "Avg Story",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.avg_story_price)}   </>
      ),
    },
    {
      key: "avg_both_price",
      name: "Avg Both",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.avg_both_price)}   </>
      ),
    },

    {
      key: "avg_m_post_price",
      name: "M Avg Post",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.avg_m_post_price)}   </>
      ),
    },
    {
      key: "avg_m_story_price",
      name: "M Avg Story",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.avg_m_story_price)}   </>
      ),
    },
    {
      key: "avg_m_both_price",
      name: "M Avg Both",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.avg_m_both_price)}   </>
      ),
    },
    {
      key: "reel",
      name: "Reel",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.reel)}   </>
      ),
    },
    {
      key: "carousel",
      name: "Carousel",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.carousel)}   </>
      ),
    },

  ];
  const singlevendorColumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 80,
    },
    {
      key: "page_name",
      name: "Page Name",
      width: 200,
    },
    {
      key: "post",
      name: "Post",
      width: 200,
      renderRowCell: (row) => (
        <> {Math.round(row?.post)}   </>
      ),
    },

    {
      key: "story",
      name: " Story",
      width: 150,
      renderRowCell: (row) => (
        <> {Math.round(row?.story)}   </>
      ),
    },
    {
      key: "m_post",
      name: "M Post",
      width: 150,
      renderRowCell: (row) => (
        <> {Math.round(row?.m_post)}   </>
      ),
    },
    {
      key: "m_story",
      name: "M Story",
      width: 150,
      renderRowCell: (row) => (
        <> {Math.round(row?.m_post)}   </>
      ),
    },
    {
      key: "m_both",
      name: "M  Both",
      width: 150,
      renderRowCell: (row) => (
        <> {Math.round(row?.m_both)}   </>
      ),
    },
    {
      key: "reel",
      name: "Reel",
      width: 150,
      renderRowCell: (row) => (
        <> {Math.round(row?.reel)}   </>
      ),
    },
    {
      key: "Action",
      name: "Action",
      width: 500,
      renderRowCell: (row) => (
        <div className="flexCenter colGap8">

          <button
            title="Edit"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => handleUpdate(row)}
          >
            <FaEdit />
          </button>
        </div>
      ),
    },
  ]
  return (
    <div>
      <div className="card-header flexCenterBetween">
        <h5 className="card-title">
          Bulk-Vendor</h5>
        {isSingleVendorView && (
          <button
            className="btn cmnbtn btn_sm btn-outline-secondary"
            onClick={() => setIsSingleVendorView(false)}
          >
            <ArrowBackIcon /> Overview
          </button>
        )}
        <div className="flexCenter colGap8">
          {openModal && <BulkVendorUploadModal open={openModal} onClose={handleCloseModal} />}
          <button
            onClick={handleOpenModal}
            title="Edit"
            className="btn cmnbtn btn_sm btn-outline-primary"
          >
            Upload Bulk Vendor
          </button>
        </div>
      </div>

      {/* Table for All Vendors */}
      {!isSingleVendorView && (
        <View
          columns={dataGridcolumns}
          data={vendorData}
          isLoading={false}
          title="Bulk Vendor Overview"
          rowSelectable={true}
          pagination={[100, 200, 1000]}
          tableName="Bulk Vendor Overview"
        />
      )}

      {/* Table for Specific Vendor */}
      {isSingleVendorView && (
        <Box>
          <View
            columns={singlevendorColumns}
            data={vendorWiseData}
            isLoading={false}
            title={`Vendor Name - ${vendorName}`}
            rowSelectable={true}
            pagination={[100, 200, 1000]}
            tableName="Single Vendor Data"
          />

        </Box>
      )}
      {/* update vendor modal */}

      <>
        <Modal
          open={modalOpenUpdate}
          onClose={handleClose}
          aria-labelledby="create-meeting-page-modal"
          aria-describedby="create-meeting-page-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}>
            <Button sx={{ float: 'right' }} variant="outlined" color='error'
              onClick={handleClose}
            >
              X
            </Button>
            <Box>
              <FormContainer
                mainTitle="Update Vendor Data "
                handleSubmit={false}
                title={'Update Data'}
                link={true}
              />
              <div className="card">
                <div className="card-body row">
                  <FieldContainer
                    label="Vendor Name"
                    type="text"
                    fieldGrid={4}
                    value={
                      vendorData?.find((item) => item?._id === venderName)?.vendor_name || "NA"
                    }
                    disabled
                  />

                  <div className="col-md-6 mb16">
                    <div className="form-group m0">
                      <label className="form-label">
                        Page Name <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <Select
                        name="Page"
                        options={pageList?.map((option) => ({
                          value: option.page_name,
                          label: option.page_name,
                        }))}
                        required={true}
                        className="basic-multi-select"
                        value={{
                          value: pageName,
                          label: pageName,
                        }}
                        onChange={(selectedOption) => {
                          setPageName(selectedOption?.value);
                        }}
                      />
                    </div>
                  </div>
                  <FieldContainer
                    label="Story"
                    type="text"
                    fieldGrid={4}
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                  />
                  <FieldContainer
                    label="Post"
                    type="text"
                    fieldGrid={4}
                    value={post}
                    onChange={(e) => setPost(e.target.value)}
                  />
                  <FieldContainer
                    label="Both"
                    type="text"
                    fieldGrid={4}
                    value={bothData}
                    onChange={(e) => setBothData(e.target.value)}
                  />
                  <FieldContainer
                    label="Reel"
                    type="text"
                    fieldGrid={4}
                    value={reel}
                    onChange={(e) => setReel(e.target.value)}
                  />
                  <FieldContainer
                    label="Carousel"
                    type="text"
                    fieldGrid={4}
                    value={carousel}
                    onChange={(e) => setCarousel(e.target.value)}
                  />
                  <FieldContainer
                    label="M Post"
                    type="text"
                    fieldGrid={4}
                    value={m_post}
                    onChange={(e) => setM_post(e.target.value)}
                  />
                  <FieldContainer
                    label="M Story"
                    type="text"
                    fieldGrid={4}
                    value={m_story}
                    onChange={(e) => setM_story(e.target.value)}
                  />
                  <FieldContainer
                    label="M Both"
                    type="text"
                    fieldGrid={4}
                    value={m_both}
                    onChange={(e) => setM_both(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="btn cmnbtn btn_sm btn-primary"
                onClick={handleSubmitUpdate}>
                update</button>
            </Box>
          </Box>
        </Modal>
      </>
    </div>
  )
}

export default AllVendorWiseList