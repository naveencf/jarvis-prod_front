import React, { useState } from "react";
import View from "../../Sales/Account/View/View";
import CustomTable from "../../../CustomTable/CustomTable";
import jwtDecode from "jwt-decode";
import { useGetAllPageListQuery } from "../../../Store/PageBaseURL";
import SkeletonLoader from "../../../CustomTable/TableComponent/SkeletonLoader";

function PageOverviewWithoutHealth({ columns }) {
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [pagequery,setpagequery] = useState("page_name=sar")

  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID ,pagequery});

  return (
    <div className="card">
      <div className="card-body p0">
        <div className="data_tbl thm_table table-responsive">
        {!pageList ? <SkeletonLoader/>:
          <CustomTable
            columns={columns}
            data={pageList}
            isLoading={false}
            // title={"Page Overview"}
            Pagination={[100, 200, 1000]}
            rowSelectable={true}
            tableName={"PageOverview_without_health"}
          />}
        </div>
      </div>
    </div>
  );
}

export default PageOverviewWithoutHealth;
