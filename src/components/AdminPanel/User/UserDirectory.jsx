import { useEffect, useState } from "react";
import axios from "axios";
import "./ShowData.css";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { BsFillEyeFill } from "react-icons/bs";
import Select from "react-select";
import {baseUrl} from '../../../utils/config'

const UserOverview = () => {
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [contextData, setData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentData, setDepartmentData] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(`${baseUrl}`+`userauth/${userID}`)
        .then((res) => {
          setData(res.data);
        });
    }
  }, [userID]);

  function getData() {
    axios.get(baseUrl+"get_all_users").then((res) => {
      setDatas(res.data.data);
      setBackupData(res.data.data);
    });

    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentData(res.data);
      });
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (selectedDepartment === "") {
      setDatas(backupData);
    } else {
      const filteredData = backupData.filter(
        (item) => item.dept_id == selectedDepartment
      );
      setDatas(filteredData);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.user_name.toLowerCase().match(search.toLowerCase());
    });
    setData(result);
  }, [search]);

  return (
    <>
      <div className="action_heading" style={{ margin: "10px 0 30px 0" }}>
        <div className="action_btns">
          <Link to="/admin/user-hierarchy">
            <button type="button" className="btn btn-outline-primary btn-sm">
              User Hierarchy
            </button>
          </Link>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body pb0 pb4">
          <div className="row thm_form">
            <div className="form-group col-6">
              <label className="form-label">
                Department <sup style={{ color: "red" }}>*</sup>
              </label>
              <Select
                options={departmentData.map((option) => ({
                  value: option.dept_id,
                  label: `${option.dept_name}`,
                }))}
                value={{
                  value: selectedDepartment,
                  label:
                    departmentData.find(
                      (user) => user.dept_id === selectedDepartment
                    )?.dept_name || "",
                }}
                onChange={(e) => {
                  setSelectedDepartment(e.value);
                }}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12">
              <div className="form-group">
                <label className="form-label">Search</label>
                <input
                  className="form-control"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by User Name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="summary_cards flex-row row">
        {datas.length > 0 &&
          datas
            .filter((detail) =>
              detail.user_name.toLowerCase().includes(search.toLowerCase())
            )
            .map((detail) => {
              return (
                <>
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="summary_card">
                      <div className="summary_cardtitle">
                        <h5>
                          <span>{detail.user_name}</span>
                        </h5>
                        <div className="summary_cardaction">
                          <Link to={`/admin/user-single/${detail.user_id}`}>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Short View"
                            >
                              <BsFillEyeFill />
                            </button>
                          </Link>
                        </div>
                      </div>
                      <div className="summary_cardbody">
                        <div className="summary_cardrow flex-column">
                          <div className="summary_box text-center ml-auto mr-auto">
                            <img
                              src={detail.image_url}
                              width="80px"
                              height="80px"
                              style={{ borderRadius: "50%" }}
                            />
                          </div>
                          <div className="summary_box col">
                            <h3>{detail.user_name}</h3>
                          </div>
                          <div className="summary_box col">
                            <h4>
                              {/* <span>Type</span> */}
                              {detail.designation_name}
                            </h4>
                          </div>
                          <div className="summary_box col">
                            <h4>
                              <span>Department:</span>
                              {detail.department_name}
                            </h4>
                          </div>
                          <div className="summary_box col">
                            <h4>
                              <span>Location:</span>
                              {detail.job_type}
                            </h4>
                          </div>
                          <div className="summary_box col">
                            <h4>
                              <span>Email:</span>
                              {detail.user_email_id}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
      </div>
    </>
  );
};
export default UserOverview;
