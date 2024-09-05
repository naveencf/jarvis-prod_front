import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import UserNav from "../UserNav";
import imageTest1 from "../../../../assets/img/product/Avtrar1.png";
import { baseUrl } from "../../../../utils/config";

const Profile = () => {
  const [selectedResponsibilityId, setSelectedResponsibilityId] =
    useState(null);

  const [profileUpdate, setProfileUpdate] = useState([]);
  const [userData, setUserData] = useState([]);
  const [responsbilityData, setResponsibility] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  function handleGetData() {
    axios
      .get(`${baseUrl}`+`get_single_user/${loginUserId}`)
      .then((res) => {
        setUserData(res.data);
        // console.log(res.data, "user data");
      });
  }

  function responsibilityAPI() {
    axios
      .post(`${baseUrl}`+`get_user_job_responsibility`, {
        user_id: Number(loginUserId),
      })
      .then((res) => {
        setResponsibility(res.data.data);
      });
  }

  useEffect(() => {
    handleGetData();
    responsibilityAPI();
  }, [loginUserId]);

  const handleProfileUpdate = () => {
    const formData = new FormData();
    formData.append("id", loginUserId);
    formData.append("image", profileUpdate);
    axios
      // .put(baseUrl+"update_user", formData, {
      .put(baseUrl+"userimageupdate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        handleGetData();
      });
  };

  return (
    <>
      <UserNav />
      <div className="section product_section profile_section section_padding">
        <div className="container">
          <div className="row">
            <div className="col profile_data_col">
              <div className="profile_data_box position-relative">
                <div className="main_wave_box">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>

                {/* photo start */}

                <div className="col profile_img_col">
                  <div className="profile_img_box">
                    <div className="profile_img">
                      {/* {console.log(userData.downloadableUrl, "user data on jsx")} */}
                      {userData?.downloadableUrl == null ? (
                        <img
                          src={imageTest1}
                          style={{
                            height: "40px",
                            borderRadius: "50%",
                            width: "40px",
                          }}
                        />
                      ) : (
                        <img
                          className="img-profile ,w-25"
                          src={userData.downloadableUrl}
                          alt="user"
                          style={{
                            height: "40px",
                            borderRadius: "50%",
                            width: "40px",
                          }}
                        />
                      )}
                    </div>
                    <div className="profile_name">
                      <h2>
                        {userData.user_name} <span>{userData.role_name}</span>
                      </h2>
                      <div className="profile_img_action">
                        <input
                          type="file"
                          className="custom_file_input"
                          onChange={(e) => setProfileUpdate(e.target.files[0])}
                        />
                        <button
                          className="btn btn-primary"
                          title="save profile"
                          type="file"
                          onClick={() => handleProfileUpdate()}
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo End */}

                <div className="d-flex">
                  {/* profile info start  */}
                  <div className="profile_info_main_box">
                    <div className="profile_data_box_head">
                      <h2>Profile info</h2>
                    </div>
                    <div className="profile_data_box_body">
                      <ul>
                        <li>
                          <span>Email</span>
                          {userData.user_email_id}
                        </li>
                        <li>
                          <span>Contact</span>
                          {userData.user_contact_no}
                        </li>
                        <li>
                          <span>Login ID</span>
                          {userData.user_login_id}
                        </li>
                        <li>
                          <span>Password</span>
                          {userData.user_login_password}
                        </li>
                        <li>
                          <span>Department</span>
                          {userData.department_name}
                        </li>
                        <li>
                          <span>Created by</span>
                          {userData.created_by}
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* profile info End  */}

                  <div className="responsibility_main_box">
                    <div className="">
                      <div className="responsibility_s_box">
                        <div className="profile_data_box_head">
                          <h2 className="">Roles & Responsibility</h2>
                        </div>
                      </div>
                    </div>
                    <div className="profile_data_box_body popup_box_design">
                      <ul>
                        {responsbilityData.map((data) => (
                          <>
                            <li>
                              <button
                                type="button"
                                className="btn btn-primary responsibility_btn_custom"
                                data-toggle="modal"
                                data-target="#exampleModal"
                                onClick={() =>
                                  setSelectedResponsibilityId(data.Job_res_id)
                                }
                              >
                                {data.sjob_responsibility}
                              </button>
                            </li>
                          </>
                        ))}
                      </ul>
                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            {responsbilityData.map((data) => {
                              if (
                                data.Job_res_id === selectedResponsibilityId
                              ) {
                                return (
                                  <>
                                    <div className="modal-header">
                                      <h5
                                        className="modal-title"
                                        id="exampleModalLabel"
                                      >
                                        {data.sjob_responsibility}
                                      </h5>
                                      <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      <h5>Description</h5>
                                      {data.description}
                                    </div>
                                  </>
                                );
                              }
                              return null;
                            })}
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-primary"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
