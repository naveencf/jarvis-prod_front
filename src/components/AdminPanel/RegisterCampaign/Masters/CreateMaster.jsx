import { TextField, Button, Paper, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../../Context/Context";
import { baseUrl } from '../../../../utils/config'
import FormContainer from "../../FormContainer";

const CreateMaster = ({ name, data }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const url = baseUrl + "";
  const navigate = useNavigate();
  const [payload, setPayload] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = (field, value) => {
    if (field.required && (!value || !/\S/.test(value))) {
      return `Required`;
    }
    if (field.validation && !field.validation.test(value)) {
      return `Invalid format`;
    }
    return "";
  };
  const changeHandler = (e) => {

    setPayload({ ...payload, [e.target.name]: e.target.value });
    const error = validateField(field, e.target.value);
    setErrors({ ...errors, [e.target.name]: error });
  };


  const handleSubmit = async () => {
    for (let field of data) {
      if ((field.required && !payload[field.payload]) ||
        (field.validation && !field.validation.test(payload[field.payload]))) {
        toastError(`Invalid ${field.label}`);
        return;
      }
    }
    try {
      let result;
      if (name === "Agency") {
        result = await axios.post(`${url}agency`, payload);
      } else if (name === "Goal") {
        result = await axios.post(`${url}goal`, payload);
      } else if (name === "Industry") {
        result = await axios.post(`${url}industry`, payload);
      } else if (name === "Service") {
        result = await axios.post(`${url}services`, payload);
      }
      if (result.status === 200) {
        toastAlert("Added Successfully");
        navigate(`/admin/overview/${name}`);
      }
    } catch (error) {
      if (error.response.status === 403) {
        toastError(error.response.data.message);
      } else if (error.response.data.message) {
        toastError("Fill Required field");
      } else {
        toastError("Error");
      }
    }
  };


  console.log(payload);
  return (
    <div>
      <FormContainer mainTitle={`Create ${name}`}
        link={"true"}
        submitButton={false}

      />

      <div className="card body-padding">
        <Grid container spacing={2}>
          {data &&
            data.map((field, index) => (
              <Grid item xs={4} key={index}>
                <TextField
                  name={field.payload}
                  onChange={changeHandler}
                  label={
                    field.required ? `${field.label} *` : field.label
                  } error={!!errors[field.payload]}
                  helperText={errors[field.payload]}
                  sx={{ mt: 0.5 }}
                  fullWidth
                />
              </Grid>
            ))}
        </Grid>


      </div>
      <div className="pack">

        <button className="btn cmnbtn  btn-outline-primary" onClick={handleSubmit}>
          submit
        </button>
      </div>
    </div>
  );
};

export default CreateMaster;
