import { useEffect, useState } from "react";
import { Box, Modal, Button } from '@mui/material';
import { IconButton } from '@mui/material';
import FieldContainer from "../../AdminPanel/FieldContainer";
import FormContainer from "../../AdminPanel/FormContainer";
import axios from "axios";
import { useGlobalContext } from "../../../Context/Context";
import { useNavigate } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const MultipleWhatsappLinks = ({ creatorDetail }) => {

    const { toastAlert, toastError } = useGlobalContext();
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [heading, setHeading] = useState("");
    const [link, setLink] = useState("");
    const [description, setDescription] = useState("");
    // const [pages, setPages] = useState("");
    const [editHeading, setEditHeading] = useState("");
    const [editLink, setEditLink] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPages, setEditPages] = useState("");
    const [linkData, setlinkData] = useState([]);
    const [id, setId] = useState('');

    const getAllinks = async () => {
        const res = await axios.get(`https://insights.ist:8080/api/v1/community/whatsup_link`)
        setlinkData(res.data.data)
    }

    useEffect(() => {
        getAllinks()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`https://insights.ist:8080/api/v1/community/whatsup_link`, {
            link: link,
            header: heading,
            description: description,
            page_name: creatorDetail?.creatorName
        })
        console.log(res);
        setHeading('')
        setLink('')
        setDescription('')
        // setPages('')
        setOpen(false);
        getAllinks()
        toastAlert('Link Create SuccessFully')

    }
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (id) => {
        const res = await axios.delete(`https://insights.ist:8080/api/v1/community/whatsup_link/${id}`);
        console.log(res);
        toastError('Delete SuccessFully')
        getAllinks();
    }
    const handleEdit = async (item) => {
        setId(item._id)
        const res = await axios.get(`https://insights.ist:8080/api/v1/community/whatsup_link/${item._id}`)
        setEditHeading(res.data.data.header)
        setEditLink(res.data.data.link)
        setEditDescription(res.data.data.description)
        setEditPages(res.data.data.page_name)
        setEditOpen(true)
    }
    const handleEditClose = () => {
        setEditOpen(false);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`https://insights.ist:8080/api/v1/community/whatsup_link`, {
                _id: id,
                link: editLink,
                header: editHeading,
                description: editDescription,
                page_name: editPages
            });
            console.log(res);
            setEditOpen(false);
            await getAllinks();
            toastAlert('Update Successful');
        } catch (error) {
            toastError('Update Failed');
        }
    };
    const handleNavigateMeetingPage = () => {
        navigate('/admin/instaapi/community/meetingPage', { state: { creatorDetail } });
    };
    return (
        <>
            <Button onClick={handleOpen} variant="outlined" sx={{ m: 1 }}>Add Link</Button>
            <Button onClick={handleNavigateMeetingPage} variant="outlined" sx={{ m: 1 }}>
                Add Meeting Pages
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ float:'right'}} color='error'> X </Button>
                    <FormContainer
                        mainTitle="Add Link"
                        handleSubmit={handleSubmit}
                        title={'Add Whatsapp Links'}
                    >
                        <FieldContainer
                            label="Heading"
                            type="text"
                            fieldGrid={4}
                            value={heading}
                            required={false}
                            onChange={(e) => setHeading(e.target.value)}
                        />
                        <FieldContainer
                            label="Link"
                            type="text"
                            fieldGrid={4}
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            required={false}
                        />
                        <FieldContainer
                            label="Description"
                            type="text"
                            fieldGrid={4}
                            value={description}
                            required={false}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {/* <FieldContainer
                            label="Page Name"
                            type="text"
                            fieldGrid={4}
                            value={pages}
                            required={false}
                            onChange={(e) => setPages(e.target.value)}
                        /> */}
                    </FormContainer>
                </Box>
            </Modal>

            <table className="table table-primary table-striped table-bordered rounded">
                <thead>
                    <tr>
                        <th >S.No.</th>
                        <th >Heading </th>
                        <th >Link</th>
                        <th >Description</th>
                        <th >Page Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>

                    {linkData.length > 0 ? (
                        linkData.map((item, index) => (
                            creatorDetail?.creatorName === item.page_name && (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{item.header}</td>
                                    <td style={{ color: '#050cc1' }}>
                                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                                            {item.link}
                                        </a>
                                    </td>
                                    <td>{item.description}</td>
                                    <td>{item.page_name}</td>
                                    <td>
                                        <IconButton onClick={() => handleEdit(item)} color="primary">
                                            <i className="bi bi-pencil-square"></i>
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(item._id)} color="error">
                                            <i className="bi bi-trash3"></i>
                                        </IconButton>
                                    </td>
                                </tr>
                            )
                        ))
                    ) : (
                        <div style={{ color: 'red', fontSize: "20px", textAlign: "center" }}>
                            No Data here
                        </div>
                    )}

                </tbody>
            </table>
            <>
                <Modal
                    open={editOpen}
                    onClose={handleEditClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style }}>
                    <Button onClick={handleEditClose} sx={{ float:'right'}} variant="outlined" color='error'>X </Button>
                        <FormContainer
                            mainTitle="Update Link"
                            handleSubmit={handleEditSubmit}
                            title={'Update Whatsapp Links'}
                        >
                            <FieldContainer
                                label="Heading"
                                type="text"
                                fieldGrid={4}
                                value={editHeading}
                                required={false}
                                onChange={(e) => setEditHeading(e.target.value)}
                            />
                            <FieldContainer
                                label="Link"
                                type="text"
                                fieldGrid={4}
                                value={editLink}
                                onChange={(e) => setEditLink(e.target.value)}
                                required={false}
                            />
                            <FieldContainer
                                label="Description"
                                type="text"
                                fieldGrid={4}
                                value={editDescription}
                                required={false}
                                onChange={(e) => setEditDescription(e.target.value)}
                            />
                            <FieldContainer
                                label="Page Name"
                                type="text"
                                fieldGrid={4}
                                value={editPages}
                                required={false}
                                onChange={(e) => setEditPages(e.target.value)}
                            />
                        </FormContainer>
                    </Box>
                </Modal>
            </>
        </>
    );
};

export default MultipleWhatsappLinks;






