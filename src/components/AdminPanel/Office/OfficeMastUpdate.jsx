import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

function OfficeMastUpdate() {
  const { toastAlert } = useGlobalContext();
  const [id, setId] = useState(0);
  const [sittingMast, setSittingMast] = useState("");
  const [roomimage, setRoomImage] = useState("");
  const [remark, setRemark] = useState("");
  const [createdby, setCreatedBy] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("room_id", id);
    formData.append("sitting_ref_no", sittingMast);
    formData.append("room_image", roomimage);
    formData.append("remarks", remark);
    formData.append("created_by", createdby);

    await axios.put(`${baseUrl}` + `update_room`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setSittingMast("");
    setRemark("");

    toastAlert("Form Submitted success");
    setIsFormSubmitted(true);
  };

  useEffect(() => {
    setId(localStorage.getItem("room_id"));
    setSittingMast(localStorage.getItem("sitting_ref_no"));
    setRemark(localStorage.getItem("remarks"));
    setCreatedBy(localStorage.getItem("created_by_name"));
  }, []);
  if (isFormSubmitted) {
    return <Navigate to="/admin/office-mast-overview" />;
  }
  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Sitting</h2>
        </div>
      </div>

      <div className="card shadow mb24">
        <div className="card-header d-flex flex-row align-items-center justify-content-between">
          <div className="card_header_title">
            <h2>Sitting Update</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="thm_form">
            <form onSubmit={handleSubmit} className="row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="form-group">
                  <label className="form-label">Sitting Ref No </label>
                  <input
                    type="text"
                    className="form-control"
                    id="validationCustom01"
                    required
                    value={sittingMast}
                    onChange={(e) => setSittingMast(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="form-group">
                  <label className="form-label">Room Image </label>
                  <input
                    type="file"
                    className="form-control"
                    id="validationCustom01"
                    name="This is laskjl"
                    onChange={(e) => setRoomImage(e.target.files[0])}
                  />
                </div>
              </div>

              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="form-group">
                  <label className="form-label">Remark</label>
                  <textarea
                    value={remark}
                    className="form-control"
                    onChange={(e) => setRemark(e.target.value)}
                    name=""
                    id=""
                    cols="45"
                    rows="5"
                    required={false}
                  />
                </div>
              </div>

              {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="form-group">
                  <label className="form-label">Created BY</label>
                  <input
                    disabled
                    type="text"
                    className="form-control"
                    id="validationCustom01"
                    required
                    value={createdby}
                    onChange={(e) => setCreatedBy(e.target.value)}
                  />
                </div>
              </div> */}

              <div className="col-12 ">
                <button
                  className="btn cmnbtn btn-primary"
                  style={{ marginRight: "5px" }}
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default OfficeMastUpdate;
