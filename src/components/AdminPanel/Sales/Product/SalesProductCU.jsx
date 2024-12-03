import React from "react";
import { useLocation, useParams } from "react-router-dom";

const SalesProductCU = () => {
  const task = useParams().task;

  console.log(useLocation());

  return <div>SalesProductCU</div>;
};

export default SalesProductCU;
