import React, { useState } from "react";
import CreateMaster from "./CreateMaster";
const CreateAgency = () => {

  return (
    <>
      <CreateMaster
        name={'Agency'}
        data={[
            {label: "Name", payload: "name", validation: /\S/, required: true},{label:"Mobile",payload:"mobile",validation: /^\d{10}$/,required: true},{label:"Alternate Mobile",payload:"alternateMobile"},
            {label:"City",payload:"city", required: true}, {label:"Instagram",payload:"instagram"}, {label:"Email",payload:"email",validation: /^\S+@\S+\.\S+$/, required: true}, {label:"Remark",payload:"remark"}
        ]}
      />
    </>
  );
};

export default CreateAgency;

// import { TextField, Grid, Box,Button } from "@mui/material";
// import axios from "axios";
// import React, { useState } from "react";
// import { useGlobalContext } from "../../../../Context/Context";
// import { useNavigate } from "react-router-dom";

// const CreateAgency = () => {
//   const { toastAlert, toastError } = useGlobalContext();
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [alternateNumber, setAlternateNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [instagram, setInstagram] = useState("");
//   const [city, setCity] = useState("");
//   const [remark, setRemark] = useState("");

// const handleSubmit=  async()=>{
//  await axios.post(baseUrl+"agency",{
//     name:name,
//     mobile:mobileNumber,
//     alternateMobile:alternateNumber,
//     email:email,
//     instagram:instagram,
//     city:city,
//     remark:remark

//   }).then((res)=>{
//     if (res.status === 200) {
//       toastAlert("Added Successfully");
//       navigate(`/admin/overview/agency`);
//     }
//   })
// }

//   return (
//     <div>
//       <Grid item xs={4}>
//         <TextField
//           label="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           sx={{ mt: 0.5 }}
//         />
//         <TextField
//           label="Mobile Number"
//           value={mobileNumber}
//           onChange={(e) => setMobileNumber(e.target.value)}
//           sx={{ mt: 0.5 }}
//         />
//         <TextField
//           label="Alternet Number"
//           value={alternateNumber}
//           onChange={(e) => setAlternateNumber(e.target.value)}
//           sx={{ mt: 0.5 }}
//         />
//       </Grid>
//       <Grid item xs={4}>
//         <TextField
//           label="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           sx={{ mt: 0.5 }}
//         />
//         <TextField
//           label="Instagram"
//           value={instagram}
//           onChange={(e) => setInstagram(e.target.value)}
//           sx={{ mt: 0.5 }}
//         />
//         <TextField
//           label="City"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           sx={{ mt: 0.5 }}
//         />
//       </Grid>
//       <Grid item xs={4}>
//         <TextField
//           label="Remark"
//           value={remark}
//           onChange={(e) => setRemark(e.target.value)}
//           sx={{ mt: 0.5 }}
//         />
//       </Grid>
//       <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
//           <Button variant="outlined" color="error" onClick={handleSubmit}>
//             submit
//           </Button>
//         </Box>
//     </div>
//   );
// };

// export default CreateAgency;

