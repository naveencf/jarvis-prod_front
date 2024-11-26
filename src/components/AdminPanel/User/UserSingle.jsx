import { useEffect, useState } from "react";
import "./UserView.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormContainer from "../FormContainer";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import UserSingleTab1 from "./UserSingleTab1";
import UserSingleTab2 from "./UserSingleTab2";
import UserSingleTab4 from "./UserSingleTab4";
import UserSingleTab3 from "./UserSingleTab3";
import DocumentTabUserSingle from "./DocumentTabUserSingle";
import { baseUrl } from "../../../utils/config";
import UserSingleTab5 from "./UserSingle5";
import UserSingleTab6 from "./UserSingle6";
import UserSingleWFHDSalaryTab from "./UserSingleWFHDSalaryTab";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import Modal from "react-modal";
import OfferLetter from "../../PreOnboarding/OfferLetter";
import NDA from "../../PreOnboarding/NDA";
const UserSingle = () => {
  const whatsappApi = WhatsappAPI();
  const [KRIData, setKRIData] = useState([]);
  const { JobType } = useAPIGlobalContext();
  const { id } = useParams();
  const [defaultSeatData, setDefaultSeatData] = useState([]);
  const [roomId, setRoomId] = useState();
  const [educationData, setEducationData] = useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [user, setUser] = useState([]);
  const [hobbiesData, setHobbiesData] = useState([]);
  const [familyData, seFamilyData] = useState([]);
  const [previewOffer, setpreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const handelClose = () => {
    setpreview(!previewOffer);
  };
  const KRAAPI = (userId) => {
    axios.get(`${baseUrl}` + `get_single_kra/${userId}`).then((res) => {
      setKRIData(res.data);
    });
  };
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
    user.job_type === "WFHD" ? "Salary" : null,
  ].filter(Boolean);
  return (
    <>
      <div className="box">
        <div id="content">
          <div style={{display:"flex" , justifyContent:'end'}}>
          <button
            className="btn-warning btn cmnbtn btn_sm mr-2"
            onClick={() => {
              setpreview(true);
            }}
          >
            NDA Preview
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
          <PDFDownloadLink
            document={<NDA allUserData={user} />}
            fileName="NDA.pdf"
          >
            <button className="btn-primary btn cmnbtn btn_sm">
              NDA Download
              <i title="Download NDA" class="bi bi-cloud-arrow-down"></i>
            </button>
          </PDFDownloadLink>
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
            {user.job_type === "WFHD" && activeAccordionIndex == 3 && (
              <UserSingleWFHDSalaryTab id={id} />
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