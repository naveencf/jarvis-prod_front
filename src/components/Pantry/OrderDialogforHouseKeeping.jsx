import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';
import io from "socket.io-client";
import jwtDecode from 'jwt-decode';
// import { useEditPantryMutation } from '../Store/API/Pantry/PantryApi';
import formatString from '../../utils/formatString';
import { socketBaseUrl } from '../../utils/config';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// const socket = io(socketBaseUrl); // Replace with your backend URL

export default function OrderDialogforHouseKeeping({ alertSound, order, setOrder, orderDialog, setOrderDialog, fetchOrders }) {
    const [open, setOpen] = React.useState(false);
    const storedToken = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(storedToken);
    const userID = decodedToken.id;


    // const [editPantry, { isLoading, error }] = useEditPantryMutation();
    const handleClickOpen = () => {
        setOpen(true);

    };

    const handleClose = () => {
        setOrderDialog(false);
        console.log("audio off")
        alertSound.pause();
        alertSound.currentTime = 0; // Reset audio
    };


    const handleOrderSubmit = async () => {
        try {
            const payload = {
                order_status: 1,
                order_taken_by: userID,
            };

            console.log(order, "order");
            console.log(order._id, "order._id");

            // Retrieve token from sessionStorage
            const token = sessionStorage.getItem("token");

            // Send PUT request with token in headers
            axios
                .put(
                    `${socketBaseUrl}/api/pentry/accept_order_request/${order._id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        handleClose();
                        fetchOrders()
                        // toast.success("Pantry item updated successfully!");
                        console.log("Updated Pantry:", res.data);
                    }
                });
        } catch (err) {
            // toast.error("Failed to update pantry item");
            console.error("Update Error:", err);
        }
        console.log("audio off");
        alertSound.pause();
        alertSound.currentTime = 0; // Reset audio
    };


    return (
        <React.Fragment>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Slide in alert dialog
            </Button> */}
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <Dialog
                        open={orderDialog}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {/* Modal */}
                                {/* <div
                            className="orderModal modal fade"
                            id="newOrderModal"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="newOrderModalLabel"
                            aria-hidden="true"
                        > */}


                                <div className="modal-header">
                                    <h5 className="modal-title" id="newOrderModalLabel">
                                        New Order
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        // data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={handleClose}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body p0">
                                    <div className="orderItem">
                                        <div className="orderUserInfo">
                                            <div className="orderUser">
                                                <div className="orderUserImg">
                                                    <img src="https://storage.googleapis.com/node-dev-bucket/1737022468468.jpg" />
                                                </div>
                                                <div className="orderUserName">
                                                    <h2>{order?.user_name}</h2>
                                                    <ul>
                                                        <li>
                                                            <span>Room : </span>{order?.room_id}
                                                        </li>
                                                        <li>
                                                            <span>Seat : </span>{order?.seat_id}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="orderId">
                                                <h4>
                                                    <span>Order ID</span>{order?.order_id}
                                                </h4>
                                            </div>
                                        </div>
                                        <ul>
                                            {order?.order_items.length > 0 ? <div className="orderInfo">
                                                {order?.order_items.map((res) => {
                                                    { console.log(res) }
                                                    return <li>
                                                        <span> {res?.quantity}</span>    {formatString(res?.item_name)}

                                                    </li>
                                                })}
                                            </div> : <div className="orderRemark">
                                                <p>{order?.order_type == 1 ? "Please refill Water Bottle" : order?.order_type == 2 ? "Housekeeping" :
                                                    order?.order_items.map(res => `${res.quantity} ${formatString(res.item_name)}, `)}</p>
                                            </div>}
                                        </ul>
                                        <div className="orderRemark">
                                            <p>{order?.remark}</p>
                                        </div>
                                    </div>
                                </div>



                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <div className="modal-footer">
                                <button
                                    onClick={() => handleOrderSubmit()}
                                    className="btn cmnbtn btn_sm btn-success ml-auto mr-auto"
                                    data-dismiss="modal"
                                >
                                    Accept Order
                                </button>
                            </div>
                            {/* <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleClose}>Agree</Button> */}
                        </DialogActions>

                    </Dialog>
                </div>
            </div>
        </React.Fragment>
    );
}
