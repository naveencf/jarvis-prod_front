import { useState, React } from "react";
import axios from "axios";
import { FcDownload } from "react-icons/fc";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import ApproveReject from "./ApproveReject";
import Tab4DocumentCard from "./Tab4DocumentCard";
import { baseUrl } from "../../../utils/config";

const UserSingleTab4 = ({ user, id, getData }) => {
  const whatsappApi = WhatsappAPI();
  const [panReason, setPanReason] = useState("");
  const [panReasonActive, setPanReasonActive] = useState(false);

  const [uidReason, setUidReason] = useState("");
  const [uidReasonActive, setUidReasonActive] = useState(false);

  const [tenthMarksheetReason, setTenthMarksheetReason] = useState("");
  const [tenthMarksheetReasonActive, setTenthMarksheetReasonActive] =
    useState(false);

  const [twelfthMarksheetReason, setTwelfthMarksheetReason] = useState("");
  const [twelfthMarksheetReasonActive, setTwelfthMarksheetReasonActive] =
    useState(false);

  const [UGMarksheetReason, setUGMarksheetReason] = useState("");
  const [UGMarksheetReasonActive, setUGMarksheetReasonActive] = useState(false);

  const [passportReason, setPassportReason] = useState("");
  const [passportReasonActive, setPassportReasonActive] = useState(false);

  const [preOfferLetterReason, setPreviousOfferLetterReason] = useState("");
  const [preOfferLetterReasonActive, setPreviousOfferLetterReasonActive] =
    useState(false);

  const [preExpLetterReason, setPreExpLetterReason] = useState("");
  const [preExpLetterReasonActive, setPreExpLetterReasonActive] =
    useState(false);

  const [preRelievingLetterReason, setPreRelievingLetter] = useState("");
  const [preRelievingLetterReasonActive, setPreRelievingLetterActive] =
    useState(false);

  const [bankPassChequeReason, setBankPassChequeReason] = useState("");
  const [bankPassChequeReasonActive, setBankPassChequeReasonActive] =
    useState(false);

  const handleVerification = (
    e,
    fieldName,
    action,
    reasonField,
    reason,
    emptyState,
    hideField
  ) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("user_id", Number(id));
    formData.append(fieldName, action);
    if (emptyState && hideField) {
      formData.append(reasonField, reason);
    }

    axios({
      method: "put",
      url: baseUrl + "update_user",
      data: formData,
    }).then(() => {
      if (emptyState) emptyState("");
      if (hideField) hideField(false);
    });
    const constaWhatsapp = user.user_contact_no + "";
    whatsappApi
      .callWhatsAPI("CF_Upload_verification", constaWhatsapp, user.user_name, [
        user.user_name,
      ])
      .then(() => getData())
      .then(() => {
        e.preventDefault();
        axios
          .post(baseUrl + "add_send_user_mail", {
            email: fetchedData[0].user_email_id,
            subject: "User Onboard",
            text: "Your Some Document is not clear Plzz Upload Again",
            attachment: "profile",
            login_id: user.user_login_id,
            name: user.user_name,
            password: user.user_login_password,
          })
          .then((res) => {
            console.log("Email sent successfully:", res.data);
          })
          .catch((error) => {
            console.log("Failed to send email:", error);
          });
      });
  };

  return (
    <>
      <div className="documentCard_view">
        <div className="row align-items-baseline">
          {user.image_url && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card documentCard_bx">
                <div className="card-body">
                  <div className="img-thumbnail">
                    <img
                      className="img-fluid"
                      src={user.image_url}
                      alt="user_photo"
                    />
                  </div>
                  <div className="documentCard_text">
                    <h3>Image</h3>
                  </div>
                </div>
              </div>
            </div>
          )}
          {user.pan_url && (
            <Tab4DocumentCard
              documentTitle="PAN"
              documentUrl={user.pan_url}
              validationState={user.pan_validate}
              onApprove={(e) =>
                handleVerification(e, "pan_validate", "Approve")
              }
              onReject={() => setPanReasonActive(true)}
              rejectReasonActive={panReasonActive}
              rejectReason={panReason}
              onRejectReasonChange={(e) => setPanReason(e.target.value)}
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "pan_validate",
                  "Reject",
                  "pan_remark",
                  panReason,
                  setPanReason,
                  setPanReasonActive
                )
              }
            />
          )}

          {user.uid_url && (
            <Tab4DocumentCard
              documentTitle="UID"
              documentUrl={user.uid_url}
              validationState={user.uid_validate}
              onApprove={(e) =>
                handleVerification(e, "uid_validate", "Approve")
              }
              onReject={() => setUidReasonActive(true)}
              rejectReasonActive={uidReasonActive}
              rejectReason={uidReason}
              onRejectReasonChange={(e) => setUidReason(e.target.value)}
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "uid_validate",
                  "Reject",
                  "uid_remark",
                  uidReason,
                  setUidReason,
                  setUidReasonActive
                )
              }
            />
          )}
          {/* rest */}
          {user.tenth_marksheet_url && (
            <Tab4DocumentCard
              documentTitle="X Marksheet"
              documentUrl={user.tenth_marksheet_url}
              validationState={user.tenth_marksheet_validate}
              onApprove={(e) =>
                handleVerification(e, "tenth_marksheet_validate", "Approve")
              }
              onReject={() => setTenthMarksheetReasonActive(true)}
              rejectReasonActive={tenthMarksheetReasonActive}
              rejectReason={tenthMarksheetReason}
              onRejectReasonChange={(e) =>
                setTenthMarksheetReason(e.target.value)
              }
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "tenth_marksheet_validate",
                  "Reject",
                  "tenth_marksheet_validate_remark",
                  tenthMarksheetReason,
                  setTenthMarksheetReason,
                  setTenthMarksheetReasonActive
                )
              }
            />
          )}

          {user.twelveth_marksheet_url && (
            <Tab4DocumentCard
              documentTitle="XII Marksheet"
              documentUrl={user.twelveth_marksheet_url}
              validationState={user.twelveth_marksheet_validate}
              onApprove={(e) =>
                handleVerification(e, "twelveth_marksheet_validate", "Approve")
              }
              onReject={() => setTwelfthMarksheetReasonActive(true)}
              rejectReasonActive={twelfthMarksheetReasonActive}
              rejectReason={twelfthMarksheetReason}
              onRejectReasonChange={(e) =>
                setTwelfthMarksheetReason(e.target.value)
              }
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "twelveth_marksheet_validate",
                  "Reject",
                  "twelveth_marksheet_validate_remark",
                  twelfthMarksheetReason,
                  setTwelfthMarksheetReason,
                  setTwelfthMarksheetReasonActive
                )
              }
            />
          )}

          {user.UG_Marksheet_url && (
            <Tab4DocumentCard
              documentTitle="UG Marksheet"
              documentUrl={user.UG_Marksheet_url}
              validationState={user.UG_Marksheet_validate}
              onApprove={(e) =>
                handleVerification(e, "UG_Marksheet_validate", "Approve")
              }
              onReject={() => setUGMarksheetReasonActive(true)}
              rejectReasonActive={UGMarksheetReasonActive}
              rejectReason={UGMarksheetReason}
              onRejectReasonChange={(e) => setUGMarksheetReason(e.target.value)}
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "UG_Marksheet_validate",
                  "Reject",
                  "UG_Marksheet_validate_remark",
                  UGMarksheetReason,
                  setUGMarksheetReason,
                  setUGMarksheetReasonActive
                )
              }
            />
          )}

          {user.pasport_url && (
            <Tab4DocumentCard
              documentTitle="Passport"
              documentUrl={user.pasport_url}
              validationState={user.passport_validate}
              onApprove={(e) =>
                handleVerification(e, "passport_validate", "Approve")
              }
              onReject={() => setPassportReasonActive(true)}
              rejectReasonActive={passportReasonActive}
              rejectReason={passportReason}
              onRejectReasonChange={(e) => setPassportReason(e.target.value)}
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "passport_validate",
                  "Reject",
                  "passport_validate_remark",
                  passportReason,
                  setPassportReason,
                  setPassportReasonActive
                )
              }
            />
          )}

          {user.pre_off_letter_url && (
            <Tab4DocumentCard
              documentTitle="Previous Company Offer Letter"
              documentUrl={user.pre_off_letter_url}
              validationState={user.pre_off_letter_validate}
              onApprove={(e) =>
                handleVerification(e, "pre_off_letter_validate", "Approve")
              }
              onReject={() => setPreviousOfferLetterReasonActive(true)}
              rejectReasonActive={preOfferLetterReasonActive}
              rejectReason={preOfferLetterReason}
              onRejectReasonChange={(e) =>
                setPreviousOfferLetterReason(e.target.value)
              }
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "pre_off_letter_validate",
                  "Reject",
                  "pre_off_letter_validate_remark",
                  preOfferLetterReason,
                  setPreviousOfferLetterReason,
                  setPreviousOfferLetterReasonActive
                )
              }
            />
          )}
          {user.pre_expe_letter_url && (
            <Tab4DocumentCard
              documentTitle="Experience Letter"
              documentUrl={user.pre_expe_letter_url}
              validationState={user.pre_expe_letter_validate}
              onApprove={(e) =>
                handleVerification(e, "pre_expe_letter_validate", "Approve")
              }
              onReject={() => setPreExpLetterReasonActive(true)}
              rejectReasonActive={preExpLetterReasonActive}
              rejectReason={preExpLetterReason}
              onRejectReasonChange={(e) =>
                setPreExpLetterReason(e.target.value)
              }
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "pre_expe_letter_validate",
                  "Reject",
                  "pre_expe_letter_validate_remark",
                  preExpLetterReason,
                  setPreExpLetterReason,
                  setPreExpLetterReasonActive
                )
              }
            />
          )}

          {user.Pre_relieving_letter_url && (
            <Tab4DocumentCard
              documentTitle="Relieving Letter"
              documentUrl={user.Pre_relieving_letter_url}
              validationState={user.pre_relieving_letter_validate}
              onApprove={(e) =>
                handleVerification(
                  e,
                  "pre_relieving_letter_validate",
                  "Approve"
                )
              }
              onReject={() => setPreRelievingLetterActive(true)}
              rejectReasonActive={preRelievingLetterReasonActive}
              rejectReason={preRelievingLetterReason}
              onRejectReasonChange={(e) =>
                setPreRelievingLetterReason(e.target.value)
              }
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "pre_relieving_letter_validate",
                  "Reject",
                  "pre_relieving_letter_validate_remark",
                  preRelievingLetterReason,
                  setPreRelievingLetterReason,
                  setPreRelievingLetterActive
                )
              }
            />
          )}

          {user.bankPassBook_Cheque_url && (
            <Tab4DocumentCard
              documentTitle="Bank Passbook/Cheque"
              documentUrl={user.bankPassBook_Cheque_url}
              validationState={user.bankPassBook_Cheque_validate}
              onApprove={(e) =>
                handleVerification(e, "bankPassBook_Cheque_validate", "Approve")
              }
              onReject={() => setBankPassChequeReasonActive(true)}
              rejectReasonActive={bankPassChequeReasonActive}
              rejectReason={bankPassChequeReason}
              onRejectReasonChange={(e) =>
                setBankPassChequeReason(e.target.value)
              }
              onRejectSubmit={(e) =>
                handleVerification(
                  e,
                  "bankPassBook_Cheque_validate",
                  "Reject",
                  "bankPassBook_Cheque_validate_remark",
                  bankPassChequeReason,
                  setBankPassChequeReason,
                  setBankPassChequeReasonActive
                )
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserSingleTab4;
