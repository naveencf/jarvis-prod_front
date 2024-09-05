import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import { event } from "jquery";
import { useEffect } from "react";
import axios from "axios";
import BrandCategory from "./BrandCategoryMaster";
import { useContext } from "react";
// import { InstaInterpretorContext } from "./InterpretorContext";
// import { InstaContext } from "../InstaApiContext";
const BrandCategoryMaster = ({
    reloadbrandcat,
    setReloadbrandcat,
    userID,
}) => {
    // const { reloadbrands, setReloadbrands } = useContext(InstaInterpretorContext);

    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState("paper");
    const [brandcatname, setBrandCatName] = useState("");
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleRegister = () => {
        // //console.log(brandcatname);
        try {
            axios
                .post("https://insights.ist:8080/api/brandCategory", {
                    brandCategory_name: brandcatname,
                    brand_id: 1,
                    created_by: userID,
                })
                .then((res) => {
                    setReloadbrandcat(!reloadbrandcat);
                });
        } catch (error) {
            console.error(error);
        }
        setOpen(false);
    };
    return (
        <>
            <Button onClick={handleClickOpen("paper")}>Add Brand Category</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    Register Brand Category
                </DialogTitle>
                <DialogContent dividers={scroll === "paper"}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        // ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Grid container>
                            <Stack sx={{ width: 400 }} spacing={2}>
                                <TextField
                                    id="outlined-read-only-input"
                                    label={"Brand Category Name"}
                                    // value={textfieldValue[i]}
                                    onChange={(e) => setBrandCatName(e.target.value)}
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
export default BrandCategoryMaster;





