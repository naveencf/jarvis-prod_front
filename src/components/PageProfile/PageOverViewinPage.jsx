import React from 'react'
import { TabContext, TabList, TabPanel } from "@mui/lab";

function PageOverViewinPage({value,engagementArray}) {
    const formatNumber = (value) => {
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(2)} M`;
        } else if (value >= 1000) {
          return `${(value / 1000).toFixed(2)} k`;
        } else {
          return Math.round(value).toString();
        }
      };
  return (
    <div className="card-body pt20 pb20">
              <TabPanel className="p0" value={value}>
                <div className="row pgRechRow m0">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 pgRechCol">
                    <div className="pgRechBox">
                      <div className="pgRechBoxData_New">
                        <div className="pgRechBoxItems_New row">
                          <div className="col-md-3 col-sm-4 col-12 col">
                            <div className="pgRechBoxItem_New">
                              <span>Total Posts</span> {engagementArray?.count}
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-4 col-12 col">
                            <div className="pgRechBoxItem_New">
                              <span>Avg. Views</span> {formatNumber((engagementArray?.postTypeCounts[0]?.allViewCounts+engagementArray?.postTypeCounts[1]?.allViewCounts+engagementArray?.postTypeCounts[2]?.allViewCounts) /engagementArray?.count)}
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-4 col-12 col">
                            <div className="pgRechBoxItem_New">
                              <span>Avg. Likes</span> {formatNumber((engagementArray?.postTypeCounts[0]?.allLikesCount+engagementArray?.postTypeCounts[1]?.allLikesCount+engagementArray?.postTypeCounts[2]?.allLikesCount) /engagementArray?.count)}
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-4 col-12 col">
                            <div className="pgRechBoxItem_New">
                              <span>Avg. Comments</span> {formatNumber((engagementArray?.postTypeCounts[0]?.allComments+engagementArray?.postTypeCounts[1]?.allComments+engagementArray?.postTypeCounts[2]?.allComments) /engagementArray?.count)}
                            </div>
                          </div>
                          {/* <div className="col-md-3 col-sm-4 col-12 col">
                            <div className="pgRechBoxItem_New">
                              <span>Engagement Rate</span> 3.9%
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-4 col-12 col">
                            <div className="pgRechBoxItem_New">
                              <span>View Rate</span> 6.16%
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
          
            </div>
  )
}

export default PageOverViewinPage