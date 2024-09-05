import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import { Link } from "react-router-dom";
import {
  UsersThree,
  MaskHappy,
  FolderUser,
  HouseLine,
} from "@phosphor-icons/react";

const UserCountInCards = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentCount, setDepartmentCount] = useState([]);

  const getWFHDWithCount = async () => {
    const res = await axios.get(baseUrl + "get_wfh_users_with_dept");
    setDepartmentData(res.data.data);
  };
  useEffect(() => {
    getWFHDWithCount();
  }, []);
  useEffect(() => {
    const sumMonth = departmentData?.reduce(
      (acc, obj) => acc + parseFloat(obj.user_count),
      0
    );
    setDepartmentCount(sumMonth);
  }, [departmentData]);

  const icons = [ <MaskHappy weight="duotone" />, <FolderUser weight="duotone" />, <HouseLine weight="duotone" />];
const classes = ['bgSecondaryLight', 'bgTertiaryLight', 'bgSuccessLight'];
  return (
    <>
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-6 col-sm-12">
          <div class="card text-center">
              <Link to="/admin/wfhd-overview">
            <div class="card-body pb20">
                <div className="iconBadge bgPrimaryLight">
                  <span>
                    <UsersThree weight="duotone" />
                  </span>
                </div>
              <h6 className="colorMedium">All Users</h6>
              <h3 className="mt8">{departmentCount}</h3>
            </div>
              </Link>
          </div>
        </div>
        {departmentData.map((d, index) => (
        <div key={d.id} className="col-xxl-4 col-xl-3 col-lg-4 col-md-6 col-sm-12">
          <div className="card text-center">
              <Link to={`/admin/wfhd-overview`}>
            <div className="card-body pb20">
                <div className={`iconBadge ${classes[index % classes.length]}`}>
                  <span>
                    {icons[index % icons.length]}
                  </span>
                </div>
              <h6 className="colorMedium">{d.dept_name}</h6>
              <h3 className="mt8">{d.user_count}</h3>
            </div>
              </Link>
          </div>
        </div>
      ))}
      </div>
    </>
  );
};

export default UserCountInCards;
