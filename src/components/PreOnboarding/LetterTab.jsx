import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import DigitalSignature from "../DigitalSignature/DigitalSignature";
import { TextField } from "@mui/material";
import { FcDownload } from "react-icons/fc";
import { baseUrl } from "../../utils/config";
import html2pdf from "html2pdf.js";
import logo from "/logo.png";
import DateISOtoNormal from "../../utils/DateISOtoNormal";
import LetterTablePreview1 from "./LetterTab/LetterTablePreview1WithPF";
import LetterTabPdf1 from "./LetterTab/LetterTabPdf1WithPF";
import LetterTabPdf1WithPF from "./LetterTab/LetterTabPdf1WithPF";
import LetterTablePreview1WithPF from "./LetterTab/LetterTablePreview1WithPF";
import LetterTabPreviewWIthPFandESIC from "./LetterTab/LetterTabPreviewESIC";
import LetterTabPreviewInHand from "./LetterTab/LetterTabPreviewESIC";
import LetterTablePreviewMinSalaryInHand from "./LetterTab/LetterTablePreviewMinSalaryInHand";
import LetterTablePreviewMaxSalaryInHand from "./LetterTab/LetterTablePreviewMax";
import LetterTabPreviewESIC from "./LetterTab/LetterTabPreviewESIC";
import LetterTabPdf2Max from "./LetterTab/LetterTabPdf2Max";
import LetterTabPdf3Min from "./LetterTab/LetterTabPdf3Min";
import LetterTabPdf4ESIC from "./LetterTab/LetterTabPdf4ESIC";
import PDFFooter from './PDFFooter.jsx';
import PDFHeader from './PDFHeader.jsx';
import { BlobProvider, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import OfferLetter from "./OfferLetter.jsx";
import AppointmentLetter from "./AppointmentLetter.jsx";





const LetterTab = ({ allUserData, gettingData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reasonField, setReasonField] = useState(false);
  const [reason, setReason] = useState("");
  const [image64, setImage64] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [previewOffer, setpreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);


  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const todayDate = `${year}-${month}-${day}`;
  console.log(todayDate , 'todya datte is not')

  const UserDetails = allUserData;
  const handleReject = () => {
    const formData = new FormData();
    formData.append("user_id", allUserData.user_id);
    formData.append("offer_later_status", false);
    formData.append("offer_later_reject_reason", reason);
    axios
      .put(`${baseUrl}` + `update_user`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        gettingData();
        setReason("");
      });
  };

  let salary = UserDetails?.salary;
  let basicSalary = salary * 0.6;
  let basicsal = (basicSalary < 12300 ? salary * 0.8 : basicSalary).toFixed(
      0
  );
  let EmployeePF = parseFloat(
    (basicsal <= 14999 ? basicsal * 0.12 : 1800).toFixed(0)
);

let EmployeerESIC = 0;

if (salary <= 21000 && allUserData.emergency_contact_person_name2 === "pf_and_esic" ) {
  EmployeerESIC = parseFloat(((salary * 3.25) / 100).toFixed(0));
}
const EMPPF = allUserData.emergency_contact_person_name2 === "pf_and_esic" 
  ? (EmployeePF * 12 + (salary <= 21000 ? EmployeerESIC * 12 : 0)) 
  : 0;

  const handelClose = () => {
    setpreview(!previewOffer);
  };

  const downloadOfferLetter = () => {
    setIsLoading(true);
    var element = document.getElementById("element-to-print");
    var opt = {
      margin: 1,
      filename: `${allUserData.user_name}_offer_letter.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();

    // --------------------------------------------------------------

    var element = document.getElementById("element-to-print");
    var opt = {
      margin: 1,
      filename: `${allUserData.user_name}_offer_letter.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        var pdfData = new FormData();
        pdfData.append(
          "attachment",
          pdf.output("blob"),
          `${allUserData.user_name}_offer_letter.pdf`
        );
        pdfData.append("email_id", allUserData.PersonalEmail);
        pdfData.append("user_id", parseInt(allUserData.user_id));
        setIsLoading(false);
        axios
          .post(baseUrl + "offer_letter_send_in_mail", pdfData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.error(error);
          })
          .finally(() => {
            setIsLoading(false); // Set loading state to false after the download process completes
          });
      });
  };

  axios
    .post(baseUrl + "image_to_base64", {
      imageUrl: allUserData.digital_signature_image_url,
    })
    .then((response) => {
      setImage64(response.data.base64String);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  return (
    <>
      <div className="letterBoardContainer">
        <div className="cardBoard">
          <div className="cardBodyBoard">
            <div className="letterBoard">
              <div className="thm_textbx">
                {allUserData.offer_later_status ? (
                  <p>
                    <span className="bold">
                      {" "}
                      Congratulations on accepting the offer letter and becoming
                      a part of Creativefuel team! Your offer letter has been
                      sent to your email address
                    </span>{" "}
                    <br />
                  </p>
                ) : (
                  <p>
                    Hello, <span className="bold">{allUserData.user_name}</span>
                    , Welcome to Creativefuel - The home to the most vibrant &
                    talented individuals! <br /> <br /> We're to have you join
                    our team of Meme Enthusiasts & Coffee Addicts as a{" "}
                    <span className="bold">
                      {allUserData.designation_name}{" "}
                    </span>
                    {/* ! We believe that your experience & skills will be a great
                    asset to our organisation. <br /> <br /> Congratulations on
                    your new role, and cheers to a journey full of excitement,
                    growth & achievement! */}
                  </p>
                )}
              </div>

              {/* <span onClick={downloadOfferLetter} className="btn btn-outline-primary">
          <FcDownload />
          Download
        </span> */}

              <div className="letterAction">
                {allUserData.offer_later_status == false &&
                  allUserData.offer_later_reject_reason == "" && (
                    <div className="letterStatus">
                      <button
                        className="btn onboardBtn btn_primary"
                        onClick={() => {
                          setIsModalOpen(true), setReasonField(false);
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="btn onboardBtn btn_secondary"
                        onClick={() => {
                          setpreview(true);
                        }}
                      >
                        Preview
                      </button>
                      {/* <button
                  className="btn btn-danger"
                  onClick={() => setReasonField(true)}
                >
                  Reject
                </button> */}
                    </div>
                  )}

                {allUserData.offer_later_reject_reason !== "" && (
                  <p>Reject Reason - {allUserData.offer_later_reject_reason}</p>
                )}
                {allUserData.offer_later_status && (<>
                  <PDFDownloadLink

                    className="btn onboardBtn btn_primary d-flex align-items-center gap-2"
                    document={<OfferLetter allUserData={allUserData} image64={image64} EMPPF={EMPPF}/>} fileName="OfferLetter.pdf">


                    <i className="bi bi-cloud-arrow-down"></i>

                    Download Offer Letter
                  </PDFDownloadLink>
                  <PDFDownloadLink

                    className="btn onboardBtn btn_primary d-flex align-items-center gap-2"
                    document={<AppointmentLetter allUserData={allUserData} image64={image64} EMPPF={EMPPF}/>} fileName="AppointmentLetter.pdf">


                    <i className="bi bi-cloud-arrow-down"></i>

                    Download Appointment Letter
                  </PDFDownloadLink>
                </>
                )}

                {reasonField && (
                  <>
                    {allUserData.offer_later_reject_reason == "" && (
                      <div className="rejectReason board_form">
                        <div className="form-group">
                          <TextField
                            id="outlined-basic"
                            label="Reason"
                            variant="outlined"
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleReject()}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <Modal
                // className="hello"
                isOpen={previewOffer}
                onRequestClose={() => setpreview(false)}
                contentLabel="offerletter Modal"
                //sty appElement={}'
                style={{
                  content: {
                    maxWidth: "750px",
                    width: "80%",
                    margin: "auto",
                    inset: "15px",
                  },
                }}
              >
                <div className="pack sb">
                  <div></div>
                  <button
                    className="btn cmnbtn btn_sm btn-danger previewClose mt-1"
                    onClick={handelClose}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <embed src={`${pdfBlob}#toolbar=0`} width={"100%"} height={"100%"} />
                <BlobProvider document={<OfferLetter allUserData={allUserData} image64={image64} />}>
                  {({ blob, url, loading, error }) => {
                    useEffect(() => {
                      if (url && !loading && !error) {
                        setPdfBlob(url); // Set the state only after the URL is available
                      }
                    }, [url, loading, error]);
                  }}
                </BlobProvider>

              </Modal>
              <Modal
                className="signModal"
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Example Modal"
                appElement={document.getElementById("root")}
              >
                <DigitalSignature
                  userID={allUserData.user_id}
                  closeModal={() => setIsModalOpen(false)}
                  offetLetterAcceptanceDate={todayDate}
                  offerLetterStatus={true}
                  gettingData={gettingData}
                />
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div className="pdfPreviewWrapper">
      </div >
    </>
  );
};

export default LetterTab;
