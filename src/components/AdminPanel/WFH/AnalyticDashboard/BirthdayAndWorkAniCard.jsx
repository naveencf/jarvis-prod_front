import React, { useEffect, useState } from "react";
import imageTest1 from "../../../../assets/img/product/Avtrar1.png";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";

const BirthdayAndWorkAniCard = () => {
  const [birthdayData, setBirthdayData] = useState([]);
  const [workAnniversarieData, setWorkAnniversarieData] = useState([]);

  const getBirthData = async () => {
    const res = await axios.get(baseUrl + "get_birth_days");
    setBirthdayData(res.data.data);
  };
  const getAnniData = async () => {
    const res = await axios.get(baseUrl + "get_work_anniversary");
    setWorkAnniversarieData(res.data.data);
  };

  useEffect(() => {
    getBirthData();
    getAnniData();
  }, []);

  const capitalizeName = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      const firstNameInitial = nameParts[0].charAt(0).toUpperCase();
      const lastNameInitial = nameParts[1].charAt(0).toUpperCase();
      return firstNameInitial + lastNameInitial;
    }
    return name.charAt(0).toUpperCase(); // In case there's only one part of the name
  };

  return (
    <>
      <div className="row">
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 class="card-title">Birthdays</h5>
            </div>
            <div className="card-body">
              <div className="eventListArea">
                {birthdayData.map((d) => (
                  <div className="eventListBox w-100 avatarBox">
                    <div className="avatarImgBox">
                      {/* <img src={imageTest1} alt="img" /> */}
                      <h2>{capitalizeName(d.user_name)}</h2>
                    </div>
                    <div className="avatarTextBox w-100">
                      <h4 className="w-100 flexCenterBetween">
                        {d.user_name} <span>{d.DOB}</span>
                      </h4>
                      <h5 className="w-100 flexCenterBetween">
                        {d.dept_name} - Indore{" "}
                        <span className="fw_500 colorDark">Age - {d.age}</span>
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5 class="card-title">Work anniversaries</h5>
            </div>
            <div className="card-body">
              <div className="eventListArea">
                {workAnniversarieData.map((d) => (
                  <div className="eventListBox w-100 avatarBox">
                    <div className="avatarImgBox">
                      <h2>{capitalizeName(d.user_name)}</h2>
                    </div>
                    <div className="avatarTextBox w-100">
                      <h4 className="w-100 flexCenterBetween">
                        {d.user_name} <span>{d.joining_date}</span>
                      </h4>
                      <h5 className="w-100 flexCenterBetween">
                        {d.dept_name} - Indore
                        <span className="fw_500 colorDark">
                          Exp. {d.total_years}
                        </span>
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BirthdayAndWorkAniCard;
