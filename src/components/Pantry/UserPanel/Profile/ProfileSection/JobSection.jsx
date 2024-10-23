import React from "react";
import DateFormattingComponent from "../../../../DateFormator/DateFormared";

const JobSection = ({ userData }) => {
  return (
    <>
      <div className="col-8" style={{ border: "1px solid " }}>
        <h4>Job Details</h4>
        <div className="profileInfo_area">
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>EMPLOYEE NUMBER</h3>
                <h4>{userData.user_id ? userData.user_id : "NA"}</h4>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>DATE OF JOINING</h3>
                <h4>
                  <DateFormattingComponent
                    date={userData.joining_date?.split("T")[0]}
                  />
                </h4>
              </div>
            </div>
          </div>
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Designation</h3>
                <h4>
                  {userData.designation_name ? userData.designation_name : "NA"}
                </h4>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>In Probation?</h3>
                <h4>6 Month</h4>
              </div>
            </div>
          </div>
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Notice Period</h3>
                <h4>60 days</h4>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Job Type</h3>
                <h4>{userData.job_type ? userData.job_type : "NA"}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-4" style={{ border: "1px solid " }}>
        <h4>Organization</h4>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="profileInfo_box">
            <h3>Business Unit</h3>
            <h4>Creativefuel Private Limited</h4>
          </div>
        </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="profileInfo_box">
          <h3>Department</h3>
          <h4>{userData.department_name ? userData.department_name : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="profileInfo_box">
          <h3>Location</h3>
          <h4>Indore</h4>
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="profileInfo_box">
          <h3>Legal Entity</h3>
          <h4>Creativefuel Private Limited</h4>
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="profileInfo_box">
          <h3>Reports to</h3>
          <h4>{userData.Report_L1N ? userData.Report_L1N : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="profileInfo_box">
          <h3>Manager of Manager (L2 Manager)</h3>
          <h4>{userData.Report_L2N ? userData.Report_L2N : "NA"}</h4>
        </div>
      </div>
      </div>

    </>
  );
};

export default JobSection;
