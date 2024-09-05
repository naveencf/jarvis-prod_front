import React from "react";

const AnniversaryBirthdayCard = ({ anniversaryBirthdays }) => {
  return (
    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
      <div className="salary_dtlCard">
        <div className="salary_dtlCard_head d-flex justify-content-between">
          <h2>Birthdays</h2>
          <h2>Anniversary</h2>
        </div>
        <div className="salary_dtlCard_info">
          <ul>
            {anniversaryBirthdays?.map((item) => (
              <li>
                {item.user_name}
                {item.joining_date.split("T")[0].split("-").reverse().join("-")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnniversaryBirthdayCard;
