import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './DateWiseFilter.css';

const HighestPlanRequest = ({ planRows }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Filter plans within selected date range
  const filteredPlans = planRows?.filter((plan) => {
    const planDate = new Date(plan.createdAt);
    return (!startDate || planDate >= startDate.toDate()) && (!endDate || planDate <= endDate.toDate());
  });

  // Count plans per sales executive
  const salesExecCounts = filteredPlans?.reduce(
    (acc, plan) => {
      const salesExecName = plan.sales_executive_name || 'Unknown';
      acc.salesExec[salesExecName] = (acc.salesExec[salesExecName] || 0) + 1;
      return acc;
    },
    { salesExec: {} }
  );

  // Count plans per creator (created_by_name)
  const createdByCounts = filteredPlans?.reduce(
    (acc, plan) => {
      const createdByName = plan.created_by_name || 'Unknown';
      acc.createdBy[createdByName] = (acc.createdBy[createdByName] || 0) + 1;
      return acc;
    },
    { createdBy: {} }
  );

  return (
    <div className="highest-plan-container">
      <h2 className="highest-plan-title">Plan Request</h2>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="date-picker-container mb-3">
          <div className='mb-4'>
            <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
          </div>

          <DatePicker label="End Date" value={endDate} onChange={setEndDate} minDate={startDate} />
        </div>
      </LocalizationProvider>

      {/* Display Sales Executive counts */}
      <h3>Plans by Sales Executive</h3>
      <div className="highest-plan-list mb-5">
        {Object.entries(salesExecCounts.salesExec).map(([name, count]) => (
          <div key={name} className="highest-plan-card">
            <h4 className="highest-plan-name">{name}</h4>
            <p className="highest-plan-count">Plans: {count}</p>
          </div>
        ))}
      </div>

      {/* Display Creator counts */}
      <h3>Plans by Creator (Created By)</h3>
      <div className="highest-plan-list">
        {Object.entries(createdByCounts.createdBy).map(([name, count]) => (
          <div key={name} className="highest-plan-card">
            <h4 className="highest-plan-name">{name}</h4>
            <p className="highest-plan-count">Plans: {count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HighestPlanRequest;
