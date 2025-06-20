import { useEffect, useState } from "react";
import axios from "axios";
import "./ShowData.css";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { BsFillEyeFill } from "react-icons/bs";
import Select from "react-select";
import { baseUrl } from "../../../../utils/config";
import imageTest1 from "../../../../assets/img/product/Avtrar1.png";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import LetterheadPreview from "../../../PreOnboarding/LetterHeadPreview";

const UserOverview = () => {
  const { userContextData, DepartmentContext } = useAPIGlobalContext();
  const [search, setSearch] = useState("");
  const [datas, setDatas] = useState([]);
  const [contextData, setData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (selectedDepartment === "") {
      setDatas(userContextData);
    } else {
      const filteredData = userContextData.filter(
        (item) =>
          item.dept_id == selectedDepartment && item.user_status == "Active"
      );
      setDatas(filteredData);
    }
  }, [selectedDepartment, userContextData]);

  useEffect(() => {
    const result = userContextData.filter((d) => {
      return d.user_name.toLowerCase().match(search.toLowerCase());
    });
    setData(result);
  }, [search]);

  return (
    <>
      {/* <LetterheadPreview /> */}

      <div className="action_heading" style={{ margin: "10px 0 30px 0" }}>
        <div className="action_btns">
          <Link to="/admin/user/user-hierarchy">
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
                options={DepartmentContext.map((option) => ({
                  value: option.dept_id,
                  label: `${option.dept_name}`,
                }))}
                value={{
                  value: selectedDepartment,
                  label:
                    DepartmentContext.find(
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
                  {console.log(detail.image_url, "clg hai")}
                  <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                    <div className="summary_card">
                      <div className="summary_cardtitle">
                        <h5>
                          <span>{detail.user_name}</span>
                        </h5>
                        <div className="summary_cardaction">
                          <Link
                            to={`/admin/user/user-single/${detail.user_id}`}
                          >
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
                              src={
                                detail.image_url &&
                                detail.image_url !==
                                  "https://storage.googleapis.com/node-prod-bucket/"
                                  ? detail.image_url
                                  : "https://cdn.vectorstock.com/i/500p/82/99/no-image-available-like-missing-picture-vector-43938299.jpg"
                              }
                              alt="no image"
                              style={{
                                borderRadius: "50%",
                                height: "80px",
                                width: "80px",
                              }}
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
