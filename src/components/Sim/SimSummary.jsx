import axios from "axios";
import React, { useEffect, useState } from "react";
import FormContainer from "../AdminPanel/FormContainer";
import UserNav from "../Pantry/UserPanel/UserNav";
import { useParams } from "react-router";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";

const SimSummary = () => {
  const { toastAlert } = useGlobalContext();
  const [showInfo, setShowInfo] = useState([]);
  const { id } = useParams();

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  function getData() {
    axios
      .get(`${baseUrl}` + `get_allocation_data_by_id/${id}`)
      .then((res) => setShowInfo(res.data));
  }

  useEffect(() => {
    getData();
  }, [id]);

  function handleDelete(e, sum) {
    e.preventDefault();
    axios
      .put(baseUrl + "update_allocationsim", {
        sim_id: sum.sim_id,
        allo_id: sum.allo_id,
        user_id: sum.user_id,
        dept_id: sum.dept_id,
        status: "Deleted",
        submitted_by: loginUserId,
        Last_updated_by: loginUserId,
        Reason: sum.reason,
      })
      .then(() => getData())
      .then(() => {
        toastAlert("Deleted Status Update");
      });
  }

  return (
    <>
      <div>
        <UserNav />

        <div className="section section_padding sec_bg h100vh">
          <div className="container master-card-css ">
            <div className="action_heading">
              <div className="action_title">
                <FormContainer mainTitle="Summary" link="/sim-master" />
              </div>
            </div>
            <div className="summary_cards">
              {showInfo.length === 0 ? (
                <h3>There is No data available</h3>
              ) : (
                showInfo.map((sum) => {
                  const lastUpdatedDate = new Date(sum.Last_updated_date);
                  const submittedDate = new Date(sum.submitted_at);
                  const differenceInMilliseconds =
                    submittedDate - lastUpdatedDate;
                  const differenceInDays =
                    differenceInMilliseconds / (1000 * 60 * 60 * 24);

                  //  There is Date Formate Correct
                  const originalCreationDate = sum.Creation_date
                    ? sum.Creation_date.slice(0, 10)
                    : "";
                  const reversedCreationDate = originalCreationDate
                    .split("-")
                    .reverse()
                    .join("-");

                  return (
                    <div className="summary_card" key={sum.id}>
                      <div className="summary_cardtitle">
                        <div className="summary_box summary_numbox">
                          <h4>
                            Allocated Summary
                            {/* <span>Asset Name</span>
                            {"  :- "}
                            {sum.assetsName} */}
                          </h4>
                        </div>
                        <h5>
                          Allocated user : <span>{sum.userName}</span>
                        </h5>
                        <button
                          className=" btn-outline-black icon-1"
                          title="Delete"
                          onClick={(e) => handleDelete(e, sum)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                      <div className="summary_cardbody">
                        <div className="summary_cardrow">
                          <div className="summary_box summary_numbox">
                            <h4>

                              <span>Asset Name</span>
                              {"  :- "}
                              {sum.assetsName}
                            </h4>
                          </div>
                          <div className="summary_box summary_allocatebox">
                            <h4>
                              <span>Allocated Date {" :-"} </span> &nbsp;
                              {sum.Creation_date ? reversedCreationDate : ""}
                            </h4>
                          </div>

                        </div>
                    

                          <div className="summary_cardrow summary_box summary_reasonbox">
                            <div className="summary_box summary_returnbox">

                              <h4>
                                <span>Returned Date {" :- "} </span> &nbsp;
                            
                                {sum.submitted_at
                                  ? sum.submitted_at.slice(0,10)
                                    .split("-")
                                    .reverse()
                                    .join("-")
                                  : ""}
                              </h4>
                            </div>
                            <div className="summary_box summary_returnbox">
                            <h4>
                              <span>Reason {" :- "}</span> &nbsp;
                              {sum.reason}
                            </h4>
                            </div>
                          </div>
                      
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: "80%", margin: "0 0 0 10%" }}></div>
    </>
  );
};

export default SimSummary;
