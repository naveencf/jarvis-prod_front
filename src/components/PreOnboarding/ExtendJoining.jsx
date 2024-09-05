import { useState } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import { useGlobalContext } from "../../Context/Context";
import WhatsappAPI from "../WhatsappAPI/WhatsappAPI";
import { baseUrl } from "../../utils/config";
import { FaCloudUploadAlt } from "react-icons/fa";

const url = baseUrl + "";

const ExtendJoining = ({
  gettingData,
  id,
  currentJoiningDate,
  loginId,
  username,
  password,
  closeModal,
}) => {
  const { toastAlert } = useGlobalContext();
  const whatsappApi = WhatsappAPI();
  const [joingingExtendDate, setJoiningExtendDate] = useState("");
  const [joiningExtendReason, setJoiningExtendReason] = useState("");
  const [joingingExtendDocument, setJoiningExtendDocument] = useState(null);
  const [joiningDateError, setJoiningDateError] = useState("");
  const [joiningReasonError, setJoiningReasonError] = useState("");

  const calculateMinDate = (dateStr) => {
    const parts = dateStr.split("-");
    const inputDate = new Date(parts[1], parts[1] - 1, parts[0]);
    inputDate.setDate(inputDate.getDate() + 30);
    return `${inputDate.getFullYear()}-${(inputDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${inputDate.getDate().toString().padStart(2, "0")}`;
  };

  const minDateFormatted = calculateMinDate(currentJoiningDate);

  const handleJoiningExtend = async (e) => {
    e.preventDefault();

    setJoiningDateError("");
    setJoiningReasonError("");

    let hasErrors = false;

    if (!joingingExtendDate.trim()) {
      setJoiningDateError("Joining date is required.");
      hasErrors = true;
    } else {
      const currentDate = new Date();
      const selectedDate = new Date(joingingExtendDate);
      if (selectedDate < currentDate) {
        setJoiningDateError("Joining date cannot be in the past.");
        hasErrors = true;
      }
    }

    if (!joiningExtendReason.trim()) {
      setJoiningReasonError(
        "Reason for extending the joining date is required."
      );
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("joining_date_extend", joingingExtendDate);
    formData.append("joining_date_extend_status", "Requested");
    formData.append("joining_date_extend_reason", joiningExtendReason);
    if (joingingExtendDocument) {
      formData.append("joining_extend_document", joingingExtendDocument);
    }

    try {
      await axios.put(`${url}update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const emailResponse = axios.post(`${url}add_send_user_mail`, {
        email: "lalit@creativefuel.io",
        subject: "User Pre Onboarding Extend Date",
        text: joiningExtendReason,
        attachment: "",
        login_id: loginId,
        name: username,
        password: password,
      });
      console.log("Email sent successfully:", emailResponse.data);

      // Call WhatsApp API
      whatsappApi.callWhatsAPI(
        "CF_Extend_request_new",
        "9826116769",
        username,
        [username, joingingExtendDate.split("-").reverse().join("-")]
      );

      setJoiningExtendDate("");
      setJoiningExtendReason("");
      setJoiningExtendDocument(null);
      setJoiningDateError("");
      setJoiningReasonError("");
      gettingData();
      closeModal();
      toastAlert("Joining date requested successfully");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <form className="extendDateForm">
        <div className="formarea">
          <div className="row spacing_lg">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
              <div className="board_form">
                <div className="form-group">
                  <TextField
                    id="outlined-basic"
                    label="Extend To"
                    variant="outlined"
                    type="date"
                    required
                    value={joingingExtendDate}
                    onChange={(e) => setJoiningExtendDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: minDateFormatted,
                    }}
                    error={!!joiningDateError}
                    helperText={joiningDateError}
                  />
                </div>

                <div className="form-group">
                  <TextField
                    required
                    id="outlined-basic"
                    label="Reason"
                    variant="outlined"
                    type="text"
                    value={joiningExtendReason}
                    onChange={(e) => setJoiningExtendReason(e.target.value)}
                    error={!!joiningReasonError}
                    helperText={joiningReasonError}
                  />
                </div>

                <div className="form-group">
                  <ul className="doc_items_list">
                    <li
                      className={
                        joingingExtendDocument
                          ? "doc_item doc_item_active"
                          : "doc_item"
                      }
                    >
                      <p>
                        <FaCloudUploadAlt style={{ fontSize: "35px" }} /> Upload
                        Reason file
                      </p>
                      <input
                        type="file"
                        value=""
                        onChange={(e) =>
                          setJoiningExtendDocument(e.target.files[0])
                        }
                      />
                      <span
                        className="delete"
                        onClick={() => setJoiningExtendDocument(null)}
                      >
                        <a href="#">
                          <i className="bi bi-x-lg" />
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* {allUserData?.joining_date_extend_status == "Reject" && (
              <h1>
                Request Rejected: {allUserData?.joining_date_extend_reason}
              </h1>
            )} */}
            <div className="col-12 d-flex justify-content-center gap-3">
              <div className="form-group mb-0 text-center">
                <button
                  className="btn onboardBtn btn_primary mw_auto"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
              <div className="form-group mb-0 text-center">
                <button
                  className="btn onboardBtn btn_secondary mw_auto"
                  onClick={handleJoiningExtend}
                >
                  Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ExtendJoining;
