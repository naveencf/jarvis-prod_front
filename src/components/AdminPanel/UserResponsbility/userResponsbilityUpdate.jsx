import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

const UserResponsbilityUpdate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [id, setId] = useState(0);
  const [userName, setUserName] = useState("");
  const [responsbility, setResponsibility] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [submitButtonAccess, setSubmitButtonAccess] = useState(false);
  const [todos, setTodos] = useState([]);
  const [userData, getUserData] = useState([]);
  const [responsibilityData, setResponsibilityData] = useState([]);

  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  useEffect(() => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      getUserData(res.data.data);
    });
  }, []);
  useEffect(() => {
    axios.get(baseUrl + "get_all_responsibilitys").then((res) => {
      setResponsibilityData(res.data);
    });
  }, []);

  useEffect(() => {
    const selectedData = userData.filter(
      (data) => data.user_id == Number(userName)
    );
    if (selectedData !== 0) {
      setDepartment(selectedData[0]?.department_name);
      setDesignation(selectedData[0]?.designation_name);
    }
  }, [userName]);

  useEffect(() => {
    setId(localStorage.getItem("Job_res_id"));
    setUserName(localStorage.getItem("user_id"));
    setResponsibility(localStorage.getItem("sjob_responsibility"));
    setDescription(localStorage.getItem("description"));
    if (todos.length !== 0) {
      setSubmitButtonAccess(true);
    } else {
      setSubmitButtonAccess(false);
    }
  }, [todos]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      for (const element of todos) {
        await axios.put(`${baseUrl}update_jobresponsibility`, {
          Job_res_id: Number(id),
          user_id: Number(userName),
          job_responsi: element.responsbility,
          description: element.description,
        });
      }
      setUserName("");
      setResponsibility("");
      setDescription("");
      toastAlert("Submitted success");
      setIsFormSubmitted(true);
    } catch (error) {
      toastError("Error assigning responsibility");
      alert(error.response.data.message);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/user-respons-overivew" />;
  }
  const handleAddTodo = () => {
    if (responsbility.trim() === "" || description.trim() === "") {
      return;
    }
    setTodos(() => [
      { description: description, responsbility: responsbility },
    ]);
    setResponsibility("");
    setDescription("");
  };
  return (
    <>
      <FormContainer
        submitButton={submitButtonAccess}
        mainTitle="Responsibility"
        title="Responsibility Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="User Name"
          Tag="select"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        >
          <option selected disabled value="">
            choose...
          </option>
          {userData.map((d) => (
            <option value={d.user_id} key={d.user_id}>
              {d.user_name}
            </option>
          ))}
        </FieldContainer>
        {userName !== "" && (
          <>
            <FieldContainer
              label="Department"
              value={department}
              fieldGrid={3}
              required={false}
            />
            <FieldContainer
              label="Designation"
              value={designation}
              fieldGrid={3}
              required={false}
            />
          </>
        )}

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
                value: responsbility,
                label:
                  responsibilityData.find(
                    (user) => user.respo_name === responsbility
                  )?.respo_name || "",
              }}
              onChange={(e) => {
                setResponsibility(e.value);
              }}
              required
            />
          </div>
        </div>
        {/* <FieldContainer
          label="Responsibility"
          value={responsbility}
          onChange={(e) => setResponsibility(e.target.value)}
        /> */}
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
        <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12">
          <button
            className="btn btn-success"
            style={{ marginRight: "5px" }}
            type="button"
            onClick={handleAddTodo}
          >
            Add Todo
          </button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
      {todos.length > 0 && (
        <div className="col-md-12">
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
                          <span>{todo.responsbility}</span>
                          <p> {todo.description}</p>
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
    </>
  );
};
export default UserResponsbilityUpdate;
