import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { useGetVendorWhatsappLinkTypeQuery } from "../../../Store/reduxBaseURL";

function WhatsapplinksModel({ waData, setWaData }) {
  const storedToken = sessionStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [waDataLinks, setWaDataLinks] = useState([]);

  const { data: linkType } = useGetVendorWhatsappLinkTypeQuery();
  useEffect(() => {
    // setLoading(true);
    const result = axios
      .get(`${baseUrl}v1/vendor_group_link_vendor_id/${waData?.vendor_id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setWaDataLinks(res.data.data);
        setLoading(false);
      });
  }, []);
  const handleClose = () => {
    setWaDataLinks([]);
    setWaData(null);
    setLoading(true);
  };
  // console.log(loading,"loading")
  return (
    <div id="waModal" className="modal fade" role="dialog">
      <div className="modal-dialog" style={{ maxWidth: "40%" }}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">
              &times;
            </button>
            <h4 className="modal-title"></h4>
          </div>
          <div className="modal-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Type</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "80vh",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : waDataLinks.length > 0 ? (
                  waDataLinks.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {
                          linkType?.data.find((type) => type?._id == item.type)
                            ?.link_type
                        }
                      </td>
                      <td>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.link}
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-default"
              data-dismiss="modal"
              onClick={() => handleClose()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsapplinksModel;
