import React from "react";
import DateFormattingComponent from "../../DateFormator/DateFormared";
const UserSingleTab5 = ({ familyData, user }) => {
  return (
    <>
      {familyData.map((user) => (
        <div className="profileInfo_area">
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Name</h3>
                <h4>{user.name}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Date of Birth</h3>
                <h4>
                  <DateFormattingComponent date={user.DOB} />
                </h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Contact Number</h3>
                <h4>{user.contact}</h4>
              </div>
            </div>
          </div>
          <div className="row profileInfo_row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Occupation</h3>
                <h4>{user.occupation}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Annual Income</h3>
                <h4>{user.annual_income}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Relation *</h3>
                <h4>{user.relation}</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserSingleTab5;
