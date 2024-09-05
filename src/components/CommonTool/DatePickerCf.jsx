import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Box, TextField, Autocomplete, Stack } from '@mui/material';
import dayjs from 'dayjs';

const predefinedOptions = [
  'Today',
  'Yesterday',
  'This Week',
  'Previous Week',
  'This Month',
  'Last Month',
  'This Year',
  'Last Year',
  'Custom',
];

const getPresetDates = (option) => {
  const today = dayjs();
  switch (option) {
    case 'Today':
      return { startDate: today, endDate: today };
    case 'Yesterday':
      return { startDate: today.subtract(1, 'day'), endDate: today.subtract(1, 'day') };
    case 'This Week':
      return { startDate: today.startOf('week'), endDate: today.endOf('week') };
    case 'Previous Week':
      return { startDate: today.subtract(1, 'week').startOf('week'), endDate: today.subtract(1, 'week').endOf('week') };
    case 'This Month':
      return { startDate: today.startOf('month'), endDate: today.endOf('month') };
    case 'Last Month':
      return { startDate: today.subtract(1, 'month').startOf('month'), endDate: today.subtract(1, 'month').endOf('month') };
    case 'This Year':
      return { startDate: today.startOf('year'), endDate: today.endOf('year') };
    case 'Last Year':
      return { startDate: today.subtract(1, 'year').startOf('year'), endDate: today.subtract(1, 'year').endOf('year') };
    default:
      return { startDate: null, endDate: null };
  }
};

function DatePickerCf({ startDate, setStartDate, endDate, setEndDate, minSelectableDate }) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event, newValue) => {
    setSelectedOption(newValue);
    if (newValue !== 'Custom') {
      const { startDate, endDate } = getPresetDates(newValue);
      setStartDate(startDate);
      setEndDate(endDate);
    }
  };
  const startDateObj = dayjs(startDate);
  const endDateObj = dayjs(endDate);
  // console.log(startDate,endDate);
  return (
   

    <Stack  direction='row' spacing={2} sx={{justifyContent:'end',m:2}}>
      {/* <Autocomplete
      sx={{width:'20%'}}
        options={predefinedOptions}
        value={selectedOption}
        onChange={handleOptionChange}
        renderInput={(params) => <TextField {...params} label="Select-Date" />}
      />
      {selectedOption === 'Custom' && ( */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', alignItems: 'center',}}>
       
            <DatePicker
              label="Start Date"
              value={startDateObj}
              minDate={minSelectableDate}
              onChange={(newValue) => {
                setStartDate((newValue));
                if (newValue > endDate) {
                  setEndDate(null);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Box sx={{ mx: 2 }}> to </Box>
            <DatePicker
              label="End Date"
              value={endDateObj}
              minDate={startDateObj}
              onChange={(newValue) => setEndDate((newValue))}
              renderInput={(params) => <TextField {...params} />}
            />
         
          </Box>
        </LocalizationProvider>
      {/* )} */}
    </Stack>
    
  );
}

export default DatePickerCf;
