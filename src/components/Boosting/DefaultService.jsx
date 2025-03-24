import React from 'react';
import { useForm } from 'react-hook-form';
import { useCreateInstaBoostingDefaultServiceMutation } from '../Store/API/Boosting/BoostingApi';

const DefaultService = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [createService, { isLoading, isError, isSuccess }] = useCreateInstaBoostingDefaultServiceMutation();

  const handleNumberInput = (e, fieldName) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setValue(fieldName, value, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const payload = {
      like_service_id: data.likeServiceId,
      view_service_id: data.viewServiceId,
      share_service_id: data.shareServiceId,
      boosting_vendor_name: data.boostingVendorName,
      like_price: Number(data.likePrice),
      view_price: Number(data.viewPrice),
      share_price: Number(data.sharePrice),
    };

    try {
      await createService(payload).unwrap();
      alert('Service added successfully!');
      reset();
    } catch (error) {
      console.error('Failed to create service:', error);
      alert('Error creating service. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Insta Boosting Default Service</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {[
            { name: 'likeServiceId', label: 'Like Service ID' },
            { name: 'viewServiceId', label: 'View Service ID' },
            { name: 'shareServiceId', label: 'Share Service ID' },
            { name: 'boostingVendorName', label: 'Boosting Vendor Name' },
            { name: 'likePrice', label: 'Like Price' },
            { name: 'viewPrice', label: 'View Price' },
            { name: 'sharePrice', label: 'Share Price' },
          ].map((field) => (
            <div className="col-md-6 mb-3" key={field.name}>
              <label className="form-label">{field.label}</label>
              <input
                type="text"
                className="form-control"
                {...register(field.name, { required: `${field.label} is required` })}
                onChange={(e) => {
                  if (['likeServiceId','viewServiceId','shareServiceId','boostingVendorName','likePrice', 'viewPrice', 'sharePrice'].includes(field.name)) {
                    handleNumberInput(e, field.name);
                  } else {
                    setValue(field.name, e.target.value, { shouldValidate: true });
                  }
                }}
              />
              {errors[field.name] && <p className="text-danger">{errors[field.name].message}</p>}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>

        {isSuccess && <p className="text-success mt-2">Service added successfully!</p>}
        {isError && <p className="text-danger mt-2">Error creating service. Please try again.</p>}
      </form>
    </div>
  );
};

export default DefaultService;