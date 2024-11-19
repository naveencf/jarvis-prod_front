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
const AllVendorWiseList = () => {
  const [vendorWiseData, setVendorWiseData] = useState([])
  const [vendorName, setVendorName] = useState([])
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isSingleVendorView, setIsSingleVendorView] = useState(false);

  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  // update

  const handleClose = () => {
    setModalOpenUpdate(false)
  };

  const { data: vendorWiseList } = useGetAllVendorWiseListQuery()
  const vendorData = vendorWiseList?.data

  const handleClickCatData = async (row) => {
    setIsSingleVendorView(true)
    setOpen(true);
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

  const handleUpdate = () => {
    setModalOpenUpdate(true);
  }
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
        {isSingleVendorView && (
          <button
            className="btn cmnbtn btn_sm btn-outline-secondary"
            onClick={() => setIsSingleVendorView(false)}
          >
            <ArrowBackIcon />
          </button>
        )}

        <h5 className="card-title">
          Bulk-Vendor</h5>
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
      {/* update vendor */}


    </div>
  )
}

export default AllVendorWiseList