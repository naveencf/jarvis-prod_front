import React, { useRef, useState } from "react";
import DateFormattingComponent from "../../../DateFormator/DateFormared";
const UserSingleTab1 = ({ user, roomId }) => {
  const [people, setPeople] = useState([]);
  const dragPerson = useRef(0);
  const draggedOverPerson = useRef(0);

  function handleSort() {
    const peopleClone = [...people];
    const temp = peopleClone[dragPerson.current];
    peopleClone[dragPerson.current] = peopleClone[draggedOverPerson.current];
    peopleClone[draggedOverPerson.current] = temp;
    setPeople(peopleClone);
  }
  return (
    <div className="profileInfo_area row">
      <h3>Personal Details</h3>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Name</h3>
          <h4>{user.user_name}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Gender</h3>
          <h4>{user.Gender}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Father Name</h3>
          <h4>{user.fatherName ? user.fatherName : "NA"}</h4>
        </div>
      </div>

      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Email Id</h3>
          <h4>{user.user_email_id}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Personal Email</h3>
          <h4>{user.PersonalEmail ? user.PersonalEmail : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Mother Name</h3>
          <h4>{user.motherName ? user.motherName : "NA"}</h4>
        </div>
      </div>

      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Personal Number</h3>
          <h4>{user.PersonalNumber}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>User Contact No</h3>
          <h4>{user.user_contact_no}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        {" "}
        <div className="profileInfo_box">
          <h3>Alternate Contact </h3>
          <h4>{user.alternate_contact ? user.alternate_contact : "NA"}</h4>
        </div>
      </div>
      <div
        className={`${user.job_type === "WFH"
          ? "col-xl-4 col-lg-4 col-md-6 col-sm-12"
          : "col-xl-4 col-lg-4 col-md-6 col-sm-12"
          }`}
      >
        <div className="profileInfo_box">
          <h3>Spoken Languages</h3>
          <h4>{user.SpokenLanguages ? user.SpokenLanguages : "NA"}</h4>
        </div>
      </div>
      {user.job_type === "WFH" && (
        <div className="row profileInfo_row">
          {user.job_type === "WFH" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>TDS Applicable</h3>
                <h4>{user.tbs_applicable}</h4>
              </div>
            </div>
          )}
          {user.job_type === "WFH" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>TDS</h3>
                <h4>{user.tds_per}</h4>
              </div>
            </div>
          )}
          {user.job_type === "WFH" && (
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
              <div className="profileInfo_box">
                <h3>Salary</h3>
                <h4>{user.salary}</h4>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Nationality</h3>
          <h4>{user.Role_name ? user.Nationality : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Date Of Birth</h3>
          <h4>
            {" "}
            <DateFormattingComponent date={user.DOB} />
          </h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Age</h3>
          <h4>{user.Age ? user.Age : "NA"}</h4>
        </div>
      </div>

      {/* <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="profileInfo_box">
              <h3>Seat Number</h3>
              <h4>
                {roomId?.Sitting_ref_no ? roomId?.Sitting_ref_no : "NA"}{" "}
                {roomId?.Sitting_ref_no ? "|" : ""}{" "}
                {roomId?.Sitting_area ? roomId?.Sitting_area : "NA"}
              </h4>
            </div>
          </div> */}
      {user.MartialStatus === "Married" && (
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div className="profileInfo_box">
            <h3>Status</h3>
            <h4>{user.user_status ? user.user_status : "NA"}</h4>
          </div>
        </div>
      )}
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Martial Status</h3>
          <h4>{user.MartialStatus ? user.MartialStatus : "NA"}</h4>
        </div>
      </div>

      {user.MartialStatus === "Married" && (
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div className="profileInfo_box">
            <h3>Date Of Marriage</h3>
            <h4>
              {" "}
              <DateFormattingComponent date={user.DateOfMarriage} />
            </h4>
          </div>
        </div>
      )}
      {user.MartialStatus === "Married" && (
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
          <div className="profileInfo_box">
            <h3>Spouse Name</h3>
            <h4>{user.spouse_name}</h4>
          </div>
        </div>
      )}

      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        {" "}
        <div className="profileInfo_box">
          <h3>Emergency Contact 1</h3>
          <h4>{user.emergency_contact1 ? user.emergency_contact1 : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        {" "}
        <div className="profileInfo_box">
          <h3>Emergency Contact 2</h3>
          <h4>{user.emergency_contact2 ? user.emergency_contact2 : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Caste</h3>
          <h4>{user.cast_type ? user.cast_type : "NA"}</h4>
        </div>
      </div>
      <hr />

      <h3>Address</h3>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Permanent Address</h3>
          <h4>{user.permanent_address ? user.permanent_address : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Permanent State</h3>
          <h4>{user.permanent_state ? user.permanent_state : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Permanent City</h3>
          <h4>{user.permanent_city ? user.permanent_city : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="profileInfo_box">
          <h3>Permanent Pincode</h3>
          <h4>{user.permanent_pin_code ? user.permanent_pin_code : "NA"}</h4>
        </div>
      </div>

      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Current Address</h3>
          <h4>{user.current_address ? user.current_address : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Current State</h3>
          <h4>{user.current_state ? user.current_state : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Current City</h3>
          <h4>{user.current_city ? user.current_city : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Current Pincode</h3>
          <h4>{user.current_pin_code ? user.current_pin_code : "NA"}</h4>
        </div>
      </div>
      <hr />

      <h3>Identity Details</h3>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Name As Per Aadhar</h3>
          <h4>{user.aadharName ? user.aadharName : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Aadhar Number</h3>
          <h4>{user.uid_no ? user.uid_no : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Name As Per PAN</h3>
          <h4>{user.panName ? user.panName : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>PAN Number</h3>
          <h4>{user.pan_no ? user.pan_no : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Name As Per Voter ID</h3>
          <h4>{user.voterName ? user.voterName : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Voter ID Number</h3>
          <h4>{user.voterIdNumber ? user.voterIdNumber : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Passport Number</h3>
          <h4>{user.passportNumber ? user.passportNumber : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Passport Valid UpTo</h3>
          <h4>{user.passportValidUpto ? user.passportValidUpto : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Driving Licence Number</h3>
          <h4>
            {user.drivingLicenseNumber ? user.drivingLicenseNumber : "NA"}
          </h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Driving Licence Valid UpTo</h3>
          <h4>
            {user.drivingLicenseValidUpto ? user.drivingLicenseValidUpto : "NA"}
          </h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Vehicle Name</h3>
          <h4>{user.vehicleName ? user.vehicleName : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Vehicle Number</h3>
          <h4>{user.vehicleNumber ? user.vehicleNumber : "NA"}</h4>
        </div>
      </div>
      <hr />
      <h3>Other Details</h3>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Facebook Link</h3>
          <h4>{user.facebookLink ? user.facebookLink : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>instagram Link</h3>
          <h4>{user.instagramLink ? user.instagramLink : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>linkedIn Link</h3>
          <h4>{user.linkedInLink ? user.linkedInLink : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Height</h3>
          <h4>{user.height ? user.height : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Weight</h3>
          <h4>{user.weight ? user.weight : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>BMI (Body Mass)</h3>
          <h4>{user.bmi ? user.bmi : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>How do you Plan on traveling to office</h3>
          <h4>{user.travelMode ? user.travelMode : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Creativefuel's official sports Teams</h3>
          <h4>{user.sportsTeam ? user.sportsTeam : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Do you smoke</h3>
          <h4>{user.smoking ? user.smoking : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>How many do you consume in a day</h3>
          <h4>{user.daysSmoking ? user.daysSmoking : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Do you consume Alcohol</h3>
          <h4>{user.alcohol ? user.alcohol : "NA"}</h4>
        </div>
      </div>
      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
        <div className="profileInfo_box">
          <h3>Any medical history</h3>
          <h4>{user.medicalHistory ? user.medicalHistory : "NA"}</h4>
        </div>
      </div>
    </div>
  );
};

export default UserSingleTab1;

// import React, { useState, useRef, useEffect } from "react";
// import DateFormattingComponent from "../../DateFormator/DateFormared";

// const UserSingleTab1 = ({ user, roomId }) => {
//   // Expanded user data into a manageable array for drag-and-drop functionality
//   const getInitialFields = (user) => [
//     { id: user.user_id, label: "Name", value: user.user_name },
//     { id: user.user_id, label: "Gender", value: user.Gender },
//     // { id: user.user_id, label: "Father Name", value: user.fatherName || "NA" },
//     { id: user.user_id, label: "Email Id", value: user.user_email_id },
//     {
//       id: user.user_id,
//       label: "Personal Email",
//       value: user.PersonalEmail || "NA",
//     },
//     // { id: user.user_id, label: "Mother Name", value: user.motherName || "NA" },
//     { id: user.user_id, label: "Personal Number", value: user.PersonalNumber },
//     { id: user.user_id, label: "User Contact No", value: user.user_contact_no },
//     {
//       id: user.user_id,
//       label: "Spoken Languages",
//       value: user.SpokenLanguages || "NA",
//     },
//     { id: user.user_id, label: "Designation", value: user.designation_name },
//     { id: user.user_id, label: "Department", value: user.department_name },
//     {
//       id: user.user_id,
//       label: "Sub Department",
//       value: user.sub_dept_name || "NA",
//     },
//     { id: user.user_id, label: "Nationality", value: user.Nationality || "NA" },
//     {
//       id: user.user_id,
//       label: "Date Of Birth",
//       value: <DateFormattingComponent date={user.DOB} />,
//     },
//     // { id: user.user_id, label: "Age", value: user.Age || "NA" },
//     {
//       id: user.user_id,
//       label: "Permanent Address",
//       value: `${user?.permanent_address && user?.permanent_address + ","}
//         ${user?.permanent_city && user?.permanent_city + ","}
//         ${user?.permanent_state && user?.permanent_state + ","}
//         ${user?.permanent_pin_code ? user?.permanent_pin_code + "." : "NA"}`,
//     },
//     {
//       id: user.user_id,
//       label: "Current Address",
//       value: `${user?.current_address && user?.current_address + ","}
//       ${user?.current_city && user?.current_city + ","}
//       ${user?.current_state && user?.current_state + ","}
//       ${user?.current_pin_code ? user?.current_pin_code + "." : "NA"}`,
//     },
//   ];
//   useEffect(() => {
//     setFields(getInitialFields(user));
//   }, [user]);

//   const [fields, setFields] = useState(getInitialFields(user));
//   const dragItem = useRef();
//   const dragOverItem = useRef();

//   const handleDragStart = (index) => {
//     dragItem.current = index;
//   };

//   const handleDragEnter = (index) => {
//     dragOverItem.current = index;
//   };

//   const handleDragEnd = () => {
//     const newList = [...fields];
//     const draggedItemContent = newList[dragItem.current];
//     newList.splice(dragItem.current, 1); // Remove the item from its original position and modify array
//     newList.splice(dragOverItem.current, 0, draggedItemContent); // Insert the item at the new position

//     setFields(newList);
//     dragItem.current = null; // Reset dragItem
//     dragOverItem.current = null; // Reset dragOverItem
//   };

//   return (
//     <div className="profileInfo_area">
//       <div className="row profileInfo_row pt-0">
//         {fields.map((field, index) => (
//           // console.log(field, "-----------ff"),
//           <div
//             key={field.id}
//             className="col-xl-4 col-lg-4 col-md-6 col-sm-12"
//             draggable
//             onDragStart={() => handleDragStart(index)}
//             onDragEnter={() => handleDragEnter(index)}
//             onDragOver={(e) => e.preventDefault()}
//             onDragEnd={handleDragEnd}
//           >
//             <div className="profileInfo_box">
//               <h3>{field.label}</h3>
//               <h4>
//                 {typeof field.value === "function"
//                   ? field.value()
//                   : field.value}
//               </h4>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserSingleTab1;
