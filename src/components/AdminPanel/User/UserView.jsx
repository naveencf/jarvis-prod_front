import { useEffect, useRef, useState } from "react";
import "./UserView.css";
import Logo from "../../../assets/img/logo/logo.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import FieldContainer from "../FieldContainer";
import {baseUrl} from '../../../utils/config'

const UserView = () => {
  const { id } = useParams();
  const [fetchedAlreadyData, setFetchedAlreadyData] = useState([]);
  const [username, setUserName] = useState("");
  const [roles, setRoles] = useState("");
  const [reportL1, setReportL1] = useState("");
  const [reportL2, setReportL2] = useState("");
  const [reportL3, setReportL3] = useState("");
  const [email, setEmail] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [contact, setContact] = useState("");
  const [personalContact, setPersonalContact] = useState();
  const [loginId, setLoginId] = useState("");
  const [jobType, setJobType] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [profilePicVerify, setProfilePicVerify] = useState(false);
  const [profilePicRemark, setProfilePicRemark] = useState("");

  const [uidImage, setUidImage] = useState(null);
  const [uidImageVerify, setUidImageVerify] = useState(false);
  const [uidRemark, setUidRemark] = useState("");

  const [panImage, setPanImage] = useState(null);
  const [panImageVerify, setPanImageVerify] = useState(false);
  const [panRemark, setPanRemark] = useState("");

  const [highestQualificationImage, setHighestQualificationImage] =
    useState(null);
  const [highestQualificationImageVerify, setHighestQualificationImageVerify] =
    useState(false);
  const [highestQualificationRemark, setHighestQualificationRemark] =
    useState("");

  const [otherImages, setOtherImages] = useState(null);
  const [otherUploadImageVerify, setOtherUploadImageVerify] = useState(false);
  const [otherImagesRemark, setOtherImagesRemark] = useState("");

  const containerRef = useRef(null);

  const handlePrint = () => {
    const container = containerRef.current;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = container.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_single_user/${id}`)
      .then((res) => {
        const fetchedData = res.data;
        setFetchedAlreadyData(res.data);
        const {
          user_name,
          Role_name,
          user_email_id,
          user_contact_no,
          user_login_id,
          department_name,
          job_type,
          Report_L1,
          Report_L2,
          Report_L3,
          PersonalEmail,
          PersonalNumber,
          designation_name,
          image_url,
          uid_url,
          pan_url,
          highest_upload_url,
          other_upload_url,
        } = fetchedData;

        setUserName(user_name);
        setEmail(user_email_id);
        setLoginId(user_login_id);
        setContact(user_contact_no);
        setRoles(Role_name);
        setDepartment(department_name);
        setPersonalContact(PersonalNumber);
        setPersonalEmail(PersonalEmail);
        setJobType(job_type);
        setReportL1(Report_L1);
        setReportL2(Report_L2);
        setReportL3(Report_L3);
        setDesignation(designation_name);
        setProfilePic(image_url);
        setUidImage(uid_url);
        setPanImage(pan_url);
        setHighestQualificationImage(highest_upload_url);
        setOtherImages(other_upload_url);
      });
  }, [id]);

  const handleVerify = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("id", id);
    formData.append("user_name", fetchedAlreadyData.user_name);
    formData.append("user_designation", fetchedAlreadyData.user_designation);
    formData.append("user_email_id", fetchedAlreadyData.user_email_id);
    formData.append("user_login_id", fetchedAlreadyData.user_login_id);
    formData.append(
      "user_login_password",
      fetchedAlreadyData.user_login_password
    );
    formData.append("user_report_to_id", fetchedAlreadyData.user_report_to_id);
    formData.append("created_by", fetchedAlreadyData.created_by);
    formData.append("user_contact_no", fetchedAlreadyData.user_contact_no);
    formData.append("dept_id", fetchedAlreadyData.dept_id);
    formData.append("location_id", fetchedAlreadyData.location_id);
    formData.append("role_id", fetchedAlreadyData.role_id);
    formData.append("sitting_id", fetchedAlreadyData.sittig_id);
    formData.append("image", fetchedAlreadyData.image);
    formData.append("job_type", fetchedAlreadyData.job_type);
    formData.append("personal_number", fetchedAlreadyData.personal_number);
    formData.append("report_L1", fetchedAlreadyData.reportL1);
    formData.append("report_L2", fetchedAlreadyData.reportL2);
    formData.append("report_L3", fetchedAlreadyData.reportL3);
    formData.append("Personal_email", fetchedAlreadyData.personalEmail);
    formData.append("level", fetchedAlreadyData.level);
    formData.append("joining_date", fetchedAlreadyData.joining_date);
    formData.append("releaving_date", fetchedAlreadyData.releaving_date);
    formData.append("room_id", fetchedAlreadyData.room_id);
    formData.append("UID", fetchedAlreadyData.UID);
    formData.append("pan", fetchedAlreadyData.pan);
    formData.append("highest_upload", fetchedAlreadyData.highest_upload);
    formData.append("other_upload", fetchedAlreadyData.other_upload);
    formData.append("salary", fetchedAlreadyData.salary);
    formData.append("SpokenLanguages", fetchedAlreadyData.SpokenLanguages);
    formData.append("Gender", fetchedAlreadyData.Gender);
    formData.append("Nationality", fetchedAlreadyData.SpokenLanguages);
    formData.append("DOB", fetchedAlreadyData.DOB);
    formData.append("Age", fetchedAlreadyData.Age);
    formData.append("FatherName", fetchedAlreadyData.FatherName);
    formData.append("MotherName", fetchedAlreadyData.MotherName);
    formData.append("Hobbies", fetchedAlreadyData.Hobbies);
    formData.append("BloodGroup", fetchedAlreadyData.BloodGroup);
    formData.append("MaritialStatus", fetchedAlreadyData.MaritialStatus);
    formData.append("DateofMarriage", fetchedAlreadyData.DateofMarraige);
    formData.append("onboard_status", fetchedAlreadyData.onboard_status);

    try {
      await axios.put(
        baseUrl+"update_usernew",
        fromData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.log("Failed on Submit form", error);
    }
  };

  const openImageWindow = (imageUrl, imageType) => {
    const windowName = `ImageWindow_${imageType}_${Date.now()}`;
    const newWindow = window.open("", windowName);
    const img = document.createElement("img");

    img.src = imageUrl;

    newWindow.document.body.appendChild(img);
  };

  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>User View</h2>
        </div>
      </div>

      <div className="page_height">
        <div className="container-fluid" ref={containerRef} id="content">
          <div className="card infocard">
            <div className="card-header infocard_head">
              <h2>User Details</h2>
              <img src={Logo} alt="logo" width={170} height={40} />
            </div>
            <div className="card-body infocard_body">
              <ul>
                <li>
                  User Name <span>{username}</span>
                </li>
                <li>
                  Roles <span>{roles}</span>
                </li>
                <li>
                  Email <span>{email}</span>
                </li>
                <li>
                  Personal Email <span>{personalEmail}</span>
                </li>
                <li>
                  Contact No. <span>{contact}</span>
                </li>
                <li>
                  Personal Contact No. <span>{personalContact}</span>
                </li>
                <li>
                  Login ID <span>{loginId}</span>
                </li>
                <li>
                  Department <span>{department}</span>
                </li>
                <li>
                  Designation <span>{designation}</span>
                </li>
                <li>
                  Report L1 <span>{reportL1}</span>
                </li>
                <li>
                  Report L2 <span>{reportL2}</span>
                </li>
                <li>
                  Report L3 <span>{reportL3}</span>
                </li>
                <li>
                  Image
                  <span>
                    <div
                      onClick={() => openImageWindow(profilePic, "ProfilePic")}
                    >
                      Open Image
                    </div>
                    <label>Verify</label>
                    <input
                      type="checkbox"
                      value={profilePicVerify}
                      onChange={(e) => setProfilePicVerify(e.target.checked)}
                    />
                    <FieldContainer
                      label="Remark"
                      value={profilePicRemark}
                      onChange={(e) => setProfilePicRemark(e.target.value)}
                    />
                  </span>
                </li>
                <li>
                  UID
                  <span>
                    <div onClick={() => openImageWindow(uidImage, "UID")}>
                      Open Image
                    </div>
                    <label>Verify</label>
                    <input
                      type="checkbox"
                      value={uidImageVerify}
                      onChange={(e) => setUidImageVerify(e.target.checked)}
                    />
                    <FieldContainer
                      label="Remark"
                      value={uidRemark}
                      onChange={(e) => setUidVerify(e.target.value)}
                    />
                  </span>
                </li>
                <li>
                  PAN
                  <span>
                    <div onClick={() => openImageWindow(panImage, "PAN")}>
                      Open Image
                    </div>
                    <label>Verify</label>
                    <input
                      type="checkbox"
                      value={panImageVerify}
                      onChange={(e) => setPanImageVerify(e.target.checked)}
                    />
                    <FieldContainer
                      label="Remark"
                      value={panRemark}
                      onChange={(e) => setPanRemark(e.target.value)}
                    />
                  </span>
                </li>
                <li>
                  Highest Qualitfication
                  <span>
                    <div
                      onClick={() =>
                        openImageWindow(
                          highestQualificationImage,
                          "Qualification"
                        )
                      }
                    >
                      Open Image
                    </div>
                    <label>Verify</label>
                    <input
                      type="checkbox"
                      value={highestQualificationImageVerify}
                      onChange={(e) =>
                        setHighestQualificationImageVerify(e.target.checked)
                      }
                    />
                    <FieldContainer
                      label="Remark"
                      value={highestQualificationRemark}
                      onChange={(e) =>
                        setHighestQualificationRemark(e.target.value)
                      }
                    />
                  </span>
                </li>
                <li>
                  Other Upload
                  <span>
                    <div
                      onClick={() =>
                        openImageWindow(otherImages, "Other Images")
                      }
                    >
                      Open Image
                    </div>
                    <label>Verify</label>
                    <input
                      type="checkbox"
                      value={otherUploadImageVerify}
                      onChange={(e) =>
                        setOtherUploadImageVerify(e.target.checked)
                      }
                    />
                    <FieldContainer
                      label="Remark"
                      value={otherImagesRemark}
                      onChange={(e) => setOtherImagesRemark(e.target.value)}
                    />
                  </span>
                </li>
              </ul>
            </div>
            <div className="card-footer infocard_footer">
              <button
                className="btn cmnbtn btn-primary ml-auto mr-autos"
                onClick={handlePrint}
              >
                Print
              </button>
              <button onClick={handleVerify}>Verify</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserView;
