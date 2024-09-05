import React from "react";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";

const AnnoucementComments = ({ comments, loginUserData }) => {
  return (
    <div>
      <div className="pack">
        <p className="bold">Comments</p>
        <br />
        {comments.map((comment) => (
          <>
            <div
              className="pack d-flex flex-row gap4 sb align-items-start"
              key={comment._id}
            >
              <div className="pack d-flex flex-row gap4">
                <div
                  className="profile-sec"
                  style={{ alignItems: "flex-start" }}
                >
                  {loginUserData[0]?.image == null ? (
                    <div className="profile-img">
                      <img src={imageTest1} alt="" width={40} />
                    </div>
                  ) : (
                    <img
                      key={1}
                      className="img-profile"
                      src={loginUserData[0]?.image}
                      alt="user"
                    />
                  )}
                </div>
                &nbsp;
                <div className="d-flex flex-column">
                  <p className="bold">{comment.user_name}</p>
                  <br />
                  <p>{comment.comment}</p>
                  <br />
                  <p className="rec-com">
                    {" "}
                    {new Date(comment.createdAt).toLocaleString("en-US", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="nav-item dropdown">
                <div
                  className="i"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <div
                    data-bs-toggle="collapse"
                    data-bs-target="#Notificationbar"
                    aria-expanded="false"
                    aria-controls="Notificationbar"
                    alt=""
                    width={20}
                  >
                    <i class="bi bi-three-dots-vertical"></i>
                  </div>
                </div>
                <div
                  className="dropdown-menu notification  dropdown-menu-right shadow animated--grow-in mt1"
                  style={{ border: "1px solid var(--border)" }}
                >
                  <div className="pack d-flex flex-column">
                    <div className="d-flex flex-row w-100 gap4">
                      <i class="bi bi-pencil"></i>
                      <p>Edit</p>
                    </div>

                    <div className="pro-btn d-flex flex-row w-100 gap4">
                      <i class="bi bi-trash"></i>
                      <p>Delete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
          </>
        ))}
      </div>
    </div>
  );
};

export default AnnoucementComments;
