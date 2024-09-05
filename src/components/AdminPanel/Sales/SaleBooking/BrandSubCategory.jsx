import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import { useContext } from "react";
// import { InstaInterpretorContext } from "./InterpretorContext";

import { useEffect } from "react";
import axios from "axios";
// import { InstaContext } from "../InstaApiContext";
const BrandSubCategory = ({
    hashtags,
    brandCategoryname,
    setBrandCategoryName,
    userID,
    handleBrandCategory,
}) => {
    // const {
    //     reloadbrands,
    //     setReloadbrands,
    //     setBrandSubCategory,
    //     reloadbrandsubcat,
    //     setReloadbrandsubcat,
    // } = useContext(InstaInterpretorContext);
    // const { userID } = useContext(InstaContext);
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState("paper");
    const [brandcatsubname, setBrandSubCatName] = useState("");
    const [brandcatname, setBrandCatName] = useState(null);
    const [brandcat, setBrandCat] = useState(null);
    const [isLoading, setLoading] = useState(false);
    // //console.log(hashtags);
    const handleClickOpen = (scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        axios.get("https://insights.ist:8080/api/brandCategory").then((res) => {
            // //console.log(res.data.data);
            setBrandCat(res.data.data);
            setLoading(true);
        });
    }, []);
    const handleCatChange = (event, newValue) => {
        //console.log(event, newValue);
        const brandtempcat = brandcat.find((ele) => {
            return ele.brandCategory_name == newValue;
        });
        // //console.log(brandcat);
        //console.log(brandtempcat);
        setBrandCatName(brandtempcat.brandCategory_id);
    };
    const handleRegister = () => {
        // //console.log(brandCategoryname.brandCategory_id, brandcatsubname);
        try {
            axios
                .post("https://insights.ist:8080/api/brandSubCategory", {
                    brandSubCategory_name: brandcatsubname,
                    brandCategory_id: brandCategoryname.brandCategory_id,
                    created_by: userID,
                })
                .then((res) => {
                    setReloadbrandsubcat(!reloadbrandsubcat);
                });
        } catch (error) {
            //console.log(error);
        }
        setOpen(false);
    };
    console.log(brandcat);
    return (
        <>
            <Button onClick={handleClickOpen("paper")}>Add Brand Sub Category</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">
                    Register New Brand Sub Category
                </DialogTitle>
                <DialogContent dividers={scroll === "paper"}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        // ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Grid container>
                            <Stack sx={{ width: 400, height: 400 }} spacing={2}>
                                <Autocomplete
                                    disablePortal
                                    clearIcon={false}
                                    id="combo-box-demo"
                                    value={brandCategoryname?.brandCategory_name}
                                    options={
                                        brandcat == null ? (
                                            <>"Loading..."</>
                                        ) : (
                                            brandcat?.map((brcat) => brcat?.brandCategory_name)
                                        )
                                    }
                                    //   options={isLoading ? <>"Loading..."</>:brandcat.map(
                                    //     (ele) => ele.brandMajorCategory_name
                                    //   )}
                                    // onInputChange={()=>{setBrandCatName({label:brcat.brandCategory_name,brandId:brandCategory_id})}}
                                    onInputChange={handleBrandCategory}
                                    renderInput={(params) => (
                                        <>
                                            <TextField {...params} label="Brand Category" />
                                        </>
                                    )}
                                />
                                <TextField
                                    id="outlined-read-only-input"
                                    label={"Brand Sub Category Name"}
                                    // value={textfieldValue[i]}
                                    onChange={(e) => setBrandSubCatName(e.target.value)}
                                />
                                {/* <TextField
                  id="outlined-read-only-input"
                  label={"Brand Sub Category Name"}
                  // value={textfieldValue[i]}
                  onChange={(e) => setBrandSubCatName(e.target.value)}
                /> */}
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
export default BrandSubCategory;