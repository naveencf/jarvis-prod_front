import React, { useState, useEffect } from "react";
import FormContainer from "../../FormContainer";
import FieldContainer from "../../FieldContainer";
import axios from "axios";
import { useGlobalContext } from "../../../../Context/Context";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";

const Hobbies = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toastAlert, toastError } = useGlobalContext();
  const [hobby, setHobby] = useState("");

  const [isRequired, setIsRequired] = useState({
    hobby: false,
  });

  useEffect(() => {
    if (id !== 0) getData();
  }, [id]);

  const getData = async () => {
    try {
      const response = await axios.get(`${baseUrl}` + `get_single_hobby/${id}`);
      const hobbyName = response.data.data.hobby_name;
      setHobby(hobbyName);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hobby == "") {
      setIsRequired((perv) => ({ ...perv, hobby: true }));
    }
    if (!hobby) {
      return toastError("Fill Required Fields");
    }
    try {
      if (id == 0) {
        const response = await axios.post(baseUrl + "add_hobby", {
          hobby_name: hobby,
        });
      } else {
        const response = await axios.put(`${baseUrl}` + `update_hobby`, {
          hobby_id: id,
          hobby_name: hobby,
        });
      }
      toastAlert("Submited Succesfully");
      setHobby("");
      navigate("/admin/hobbies-overview");
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };
  return (
    <div>
      <FormContainer
        mainTitle="Hobbies"
        title="Hobbies Creation"
        handleSubmit={handleSubmit}
      >
        <div className="row mb-4">
          <div className="col-3"></div>
          <FieldContainer
            label="Hobbie"
            astric
            fieldGrid={12}
            required={false}
            value={hobby}
            onChange={(e) => {
              const hobbieVal = e.target.value;
              setHobby(hobbieVal);
              if (hobbieVal === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  hobby: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  hobby: false,
                }));
              }
            }}
          />
          {isRequired.hobby && (
            <p className="form-error">Please Enter Hobbie</p>
          )}
        </div>
      </FormContainer>
    </div>
  );
};

export default Hobbies;
