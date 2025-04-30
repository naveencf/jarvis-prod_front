import { useEffect, useState } from "react";
import io from "socket.io-client";
import { baseUrl, socketBaseUrl } from "../../utils/config";
import jwtDecode from "jwt-decode";
import {
    useCreatePantryMutation,
    useGetPantryByIdQuery,
    useOfflineFromPantryMutation,
} from "../Store/API/Pantry/PantryApi";
import OrderDialogforHouseKeeping from "./OrderDialogforHouseKeeping";
import axios from "axios";
import { useLocation } from "react-router-dom";
import formatString from "../../utils/formatString";
import { Button, ButtonGroup, Dialog } from "@mui/material";
import { useMemo } from "react";
import OrderDialog from "./OrderDialog";
function PantryUserDashboard() {

    const location = useLocation();
    const isPantryRoute = location.pathname.includes("pantry");

    const socket = io(socketBaseUrl, {
        transports: ["websocket"], // Force websocket, avoid polling
        withCredentials: true,
        reconnectionAttempts: 5,
        timeout: 5000,
    });

    const storedToken = sessionStorage.getItem("token");
    const decodedToken = jwtDecode(storedToken);
    const userID = decodedToken.id;
    const userName = decodedToken.name;
    const departmentID = decodedToken.dept_id;
    // Using the query hook to fetch pantry data
    const { data: pantryData } = useGetPantryByIdQuery();
    // Using the mutation hook to create a new pantry
    const [createPantry, { isLoading: isCreating, error: createError }] =
        useCreatePantryMutation();
    const [offlineFromPantry] = useOfflineFromPantryMutation();
    const [isToggleLoading, setIsToggleLoading] = useState(false);

    const [order, setOrder] = useState([]);
    const [recentOrder, setRecentOrder] = useState([]);
    const [input, setInput] = useState("");
    const [orderDialog, setOrderDialog] = useState(false);
    const [orderConfirmationDialog, setOrderConfirmationDialog] = useState(false);
    const [orderStatus, setOrderStatus] = useState(1);
    const [houseKeepingOnlineStatus, setHouseKeepingOnlineStatus] =
        useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for disabling buttons
    const [dialogType, setDialogType] = useState(0);
    const fetchOrders = async () => {
        const token = sessionStorage.getItem("token");
        try {
            const response = await axios.get(
                `${socketBaseUrl}/api/pentry/order_request?order_taken_by=${userID}&&limit=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log(response.data, "response.data");
            setRecentOrder(response.data.data); // assuming response.data.data contains the orders array
            setOrderStatus(1);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };
    console.log(houseKeepingOnlineStatus, "houseKeepingOnlineStatus");
    useEffect(() => {
        fetchOrders();
    }, []);
    useEffect(() => {
        houseKeepingUserStatus();
    }, [pantryData]);

    const houseKeepingUserStatus = () => {
        if (pantryData) {
            const userOnline = pantryData?.staff_online.find(
                (item) => item.user_id == userID
            );
            if (userOnline) {
                console.log(pantryData, "pantryData", "userOnline", userOnline);
                setHouseKeepingOnlineStatus(true);
            }
        }
    };

    const handleOnlineStatus = async () => {
        setIsToggleLoading(true); // disable the button
        try {
            const newPantry = {
                user_id: userID,
                pentry_id: pantryData?._id,
                ...(houseKeepingOnlineStatus ? { status: 0 } : {}),

                // add other fields as needed
            };

            // The unwrap() method returns a promise that resolves with the actual response or rejects with an error.
            if (houseKeepingOnlineStatus) {
                const response = await offlineFromPantry(newPantry).unwrap();
                console.log(response, "response")
                if (response.success) {
                    setHouseKeepingOnlineStatus(false);
                } else if (!response.success && response.message ==
                    "User is not online") {
                    setHouseKeepingOnlineStatus(false);
                }
                setIsToggleLoading(false); // re-enable the button
            } else {
                const response = await createPantry(newPantry).unwrap();
                console.log(response, "response");
                if (response.success || response.message == "User is already online") {
                    setHouseKeepingOnlineStatus(true);
                    console.log(houseKeepingOnlineStatus, "houseKeepingOnlineStatus - 2");
                } else {
                    setHouseKeepingOnlineStatus(false);
                    console.log("offline")
                }
                setIsToggleLoading(false); // re-enable the button
            }
            // houseKeepingUserStatus();
        } catch (err) {
            console.error("Error creating pantry:", err);
        }
        // finally {
        //     setIsToggleLoading(false); // re-enable the button
        // }
        setIsToggleLoading(false); // re-enable the button
    };
    const alertSound = new Audio(
        "https://www.myinstants.com/media/sounds/alarm.mp3"
    ); // Replace with your sound file


    useEffect(() => {
        if (!houseKeepingOnlineStatus) return; // don't connect if offline
        const socket = io(socketBaseUrl, {
            transports: ["websocket"],
            withCredentials: true,
            reconnectionAttempts: 5,
            timeout: 5000,
        });

        if (isPantryRoute) {
            // New Order
            socket.on("orderGenerated", (message) => {
                setOrder(message);
                setOrderDialog(true);
                alertSound.play();
            });

            // Order accepted by someone else
            socket.on("orderAccepted", (updatedOrder) => {
                if (orderDialog && order && updatedOrder?._id === order?._id && updatedOrder?.order_taken_by !== userID) {
                    // Someone else accepted it
                    console.log("Order was accepted by someone else");
                    setOrderDialog(false);
                    setOrder(null);
                }
            });

            return () => {
                socket.off("orderGenerated");
                socket.off("orderAccepted");
            };
        }
    }, [isPantryRoute, houseKeepingOnlineStatus]);

    const handleOrderDeliveredCancelled = async (orderDetail, status) => {
        // Disable the button while processing
        setIsButtonDisabled(true);
        const payload = {
            order_status: status,
            order_taken_by: userID,
        };
        console.log(orderDetail, "orderDetail");
        const token = sessionStorage.getItem("token");

        try {
            const res = await axios.put(
                `${socketBaseUrl}/api/pentry/order_request/${orderDetail._id}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res.status === 200) {
                // Assuming handleClose is defined somewhere in your component
                // handleClose && handleClose();
                fetchOrders();
                if (status == 3 || status == 4) {
                    setOrderConfirmationDialog(true)
                    setDialogType(status == 3 ? 1 : 2)
                    console.log("delivered")
                }
                console.log("Updated Pantry:", res.data);
            }
        } catch (err) {
            console.error("Update Error:", err);
        } finally {
            // Re-enable the button after the request completes
            setIsButtonDisabled(false);
        }
    };

    const filteredOrders = useMemo(() => {
        const filtered = recentOrder.filter((orderDetail) =>
            orderStatus === 1
                ? orderDetail.order_status === 1
                : orderDetail.order_status !== 1
        );

        if (orderStatus !== 1) {
            // Sort completed/cancelled by updatedAt descending
            return filtered.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
        }

        return filtered;
    }, [recentOrder, orderStatus]);
    return (
        <>
            <div className="hkWrapper">
                <div className="hkHeader">
                    <div className="hkTitle">
                        <div className="hkImg">
                            <img
                                src="https://storage.googleapis.com/node-dev-bucket/1737022468468.jpg"
                                alt="User"
                            />
                        </div>
                        <div className="hkName" >
                            <h2>{userName}</h2>
                            <h4>
                                <span>Emp ID : </span>
                                {userID}
                            </h4>
                            {/* <button onClick={() => setOrderConfirmationDialog(!orderConfirmationDialog)}>test</button> */}
                        </div>
                    </div>

                    <div className="hkAction">
                        <div className="statusToggle">
                            {/* <button
                                type="button"
                                className={`btn btn-lg btn-toggle ${houseKeepingOnlineStatus ? "active" : ""
                                    }`}
                                data-toggle="button"
                                aria-pressed={houseKeepingOnlineStatus}
                                autoComplete="off"
                                onClick={() => handleOnlineStatus()}
                            >
                                <div className="switch"></div>
                            </button> */}
                            <button
                                type="button"
                                className={`btn btn-lg btn-toggle ${houseKeepingOnlineStatus ? "active" : ""
                                    }`}
                                // className={`btn btn-lg btn-toggle ${houseKeepingOnlineStatus ? "active" : ""}`}
                                data-toggle="button"
                                aria-pressed={houseKeepingOnlineStatus}
                                autoComplete="off"
                                onClick={handleOnlineStatus}
                                disabled={isToggleLoading} // <--- disable while loading
                            > <div className="switch"></div></button>
                        </div>
                    </div>
                </div>
                <div className="orderWrapper">
                    <div className="orderWrapperHead">
                        <ButtonGroup variant="text" aria-label="Basic button group">
                            <Button
                                onClick={() => setOrderStatus(1)}
                                className={orderStatus === 1 ? "active-tab" : ""}
                            >
                                Pending
                            </Button>
                            <Button
                                onClick={() => setOrderStatus(3)}
                                className={orderStatus === 3 ? "active-tab" : ""}
                            >
                                Close
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="orderItemsListing">
                        {filteredOrders.map((orderDetail, index) => (
                            <div className="orderItem" key={orderDetail._id}>
                                {console.log(orderDetail, "orderDetail")}
                                <div key={index} className="orderUserInfo">
                                    <div className="orderUser">
                                        <div className="orderUserImg">
                                            <img
                                                src="https://storage.googleapis.com/node-dev-bucket/1737022468468.jpg"
                                                alt="Order"
                                            />
                                        </div>
                                        <div className="orderUserName">
                                            <h2>{orderDetail?.user_name} <span className={`badge ${orderDetail.order_status == 3 ? "badge-success" : "badge-danger"}`}>{orderDetail.order_status == 3 ? "Delivered" : "Cancel"}</span></h2>
                                            <ul>
                                                <li>
                                                    <span>Room : </span>
                                                    {orderDetail?.room_id}
                                                </li>
                                                <li>
                                                    <span>Seat : </span>
                                                    {orderDetail?.seat_id}
                                                </li>
                                            </ul>
                                            <h6>{(orderDetail.updatedAt)}</h6>
                                        </div>
                                    </div>
                                    <div className="orderId">
                                        <h4>
                                            <span>Order ID </span>
                                            {orderDetail?.order_id}
                                        </h4>
                                    </div>
                                </div>

                                <div className="orderRemark">
                                    <p>
                                        {orderDetail?.order_type == 1
                                            ? "Please refill Water Bottle"
                                            : orderDetail?.order_type == 2
                                                ? "Housekeeping"
                                                : orderDetail?.order_items.map(
                                                    (res) =>
                                                        `${res.quantity} ${formatString(res.item_name)}, `
                                                )}
                                    </p>
                                </div>
                                <div className="orderAction">
                                    {orderDetail?.order_status === 1 && (
                                        <button
                                            className="btn cmnbtn btn_sm btn-success"
                                            disabled={isButtonDisabled}
                                            onClick={() =>
                                                handleOrderDeliveredCancelled(orderDetail, 3)
                                            }
                                        >
                                            Delivered
                                        </button>
                                    )}
                                    {orderDetail?.order_status === 1 && (
                                        <button
                                            className="btn cmnbtn btn_sm btn-danger"
                                            disabled={isButtonDisabled}
                                            onClick={() =>
                                                handleOrderDeliveredCancelled(orderDetail, 4)
                                            }
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {orderDialog && (
                <OrderDialogforHouseKeeping
                    alertSound={alertSound}
                    order={order}
                    setOrder={setOrder}
                    orderDialog={orderDialog}
                    setOrderDialog={setOrderDialog}
                    fetchOrders={fetchOrders}
                />
            )}
            {orderConfirmationDialog && <OrderDialog orderConfirmationDialog={orderConfirmationDialog} setOrderConfirmationDialog={setOrderConfirmationDialog} dialogType={dialogType} />
            }
        </>
    );
}

export default PantryUserDashboard;
