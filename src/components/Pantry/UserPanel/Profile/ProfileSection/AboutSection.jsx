import React from 'react';
import DateFormattingComponent from '../../../../DateFormator/DateFormared';

const AboutSection = ({ educationData ,familyData }) => {
  return (
    <>
    <h4>Education Details</h4>
      
        {educationData.map((user, index) => (
          <div className="profileInfo_area" key={index}>
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
                  <h4>{user.title}</h4>
                </div>
              </div>
            </div>
          </div>

          
        ))}
     <h4>Relations</h4>
      {familyData?.map((user) => (
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

export default AboutSection;
