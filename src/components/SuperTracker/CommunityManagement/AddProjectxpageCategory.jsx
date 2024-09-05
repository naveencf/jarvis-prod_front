import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import axios from "axios";

export default function AddProjectxpageCategory({reloadpagecategory,setReloadpagecategory}) {
 

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [projectxpageCategoryName, setProjectxpageCategoryName] = useState("");

 
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleRegister = () => {
    // //console.log(brandCategoryname.brandCategory_id, brandcatsubname);
    try {
      axios
        .post("https://insights.ist:8080/api//projectxpagecategory", {
          category_name: projectxpageCategoryName,
     
        })
        .then((res) => {
            setReloadpagecategory(!reloadpagecategory);
        //  console.log(res,"res")
        });
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen("paper")}>+</Button>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          Register New Page Category
        </DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
        
            tabIndex={-1}
          >
            <Grid container>
              <Stack sx={{ width: 400, height: 400 }} spacing={2}>
         
                <TextField
                  id="outlined-read-only-input"
                  label={"Page Category Name"}
                  // value={textfieldValue[i]}
                  onChange={(e) => setProjectxpageCategoryName(e.target.value)}
                />
               
              </Stack>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleRegister}>Register</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
