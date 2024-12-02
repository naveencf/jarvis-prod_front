import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

function OfficeMastUpdate() {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [formData, setFormData] = useState({
    sittingMast: "",
    roomimage: "",
    remark: "",
    createdby: "",
    totalNoSeats: "",
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Fetch room details
  useEffect(() => {
    axios
      .get(`${baseUrl}get_room/${id}`)
      .then((res) => {
        const { sitting_ref_no,  room_image, remarks, created_by, total_no_seats } = res.data;
        setFormData({
          sittingMast: sitting_ref_no || "",
          roomimage: room_image || "",
          remark: remarks || "",
          createdby: created_by || "",
          totalNoSeats: total_no_seats || "",
        });
      })
      .catch((error) => console.error("Error fetching room details:", error));
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    updatedFormData.append("room_id", id);
    updatedFormData.append("sitting_ref_no", formData.sittingMast);
    updatedFormData.append("room_image", formData.roomimage);
    updatedFormData.append("total_no_seats", formData.totalNoSeats);
    updatedFormData.append("remarks", formData.remark);
    updatedFormData.append("created_by", formData.createdby);

    try {
      await axios.put(`${baseUrl}update_room`, updatedFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toastAlert("Form Submitted successfully!");
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/office-mast-overview" />;
  }

  return (
    <div className="office-mast-update">
      <div className="form-heading">
        <h2>Sitting Update</h2>
      </div>

      <div className="card shadow mb24">
        <div className="card-header">
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row">
            {/* Sitting Ref No */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="form-group">
                <label className="form-label">Sitting Ref No</label>
                <input
                  type="text"
                  className="form-control"
                  name="sittingMast"
                  value={formData.sittingMast}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Total Number of Seats */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="form-group">
                <label className="form-label">Total Number of Seats</label>
                <input
                  type="text"
                  className="form-control"
                  name="totalNoSeats"
                  value={formData.totalNoSeats}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Room Image */}
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="form-group">
                <label className="form-label">Room Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="roomimage"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Remark */}
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="form-group">
                <label className="form-label">Remark</label>
                <textarea
                  className="form-control"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  cols="45"
                  rows="5"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12">
              <button className="btn cmnbtn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OfficeMastUpdate;
