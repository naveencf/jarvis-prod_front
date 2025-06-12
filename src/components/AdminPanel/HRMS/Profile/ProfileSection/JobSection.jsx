import React from "react";
import DateFormattingComponent from "../../../../DateFormator/DateFormared";

const JobSection = ({ userData }) => {
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Job Details</h5>
            </div>
            <div className="card-body p0 profileTabBody">
              <div className="profileTabInfo">
                <div className="row profileTabRow">
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Employee Number</h3>
                      <h4>{userData?.user_id ? userData?.user_id : "NA"}</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Date of Joining</h3>
                      <h4>
                        <DateFormattingComponent
                          date={userData?.joining_date?.split("T")[0]}
                        />
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Designation</h3>
                      <h4>
                        {userData?.designation_name
                          ? userData?.designation_name
                          : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>In Probation?</h3>
                      <h4>6 Month</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Notice Period</h3>
                      <h4>60 days</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Job Type</h3>
                      <h4>{userData?.job_type ? userData?.job_type : "NA"}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-12">
          <div className="card">
            <div className="card-header flexCenterBetween">
              <h5 className="card-title">Organization</h5>
            </div>
            <div className="card-body p0 profileTabBody">
              <div className="profileTabInfo">
                <div className="row profileTabRow">
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Business Unit</h3>
                      <h4>Creativefuel Private Limited</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Department</h3>
                      <h4>
                        {userData?.department_name
                          ? userData?.department_name
                          : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Location</h3>
                      <h4>Indore</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Legal Entity</h3>
                      <h4>Creativefuel Private Limited</h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Reports to</h3>
                      <h4>
                        {userData?.Report_L1N ? userData?.Report_L1N : "NA"}
                      </h4>
                    </div>
                  </div>
                  <div className="col-md-6 col-12 profileTabCol">
                    <div className="profileTabBox">
                      <h3>Manager of Manager (L2 Manager)</h3>
                      <h4>
                        {userData?.Report_L2N ? userData?.Report_L2N : "NA"}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobSection;
