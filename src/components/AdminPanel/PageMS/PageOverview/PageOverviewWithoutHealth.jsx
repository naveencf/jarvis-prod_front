import React, { useState } from 'react';
import View from '../../Sales/Account/View/View';
// import CustomTable from "../../../CustomTable/CustomTable";
import jwtDecode from 'jwt-decode';
import {
  useGetAllPageListQuery,
  // useGetAllPageCategoryQuery,
  // useGetAllPageSubCategoryQuery,
  // useGetAllProfileListQuery,
} from '../../../Store/PageBaseURL';
import SkeletonLoader from '../../../CustomTable/TableComponent/SkeletonLoader';
// import {
//   useGetAllVendorQuery,
//   useGetPmsPlatformQuery,
// } from '../../../Store/reduxBaseURL';
// import axios from 'axios';
// import { baseUrl } from '../../../../utils/config';
import PageOverviewHeader from './PageOverviewHeader';
import { useEffect } from 'react';
// import CustomTableV2 from '../../../CustomTable_v2/CustomTableV2';
import CustomTable from '../../../CustomTable/CustomTable';
// import SarcasmNetwork from '../SarcasmNetwork';

function PageOverviewWithoutHealth({ setPlanFormName, columns, pagequery, setPagequery, categoryFilter, setCategoryFilter, activenessFilter, setActivenessFilter, filterFollowers, setFilterFollowers, latestPageObject }) {
  const token = sessionStorage.getItem('token');
  const [activeTab, setActiveTab] = useState('Tab0');
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  // const [pagequery, setPagequery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedData, setSelectedData] = useState([]);

  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({
    decodedToken,
    userID,
    pagequery,
  });

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
    if (latestPageObject.page_name !== '') {
      refetchPageList();
    }
  }, [latestPageObject]);

  return (
    <div className="card">
      <PageOverviewHeader setPlanFormName={setPlanFormName} selectedData={selectedData} setSelectedData={setSelectedData} onFilterChange={handleFilterChange} pagequery={pagequery} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} activenessFilter={activenessFilter} setActivenessFilter={setActivenessFilter} filterFollowers={filterFollowers} setFilterFollowers={setFilterFollowers} />
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
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CustomTable
              columns={columns}
              data={pageList}
              isLoading={false}
              // title={"Page Overview"}
              selectedData={setSelectedData}
              Pagination={[100, 200, 1000]}
              rowSelectable={true}
              tableName={'PageOverview_without_health'}
            />
          )}
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
