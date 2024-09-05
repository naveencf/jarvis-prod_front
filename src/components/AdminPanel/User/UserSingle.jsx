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
    user.job_type ==="WFO"? "Family":"",
    user.job_type === "WFO" ? "Education":"",
    // "Salary",
    user.job_type === "WFHD" ? "Salary" : null,
  ].filter(Boolean);

  return (
    <>
      <div className="box">
        <div id="content">
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
              <UserSingleTab2 user={user} hobbiesData={hobbiesData} />
            )}
            {activeAccordionIndex == 2 && <DocumentTabUserSingle user={user} id={id} />}
            {activeAccordionIndex == 3 && (
              <UserSingleTab5 familyData={familyData} />
            )}
            {activeAccordionIndex == 4 && (
              <UserSingleTab6 educationData={educationData} />
            )}
            {user.job_type === "WFHD"
            && activeAccordionIndex == 3 && <UserSingleWFHDSalaryTab id={id} />}
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default UserSingle;
