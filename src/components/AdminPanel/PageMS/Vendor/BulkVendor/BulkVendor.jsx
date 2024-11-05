import React, { useEffect, useState } from "react";
import View from "../../../Sales/Account/View/View";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import BulkVendorUploadModal from "../BulkVendorUploadModal";
import { useGetAllVendorQuery } from "../../../../Store/reduxBaseURL";
import { FaEdit } from "react-icons/fa";
import { Box, Button, Typography, Modal } from "@mui/material";
import FieldContainer from "../../../FieldContainer";
import FormContainer from "../../../FormContainer";

const BulkVendor = () => {
  const token = sessionStorage.getItem("token");
  const [bulkData, setBulkData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [getRowData, setGetRowData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  // update
  const [id, setID] = useState('');
  const [venderName, setVenderName] = useState('');
  const [pageName, setPageName] = useState('');
  const [story, setStory] = useState('');
  const [post, setPost] = useState('');
  console.log(id, "new daat");
  const [bothData, setBothData] = useState('');
  const [reel, setReel] = useState('');
  const [carousel, setCarousel] = useState('');
  const [m_story, setM_story] = useState('');
  const [m_post, setM_post] = useState('');
  const [m_both, setM_both] = useState('');

  const {
    data: vendorData,
  } = useGetAllVendorQuery();


  useEffect(() => {
    axios
      .get(`${baseUrl}v1/bulk_vendor_data`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setBulkData(res.data.data);
        setFilterData(res.data.data);
        console.log(res.data.data, "res.datab");
      });
  }, []);

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


  const dataGridcolumns = [
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
      key: "vendor_id",
      name: "Vendor",
      width: 200,
      renderRowCell: (row) => {
        const venName = vendorData?.find((item) => item?._id === row?.vendor_id)?.vendor_name;
        return venName || "NA";
      },
    },
    {
      key: "story",
      name: "Story",
      width: 200,
    },
    {
      key: "post",
      name: "Post",
      width: 200,
    },
    {
      key: "both",
      name: "Both",
      width: 200,
    },
    {
      key: "m_story",
      name: "Million Story",
      width: 200,
    },
    {
      key: "m_post",
      name: "Million Post",
      width: 200,
    },
    {
      key: "m_both",
      name: "Million Both",
      width: 200,
    },
    {
      key: "reel",
      name: "Reel",
      width: 200,
    },

    {
      key: "carousel",
      name: "Carousel",
      width: 200,
    },

    {
      key: "createdAt",
      width: 150,
      name: "Creation Date",
      renderRowCell: (row) => {
        let data = row?.createdAt;
        return data
          ? Intl.DateTimeFormat("en-GB").format(new Date(data))
          : "NA";
      },
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
  ];

  const handleOpenModal = (rowData) => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);

  };
  const handleClose = () => {
    setModalOpenUpdate(false)
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
      setModalOpenUpdate(false);
      alert(" Update SuccessFully")

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div>
      <div className="card-header flexCenterBetween">
        <h5 className="card-title">Bulk-Vendor-Pages</h5>
        <div className="flexCenter colGap8">
          {/* <UploadBulkVendorPages getRowData={getRowData} from={"pages"} /> */}
          {openModal && <BulkVendorUploadModal open={openModal} onClose={handleCloseModal} />}

          <button
            onClick={() => handleOpenModal()}
            title="Edit"
            className="btn cmnbtn btn_sm btn-outline-primary"
          >
            Upload Bulk Vendor
          </button>
        </div>
      </div>
      <View
        columns={dataGridcolumns}
        data={filterData}
        isLoading={false}
        title={"Bulk Vendor Overview"}
        rowSelectable={true}
        pagination={[100, 200, 1000]}
        tableName={"Bulk Vendor Overview"}
        selectedData={setGetRowData}
      />
      <>
        {/* Update Bulk vendor  modal */}
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
              >
                <FieldContainer
                  label="Vendor Name"
                  type="text"
                  fieldGrid={4}
                  value={
                    vendorData?.find((item) => item?._id === venderName)?.vendor_name || "NA"
                  }
                  disabled
                />
                <FieldContainer
                  label="Page Name"
                  type="text"
                  fieldGrid={4}
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                />
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
                <FieldContainer label="M Post" type="text" fieldGrid={4} value={m_post} onChange={(e) => setM_post(e.target.value)} />
                <FieldContainer label="M Story" type="text" fieldGrid={4} value={m_story} onChange={(e) => setM_story(e.target.value)} />
                <FieldContainer label="M Both" type="text" fieldGrid={4} value={m_both} onChange={(e) => setM_both(e.target.value)} />


              </FormContainer>
              <button 
               className="btn cmnbtn btn_sm btn-primary"
                onClick={handleSubmitUpdate}> update</button>
            </Box>
          </Box>
        </Modal>
      </>
    </div>
  );
};

export default BulkVendor;
