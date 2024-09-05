import React, { useEffect, useState } from "react";
import FieldContainer from "../AdminPanel/FieldContainer";
import Modal from "react-modal";
import { baseUrl } from "../../utils/config";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";

const ReciveToVendorReusable = ({
  isModalOpenSend,
  onClose,
  rowData,
  getData,
}) => {
  const { toastAlert } = useGlobalContext();
  const [vendorReciveDate, setVendorReciveDate] = useState("");
  const [vendorReciveRemark, setVendorReciveRemark] = useState("");

  const handleSubmitReciveVendor = async () => {
    try {
      await axios.put(baseUrl + "vendorsum", {
        id: rowData.sim_id,
        vendor_recieve_date: vendorReciveDate,
        vendor_recieve_remark: vendorReciveRemark,
        vendor_status: 0,
      });
      getData();
      onClose();
      toastAlert("Status Updated");
    } catch {}
  };

  return (
    <Modal
      isOpen={isModalOpenSend}
      onRequestClose={onClose}
      style={{
        content: {
          width: "30%",
          height: "40%",
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      {/* {selectedRow && ( */}
      <div>
        <div className="d-flex justify-content-between mb-2">
          <h3>Recive From Vendor</h3>
          <div className="d-flex">
            <button className="btn btn-danger" onClick={onClose}>
              X
            </button>
          </div>
        </div>
        <div>
          <FieldContainer
            label="Scrap Date"
            type="date"
            value={vendorReciveDate}
            onChange={(e) => setVendorReciveDate(e.target.value)}
            fieldGrid={12}
          />
          <FieldContainer
            label="Scrap Remark"
            Tag="textarea"
            value={vendorReciveRemark}
            onChange={(e) => setVendorReciveRemark(e.target.value)}
            fieldGrid={12}
          />
        </div>
        <button
          className="btn btn-success ml-3"
          onClick={handleSubmitReciveVendor}
        >
          Submit
        </button>
      </div>
      {/* )} */}
    </Modal>
  );
};

export default ReciveToVendorReusable;
