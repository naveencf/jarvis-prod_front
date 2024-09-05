import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeTagCategoriesModal,
  setPlatform,
  setTagCategories,
} from "../../Store/PageOverview";
import { Button } from "antd";

export default function TagCategoryListModal() {
  const isDialogOpen = useSelector(
    (state) => state.PageOverview?.showTagCategoriesModal
  );
  const tagCategories = useSelector(
    (state) => state.PageOverview.tagCategories
  );
  const data = useSelector((state) => state.PageOverview.platforms);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeTagCategoriesModal());
    dispatch(setTagCategories([]));
    dispatch(setPlatform([]));
  };
  return (
    <>
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <p className="text-black-50">
            {tagCategories ? "Tag Categories" : ""}
          </p>
        </DialogTitle>
        <DialogContent>
          {tagCategories?.map((item, i) => {
            return (
              <>
                <p className="fs-5" key={i}>
                  {i + 1 + " " + item}
                </p>
                <hr />
              </>
            );
          })}

          {data.map((item, i) => {
            return (
              <>
                <p key={i} className="fs-5">
                  {" "}
                  {i+1 + " " + item}
                </p>
                <hr />
              </>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
