import axios from "axios";
import CampaignDetailes from "../CampaignDetailes";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../PhaseDashboard/phasedashboard.scss";
import { baseUrl } from "../../../../utils/config";

const PlanDashboard = () => {
  const [planData, setPlanData] = useState([]);
  console.log(planData, "planDashboardData");
  const { id } = useParams();
  const planDash = async () => {
    const planDashboardData = await axios.post(
      `${baseUrl}`+`operation_plan_dashboard`,
      { campaignId: id }
    );
    setPlanData(planDashboardData?.data?.data);
  };

  useEffect(() => {
    planDash();
  }, []);
  let percentageString = planData.verified_percentage;
  let verifiedPercent = Math.floor(percentageString);
  let percent = planData.execution_done_percentage;
  let executionPercent = Math.floor(percent);
  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2> Plan Dashboard </h2>
        </div>
      </div>
      <CampaignDetailes cid={id} />
      <div className="section">
        <Link>
          <div className="data-card is-hoverable">
            <div className="data-card__val">
              {planData.total_no_of_post}
              {/* total post */}
            </div>
            <div className="data-card__label">
              Total No.of Post in Campgain plan
            </div>
            <div className="data-card__color is-green"></div>
          </div>
        </Link>
        <Link>
          <div className="data-card is-hoverable">
            <div className="data-card__val">{planData?.total_no_of_page}</div>
            <div className="data-card__label">Total No of Pages</div>
            <div className="data-card__color is-green">start</div>
          </div>
        </Link>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {planData?.total_no_of_post_in_plan}
            {/* total post in plan */}
          </div>
          <div className="data-card__label">Total No of Post</div>
          <div className="data-card__color is-green"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {planData?.executed_execution_total}, [{executionPercent}%]
          </div>
          {/* <div className="">20%</div> */}
          <div className="data-card__label">Execution Total & Percentage</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {planData.verified_execution_total} , [{verifiedPercent}%]
          </div>
          <div className="data-card__label">verified Post & %</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">{planData.page_assigned}</div>
          <div className="data-card__label">Assigned page</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <Link to="/admin/experties-overview">
            <div className="data-card__val">{planData?.total_executers}</div>
            <div className="data-card__label">Total Executer Count</div>
            <div className="data-card__color is-red"></div>
          </Link>
        </div>

        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {planData.total_no_of_replacement}
            {/* total replacement */}
          </div>
          <div className="data-card__label">Total No of Replancement</div>
          <div className="data-card__color is-red"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            cate
            {/* {planData.category_wise_page_count[0]?.count} */}
          </div>
          <div className="data-card__label">Category Wise Post Count & %</div>
          <div className="data-card__color is-red"></div>
        </div>

        <div className="data-card is-hoverable">
          <div className="data-card__val percentage">
            {/* plateform_wise_page */}
            {/* {planData.plateform_wise_page_count[0]?.count} */}
          </div>
          <div className="data-card__label">Platform Wise Post Count & %</div>
          <div className="data-card__color is-green"></div>
        </div>

        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {planData?.total_no_of_assign_pages}
          </div>
          <div className="data-card__label">Total No of Assigned Page</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {planData?.total_data_for_assignment_model}
          </div>
          <div className="data-card__label">Total No of Assigned Model</div>
          <div className="data-card__color is-orange"></div>
        </div>
        <div className="data-card is-hoverable">
          <div className="data-card__val">
            {planData?.remaining_for_assignment}
            {/* remaining assign */}
          </div>
          <div className="data-card__label">Balance Remaining Page</div>
          <div className="data-card__color is-orange"></div>
        </div>
      </div>
    </>
  );
};

export default PlanDashboard;
