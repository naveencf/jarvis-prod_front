import React, { useState } from 'react'
import View from '../../Sales/Account/View/View'

const StatsOfOverviewModal = ({pageList, dataGridcolumns}) => {
    
  return (
    <>
    <View
            columns={dataGridcolumns}
            data={pageList}
            isLoading={false}
            // title={"Follower Logs"}
            pagination={[100, 200, 1000]}
            tableName={"Follower Logs"}
          />
    </>
  )
}

export default StatsOfOverviewModal