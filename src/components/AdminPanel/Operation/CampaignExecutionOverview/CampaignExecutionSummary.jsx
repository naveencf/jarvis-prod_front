import React from "react";

const CampaignExecutionSummary = ({ overviewCommitData }) => {
  const pageCount = overviewCommitData?.page_count ?? 0;
  const executed = overviewCommitData?.completedData?.executed ?? 0;
  const remaining = overviewCommitData?.completedData?.remaining ?? 0;
  const commentsCommitment = overviewCommitData?.commitmentdata?.comments ?? 0;
  const likesCommitment = overviewCommitData?.commitmentdata?.Likes ?? 0;
  const viewsCommitment = overviewCommitData?.commitmentdata?.views ?? 0;
  const commentsAchieved = overviewCommitData?.completedData?.post_comments ?? 0;
  const likesAchieved = overviewCommitData?.completedData?.post_likes ?? 0;
  const viewsAchieved = overviewCommitData?.completedData?.post_views ?? 0;

  return (
    <div>
      <div className="summary-section mb-3">
        <h4>Total Summary</h4>
        <p>Total Pages: {pageCount}</p>
        <p>Total Posts: {pageCount} (Posted: {executed}, Pending: {remaining})</p>
        {/* <p>Total Stories: 3000 (Posted: 1500, Pending: 1500)</p> */}
      </div>
      <div className="d-flex justify-content-around">
        <div className="card" style={{ width: "250px", background: "#F3E8EA" }}>
          <div className="card-header">Commitment</div>
          <div className="card-body">
            <p>Comments: {commentsCommitment}</p>
            <p>Likes: {likesCommitment}</p>
            {/* <p>Engagement: {overviewCommitData?.commitmentdata?.engagement}</p> */}
            <p>Views: {viewsCommitment}</p>
          </div>
        </div>
        <div className="card" style={{ width: "250px", background: "#FFDEAD" }}>
          <div className="card-header">Achieved</div>
          <div className="card-body">
            <p>Comments: {commentsAchieved}</p>
            <p>Likes: {likesAchieved}</p>
            <p>Views: {viewsAchieved}</p>
          </div>
        </div>
        <div className="card" style={{ width: "250px", background: "#DBE9FA" }}>
          <div className="card-header">Difference</div>
          <div className="card-body">
            <p>
              Comments: {commentsCommitment < commentsAchieved ? "+" : ""}{Math.abs(commentsCommitment - commentsAchieved)}
            </p>
            <p>
              Likes: {likesAchieved > likesCommitment ? "+" : ""}{Math.abs(likesCommitment - likesAchieved)}
            </p>
            <p>
              Views: {viewsAchieved > viewsCommitment ? "+" : ""}{Math.abs(viewsCommitment - viewsAchieved)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignExecutionSummary;
