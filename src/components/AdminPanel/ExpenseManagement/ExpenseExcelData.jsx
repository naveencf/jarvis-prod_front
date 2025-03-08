import axios from "axios";
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { baseUrl } from "../../../utils/config";

const ExpenseExcelData = ({ show, handleClose, data }) => {
  console.log(data, "data excel ");



  const handleAccept = () => {
    if (data.length > 0) {
      // for(let i = 0; i< data.length; i++){
      const res = axios.post(`${baseUrl}add_multiple_expense`, data)
      // }
    }
    // console.log("n ew");
  }
  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Uploaded Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Account Name</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Reference No.</th>
                <th>Major Status</th>
                <th>Minor Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.account_name}</td>
                  <td>{row.description}</td>
                  <td>{row.amount}</td>
                  <td>{new Date(row.transaction_date).toLocaleDateString()}</td>
                  <td>{row.category_name}</td>
                  <td>{row.reference_number}</td>
                  <td>{row.major_status}</td>
                  <td>{row.minor_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleAccept}> Accept </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenseExcelData;
