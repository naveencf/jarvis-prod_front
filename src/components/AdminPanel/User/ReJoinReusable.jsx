import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";

const ReJoinReusable = ({ reJoinModalOpen, reJoinClose, id, getData }) => {
  const { toastAlert } = useGlobalContext();
  const [reJoinDate, setReJoinDate] = useState("");

  const handleSubmitRejoin = async () => {
    try {
      await axios.put(baseUrl + "rejoin_user", {
        user_id: id,
        joining_date: reJoinDate,
      });
      getData();
      reJoinClose();
      toastAlert("Re-Join Successfully");
    } catch {}
  };

  return (
    <Modal
      isOpen={reJoinModalOpen}
      onRequestClose={reJoinClose}
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
          <h3>Re-Join User</h3>
          <div className="d-flex">
            <button className="btn btn-danger" onClick={reJoinClose}>
              X
            </button>
          </div>
        </div>
        <div>
          <FieldContainer
            label="Re-Joining Date"
            type="date"
            value={reJoinDate}
            onChange={(e) => setReJoinDate(e.target.value)}
            fieldGrid={12}
          />
        </div>
        <button className="btn btn-success ml-3" onClick={handleSubmitRejoin}>
          Submit
        </button>
      </div>
      {/* )} */}
    </Modal>
  );
};

export default ReJoinReusable;
