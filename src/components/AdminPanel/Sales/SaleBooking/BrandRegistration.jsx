import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import { Autocomplete, Grid, Stack, TextField } from "@mui/material";
import axios from "axios";
import BrandCategoryMaster from "./BrandCategoryMaster";
import BrandSubCategory from "./BrandSubCategory";
import { useGetAllBrandQuery } from "../../../Store/API/Sales/BrandApi";
import { useGlobalContext } from "../../../../Context/Context";

const BrandRegistration = ({ userID, disabled }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("paper");
  const [brandname, setBrandName] = useState(null);
  const [website, setWebsite] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [brandsubcat, setBrandsubcat] = useState(null);
  const [brandSubCategory, setBrandSubCategory] = useState([]);
  const [majorcat, setMajorcat] = useState(null);
  const [brandCategory, setBrandCategory] = useState(null);
  const [brandCategoryname, setBrandCategoryName] = useState(null);
  const [loading, setLoading] = useState(null);
  const [loadingigusername, setLoadingIgusername] = useState(true);
  const [igusername, setIgusername] = useState(null);
  const [reloadbrandcat, setReloadbrandcat] = useState(false);
  const {
    data: allBrands,
    error: allBrandsError,
    isLoading: allBrandsLoading,
    refetch,
  } = useGetAllBrandQuery();
  const majorcategoryoption = [
    { brandMajorCategory_id: 1, brandMajorCategory_name: "Brands" },
    { brandMajorCategory_id: 2, brandMajorCategory_name: "Normal" },
    { brandMajorCategory_id: 3, brandMajorCategory_name: "Negative" },
    { brandMajorCategory_id: 4, brandMajorCategory_name: "NBFRS" },
    { brandMajorCategory_id: 5, brandMajorCategory_name: "Entertainment" },
  ];
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    axios.get("https://insights.ist:8080/api/brandSubCategory").then((res) => {
      // //console.log(res.data.data);
      setBrandSubCategory(res.data.data);
      setLoading(true);
    });
  }, []);
  const handleRegister = async () => {
    if (!brandname || !majorcat || !brandsubcat) {
      if (!majorcat) {
        alert("Please fill Campaign Name fields before submitting.");
        return;
      } else if (!brandname) {
        alert("Please fill Brand before submitting.");
        return;
      } else if (!brandsubcat) {
        alert("Please fill Brand Sub Category fields before submitting.");
        return;
      } else if (!igusername) {
        alert("Please fill IG Username fields before submitting.");
        return;
      }
      alert("Please fill all fields before submitting.");
      return;
    }
    try {
      await axios.post("https://insights.ist:8080/api/insta_brand", {
        instaBrandName: brandname,
        brandCategoryId: brandCategoryname.brandCategory_id,
        brandSubCategoryId: brandsubcat.brandSubCategory_id,
        igUserName: igusername,
        whatsApp: whatsapp,
        website: website,
        majorCategory: majorcat.brandMajorCategory_name,
        userId: userID,
        brandCategoryName: brandCategoryname.brandCategory_name,
        brandSubCategoryName: brandsubcat.brandSubCategory_name,
      });

      refetch();
      setOpen(false);
      // Assuming setBrandReloadfromregistration and setCampaignBrand are functions provided by the parent or context
      // setBrandReloadfromregistration(false);
      // setCampaignBrand(res.data.data);
    } catch (error) {
      toastError(error.message + " This brand already exists");
    }
  };
  const handlemajorcategory = (event, newValue) => {
    const selectedBrand = majorcategoryoption.find(
      (ele) => ele.brandMajorCategory_name === newValue
    );
    setMajorcat(selectedBrand);
  };
  const handleBrandCategory = (event, newValue) => {
    const selectedBrand = brandCategory.find(
      (ele) => ele.brandCategory_name === newValue
    );
    setBrandCategoryName(selectedBrand);
  };
  const handleBrandSubCategory = (event, newValue) => {
    const selectedBrand = brandSubCategory.find(
      (ele) => ele.brandSubCategory_name === newValue
    );
    setBrandsubcat(selectedBrand);
  };
  useEffect(() => {
    axios.get("https://insights.ist:8080/api/brandCategory").then((res) => {
      setBrandCategory(res.data.data);
      setLoading(true);
    });
  }, [reloadbrandcat]);

  return (
    <>
      <Button
        onClick={handleClickOpen("paper")}
        className="btn iconBtn btn-outline-primary"
        disabled={disabled}
      >
        <i className="bi bi-plus"></i>
      </Button>
      {loading && (
        <Dialog
          open={open}
          onClose={handleClose}
          scroll={scroll}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Register New Brand</DialogTitle>
          <DialogContent dividers={scroll === "paper"}>
            <DialogContentText id="scroll-dialog-description">
              <Grid container>
                <Stack sx={{ width: 400 }} spacing={2}>
                  <TextField
                    id="outlined-read-only-input"
                    label={"Brand Name*"}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                  <Autocomplete
                    disablePortal
                    clearIcon={false}
                    id="combo-box-demo"
                    options={majorcategoryoption.map(
                      (ele) => ele.brandMajorCategory_name
                    )}
                    onInputChange={handlemajorcategory}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} label="Major Category*" />
                      </>
                    )}
                  />
                  <Autocomplete
                    disablePortal
                    clearIcon={false}
                    id="combo-box-demo"
                    options={brandCategory?.map(
                      (brcat) => brcat.brandCategory_name
                    )}
                    onInputChange={handleBrandCategory}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} label="Brand Category*" />
                      </>
                    )}
                  />
                  <BrandCategoryMaster
                    reloadbrandcat={reloadbrandcat}
                    setReloadbrandcat={setReloadbrandcat}
                    userID={userID}
                  />
                  <Autocomplete
                    disablePortal
                    clearIcon={false}
                    id="combo-box-demo"
                    options={brandSubCategory.map(
                      (psc) => psc.brandSubCategory_name
                    )}
                    onInputChange={handleBrandSubCategory}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} label="Brand Sub Category*" />
                      </>
                    )}
                  />
                  <BrandSubCategory
                    brandCategoryname={brandCategoryname}
                    setBrandCategoryName={setBrandCategoryName}
                    handleBrandCategory={handleBrandCategory}
                    userID={userID}
                  />
                  {/* {loadingigusername && (
                                        <Autocomplete
                                            disablePortal
                                            clearIcon={false}
                                            id="combo-box-demo"
                                            options={mentions}
                                            onInputChange={(event, newValue) => {
                                                setIgusername(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <>
                                                    <TextField {...params} label="IG Username*" />
                                                </>
                                            )}
                                        />
                                    )} */}
                  {/* {!loadingigusername && ( */}
                  <TextField
                    hiddenLabel
                    id="outlined-read-only-input"
                    label={"IG Username*"}
                    onChange={(e) => setIgusername(e.target.value)}
                  />
                  {/* // )} */}
                  {/* {loadingigusername ? (
                                        <Button
                                            onClick={() => setLoadingIgusername(!loadingigusername)}
                                        >
                                            Insert IG Username
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => setLoadingIgusername(!loadingigusername)}
                                        >
                                            Select IG Username
                                        </Button>
                                    )} */}
                  <TextField
                    hiddenLabel
                    id="outlined-read-only-input"
                    label={"Website"}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                  <TextField
                    hiddenLabel
                    id="outlined-read-only-input"
                    label={"Whatsapp/Telegram Link"}
                    onChange={(e) => setWhatsapp(e.target.value)}
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
      )}
    </>
  );
};

export default BrandRegistration;
