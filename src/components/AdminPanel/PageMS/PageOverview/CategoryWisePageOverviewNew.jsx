import React, { useEffect, useMemo, useState } from "react";
import { Box, Modal } from "@mui/material";
import jwtDecode from "jwt-decode";
import Loader from "../../../Finance/Loader/Loader";
import View from "../../Sales/Account/View/View";
import {
  useGetAllPageListQuery,
  useGetAllCategoryWiseInventoryQuery,
} from "../../../Store/PageBaseURL";
import { formatNumber } from "../../../../utils/formatNumber";
import formatString from "../../../../utils/formatString";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetPmsPlatformQuery } from "../../../Store/reduxBaseURL";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 850,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CategoryWisePageOverviewNew = ({
  dataTable,
  platformName,
  setPlanFormName,
  showExport
}) => {
  const [viewState, setViewState] = useState("main"); // State for controlling views
  const [pagequery, setPagequery] = useState("");
  const [activeSectionCat, setActiveSectionCat] = useState(null);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [activeTab, setActiveTab]= useState()
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data || [];
  const itemsPerPage = 5;
  const visiblePlatforms = platformData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID, pagequery });
  const { data: categoryWiseData } =
    useGetAllCategoryWiseInventoryQuery(platformName);

  useEffect(() => {
    if (pageList?.length > 0) {
      setRecordsLoading(false);
    }
  }, [pageList]);

  const handleClickCatData = (key, val) => {
    setPagequery(`platform_name=${platformName}&${key}=${val}`);
    setActiveSectionCat(key);
    setRecordsLoading(true);
    setViewState("subCategory"); // Switch to sub-category view
    handleClose();
  };

  const handleSubCategory = (subCategories) => {
    setSelectedSubCategories(subCategories);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleBackButton = () => {
    setViewState("main"); // Go back to the main page
  };
  const handleTabClick = (tab) => {
    setActiveTab(tab.platform_name);
    localStorage.setItem("activeTab", tab.platform_name);
    setPlanFormName(tab.platform_name);
  };
  const handleNext = () => {
    if (startIndex + itemsPerPage < platformData.length) {
      setStartIndex((prev) => prev + 4);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 4);
    }
  };
  const dataGridcolumns = [
    {
      key: "S.NO",
      name: "S.no",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "_id",
      name: "Category",
      width: 200,
      renderRowCell: (row) => <b>{formatString(row._id) || "NA"}</b>,
    },
    {
      key: "Follower Count",
      name: "Follower Count",
      width: 200,
      renderRowCell: (row) => (
        <div>{formatNumber(row.totalFollowersCount)}</div>
      ),
    },

    {
      key: "Page Count",
      name: "Page Count",
      width: 200,
      renderRowCell: (row) => (
        <button
          title="View Pages"
          onClick={() => handleClickCatData("page_category_name", row._id)}
          className="btn btn-outline-primary btn-sm user-button"
        >
          {row.totalPageCount}
        </button>
      ),
    },
    {
      key: "Vendor Count",
      name: "Vendor Count",
      width: 200,
      renderRowCell: (row) => <div>{row.uniqueVendorCount}</div>,
    },
    {
      key: "Post Price",
      name: "Post Price",
      width: 200,
      renderRowCell: (row) => <div>{row.totalInstagramPostPrice}</div>,
    },
    {
      key: "Story Price",
      name: "Story Price",
      width: 200,
      renderRowCell: (row) => <div>{row.totalInstagramStoryPrice}</div>,
    },
    {
      key: "Both Price",
      name: "Both Price",
      width: 200,
      renderRowCell: (row) => <div>{row.totalInstagramBothPrice}</div>,
    },
    {
      key: "page_status",
      name: "Page Status",
      renderRowCell: (row) => {
        return formatString(row.page_status)
      }

    },
    {
      key: "Sub Category",
      name: "Sub Category Count",
      width: 200,
      renderRowCell: (row) => (
        <button
          title="View Subcategories"
          onClick={() => handleSubCategory(row.subCategories)}
          className="btn cmnbtn btn_sm btn-outline-primary"
        >
          {row.subCategories.length}
        </button>
      ),
    },
  ];
 
// const categoryCount  = categoryWiseData
const totalPageCount = useMemo(() => {
  return categoryWiseData?.reduce(
    (acc, item) => acc + (Number(item?.totalPageCount) || 0),
    0
  );
}, [categoryWiseData]);
 console.log("totalPageCount", totalPageCount);
  return (
    <div className="card">
      <div className="card-body p0">
      <div className="tabs-container tabslide">
              <div className="navigation">
                {/* Left Arrow */}
                {/* {startIndex > 0 && ( */}
                <button
                  className="prev-arrow arrow-btn btn"
                  onClick={handlePrevious}
                >
                  <i className="bi bi-chevron-left"></i>
                  {/* Left Arrow */}
                </button>
                {/* )} */}

                {/* Dynamic Tabs */}
                <div className="tabs">
                  {visiblePlatforms.map((platform, index) => (
                    <button
                      key={platform._id}
                      className={
                        activeTab === platform.platform_name.toLowerCase()
                          ? "active btn btn-primary"
                          : "btn"
                      }
                      onClick={() => handleTabClick(platform)}
                    >
                      {platform.platform_name.charAt(0).toUpperCase() +
                        platform.platform_name.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Right Arrow */}
                {/* {startIndex + itemsPerPage < platformData.length && ( */}
                <button
                  className="next-arrow arrow-btn btn"
                  onClick={handleNext}
                >
                  <i className="bi bi-chevron-right"></i> {/* Right Arrow */}
                </button>
                {/* )} */}
              </div>
            </div>
        {viewState === "main" ? (
          <div className="data_tbl thm_table table-responsive">
            <View
              columns={dataGridcolumns}
              data={categoryWiseData}
              isLoading={false}
              title={"Category Wise Overview"}
              rowSelectable={true}
              pagination={[100, 200, 1000]}
              tableName={"Page Overview"}
              addHtml={
                <div className="d-flex sb w-10">
                  <br />
                  <p>
                    | Current Platform{" "}
                    <strong>{formatString(platformName)}</strong>
                  </p>
                  <p>| Total Page Count <strong>{totalPageCount}</strong></p>
                </div>
              }
              showExport={showExport}
            />
          </div>
        ) : (
          <>
            <button
              className="btn cmnbtn btn_sm btn-outline-secondary m-1"
              onClick={handleBackButton}
            >
              <ArrowBackIcon /> Category Overview
            </button>
            {!recordsLoading ? (
              <View
                columns={dataTable}
                data={pageList}
                isLoading={false}
                pagination={[100, 200, 1000]}
                tableName={"Sub Category Wise Overview"}
                showExport={showExport}
              />
            ) : (
              <Loader />
            )}
          </>
        )}
      </div>
     
      {/* Modal for displaying subcategories */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            ...style,
            maxHeight: "80vh", // Limit the height of the modal
            overflowY: "auto", // Enable vertical scrolling
            overflowX: "hidden", // Prevent horizontal scrolling
          }}
        >
          <button
            className="btn cmnbtn btn_sm btn-primary "
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "0px",
              right: "10px",
              margin: "5px",
            }}
          >
            X
          </button>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">S.N.</th>
                <th scope="col">Sub Category</th>
                <th scope="col">Total Follower</th>
                <th scope="col">Vendor Count</th>
                <th scope="col">Page Count</th>
                <th scope="col">Post Price</th>
                <th scope="col">Story Price</th>
                <th scope="col">Both Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedSubCategories.length > 0 &&
                selectedSubCategories.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <button
                        className="btn cmnbtn btn_sm btn-outline-primary"
                        onClick={() =>
                          handleClickCatData(
                            "page_sub_category_name",
                            item.page_sub_category_name
                          )
                        }
                      >
                        {formatString(item.page_sub_category_name)}
                      </button>
                    </td>
                    <td>{formatNumber(item.totalFollowersCount)}</td>
                    <td>{item.uniqueVendorCount}</td>
                    <td>{item.pageCount}</td>
                    <td>{item.totalInstagramPostPrice}</td>
                    <td>{item.totalInstagramStoryPrice}</td>
                    <td>{item.totalInstagramBothPrice}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      </Modal>
    </div>
  );
};

export default CategoryWisePageOverviewNew;
