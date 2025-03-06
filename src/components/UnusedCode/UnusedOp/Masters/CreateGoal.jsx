import React from 'react'
import CreateMaster from './CreateMaster'

const CreateGoal = () => {
  return (
    <>
      <CreateMaster name={"Goal"}
      data ={[{label: "Name", payload: "name", validation: /\S/, required: true},
      {label:"description",payload:"description"}
      ]}/>
    </>
  )
}

export default CreateGoal
