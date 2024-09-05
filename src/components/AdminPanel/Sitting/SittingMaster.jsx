import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../../utils/config";

const SittingMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [sittingRefrenceNum, setSittingRefNum] = useState("");
  const [sittingArea, setSittingArea] = useState("");
  const [roomId, setRoomId] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [roomData, getRoomData] = useState([]);
  const [isFormSubmitted, setIsFormSubmited] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserID = decodedToken.id;
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post(baseUrl + "add_sitting", {
        sitting_ref_no: sittingRefrenceNum,
        room_id: Number(roomId),
        sitting_area: sittingArea,
        remarks: remark,
        created_by: loginUserID,
      })
      .then(() => {
        setSittingRefNum("");
        setSittingArea("");
        setRemark("");

        toastAlert("Form Submitted Success");
        setIsFormSubmited(true);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };
  useEffect(() => {
    axios
      .get(baseUrl + "get_all_rooms")
      .then((res) => {
        getRoomData(res.data.data);
      })
      .catch((error) => {
        console.log(error, "error hai yha");
      });
  }, []);
  if (isFormSubmitted) {
    return <Navigate to="/admin/sitting-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Sitting"
        title="Sitting Registration"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Sitting Number"
          placeholder="IT-1"
          value={sittingRefrenceNum}
          onChange={(e) => setSittingRefNum(e.target.value)}
        />
        <FieldContainer
          label="Sitting Area"
          Tag="select"
          value={roomId}
          onChange={(e) => {
            const selectedRoomOption = e.target.value;
            setRoomId(selectedRoomOption);
            const selectedRoomNo = roomData.find(
              (option) => option.room_id === Number(selectedRoomOption)
            );
            setSittingArea(selectedRoomNo ? selectedRoomNo.sitting_ref_no : "");
          }}
        >
          <option value="">choose...</option>
          {roomData.map((d) => (
            <option value={d.room_id} key={d.room_id}>
              {d.sitting_ref_no}
            </option>
          ))}
        </FieldContainer>

        <FieldContainer
          label="Remark"
          Tag="textarea"
          rows="3"
          required={false}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
    </>
  );
};

export default SittingMaster;
