import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  setCloseShowAddModal,
  setCloseShowPageInfoModal,
} from "../../Store/PageMaster";
import { useEffect, useState } from "react";
import { Autocomplete, Box, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import jwtDecode from "jwt-decode";
import {
  useAddPageCategoryMutation,
  useAddPlatformPriceMutation,
  useAddProfileTypeMutation,
  useUpdatePageCategoryMutation,
  useUpdatePlatformPriceMutation,
  useUpdateProfileTypeMutation,
} from "../../Store/PageBaseURL";
import { useGlobalContext } from "../../../Context/Context";
import { useGetPmsPlatformQuery } from "../../Store/reduxBaseURL";
import { setRowData } from "../../Store/PageMaster";

export default function PageAddMasterModal() {
  const { toastAlert, toastError } = useGlobalContext();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const open = useSelector((state) => state.pageMaster.showAddModal);
  const modalType = useSelector((state) => state.pageMaster.modalType);
  const dispatch = useDispatch();
  const rowData = useSelector((state) => state.pageMaster.rowData);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm();

  const [title, setTitle] = useState("");

  const handleClose = () => {
    dispatch(setCloseShowAddModal());
    setValue("name", "");
    setValue2("description", null);
    setValue2("platform", null);
    setValue2("priceType", null);
    dispatch(setRowData({}));
  };

  const [addProfileType] = useAddProfileTypeMutation();
  const [updateProfileType] = useUpdateProfileTypeMutation();
  const [addCategory] = useAddPageCategoryMutation();
  const [updateCategory] = useUpdatePageCategoryMutation();

  useEffect(() => {
    if (modalType === "Profile Type") {
      setTitle("Add Profile Type");
    } else if (modalType === "Profile Type Update") {
      setTitle("Update Profile Type");
      setValue("name", rowData.profile_type);
      setValue("description", rowData.description);
    } else if (modalType === "Category") {
      setTitle("Add Category");
    } else if (modalType === "Category Update") {
      setTitle("Update Category");
      setValue("name", rowData.page_category);
      // setValue("name", rowData.category_name);
      setValue("description", rowData.description);
    } else if (modalType === "Price Type") {
      setTitle("Add Price Type");
    } else if (modalType === "Price Type Update") {
      setTitle("Update Price Type");
    }
  }, [modalType, rowData]);

  const formSubmit = (data) => {
    const obj = {
      profile_type: data.name,
      description: data.description,
      updated_by: userID,
      _id: rowData._id,
      created_by: userID,
    };

    if (modalType === "Profile Type") {
      delete obj.updated_by;
      delete obj._id;

      addProfileType(obj)
        .unwrap()
        .then(() => {
          toastAlert("Profile Type Added Successfully");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType === "Profile Type Update") {
      delete obj.created_by;
      delete obj.updated_by;
      obj.last_updated_by = userID;
      updateProfileType(obj)
        .unwrap()
        .then(() => {
          toastAlert("Profile Type Updated Successfully");
          handleClose();
          dispatch(setCloseShowPageInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType === "Category") {
      delete obj.updated_by;
      delete obj.profile_type;
      // obj.category_name = data.name;
      obj.page_category = data.name;
      addCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Category Added Successfully");
          handleClose();
        })
        .catch((err) => {
          toastError(err.message);
        });
    } else if (modalType === "Category Update") {
      delete obj.updated_by;
      delete obj.profile_type;
      obj.category_name = data.name;
      obj.last_updated_by=userID
      updateCategory(obj)
        .unwrap()
        .then(() => {
          toastAlert("Category Updated Successfully");
          handleClose();
          dispatch(setCloseShowPageInfoModal());
        })
        .catch((err) => {
          toastError(err.message);
        });
    }
  };

  const { data: platformData } = useGetPmsPlatformQuery();
  const platformList = platformData?.data || [];

  const [addPlatformPrice] = useAddPlatformPriceMutation();
  const [updatePlatformPrice] = useUpdatePlatformPriceMutation();

  if (modalType === "Price Type" || modalType === "Price Type Update") {
    const priceTypeFormSubmit = (data) => {
      // console.log(data);
      const obj = {
        name: data.priceType,
        platfrom_id: platformList.find(
          (platform) => platform.platform_name === data.platform
        )._id,
        description: data.description,
        created_by: userID,
      };

      if (modalType === "Price Type") {
        addPlatformPrice(obj)
          .unwrap()
          .then(() => {
            toastAlert("Price Type Added Successfully");
            handleClose();
          })
          .catch((err) => {
            toastError(err.message);
          });
      } else {
        obj._id = rowData._id;
        updatePlatformPrice(obj)
          .unwrap()
          .then(() => {
            toastAlert("Price Type Updated Successfully");
            handleClose();
            dispatch(setCloseShowPageInfoModal());
          })
          .catch((err) => toastError(err.message));
      }
    };

    setValue2("priceType", rowData.name);
    setValue2("description", rowData.description);

    return (
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit2(priceTypeFormSubmit)}>
              <TextField
                label="Price Type"
                required={true}
                {...register2("priceType", {
                  required: "Please Enter the Price Type",
                })}
              />
              <Autocomplete
                id="platform-autocomplete"
                options={platformList?.map((option) => ({
                  platformName: option.platform_name,
                  value: option._id,
                }))}
                getOptionLabel={(option) => option.platformName || ""}
                style={{ width: 300 }}
                defaultValue={{
                  platformName: platformList.find(
                    (platform) => platform._id === rowData.platfrom_id
                  )?.platform_name,
                }}
                onChange={(event, newValue) => {
                  setValue2("platform", newValue ? newValue.value : "");
                }}
                isOptionEqualToValue={(option, value) =>
                  option.platformName === value.platformName
                }
                renderInput={(params) => (
                  <TextField
                    {...register2("platform", {
                      required: "Please Select the Platform",
                    })}
                    {...params}
                    label="Platform *"
                    variant="outlined"
                    helperText={errors2.platform?.message}
                    error={Boolean(errors2.platform)}
                  />
                )}
              />

              <TextField
                label="Description"
                required={false}
                {...register2("description")}
              />
              <DialogActions>
                <Button autoFocus type="submit">
                  Submit
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(formSubmit)}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name *"
              type="text"
              fullWidth
              {...register("name", {
                required: "Please Enter the Name",
                maxLength: 80,
              })}
              helperText={errors.name?.message}
              error={Boolean(errors.name)}
            />
            {/* {!modalType == "category" ||
              !modalType == "Add Category" ||
              (!modalType == "Category" && ( */}
                <TextField
                  autoFocus
                  margin="dense"
                  id="description"
                  label="Description"
                  type="text"
                  fullWidth
                  {...register("description")}
                />
              {/* ))} */}
            <DialogActions>
              <Button autoFocus type="submit">
                submit
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
