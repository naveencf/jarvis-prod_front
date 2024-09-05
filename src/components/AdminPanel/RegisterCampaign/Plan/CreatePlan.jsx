import { useState } from "react";
import PageDetailingForDirect from "./PageDetailingForDirect";
import FormContainer from "../../FormContainer";



const CreatePlan = () => {
  return (
    <>
    <FormContainer
        mainTitle="Plan Creation"
        link="true"
    />
     


      <PageDetailingForDirect
        pageName={"planCreation"}
      />
    </>
  )
}

export default CreatePlan
