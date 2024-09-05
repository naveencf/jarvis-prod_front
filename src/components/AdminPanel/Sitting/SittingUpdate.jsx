import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import jwtDecode from "jwt-decode";
import {baseUrl} from '../../../utils/config'

const SittingUpdate = () => {
  const { toastAlert } = useGlobalContext();
  const [id, setId] = useState(0);
  const [sittingRefrenceNum, setSittingRefNum] = useState("");
  const [sittingArea, setSittingArea] = useState("");
  const [roomId, setRoomId] = useState("");
  const [remark, setRemark] = useState("");
  const [error, setError] = useState("");
  const [roomData, setRoomData] = useState([]);
  const [isFormSubmitted, setIsFormSubmited] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserID = decodedToken.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    axios
      .put(`${baseUrl}`+`update_sitting`, {
        sitting_id: id,
        sitting_ref_no: sittingRefrenceNum,
        sitting_area: sittingArea,
        room_id: Number(roomId),
        remarks: remark,
        last_updated_by: loginUserID,
      })
      .then(() => {
        setSittingRefNum("");
        setSittingArea("");
        setRoomId("");
        setRemark("");

        toastAlert("form Submitted Success");
        setIsFormSubmited(true);
      })
      .catch((error) => {
        setError("An Error occurred while submitting the form");
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_rooms")
      .then((res) => {
        setRoomData(res.data.data);
      })
      .catch((error) => {
        console.log(error, "error hai yha");
      });
  }, []);

  useEffect(() => {
    setId(localStorage.getItem("sitting_id"));
    setSittingRefNum(localStorage.getItem("sitting_ref_no"));
    setRoomId(localStorage.getItem("room_id"));
    setSittingArea(localStorage.getItem("sitting_area"));
    setRemark(localStorage.getItem("remarks"));
  }, []);

  if (isFormSubmitted) {
    return <Navigate to="/admin/sitting-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Sitting"
        title="Sitting Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Sitting Refrence Number"
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
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default SittingUpdate;
