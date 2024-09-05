import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'
import {baseUrl} from '../../../../utils/config'

const GoalOverview = () => {

    const [goalData,setGoalData]=useState([])
    const getGoalInfo=async ()=>{
        const data=await axios.get(baseUrl+'goal')
        setGoalData(data.data.result)
    }

    const hardReload=()=>{
        getGoalInfo()
    }
    useEffect(()=>{
        getGoalInfo()
    },[])
  return (
    <div>
      <OverView name={"Goal"} data={goalData} hardReload={hardReload}/>
    </div>
  )
}

export default GoalOverview
