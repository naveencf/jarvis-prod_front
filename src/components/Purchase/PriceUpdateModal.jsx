import { Modal, Button, Table } from "react-bootstrap";

const PriceUpdateModal = ({ selectedData, price, pricePerMillion, onConfirm, onClose }) => {
    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Preview Selected Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Short Code</th>
                            <th>Amount</th>
                            <th>Page Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedData?.map((item, index) => {
                            const followerCount = item?.owner_info?.followers ? item.owner_info.followers / 1000000 : 0;
                            const calculatedPrice = price ? price : Math.floor(pricePerMillion * followerCount);
                            const displayPrice = isNaN(calculatedPrice) || !item?.owner_info?.followers
                                ? "Follower Not Available"
                                : calculatedPrice;

                            return (    
                                <tr key={index}>
                                    <td>{item?.vendor_name}</td>
                                    <td>{item?.shortCode}</td>
                                    <td>{price !== ""? price: displayPrice}</td>
                                    <td>{item?.page_name}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <p><strong>Price:</strong> {price}</p>
                <p><strong>Price Per Million:</strong> {pricePerMillion}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onConfirm}>Confirm & Update</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PriceUpdateModal;
