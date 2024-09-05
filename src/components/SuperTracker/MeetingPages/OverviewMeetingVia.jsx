import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Modal } from '@mui/material';
import axios from 'axios';
import FormContainer from '../../AdminPanel/FormContainer';
import FieldContainer from '../../AdminPanel/FieldContainer';
import { DataGrid } from '@mui/x-data-grid';
import { useGlobalContext } from '../../../Context/Context';

const OverviewMeetingVia = () => {
    const { toastAlert, toastError } = useGlobalContext();
    const [viaMeetingModeEdit, setviaMeetingModeEdit] = useState('');
    const [id, setId] = useState('');
    const [meetingpage, setMeetingpage] = useState([]);
    const [openModal, setModalOpen] = useState(false);

    const getMeetingViapage = async () => {
        try {
            const res = await axios.get('https://insights.ist:8080/api/v1/community/page_meeting_mode');
            setMeetingpage(res.data.data);
        } catch (error) {
            toastError('Failed to fetch meeting data');
        }
    };

    useEffect(() => {
        getMeetingViapage();
    }, []);

    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = meetingpage.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        },
        {
            field: "name",
            headerName: "Meeting Name",
            width: 160,
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: 160,
            valueGetter: (params) => params.row.createdAt,
            renderCell: (params) => {
                return new Date(params.row.createdAt)
                    .toLocaleDateString("en-GB", { timeZone: "IST" })
                    .replace(/(\d+)\/(\d+)\/(\d+)/, "$3/$2/$1");
            },
        },
        {
            field: "action",
            headerName: "Action",
            width: 180,
            renderCell: (params) => (
                <div>
                    <IconButton onClick={() => handleEdit(params.row)} color="primary">
                        <i className="bi bi-pencil-square"></i>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row)} color="error">
                        <i className="bi bi-trash3"></i>
                    </IconButton>
                </div>
            ),
        }
    ];

    const handleDelete = async (row) => {
        try {
            await axios.delete(`https://insights.ist:8080/api/v1/community/page_meeting_mode/${row._id}`);
            getMeetingViapage();
            toastAlert("Deleted Successfully");
        } catch (error) {
            toastError('Failed to delete the meeting');
        }
    };

    const handleEdit = async (row) => {
        try {
            const res = await axios.get(`https://insights.ist:8080/api/v1/community/page_meeting_mode/${row._id}`);
            setviaMeetingModeEdit(res.data.data.name);
            setModalOpen(true);
            setId(row._id);
        } catch (error) {
            toastError('Failed to fetch meeting details');
        }
    };

    const handleSubmitMeetingMode = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`https://insights.ist:8080/api/v1/community/page_meeting_mode`, {
                _id: id,
                name: viaMeetingModeEdit
            });
            setviaMeetingModeEdit('');
            setModalOpen(false);
            getMeetingViapage();
            toastAlert('Updated Successfully');
        } catch (error) {
            toastError('Failed to update meeting');
        }
    };

    return (
        <div>
           
            <DataGrid
                rows={meetingpage}
                columns={columns}
                getRowId={(row) => row._id}
            />

            {/* meeting mode Update data */}
            <Modal
                open={openModal}
                onClose={() => setModalOpen(false)}
                aria-labelledby="info-modal-title"
                aria-describedby="info-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                                        <Button sx={{float:'right'}}variant="outlined" color='error' onClick={() => setModalOpen(false)}> X </Button>
                    <FormContainer
                        mainTitle="Update Meeting Page"
                        handleSubmit={handleSubmitMeetingMode}
                        title='update'
                    >
                        <FieldContainer
                            label="Meeting Name"
                            type="text"
                            fieldGrid={4}
                            value={viaMeetingModeEdit}
                            required={false}
                            onChange={(e) => setviaMeetingModeEdit(e.target.value)}
                        />
                    </FormContainer>
                </Box>
            </Modal>
        </div>
    );
}

export default OverviewMeetingVia;
