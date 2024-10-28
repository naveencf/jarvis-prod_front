import React, { useEffect, useState } from "react";
import View from "../../../Sales/Account/View/View";
import axios from "axios";
import { baseUrl } from "../../../../../utils/config";
import { Link } from "react-router-dom";
import UploadBulkVendorPages from "./UploadBulkVendorPages";
import BulkVendorUploadModal from "../BulkVendorUploadModal";
import { useGetAllVendorQuery } from "../../../../Store/reduxBaseURL";

const BulkVendor = () => {
  const token = sessionStorage.getItem("token");
  const [bulkData, setBulkData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [getRowData, setGetRowData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const {
    data: vendorData,
    // isLoading: loading,
    // refetch: refetchVendor,
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
  ];

  const handleOpenModal = (rowData) => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
            // className="btn btn-outline-primary"
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
    </div>
  );
};

export default BulkVendor;
