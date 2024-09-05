import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";
import { data } from "jquery";
import imageTest1 from "../../../assets/img/product/Avtrar1.png";
import { calc } from "antd/es/theme/internal";
import { useGlobalContext } from "../../../Context/Context";

const AnnoucementReactionView = ({
  announcementId,
  isOpen,
  reactionType,
  reactionObj,
}) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [reactionData, setReactionData] = useState({});
  const [dataToShow, setDataToShow] = useState([]);
  const [activebtn, setActivebtn] = useState("all");

  const getAnnouncementData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}get_announcement_reaction_details/${announcementId}`
      );
      if (res.status === 200) {
        setReactionData(res.data.data[0].reactionsData);
        const newDataToShow = Object.entries(
          res.data.data[0].reactionsData
        ).flatMap(([key, value]) =>
          value.map((obj) => ({ ...obj, reaction: key }))
        );
        setDataToShow(newDataToShow);

      }
    } catch (error) {
      toastError(
        error.response?.data?.error || "Error fetching announcements"
      );
    }
  };
  useEffect(() => {
    // Show all data by default when the component mounts
    handleFilter("all");
    return () => {
      handleFilter("all");
    };
  }, []);

  const handleFilter = (reaction) => {
    setActivebtn(reaction);
    if (reaction === "all") {
      // Flatten all ID arrays into one and add the key to each object
      setDataToShow(
        Object.entries(reactionData).flatMap(([key, value]) =>
          value.map((obj) => ({ ...obj, reaction: key }))
        )
      );
    } else {
      setDataToShow(
        reactionData[reaction].map((obj) => ({ ...obj, reaction }))
      );
    }
  };


  useEffect(() => {
    getAnnouncementData();
  }, []);

  return (
    <>
      <div
        className="pack  sb rec-tab"
        style={{ justifyContent: "center", position: "relative" }}
      >
        <div
          className=" opt-btn w-100 pack align-items-center justify-content-center h-100"
          onClick={() => handleFilter("all")}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderBottom:
              activebtn === "all" ? "2px solid var(--gray-800)" : "",
          }}
        >
          <h5 className="rec-com">All</h5>
        </div>
        {Object.keys(reactionData).map((type) => (
          <div
            className=" opt-btn flex-row align-items-center justify-content-center h-100 w-100"
            onClick={() => handleFilter(type)}
            style={{
              cursor: "pointer",
              borderBottom:
                activebtn === type ? "2px solid var(--gray-800)" : "",
            }}
          >
            <h5>{reactionObj[type.split("U")[0]]}</h5>
            <h6 className="rec-com">({reactionData[type].length})</h6>
          </div>
        ))}
      </div>
      <div
        className="pack w-100"
        style={{ borderBottom: "1px solid  var(--border)" }}
      >
        {
          // Show a message if there is no data to show
          dataToShow.length === 0 && (
            <div
              className="pack w-100 flex-row p-2 justify-content-center align-items-center"
              style={{ borderTop: "1px solid  var(--border)" }}
            >
              <h5>No data to show</h5>
            </div>
          )
        }
        <div className="d-flex flex-column hidden-scroll-bar">

          {dataToShow.map((item, index) => (
            <div
              key={item.user_id}
              className="sb pack w-100 flex-row p-2"
              style={{ borderTop: "1px solid  var(--border)" }}
            >
              <div className="pack flex-row jutify-content-center align-items-center">
                <div
                  className="profile-sec mr-3"
                  style={{ alignItems: "center" }}
                >
                  <div className="profile-img">
                    <img
                      src={item.image !== "" ? item.image : imageTest1}
                      alt=""
                      width={40}
                    />
                  </div>
                </div>
                <div className="d-flex flex-column">
                  <h6>{item.user_name}</h6>
                  <p className="rec-com">{item.desi_name}</p>
                </div>
              </div>

              <h5>{reactionObj[item.reaction.split("U")[0]]}</h5>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default AnnoucementReactionView;
