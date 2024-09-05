import React from 'react'
import LogoImg from "../../../../public/logo.png";
import SelectorBG from "../../../assets/imgs/bg/selector-bg.svg";
// import NewArrivals from "../../InstaApi.jsx/Analytics/Dashboard/NewArrivals";
// import ReactApexChart from 'react-apexcharts';
import { useState } from 'react';
// import InterpretorEodBox from '../../InstaApi.jsx/Interpretor/Alfred/Dashboard/InterpretorEodBox';
// import EodBox from '../../InstaApi.jsx/Selector/Dashboard/EodBox';
import ManagerTarget from './ManagerTarget';
// import PageDateWiseStatus from '../../InstaApi.jsx/Analytics/PageProfile/PageDateWiseStatus';
import { useEffect } from 'react';
import axios from 'axios';
import CommunityManagerPage from './CommunityManagerPage';
import PageGrowthGraph from '../../PageProfile/PageGrowthGraph';

function CommunityManager() {
    const [value, setValue] = useState(0);
    const [creatorDetail, setCreatorDetail] = useState(null);
    const [creatorProgress, setCreatorProgress] = useState([]);

    useEffect(() => {
        // let tempmatchCondition = { postedOn : { $gte: startDate,$lte:endDate }};
        // if(endDate == null){
        //   tempmatchCondition = ""
        // }
    
        axios
          .post(`https://insights.ist:8080/api/getCreatorOverallReport`, {
            creatorName: "rvcjinsta",
            //     "startDate":"2024-06-02",
            // "endDate":"2024-06-04"
          })
          .then((res) => {
            // console.log(res.data.data, "getCreatorOverallReport");
            setCreatorProgress(res.data.data);
          });
      }, []);
     
  return (
    <div className="workWrapper">
    <div className="row">
      <div className="col-12">
        <div className="card selDecCard">
          <div className="selDecCardHead">
            <div className="topPageItem titleCard">
              <div className="titleCardImg">
                <img src={LogoImg} alt="img" />
              </div>
              <div className="titleCardText">
                <h2>
                  Welcome back, <span>Dear</span>
                </h2>
              </div>
            </div>
           
          </div>

           <ManagerTarget value={value} index={1} /> 
      
          <div className="selDecImg">
            <img src={SelectorBG} alt="img" />
          </div>
        </div>
      </div>
    </div>
    {/* <div className="row">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="card">
          <div className="card-body p0">
            <div className="allSelChart thmChart">
              <ReactApexChart
                options={state.options}
                series={state.series}
                type="area"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
   */}
   <PageGrowthGraph creatorProgress={creatorProgress}/>
   
    {/* <NewArrivals/> */}
    <CommunityManagerPage/>
   
  </div>
  )
}

export default CommunityManager