import { Avatar, Autocomplete, TextField, Stack, Box } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

function PageDetails({ creatorDetail, setCreatorDetail }) {
  const { creatorName } = useParams();
  const [pages, setPages] = useState([]);

  const getDatapages = async () => {
    try {
      const res = await axios(`https://insights.ist:8080/api/v1/community/super_tracker_page_by_st/1`);
      setPages(res.data.data);
    } catch (error) {
      console.error("Error fetching pages data:", error);
    }
  };

  useEffect(() => {
    axios
      .post(`https://insights.ist:8080/api/getCreatorReport`, {
        creatorName: creatorName,
      })
      .then((res) => {
        setCreatorDetail(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching creator details:", error);
      });

    getDatapages();
  }, [creatorName, setCreatorDetail]);

  const formatString = (s) => {
    let formattedString = s.replace(/^_+/, "");
    if (formattedString) {
      formattedString =
        formattedString.charAt(0).toUpperCase() +
        formattedString.slice(1).toLowerCase();
    }
    return formattedString;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} k`;
    } else {
      return Math.round(value).toString();
    }
  };

  const handlePageChange = (event, newValue) => {
    if (newValue) {
      const pageUrl = `/admin/instaapi/community/manager/${newValue}`;
      window.open(pageUrl, '_blank');
    }
  };

  return (
    <div className="card">
      <Box sx={{ display: 'flex', mt: 2, ml: 2, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Autocomplete
          disablePortal
          sx={{ width: 300 }}
          options={pages.map((ele) => ele.page_name)}
          renderInput={(params) => <TextField {...params} label="Select Page" />}
          onChange={handlePageChange}
        />
      </Box>


      <div className="card-body">
        <div className="row pgHeader">
          <div className="col pgAccountCol">
            <Link
              to={`https://www.instagram.com/${creatorName}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="pgAccount">
                <div className="pgAccountAvatar">
                  <Avatar
                    src={`https://storage.googleapis.com/insights_backend_bucket/cr/${creatorName}.jpeg`}
                    alt={creatorName}
                  />
                </div>
                <div className="pgAccountText">
                  <h2>{formatString(creatorName)}</h2>
                  <div>
                    <p>{creatorDetail?.biography}</p>
                  </div>
                  <ul className="pgAccountSocial">
                    {/* <li>
                      <a href="#">
                        <i className="bi bi-twitter"></i>
                      </a>
                    </li> */}
                    <li>
                      <Link
                        to={`https://www.instagram.com/${creatorName}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="bi bi-instagram"></i>
                      </Link>
                    </li>
                    {/* <li>
                      <a href="#">
                        <i className="bi bi-youtube"></i>
                      </a>
                    </li> */}
                    {/* <li>
                      <a href="#">
                        <i className="bi bi-facebook"></i>
                      </a>
                    </li> */}
                  </ul>
                </div>
              </div>
            </Link>
          </div>
          {creatorDetail && (
            <div className="col pgStatsCol">
              <div className="col pgStats">
                <ul>
                  <li>
                    {formatNumber(creatorDetail.mediaCount)}
                    <span>Posts</span>
                  </li>
                  <li>
                    {formatNumber(creatorDetail.followersCount)}
                    <span>Followers</span>
                  </li>
                  <li>
                    {formatNumber(creatorDetail.followingCount)}
                    <span>Following</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PageDetails;
