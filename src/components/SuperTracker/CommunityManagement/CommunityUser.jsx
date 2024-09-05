import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiContextData } from '../../AdminPanel/APIContext/APIContext';
import FormContainer from '../../AdminPanel/FormContainer';
import Modal from "react-modal";
import FieldContainer from '../../AdminPanel/FieldContainer';
import Select from 'react-select'



const CommunityUser = () => {
    const { userContextData } = useContext(ApiContextData);
    const navigate = useNavigate();
    const [managerData, setManagerData] = useState([]);
    const [category, setCategory] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openAssignCategory, setOpenAssignCategory] = useState(false);
    const [rowData, setRowData] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([]);
    console.log(rowData, 'new');

    const handleOpenAssignCategory = (row) => {
        setRowData(row)
        setOpenAssignCategory(true)
    };
    const handleCloseAssignCategory = () => setOpenAssignCategory(false);

    // Function to count pages per user and group pages
    const countPagesPerUser = (data) => {
        return data.reduce((acc, item) => {
            if (item.user_id) {
                if (!acc[item.user_id]) {
                    acc[item.user_id] = { count: 0, pages: [] };
                }
                acc[item.user_id].count += 1;
                acc[item.user_id].pages.push(item); // Store full page details
            }
            return acc;
        }, {});
    };

    const getCategory = async () => {
        const res = await axios.get(`https://insights.ist:8080/api/projectxpagecategory`)
        setCategory(res.data.data)
    }

    const getManagerData = async () => {
        try {
            const res = await axios.get('https://insights.ist:8080/api/v1/community/community_user');
            const data = res.data.data;
            const counts = countPagesPerUser(data);

            // Create a map to store unique user data
            const userMap = new Map();
            data.forEach(item => {
                if (item.user_id) {
                    if (!userMap.has(item.user_id)) {
                        userMap.set(item.user_id, {
                            ...item,
                            page_count: counts[item.user_id].count,
                            pages: counts[item.user_id].pages
                        });
                    }
                }
            });

            // Convert map to array
            const uniqueUserData = Array.from(userMap.values());

            setManagerData(uniqueUserData);
        } catch (error) {
            console.error("Error fetching manager data", error);
        }
    };

    useEffect(() => {
        getManagerData();
        getCategory()
    }, []);

    // Define columns for DataGrid
    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            valueGetter: (params) => managerData.indexOf(params.row),

            renderCell: (params) => {
                const rowIndex = managerData.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "User name",
            headerName: "User Name",
            width: 200,
            valueGetter: (params) => userContextData?.find(
                (user) => user.user_id === params.row.user_id
            )?.user_name || "N/A",
            renderCell: (params) =>
                userContextData?.find(
                    (user) => user.user_id === params.row.user_id
                )?.user_name || "N/A",
        },
        {
            field: "page_count",
            headerName: "Page Count",
            width: 150,
            renderCell: (params) => (
                <Button
                    color='error'
                    variant='outlined'
                    onClick={() => handleOpenModal(params.row)}
                >
                    {params.row.page_count}
                </Button>
            ),
        },
        {
            field: "Assigned Category",
            headerName: "Assigned Category",
            width: 250,
            renderCell: (params) => (
                <Button
                    color='error'
                    variant='outlined'
                    onClick={() => handleOpenAssignCategory(params.row)}
                >
                    Assigned Category
                </Button>
            ),
        },

    ];

    // Function to open modal
    const handleOpenModal = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    // Function to close modal
    const handleCloseModal = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleAssignCategory = (e) => {
        e.preventDefault()
        const res = axios.post(`https://insights.ist:8080/api/v1/community/category_manager`,{
            userId:rowData.user_id,
            pageCategoryIds:selectedCategory.map((item)=>item.value)
        })
        console.log(res);
        
    }

    return (
        <>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={() => navigate('/admin/instaapi/community')}> Pages </Button>
                <Button onClick={() => navigate('/admin/instaapi/community/user')}> Users </Button>
            </ButtonGroup>

            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={managerData}
                    columns={columns}
                    getRowId={(row) => row.user_id}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                />
            </Box>

            <Dialog open={open} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>Page Details</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <>

                            <div className='d-flex m-2 gap-2' >
                                <h6>User : {userContextData?.find(user => user.user_id === selectedUser.user_id)?.user_name || "N/A"}</h6>
                                <h6>Page Count : {selectedUser.page_count}</h6>
                            </div>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Page Name</th>
                                        <th scope="col">Manager</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {selectedUser.pages.map((page, index) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{page.page_name}</td>
                                            <td>{userContextData?.find(user => user.user_id === page.report_to)?.user_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="error" variant='outlined'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <>
                <Modal
                    className="salesModal"
                    isOpen={openAssignCategory}
                    onRequestClose={handleCloseAssignCategory}
                    contentLabel="modal"
                    preventScroll={true}
                    appElement={document.getElementById("root")}
                    style={{
                        overlay: {
                            position: "fixed",
                            backgroundColor: "rgba(255, 255, 255, 0.75)",
                            height: "100vh",
                        },
                        content: {
                            position: "absolute",
                            maxWidth: "900px",
                            minWidth: "500px",
                            top: "50px",
                            border: "1px solid #ccc",
                            background: "#fff",
                            overflow: "auto",
                            WebkitOverflowScrolling: "touch",
                            borderRadius: "4px",
                            outline: "none",
                            padding: "20px",
                            maxHeight: "650px",
                        },
                    }}
                >
                    <Button variant="outlined" sx={{ float: 'right' }} color='error'> X </Button>
                    <FormContainer
                        // mainTitle="Add Link"
                        // // handleSubmit={handleSubmit}
                        link={true}
                        title={'Add Whatsapp Links'}
                    />
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">
                                Category Assign
                            </h1>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <FieldContainer
                                    label="Heading"
                                    type="text"
                                    fieldGrid={12}
                                    disabled
                                    value={userContextData?.find(user => user.user_id === rowData.report_to)?.user_name}
                                />
                                <div className="form-group col-12">
                                    <label className="form-label">
                                        user
                                    </label>
                                    <Select
                                        className=""
                                        isMulti
                                        options={category.map((option) => ({
                                            value: option.category_id,
                                            label: option.category_name,
                                        }))}
                                        onChange={(selectedOption) => setSelectedCategory(selectedOption)} // Update status on selection
                                        required={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-100 sb">
                            <div></div>
                            <button className='btn btn-primary cmnbtn mb-2 mr-3' onClick={handleAssignCategory}>Submit</button></div>
                    </div>
                </Modal>
            </>
        </>
    );
};

export default CommunityUser;
