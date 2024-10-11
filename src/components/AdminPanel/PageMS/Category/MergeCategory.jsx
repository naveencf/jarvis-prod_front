import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Select from "react-select";
import Swal from "sweetalert2";
import axios from "axios";
import { useGetAllPageCategoryQuery } from "../../../Store/PageBaseURL";
import { baseUrl } from "../../../../utils/config";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MergeCategory() {
  const [open, setOpen] = React.useState(false);
  const { data: category ,refetch:refetchPageCate} = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];
  const [preference, setPreference] = React.useState("");
  const [remove, setRemove] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const startDate = "2023-01-01";
    const currentDate = new Date().toISOString().split("T")[0];
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, merge it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(baseUrl + `v1/merge_page_category`, {
            preference_id: preference,
            removed_id: remove,
            flag: 2,
            start_date: startDate,
            end_date: currentDate  
          })
          .then(() => {
            Swal.fire({
              title: "Merged!",
              text: "The categories have been merged successfully.",
              icon: "success",
            });
            handleClose()
            refetchPageCate()
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "Something went wrong. Please try again.",
              icon: "error",
            });
          });
      }
    });
  };
  

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Merge Category
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
         fullWidth={true} // Ensures the dialog takes full width based on maxWidth
        maxWidth="md"
      >
        <DialogTitle>{"Merge Category"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="form-group col-12">
              <label className="form-label">
                Preference <sup className="form-error">*</sup>
              </label>
              <Select
                className=""
                options={categoryData.map((option) => ({
                  value: option.page_category_id,
                  label: `${option.page_category}`,
                }))}
                value={{
                  value: preference,
                  label:
                    categoryData.find(
                      (user) => user.page_category_id === preference
                    )?.page_category || "",
                }}
                onChange={(e) => {
                  setPreference(e.value);
                }}
                required
              />
            </div>
            <div className="form-group col-12">
              <label className="form-label">
                Remove <sup className="form-error">*</sup>
              </label>
              <Select
                className=""
                options={categoryData.map((option) => ({
                  value: option.page_category_id,
                  label: `${option.page_category}`,
                }))}
                value={{
                  value: remove,
                  label:
                    categoryData.find(
                      (user) => user.page_category_id === remove
                    )?.page_category || "",
                }}
                onChange={(e) => {
                  setRemove(e.value);
                }}
                required
              />
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
