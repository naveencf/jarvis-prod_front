import { Box, Button, Typography, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FormContainer from '../../AdminPanel/FormContainer';
import FieldContainer from '../../AdminPanel/FieldContainer';
import Select from 'react-select'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IconButton } from '@mui/material';
import CreateMeetingPages from "./CreateMeetingPages";
import { useGlobalContext } from "../../../Context/Context";
// import jwtDecode from "jwt-decode";
const achievedStatus = [
    { value: 1, label: "Achieved" },
    { value: 2, label: "UnAchieved" }
];

const MeetingPagesOverView = () => {
    const { toastAlert, toastError } = useGlobalContext();

    const location = useLocation();
    const { creatorDetail } = location.state || {}
    const navigate = useNavigate();
    const [meetingPage, setMeetingpage] = useState([]);
    const [user, setUser] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
    const [id, setId] = useState("");

    // edit ---- 
    const [discussion, setDiscussion] = useState('');
    const [outCome, setOutCome] = useState('');
    const [nextFollowUp, setNextFollowUp] = useState(null);
    const [status, setStatus] = useState(null);
    const [pagesViaData, setPagesViaData] = useState([]);
    

    const getMeetingPages = async () => {
        const res = await axios.get('https://insights.ist:8080/api/v1/community/page_meeting');
        setMeetingpage(res.data.data);


    };
    const getuserdata = async () => {
        const getUser = await axios.get('http://34.42.28.61:8080/api/get_all_users');
        setUser(getUser.data.data);
        console.log(getUser.data.data);
    }


    const getMeetingViapage = async () => {
        try {
            const res = await axios.get('https://insights.ist:8080/api/v1/community/page_meeting_mode');
            setPagesViaData(res.data.data);
        } catch (error) {
           console.log('Failed to fetch meeting data');
        }
    };

    useEffect(() => {
        getMeetingPages();
        getuserdata()
        getMeetingViapage();
    }, []);

    const handleEdit = async (row) => {
        setModalOpenUpdate(true)
        setId(row._id)
        const res = await axios.get(`https://insights.ist:8080/api/v1/community/page_meeting/${row._id}`);
        console.log(res.data.data.discussion);
        setDiscussion(res.data.data.discussion)
        setOutCome(res.data.data.outcome)
        setNextFollowUp(res.data.data.next_follow_up ? new Date(res.data.data.next_follow_up).toISOString().split('T')[0] : ''); // Convert date to yyyy-mm-dd
        setStatus(achievedStatus.find(option => option.value === res.data.data.achieved))

    };
    const handleClose = () => {
        setModalOpenUpdate(false)
    };

    const handleDelete = async (row) => {
        const res = await axios.delete(`https://insights.ist:8080/api/v1/community/page_meeting/${row._id}`)
        getMeetingPages();
        toastAlert("Delete SuccessFully ",res)
    };

    const columns = [
        {
            field: "S.NO",
            headerName: "S.NO",
            renderCell: (params) => {
                const rowIndex = meetingPage.indexOf(params.row);
                return <div>{rowIndex + 1}</div>;
            },
        }
        ,
        {
            field: "poc",
            headerName: "User Name",
            width: 200,
            renderCell: (params) =>
                user?.find(
                    (user) => user.user_id === params.row.poc
                )?.user_name || "N/A",
        }
        ,
        {
            field: "discussion",
            headerName: "Discussion",
            width: 160,
        },
        {
            field: "meeting_via",
            headerName: "Meeting Via",
            width: 160,
            renderCell: (params) => {
                const meetingViaId = params.row.meeting_via;
                const meetingVia = pagesViaData.find(item => item._id === meetingViaId);
                return meetingVia ? meetingVia.name : 'N/A';
            }
        },
        {
            field: "Date ",
            headerName: "Next Follow Up",
            width: 200,
            valueGetter: (params) => params.row.next_follow_up,
            renderCell: (params) => {
                return new Date(params.row.next_follow_up)
                    .toLocaleDateString("en-GB", { timeZone: "IST" })
                    .replace(/(\d+)\/(\d+)\/(\d+)/, "$3/$2/$1");
            },
        },
        {
            field: "outcome",
            headerName: "Outcome",
            width: 150,
        },
        {
            field: "page_name",
            headerName: "Page Name",
            width: 150,
            
        },
        {
            field: 'achieved',
            headerName: 'Status',
            width: 200,
            renderCell: (params) => {
                const status = params.row.achieved

                if (status == 1) {
                    return <Button variant="outlined" color="warning">Achieved</Button>;
                } else if (status == 2) {
                    return <Button variant="outlined" color="success">UnAchieved</Button>;
                } else {
                    return 'N/A';
                }
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


    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`https://insights.ist:8080/api/v1/community/page_meeting`, {
                _id: id,
                discussion: discussion,
                outcome: outCome,
                next_follow_up: nextFollowUp,
                achieved: status?.value
            });
            toastAlert("Updated Successfully");
            handleClose();
            getMeetingPages()
        } catch (error) {
            toastError("Update Failed");
        }
    };

    return (
        <div>
            <Box sx={{ ml: 1, mb: 2 }}>
                <Typography variant="h5">Meeting Pages</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setModalOpen(true)}
                >
                    + Create
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate("/admin/instaapi/community/manager/pasandidddaaurat")}
                >
                    Go Pages
                </Button>
            </Box>
            <DataGrid
                rows={meetingPage}
                columns={columns}
                getRowId={(row) => row._id}
            />
            <CreateMeetingPages
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={getMeetingPages}
                creatorDetail={creatorDetail}
            />
            <>
                {/* Update meeting pages modal */}

                <Modal
                    open={modalOpenUpdate}
                    onClose={handleClose}
                    aria-labelledby="create-meeting-page-modal"
                    aria-describedby="create-meeting-page-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 800,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4
                    }}>
                            <Button sx={{ float:'right'}} variant="outlined" color='error' onClick={handleClose}> X </Button>
                        <Box>
                            <FormContainer
                                mainTitle="Update Meeting Page "
                                handleSubmit={handleUpdate}
                                title={'Update Data'}
                            >
                                <FieldContainer
                                    label="Discussion"
                                    type="text"
                                    fieldGrid={4}
                                    value={discussion}
                                    required={false}
                                    onChange={(e) => setDiscussion(e.target.value)}
                                />
                                <FieldContainer
                                    label="Out Come"
                                    type="text"
                                    fieldGrid={4}
                                    value={outCome}
                                    required={false}
                                    onChange={(e) => setOutCome(e.target.value)}
                                />
                                <FieldContainer
                                    label="Next Follow-Up"
                                    type="date"
                                    fieldGrid={4}
                                    value={nextFollowUp}
                                    required={false}
                                    onChange={(e) => setNextFollowUp(e.target.value)}
                                />
                                <div className="form-group col-3">
                                    <label className="form-label">
                                        Meeting Via
                                    </label>
                                    <Select
                                        className=""
                                        // Add options and onChange logic if needed
                                        required={false}
                                    />
                                </div>
                                <div className="form-group col-3">
                                    <label className="form-label">
                                        Status<sup className="form-error">*</sup>
                                    </label>
                                    <Select
                                        className=""
                                        value={status}
                                        options={achievedStatus.map((option) => ({
                                            value: option.value,
                                            label: option.label,
                                        }))}
                                        onChange={(selectedOption) => setStatus(selectedOption)} // Update status on selection
                                        required={false}
                                    />
                                </div>
                            </FormContainer>
                        </Box>
                    </Box>
                </Modal>
            </>
        </div>
    );
};

export default MeetingPagesOverView;
