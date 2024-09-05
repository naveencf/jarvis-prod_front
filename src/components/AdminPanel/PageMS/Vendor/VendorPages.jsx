import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { baseUrl } from "../../../../utils/config";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../../Store/reduxBaseURL";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import {
    useGetAllPageCategoryQuery,
    useGetOwnershipTypeQuery,   
  } from "../../../Store/PageBaseURL";

function VendorPages({ vendorDetails }) {
  const { data: platData } = useGetPmsPlatformQuery();
  const { data: pageCate } = useGetAllPageCategoryQuery();
  const {data:ownership}=useGetOwnershipTypeQuery();
  const token = sessionStorage.getItem("token");
  const cat = pageCate?.data;
  const platformData = platData?.data;
  const [vendorPages, setVendorPages] = useState([]);
  const [user, setUser] = useState();

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor?.data;

  useEffect(() => {
    axios
      .get(baseUrl + `v1/vendor_wise_page_master_data/${vendorDetails?._id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Adjust content type as needed
          },
      })
      .then((res) => {
        // const data = res.data.data;
        // setBankRows(data);
        setVendorPages(res.data.data);
      });
    // axios
    //   .get(baseUrl + `v1/pagePriceMultipleByPageId/${vendorDetails?._id}`)
    //   .then((res) => {
    //     // const data = res.data.data;
    //     // setBankRows(data);
    //     // setVendorPages(res.data.data);
    //   });



      axios.get(baseUrl + "get_all_users").then((res) => {
        setUser(res.data.data);

      });



  }, []);

  const dataGridcolumns = [
    {
      field: "S.NO",
      headerName: "Count",
      renderCell: (params) => <div>{vendorPages.indexOf(params.row) + 1}</div>,

      width: 80,
    },
    {
      field: "page_name",
      headerName: "User Name",
      width: 200,
      editable: true,

      renderCell: (params) => {
        let name = params.row.page_name;
        return (
          <Link target="__black" to={params.row.link} className="link-primary">
            {name}
          </Link>
        );
      },
    },
    { field: "preference_level", headerName: "Level", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      valueGetter: (params) => (params.row.status == 1 ? "Active" : "Inactive"),
    },
    { field: "ownership_type", headerName: "Ownership", width: 200,
      valueGetter:({row})=>(row.ownership_type?ownership?.find(item=>item._id==row.ownership_type)?.company_type_name:"")
     },

    {
      field: "platform_id",
      headerName: "Platform",
        renderCell: (params) => {
          let name = platformData?.find(
            (item) => item?._id == params.row.platform_id
          )?.platform_name;
          return <div>{name}</div>;
        },
      width: 200,
    },
    {
      field: "page_catg_id",
      headerName: "Category",
      width: 200,
        renderCell: (params) => {
          let name = cat?.find(
            (item) => item?._id == params.row?.page_category_id
          )?.category_name;
          return <div>{name}</div>;
        },
    },
    {
      field: "followers_count",
      headerName: "Followers",
      width: 200,
    },
    {
      field: "vendor_id",
      headerName: "Vendor",
      renderCell: (params) => {
        let name = vendorData?.find(
          (item) => item?._id == params.row?.vendor_id
        )?.vendor_name;

        return <div>{name}</div>;
      },
      width: 200,
      width: 200,
    },

    {
      field: "platform_active_on",
      headerName: "Active Platform",
      width: 200,

        valueGetter: (params) => {
          let data = platformData?.filter((item) => {
            return params.row.platform_active_on.includes(item._id);
          });
          return data?.map((item) => item.platform_name).join(", ");
        },
    },
    {
      field: "tags_page_category",
      headerName: "Tag Category",
      width: 200,
      renderCell: (params) => {
        let data = cat
          ?.filter((item) => {
            return params.row?.tags_page_category?.includes(item._id);
          })
          .map((item) => item.category_name);
        return (
          <div
            style={{
              width: "200px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {data?.map((item, i) => {
              return (
                <p
                  key={i}
                  // onClick={handleTagCategory(data)}
                  style={{ display: "inline", cursor: "pointer" }}
                >
                  {item}
                  {i !== data?.length - 1 && ","}
                </p>
              );
            })}
          </div>
        );
      },
    },
    // {
    //   field: "engagment_rate",
    //   headerName: "ER",
    //   width: 200,
    // },
    {
      field: "page_closed_by",
      headerName: "Closed By",
      width: 200,
      renderCell: (params) => {
        let name = user?.find(
          (item) => item?.user_id == params?.row?.page_closed_by
        )?.user_name;
        return <div>{name ?? "NA"}</div>;
      },
    },
    {
      field: "page_name_type",
      headerName: "Name Type",
      width: 200,
      renderCell: (params) => {
        return params.row.page_name_type != 0 ? params.row.page_name_type : "";
      },
    },
    {
      field: "content_creation",
      headerName: "Content Creation",
      renderCell: ({ row }) => {
        return row.content_creation != 0 ? row.content_creation : "";
      },
      width: 200,
    },

    { field: "rate_type", headerName: "Rate Type", width: 200 },
    // { field: "variable_type", headerName: "Variable Type", width: 200 },
    // {
    //   field: "page_price_multiple",
    //   headerName: "Price",
    //   width: 200,
    //   renderCell: ({ row }) => {
    //     return (
    //       <div>
    //         {
    //           <button
    //             title="Price"
    //             // onClick={handlePriceClick(row)}
    //             className="btn btn-outline-primary btn-sm user-button"
    //           >
    //             <PriceCheckIcon />
    //           </button>
    //         }
    //       </div>
    //     );
    //   },
    // },
    // { field: "Reel", headerName: "Reel", width: 200 },
    // { field: "Post", headerName: "Post", width: 200 },
    // { field: "Both", headerName: "Both", width: 200 },
    // {
    //   field: "Action",
    //   headerName: "Action",
    //   width: 300,
    //   renderCell: (params) => (
    //     <div className="d-flex align-center ">
    //       <DeleteButton
    //         endpoint="v1/pageMaster"
    //         id={params.row._id}
    //         getData={refetchPageList}
    //       />
    //     </div>
    //   ),
    // },
  ];

  return (
    <>
      {vendorPages && <DataGrid
        title="Page Overview"
        rows={vendorPages}
        columns={dataGridcolumns}
        // processRowUpdate={handleEditCellChange}
        // onCellEditStop={handleEditCellChange}
        // onCellEditStart={handleEditCellChange}
        // onEditCellChange={handleEditCellChange}
        //   onRowDoubleClick={(params) => {
        //     navigate(`/admin/pms-page-edit/${params.row._id}`);
        //   }}
        // onCellEditStop={(params) =>
        //   setTimeout(() => handleEditCellChange(params), 1000)
        // }

        // onPaginationModelChange={handlePageChange}
        pageSize={5}
        rowsPerPageOptions={[5]}
        // rowHeight={38}
        disableSelectionOnClick
        getRowId={(row) => row._id}
        slots={{ toolbar: GridToolbar }}
        //   slotProps={{
        //     toolbar: {
        //       showQuickFilter: true,
        //     },
        //   }}
        checkboxSelection
        disableRowSelectionOnClick
      />}
    </>
  );
}

export default VendorPages;
