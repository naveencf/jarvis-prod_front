import { Stack, Autocomplete, TextField } from '@mui/material'
import React from 'react'
import { useGetPageByVendorIdQuery } from '../../Store/PageBaseURL';
import formatString from '../../../utils/formatString';

function VendorAdavanceRequest({ formData, setFormData, vendorId }) {
    const {
        data: vendorPages,
        isLoading: vendorPageLoading,
        isFetching,
        isSuccess,
    } = useGetPageByVendorIdQuery(vendorId);

    // const handleAdvanceChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: name === "at_price" || name === "no_of_post" ? Number(value) : value,
    //     }));
    // };

    const handleAdvanceChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => {
            const updatedValue = name === "at_price" || name === "no_of_post" ? Number(value) : value;
            let newFormData = {
                ...prevData,
                [name]: updatedValue,
            };

            if (name === "at_price" && updatedValue > 0 && prevData.base_amount) {
                newFormData.no_of_post = Math.floor(prevData.base_amount / updatedValue);
            } else if (name === "no_of_post" && updatedValue > 0 && prevData.base_amount) {
                newFormData.at_price = Math.floor(prevData.base_amount / updatedValue);
            }

            return newFormData;
        });
    };


    const handlePageChange = (_, newValue) => {
        // console.log(newValue, "newValue")
        setFormData((prevData) => ({
            ...prevData,
            page_name: newValue ? newValue.page_name : "",
            page_id: newValue ? newValue._id : null,
        }));
    };

    return (
        <>
            <Stack direction="row" spacing={2}>
                {/* Page Name */}
                {vendorPages && vendorPages.length > 0 && (
                    <Autocomplete
                        fullWidth
                        id="page-autocomplete"
                        options={vendorPages}
                        getOptionLabel={(option) => formatString(option?.page_name) || ""}
                        getOptionKey={(option) => option._id} // Ensure unique keys
                        onChange={handlePageChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Page Name"
                                placeholder="Select Page"
                            />
                        )}
                    />
                )}
                {/* <TextField
                    label="Advance Name"
                    name="advance_name"
                    value={formData?.advance_name || ""}
                    onChange={handleAdvanceChange}
                    fullWidth
                /> */}
                <TextField
                    label="At Price"
                    name="at_price"
                    type="number"
                    value={formData?.at_price || ""}
                    onChange={handleAdvanceChange}
                    fullWidth
                    onWheel={(e) => e.target.blur()}  // 👈 Prevent scroll change
                />
                <TextField
                    label="No of Posts"
                    name="no_of_post"
                    type="number"
                    value={formData?.no_of_post || ""}
                    onChange={handleAdvanceChange}
                    fullWidth
                    onWheel={(e) => e.target.blur()}  // 👈 Prevent scroll change
                />
            </Stack>
        </>
    );
}

export default VendorAdavanceRequest;
