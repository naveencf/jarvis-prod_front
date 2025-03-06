import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useGlobalContext } from "../../../../Context/Context";
import { baseUrl } from "../../../../utils/config";
import FieldContainer from "../../FieldContainer";

const ScrapReusable = ({ isModalOpenSend, onClose, rowData, getData }) => {
  const { toastAlert } = useGlobalContext();
  const [scrapDate, setScrapDate] = useState("");
  const [scrapRemark, setScrapRemark] = useState("");

  console.log(rowData, "ok row data hai");
  const handleSubmitScrap = async () => {
    try {
      await axios.put(baseUrl + "update_sim", {
        id: rowData.sim_id,
        status: "Scrap",
        all_status_date: scrapDate,
        all_status_remark: scrapRemark,
      });

      await axios.put(baseUrl + "update_allocationsim", {
        sim_id: rowData.sim_id,
        allo_id: rowData.allo_id,
        status: "Scrap",
        // submitted_by: userID,
        // Last_updated_by: userID,
        // Reason: returnRecoverRemark,
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
          <h3>Scrap Asset</h3>
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
            value={scrapDate}
            onChange={(e) => setScrapDate(e.target.value)}
            fieldGrid={12}
          />
          <FieldContainer
            label="Scrap Remark"
            Tag="textarea"
            value={scrapRemark}
            onChange={(e) => setScrapRemark(e.target.value)}
            fieldGrid={12}
          />
        </div>
        <button className="btn btn-success ml-3" onClick={handleSubmitScrap}>
          Submit
        </button>
      </div>
      {/* )} */}
    </Modal>
  );
};

export default ScrapReusable;
