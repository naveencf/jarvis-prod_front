import { useEffect, useState } from "react";

import axios from "axios";
import { useParams } from "react-router-dom";
import FormContainer from "../FormContainer";
import { FcDownload } from "react-icons/fc";
import DateFormattingComponent from "../../DateFormator/DateFormared";
import {baseUrl} from '../../../utils/config'

const PreOnboardUserDetailsProfile = () => {
  const { id } = useParams();
  const [subDeptId, setSubDeptId] = useState([]);

  const [otherDocuments, setOtherDocuments] = useState("");
  const [roomId, setRoomId] = useState();

  function userOtherDocuments() {
    axios
      .get(`${baseUrl}`+`get_user_other_fields/${id}`)
      .then((res) => {
        setOtherDocuments(res.data.data);
      });
  }

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const [user, setUser] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`get_single_user/${id}`)
      .then((res) => {
        const fetchedData = res.data;
        setUser(fetchedData);
        const { dept_id } = fetchedData;
        setSubDeptId(dept_id);
      });

    subDep(subDeptId);
    userOtherDocuments();
  }, [id]);

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const accordionButtons = ["Genral", "Professional", "Documents"];

  const tab1 = (
    <>
      <div className="profileInfo_area">
        <div className="row profileInfo_row pt-0">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Name</h3>
              <h4>{user.user_name}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Gender</h3>
              <h4>{user.Gender}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Father Name</h3>
              <h4>{user.fatherName ? user.fatherName : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Email Id</h3>
              <h4>{user.user_email_id}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Personal Email</h3>
              <h4>{user.PersonalEmail ? user.PersonalEmail : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Mother Name</h3>
              <h4>{user.motherName ? user.motherName : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Personal Number</h3>
              <h4>{user.PersonalNumber}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>User Contact No</h3>
              <h4>{user.user_contact_no}</h4>
            </div>
          </div>
          <div
            className={`${
              user.job_type === "WFH"
                ? "col-xl-4 col-lg-4 col-md-6 col-sm-12"
                : "col-xl-4 col-lg-4 col-md-6 col-sm-12"
            }`}
          >
            <div className="profileInfo_box">
              <h3>Spoken Languages</h3>
              <h4>{user.SpokenLanguages ? user.SpokenLanguages : "NA"}</h4>
            </div>
          </div>
        </div>
        {user.job_type === "WFH" && (
          <div className="row profileInfo_row">
            {user.job_type === "WFH" && (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>TDS Applicable</h3>
                  <h4>{user.tbs_applicable}</h4>
                </div>
              </div>
            )}
            {user.job_type === "WFH" && (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>TDS</h3>
                  <h4>{user.tds_per}</h4>
                </div>
              </div>
            )}
            {user.job_type === "WFH" && (
              <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Salary</h3>
                  <h4>{user.salary}</h4>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Designation</h3>
              <h4>{user.designation_name}</h4>
            </div>
          </div>

          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Department</h3>
              <h4>{user.department_name}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Sub Department</h3>
              <h4>{user.sub_dept_name ? user.sub_dept_name : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Nationality</h3>
              <h4>{user.Role_name ? user.Nationality : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Date Of Birth</h3>
              <h4>
                {" "}
                <DateFormattingComponent date={user.DOB} />
              </h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Age</h3>
              <h4>{user.Age ? user.Age : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Seat Number</h3>
                <h4>
                  {roomId?.Sitting_ref_no ? roomId?.Sitting_ref_no : "NA"}{" "}
                  {roomId?.Sitting_ref_no ? "|" : ""}{" "}
                  {roomId?.Sitting_area ? roomId?.Sitting_area : "NA"}
                </h4>
              </div>
            </div>
          )}
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>user Status</h3>
                <h4>{user.user_status ? user.user_status : "NA"}</h4>
              </div>
            </div>
          )}
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Martial Status</h3>
              <h4>{user.MartialStatus ? user.MartialStatus : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Date Of Marriage</h3>
                <h4>
                  {" "}
                  <DateFormattingComponent date={user.DateOfMarriage} />
                </h4>
              </div>
            </div>
          )}
          {user.MartialStatus === "Married" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Spouse Name</h3>
                <h4>{user.spouse_name}</h4>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const tab4 = (
    <>
      <div className="row align-items-baseline">
        {user.image_url && (
          <div className="col-4">
            <div className="card  ">
              <div className="card-body">
                <div>
                  <div className="img-thumbnail">
                    <img
                      className="img-fluid"
                      src={user.image_url}
                      width="300px"
                      height="300px"
                      alt="user_photo"
                    />
                  </div>
                </div>
                <h3 className="fs-4 mt-2">Image</h3>
              </div>
            </div>
          </div>
        )}
        {user.pan_url && (
          <div className="col-4">
            <div className="card  ">
              <div className="card-body">
                <div>
                  <div className="img-thumbnail">
                    <img
                      className="img-fluid"
                      src={user.pan_url}
                      width="300px"
                      height="300px"
                      alt="user_photo"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <h3 className="fs-4 mt-2">PAN</h3>
                  <a className="fs-4 mb-2" href={user.pan_url} download>
                    <FcDownload />
                  </a>
                </div>
                <h2 className="fs-6">
                  {" "}
                  <span className="lead text-black-50 fs-6 ">
                    Pan Number :-
                  </span>{" "}
                  {user.pan_no}
                </h2>
              </div>
            </div>
          </div>
        )}
        {user.other_upload_url && (
          <div className="col-4">
            <div className="card  ">
              <div className="card-body">
                <div>
                  <div className="img-thumbnail">
                    <img
                      className="img-fluid"
                      src={user.other_upload_url}
                      alt="user_photo"
                      width="300px"
                      height="300px"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <h3 className="fs-4 mt-2">Other</h3>
                  <a
                    className="fs-4 mb-2"
                    href={user.other_upload_url}
                    download
                  >
                    <FcDownload />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        {user.highest_upload_url && (
          <div className="col-4 mt-4">
            <div className="card  ">
              <div className="card-body">
                <div>
                  <div className="img-thumbnail">
                    <img
                      src={user.highest_upload_url}
                      className="img-fluid"
                      alt="user_photo"
                      width="300px"
                      height="300px"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <h3 className="fs-4 mt-2">Higest Qualification</h3>
                  <a
                    className="fs-4 mb-2"
                    href={user.highest_upload_url}
                    download
                  >
                    <FcDownload />
                  </a>
                </div>
                <h5 className="fs-6">
                  <span className="text-black-50 ">
                    Higest Qualification :-
                  </span>
                  {user.highest_qualification_name
                    ? user.highest_qualification_name
                    : "NA"}
                </h5>
              </div>
            </div>
          </div>
        )}
        {user.uid_url && (
          <div className="col-4 mt-4">
            <div className="card  ">
              <div className="card-body">
                <div>
                  <div className="img-thumbnail">
                    <img
                      src={user.uid_url}
                      width="300px"
                      height="300px"
                      className="img-fluid"
                      alt="user_photo"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <h3 className="fs-4 mt-2">UID</h3>
                  <a className="fs-4 mb-2" href={user.uid_url} download>
                    <FcDownload />
                  </a>
                </div>
                <h2 className="fs-6 ">
                  <span className="lead text-black-50 fs-6">UID No :-</span>
                  {user.uid_no}
                </h2>
              </div>
            </div>
          </div>
        )}

        {otherDocuments &&
          otherDocuments.map((item, i) => {
            return (
              <div key={i} className="col-4 mt-4">
                <div className="card  ">
                  <div className="card-body">
                    {/* <h2>{item.field_name}</h2> */}
                    <div>
                      <div className="img-thumbnail">
                        <img
                          src={item.field_value}
                          width="300px"
                          height="300px"
                          className="img-fluid"
                          alt="user_photo"
                        />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <h3 className="fs-4 mt-2">{item.field_name}</h3>
                      <a className="fs-4 mb-2" href={item.field_value} download>
                        <FcDownload />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );

  const tab2 = (
    <>
      <div className="profileInfo_area">
        <div className="row profileInfo_row pt-0">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L1N Name</h3>
              <h4>{user.Report_L1N ? user.Report_L1N : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L2N Name</h3>
              <h4>{user.Report_L2N ? user.Report_L2N : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L3N Name</h3>
              <h4>{user.Report_L3N ? user.Report_L3N : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Job Type</h3>
              <h4>{user.job_type}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>User Status</h3>
              <h4>{user.user_status ? user.user_status : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Joining Date</h3>
              <h4>
                <DateFormattingComponent
                  date={user.joining_date?.split("T")[0]}
                />
              </h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Hobbies</h3>
              <h4>{user.Hobbies ? user.Hobbies : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Blood Group</h3>
              <h4>{user.BloodGroup ? user.BloodGroup : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Role Name</h3>
              <h4>{user.Role_name ? user.Role_name : "NA"}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="box">
        <div id="content">
          <FormContainer
            submitButton={false}
            mainTitle="Onboard User Details and Verification"
            title="User Registration"
            accordionButtons={accordionButtons}
            activeAccordionIndex={activeAccordionIndex}
            onAccordionButtonClick={handleAccordionButtonClick}
          >
            {activeAccordionIndex === 0 && tab1}
            {activeAccordionIndex === 1 && tab2}
            {/* {activeAccordionIndex === 2 && tab3} */}
            {activeAccordionIndex === 3 && tab4}
          </FormContainer>
        </div>
      </div>
    </>
  );
};

export default PreOnboardUserDetailsProfile;
