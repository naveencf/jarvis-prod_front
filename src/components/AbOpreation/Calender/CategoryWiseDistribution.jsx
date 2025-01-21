import React from 'react'
import { Button, TextField, Autocomplete } from "@mui/material";
import formatString from '../../../utils/formatString';

const CategoryWiseDistribution = ({PlanX,groupedData,handleSelectPlan,handleCategoryClick}) => {
  return (
   <>
     <div className="form-group w-25">
        <label className="form-label">All Plan</label>
        <Autocomplete
          options={PlanX || []}
          getOptionLabel={(option) => formatString(option.plan_name)}
          onChange={(event, value) =>
            handleSelectPlan(value ? value._id : null)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select plan"
              variant="outlined"
            />
          )}
          isOptionEqualToValue={(option, value) => option._id === value?._id}
        />
      </div>
      <div className="d-flex">
        {groupedData &&
          Object.entries(groupedData).map(([category, { count, items }]) => (
            <Button
              variant="contained"
              className="btn btn-primary btn-sm ml-2"
              key={category}
              style={{ marginBottom: "1rem" }}
              onClick={() => handleCategoryClick(category, items)}
            >
              <h5>
                {category} ({count})
              </h5>
            </Button>
          ))}
      </div>
   </>
  )
}

export default CategoryWiseDistribution