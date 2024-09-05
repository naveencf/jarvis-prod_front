import React, { useEffect, useState } from "react";
import FieldContainer from "../AdminPanel/FieldContainer";
import Modal from "react-modal";
import Select from "react-select";
import { baseUrl } from "../../utils/config";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";

const AssetSendToVendorReusable = ({
  isModalOpenSend,
  onClose,
  rowData,
  getData,
}) => {
  const { toastAlert } = useGlobalContext();
  const [vendorName, setVendorName] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [sendByData, setSendByData] = useState([]);
  const [sendDate, setSendDate] = useState("");
  const [sendBYName, setSendBYName] = useState("");
  const [expectedDate, setExpectedDate] = useState("");

  const SendBYDatas = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_hr");
      setSendByData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const vendorDatas = async () => {
    try {
      const response = await axios.get(baseUrl + "get_all_vendor");
      setVendorData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    vendorDatas();
    SendBYDatas();
  }, []);

  const handleSubmitVendor = async () => {
    try {
      await axios.post(baseUrl + "vendorsum", {
        sim_id: rowData?.sim_id,
        vendor_id: vendorName,
        send_by: sendBYName,
        send_date: sendDate,
        expected_date_of_repair: expectedDate,
        vendor_status: 1,
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
          height: "50%",
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
          {/* <h2>Department: {selectedRow.dept_name}</h2> */}
          <h3>Send To Vendor</h3>
          <div className="d-flex">
            <button className="btn btn-danger" onClick={onClose}>
              X
            </button>
          </div>
        </div>
        <div>
          <div className="form-group ">
            <label className="form-label">
              Vendor Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={vendorData.map((opt) => ({
                value: opt.vendor_id,
                label: opt.vendor_name,
              }))}
              value={{
                value: vendorName,
                label:
                  vendorData.find((user) => user.vendor_id === vendorName)
                    ?.vendor_name || "",
              }}
              onChange={(e) => {
                setVendorName(e.value);
              }}
              required
            />
          </div>
          <FieldContainer
            label="Send Date"
            type="date"
            value={sendDate}
            onChange={(e) => setSendDate(e.target.value)}
            fieldGrid={12}
          />
          <div className="form-group">
            <label className="form-label">
              Send By Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={sendByData.map((opt) => ({
                value: opt.user_id,
                label: opt.user_name,
              }))}
              value={{
                value: sendBYName,
                label:
                  sendByData.find((user) => user.user_id === sendBYName)
                    ?.user_name || "",
              }}
              onChange={(e) => {
                setSendBYName(e.value);
              }}
              required
            />
          </div>
          <FieldContainer
            label="Expected Date"
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            fieldGrid={12}
          />
        </div>
        <button className="btn btn-success ml-3" onClick={handleSubmitVendor}>
          Submit
        </button>
      </div>
      {/* )} */}
    </Modal>
  );
};

export default AssetSendToVendorReusable;
