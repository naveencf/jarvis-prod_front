
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { baseUrl, socketBaseUrl } from "../../utils/config";
import jwtDecode from "jwt-decode";
import { useCreatePantryMutation, useGetPantryByIdQuery, useOfflineFromPantryMutation } from "../Store/API/Pantry/PantryApi";
import OrderDialogforHouseKeeping from "./OrderDialogforHouseKeeping";
import axios from "axios";
import { useLocation } from "react-router-dom";
import formatString from "../../utils/formatString";

function PantryUserDashboard() {
    const location = useLocation();
    const isPantryRoute = location.pathname.includes("pantry");
    // const socket = io(socketBaseUrl); // Replace with your backend URL


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
    const { data: pantryData, } = useGetPantryByIdQuery();
    // Using the mutation hook to create a new pantry
    const [createPantry, { isLoading: isCreating, error: createError }] = useCreatePantryMutation();
    const [offlineFromPantry] = useOfflineFromPantryMutation();

    const [order, setOrder] = useState([]);
    const [recentOrder, setRecentOrder] = useState([]);
    const [input, setInput] = useState("");
    const [orderDialog, setOrderDialog] = useState(false);
    const [houseKeepingOnlineStatus, setHouseKeepingOnlineStatus] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for disabling buttons

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
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };
    console.log(houseKeepingOnlineStatus, "houseKeepingOnlineStatus")
    useEffect(() => {
        fetchOrders();
    }, []);
    useEffect(() => {
        houseKeepingUserStatus();
    }, [pantryData]);

    const houseKeepingUserStatus = () => {
        console.log(pantryData, "pantryData")
        if (pantryData) {
            const userOnline = pantryData?.staff_online.find((item) => item.user_id == userID);
            if (userOnline) {
                setHouseKeepingOnlineStatus(true);
            }
        }
    };

    const handleOnlineStatus = async () => {
        try {
            const newPantry = {
                user_id: userID,
                pentry_id: pantryData?._id,
                ...(houseKeepingOnlineStatus ? { status: 0 } : {}),

                // add other fields as needed
            };
            console.log(houseKeepingOnlineStatus, "houseKeepingOnlineStatus")
            // The unwrap() method returns a promise that resolves with the actual response or rejects with an error.
            if (houseKeepingOnlineStatus) {

                const response = await offlineFromPantry(newPantry).unwrap();
                if (response.success) {

                    setHouseKeepingOnlineStatus(false);
                }

            } else {
                const response = await createPantry(newPantry).unwrap();
                console.log(response, "response")
                if (response.success) {


                    setHouseKeepingOnlineStatus(true);
                }
            }
            console.log(houseKeepingOnlineStatus, "houseKeepingOnlineStatus - 2")
            houseKeepingUserStatus();
        } catch (err) {
            console.error("Error creating pantry:", err);
        }
    };
    const alertSound = new Audio("https://www.myinstants.com/media/sounds/alarm.mp3"); // Replace with your sound file

    useEffect(() => {
        const socket = io(socketBaseUrl, {
            transports: ["websocket"], // Force websocket, avoid polling
            withCredentials: true,
            reconnectionAttempts: 5,
            timeout: 5000,
        });

        // Listening for messages from server
        if (isPantryRoute) {
            socket.on("orderGenerated", (message) => {
                setOrder(message);
                console.log("event trigger", message);
                setOrderDialog(true);
                alertSound.play();
            });
            return () => {
                socket.off("orderGenerated");
                $("#newOrderModal").off("hidden.bs.modal"); // Cleanup modal event listener
            };
        }
    }, []);

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
                console.log("Updated Pantry:", res.data);
            }
        } catch (err) {
            console.error("Update Error:", err);
        } finally {
            // Re-enable the button after the request completes
            setIsButtonDisabled(false);
        }
    };

    return (
        <>
            <div className="hkWrapper">
                <div className="hkHeader">
                    <div className="hkTitle">
                        <div className="hkImg">
                            <img src="https://storage.googleapis.com/node-dev-bucket/1737022468468.jpg" alt="User" />
                        </div>
                        <div className="hkName">
                            <h2>{userName}</h2>
                            <h4>
                                <span>Emp ID : </span>{userID}
                            </h4>
                        </div>
                    </div>
                    <div className="hkAction">
                        <div className="statusToggle">
                            <button
                                type="button"
                                className={`btn btn-lg btn-toggle ${houseKeepingOnlineStatus ? 'active' : ''}`}
                                data-toggle="button"
                                aria-pressed={houseKeepingOnlineStatus}
                                autoComplete="off"
                                onClick={() => handleOnlineStatus()}
                            >
                                <div className="switch"></div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="orderWrapper">
                    <div className="orderItemsListing">
                        {recentOrder.map((orderDetail) => (
                            <div className="orderItem" key={orderDetail._id}>
                                <div className="orderUserInfo">
                                    <div className="orderUser">
                                        <div className="orderUserImg">
                                            <img src="https://storage.googleapis.com/node-dev-bucket/1737022468468.jpg" alt="Order" />
                                        </div>
                                        <div className="orderUserName">
                                            <h2>{orderDetail?.user_name}</h2>
                                            <ul>
                                                <li>
                                                    <span>Room : </span>{orderDetail?.room_id}
                                                </li>
                                                <li>
                                                    <span>Seat : </span>{orderDetail?.seat_id}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="orderId">
                                        <h4>
                                            <span>Order ID </span>{orderDetail?.order_id}
                                        </h4>
                                    </div>
                                </div>

                                <div className="orderRemark">
                                    <p>{orderDetail?.order_type == 1 ? "Please refill Water Bottle" : orderDetail?.order_type == 2 ? "Housekeeping" :
                                        orderDetail?.order_items.map(res => `${res.quantity} ${formatString(res.item_name)}, `)}</p>
                                </div>
                                <div className="orderAction">
                                    {orderDetail?.order_status === 1 && (
                                        <button
                                            className="btn cmnbtn btn_sm btn-success"
                                            disabled={isButtonDisabled}
                                            onClick={() => handleOrderDeliveredCancelled(orderDetail, 3)}
                                        >
                                            Delivered
                                        </button>
                                    )}
                                    {orderDetail?.order_status === 1 && (
                                        <button
                                            className="btn cmnbtn btn_sm btn-danger"
                                            disabled={isButtonDisabled}
                                            onClick={() => handleOrderDeliveredCancelled(orderDetail, 4)}
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
        </>
    );
}

export default PantryUserDashboard;
