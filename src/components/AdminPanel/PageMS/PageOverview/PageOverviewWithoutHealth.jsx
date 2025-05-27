import React, { useCallback, useState } from "react";
import View from "../../Sales/Account/View/View";
// import CustomTable from "../../../CustomTable/CustomTable";
import jwtDecode from "jwt-decode";
import {
  useGetAllPageListQuery,
  useGetAllPageListWithPaginationQuery,
  // useGetAllPageCategoryQuery,
  // useGetAllPageSubCategoryQuery,
  // useGetAllProfileListQuery,
} from "../../../Store/PageBaseURL";
import SkeletonLoader from "../../../CustomTable/TableComponent/SkeletonLoader";
// import {
//   useGetAllVendorQuery,
//   useGetPmsPlatformQuery,
// } from '../../../Store/reduxBaseURL';
// import axios from 'axios';
// import { baseUrl } from '../../../../utils/config';
import PageOverviewHeader from "./PageOverviewHeader";
import { useEffect } from "react";
// import CustomTableV2 from '../../../CustomTable_v2/CustomTableV2';
import { TextField } from "@mui/material";
// import SarcasmNetwork from '../SarcasmNetwork';

function PageOverviewWithoutHealth({
  setPlanFormName,
  columns,
  pagequery,
  setPagequery,
  categoryFilter,
  setCategoryFilter,
  activenessFilter,
  setActivenessFilter,
  filterFollowers,
  setFilterFollowers,
  latestPageObject,
  showExport
}) {
  const token = sessionStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  // const [pagequery, setPagequery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const {
    data: pages,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
    isFetching: ispageListFetching,
  } = useGetAllPageListWithPaginationQuery({
    decodedToken,
    userID,
    page,
    limit,
    search,
    pagequery,
  });
  const pageList = pages?.pages;
  const pagination = pages?.pagination;
  function debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };
  // const {
  //   data: vendorData,
  //   isLoading: loading,
  //   refetch: refetchVendor,
  // } = useGetAllVendorQuery();
  // const { data: platform } = useGetPmsPlatformQuery();
  // const platformData = platform?.data || [];
  // const { data: category } = useGetAllPageCategoryQuery();
  // const categoryData = category?.data || [];
  // const { data: subCategory } = useGetAllPageSubCategoryQuery();
  // const subCategoryData = subCategory?.data || [];
  // const { data: profileData } = useGetAllProfileListQuery();

  const handleFilterChange = (newQuery) => {
    setPagequery(newQuery);
    setIsLoading(true);
  };
  // Set loading to false once data is fetched
  useEffect(() => {
    if (pageList) {
      setIsLoading(false);
    }
  }, [pageList]);
  useEffect(() => {
    if (latestPageObject.page_name !== "") {
      refetchPageList();
    }
  }, [latestPageObject]);
  // console.log("pageList", pageList);
  // console.log("pagination", pagination);
  // console.log("isPageListLoading", isPageListLoading);
  // console.log("ispageListFetching", ispageListFetching);
  // console.log("isLoadinf", isLoading);
  return (
    <div className="card">
      <PageOverviewHeader
        setPlanFormName={setPlanFormName}
        setPage={setPage}
        selectedData={selectedData}
        setSelectedData={setSelectedData}
        onFilterChange={handleFilterChange}
        pagequery={pagequery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        activenessFilter={activenessFilter}
        setActivenessFilter={setActivenessFilter}
        filterFollowers={filterFollowers}
        setFilterFollowers={setFilterFollowers}
        activeTabName={setActiveTab}
        showExport={showExport}
      />
      {/* <div className="tabs">
        <button className={activeTab === 'Tab0' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab0')}>
          Instagram
        </button>
        <button className={activeTab === 'Tab5' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab5')}>
          Facebook
        </button>
        <button className={activeTab === 'Tab3' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab3')}>
          Twitter
        </button>
        <button className={activeTab === 'Tab4' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab4')}>
          Youtube
        </button>

        <button className={activeTab === 'Tab1' ? 'active btn btn-primary' : 'btn'} onClick={() => setActiveTab('Tab1')}>
          Snapchat
        </button>
      </div> */}
      <div className="card-body p0">
        <div className="data_tbl thm_table table-responsive">
          {
            // isLoading ? (
            //   <SkeletonLoader />
            // ) :
            <View
              version={1}
              columns={columns}
              data={pageList}
              // isLoading={false}
              isLoading={isPageListLoading || ispageListFetching || isLoading}
              cloudPagination={true}
              title="Page Overview"
              rowSelectable={true}
              pagination={[10]}
              tableName="Page Overview"
              selectedData={setSelectedData}
              pageNavigator={{
                prev: {
                  disabled: page === 1,
                  onClick: () => setPage((prev) => Math.max(prev - 1, 1)),
                },
                next: {
                  disabled: pagination?.current_page >= pagination?.total_page,
                  onClick: () => setPage((prev) => prev + 1),
                },
                totalRows: pagination?.total_records || 0,
                currentPage: pagination?.current_page,
              }}
              addHtml={
                <>
                  <TextField
                    label="Search Page"
                    variant="outlined"
                    size="small"
                    value={inputValue}
                    onChange={handleSearchChange}
                  />
                </>
              }
              showExport={showExport}
            />
          }
          {/* <button
            // type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"
            onClick={handlemigration}
          >
            migration
          </button> */}
          {/* <SarcasmNetwork selectedData={selectedData}/> */}
        </div>
      </div>
    </div>
  );
}

export default PageOverviewWithoutHealth;
