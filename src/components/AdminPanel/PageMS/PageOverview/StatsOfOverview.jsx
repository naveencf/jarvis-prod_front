import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import formatString from "../../Operation/CampaignMaster/WordCapital";
import StatsOfOverviewModal from "./StatsOfOverviewModal";
import { useGetAllPageListQuery } from "../../../Store/PageBaseURL";
import jwtDecode from "jwt-decode";

const StatsOfOverview = ({dataGridcolumns}) => {
  const [followerCount, setFollowerCount] = useState([]);
  const [preferenceLevel, setPreferenceLevel] = useState([]);
  const [status, setStatus] = useState([]);
  const [closeBy, setCloseBy] = useState([]);

  const [activeSection, setActiveSection] = useState(null); 
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  const [pagequery, setPagequery] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: pageList, refetch: refetchPageList, isLoading: isPageListLoading } = useGetAllPageListQuery({ decodedToken, userID, pagequery });

  const handleClick = (key, val) => {

    setPagequery(`${key}=${val}`);
    setActiveSection(key); 
    setLoading(true);
  };

// const followerCountRanges = {
//     "less than 1 lac": [100000],
//     "1-10 lacs": [100000, 1000000],
//     "10-20 lacs": [1000000, 2000000],
//     "20-30 lacs": [2000000, 3000000],
//     "more than 30 lac": [3000000]
//   };
  
//   const handleClick = (key, range) => {
//     const values = followerCountRanges[range];
  
//     let query;
//     if (values.length === 1) {
//       setPagequery(`${key}=${range}`); 
//           setActiveSection(key); 
//     setLoading(true);
//       console.log(query , 'one console')
//     } else if (values.length === 2) {
//       query = `${key}=${values[0]}& ${key}=${values[1]}`; 
//       console.log(query , 'quererwer')
//     }
  
//     setPagequery(query);  
//     setActiveSection(key); 
//     setLoading(true);
//   };
  
  

 useEffect(()=>{
if(pageList?.length > 0){
setLoading(false)
}
 },[pageList])

  const getStaticsWisePageOverviewData = async () => {
    try {
      const res = await axios.get(`${baseUrl}v1/get_all_counts`);
      const followercount = Object.entries(res?.data?.data?.followercount).map(([range, count]) => ({
        range,
        count,
      }));
      const preferenceLevel = Object.entries(res?.data?.data?.preference_level).map(([lavel, value]) => ({
        lavel,
        value,
      }));
      const status = Object.entries(res?.data?.data?.status).map(([lavel, value]) => ({
        lavel,
        value,
      }));
      const closedBy = res?.data?.data?.pageClosedBYCounts.map((item) => item.count);

      setFollowerCount(followercount);
      setPreferenceLevel(preferenceLevel);
      setStatus(status);
      setCloseBy(res?.data?.data?.pageClosedBYCounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getStaticsWisePageOverviewData();
  }, []);

  return (
    <div className="vendor-container">
      {/* Preference Level Section */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Profile with Levels</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {preferenceLevel?.map((item, index) => (
              <div
                key={index}
                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
              >
                <div className="card pointer" onClick={() => handleClick("preference_level", item.lavel)}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <Brightness6Icon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">{formatString(item.lavel)}</h6>
                      <h6 className="mt4 fs_16">{item.value}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeSection === "preference_level" && !loading && (
  <StatsOfOverviewModal pageList={pageList} dataGridcolumns={dataGridcolumns} />
)}

      {/* Followers Count Section */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Profile with Followers Count</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {followerCount?.map((item, index) => (
              <div
                key={index}
                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
              >
                <div className="card pointer" onClick={() => handleClick( item.range)}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <FormatListNumberedIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">{item.range}</h6>
                      <h6 className="mt4 fs_16">{item.count}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Status Section */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Profile with Status</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {status?.map((item, index) => (
              <div
                key={index}
                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
              >
                <div className="card pointer" onClick={() => handleClick("page_activeness", item.lavel)}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <ToggleOffIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">{formatString(item.lavel)}</h6>
                      <h6 className="mt4 fs_16">{item.value}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeSection === "page_activeness" && !loading &&<StatsOfOverviewModal pageList={pageList} dataGridcolumns={dataGridcolumns}/>}

      {/* Closed By Section */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Profile closed by</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {closeBy.map((item, i) => (
              <div
                key={i}
                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12"
              >
                <div className="card pointer" onClick={() => handleClick("page_closed_by", item.page_closed_by)}>
                  <div className="card-body pb20 flexCenter colGap14">
                    <div className="iconBadge small bgPrimaryLight m-0">
                      <span>
                        <AccountCircleIcon />
                      </span>
                    </div>
                    <div>
                      <h6 className="colorMedium">{item.count}</h6>
                      <h6 className="mt4 fs_16">{item.page_closed_by}</h6>
                      <h6 className="mt4 fs_16">{item.user_name}</h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeSection === "page_closed_by" && !loading && <StatsOfOverviewModal pageList={pageList} dataGridcolumns={dataGridcolumns}/>}
    </div>
  );
};

export default StatsOfOverview;
