import React from "react";
import { calculateDaysElapsed } from "../helpers/DaysElapsed";
import {baseUrl} from '../../../../utils/config'

const NewJoineeTab = ({ newJoinee }) => {
  return (
    <>
      {newJoinee?.map((item) => (
        <li key={item.user_id}>
          <img
            src={`${baseUrl}`+`${item.image}`}
            alt="user Image"
          />
          {item.user_name}
          {calculateDaysElapsed(item.joining_date)} days
        </li>
      ))}
    </>
  );
};

export default NewJoineeTab;
