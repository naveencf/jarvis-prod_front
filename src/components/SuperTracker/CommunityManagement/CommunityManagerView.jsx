import { Button, ButtonGroup } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiContextData } from '../../AdminPanel/APIContext/APIContext';
import { Modal, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Box, Table } from '@mui/material';

const CommunityManagerView = () => {
    const { userContextData } = useContext(ApiContextData);
    const [rows, setRows] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const navigate = useNavigate();

    const fetchRows = async () => {
        try {
            const res = await axios.post("https://insights.ist:8080/api/v1/community/super_tracker_post_analytics");
            const data = res.data.data;
            const countMap = data.reduce((acc, item) => {
                const reportTo = item.teamInfo?.teamManager?.report_to || 'N/A';
                if (!acc[reportTo]) {
                    acc[reportTo] = {
                        reportTo,
                        count: 0,
                        followerGrowthCount: 0,
                        pageDetails: []
                    };
                }
                acc[reportTo].count += 1;
                acc[reportTo].followerGrowthCount += item.reportStatus?.previousDay.todayVsYesterdayFollowersCountDiff || 0;
                acc[reportTo].pageDetails.push(item);
                return acc;
            }, {});

            const formattedData = Object.values(countMap);
            setRows(formattedData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchRows();
    }, []);

    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            valueGetter: (params) => rows.findIndex(row => row.reportTo === params.row.reportTo),
            renderCell: (params) => {
                const rowIndex = rows.findIndex(row => row.reportTo === params.row.reportTo);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "reportTo",
            headerName: "Manager",
            width: 200,
            valueGetter: (params) => {
                const user = userContextData?.find(
                    (user) => user.user_id == params.row.reportTo
                );
                return user ? user.user_name : 'N/A';
            },
            renderCell: (params) => {
                const user = userContextData?.find(
                    (user) => user.user_id == params.row.reportTo
                );
                return user ? user.user_name : 'N/A';
            }
        },
        {
            field: "count",
            headerName: "Page Count",
            width: 200,
            
            renderCell: (params) => {
                return (
                    <Button
                        variant='outlined'
                        color='error'
                        onClick={() => {
                            setModalData(params.row.pageDetails);
                            setOpenModal(true);
                        }}
                    >
                        {params.value}
                    </Button>
                );
            },
        },
        {
            field: "followerGrowthCount",
            headerName: "Follower Growth Count",
            width: 200,
            valueGetter: (params) => params.value,
            renderCell: (params) => {
                const growth = params.value || 0;
                return (
                    <div
                        style={{
                            color: growth > 0 ? "green" : growth < 0 ? "red" : "black",
                        }}
                    >
                        {growth}
                    </div>
                );
            },
        },
    ];

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData([]);
    };

    return (
        <div style={{ height: 400, width: '100%' }}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick={() => navigate('/admin/instaapi/community')}> Pages </Button>
                <Button onClick={() => navigate('/admin/instaapi/community/user')}> Users </Button>
            </ButtonGroup>

            <div style={{ marginTop: 20 }}>
                <h4 className='mb-2 text-primary'>Manager View</h4>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.reportTo}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                />
            </div>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ width: '80%', maxWidth: 800, bgcolor: 'background.paper', p: 4, margin: 'auto', mt: '10%', borderRadius: 1 }}>
                    <h4 className='mb-2 text-primary'>Pages Detail</h4>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">S. No.</TableCell>
                                    <TableCell align="left">Page Name</TableCell>
                                    <TableCell >Follower </TableCell>
                                    <TableCell >Follower Growth</TableCell>
                                    <TableCell > Media</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modalData?.map((page, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="left">
                                            {page._id}
                                        </TableCell>
                                        <TableCell >
                                            {page.creatorInfo?.followersCount || 'N/A'}
                                        </TableCell>
                                        <TableCell >
                                            <Button
                                                variant='outlined'
                                                color='error'>
                                                {page.reportStatus?.previousDay?.todayVsYesterdayFollowersCountDiff || 'N/A'}
                                            </Button>
                                        </TableCell>
                                        <TableCell >
                                            {page.creatorInfo?.postCount || 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </div>
    );
};

export default CommunityManagerView;
