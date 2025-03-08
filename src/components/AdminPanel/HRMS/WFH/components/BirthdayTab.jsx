import React from "react";
import {baseUrl} from '../../../../utils/config'

const BirthdayTab = ({ birthdays }) => {
  return (
    <>
      {birthdays?.map((item) => (
        <li key={item.user_id}>
          <img
            src={`${baseUrl}`+`${item.image}`}
            alt="user Image"
          />
          {item.user_name}
          {item.joining_date?.split("T")[0].split("-").reverse().join("-")}
        </li>
      ))}
    </>
  );
};

export default BirthdayTab;
