import { useEffect, useState } from "react";
import "./UserView.css";

import axios from "axios";
import { useParams } from "react-router-dom";
import FormContainer from "../../FormContainer";
import WhatsappAPI from "../../../WhatsappAPI/WhatsappAPI";
import UserSingleTab1 from "./UserSingleTab1";
import UserSingleTab2 from "./UserSingleTab2";
import UserSingleTab4 from "./UserSingleTab4";
import UserSingleTab3 from "./UserSingleTab3";
import DocumentTabUserSingle from "./DocumentTabUserSingle";
import { baseUrl } from "../../../../utils/config";
import UserSingleTab5 from "./UserSingle5";
import UserSingleTab6 from "./UserSingle6";
import UserSingleWFHDSalaryTab from "./UserSingleWFHDSalaryTab";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import Modal from "react-modal";
import NDA from "../../../PreOnboarding/NDA";
import UserSingleSummaryTab from "./UserSingleSummaryTab";
import AppointmentLetter from "../../../PreOnboarding/AppointmentLetter";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import OfferLetter from "../../../PreOnboarding/OfferLetter";
import { useGlobalContext } from "../../../../Context/Context";
const UserSingle = () => {
  const [loading, setLoading] = useState(false);
  const { toastAlert, toastError } = useGlobalContext();
  const whatsappApi = WhatsappAPI();
  const [KRIData, setKRIData] = useState([]);
  const { JobType } = useAPIGlobalContext();
  const { id } = useParams();
  const [defaultSeatData, setDefaultSeatData] = useState([]);
  const [roomId, setRoomId] = useState();
  const [educationData, setEducationData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [user, setUser] = useState([]);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [familyData, seFamilyData] = useState([]);
  const [previewOffer, setpreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [image64, setImage64] = useState("");

  const [salaryData, setSalaryData] = useState([]);
  const [salaryFilterData, setSalaryFilterData] = useState([]);

  const handelClose = () => {
    setpreview(!previewOffer);
  };
  const KRAAPI = (userId) => {
    axios.get(`${baseUrl}` + `get_single_kra/${userId}`).then((res) => {
      setKRIData(res.data);
    });
  };
  useEffect(() => {
    axios
      .post(baseUrl + "image_to_base64", {
        imageUrl: user.digital_signature_image_url,
      })
      .then((response) => {
        setImage64(response.data.base64String);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios.get(baseUrl + "get_all_sittings").then((res) => {
      setDefaultSeatData(res.data.data);
    });
    axios.get(baseUrl + `get_single_education/${id}`).then((res) => {
      setEducationData(res.data.data);
    });
    axios.get(baseUrl + `get_single_family/${id}`).then((res) => {
      seFamilyData(res.data.data);
    });
    KRAAPI(id);
    axios.get(baseUrl + "get_all_hobbies").then((res) => {
      setHobbiesData(res.data.data);
    });

    axios.get(baseUrl + `user_wfhd_joining_summary/${id}`).then((res) => {
      setSummaryData(res.data.data);
    });
  }, []);
  let fetchedData;
  const getData = () => {
    axios.get(`${baseUrl}` + `get_single_user/${id}`).then((res) => {
      fetchedData = res.data;
      const { dept_id } = fetchedData;
      setUser(fetchedData);
    });
  };
  useEffect(() => {
    getData();

    axios
      .post(baseUrl + "get_attendance_by_userid", {
        user_id: id,
      })
      .then((res) => {
        const response = res?.data.data;
        setSalaryData(response);
        setSalaryFilterData(response);
      })
      .catch((e) => console.error("come to error"));
  }, [id]);
  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };
  useEffect(() => {
    const selectedOption = defaultSeatData?.find(
      (option) => option?.sitting_id === Number(user?.sitting_id)
    );
    setRoomId(selectedOption);
  }, [defaultSeatData, user?.sitting_id]);
  const accordionButtons = [
    "General",
    "Professional",
    // "KRA",
    "Documents",
    user.job_type === "WFO" ? "Family" : "",
    user.job_type === "WFO" ? "Education" : "",
    // "Salary",
    "Summary",
    user.job_type === "WFHD" ? "Salary" : null,
  ].filter(Boolean);

  const handleSwitchWFHD = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("user_id", id);
    formData.append("att_status", "onboarded");
    formData.append("job_type", "WFHD");
    formData.append("onboard_status", 1);

    try {
      const response = await axios.put(`${baseUrl}update_user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toastAlert("User successfully switched to WFHD!");
        getData();
      } else {
        toastError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toastError("Error switching to WFHD. Please check your connection.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  //This code Repetly Wirte same code write on LetterTab component ----------------------------------------------------------------------
  let salary = user.salary;
  let basicSalary = salary * 0.6;
  let basicsal = (basicSalary <= 12300 ? salary * 0.8 : basicSalary).toFixed(0);
  let EmployeePF = parseFloat(
    (basicsal <= 14999 ? basicsal * 0.12 : 1800).toFixed(0)
  );

  let EmployeerESIC = 0;

  if (salary <= 21000) {
    EmployeerESIC = parseFloat(((salary * 3.25) / 100).toFixed(0));
  }
  const EMPPF = EmployeePF * 12 + (salary <= 21000 ? EmployeerESIC * 12 : 0);

  return (
    <>
      <div className="box">
        <div id="content">
          <div style={{ display: "flex", justifyContent: "end" }}>
            <PDFDownloadLink
              document={
                <OfferLetter
                  allUserData={user}
                  image64={image64}
                  EMPPF={EMPPF}
                />
              }
              fileName="OfferLetter.pdf"
            >
              <button className="btn-primary btn cmnbtn btn_sm mr-2">
                Offer Letter
                <i
                  title="Download Offer Letter"
                  class="bi bi-cloud-arrow-down"
                ></i>
              </button>
            </PDFDownloadLink>
            <PDFDownloadLink
              document={
                <AppointmentLetter
                  allUserData={user}
                  image64={image64}
                  EMPPF={EMPPF}
                />
              }
              fileName="AppointmentLetter.pdf"
            >
              <button className="btn-primary btn cmnbtn btn_sm mr-2">
                Appointment Letter
                <i
                  title="Download Offer Letter"
                  class="bi bi-cloud-arrow-down"
                ></i>
              </button>
            </PDFDownloadLink>
            {/* <button
              className="btn-warning btn cmnbtn btn_sm mr-2"
              onClick={() => {
                setpreview(true);
              }}
            >
              NDA Preview
              <i className="fa fa-eye" aria-hidden="true"></i>
            </button> */}
            <PDFDownloadLink
              document={<NDA allUserData={user} />}
              fileName="NDA.pdf"
            >
              <button className="btn-primary btn cmnbtn btn_sm mr-2">
                NDA Download
                <i title="Download NDA" class="bi bi-cloud-arrow-down"></i>
              </button>
            </PDFDownloadLink>

            {user.job_type === "WFO" && (
              <button
                onClick={handleSwitchWFHD}
                disabled={loading}
                className="btn-danger btn cmnbtn btn_sm"
              >
                {loading ? "Processing..." : "Switch TO WFHD"}{" "}
                <i title="Download NDA" className="bi bi-cloud-arrow-down"></i>
              </button>
            )}
          </div>
          <FormContainer
            submitButton={false}
            mainTitle="User"
            title="User Registration"
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && (
              <UserSingleTab1 user={user} roomId={roomId} />
            )}
            {activeAccordionIndex === 1 && (
              <UserSingleTab2 user={user} id={id} />
            )}
            {activeAccordionIndex == 2 && (
              <DocumentTabUserSingle user={user} id={id} />
            )}
            {activeAccordionIndex == 3 && (
              <UserSingleTab5 familyData={familyData} />
            )}
            {activeAccordionIndex == 4 && (
              <UserSingleTab6 educationData={educationData} />
            )}
            {activeAccordionIndex == 5 && (
              <UserSingleSummaryTab summaryData={summaryData} />
            )}
            {user.job_type === "WFHD" && activeAccordionIndex == 3 && (
              <UserSingleSummaryTab summaryData={summaryData} />
            )}
            {salaryData.length > 0 && activeAccordionIndex == 4 && (
              <UserSingleWFHDSalaryTab
                salaryData={salaryData}
                salaryFilterData={salaryFilterData}
                setSalaryFilterData={setSalaryFilterData}
              />
            )}
          </FormContainer>
        </div>
        <Modal
          isOpen={previewOffer}
          onRequestClose={() => setpreview(false)}
          contentLabel="offerletter Modal"
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
          <BlobProvider document={<NDA allUserData={user} />}>
            {({ blob, url, loading, error }) => {
              useEffect(() => {
                if (url && !loading && !error) {
                  setPdfBlob(url); // Set the state only after the URL is available
                }
              }, [url, loading, error]);
            }}
          </BlobProvider>
        </Modal>
      </div>
    </>
  );
};
export default UserSingle;
