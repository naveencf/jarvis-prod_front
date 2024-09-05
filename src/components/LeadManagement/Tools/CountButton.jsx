import { Button } from "@mui/material";
import React from "react";

function CountButton({ hm, params }) {
  return (
    <Button
      component="button"
      variant="contained"
      size="small"
      style={{ marginLeft: -5 }}
      // onClick={() => localStorage.setItem("seEmpID", params.id)}
    >
      {hm.has(params.id) ? hm.get(params.id) : "NA"}
    </Button>
  );
}

export default CountButton;
