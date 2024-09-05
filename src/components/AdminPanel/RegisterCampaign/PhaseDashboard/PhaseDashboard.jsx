import "./phasedashboard.scss";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CampaignDetailes from "../CampaignDetailes";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../../AdminPanel/FormContainer";
const PhaseDashboard = () => {
  const [allPhaseData, setAllPhaseData] = useState([]);
  const [singlePhaseData, setSinglePhaseData] = useState([]);
  const [phaseDashbordData, setPhaseDashbordData] = useState("");
  var planId;
  const phaseData = async () => {
    const phase = await axios.get(
      `${baseUrl}`+`campaignphase/singlephase/${44}`
    );
    const setsinglephasedata = phase.data.data.pages[0]?.campaignId;
    console.log(phase.data.data.pages[0]?._id, "singledasta");
    planId = phase.data.data.pages[0]?._id;

    setSinglePhaseData(setsinglephasedata);

    const getallphase = await axios.get(
      `${baseUrl}`+`campaignphase/${setsinglephasedata}`
    );

    const response = await getallphase.data.result.filter(
      (phase) => phase?.phase_id !== 44
    );

    setAllPhaseData(response);
  };

  const phaseDash = async () => {
    const phaseDashboardData = await axios.post(
      `${baseUrl}`+`operation_phase_dashboard`,
      {
        phase_id: "44",
      }
    );
    setPhaseDashbordData(phaseDashboardData.data.data);
  };

  useEffect(() => {
    phaseDash();
    phaseData();
  }, []);

  const formattedPercentage =
    phaseDashbordData?.phase_occupancy &&
    (phaseDashbordData?.phase_occupancy).toFixed(0);

  const categorywise = phaseDashbordData?.category_wise_page_count?.map((d) => (
    <>
      {/* <h3>{d._id}</h3> */}
      <h4>{d.count}</h4>
    </>
  ));
  const platformwise = phaseDashbordData?.plateform_wise_page_count?.map(
    (da) => da.count
  );

  return (
    <>
    <FormContainer
    mainTitle={"Phase Dashboard"}
    link={true}
    handleSubmit={false}
    />
      
        <div className="card">
          <div className="card-header">
            Campaign Detail
          </div>
          <div className="card-body">

        <CampaignDetailes cid={singlePhaseData} />
          </div>
        </div>
      
      {/* <div className="section">
        <h3>Phase Dashboard</h3>

        <div className="data-card">
          <div className="data-card__val">17,933</div>
          <div className="data-card__label">All Saleable</div>
          <div className="data-card__color is-green"></div>
        </div>
      </div> */}
      <div className="card body-padding">

      <div className="section">
        {/* <h3>Hoverable</h3> */}

        <Link to={`/admin/planCreation/${singlePhaseData}`}>
          <div className="data-card is-hoverable">
            <div className="data-card__val">
              {phaseDashbordData.total_no_of_post_in_plan}
            </div>
            <div className="data-card__label">Total No.of Post in Campgain</div>
            <div className="data-card__color is-green"></div>
          </div>
        </Link>
        <Link to={`/admin/phase/${singlePhaseData}`}>
          <div className="data-card is-hoverable">
            <div className="data-card__val">
              {phaseDashbordData.total_no_of_page}
            </div>
            <div className="data-card__label">Total No of Pages</div>
            <div className="data-card__color is-green"></div>
          </div>
        </Link>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {phaseDashbordData.total_no_of_post}
          </div>
          <div className="data-card__label">Total No of Post</div>
          <div className="data-card__color is-green"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {phaseDashbordData.executed_execution_total} , [
            {phaseDashbordData.execution_done_percentage}%]
          </div>
          {/* <div className="">20%</div> */}
          <div className="data-card__label">Execution Total & Percentage</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {phaseDashbordData.verified_execution_total} , [
            {phaseDashbordData.verified_percentage}%]
          </div>
          <div className="data-card__label">verified Post & %</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <Link to="/admin/experties-overview">
            <div className="data-card__val">
              {phaseDashbordData.total_executers}
            </div>
            <div className="data-card__label">Total Executer Count</div>
            <div className="data-card__color is-red"></div>
          </Link>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val percentage">
            {formattedPercentage}%
          </div>
          <div className="data-card__label">Phase Occupancy</div>
          <div className="data-card__color is-green"></div>
        </div>

        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {phaseDashbordData.total_no_of_replacement}
          </div>
          <div className="data-card__label">Total No of Replancement</div>
          <div className="data-card__color is-red"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{categorywise}</div>
          <div className="data-card__label">Category Wise Post Count & %</div>
          <div className="data-card__color is-red"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">NAN</div>
          <div className="data-card__label">
            Page Health Wise Post Count & %
          </div>
          <div className="data-card__color is-red"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val percentage">{platformwise}</div>
          <div className="data-card__label">Platform Wise Post Count & %</div>
          <div className="data-card__color is-green"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {phaseDashbordData.verified_execution_total}
          </div>
          <div className="data-card__label">Page Level Wise Post Count & %</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {phaseDashbordData.total_no_of_assign_pages}
          </div>
          <div className="data-card__label">Total No of Assigned Page</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {phaseDashbordData.remaining_for_assignment}
          </div>
          <div className="data-card__label">Balance Remaining Page</div>
          <div className="data-card__color is-orange"></div>
        </div>
      </div>
        </div>
      <div className="phase-list">
        <h4>Phase Links </h4>
        {allPhaseData.map((d) => (
          <Link>
            <p className="phase-list-inside">
              {d.phaseName}
              {""}{" "}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default PhaseDashboard;
