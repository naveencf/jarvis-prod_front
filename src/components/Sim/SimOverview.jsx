import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import FormContainer from "../AdminPanel/FormContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import UserNav from "../Pantry/UserPanel/UserNav";
import jwtDecode from "jwt-decode";
import * as XLSX from "xlsx";
import Select from "react-select";
import Modal from "react-modal";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";
import AllAssetExcel from "../../utils/AllAssetsExcel";
import FieldContainer from "../AdminPanel/FieldContainer";
import AssetSendToVendorReusable from "./AssetSendToVendorReusable";
import ScrapReusable from "./ScrapReusable";
import ReciveToVendorReusable from "./ReciveToVendorReusable";

const SimOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastAlert, categoryDataContext } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [ImageModalOpen, setImageModalOpen] = useState(false);

  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const [userData, setUserData] = useState([]);

  // const [simTypeFilter, setSimTypeFilter] = useState("");
  // const [providerFilter, setProviderFilter] = useState("");

  const [simallocationdata, setSimAllocationData] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedUserTransfer, setSelectedUserTransfer] = useState("");

  const [modalData, setModalData] = useState([]);

  const [particularUserName, setParticularUserName] = useState("");

  const [modalSelectedUserData, setModalSelectedUserData] = useState([]);

  const [simAllocationTransferData, setSimAllocationTransferData] = useState(
    []
  );
  const [category, setCategory] = useState("");
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [subcategory, setSubCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [isTransferModal, setIsTransferModal] = useState(false);
  const closeTransferModal = () => {
    setIsTransferModal(false);
  };

  // const[isAllocationModal , setIsAllocationModal] = useState(false)
  // const closeAllocationModal = ()=>{
  //   setIsAllocationModal(false)
  // }

  const [showAssetsImage, setShowAssetImages] = useState([]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const [assetsType, setAssetsType] = useState("");
  const AsstestTypeOptions = [
    { value: "New", label: "New" },
    { value: "Old", label: "Old" },
  ];

  async function getData(buttonID) {
    await axios.get(baseUrl + "get_all_sims").then((res) => {
      const simAllData = res?.data.data;

      // if (status != "") {
      //   const AvailableData = simAllData?.filter(
      //     (data) => data.status.toLowerCase() == status
      //   );
      //   setData(AvailableData);
      //   setFilterData(AvailableData);`
      // } else

      if (buttonID == 1) {
        const f1 = simAllData?.filter((d) => d.status == "Available");
        setData(f1);
        setFilterData(f1);
      }
      if (buttonID == 2) {
        const f2 = simAllData?.filter((d) => d.status == "Allocated");
        setData(f2);
        setFilterData(f2);
      }
      if (buttonID == 0) {
        setData(simAllData);
        setFilterData(simAllData);
      }

      if (id == 1) {
        const f1 = simAllData?.filter((d) => d.status == "Available");
        setData(f1);
        setFilterData(f1);
      }
      if (id == 2) {
        const f2 = simAllData?.filter((d) => d.status == "Allocated");
        setData(f2);
        setFilterData(f2);
      }
      if (id == 0) {
        setData(simAllData);
        setFilterData(simAllData);
      }

      // if (selectedStatus !== "") {
      //   const AvailableData = simAllData?.filter(
      //     (data) => data.status == selectedStatus
      //   );
      //   setData(AvailableData);
      //   setFilterData(AvailableData);
      // } else {
      //   setData(simAllData);
      //   setFilterData(simAllData);
      // }
    });
  }

  // function getAllocatedData (){
  //   axios.get(baseUrl+"get_all_allocations").then((res) => {
  //   });
  // }

  useEffect(() => {
    const MSD = userData?.filter(
      (data) => data.user_id == selectedUserTransfer
    );
    setModalSelectedUserData(MSD);
  }, [selectedUserTransfer]);

  // i want to use context api this is replace

  // const [categoryData, setCategoryData] = useState([]);
  // const getCategoryData = () => {
  //   axios
  //     .get(baseUrl+"get_all_asset_category")
  //     .then((res) => {
  //       setCategoryData(res.data);
  //     });
  // };
  // useEffect(() => {

  // }, [data]);

  const getSubCategoryData = () => {
    if (category) {
      axios
        .get(`${baseUrl}` + `get_single_asset_sub_category/${category}`)
        .then((res) => {
          setSubCategoryData(res?.data);
        });
    }
  };
  useEffect(() => {
    getSubCategoryData();
  }, [category]);

  useEffect(() => {
    getData();
    // getCategoryData();
  }, [selectedStatus, id]);

  useEffect(() => {
    axios.get(baseUrl + "get_all_allocations").then((res) => {
      setSimAllocationData(res?.data.data);
    });

    axios.get(baseUrl + "get_all_users").then((res) => {
      setUserData(res?.data.data);
    });
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return (
        d.assetsName?.toLowerCase().match(search?.toLowerCase()) ||
        d.asset_id?.toLowerCase().match(search?.toLowerCase()) ||
        d.category_name?.toLowerCase().match(search?.toLowerCase())
      );
    });
    setFilterData(result);
  }, [search]);

  function handleParticularSimData(simId) {
    setIsTransferModal(true);
    axios.get(`${baseUrl}` + `get_single_sim/${simId}`).then((res) => {
      setModalData(res?.data.data);
    });
  }
  function handleParticularAllocationData(simId) {
    setIsModalOpen(true);
    axios.get(`${baseUrl}` + `get_single_sim/${simId}`).then((res) => {
      setModalData(res?.data.data);
    });
  }

  useEffect(() => {
    if (modalData) {
      const simAllocationTransfer = simallocationdata?.filter(
        (data) => data.sim_id == modalData?.sim_id
      );
      setSimAllocationTransferData(simAllocationTransfer);
    }
  }, [modalData]);

  useEffect(() => {
    if (simAllocationTransferData?.length > 0) {
      const commonUserId = userData?.filter(
        (data) => data.user_id == simAllocationTransferData[0]?.user_id
      );
      setParticularUserName(commonUserId[0]?.user_name);
    }
  }, [simAllocationTransferData, userData]);

  async function handleTransfer() {
    if (selectedUserTransfer != "") {
      const currDate = new Date().toISOString();
      const dateString = currDate.replace("T", " ").replace("Z", "");
      // axios.put(baseUrl + "update_allocationsim", {
      //   sim_id: simAllocationTransferData[0].sim_id,
      //   allo_id: simAllocationTransferData[0].allo_id,
      //   user_id: simAllocationTransferData[0].user_id,
      //   // dept_id: modalSelectedUserData[0].dept_id,
      //   status: "Available",
      //   submitted_by: userID,
      //   Last_updated_by: userID,
      //   Reason: "",
      //   submitted_at: dateString,
      // });

      await axios.put(baseUrl + "update_allocationsim", {
        user_id: Number(selectedUserTransfer),
        sim_id: Number(simAllocationTransferData[0].sim_id),
        // dept_id: Number(modalSelectedUserData[0].dept_id),
        created_by: userID,
        status: "Allocated",
      });

      setSelectedUserTransfer("");
      closeTransferModal();

      getData();
    } else {
      alert("Please Select User");
    }
  }

  // Allocation -----------------------------------------------------

  const handleSimAllocation = async () => {
    if (selectedUserTransfer !== "") {
      await axios.put(baseUrl + "update_allocationsim", {
        user_id: Number(selectedUserTransfer),
        status: "Allocated",
        sim_id: Number(modalData.sim_id),
        category_id: Number(modalData.category_id),
        sub_category_id: Number(modalData.sub_category_id),
        created_by: userID,
      });

      await axios
        .put(baseUrl + "update_sim", {
          id: modalData.sim_id,
          sim_no: modalData.sim_no,
          status: "Allocated",
          // mobilenumber: modalData.mobileNumber,
          // provider: modalData.provider,
          dept_id: Number(modalSelectedUserData[0].dept_id),
          desi_id: Number(modalSelectedUserData[0].user_designation),
          s_type: modalData.s_type,
          type: modalData.type,
          remark: modalData.Remarks,
        })
        .then(() => {
          closeModal();
          getData();
          toastAlert("Asset Allocated Successfully");
          setSelectedUserTransfer("");
        });
    } else {
      alert("Please select user first");
    }
  };
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const [stolenModalOpen, setStolenModalOpen] = useState(false);
  const [stolenDate, setStolenDate] = useState("");
  const [stolenRemark, setStolenRemark] = useState("");

  const [lostModalOpen, setLostnModalOpen] = useState(false);
  const [lostAssetDate, setLostAssetDate] = useState("");
  const [lostAssetRemark, setLostAssetRemark] = useState("");

  const [scrapModalOpen, setScrapModalOpen] = useState(false);

  const handleSelectionChange = (row) => (e) => {
    const selectedOption = e.target.value;
    setCurrentRow(row);

    switch (selectedOption) {
      case "send-to-vendor":
        handleSendToVendor(row);
        break;
      case "stolen":
        handleStolen(row);
        break;
      case "lost":
        handleLost(row);
        break;
      case "scrap":
        handleScrap(row);
        break;
      default:
    }
  };

  const handleSendToVendor = (row) => {
    setVendorModalOpen(true);
  };
  const handleSendToVendorModalClose = () => {
    return setVendorModalOpen(!vendorModalOpen);
  };

  // stolen section Start-----------------
  const handleStolen = (row) => {
    // console.log(currentRow, "stolen modal open");

    setStolenModalOpen(true);
  };
  const handleStolenModalClose = () => {
    setStolenModalOpen(false);
  };
  const handleSubmitStolen = async () => {
    try {
      await axios.put(baseUrl + "update_sim", {
        id: currentRow.sim_id,
        status: "Stolen",
        all_status_date: stolenDate,
        all_status_remark: stolenRemark,
      });

      await axios.put(baseUrl + "update_allocationsim", {
        sim_id: currentRow.sim_id,
        allo_id: currentRow.allo_id,
        status: "Stolen",
        submitted_by: userID,
        Last_updated_by: userID,
        // Reason: returnRecoverRemark,
      });

      getData();
      toastAlert("Status Updated");
      handleStolenModalClose();
    } catch {}
  };
  // stolen section End------------------

  //Lost asset seciton Start------------
  const handleLost = (row) => {
    setLostnModalOpen(true);
  };
  const handleLostModalClose = () => {
    setLostnModalOpen(false);
  };
  const handleSubmitLostAsset = async () => {
    try {
      await axios.put(baseUrl + "update_sim", {
        id: currentRow.sim_id,
        status: "Lost",
        all_status_date: lostAssetDate,
        all_status_remark: lostAssetRemark,
      });
      await axios.put(baseUrl + "update_allocationsim", {
        sim_id: currentRow.sim_id,
        allo_id: currentRow.allo_id,
        status: "Lost",
        submitted_by: userID,
        Last_updated_by: userID,
        // Reason: returnRecoverRemark,
      });

      getData();
      toastAlert("Status Updated");
      handleLostModalClose();
    } catch {}
  };
  //Lost asset section End--------------

  //Scrap Asset section Start
  const handleScrap = (row) => {
    setCurrentRow(row);
    setScrapModalOpen(true);
  };
  const handleScrapModalClose = () => {
    return setScrapModalOpen(!scrapModalOpen);
  };
  //Scrap Asset Modal End

  //vendor recive modal open
  const [reciveVendorModalOpen, setReciveVendorModalOpen] = useState(false);
  const handleReciveModalVednor = (row) => {
    setCurrentRow(row);
    setReciveVendorModalOpen(true);
  };
  const handleReciveVednorModalClose = () => {
    return setReciveVendorModalOpen(!reciveVendorModalOpen);
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Assets Name",
      selector: (row) => (
        <Link
          style={{ color: "blue" }}
          to={`/singleAssetDetails/${row.sim_id}`}
        >
          {row.assetsName}
        </Link>
      ),
      width: "150px",
      sortable: true,
    },
    {
      name: "Asset ID",
      selector: (row) => row.asset_id,
      sortable: true,
    },
    // {
    //   name: "Allocated To",
    //   selector: (row) => row.allocated_username,
    //   sortable: true,
    //   width: "150px",
    // },
    ...(id == 2
      ? [
          {
            name: "Allocated To",
            selector: (row) => row.allocated_username,
            sortable: true,
            width: "150px",
          },
        ]
      : []),

    {
      name: "Category",
      width: "130px",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Sub Category",
      width: "150px",
      selector: (row) => row.sub_category_name,
      sortable: true,
    },

    {
      name: "Value",
      selector: (row) => row.assetsValue,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
    },

    {
      name: "Image",
      selector: (row) => (
        <button
          className="icon-1"
          onClick={() => handleImageClick(row.sim_id)}
          title="View Images"
          // disabled={showAssetsImage?.length != 0}
        >
          <i className="bi bi-images"></i>
        </button>
      ),
    },

    {
      name: "Invoice",
      selector: (row) => {
        const baseUrl = "https://storage.googleapis.com/dev-backend-bucket/";
        // Check if the URL is not just the base URL (indicating there's additional info, thus, a file exists)
        const hasInvoice =
          row.invoiceCopy_url &&
          row.invoiceCopy_url !== baseUrl &&
          row.invoiceCopy_url.startsWith(baseUrl);

        return (
          <>
            {hasInvoice && (
              <a
                style={{ cursor: "pointer" }}
                target="_blank"
                href={row.invoiceCopy_url}
                title="Invoice"
                download
                className="icon-1"
              >
                <i
                  className="bi bi-receipt"
                  aria-hidden="true"
                  style={{ fontSize: "25px", color: "gray" }}
                ></i>
              </a>
            )}
          </>
        );
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <>
          {row.status !== "Scrap" &&
            row.status !== "Stolen" &&
            row.status !== "Lost" && (
              <>
                {row.vendor_status == "0" && (
                  <select
                    className="form-control"
                    onChange={handleSelectionChange(row)}
                  >
                    <option>Select...</option>
                    <option value="send-to-vendor">Send To Vendor</option>
                    <option value="stolen">Stolen</option>
                    <option value="lost">Lost</option>
                    <option value="scrap">Scrap</option>
                  </select>
                )}
              </>
            )}
        </>
      ),
      width: "150px",
    },
    {
      name: "Vendor Status",
      selector: (row) => (
        <>
          {row.vendor_status == "1" && (
            <button
              onClick={() => handleReciveModalVednor(row)}
              className="btn btn-danger btn-sm"
            >
              Recive from Vendor
            </button>
          )}
        </>
      ),
      width: "200px",
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          {row.status !== "Scrap" &&
            row.status !== "Stolen" &&
            row.status !== "Lost" && (
              <>
                <Link to={`/sim-update/${row.sim_id}`}>
                  <button title="Edit" className="icon-1">
                    <i className=" bi bi-pencil"></i>
                  </button>
                </Link>
                <Link to={`/sim-summary/${row.sim_id}`}>
                  <button title="Summary" className="icon-1">
                    <i className="bi bi-journal-text"></i>
                  </button>
                </Link>
                {row.status !== "Allocated" && (
                  <DeleteButton
                    endpoint="delete_sim"
                    id={row.sim_id}
                    getData={getData}
                  />
                )}
              </>
            )}

          {id == 2 && (
            <button
              type="button"
              className="btn btn-outline-black btn-sm  icon-1"
              title="Transfer"
              // data-toggle="modal"
              // data-target="#exampleModal11"
              // data-whatever="@mdo"
              onClick={() => handleParticularSimData(row.sim_id)}
            >
              <i className="bi bi-arrow-up-right"></i>
            </button>
          )}

          {id == 1 && (
            <button
              type="button"
              title="Allocation"
              className="icon-1"
              // data-toggle="modal"
              // data-target="#AllocationModal"
              // data-whatever="@mdo"
              onClick={() => handleParticularAllocationData(row.sim_id)}
            >
              A
            </button>
          )}
        </>
      ),
      allowOverflow: true,
      width: "250px",
    },
  ];

  // const [buttonAccess, setButtonAccess] = useState(false);

  const handleImageClick = (row) => {
    axios
      .post(`${baseUrl}` + `get_single_assets_image`, {
        sim_id: row,
      })
      .then((res) => {
        const images = res.data.data;
        // if (images?.length > 0) {
        if (
          images[0].img1_url !== null ||
          images[0].img2_url !== null ||
          images[0].img3_url !== null ||
          images[0].img4_url !== null
        ) {
          setShowAssetImages(images);
          setImageModalOpen(true);
        } else {
          alert("No images available for this asset.");
        }
      });
  };
  const handleCloseImageModal = () => {
    setImageModalOpen(false);
  };
  useEffect(() => {
    const result = data?.filter((d) => {
      const categoryMatch = !category || d.category_id === category;
      const subcategoryMatch =
        !subcategory || d.sub_category_id === subcategory;
      const assettypeMatch = !assetsType || d.asset_type === assetsType;
      return categoryMatch && subcategoryMatch && assettypeMatch;
    });
    setFilterData(result);
  }, [category, subcategory, assetsType]);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <UserNav />

        <div className="section section_padding sec_bg h100vh">
          <div
            className="container mt-2"
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="action_heading">
              <div className="action_title">
                <FormContainer
                  mainTitle="Assets"
                  link="/sim-master"
                  submitButton={false}
                />
              </div>
              <div className="action_btns">
                <button
                  type="button"
                  className={"btn btn-outline-primary btn-sm"}
                >
                  <Link to="/admin/asset-dashboard">Dashboard</Link>
                </button>

                {/* There is masters  */}

                <Link to="/asset-category-overview">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Assets Category
                  </button>
                </Link>
                <Link to="/asset/subCategory/overview">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Assets Sub Category
                  </button>
                </Link>
                <Link to="/venderOverView">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Vendor
                  </button>
                </Link>

                <button
                  type="button"
                  className={`btn ${
                    id == 1 ? "btn-primary" : "btn-outline-primary"
                  } btn-sm`}
                  onClick={() => navigate(`/sim-overview/${1}`)}
                >
                  Available
                </button>
                <button
                  type="button"
                  className={`btn ${
                    id == 2 ? "btn-primary" : "btn-outline-primary"
                  } btn-sm`}
                  onClick={() => navigate(`/sim-overview/${2}`)}
                >
                  Allocated
                </button>
                <button
                  type="button"
                  className={`btn ${
                    id == 0 ? "btn-primary" : "btn-outline-primary"
                  } btn-sm`}
                  onClick={() => navigate(`/sim-overview/${0}`)}
                >
                  All Assets
                </button>

                <Link to="/sim-allocation-overview">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Return Assets
                  </button>
                </Link>

                <Link to="/repair-request">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Repair Management
                  </button>
                </Link>
                <Link to="/sim-master">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Add Assets
                  </button>
                </Link>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body pb0 pb4">
                <div className="row thm_form">
                  <div className="form-group col-3">
                    <label className="form-label">
                      Category <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      options={[
                        { value: "", label: "All" },
                        ...categoryDataContext?.map((option) => ({
                          value: option.category_id,
                          label: option.category_name,
                        })),
                      ]}
                      value={
                        category === ""
                          ? { value: "", label: "All" }
                          : {
                              value: category,
                              label:
                                categoryDataContext?.find(
                                  (dept) => dept.category_id === category
                                )?.category_name || "Select...",
                            }
                      }
                      onChange={(selectedOption) => {
                        const selectedValue = selectedOption
                          ? selectedOption.value
                          : "";
                        setCategory(selectedValue);
                        if (selectedValue === "") {
                          getData();
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="form-group col-3">
                    <label className="form-label">
                      Sub Category <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={[
                        { value: "", label: "All" },
                        ...subcategoryData?.map((option) => ({
                          value: option.sub_category_id,
                          label: `${option.sub_category_name}`,
                        })),
                      ]}
                      value={
                        subcategory === ""
                          ? { value: "", label: "All" }
                          : {
                              value: subcategory,
                              label:
                                subcategoryData?.find(
                                  (sub) => sub.sub_category_id === subcategory
                                )?.sub_category_name || "Select...",
                            }
                      }
                      onChange={(select) => {
                        const selectsub = select ? select.value : "";
                        setSubCategory(selectsub);
                        if (selectsub === "") {
                          getData();
                        }
                      }}
                      required
                    />
                  </div>
                  <div className="form-group col-3">
                    <label className="form-label">
                      Assets Type<sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      value={AsstestTypeOptions?.find(
                        (option) => option.value === assetsType
                      )}
                      onChange={(selectedOption) => {
                        setAssetsType(selectedOption.value);
                      }}
                      options={AsstestTypeOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="page_height">
              <div className="card">
                <div className="card-header sb p-4">
                  <h5>Assets Overview</h5>
                  <div className="pack">
                    <input
                      type="text"
                      placeholder="Search here"
                      className="w-50 form-control "
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* <button
                          className="btn btn-outline-success ml-2 btn-sm"
                          onClick={handleExport}
                        >
                          Export TO Excel
                        </button> */}
                    <button
                      className="btn btn-primary ml-2"
                      onClick={() => AllAssetExcel(filterdata)}
                    >
                      Export Excel
                    </button>
                  </div>
                </div>
                <div className="card-body body-padding">
                  <DataTable
                    // title="Assets Overview"
                    columns={columns}
                    data={filterdata}
                    // fixedHeader
                    pagination
                    // fixedHeaderScrollHeight="64vh"
                    exportToCSV
                    highlightOnHover
                  />
                </div>
                <div className="data_tbl table-responsive"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Start */}

      <div
        className={`modal fade ${isTransferModal ? "show" : ""}`}
        id="sidebar-right"
        tabIndex={-1}
        role="dialog"
        style={{ display: isTransferModal ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Transfer
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={() => closeTransferModal()}>
                  ×
                </span>
              </button>
            </div>

            {/* Modal here----------------------- */}

            <div className="modal-body">
              <form className="modal_formdata">
                <div className="modal_formbx">
                  <ul>
                    <li>
                      <span>Asset Name : </span>
                      {modalData?.assetsName}
                    </li>
                    <li>
                      <span>Registered To : </span>
                      {modalData?.register}
                    </li>
                    <li>
                      <span>Status : </span>
                      {modalData?.status}
                    </li>
                    <li>
                      <span>Allocated To : </span>
                      {particularUserName}
                    </li>
                    <li>
                      <span>Sim Type : </span>
                      {modalData?.s_type}
                    </li>
                  </ul>
                </div>
                {/* <div className="modal_formbx row thm_form">
                  <FieldContainer
                    label="Allocate TO"
                    fieldGrid={12}
                    Tag="select"
                    value={selectedUserTransfer}
                    onChange={(e) => setSelectedUserTransfer(e.target.value)}
                  >
                    <option value="">Please Select</option>
                    {userData.map((data) => (
                      <option value={data.user_id} key={data.user_id}>
                        {data.user_name}
                      </option>
                    ))}
                  </FieldContainer>
                </div> */}
                <div className="modal_formbx row thm_form">
                  <div className="form-group col-12">
                    <label className="form-label">
                      Allocate To <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={userData?.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: selectedUserTransfer,
                        label:
                          userData?.find(
                            (user) => user.user_id == selectedUserTransfer
                          )?.user_name || "",
                      }}
                      onChange={(e) => {
                        setSelectedUserTransfer(e.value);
                      }}
                      required
                    />
                  </div>
                </div>
                {modalSelectedUserData?.length > 0 && (
                  <div className="modal_formbx">
                    <ul>
                      <li>
                        <span>Department : </span>
                        {modalSelectedUserData[0]?.department_name}
                      </li>
                      <li>
                        <span>Designation : </span>
                        {modalSelectedUserData[0]?.designation_name}
                      </li>
                    </ul>
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                // data-dismiss="modal"
                onClick={() => closeTransferModal()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleTransfer}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal fade ${isModalOpen ? "show" : ""}`}
        id="sidebar-right"
        tabIndex={-1}
        role="dialog"
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="AllocationModal">
                Allocation
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true" onClick={() => closeModal()}>
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <form className="modal_formdata">
                <div className="modal_formbx">
                  <ul>
                    <li>
                      <span>Asset Name : </span>
                      {modalData?.assetsName}
                    </li>
                    <li>
                      <span>Asset ID: </span>
                      {modalData?.asset_id}
                    </li>
                    <li>
                      <span>Status: </span>
                      {modalData?.status}
                    </li>
                  </ul>
                </div>
                <div className="modal_formbx row thm_form">
                  <div className="form-group col-12">
                    <label className="form-label">
                      Allocate To <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={userData?.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: selectedUserTransfer,
                        label:
                          userData?.find(
                            (user) => user.user_id == selectedUserTransfer
                          )?.user_name || "",
                      }}
                      onChange={(e) => {
                        setSelectedUserTransfer(e.value);
                      }}
                      required
                    />
                  </div>
                </div>

                {modalSelectedUserData?.length > 0 && (
                  <div className="modal_formbx">
                    <ul>
                      <li>
                        <span>Department : </span>
                        {modalSelectedUserData[0]?.department_name}
                      </li>
                      <li>
                        <span>Designation : </span>
                        {modalSelectedUserData[0]?.designation_name}
                      </li>
                    </ul>
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                // data-dismiss="modal"
                onClick={() => closeModal()}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSimAllocation}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={ImageModalOpen}
        onRequestClose={handleCloseImageModal}
        style={{
          content: {
            width: "80%",
            height: "80%",
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
            <h2>Assets Images</h2>

            <button
              className="btn btn-success float-left"
              onClick={handleCloseImageModal}
            >
              X
            </button>
          </div>
        </div>

        {showAssetsImage?.length > 0 && (
          <>
            <h2>Type : {showAssetsImage[0]?.type}</h2>
            <div className="summary_cards flex-row row">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img1_url}
                          download
                          target="blank"
                        >
                          <img
                            src={showAssetsImage[0]?.img1_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img2_url}
                          download
                          target="blank"
                        >
                          <img
                            src={showAssetsImage[0]?.img2_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img3_url}
                          download
                          target="blank"
                        >
                          <img
                            src={showAssetsImage[0]?.img3_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
                <div className="summary_card">
                  <div className="summary_cardtitle"></div>
                  <div className="summary_cardbody">
                    <div className="summary_cardrow flex-column">
                      <div className="summary_box text-center ml-auto mr-auto"></div>
                      <div className="summary_box col">
                        <a
                          style={{ cursor: "pointer" }}
                          href={showAssetsImage[0]?.img4_url}
                          download
                          target="blank"
                        >
                          <img
                            src={showAssetsImage[0]?.img4_url}
                            width="80px"
                            height="80px"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* There is Vendor Send Modal  */}
      <AssetSendToVendorReusable
        getData={getData}
        isModalOpenSend={vendorModalOpen}
        onClose={handleSendToVendorModalClose}
        rowData={currentRow}
      />
      <ScrapReusable
        getData={getData}
        isModalOpenSend={scrapModalOpen}
        onClose={handleScrapModalClose}
        rowData={currentRow}
      />

      <ReciveToVendorReusable
        getData={getData}
        isModalOpenSend={reciveVendorModalOpen}
        onClose={handleReciveVednorModalClose}
        rowData={currentRow}
      />

      {/* //There is Stole Modal Start  */}
      <Modal
        isOpen={stolenModalOpen}
        onRequestClose={handleStolenModalClose}
        style={{
          content: {
            width: "30%",
            height: "40%",
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
            <h3>Stolen Detials</h3>
            <div className="d-flex">
              <button
                className="btn btn-danger"
                onClick={handleStolenModalClose}
              >
                X
              </button>
            </div>
          </div>
          <div>
            <FieldContainer
              label="Sotlen Date"
              type="date"
              value={stolenDate}
              onChange={(e) => setStolenDate(e.target.value)}
              fieldGrid={12}
            />
            <FieldContainer
              label="Stolen Remark"
              Tag="textarea"
              value={stolenRemark}
              onChange={(e) => setStolenRemark(e.target.value)}
              fieldGrid={12}
            />
          </div>
          <button className="btn btn-success ml-3" onClick={handleSubmitStolen}>
            Submit
          </button>
        </div>
      </Modal>

      {/* //There is Lost Asset Modal Start  */}
      <Modal
        isOpen={lostModalOpen}
        onRequestClose={handleLostModalClose}
        style={{
          content: {
            width: "30%",
            height: "40%",
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
            <h3>Lost Asset Detials</h3>
            <div className="d-flex">
              <button className="btn btn-danger" onClick={handleLostModalClose}>
                X
              </button>
            </div>
          </div>
          <div>
            <FieldContainer
              label="Lost Asset Date"
              type="date"
              value={lostAssetDate}
              onChange={(e) => setLostAssetDate(e.target.value)}
              fieldGrid={12}
            />
            <FieldContainer
              label="Lost Asset Remark"
              Tag="textarea"
              value={lostAssetRemark}
              onChange={(e) => setLostAssetRemark(e.target.value)}
              fieldGrid={12}
            />
          </div>
          <button
            className="btn btn-success ml-3"
            onClick={handleSubmitLostAsset}
          >
            Submit
          </button>
        </div>
      </Modal>
    </>
  );
};
export default SimOverview;
