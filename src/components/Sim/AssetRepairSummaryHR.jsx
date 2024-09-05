import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { baseUrl } from "../../utils/config";
import Modal from "react-modal";

const AssetRepairSummary = () => {
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "get_all_repair_summary_data");
      setData(response.data.data);
      setFilterData(response.data.data);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

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
      width: "10%",
      sortable: true,
    },
    {
      name: "Asset Name",
      selector: (row) => row.asset_name,

      sortable: true,
    },
    {
      name: "Asset Repair By",
      selector: (row) => row.req_by_name,
    },

    {
      name: "Asset Reocver Img",
      selector: (row) => (
        <>
          {row.recovery_image_upload1 && row.recovery_image_upload2 && (
            <>
              {row.recovery_image_upload1 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ||
              row.recovery_image_upload2 !==
                "https://storage.googleapis.com/dev-backend-bucket/" ? (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleRepairImage(row)}
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
      name: "Repair Date",
      selector: (row) => row.repair_request_date_time?.split("T")?.[0],
    },
    {
      name: "Repair Recover HR",
      selector: (row) => row.recovery_by_name,
    },
    {
      name: "Repair Remark",
      selector: (row) => row.recovery_remark,
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
            title="Repair Summary"
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
      </div>
      {/* </FormContainer> */}

      {/* This is a Repair image modal  */}
      <Modal
        isOpen={repairImageModalOpen}
        onRequestClose={handleCloseRepairImageModal}
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
            <h2>Repair Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseRepairImageModal}
            >
              X
            </button>
          </div>
        </div>
        <div className="summary_cards flex-row row">
          {typeof showRepairImages?.recovery_image_upload1 === "string" &&
            !showRepairImages.recovery_image_upload1.endsWith("bucket2/") && (
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          href={showRepairImages?.recovery_image_upload1}
                          target="blank"
                        >
                          <img
                            src={showRepairImages?.recovery_image_upload1}
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
          {typeof showRepairImages?.recovery_image_upload2 === "string" &&
            !showRepairImages.recovery_image_upload2.endsWith("bucket2/") && (
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
                          href={showRepairImages?.recovery_image_upload2}
                          target="blank"
                        >
                          <img
                            src={showRepairImages?.recovery_image_upload2}
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

export default AssetRepairSummary;
