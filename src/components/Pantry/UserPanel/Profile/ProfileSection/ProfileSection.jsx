import React from "react";
import DateFormattingComponent from "../../../../DateFormator/DateFormared";
import AboutSection from "./AboutSection";

const ProfileSection = ({ userData , educationData , familyData }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-6" >
          <h4>Primary Details</h4>
          <div className="profileInfo_area">
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Name</h3>
                  <h4>{userData.user_name ? userData.user_name : "NA"}</h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Date of Birth</h3>
                  <h4>
                    <DateFormattingComponent
                      date={userData.DOB?.split("T")[0]}
                    />
                  </h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Marital Status</h3>
                  <h4>
                    {userData.MartialStatus ? userData.MartialStatus : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Nick Name</h3>
                  <h4>{userData.nick_name ? userData.nick_name : "NA"}</h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Nationality</h3>
                  <h4>{userData.Nationality ? userData.Nationality : "NA"}</h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Blood Group</h3>
                  <h4>{userData.BloodGroup ? userData.BloodGroup : "NA"}</h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Gender</h3>
                  <h4>{userData.Gender ? userData.Gender : "NA"}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6" >
          <h4>Contact Details</h4>
          <div className="profileInfo_area">
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Work Email</h3>
                  <h4>
                    {userData.user_email_id ? userData.user_email_id : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Personal Email</h3>
                  <h4>
                    {userData.PersonalEmail ? userData.PersonalEmail : "NA"}
                  </h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Mobile Number</h3>
                  <h4>
                    {userData.PersonalNumber ? userData.PersonalNumber : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Work Number</h3>
                  <h4>
                    {userData.user_contact_no ? userData.user_contact_no : "NA"}
                  </h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Alternate Number</h3>
                  <h4>
                    {userData.alternate_contact
                      ? userData.alternate_contact
                      : "NA"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6" style={{ border: "1px solid " }}>
          <h4>Addresses</h4>
          <div className="profileInfo_area">
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Current Address</h3>
                  <h4>
                    {userData.current_address ? userData.current_address : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Current City</h3>
                  <h4>
                    {userData.current_city ? userData.current_city : "NA"}
                  </h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Current State</h3>
                  <h4>
                    {userData.current_state ? userData.current_state : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Current Pin Code</h3>
                  <h4>
                    {userData.current_pin_code
                      ? userData.current_pin_code
                      : "NA"}
                  </h4>
                </div>
              </div>
            </div>
            <hr />
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Permanent Address</h3>
                  <h4>
                    {userData.permanent_address
                      ? userData.permanent_address
                      : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Permanent City</h3>
                  <h4>
                    {userData.permanent_city ? userData.permanent_city : "NA"}
                  </h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Permanent State</h3>
                  <h4>
                    {userData.permanent_state ? userData.permanent_state : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Permanent Pin Code</h3>
                  <h4>
                    {userData.permanent_pin_code
                      ? userData.permanent_pin_code
                      : "NA"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
      <AboutSection educationData={educationData} familyData={familyData}/>
      </div>
        
      
      <div className="row">
        <div className="col-6" >
          <h4>Identity Information</h4>
          <div className="profileInfo_area">
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Aadhar Name</h3>
                  <h4>{userData.aadharName ? userData.aadharName : "NA"}</h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Aadhar Number</h3>
                  <h4>
                  {userData.UID ? userData.UID : "NA"}
                  </h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Pan Name</h3>
                  <h4>
                    {userData.panName ? userData.panName : "NA"}
                  </h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Pan Number</h3>
                  <h4>{userData.pan_no ? userData.pan_no : "NA"}</h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Voter Name</h3>
                  <h4>{userData.voterName ? userData.voterName : "NA"}</h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Voter Number</h3>
                  <h4>{userData.BloodGroup ? userData.BloodGroup : "NA"}</h4>
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>passportNumber</h3>
                  <h4>{userData.passportNumber ? userData.passportNumber : "NA"}</h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>passportValidUpto</h3>
                  <DateFormattingComponent
                    date={userData.passportValidUpto?.split("T")[0]}
                  />
                </div>
              </div>
            </div>
            <div className="row profileInfo_row pt-0">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Vehicle Name</h3>
                  <h4>{userData.vehicleNumber ? userData.vehicleNumber : "NA"}</h4>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                <div className="profileInfo_box">
                  <h3>Vehicle Number</h3>
                  <h4>{userData.vehicleNumber ? userData.vehicleNumber : "NA"}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
};

export default ProfileSection;
