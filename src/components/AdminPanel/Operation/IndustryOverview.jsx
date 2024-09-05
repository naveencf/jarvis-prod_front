import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'
import {baseUrl} from '../../../../utils/config'

const IndustryOverview = () => {

    const [industryData,setIndustryData]=useState([])
    const getIndustryInfo=async ()=>{
        const data=await axios.get(baseUrl+'industry')
        setIndustryData(data.data.result)
    }

    const hardReload=()=>{
        getIndustryInfo()
    }
    useEffect(()=>{
        getIndustryInfo()
    },[])
  return (
    <div>
        
      <OverView name={"Industry"} data={industryData} hardReload={hardReload}/>
    </div>
  )
}

export default IndustryOverview
