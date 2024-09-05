import React, { useState } from "react";
import CreateMaster from "./CreateMaster";
const CreateService = () => {

  return (
    <>
      <CreateMaster name={"Service"}
      data ={[{label: "Name", payload: "name", validation: /\S/, required: true},
      {label:"Description",payload:"description"}
      ]}/>
    </>
  );
};

export default CreateService;
