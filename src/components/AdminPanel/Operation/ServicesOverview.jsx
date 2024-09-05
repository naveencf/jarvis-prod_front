import React, { useEffect, useState } from 'react'
import OverView from './OverView'
import axios from 'axios'
import { baseUrl } from '../../../../utils/config'

const ServicesOverview = () => {

    const [serviceData,setServiceData]=useState([])
    const getServiceInfo=async ()=>{
        const data=await axios.get(baseUrl+'services')
        setServiceData(data.data.result)
    }

    const hardReload=()=>{
        getServiceInfo()
    }
    useEffect(()=>{
        getServiceInfo()
    },[])
  return (
    <div>
      <OverView name={"Service"} data={serviceData} hardReload={hardReload}/>
    </div>
  )
}

export default ServicesOverview
