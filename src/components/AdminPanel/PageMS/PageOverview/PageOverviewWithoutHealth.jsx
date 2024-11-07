import React, { useState } from "react";
import View from "../../Sales/Account/View/View";
import CustomTable from "../../../CustomTable/CustomTable";
import jwtDecode from "jwt-decode";
import {
  useGetAllPageCategoryQuery,
  useGetAllPageListQuery,
  useGetAllPageSubCategoryQuery,
  useGetAllProfileListQuery,
} from "../../../Store/PageBaseURL";
import SkeletonLoader from "../../../CustomTable/TableComponent/SkeletonLoader";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../../Store/reduxBaseURL";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import PageOverviewHeader from "./PageOverviewHeader";
import { useEffect } from "react";


function PageOverviewWithoutHealth({ columns, pagequery, setPagequery, categoryFilter, setCategoryFilter,
  activenessFilter, setActivenessFilter, filterFollowers, setFilterFollowers }) {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  // const [pagequery, setPagequery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: pageList,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
  } = useGetAllPageListQuery({ decodedToken, userID, pagequery });
  const {
    data: vendorData,
    isLoading: loading,
    refetch: refetchVendor,
  } = useGetAllVendorQuery();
  const { data: platform } = useGetPmsPlatformQuery();
  const platformData = platform?.data || [];
  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];
  const { data: subCategory } = useGetAllPageSubCategoryQuery();
  const subCategoryData = subCategory?.data || [];
  const { data: profileData } = useGetAllProfileListQuery();


  const handlemigration = async () => {
    let tempplatform_id = "";
    let pricelist = [];
    let multiplepricelist = [];
    for (let i = 0; i < pageList.length; i++) {
      const row = pageList[i];
      // console.log(row?.page_category_name);
      if (!row?.page_category_name) {

        if (tempplatform_id != row?.platform_id) {
          tempplatform_id = row?.platform_id;
          await axios
            .get(baseUrl + `v1/pagePriceTypesForPlatformId/${row?.platform_id}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              pricelist = res?.data?.data;
              // console.log(res?.data?.data, "pricelist");
            });
        }

        await axios
          .get(baseUrl + `v1/pagePriceMultipleByPageId/${row?._id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // console.log(res,"resres")
            if (res?.data?.success) {
              multiplepricelist = res?.data?.data;
              // console.log(res?.data, "multiple price");
            } else {
              multiplepricelist = [];
            }
          });

        const temmcategoryName = categoryData
          ?.find((role) => role._id === row?.page_category_id)
          ?.page_category?.toLowerCase();
        const payload = {
          //   platform_id: platformId,
          platform_name: platformData
            ?.find((res) => res._id == row?.platform_id)
            ?.platform_name?.toLowerCase(),
          //   page_category_id: categoryId,
          page_category_name: temmcategoryName,
          //   page_sub_category_id: subCategoryId,
          page_sub_category_name: subCategoryData.find(
            (role) => role._id === row?.page_sub_category_id
          )?.page_sub_category,
          //   tags_page_category: tag?.map((e) => e?.value),
          tags_page_category_name: [temmcategoryName], //send name of category

          vendor_id: row?.vendor_id,
          vendor_name: vendorData
            ?.find((vendor) => vendor._id === row?.vendor_id)
            ?.vendor_name?.toLowerCase(),

          //   page_profile_type_id: profileId,
          page_profile_type_name: profileData?.data
            ?.find((role) => role?._id === row?.page_profile_type_id)
            ?.profile_type?.toLowerCase(),

          //   page_language_id: languageId.map((item) => item?.value),
          page_language_name: ["Hindi"],

          page_price_list: multiplepricelist.map((item) => {
            return {
              [pricelist?.find(
                (priceobject) => priceobject?._id == item.page_price_type_id
              )?.name]: item.price,
            };
          }),
        };
        console.log(payload, "payload", row.page_name);
        // return
        // if (i == 2) {
        //   break;
        // }
        if (row?._id) {
          await axios
            .put(`${baseUrl}v1/pageMaster/${row?._id}`, payload, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              console.log(res.data.data);
            })
            .catch((error) => {
              console.log(error.response.data.message);
            });
        }
      } else {
        console.log("updated")
      }
    }
  };


  const handleFilterChange = (newQuery) => {
    setPagequery(newQuery);
    console.log("refetched");
    setIsLoading(true);
  };
  // Set loading to false once data is fetched
  useEffect(() => {
    if (pageList) {
      setIsLoading(false);
    }
  }, [pageList]);

  return (
    <div className="card">
      <PageOverviewHeader onFilterChange={handleFilterChange} pagequery={pagequery} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        activenessFilter={activenessFilter} setActivenessFilter={setActivenessFilter} filterFollowers={filterFollowers} setFilterFollowers={setFilterFollowers} />
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
              Pagination={[100, 200, 1000]}
              rowSelectable={true}
              tableName={"PageOverview_without_health"}
            />
          )}
          {/* <button
            // type="button"
            className="btn cmnbtn btn_sm btn-outline-primary"
            onClick={handlemigration}
          >
            migration
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default PageOverviewWithoutHealth;
