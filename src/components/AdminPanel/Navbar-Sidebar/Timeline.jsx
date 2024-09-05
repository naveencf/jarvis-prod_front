import axios from "axios";
import FormContainer from "../FormContainer";
import "./Timeline.css";
import { baseUrl } from "../../../utils/config";
import { useEffect, useState } from "react";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import DateISOtoNormal from "../../../utils/DateISOtoNormal";

const Timeline = () => {
  const { userID } = useAPIGlobalContext();
  const [timeLineData, setTimeLineData] = useState("");

  const getData = async () => {
    try {
      const res = await axios.get(baseUrl + `get_user_time_line/${userID}`);
      setTimeLineData(res.data);
      console.log(res.data, "data cheque");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <FormContainer submitButton={false} mainTitle="Timeline" link="/admin" />
      <div className="timeline">
        <div className="timeline__event  animated fadeInUp delay-3s timeline__event--type1">
          <div className="timeline__event__icon ">
            {/* <i class="bi bi-cake2-fill"></i> */}
            <i class="fa-solid fa-cake-candles"></i>
            <div className="timeline__event__date">Birthday</div>
          </div>
          <div className="timeline__event__content ">
            <div className="timeline__event__title">
              {timeLineData ? DateISOtoNormal(timeLineData?.DOB) : ""}
            </div>
            <div className="timeline__event__description">
              <p></p>
            </div>
          </div>
        </div>
        <div className="timeline__event animated fadeInUp delay-2s timeline__event--type2">
          <div className="timeline__event__icon">
            <i class="fa-regular fa-calendar-days"></i>
            <div className="timeline__event__date">Joining Date</div>
          </div>
          <div className="timeline__event__content">
            <div className="timeline__event__title">
              {timeLineData ? DateISOtoNormal(timeLineData?.joiningDate) : ""}
            </div>
            <div className="timeline__event__description">
              <p></p>
            </div>
          </div>
        </div>
        <div className="timeline__event animated fadeInUp delay-1s timeline__event--type3">
          <div className="timeline__event__icon">
            <i class="fa-solid fa-square-check"></i>
            <div className="timeline__event__date">Probation Completed</div>
          </div>
          <div className="timeline__event__content">
            <div className="timeline__event__title">
              {timeLineData
                ? DateISOtoNormal(timeLineData?.probationEndDate)
                : ""}
            </div>
            <div className="timeline__event__description">
              <p>{timeLineData?.probationMonthValue}</p>
            </div>
          </div>
        </div>
        <div className="timeline__event animated fadeInUp timeline__event--type1">
          <div className="timeline__event__icon">
            <i class="fa-solid fa-person-circle-check"></i>
            <div className="timeline__event__date">Work Anniversary</div>
          </div>
          <div className="timeline__event__content">
            <div className="timeline__event__title">
              {timeLineData.workAnniversaryYears
                ? DateISOtoNormal(timeLineData.workAnniversaryYears?.Date)
                : ""}
            </div>
            <div className="timeline__event__description">
              <p>
                {timeLineData.workAnniversaryYears
                  ? timeLineData.workAnniversaryYears?.Work_Anniversary_Years
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Timeline;
