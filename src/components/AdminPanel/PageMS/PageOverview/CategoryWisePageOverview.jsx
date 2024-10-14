import React from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { formatNumber } from '../../../../utils/formatNumber';


const CategoryWisePageOverview = ({ categoryData, setFilterData, pageList, setActiveTab }) => {
    
    const categoryGridcolumns = [
        {
            field: "S.NO",
            headerName: "S.no",
            renderCell: (params) => <div>{categoryData.indexOf(params.row) + 1}</div>,
            width: 80,
        },
        {
            headerName: "Category",
            width: 200,
            editable: false,
            renderCell: (params) => {
                let data = params.row?.category_name;
                return data ? data : "NA";
            },
        },
        {
            field: "Vendor Count",
            headerName: "Vendor Count",
            width: 200,
            editable: true,
            renderCell: (params) => {
                let data = params.row.vendor_count;
                return data ? data : "NA";
            },
        },
        {
            field: "Count",
            headerName: "Count",
            width: 200,
            // editable: true,
            renderCell: (params) => {
                let data = params.row.category_used;
                return data ? (
                    <div>
                        <button className="btn w_80">{data}</button>
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => {
                                setFilterData(
                                    pageList?.filter(
                                        (item) => item.page_category_id === params.row.id
                                    )
                                );
                                setActiveTab("Tab1");
                            }}
                            style={{ marginLeft: "10px" }}
                        >
                            Show
                        </button>
                    </div>
                ) : (
                    "NA"
                );
            },
        },
        {
            field: "Total Followers",
            headerName: "Total Followers",
            width: 200,
            editable: true,
            renderCell: (params) => {
                let data = params.row.total_followers;
                return data ? formatNumber(data) : "0";
            },
        },
        {
            field: "Story",
            headerName: "Story",
            width: 200,
            editable: true,
            renderCell: (params) => {
                let data = params.row.total_stories;
                return data ? `₹. ${data}` : "0";
            },
        },
        {
            field: "Ave. Story",
            headerName: " Ave. Story",
            width: 200,
            editable: true,
            renderCell: (params) => {
                let data = params.row.total_stories / params.row.category_used
                return data ? `₹ ${data.toFixed(2)}` : "₹ 0.00";
            },
        },
        {
            field: "Post",
            headerName: "Post",
            width: 200,
            editable: true,
            renderCell: (params) => {
                let data = params.row.total_posts;
                return data ? `₹. ${data}` : "0";
            },
        },
        {
            field: "Ave. Post",
            headerName: " Ave. Post",
            width: 200,
            editable: true,
            renderCell: (params) => {
                let data = params.row.total_posts / params.row.category_used;
                return data ? `₹ ${data.toFixed(2)}` : "₹ 0.00";
            },
        }
    ];

    return (
        <div>
            <Box sx={{ height: 700, width: "100%" }}>
                <DataGrid
                    title="Category Wise"
                    rows={categoryData}
                    columns={categoryGridcolumns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </div>
    )
}

export default CategoryWisePageOverview