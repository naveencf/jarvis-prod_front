import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";
import Select from "react-select";
import { useAPIGlobalContext } from "../APIContext/APIContext";

const SittingUpdate = () => {
  const navigate = useNavigate(); // Hook for navigation
  const { toastAlert } = useGlobalContext();
  const { userContextData } = useAPIGlobalContext();
  const { id } = useParams();
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [sittingNumber, setSittingNumber] = useState("");
  const [room, setRoom] = useState("");
  const [remark, setRemark] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserID = decodedToken.id;

  // Fetch sitting details
  useEffect(() => {
    axios
      .get(`${baseUrl}get_single_sitting/${id}`)
      .then((res) => {
        console.log(res.data, "datasitting");
        const { sitting_ref_no, sitting_area, user_id, remark } = res.data;
        setSittingNumber(sitting_ref_no);
        setRoom(sitting_area);
        setUser(user_id);
        setRemark(remark);
      })
      .catch((error) => console.error("Error fetching room details:", error));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios
      .put(`${baseUrl}update_sitting`, {
        sitting_id: id,
        user_id: user,
        remarks: remark,
        last_updated_by: loginUserID,
      })
      .then(() => {
        toastAlert("Sitting Updated Successfully");
        navigate(-1); // Navigate back to the previous page
      })
      .catch((error) => {
        setError("An Error occurred while submitting the form");
        console.error(error);
      });
  };

  return (
    <>
      <FormContainer
        mainTitle="Sitting"
        title="Sitting Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Sitting Number"
          fieldGrid={4}
          value={sittingNumber}
          onChange={(e) => setSittingNumber(e.target.value)}
        />
        <FieldContainer
          label="Room"
          fieldGrid={4}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        
        <div className="form-group col-4">
          <label className="form-label">User Name</label>
          <Select
            className=""
            options={userContextData?.map((option) => ({
              value: option.user_id,
              label: `${option.user_name}`,
            }))}
            value={{
              value: user,
              label:
                userContextData.find((val) => val.user_id === user)
                  ?.user_name || "",
            }}
            onChange={(e) => setUser(e.value)}
            required
          />
        </div>

        <FieldContainer
          label="Remark"
          Tag="textarea"
          rows="3"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default SittingUpdate;
