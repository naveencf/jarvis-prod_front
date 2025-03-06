import React from 'react'
import CreateMaster from './CreateMaster'

const CreateIndustry = () => {
  return (
    <div>
       <CreateMaster name={"Industry"}
      data ={[{label: "Name", payload: "name", validation: /\S/, required: true},
      {label:"description",payload:"description"}
      ]}/>
    </div>
  )
}

export default CreateIndustry
