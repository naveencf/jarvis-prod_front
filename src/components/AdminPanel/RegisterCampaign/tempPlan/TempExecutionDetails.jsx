import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { TextField } from '@mui/material';
import axios from 'axios';
import { baseUrl } from '../../../../utils/config';
import Loader from '../Loader/Loader';
import { useGlobalContext } from '../../../../Context/Context';
import MediaCard from './MediaCard';


const style = {

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    zIndex: 40

};


const TempExecutionDetails = ({ assignmentData, status, HardRender }) => {

    console.log(assignmentData)
    const { toastAlert, toastError } = useGlobalContext();
    const [loading, setLoading] = React.useState(false)
    const [instaData, setInstaData] = React.useState({})
    const [searchedData,setSearchedData]=React.useState([])

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    React.useEffect(()=>{
        setSearchedData(assignmentData)
    },[assignmentData])
    function Row(props) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);



        return (
            <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        {row?.assignment?.plan?.campaignName}
                    </TableCell>
                    <TableCell align="right">{row?.assignment?.page_name}</TableCell>
                    <TableCell align="right">{row?.assignment?.cat_name}</TableCell>
                    <TableCell align="right">{row?.assignment?.follower_count}</TableCell>
                    <TableCell align="right">{row?.assignment?.page_link}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                {/* <Typography variant="h6" gutterBottom component="div">
                                    History
                                </Typography> */}
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>sr.no</TableCell>
                                            <TableCell>Commit type</TableCell>
                                            <TableCell>Input</TableCell>
                                            <TableCell>status</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.commit.map((commit, index) => {
                                            return <TableRow key={commit._id}>
                                                <TableCell component="th" scope="row">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    {commit.commitType}
                                                </TableCell>

                                                <TableCell component="th" scope="row">
                                                    <TextField

                                                        label="Link"
                                                        variant="filled"
                                                        value={commit?.link}
                                                        onPaste={(event) => handlePaste(event, commit)}

                                                    />

                                                </TableCell>
                                                <TableCell component="th" scope="row"
                                                    sx={commit.verification_status == 'verified' ? { color: 'green', fontWeight: 'bold' } : { color: 'red', fontWeight: 'bold' }}
                                                >
                                                    {commit?.verification_status}
                                                </TableCell>

                                            </TableRow>
                                        })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }


    const handlePaste = async (event, commit) => {
        setTimeout(() => {
            setLoading(true)
        }, 1500)

        const pastedValue = event.clipboardData.getData("text");
        let val = pastedValue.split('/')
        val = val[val.length - 2]

        try {

            const checkIfLinkExist = await axios.post(`${baseUrl}checktempexecduplicacy`, { page: commit.page.page_name, link: pastedValue })
            let y

            while (y == null) {
                try {
                    const res = await axios.post(`${baseUrl}getinstapostdata`, {
                        "shortCode": val
                    })
                    // console.log(res.data.result.response)
                    console.log(res.data.result.status)

                    if (res.data.result.status.code == 500) {
                        toastError(res.data.result.status.message)
                        setLoading(false)
                        return
                    }
                    y = res.data.result.response
                } catch (error) {
                    // y==null
                    console.log(error)
                    setLoading(false)
                    return
                }

            }

            if (commit.page.page_name != y.owner.username) {
                toastError(`Link Does not Belong to ${commit.page.page_name}`)
                setLoading(false)
                return
            }


            const commitData = {
                shortCode: y?.shortcode,
                id: commit._id,
                link: pastedValue,
                likes: y?.likes_count,
                comments: y?.comments,
                caption: y?.caption,
                views: y?.views,
                imageLink: y?.thumbnail,
                reach: y?.reach,
                post_type: y?.post_type,
                comment_count: y?.comments_count,
                ower: y?.owner,
                posted_date: y?.posted_date,
                video_url: y?.video_url

            }

            setInstaData(commitData)
            setLoading(false)
            setOpen(true)


        } catch (error) {
            toastError(error.response?.data?.message)
            return
        }

    };

    const updateExe = async () => {

        try {
            
            const commitUpdate = await axios.put(`${baseUrl}tempexecution`, instaData)
            setInstaData({})
            setLoading(false)
            setOpen(false)
            toastAlert("Assignment Verified")
    
            HardRender()
        } catch (error) {
           toastError(error?.response?.data?.message)
        //    setOpen(false)
        }
    }

    let timer
    const handleSearchChange = (e) => {
        if (!e.target.value.length == 0) {

            clearTimeout(timer);
            timer = setTimeout(() => {
                const searched = assignmentData?.filter((page) => {
                    return (
                        page.assignment?.page_name
                            .toLowerCase()
                            .includes(e.target.value.toLowerCase()) ||
                        page.assignment?.cat_name?.toLowerCase().includes(e.target.value?.toLowerCase())
                    );
                });

                setSearchedData(searched)
            }, 500);

        } else {

        }
    };


    if (loading) {
        return (
            <Loader message={"Validating the Link Please Wait..."} />
        )
    }
    return (
        <>
            <TextField
                label="Search"
                variant="outlined"
                style={{width:"200px"}}
                
              onChange={handleSearchChange}
            />
            <TableContainer style={{marginTop:'20px'}} component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Campaign</TableCell>
                            <TableCell align="right">Page</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Followers</TableCell>
                            <TableCell align="right">Page Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchedData?.map((row) => (
                            <Row key={row.assignment._id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {open &&
                <>
                    <div style={{ position: 'absolute', height: '100vh', width: '100vw', background: "black", zIndex: 39, opacity: '0.2' }}></div>
                    <Box sx={style} >

                        <MediaCard handleClose={handleClose} updateExe={updateExe} instaData={instaData} />
                    </Box>
                </>
            }

        </>
    )
}

export default TempExecutionDetails