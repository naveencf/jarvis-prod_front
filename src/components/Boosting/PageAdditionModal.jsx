import React, { useEffect, useState } from "react";
import { Modal, Box, Button, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete } from "@mui/material";
import {
  useCreateItemMutation,
  useEditBoostingCreatorMutation,
  useGetCreatorNamesQuery,
} from "../Store/API/Boosting/BoostingApi";
import { useGetAllPageListQuery } from "../Store/PageBaseURL";
import jwtDecode from "jwt-decode";
import { Spinner } from "@phosphor-icons/react";

const PageAdditionModal = ({ open, handleClose, selectedPage, refetch }) => {
  const [pagequery, setPageQuery] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  // const { data: creatorNames, isLoading } = useGetCreatorNamesQuery();
  const [editBoostingCreator, { isSuccess, isError }] =
    useEditBoostingCreatorMutation();
  const [createItem, { isLoading: isSubmitting }] = useCreateItemMutation();
  const {
    data: pageList,
    isLoading: isPageListLoading,
    isFetching: isPageListFetching,
  } = useGetAllPageListQuery({ decodedToken, userID, pagequery });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (selectedPage) {
      reset({
        creatorName: selectedPage.creatorName,
        postMin: selectedPage.post_min_count,
        postMax: selectedPage.post_max_count,
        reelMin: selectedPage.reel_min_count,
        reelMax: selectedPage.reel_max_count,
        shareMin: selectedPage.share_min_count,
        shareMax: selectedPage.share_max_count,
      });
    } else {
      reset({});
    }
  }, [selectedPage, reset, open]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        setPageQuery(`page_name=${searchTerm}`);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, setPageQuery]);

  const handleInputChange = (_, newInputValue) => {
    setSearchTerm(newInputValue.trim()); // Ensure no trailing spaces
    if (newInputValue === "") {
      setPageQuery(""); // Reset the filter to show all data
    }
  };

  console.log("pageQuery", pagequery);
  const onSubmit = async (data) => {
    const payload = {
      creatorName: data.creatorName,
      reel_max_count: Number(data.reelMax),
      reel_min_count: Number(data.reelMin),
      post_max_count: Number(data.postMax),
      post_min_count: Number(data.postMin),
      share_max_count: Number(data.shareMax),
      share_min_count: Number(data.shareMin),
    };
    console.log("payload", payload);
    try {
      if (selectedPage) {
        await editBoostingCreator({
          id: selectedPage._id,
          updatedData: payload,
        });
        alert("Page updated successfully!");
        refetch();
      } else {
        await createItem(payload);
        alert("Page saved successfully!");
        refetch();
      }
      reset();
      handleClose();
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("Error saving item. Please try again.");
    }
  };
  // Transform API response to match Autocomplete options
  const creatorNames =
    pageList
      ?.filter((d) => d.platform_name == "instagram")
      .map((page) => ({
        creatorName: page.page_name,
        id: page._id, // Optional: Can be used internally
      })) || [];
  console.log(creatorNames, "crators name");

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          width: 700,
          margin: "auto",
          mt: 5,
          borderRadius: 2,
        }}
      >
        <h2>{selectedPage ? "Edit Page" : "Add New Page"}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">Creator Name</label>
              <Controller
                name="creatorName"
                control={control}
                rules={{ required: "Creator Name is required" }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={creatorNames}
                    loading={isPageListFetching}
                    disabled={selectedPage}
                    getOptionLabel={(option) => option?.creatorName || ""}
                    value={
                      creatorNames.find(
                        (option) => option.creatorName === field.value
                      ) || null
                    }
                    onChange={(_, value) =>
                      field.onChange(value ? value.creatorName : "")
                    }
                    onInputChange={handleInputChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Page"
                        variant="outlined"
                        fullWidth
                        error={!!errors.creatorName}
                        helperText={errors.creatorName?.message}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isPageListFetching ? <Spinner /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              />
            </div>
          </div>
          <div className="row mb-3">
            {["post", "reel", "share"].map((item) => (
              <React.Fragment key={item}>
                <div className="col-md-6">
                  <label className="form-label">
                    {item.charAt(0).toUpperCase() + item.slice(1)} Min Likes
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register(`${item}Min`, {
                      required: `${item} Min Count is required`,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numeric values are allowed",
                      },
                    })}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                  />
                  {errors[`${item}Min`] && (
                    <p className="text-danger">
                      {errors[`${item}Min`].message}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    {item.charAt(0).toUpperCase() + item.slice(1)} Max Likes
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register(`${item}Max`, {
                      required: `${item} Max Count is required`,
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Only numeric values are allowed",
                      },
                    })}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D/g, ""))
                    }
                  />
                  {errors[`${item}Max`] && (
                    <p className="text-danger">
                      {errors[`${item}Max`].message}
                    </p>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="d-flex justify-content-between">
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : selectedPage
                ? "Update"
                : "Submit"}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default PageAdditionModal;
