import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import { Link } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Grid, Skeleton } from "@mui/material";
import DataTable from "react-data-table-component";
import View from "../Sales/Account/View/View";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import {
  setRowData,
  setShowBankDetailsModal,
  setShowWhatsappModal,
} from "../../Store/PageOverview";
import { useDispatch } from "react-redux";
import VendorWhatsappLinkModla from "./VendorWhatsappLinkModla";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import VendorPageModal from "./VendorPageModal";
import {
  useGetAllVendorQuery,
  useGetAllVendorTypeQuery,
  useGetPmsPayCycleQuery,
  useGetPmsPaymentMethodQuery,
  useGetPmsPlatformQuery,
} from "../../Store/reduxBaseURL";
import VendorBankDetailModal from "./VendorBankDetailModal";
import VendorDetails from "./Vendor/VendorDetails";
import { useGetAllPageListQuery } from "../../Store/PageBaseURL";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import formatString from "../Operation/CampaignMaster/WordCapital";

const VendorOverview = () => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const dispatch = useDispatch();
  const [contextData, setContextData] = useState(false);

  const userID = decodedToken.id;
  const { data: vendor } = useGetAllVendorTypeQuery();
  const typeData = vendor?.data;
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data;

  const { data: cycle } = useGetPmsPayCycleQuery();
  const cycleData = cycle?.data;

  const { data: payData } = useGetPmsPaymentMethodQuery();
  const {
    data: vendorData,
    isLoading: loading,
    refetch: refetchVendor,
  } = useGetAllVendorQuery();
  let vendorTypes = vendorData?.data;
  const [filterData, setFilterData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const token = sessionStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("Tab1");
  const [tabFilterData, setTabFilterData] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [platformCounts, setPlatformCounts] = useState([]);

  const { data: pageList } = useGetAllPageListQuery();

  const getData = () => {
    refetchVendor();
  };

  useEffect(() => {
    // if (showPageHealthColumn) {
    //   dispatch(setShowPageHealthColumn(false));
    // }
    if (userID && !contextData) {
      axios
        .get(`${baseUrl}get_single_user_auth_detail/${userID}`)
        .then((res) => {
          if (res.data[57].view_value === 1) {
            setContextData(true);
          }
        });
    }

    getData();
  }, []);

  useEffect(() => {
    // console.log(vendorData?.data);
    if (vendorData) {
      setFilterData(vendorData?.data);
      setTabFilterData(vendorData?.data);
    }
  }, [vendorData]);

  const handleOpenWhatsappModal = (row) => {
    return () => {
      dispatch(setShowWhatsappModal());
      dispatch(setRowData(row));
    };
  };

  const handleOpenBankDetailsModal = (row) => {
    return () => {
      dispatch(setShowBankDetailsModal());
      dispatch(setRowData(row));
    };
  };

  const handleClickVendorName = (params) => {
    // setVendorDetails(params.row);
    setVendorDetails(params);
  };

  const showPagesOfVendor = async (data) => {
    const result = await axios
      .get(`${baseUrl}v1/vendor_wise_page_master_data/${data._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setPageData(res.data.data);
      });
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
      sortable: true,
    },
    {
      name: "Page Name",
      selector: (row) => (
        <a href={row.page_link} target="blank">
          {row.page_name}
        </a>
      ),
      width: "30%",
      sortable: true,
    },
    {
      name: "followers",
      selector: (row) => row.followers_count,
      width: "20%",
    },
    {
      name: "Ownership Type",
      selector: (row) => row.ownership_type,
      width: "20%",
    },
  ];

  const dataGridcolumns = [
    {
      key: "sno",
      name: "S.NO",
      width: 80,
      renderRowCell: (row, index) => {
        return index + 1;
      },
    },
    {
      key: "vendorPercentage",
      name: "Vendor %",
      width: 150,
      renderRowCell: (row) => {
        const fields = [
          "vendor_name",
          "email",
          "mobile",
          "home_address",
          "payment_method",
          "Pincode",
        ];
        const totalFields = fields.length;
        let filledFields = 0;

        fields.forEach((field) => {
          if (row[field] && row[field] !== 0) {
            filledFields++;
          }
        });

        const percentage = (filledFields / totalFields) * 100;

        if (percentage === 100) {
          return "Full";
        } else if (percentage > 50) {
          return "More than Partial";
        } else {
          return "Less than Partial";
        }
      },
    },
    {
      key: "vendor_name",
      name: "Vendor Name",
      width: 200,
      // editable: true,
      renderRowCell: (row) => {
        return (
          <div
            onClick={() => handleClickVendorName(row)}
            className="link-primary cursor-pointer text-truncate"
          >
            {formatString(row.vendor_name)}
          </div>
        );
      },
    },
    {
      key: "vendor_category",
      name: "Vendor Category",
      width: 150,
    },
    {
      key: "primary_page",
      name: "Primary Page",
      width: 200,
      renderRowCell: (row) => {
        let name = pageList?.data?.find(
          (ele) => ele._id === row.primary_page
        )?.page_name;
        return name ?? "NA";
      },
    },
    {
      key: "page_count",
      name: "Page Count",
      renderRowCell: (row) => {
        return (
          <button
            title="Bank Details"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={() => showPagesOfVendor(row)}
            data-toggle="modal"
            data-target="#myModal"
          >
            {row.page_count}
            {/* <OpenWithIcon /> */}
          </button>
        );
      },
    },
    {
      key: "mobile",
      name: "Mobile",
      width: 200,
      editable: true,
    },
    {
      key: "email",
      name: "Email",
      width: 200,
      editable: true,
    },
    {
      key: "Pincode",
      name: "Home Pincode",
      width: 200,
      editable: true,
    },
    {
      key: "home_city",
      name: "Home City",
      width: 200,
      editable: true,
    },
    {
      key: "home_state",
      name: "Home State",
      width: 200,
      editable: true,
    },
    {
      key: "home_address",
      name: "Home Address",
      width: 200,
      editable: true,
    },
    {
      key: "vendor_type",
      name: "Vendor Type",
      renderRowCell: (row) => {
        return typeData?.find((item) => item?._id == row?.vendor_type)
          ?.type_name;
      },
      width: 200,
      editable: true,
    },
    {
      key: "vendor_platform",
      name: "Platform",
      renderRowCell: (row) => {
        return platformData?.find((item) => item?._id == row?.vendor_platform)
          ?.platform_name;
      },
      width: 200,
      editable: true,
    },
    {
      key: "pay_cycle",
      name: "Cycle",
      width: 200,
      renderRowCell: (row) => {
        return cycleData?.find((item) => item?._id == row?.pay_cycle)
          ?.cycle_name;
      },
      // renderRowCell: (params) => {
      //   let name = cycleData?.find(
      //     (item) => item?._id == params.row?.pay_cycle
      //   )?.cycle_name;
      //   return <div>{name}</div>;
      // },
      editable: true,
    },
    {
      key: "Bank Details",
      name: "Bank Details",
      width: 200,
      renderRowCell: (row) => {
        return (
          <button
            title="Bank Details"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={handleOpenBankDetailsModal(row)}
          >
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      key: "whatsapp_link",
      name: "Whatsapp Link",
      width: 200,
      renderRowCell: (row) => {
        return (
          <button
            title="Whatsapp Link"
            className="btn btn-outline-primary btn-sm user-button"
            onClick={handleOpenWhatsappModal(row)}
          >
            <OpenWithIcon />
          </button>
        );
      },
    },
    {
      key: "action",
      name: "Action",
      width: 200,
      renderRowCell: (row) => (
        <>
          {contextData && (
            <Link to={`/admin/pms-vendor-master/${row._id}`}>
              <button
                title="Edit"
                className="btn btn-outline-primary btn-sm user-button"
              >
                <FaEdit />{" "}
              </button>
            </Link>
          )}
          {decodedToken.role_id == 1 && (
            <DeleteButton endpoint="v1/vendor" id={row._id} getData={getData} />
          )}
        </>
      ),
    },
    // {
    //   field: "alternate_mobile",
    //   headerName: "Alternate Mobile",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "gst_no",
    //   headerName: "GST No",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "threshold_limit",
    //   headerName: "Threshold Limit",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "country_code",
    //   headerName: "Country Code",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_pincode",
    //   headerName: "Company Pincode",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_address",
    //   headerName: "Company Address",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_name",
    //   headerName: "Company Name",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_state",
    //   headerName: "Company State",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "company_city",
    //   headerName: "Company City",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "pan_no",
    //   headerName: "Pan No",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "personal_address",
    //   headerName: "Personal Address",
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   field: "payment_method",
    //   headerName: "Payment Method",
    //   width: 200,
    //   renderRowCell: (params) => {
    //     let name = payData?.find(
    //       (item) => item?._id == params.row?.payment_method
    //     )?.payMethod_name;
    //     console.log(params.row.payment_method, "payment_method")
    //     return <div>{name}</div>;
    //   },
    //   editable: true,
    // },
  ];

  // for category statistics
  useEffect(() => {
    const countVendorCategories = (tabFilterData) => {
      const counts = {};
      tabFilterData.forEach((item) => {
        const category = item.vendor_category;
        counts[category] = (counts[category] || 0) + 1;
      });
      return counts;
    };

    const counts = countVendorCategories(tabFilterData);
    setCategoryCounts(counts);
  }, [tabFilterData]);

  // for platform statistics
  useEffect(() => {
    const platformCountsMap = {};
    for (const vendor of tabFilterData) {
      const platformId = vendor.vendor_platform;
      const platform = platformData.find((item) => item._id === platformId);
      if (platform) {
        const platformName = platform.platform_name;
        if (platformCountsMap[platformId]) {
          platformCountsMap[platformId].count++;
        } else {
          platformCountsMap[platformId] = {
            platform_name: platformName,
            count: 1,
          };
        }
      }
    }
    const platformCountsArray = Object.keys(platformCountsMap).map(
      (platformId) => ({
        platform_id: platformId,
        platform_name: platformCountsMap[platformId].platform_name,
        count: platformCountsMap[platformId].count,
      })
    );
    setPlatformCounts(platformCountsArray);
  }, [tabFilterData, platformData]);

  const vendorWithNoMobileNum = () => {
    const vendorwithnomobilenum = tabFilterData.filter(
      (item) => item.mobile == 0
    );
    setFilterData(vendorwithnomobilenum);
    setActiveTab("Tab1");
  };
  const vendorWithNoEmail = () => {
    const vendorwithnoemail = tabFilterData.filter((item) => item.email == "");
    setFilterData(vendorwithnoemail);
    setActiveTab("Tab1");
  };
  const vendorWithNoPages = () => {
    const vendorwithnopages = tabFilterData.filter(
      (item) => item.page_count == 0
    );
    setFilterData(vendorwithnopages);
    setActiveTab("Tab1");
  };
  const vendorWithCategories = (category) => {
    const vendorwithcategories = tabFilterData.filter(
      (item) => item.vendor_category == category
    );
    setFilterData(vendorwithcategories);
    setActiveTab("Tab1");
  };
  const vendorWithPlatforms = (platform) => {
    const vendorwithplatforms = tabFilterData.filter(
      (item) => item.vendor_platform == platform
    );
    setFilterData(vendorwithplatforms);
    setActiveTab("Tab1");
  };

  return (
    <>
      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog" style={{ maxWidth: "40%" }}>
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
              <h4 className="modal-title"></h4>
            </div>
            <div className="modal-body">
              {/* <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Page name</th>
                  <th>Ownership</th>
                  <th>Followers</th>
                </tr>
              </thead>
              <tbody>
              {pageData && pageData.map((item) => (
                <tr key={item.page_link}>
                  <td><a href={item.page_link} target="blank">{item.page_name}</a></td>
                  <td>{item.ownership_type}</td>
                  <td>{item.followers_count}</td>
                </tr>
              ))}
              </tbody>
            </table>   */}
              <DataTable
                // title="Role Overview"
                columns={columns}
                data={pageData}
                fixedHeader
                pagination
                fixedHeaderScrollHeight="62vh"
                highlightOnHover
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "Tab1" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab1")}
        >
          Overview
        </button>
        <button
          className={activeTab === "Tab2" ? "active btn btn-primary" : "btn"}
          onClick={() => setActiveTab("Tab2")}
        >
          Statistics
        </button>
      </div>

      <div className="content">
        {activeTab === "Tab1" && (
          <div>
            {filterData && (
              <div className="card">
                {vendorDetails && (
                  <VendorDetails
                    vendorDetails={vendorDetails}
                    setVendorDetails={setVendorDetails}
                  />
                )}
                <VendorWhatsappLinkModla />
                <div className="card-header flexCenterBetween">
                  <h5 className="card-title">Vendor : {vendorTypes?.length}</h5>
                  <div className="flexCenter colGap8">
                    <Link
                      to={`/admin/pms-vendor-master`}
                      className="btn cmnbtn btn_sm btn-outline-primary"
                    >
                      Add Vendor <i className="fa fa-plus" />
                    </Link>
                    <Link
                      to={`/admin/pms-page-overview`}
                      className="btn cmnbtn btn_sm btn-outline-primary"
                    >
                      Page <KeyboardArrowRightIcon />
                    </Link>
                  </div>
                </div>
                {/* <VendorFilters
                filterData={filterData}
                setFilterData={setFilterData}
              /> */}
                <div className="data_tbl thm_table table-responsive card-body p0">
                  {loading ? (
                    <Box mt={2} ml={2} mb={3} sx={{ width: "95%" }}>
                      <Grid
                        container
                        spacing={{ xs: 1, md: 10 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        {Array.from(Array(5)).map((_, index) => (
                          <Grid item md={1} key={index}>
                            <Skeleton
                              sx={{
                                width: "100%",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 4, sm: 8, md: 12 }}
                      >
                        {Array.from(Array(30)).map((_, index) => (
                          <Grid item xs={2} sm={2} md={2} key={index}>
                            <Skeleton
                              animation="wave"
                              sx={{
                                width: "100%",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (
                    // <DataGrid
                    //   rows={filterData}
                    //   columns={dataGridcolumns}
                    //   pageSize={5}
                    //   rowsPerPageOptions={[5]}
                    //   disableSelectionOnClick
                    //   getRowId={(row) => row._id}
                    //   slots={{ toolbar: GridToolbar }}
                    //   slotProps={{
                    //     toolbar: {
                    //       showQuickFilter: true,
                    //     },
                    //   }}
                    // />
                    <View
                      columns={dataGridcolumns}
                      data={filterData}
                      isLoading={false}
                      title={"Vendor Overview"}
                      rowSelectable={true}
                      pagination={[100, 200, 1000]}
                      tableName={"Vendor Overview"}
                    />
                  )}
                </div>
                <VendorBankDetailModal />
                <VendorPageModal />
                <VendorWhatsappLinkModla />
              </div>
            )}
          </div>
        )}
        {activeTab === "Tab2" && (
          <div className="vendor-container">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with categories</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                      <div
                        className="card"
                        key={category}
                        onClick={() => vendorWithCategories(category)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div class="iconBadge small bgPrimaryLight m-0">
                            <span></span>
                          </div>
                          <div>
                            <h6 className="colorMedium">{category}</h6>
                            <h6 className="mt4 fs_16">{count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card" onClick={vendorWithNoPages}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div class="iconBadge small bgPrimaryLight m-0">
                      <span></span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Vendor with 0 pages</h6>
                      <h6 className="mt4 fs_16">
                        {
                          tabFilterData.filter((item) => item.page_count == 0)
                            .length
                        }
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card" onClick={vendorWithNoMobileNum}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div class="iconBadge small bgPrimaryLight m-0">
                      <span></span>
                    </div>
                    <div>
                      <h6 className="colorMedium">
                        Vendor with no mobile number
                      </h6>
                      <h6 className="mt4 fs_16">
                        {
                          tabFilterData.filter((item) => item.mobile == 0)
                            .length
                        }
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card" onClick={vendorWithNoEmail}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div class="iconBadge small bgPrimaryLight m-0">
                      <span></span>
                    </div>
                    <div>
                      <h6 className="colorMedium">Vendor with no email id</h6>
                      <h6 className="mt4 fs_16">
                        {
                          tabFilterData.filter((item) => item.email == "")
                            .length
                        }
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Vendor with platforms</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {platformCounts.map((item, index) => (
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                      <div
                        className="card"
                        key={index}
                        onClick={() => vendorWithPlatforms(item.platform_id)}
                      >
                        <div className="card-body pb20 flexCenter colGap14">
                          <div class="iconBadge small bgPrimaryLight m-0">
                            <span></span>
                          </div>
                          <div>
                            <h6 className="colorMedium">
                              {item.platform_name}
                            </h6>
                            <h6 className="mt4 fs_16">{item.count}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorOverview;
