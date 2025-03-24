import React, { useState } from 'react';
import { Modal, Box, Button, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete } from '@mui/material';
import { useCreateItemMutation, useGetCreatorNamesQuery } from '../Store/API/Boosting/BoostingApi';

const PageAdditionModal = ({ open, handleClose }) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [createItem, { isLoading, isError, isSuccess }] = useCreateItemMutation();
  const { data: creatorNames } = useGetCreatorNamesQuery();

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

    try {
      await createItem(payload).unwrap();
      alert('Page added successfully!');
      reset();
      handleClose();
    } catch (error) {
      console.error('Failed to create item:', error);
      alert('Error creating item. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', width: 700, margin: 'auto', mt: 5, borderRadius: 2 }}>
        <h2>Add New Page</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-3">
            <div className="col-md-12">
              <label className="form-label">Creator Name</label>
              <Controller
                name="creatorName"
                control={control}
                rules={{ required: 'Creator Name is required' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={creatorNames || []}
                    getOptionLabel={(option) => option?.creatorName || ""}
                    value={creatorNames?.find((option) => option.creatorName === field.value) || null}
                    onChange={(_, value) => field.onChange(value ? value.creatorName : "")}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Creator" variant="outlined" fullWidth error={!!errors.creatorName} helperText={errors.creatorName?.message} />
                    )}
                  />
                )}
              />
            </div>
          </div>
          <div className="row mb-3">
            {['post', 'reel', 'share'].map((item) => (
              <React.Fragment key={item}>
                <div className="col-md-6">
                  <label className="form-label">{item.charAt(0).toUpperCase() + item.slice(1)} Min Count</label>
                  <input type="text" className="form-control" {...register(`${item}Min`, { required: `${item} Min Count is required`, pattern: { value: /^[0-9]+$/, message: 'Only numeric values are allowed' } })} onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))} />
                  {errors[`${item}Min`] && <p className="text-danger">{errors[`${item}Min`].message}</p>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">{item.charAt(0).toUpperCase() + item.slice(1)} Max Count</label>
                  <input type="text" className="form-control" {...register(`${item}Max`, { required: `${item} Max Count is required`, pattern: { value: /^[0-9]+$/, message: 'Only numeric values are allowed' } })} onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))} />
                  {errors[`${item}Max`] && <p className="text-danger">{errors[`${item}Max`].message}</p>}
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="d-flex justify-content-between">
            <Button onClick={handleClose} variant="outlined" color="secondary">Close</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit'}</Button>
          </div>
          {isSuccess && <p className="text-success mt-2">Page added successfully!</p>}
          {isError && <p className="text-danger mt-2">Error creating item. Please try again.</p>}
        </form>
      </Box>
    </Modal>
  );
};

export default PageAdditionModal;
