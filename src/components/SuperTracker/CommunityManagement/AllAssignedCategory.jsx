import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ApiContextData } from "../../AdminPanel/APIContext/APIContext";


const AllAssignedCategory = () => {
    const { userContextData } = useContext(ApiContextData);

    const [categories, setCategories] = useState([]);

    const getAllAssignedCategory = async () => {
        try {
            const res = await axios.get('https://insights.ist:8080/api/v1/community/category_manager');
            setCategories(res.data.data);
            console.log(res.data.data, ' res new data');

        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        getAllAssignedCategory();
    }, []);

    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = categories.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "User name",
            headerName: "User Name",
            width: 200,

            renderCell: (params) =>
                userContextData?.find(
                    (user) => user.user_id === params.row.userId
                )?.user_name || "N/A",
        },
        {
            field: 'Category',
            headerName: 'Category',
            width: 300,
            renderCell: (params) => {
                const category = params.row.pageCategoryIds;
                if (!category || category.length === 0) {
                    return 'N/A';
                }
                const categories = category.join(', ');
                return categories;
            }
        },
    ];

    return (
        <div>
            <h3> All Assigned Category</h3>
            {categories.length > 0 ? (
                <DataGrid rows={categories} columns={columns} pageSize={5} getRowId={(row) => row._id} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default AllAssignedCategory;
