import React from "react";

const CreatedPlanData = ({ data }) => {
  return (
    <div>
      {data.length > 0 && (
        <>
          <h5 className="m-4"> Plan - {data[0].planName}</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Page name</th>
                <th>Followers </th>
                <th>Post </th>
                <th>Story</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, planIndex) => (
                <tr key={planIndex}>
                  <td>{planIndex + 1}</td>
                  <td>{item.page_name}</td>
                  <td>{item.follower_count}</td>
                  <td>{item.postPerPage}</td>
                  <td>{item.storyPerPage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CreatedPlanData;
