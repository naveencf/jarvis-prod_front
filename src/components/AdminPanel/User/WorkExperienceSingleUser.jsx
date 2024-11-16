import React from "react";
import DateFormattingComponent from "../../DateFormator/DateFormared";
const WorkExperience = ({ workExperience }) => {
  return (
    <>
      {workExperience.map((user) => (
        <div className="profileInfo_area" style={{border:'1px solid',padding:'15px',borderRadius:"15px",marginTop:'5px'}}>
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <h4>Organization Details</h4>
              <div className="profileInfo_box">
                <h3>Name of organization</h3>
                <h4>{user.name_of_organization}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>From Date</h3>
                <h4>
                  <DateFormattingComponent date={user.period_of_service_from} />
                </h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>To Date</h3>
                <h4>
                  <DateFormattingComponent date={user.period_of_service_to} />
                </h4>
              </div>
            </div>
          </div>
          <div className="row profileInfo_row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Designation</h3>
                <h4>{user.designation}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Gross Salary</h3>
                <h4>{user.gross_salary}</h4>
              </div>
            </div>
          </div>
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <h4>Details of Reporting Manager</h4>
              <div className="profileInfo_box">
                <h3>Manager Name</h3>
                <h4>{user.manager_name}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Manager Number</h3>
                <h4>{user.manager_phone}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Manager Email</h3>
                <h4>{user.manager_email_id}</h4>
              </div>
            </div>
          </div>
          
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
                <h4>Details of HR</h4>
              <div className="profileInfo_box">
                <h3>HR Name</h3>
                <h4>{user.hr_name}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>HR Number</h3>
                <h4>{user.hr_phone}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>HR Email</h3>
                <h4>{user.hr_email_id}</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default WorkExperience;
