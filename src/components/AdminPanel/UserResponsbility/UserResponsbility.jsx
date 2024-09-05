import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import { baseUrl } from "../../../utils/config";

const UserResponsbility = () => {
  const whatsappApi = WhatsappAPI();
  const { toastAlert } = useGlobalContext();
  const [userName, setUserName] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [userData, getUserData] = useState([]);
  const [responsibilityData, setResponsibilityData] = useState([]);
  const [userContact, setUserContact] = useState("");
  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUser = decodedToken.id;

  function getUserCompleteData() {
    axios.get(baseUrl + "get_all_users").then((res) => {
      const data = res.data.data;
      getUserData(data);
      setUserContact(
        userData.filter((d) => d.user_id === userName)[0].user_contact_no
      );
    });
  }

  useEffect(() => {
    getUserCompleteData();
  }, [userName]);
  useEffect(() => {
    const selectedData = userData.filter(
      (data) => data.user_id == Number(userName)
    );
    if (selectedData !== 0) {
      setDepartment(selectedData[0]?.department_name);
      setDesignation(selectedData[0]?.designation_name);
      setSubDepartment(selectedData[0]?.sub_department_name);
    }
  }, [userName, userData]);

  useEffect(() => {
    axios.get(baseUrl + "get_all_responsibilitys").then((res) => {
      setResponsibilityData(res.data);
    });
  }, [todos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      for (const element of todos) {
        await axios.post(baseUrl + "add_job_responsibility", {
          user_id: userName,
          job_responsi: element.responsibility,
          description: element.description,
          created_by: loginUser,
        });

        await whatsappApi.callWhatsAPI(
          "User Responsibility",
          JSON.stringify(userContact),
          userName,
          [element.responsibility]
        );
      }
      setUserName("");
      setResponsibility("");
      setDescription("");
      toastAlert("Submitted success");
      setIsFormSubmitted(true);
    } catch (error) {
      setError("An error occurred during submission.");
      alert(error.response.data.message);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/user-respons-overivew" />;
  }
  const handleAddTodo = () => {
    console.log(responsibility, "response");
    if (responsibility?.trim() === "" || description?.trim() === "") {
      return;
    }
    setTodos((prevTodos) => [
      ...prevTodos,
      { description: description, responsibility: responsibility },
    ]);
    setResponsibility("");
    setDescription("");
  };

  return (
    <div>
      <FormContainer
        submitButton={false}
        mainTitle="Responsibility"
        title="User Responsiblity"
        handleSubmit={handleSubmit}
      >
        <div className="">
          <div className="form-group">
            <label className="form-label">
              User Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={userData.map((option) => ({
                value: option.user_id,
                label: `${option.user_name}`,
              }))}
              value={{
                value: userName,
                label:
                  userData.find((user) => user.user_id === userName)
                    ?.user_name || "",
              }}
              onChange={(e) => {
                setUserName(e.value);
              }}
              required
            />
          </div>
        </div>

        {userName !== "" && (
          <>
            <FieldContainer
              disabled
              label="Department"
              value={department}
              fieldGrid={3}
              required={false}
            />
            <FieldContainer
              disabled
              label="Sub Department"
              value={subDepartment}
              fieldGrid={3}
              required={false}
            />
            <FieldContainer
              disabled
              label="Designation"
              value={designation}
              fieldGrid={6}
              required={false}
            />
          </>
        )}
        {/* {console.log("responsibitlity", responsibility)} */}
        {/* <FieldContainer
          label="Responsibility"
          Tag="select"
          fieldGrid={6}
          value={responsibility}
          required={false}
          onChange={(e) => setResponsibility(e.target.value)}
        >
          <option selected disabled value="">
            Choose...
          </option>
          {responsibilityData.map((option) => (
            <option key={option.id} value={option.respo_name}>
              {option.respo_name}
            </option>
          ))}
        </FieldContainer> */}
        <div className="">
          <div className="form-group">
            <label className="form-label">
              Responsiblity <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={responsibilityData.map((option) => ({
                value: option.respo_name,
                label: `${option.respo_name}`,
              }))}
              value={{
                value: responsibility,
                label:
                  responsibilityData.find(
                    (user) => user.respo_name === responsibility
                  )?.respo_name || "",
              }}
              onChange={(e) => {
                setResponsibility(e.value);
              }}
              required
            />
          </div>
        </div>

        <div className="">
          <div className="form-group">
            <label className="form-label">
              Description <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              className=""
              options={responsibilityData.map((option) => ({
                value: option.description,
                label: `${option.description}`,
              }))}
              value={{
                value: description,
                label:
                  responsibilityData.find(
                    (user) => user.description === description
                  )?.description || "",
              }}
              onChange={(e) => {
                setDescription(e.value);
              }}
              required
            />
          </div>
        </div>
        <div className="col-md-12" style={{ margin: "10px" }}>
          <div className="d-flex justify-content-between">
            <button
              className="btn cmnbtn btn_sm btn-success"
              style={{ marginRight: "5px" }}
              type="button"
              onClick={handleAddTodo}
            >
              Add Todo
            </button>
            {todos.length !== 0 && (
              <button
                type="submit"
                className="btn cmnbtn btn-primary"
                onClick={handleSubmit}
              >
                {" "}
                Submit
              </button>
            )}
          </div>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
      {todos.length > 0 && (
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 p-0">
          <div className="card">
            <div className="card-body">
              <div className="res_des_card">
                <div className="responsibility_main_box">
                  <div className=" d-flex">
                    <div className="responsibility_s_box">
                      <div className="profile_data_box_head">
                        <h2 className="">Responsibility</h2>
                      </div>
                    </div>
                    <div className="description_s_box">
                      <div className="profile_data_box_head">
                        <h2 className="">Description</h2>
                      </div>
                    </div>
                  </div>
                  <div className="profile_data_box_body">
                    <ul>
                      {todos.map((todo, index) => (
                        <li key={index}>
                          <p>{todo.responsibility}</p>
                          <span style={{ marginLeft: "150px" }}>
                            {" "}
                            {todo.description}{" "}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserResponsbility;
