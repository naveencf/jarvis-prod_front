import React from 'react'
import successIcon from "../../assets/img/icon/success.png";
import errorIcon from "../../assets/img/icon/error.png";
import Modal from "react-modal";
import { useEffect } from 'react';

function OrderDialog({ orderConfirmationDialog, setOrderConfirmationDialog, dialogType }) {
    console.log("dialog called")
    // Auto-close after 2 seconds when opened
    useEffect(() => {
        if (orderConfirmationDialog) {
            const timer = setTimeout(() => {
                closeModal();
            }, 1000);

            return () => clearTimeout(timer); // cleanup on unmount
        }
    }, [orderConfirmationDialog]);

    const closeModal = () => {
        setOrderConfirmationDialog(false)
    }
    return (
        <>
            <Modal
                className="salesModal"
                isOpen={orderConfirmationDialog}
                onRequestClose={closeModal}
                contentLabel="modal"
                preventScroll={true}
                shouldCloseOnOverlayClick={false}
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
                <div className="d-flex">
                    <div className="icon-1 flex-end" onClick={() => closeModal()}>
                        <i className="bi bi-x" />
                    </div>
                </div>

                {dialogType == 1 ? <div className="alertModalContent">
                    <img src={successIcon} alt="icon" />
                    <h2>Success</h2>
                    {dialogType == 1 ? <h6>Order Delivered Successfully</h6> :
                        <h6>Order Cancel Successfully</h6>}
                </div> :
                    <div className="alertModalContent">
                        <img src={errorIcon} alt="icon" />
                        <h2>Error</h2>
                        <h6>Opps there is some error.</h6>
                    </div>}
            </Modal>

        </>
    )
}

export default OrderDialog