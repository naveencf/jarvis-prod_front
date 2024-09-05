import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import getDecodedToken from "../../../utils/DecodedToken";
import { useGlobalContext } from "../../../Context/Context";
import Announcement from "./Announcement";
import FormContainer from "../FormContainer";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import imageTest1 from "../../../assets/img/product/Avtrar1.png";
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
        const res = await axios.get(`${baseUrl}get_all_user_login_announcement/${loginUserId}`);
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

  return (
    <div>
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
  );
};

export default AnnouncementView;
