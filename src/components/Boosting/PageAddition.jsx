import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { useCreateItemMutation,  useGetCreatorNamesQuery } from '../Store/API/Boosting/BoostingApi';

const PageAddition = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [createItem, { isLoading, isError, isSuccess }] = useCreateItemMutation();
  // const { data: creatorNames, error, isLoading:loading } = useGetCreatorNamesQuery();

  const onSubmit = async (data) => {
    const payload = {
      creatorName: data.creatorName,
      reel_max_count: data.reelMax,
      reel_min_count: data.reelMin,
      post_max_count: data.postMax,
      post_min_count: data.postMin,
      share_max_count: data.shareMax,
      share_min_count: data.shareMin,
    };

    try {
      await createItem(payload).unwrap();
      alert('Page added successfully!');
      reset(); // Reset form after successful submission
    } catch (error) {
      console.error('Failed to create item:', error);
      alert('Error creating item. Please try again.');
    }
  };

  const { data, error,   } = useGetCreatorNamesQuery();

  console.log("Raw Data from API:", data);
  console.log("Error:", error);


  // const creators = ['John', 'Jane', 'Doe'];

  return (
    <div className="container mt-4">
      <h2>Page Addition</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Creator Name</label>
            {/* <Controller
              name="creatorName"
              control={control}
              rules={{ required: 'Creator Name is required' }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={creators}
                  onChange={(_, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Creator"
                      variant="outlined"
                      error={!!errors.creatorName}
                      helperText={errors.creatorName?.message}
                    />
                  )}
                />
              )}
            /> */}
          </div>
        </div>

        <div className="row mb-3">
          {['post', 'reel', 'share'].map((item) => (
            <React.Fragment key={item}>
              <div className="col-md-6">
                <label className="form-label">{item.charAt(0).toUpperCase() + item.slice(1)} Min Count</label>
                <input
                  type="text"
                  className="form-control"
                  {...register(`${item}Min`, {
                    required: `${item} Min Count is required`,
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numeric values are allowed',
                    },
                  })}
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                />
                {errors[`${item}Min`] && <p className="text-danger">{errors[`${item}Min`].message}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">{item.charAt(0).toUpperCase() + item.slice(1)} Max Count</label>
                <input
                  type="text"
                  className="form-control"
                  {...register(`${item}Max`, {
                    required: `${item} Max Count is required`,
                    pattern: {
                      value: /^[0-9]+$/,
                      message: 'Only numeric values are allowed',
                    },
                  })}
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                />
                {errors[`${item}Max`] && <p className="text-danger">{errors[`${item}Max`].message}</p>}
              </div>
            </React.Fragment>
          ))}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>

        {isSuccess && <p className="text-success mt-2">Page added successfully!</p>}
        {isError && <p className="text-danger mt-2">Error creating item. Please try again.</p>}
      </form>
    </div>
  );
};

export default PageAddition;
