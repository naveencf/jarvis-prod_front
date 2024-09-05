import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import FormContainer from "../AdminPanel/FormContainer";
import { baseUrl } from "../../utils/config";
import DateISOtoNormal from "../../utils/DateISOtoNormal";
import Modal from "react-modal";

const RepairRetrunSummary = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);

  async function getData() {
    try {
      // const [assetReturnResponse, assetRepairResponse] = await Promise.all([
      //   axios.get(baseUrl + "get_all_repair_summary_data"),
      //   axios.get(baseUrl + "get_all_return_summary_data"),
      // ]);
      const response = await axios.get(baseUrl + "get_all_return_summary_data");
      setData(response.data.data);
      setFilterData(response.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  const [returnImageModalOpen, setReturnImageModalOpen] = useState(false);
  const [showReturnImages, setShowReturnImages] = useState("");
  const handleReturnImage = (row) => {
    setShowReturnImages(row);
    setReturnImageModalOpen(true);
  };
  const handleCloseReturnImageModal = () => {
    setReturnImageModalOpen(false);
  };

  const [repairImageModalOpen, setRepairImageModalOpen] = useState(false);
  const [showRepairImages, setShowRepairImages] = useState("");
  const handleRepairImage = (row) => {
    setShowRepairImages(row);
    setRepairImageModalOpen(true);
  };
  const handleCloseRepairImageModal = () => {
    setRepairImageModalOpen(false);
  };

  const columns = [
    {
      name: "S.No",
      // selector: (row) => row.Role_id,
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,
      width: "150px",
      sortable: true,
    },

    {
      name: "Asset Return By",
      selector: (row) => row.asset_return_by_name,
      width: "150px",
    },
    {
      name: "Asset Return Img",
      width: "150px",

      selector: (row) => (
        <>
          {row?.recover_asset_image_1 && row.recover_asset_image_2 && (
            <>
              {row.recover_asset_image_1 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ||
              row.recover_asset_image_2 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ? (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleReturnImage(row)}
                >
                  <i className="bi bi-images"></i>
                </button>
              ) : (
                "N/A"
              )}
            </>
          )}
        </>
      ),
    },
    {
      name: "Retun Date",
      selector: (row) => row.return_asset_data_time?.split("T")?.[0],
    },
    {
      name: "Retun Recover HR",
      selector: (row) => row.asset_return_recover_by_name,
      width: "150px",
    },
    {
      name: "Return Remark",
      selector: (row) => row.asset_return_recover_by_remark,
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.asset_name?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  return (
    <>
      <div className="card">
        <div className="data_tbl table-responsive">
          <DataTable
            title="Return Summary"
            columns={columns}
            data={filterdata}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="62vh"
            highlightOnHover
            subHeader
            subHeaderComponent={
              <input
                type="text"
                placeholder="Search here"
                className="w-50 form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            }
          />
        </div>
        <div className="data_tbl table-responsive card-body body-padding">
          <DataTable
            title=""
            columns={columns}
            data={filterdata}
            // fixedHeader
            pagination
            // fixedHeaderScrollHeight="62vh"
            // highlightOnHover
            // subHeader
            // subHeaderComponent={

            // }
          />
        </div>
      </div>
      {/* </FormContainer> */}

      {/* This is a Retun image modal  */}
      <Modal
        isOpen={returnImageModalOpen}
        onRequestClose={handleCloseReturnImageModal}
        style={{
          content: {
            width: "60%",
            height: "50%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div>
          <div className="d-flex justify-content-between mb-2">
            <h2>Return Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseReturnImageModal}
            >
              X
            </button>
          </div>
        </div>
        <div className="summary_cards flex-row row">
          {typeof showReturnImages?.recover_asset_image_1 === "string" &&
            !showReturnImages.recover_asset_image_1.endsWith("bucket2/") && (
              <div
                className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
              >
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          href={showReturnImages?.recover_asset_image_1}
                          target="blank"
                        >
                          <img
                            src={showReturnImages?.recover_asset_image_1}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          {typeof showReturnImages?.recover_asset_image_2 === "string" &&
            !showReturnImages.recover_asset_image_2.endsWith("bucket2/") && (
              <div
                className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12"
                // onMouseEnter={handleMouseEnter}
                // onMouseLeave={handleMouseLeave}
              >
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          href={showReturnImages?.recover_asset_image_2}
                          target="blank"
                        >
                          <img
                            src={showReturnImages?.recover_asset_image_2}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
      </Modal>
    </>
  );
};

export default RepairRetrunSummary;
