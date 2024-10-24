import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../../../utils/config';
import View from '../../Sales/Account/View/View';
import {Box,Modal} from '@mui/material';
import { formatNumber } from '../../../../utils/formatNumber';
import formatString from '../../../../utils/formatString';
import { useGetAllPageListQuery } from '../../../Store/PageBaseURL';
import jwtDecode from 'jwt-decode';
import Loader from '../../../Finance/Loader/Loader';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CategoryWisePageOverviewNew = ({ dataTable }) => {
    const [pagequery, setPagequery] = useState("")
    const [activeSection, setActiveSection] = useState(null)
    const [activeSectionCat, setActiveSectionCat] = useState(null)

    const storedToken = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(storedToken);
    const userID = decodedToken.id;
    const token = sessionStorage.getItem("token");
    const {
        data: pageList,
        refetch: refetchPageList,
        isLoading: isPageListLoading,
    } = useGetAllPageListQuery({ decodedToken, userID, pagequery });

    const [categoryWiseData, setCategoryWiseData] = useState([]);
    const [open, setOpen] = useState(false);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);

    useEffect(() => {
        if (pageList?.length > 0) {
            setRecordsLoading(false)
        }
    }, [pageList])

    const getCategoryWiseData = async () => {
        try {
            const res = await axios.get(`${baseUrl}v1/category_wise_inventory_details`);
            setCategoryWiseData(res?.data?.data || []);
        } catch (err) {
            console.error('Error fetching category-wise data:', err);
        }
    };
    console.log(pageList?.length,
        "kjkdjksjk", recordsLoading
    );
    const handleClick = (key, val) => {
        setPagequery(`${key}=${val}`);
        setActiveSection(key);
        setRecordsLoading(true)
        // console.log(`${key}=${val}`, "val console");
        setOpen(false)
    };
    const handleClickCatData = (key, val) => {
        
        setPagequery(`${key}=${val}`);
        setActiveSectionCat(key);
        setRecordsLoading(true)
        // console.log(`${key}=${val}`, "val console");
        setOpen(false)
    };
    useEffect(() => {
        getCategoryWiseData();
    }, []);

    const handleSubCategory = (subCategories) => {
        setSelectedSubCategories(subCategories);
        setOpen(true)
    };
    const handleClose = () => setOpen(false);
    const dataGridcolumns = [
        {
            key: "S.NO",
            name: "S.no",
            renderRowCell: (row, index) => index + 1,
            width: 50,
        },
        {
            key: "Category",
            name: "Category",
            width: 200,
            renderRowCell: (row) => {
                return (
                    <div>
                        {
                            <button
                                title="View Subcategories"
                                onClick={() => handleClickCatData("page_category_name",row._id)}
                                className=" btn cmnbtn  btn"
                                style={{minWidth:"120px",color:"blue"}}
                            >
                                {row._id}
                            </button>
                        }
                    </div>
                );
            },
        },
        {
            key: "Follower Count",
            name: "Follower Count",
            width: 200,
            renderRowCell: (row) => <div>{formatNumber(row.totalFollowersCount)}</div>,
        },
        {
            key: "Page Count",
            name: "Page Count",
            width: 200,
            renderRowCell: (row) => <div>{row.totalPageCount}</div>,
        },
        {
            key: "Vendor Count",
            name: "Vendor Count",
            width: 200,
            renderRowCell: (row) => <div>{row.uniqueVendorCount}</div>,
        },
        {
            key: "Sub Category",
            name: "Sub Category Count",
            width: 200,
            renderRowCell: (row) => {
                return (
                    <div>
                        {
                            <button
                                title="View Subcategories"
                                onClick={() => handleSubCategory(row.subCategories)}
                                className="btn cmnbtn btn_sm btn-outline-primary"
                            >
                                {row.subCategories.length}
                            </button>
                        }
                    </div>
                );
            },
        }
    ];

    return (
        <div className="card">
            <div className="card-body p0">
                <div className="data_tbl thm_table table-responsive">
                    <View
                        columns={dataGridcolumns}
                        data={categoryWiseData}
                        isLoading={false}
                        title={"Category Wise Overview"}
                        rowSelectable={true}
                        pagination={[100, 200, 1000]}
                        tableName={"Page Overview"}
                    />
                </div>
            </div>

            {/* Modal for displaying subcategories */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">S. No. </th>
                                <th scope="col">Sub Category</th>
                                <th scope="col">Total Follower</th>
                                <th scope="col">Vendor Count</th>
                            </tr>
                        </thead>
                        {selectedSubCategories.length > 0 && selectedSubCategories.map((item, index) => (
                            <tbody key={index}>
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <button
                                            className="btn cmnbtn btn_sm btn-outline-primary"
                                            onClick={() => handleClick("page_sub_category_name", item.page_sub_category_name)}

                                        >{formatString(item.page_sub_category_name)}
                                        </button>
                                    </td>
                                    <td>{formatNumber(item.totalFollowersCount)}</td>
                                    <td>{item.uniqueVendorCount}</td>
                                </tr>
                            </tbody>
                        ))}

                    </table>
                </Box>
            </Modal>

            {activeSection == "page_sub_category_name" && (
                <>
                    {!recordsLoading ? <View
                        columns={dataTable}
                        data={pageList}
                        isLoading={false}
                        pagination={[100, 200, 1000]}
                        tableName={"sub Category wise overview data"}
                    /> : <>
                        <Loader />
                    </>}
                </>
            )}
            {activeSectionCat == "page_category_name" && (
                <>
                    {!recordsLoading ? <View
                        columns={dataTable}
                        data={pageList}
                        isLoading={false}
                        pagination={[100, 200, 1000]}
                        tableName={"Category wise overview data"}
                    /> : <>
                        <Loader />
                    </>}
                </>
            )}

        </div>
    );
};

export default CategoryWisePageOverviewNew;
