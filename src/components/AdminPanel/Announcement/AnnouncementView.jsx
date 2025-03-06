import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import getDecodedToken from "../../../utils/DecodedToken";
import { useGlobalContext } from "../../../Context/Context";
import Announcement from "./Announcement";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Slider from "react-slick"; // Import Slider
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS

import user from "../../../assets/imgs/user/naruto.png";
import inboxBlank from "../../../assets/imgs/other/inbox-blank.svg";
import leaveLight from "../../../assets/imgs/other/on-leave-today-light.svg";
import remotelyLight from "../../../assets/imgs/other/working-remotely-light.svg";
import generalBg from "../../../assets/imgs/other/holidays/general.svg";
import holiBg from "../../../assets/imgs/other/holidays/holi.svg";
import independenceBg from "../../../assets/imgs/other/holidays/independence.svg";
import rakshabandhanBg from "../../../assets/imgs/other/holidays/rakshabandhan.svg";
import {
  DotsThree,
  DotsThreeOutlineVertical,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import FormContainer from "../FormContainer";
const AnnouncementView = () => {
  const navigate = useNavigate();
  const { toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;
  const [announcements, setAnnouncements] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const getAnnouncementData = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}get_all_user_login_announcement/${loginUserId}`
        );
        setAnnouncements(res.data.data);
      } catch (error) {
        toastError(
          error.response?.data?.error || "Error fetching announcements"
        );
      }
    };
    getAnnouncementData();
  }, []);

  const handleReaction = async (announcementId, reaction) => {
    try {
      await axios.put(`${baseUrl}announcement_post_like`, {
        announcement_id: announcementId,
        user_id: loginUserId,
        reaction: reaction,
      });
    } catch (error) {
      toastError(
        error.response?.data?.error || "Error reacting to announcement"
      );
    }
  };

  const handlePostComment = async (announcementId, commentText) => {
    try {
      const response = await axios.post(`${baseUrl}announcement_post_comment`, {
        announcement_id: announcementId,
        user_id: loginUserId,
        comment: commentText,
      });

      if (response.status === 200) {
        const newComment = response.data.data;

        setComments((prevComments) => {
          const updatedComments = prevComments[announcementId]
            ? [newComment, ...prevComments[announcementId]]
            : [newComment];
          return { ...prevComments, [announcementId]: updatedComments };
        });
      }
    } catch (error) {
      toastError(error.response?.data?.error || "Error posting comment");
    }
  };

  const fetchComments = async (announcementId) => {
    try {
      const commentsRes = await axios.get(
        `${baseUrl}get_announcement_comments/${announcementId}`
      );
      setComments((prevComments) => ({
        ...prevComments,
        [announcementId]: commentsRes.data.data,
      }));
    } catch (error) {
      toastError(error.response?.data?.error || "Error fetching comments");
    }
  };

  // Slider Settings
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500, // Animation speed
    slidesToShow: 1, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll
    responsive: [
      {
        breakpoint: 1024, // For medium screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For very small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className="announcementWrapper">
        <div className="announcementInfoWrapper">
          <div className="ancHeading">
            <h2>Quick Access</h2>
          </div>
          <div className="card ancCard">
            <div className="card-header">
              <h5 className="card-title">Inbox</h5>
            </div>
            <div className="card-body">
              <div className="blankInfo">
                <div className="blankInfoText">
                  <h4>Good job!</h4>
                  <p>You have no pending actions</p>
                </div>
                <div className="blankInfoImg">
                  <img src={inboxBlank} />
                </div>
              </div>
            </div>
          </div>

          <div className="card ancCard holidaySlider">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Holidays</h5>
              <a href="#">
                <h6>View all</h6>
              </a>
            </div>
            <div className="card-body">
              <Slider {...sliderSettings}>
                <div className="holidaySlide">
                  <div className="holidaySlideImg">
                    <img src={holiBg} />
                  </div>
                  <div className="holidaySlideText">
                    <h4>Holi</h4>
                    <p>Fri, 14 March, 2025</p>
                  </div>
                </div>
                <div className="holidaySlide dark">
                  <div className="holidaySlideImg">
                    <img src={generalBg} />
                  </div>
                  <div className="holidaySlideText">
                    <h4>Priviledge Leave (1)</h4>
                    <p>Sat, 15 March, 2025</p>
                  </div>
                </div>
                <div className="holidaySlide dark">
                  <div className="holidaySlideImg">
                    <img src={generalBg} />
                  </div>
                  <div className="holidaySlideText">
                    <h4>Rang Panchmi</h4>
                    <p>Wed, 19 March, 2025</p>
                  </div>
                </div>
                <div className="holidaySlide">
                  <div className="holidaySlideImg">
                    <img src={rakshabandhanBg} />
                  </div>
                  <div className="holidaySlideText">
                    <h4>Raksha Bandhan</h4>
                    <p>Sat, 09 August, 2025</p>
                  </div>
                </div>
                <div className="holidaySlide">
                  <div className="holidaySlideImg">
                    <img src={independenceBg} />
                  </div>
                  <div className="holidaySlideText">
                    <h4>Independence Day</h4>
                    <p>Fri, 15 August, 2025</p>
                  </div>
                </div>
              </Slider>
            </div>
          </div>

          <div className="card ancCard">
            <div className="card-header">
              <h5 className="card-title">On Leave Today</h5>
            </div>
            <div className="card-body">
              <div className="avatarCircles">
                <div className="avatarCircle">
                  <div className="avatarCircleImg">
                    <img src={user} />
                  </div>
                  <div className="avatarCircleText">
                    <h4>Anmol Gour</h4>
                    <p>Full-day</p>
                  </div>
                </div>
                <div className="avatarCircle">
                  <div className="avatarCircleImg">
                    <img src={user} />
                  </div>
                  <div className="avatarCircleText">
                    <h4>Anmol Gour</h4>
                    <p>First-half</p>
                  </div>
                </div>
                <div className="avatarCircle">
                  <div className="avatarCircleImg">
                    <img src={user} />
                  </div>
                  <div className="avatarCircleText">
                    <h4>Anmol Gour</h4>
                    <p>Second-half</p>
                  </div>
                </div>
              </div>
              <div className="blankInfo d-none">
                <div className="blankInfoText">
                  <h4>Everyone is working today!</h4>
                  <p>No one is on leave today.</p>
                </div>
                <div className="blankInfoImg">
                  <img src={leaveLight} />
                </div>
              </div>
            </div>
          </div>

          <div className="card ancCard">
            <div className="card-header">
              <h5 className="card-title">Working Remotely</h5>
            </div>
            <div className="card-body">
              <div className="blankInfo">
                <div className="blankInfoText">
                  <h4>Everyone is at office!</h4>
                  <p>No one is working remotely today.</p>
                </div>
                <div className="blankInfoImg">
                  <img src={remotelyLight} />
                </div>
              </div>
            </div>
          </div>

          <div className="card ancCard">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Time Today - Feb 18, 2025 Tue</h5>
              <a href="#">
                <h6>View all</h6>
              </a>
            </div>
            <div className="card-body">
              <div className="shiftTimer">
                <div className="shiftTimerText">
                  <p>Current Time</p>
                  <h2>03:25:34 AM</h2>
                </div>
                <button className="btn cmnbtn btn_sm btn-outline-primary">
                  Partial day
                </button>
              </div>
            </div>
          </div>

          <div className="card ancCard">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Leave Balances</h5>
              <a href="#">
                <h6>View all</h6>
              </a>
            </div>
            <div className="card-body"></div>
          </div>
        </div>
        <div className="announcementTimelineWrapper">
          <div className="card ancCard">
            <div className="card-header flexCenterBetween">
              <div className="ancCardUser">
                <div className="ancCardUserImg">
                  <img src={user} />
                </div>
                <div className="ancCardUserTxt">
                  <h4>
                    Nikhil Sukhramani <small>created a post</small>
                  </h4>
                  <p>Feb 13 2025, 6:23PM</p>
                </div>
              </div>
              <div className="flexCenter colGap8">
                <button className="btn sm icon">
                  <DotsThree />
                </button>
              </div>
            </div>
            <div className="card-body ancPostBody">
              <div className="ancPostBodyText">
                <p>
                  Celebrating <a href="#">Naveen Nagar</a> Work Anniversary! 🎉
                  Your innovation, problem-solving skills, and dedication have
                  made a significant impact. Thank you for everything you do!
                </p>
              </div>
            </div>
            {/*  */}
            {/* <div className="card-footer">
              <div className="pack w-100 sb">
                <div className="d-flex flex-row gap4">
                  <span
                    className="rec-btn"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "70px",
                    }}
                  >
                    {selectedReaction ? (
                      <div
                        className="flex-row align-items-center gap4"
                        style={{ height: "21px" }}
                        onClick={() => {
                          handleReactionClick(selectedReaction);
                        }}
                      >
                        <div style={{ transform: "scale(0.7)" }}>
                          {reactionObj[selectedReaction]}
                        </div>
                        <p>
                          {selectedReaction.charAt(0).toUpperCase() +
                            selectedReaction.slice(1).toLowerCase()}
                        </p>
                      </div>
                    ) : (
                      <div className="flex-row align-items-center gap4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="21"
                          viewBox="0 0 21 21"
                          fill="none"
                        >
                          <path
                            opacity="0.15"
                            d="M5.6875 19.9062C5.6875 20.0803 6.19453 20.2472 7.09705 20.3703C7.99957 20.4934 9.22365 20.5625 10.5 20.5625C11.7764 20.5625 13.0004 20.4934 13.903 20.3703C14.8055 20.2472 15.3125 20.0803 15.3125 19.9062C15.3125 19.7322 14.8055 19.5653 13.903 19.4422C13.0004 19.3191 11.7764 19.25 10.5 19.25C9.22365 19.25 7.99957 19.3191 7.09705 19.4422C6.19453 19.5653 5.6875 19.7322 5.6875 19.9062Z"
                            fill="#45413C"
                          />
                          <path
                            d="M12.4119 11.4056L12.3856 11.4581C12.0226 12.187 11.4868 12.8161 10.8248 13.2904C10.1629 13.7647 9.39503 14.0699 8.5881 14.1794"
                            stroke="#45413C"
                            stroke-width="0.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.1081 15.6931H16.0956V17.6619H11.1081V15.6931Z"
                            stroke="#45413C"
                            stroke-width="0.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.8106 13.3087H17.4519V15.6931H10.8106V13.3087Z"
                            stroke="#45413C"
                            stroke-width="0.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.8106 11.0862H17.4519V13.3131H10.8106V11.0862Z"
                            stroke="#45413C"
                            stroke-width="0.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.1081 8.85938H16.3406V11.0863H11.1081V8.85938Z"
                            stroke="#45413C"
                            stroke-width="0.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M16.2619 13.3087H16.3406C16.6353 13.3087 16.918 13.1917 17.1264 12.9833C17.3348 12.7749 17.4519 12.4922 17.4519 12.1975C17.4519 11.9028 17.3348 11.6201 17.1264 11.4117C16.918 11.2033 16.6353 11.0862 16.3406 11.0862H15.2294C15.5126 11.0685 15.7784 10.9434 15.9727 10.7366C16.167 10.5297 16.2752 10.2566 16.2752 9.97281C16.2752 9.68902 16.167 9.41589 15.9727 9.20903C15.7784 9.00217 15.5126 8.87714 15.2294 8.85937H12.5519C12.8056 8.22937 13.1294 7.23625 13.4269 6.29125C13.5662 5.82886 13.5169 5.33015 13.2899 4.90394C13.0628 4.47773 12.6764 4.15862 12.215 4.01625C12.1552 3.99737 12.0924 3.99057 12.03 3.99622C11.9676 4.00188 11.9069 4.01989 11.8516 4.0492C11.7962 4.07852 11.7472 4.11855 11.7074 4.16697C11.6677 4.21539 11.638 4.27123 11.62 4.33125C11.2437 5.6175 10.9637 7.24062 8.99499 8.70625C8.31239 9.23991 7.72131 9.88123 7.24499 10.605C7.08664 10.8304 6.87731 11.0153 6.63403 11.1445C6.39076 11.2737 6.12041 11.3437 5.84499 11.3487H4.28311C4.16708 11.3487 4.0558 11.3948 3.97375 11.4769C3.89171 11.5589 3.84561 11.6702 3.84561 11.7862V16.6512C3.84561 16.7673 3.89171 16.8786 3.97375 16.9606C4.0558 17.0427 4.16708 17.0887 4.28311 17.0887H5.37249C6.80749 17.1237 7.42874 17.6619 9.21811 17.6619H15.1112C15.3723 17.6619 15.6227 17.5582 15.8073 17.3736C15.9919 17.189 16.0956 16.9386 16.0956 16.6775C16.0956 16.4164 15.9919 16.166 15.8073 15.9814C15.6227 15.7968 15.3723 15.6931 15.1112 15.6931H16.2619C16.5656 15.6747 16.8508 15.5411 17.0593 15.3195C17.2679 15.098 17.384 14.8052 17.384 14.5009C17.384 14.1967 17.2679 13.9039 17.0593 13.6823C16.8508 13.4608 16.5656 13.3272 16.2619 13.3087V13.3087Z"
                            stroke="#45413C"
                            stroke-width="0.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <p>Like</p>
                      </div>
                    )}

                    <div
                      className="card d-flex flex-row p-2 justify-content-center align-items-center"
                      style={{
                        position: "absolute",
                        left: "-10px",
                        top: "-47px",
                        width: "250px",
                        gap: "20px",
                        fontSize: "20px",
                      }}
                    >
                      {reactionTypes.map((type, index) => (
                        <span
                          key={index}
                          className="emoji"
                          onClick={() => {
                            handleReactionClick(type);
                          }}
                        >
                          {reactionObj[type]}
                        </span>
                      ))}
                    </div>
                  </span>{" "}
                  &nbsp; &nbsp; &nbsp;
                  <p style={{ cursor: "pointer" }} onClick={toggleCommentForm}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_26_3060)">
                        <path
                          opacity="0.15"
                          d="M6.125 19.0312C6.125 19.1174 6.27777 19.2028 6.57459 19.2824C6.8714 19.362 7.30645 19.4344 7.8549 19.4953C8.40335 19.5562 9.05445 19.6046 9.77103 19.6375C10.4876 19.6705 11.2556 19.6875 12.0312 19.6875C12.8069 19.6875 13.5749 19.6705 14.2915 19.6375C15.0081 19.6046 15.6592 19.5562 16.2076 19.4953C16.756 19.4344 17.1911 19.362 17.4879 19.2824C17.7847 19.2028 17.9375 19.1174 17.9375 19.0312C17.9375 18.9451 17.7847 18.8597 17.4879 18.7801C17.1911 18.7005 16.756 18.6281 16.2076 18.5672C15.6592 18.5063 15.0081 18.4579 14.2915 18.425C13.5749 18.392 12.8069 18.375 12.0312 18.375C11.2556 18.375 10.4876 18.392 9.77103 18.425C9.05445 18.4579 8.40335 18.5063 7.8549 18.5672C7.30645 18.6281 6.8714 18.7005 6.57459 18.7801C6.27777 18.8597 6.125 18.9451 6.125 19.0312Z"
                          fill="#45413C"
                        />
                        <path
                          d="M20.7813 7.73937C20.7806 6.41481 20.3408 5.12783 19.5308 4.07981C18.7208 3.03179 17.5862 2.28185 16.3046 1.94731C15.0229 1.61278 13.6666 1.71253 12.4477 2.23096C11.2288 2.74939 10.2161 3.65725 9.56814 4.8125C8.96082 4.43366 8.27504 4.19844 7.56306 4.12476C6.85107 4.05108 6.13166 4.14089 5.45964 4.38734C4.78762 4.63379 4.18071 5.03038 3.68517 5.54689C3.18962 6.0634 2.81851 6.68621 2.6001 7.36787C2.3817 8.04952 2.32177 8.77203 2.42487 9.48036C2.52798 10.1887 2.7914 10.8641 3.19507 11.4552C3.59873 12.0463 4.132 12.5375 4.75423 12.8913C5.37646 13.2451 6.07124 13.4522 6.78564 13.4969C7.11293 14.3056 7.66899 15.0012 8.38571 15.4986C9.10242 15.996 9.94866 16.2736 10.8207 16.2972C11.6928 16.3209 12.5529 16.0897 13.2955 15.632C14.0382 15.1742 14.6312 14.5097 15.0019 13.72C16.5525 13.6667 18.0219 13.0133 19.1001 11.8975C20.1783 10.7818 20.781 9.29094 20.7813 7.73937Z"
                          fill="white"
                        />
                        <path
                          d="M15.1594 11.8869C14.7714 12.7126 14.1511 13.4073 13.3745 13.8862C12.5979 14.365 11.6986 14.6071 10.7866 14.583C9.87457 14.5589 8.98934 14.2695 8.23915 13.7503C7.48897 13.231 6.90634 12.5045 6.56251 11.6594C5.66793 11.6001 4.80647 11.2979 4.07099 10.7852C3.3355 10.2725 2.75386 9.56885 2.38876 8.75001C2.38876 8.77189 2.38876 8.78939 2.38876 8.80689C2.38852 10.001 2.84291 11.1504 3.6596 12.0215C4.47629 12.8926 5.59401 13.4202 6.78564 13.4969C7.11293 14.3056 7.66899 15.0012 8.38571 15.4986C9.10242 15.996 9.94866 16.2736 10.8207 16.2973C11.6928 16.3209 12.5529 16.0897 13.2955 15.632C14.0382 15.1742 14.6312 14.5097 15.0019 13.72C16.5205 13.6663 17.9618 13.0369 19.0334 11.9596C20.1051 10.8822 20.7268 9.43763 20.7725 7.91876C20.3255 9.0553 19.556 10.0364 18.5588 10.7414C17.5615 11.4464 16.3799 11.8446 15.1594 11.8869Z"
                          fill="#F0F0F0"
                        />
                        <path
                          d="M20.7813 7.73937C20.7806 6.41481 20.3408 5.12783 19.5308 4.07981C18.7208 3.03179 17.5862 2.28185 16.3046 1.94731C15.0229 1.61278 13.6666 1.71253 12.4477 2.23096C11.2288 2.74939 10.2161 3.65725 9.56814 4.8125C8.96082 4.43366 8.27504 4.19844 7.56306 4.12476C6.85107 4.05108 6.13166 4.14089 5.45964 4.38734C4.78762 4.63379 4.18071 5.03038 3.68517 5.54689C3.18962 6.0634 2.81851 6.68621 2.6001 7.36787C2.3817 8.04952 2.32177 8.77203 2.42487 9.48036C2.52798 10.1887 2.7914 10.8641 3.19507 11.4552C3.59873 12.0463 4.132 12.5375 4.75423 12.8913C5.37646 13.2451 6.07124 13.4522 6.78564 13.4969C7.11293 14.3056 7.66899 15.0012 8.38571 15.4986C9.10242 15.996 9.94866 16.2736 10.8207 16.2972C11.6928 16.3209 12.5529 16.0897 13.2955 15.632C14.0382 15.1742 14.6312 14.5097 15.0019 13.72C16.5525 13.6667 18.0219 13.0133 19.1001 11.8975C20.1783 10.7818 20.781 9.29094 20.7813 7.73937V7.73937Z"
                          stroke="#45413C"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M0.21875 17.9856C0.21875 18.213 0.309093 18.4311 0.469906 18.592C0.630718 18.7528 0.848827 18.8431 1.07625 18.8431C1.30367 18.8431 1.52178 18.7528 1.68259 18.592C1.84341 18.4311 1.93375 18.213 1.93375 17.9856C1.93375 17.7582 1.84341 17.5401 1.68259 17.3793C1.52178 17.2185 1.30367 17.1281 1.07625 17.1281C0.848827 17.1281 0.630718 17.2185 0.469906 17.3793C0.309093 17.5401 0.21875 17.7582 0.21875 17.9856Z"
                          fill="white"
                          stroke="#45413C"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M3.44312 16.4413C3.44312 16.6377 3.48182 16.8323 3.55701 17.0138C3.6322 17.1954 3.74242 17.3603 3.88136 17.4993C4.0203 17.6382 4.18524 17.7484 4.36678 17.8236C4.54831 17.8988 4.74287 17.9375 4.93937 17.9375C5.13586 17.9375 5.33042 17.8988 5.51196 17.8236C5.69349 17.7484 5.85843 17.6382 5.99737 17.4993C6.13631 17.3603 6.24653 17.1954 6.32172 17.0138C6.39691 16.8323 6.43562 16.6377 6.43562 16.4413C6.43562 16.2448 6.39691 16.0502 6.32172 15.8687C6.24653 15.6871 6.13631 15.5222 5.99737 15.3832C5.85843 15.2443 5.69349 15.1341 5.51196 15.0589C5.33042 14.9837 5.13586 14.945 4.93937 14.945C4.74287 14.945 4.54831 14.9837 4.36678 15.0589C4.18524 15.1341 4.0203 15.2443 3.88136 15.3832C3.74242 15.5222 3.6322 15.6871 3.55701 15.8687C3.48182 16.0502 3.44312 16.2448 3.44312 16.4413Z"
                          fill="white"
                        />
                        <path
                          d="M4.93936 17.2944C4.65511 17.2934 4.37462 17.2293 4.11815 17.1067C3.86167 16.9841 3.6356 16.8062 3.45624 16.5856C3.48496 16.9593 3.65368 17.3084 3.92865 17.563C4.20362 17.8177 4.56459 17.9591 4.93936 17.9591C5.31414 17.9591 5.6751 17.8177 5.95007 17.563C6.22505 17.3084 6.39377 16.9593 6.42249 16.5856C6.24313 16.8062 6.01706 16.9841 5.76058 17.1067C5.5041 17.2293 5.22362 17.2934 4.93936 17.2944Z"
                          fill="#F0F0F0"
                        />
                        <path
                          d="M3.44312 16.4413C3.44312 16.6377 3.48182 16.8323 3.55701 17.0138C3.6322 17.1954 3.74242 17.3603 3.88136 17.4993C4.0203 17.6382 4.18524 17.7484 4.36678 17.8236C4.54831 17.8988 4.74287 17.9375 4.93937 17.9375C5.13586 17.9375 5.33042 17.8988 5.51196 17.8236C5.69349 17.7484 5.85843 17.6382 5.99737 17.4993C6.13631 17.3603 6.24653 17.1954 6.32172 17.0138C6.39691 16.8323 6.43562 16.6377 6.43562 16.4413C6.43562 16.2448 6.39691 16.0502 6.32172 15.8687C6.24653 15.6871 6.13631 15.5222 5.99737 15.3832C5.85843 15.2443 5.69349 15.1341 5.51196 15.0589C5.33042 14.9837 5.13586 14.945 4.93937 14.945C4.74287 14.945 4.54831 14.9837 4.36678 15.0589C4.18524 15.1341 4.0203 15.2443 3.88136 15.3832C3.74242 15.5222 3.6322 15.6871 3.55701 15.8687C3.48182 16.0502 3.44312 16.2448 3.44312 16.4413V16.4413Z"
                          stroke="#45413C"
                          stroke-width="0.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_26_3060">
                          <rect width="21" height="21" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>{" "}
                    Comments
                  </p>
                </div>
                <div className="pack d-flex flex-row gap4 rec-com">
                  <p
                    className="rec-com"
                    style={{ cursor: "pointer" }}
                    onClick={toggleDrawer(true)}
                  >
                    {`${reactionCount}
              Reactions`}
                  </p>{" "}
                  <i className="bi bi-dot"></i>{" "}
                  <p
                    className="rec-com"
                    style={{ cursor: "pointer" }}
                    onClick={toggleCommentList}
                  >
                    {announcement?.totalCommentsCounts} Comments
                  </p>
                </div>
              </div>
              &nbsp;
              <div className="pack w-100"></div>
              {showCommentlist && (
                <div className="pack w-100">
                  <AnnoucementComments
                    comments={comments}
                    loginUserData={loginUserData}
                  />
                  <br />
                </div>
              )}
              {showCommentForm && (
                <div
                  className="pack d-flex flex-row gap4 w-100"
                  style={{ alignItems: "center" }}
                >
                  <div className="profile-sec" style={{ alignItems: "center" }}>
                    <div className="profile-img">
                      <img src={imageTest1} alt="" width={40} />
                    </div>
                  </div>
                  &nbsp;
                  <CommentForm
                    announcementId={announcement._id}
                    handlePostComment={handlePostComment}
                  />
                </div>
              )}
            </div> */}

            {/*  */}
          </div>
        </div>
      </div>

      <div className="d-none1">
        <FormContainer
          mainTitle={"Announcement"}
          link={true}
          handleSubmit={false}
        />

        <div className="card body-padding gap4">
          <div className="pack sb">
            <div className="d-flex flex-row">
              <h5>Announcement</h5> &nbsp;{" "}
              <span>
                <h5 style={{ color: "var(--gray-500)" }}>
                  {announcements.length}
                </h5>
              </span>
            </div>
            <button
              className="btn cmnbtn btn_sm btn-outline-primary"
              onClick={() => {
                navigate("/admin/announcement-post");
              }}
            >
              + Add Announcement
            </button>
          </div>
          <div className="pack" style={{ width: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search Announcement"
            />
          </div>
        </div>

        {announcements.map((announcement) => (
          <Announcement
            key={announcement._id}
            announcement={announcement}
            comments={comments[announcement._id] || []}
            handlePostComment={handlePostComment}
            fetchComments={() => fetchComments(announcement._id)}
          />
        ))}
      </div>
    </>
  );
};

export default AnnouncementView;
