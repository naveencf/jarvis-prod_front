import React, { useEffect, useState } from "react";
import axios from "axios";
import FieldContainer from "../FieldContainer";
import {baseUrl} from '../../../utils/config'

const UserHierarchy = () => {
  const [data, setData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_users")
      .then((res) => {
        setData(res.data.data);
        setAllUserData(res.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentData(res.data);
      });
  }, []);

  useEffect(() => {
    if (selectedDepartment === "") {
      setData(allUserData);
    } else {
      axios
        .post(baseUrl+"l1l2l3usersbydept", {
          dept_id: selectedDepartment,
        })
        .then((res) => {
          setData(res.data.data);
        });
    }
  }, [selectedDepartment]);

  const renderUserTree = (user) => {
    const childUsers = data.filter((u) => u.Report_L1 === user.user_id);
    return (
      <li key={user.user_id}>
        <span className="tf-nc userpill">
          <div className="userpill_box">
            <div className="userpill_img">
              <img src={user.user_image} alt="img" />
            </div>
            <div className="userpill_info">
              <h2>{user.user_name}</h2>
              <h3>{user.user_desi}</h3>
            </div>
          </div>
        </span>
        {childUsers.length > 0 && (
          <ul>
            {childUsers.map((childUser) => (
              <li key={childUser.user_id}>
                <div className="tf-tree example">
                  {renderUserTree(childUser)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  const topLevelUsers = data.filter((user) => !user.Report_L1);

  return (
    <>
      <FieldContainer
        Tag="select"
        label="Department"
        fieldGrid={3}
        value={selectedDepartment}
        required={false}
        onChange={(e) => setSelectedDepartment(e.target.value)}
      >
        <option value=""> All </option>
        {departmentData.map((option) => (
          <option key={option.dept_id} value={option.dept_id}>
            {option.dept_name}
          </option>
        ))}
      </FieldContainer>

      <div className="tf-tree example">
        <ul>
          {topLevelUsers.map((topLevelUser) => (
            <li key={topLevelUser.user_id}>{renderUserTree(topLevelUser)}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserHierarchy;
