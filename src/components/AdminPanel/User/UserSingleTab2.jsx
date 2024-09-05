import React from "react";
import DateFormattingComponent from "../../DateFormator/DateFormared";

const UserSingleTab2 = ({ user, hobbiesData }) => {
  return (
    <>
      <div className="profileInfo_area">
        <div className="row profileInfo_row pt-0">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Employe ID</h3>
              <h4>{user.user_id ? user.user_id : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L1N Name</h3>
              <h4>{user.Report_L1N ? user.Report_L1N : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Report L2N Name</h3>
              <h4>{user.Report_L2N ? user.Report_L2N : "NA"}</h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Job Type</h3>
              <h4>{user.job_type}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>User Status</h3>
              <h4>{user.user_status ? user.user_status : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Joining Date</h3>
              <h4>
                <DateFormattingComponent
                  date={user.joining_date?.split("T")[0]}
                />
              </h4>
            </div>
          </div>
        </div>
        <div className="row profileInfo_row">
          {/* <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Hobbies</h3>
              <h4>
                {hobbiesData && user.Hobbies
                  ? hobbiesData
                      .filter((object) =>
                        user.Hobbies.includes(object.hobby_id)
                      )
                      .map((hobbyName) => hobbyName.hobby_name)
                      .join(" | ")
                  : "NA"}
              </h4>
            </div>
          </div> */}
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Monthly Salary</h3>
              <h4>{user.salary}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>CTC</h3>
              <h4>{user.ctc}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Blood Group</h3>
              <h4>{user.BloodGroup ? user.BloodGroup : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Role Name</h3>
              <h4>{user.Role_name ? user.Role_name : "NA"}</h4>
            </div>
          </div>
        </div>
        <hr />
        <div className="row profileInfo_row">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Bank Name</h3>
              <h4>{user.bank_name ? user.bank_name : "NA"}</h4>
            </div>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>IFSC</h3>
              <h4>{user.ifsc_code ? user.ifsc_code : "NA"}</h4>
            </div>
          </div>
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div className="profileInfo_box">
            <h3>Account Number</h3>
            <h4>{user.account_no ? user.account_no : "NA"}</h4>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div className="profileInfo_box">
            <h3>Beneficiary</h3>
            <h4>{user.beneficiary ? user.beneficiary : "NA"}</h4>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div className="profileInfo_box">
            <h3>Pan Number</h3>
            <h4>{user.pan_no ? user.pan_no : "NA"}</h4>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default UserSingleTab2;
