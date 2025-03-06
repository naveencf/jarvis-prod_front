import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'
import {baseUrl} from '../../../../utils/config'

const AgencyOverview = () => {

    const [agencyData,setAgencyData]=useState([])
    const getAgencyInfo=async ()=>{
        const data=await axios.get(baseUrl+'agency')
        setAgencyData(data?.data?.result)
    }

    const hardReload=()=>{
        getAgencyInfo()
    }
    useEffect(()=>{
        getAgencyInfo()
    },[])
  return (
    <div>
      <OverView name={"Agency"} data={agencyData} hardReload={hardReload}/>
    </div>
  )
}

export default AgencyOverview
