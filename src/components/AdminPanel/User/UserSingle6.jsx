import React from "react";
import DateFormattingComponent from "../../DateFormator/DateFormared";
const UserSingleTab6 = ({ educationData }) => {
  return (
    <>
      {educationData.map((user) => (
        <div className="profileInfo_area">
          <div className="row profileInfo_row pt-0">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Institute Name</h3>
                <h4>{user.institute_name}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>From Year</h3>
                <h4>
                  <DateFormattingComponent date={user.from_year} />
                </h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>To Year</h3>
                <h4>
                  {" "}
                  <DateFormattingComponent date={user.to_year} />
                </h4>
              </div>
            </div>
          </div>
          <div className="row profileInfo_row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Percentage</h3>
                <h4>{user.percentage} %</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Stream</h3>
                <h4>{user.stream}</h4>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Specialization</h3>
                <h4>{user.specialization}</h4>
              </div>
            </div>
          </div>

          <div className="row profileInfo_row">
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="profileInfo_box">
                <h3>Title</h3>
                <h4>{user.title} </h4>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserSingleTab6;
