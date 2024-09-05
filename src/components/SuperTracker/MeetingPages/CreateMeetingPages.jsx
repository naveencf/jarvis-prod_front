import { useEffect, useState } from 'react';
import { Box, Modal, Button, IconButton } from '@mui/material';
import axios from 'axios';
import FormContainer from '../../AdminPanel/FormContainer';
import FieldContainer from '../../AdminPanel/FieldContainer';
import Select from 'react-select';
import jwtDecode from "jwt-decode";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from 'react-router-dom';

const achievedStatus = [
    { value: 1, label: "Achieved" },
    { value: 2, label: "UnAchieved" }
];

const baseURLINSTA = "https://insights.ist:8080/api/v1/community/";

const CreateMeetingPages = ({ open, onClose, onCreate, creatorDetail }) => {
    const navigate = useNavigate();
    const [discussion, setDiscussion] = useState('');
    const [outCome, setOutCome] = useState('');
    const [nextFollowUp, setNextFollowUp] = useState('');
    const [status, setStatus] = useState(null);
    const [meetingPagesData, setMeetingPagesData] = useState([]);
    const [selectedPages, setSelectedPages] = useState(null);
    const [openMeetingModeCreate, setOpenMeetingModeCreate] = useState(false);
    const [viaMeetingMode, setViaMeetingMode] = useState('');

    const token = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const loginUserId = decodedToken.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${baseURLINSTA}page_meeting`, {
                poc: loginUserId,
                discussion,
                outcome: outCome,
                meeting_via: selectedPages?.value,
                next_follow_up: nextFollowUp,
                achieved: status?.value,
                page_name: creatorDetail?.creatorName
            });
            onCreate();
            onClose();
            setDiscussion('');
            setOutCome('');
            setNextFollowUp('');
            setStatus(null);
            setSelectedPages(null);
        } catch (error) {
            console.error('Error creating meeting page:', error);
        }
    };

    const handleSubmitMeetingMode = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${baseURLINSTA}page_meeting_mode`, {
                name: viaMeetingMode
            });
            setViaMeetingMode("");
            setOpenMeetingModeCreate(false);
            await fetchMeetingPagesData(); // Refresh meeting pages data after creation
        } catch (error) {
            console.error('Error creating meeting mode:', error);
        }
    };

    const fetchMeetingPagesData = async () => {
        try {
            const res = await axios.get(`${baseURLINSTA}page_meeting_mode`);
            setMeetingPagesData(res.data.data);
        } catch (error) {
            console.error('Error fetching meeting pages data:', error);
        }
    };

    useEffect(() => {
        fetchMeetingPagesData();
    }, []);

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
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
                    <FormContainer
                        mainTitle="Create Meeting Page"
                        handleSubmit={handleSubmit}
                        title={'Create Data'}
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
                            label="Outcome"
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
                        <div className="col-md-6 mb16">
                            <div className="form-group m0">
                                <label className="form-label">
                                    Meeting Via
                                </label>
                                <div className="input-group inputAddGroup">
                                    <Select
                                        options={meetingPagesData.map(option => ({
                                            value: option._id,
                                            label: option.name
                                        }))}
                                        onChange={setSelectedPages}
                                        value={selectedPages}
                                    />
                                    <IconButton
                                        variant="contained"
                                        color="primary"
                                        aria-label="Add Meeting Mode"
                                        onClick={() => setOpenMeetingModeCreate(true)}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton
                                        variant="contained"
                                        color="primary"
                                        aria-label="Meeting Modes Info"
                                        onClick={() => navigate("/admin/instaapi/community/overviewMeetingVia")}
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        <div className="form-group col-6">
                            <label className="form-label">
                                Status<sup className="form-error">*</sup>
                            </label>
                            <Select
                                className=""
                                options={achievedStatus.map(option => ({
                                    value: option.value,
                                    label: option.label
                                }))}
                                onChange={setStatus}
                                value={status}
                                required={false}
                            />
                        </div>
                    </FormContainer>
                    <Button variant="outlined" color='error' onClick={onClose}>Close</Button>
                </Box>
            </Modal>

            {/* Create Meeting Mode Modal */}
            <Modal
                open={openMeetingModeCreate}
                onClose={() => setOpenMeetingModeCreate(false)}
                aria-labelledby="create-meeting-mode-modal"
                aria-describedby="create-meeting-mode-description"
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
                  <Button variant="outlined" color='error' sx={{ float:'right'}} onClick={() => setOpenMeetingModeCreate(false)}>X</Button>
                    <FormContainer
                        mainTitle="Create Meeting Mode"
                        handleSubmit={handleSubmitMeetingMode}
                    >
                        <FieldContainer
                            label="Meeting Mode"
                            type="text"
                            fieldGrid={4}
                            value={viaMeetingMode}
                            required={false}
                            onChange={(e) => setViaMeetingMode(e.target.value)}
                        />
                    </FormContainer>
                </Box>
            </Modal>
        </div>
    );
}

export default CreateMeetingPages;
