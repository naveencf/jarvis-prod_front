import  { useState, useMemo, } from 'react';
import './DateWiseFilter.css';

const DateWiseFilter = ({ planRows, setFilteredPlanRows }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const months = useMemo(() => {
    const monthMap = new Map();
    const openCountMap = new Map();
    const closeCountMap = new Map();
    const draftCountMap = new Map();

    planRows.forEach(({ createdAt, plan_status }) => {
      if (createdAt) {
        const date = new Date(createdAt);
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });

        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);

        if (plan_status === 'open') {
          openCountMap.set(monthKey, (openCountMap.get(monthKey) || 0) + 1);
        } else if (plan_status === 'close') {
          closeCountMap.set(monthKey, (closeCountMap.get(monthKey) || 0) + 1);
        } else if (plan_status === 'draft') {
          draftCountMap.set(monthKey, (draftCountMap.get(monthKey) || 0) + 1);
        }
      }
    });

    return Array.from(monthMap.entries()).map(([month, count]) => ({
      month,
      count,
      openCount: openCountMap.get(month) || 0,
      closeCount: closeCountMap.get(month) || 0,
      draftCount: draftCountMap.get(month) || 0,
    }));
  }, [planRows]);

  const globalCounts = useMemo(() => {
    return planRows?.reduce(
      (acc, { plan_status }) => {
        if (plan_status === 'open') acc.open += 1;
        else if (plan_status === 'close') acc.close += 1;
        else if (plan_status === 'draft') acc.draft += 1;
        return acc;
      },
      { open: 0, close: 0, draft: 0 }
    );
  }, [planRows]);

  const toggleSubmenu = (month) => {
    setSelectedMonth(month);
    setSubmenuOpen((prev) => (prev && selectedMonth === month ? false : true)); // Toggle submenu on month click
  };

  const handleOpenClick = () => {
    setSelectedStatus('open');
    setFilteredPlanRows(
      planRows.filter(({ createdAt, plan_status }) => {
        if (!createdAt) return false;
        const date = new Date(createdAt);
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        return (!selectedMonth || monthKey === selectedMonth) && plan_status === 'open';
      })
    );
  };
  const handleDraftClick = () => {
    setSelectedStatus('draft');
    setFilteredPlanRows(
      planRows.filter(({ createdAt, plan_status }) => {
        if (!createdAt) return false;
        const date = new Date(createdAt);
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        return (!selectedMonth || monthKey === selectedMonth) && plan_status === 'draft';
      })
    );
  };

  const handleCloseClick = () => {
    setSelectedStatus('close');
    setFilteredPlanRows(
      planRows.filter(({ createdAt, plan_status }) => {
        if (!createdAt) return false;
        const date = new Date(createdAt);
        const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        return (!selectedMonth || monthKey === selectedMonth) && plan_status === 'close';
      })
    );
  };

  return (
    <div className="plan-data-container">
      <h2 className="title">Plan Data - Monthly Filter</h2>
      <div className="months-container">
        {months.map(({ month, count, openCount, closeCount, draftCount }) => (
          <div key={month}>
            <button onClick={() => toggleSubmenu(month)} className={`month-button ${selectedMonth === month ? 'selected' : ''}`}>
              {month} ({count})
            </button>
            {selectedMonth === month && submenuOpen && (
              <div className="submenu-buttons">
                <button onClick={() => handleOpenClick()} className={`status-button open ${selectedStatus === 'open' ? 'selected' : ''}`}>
                  Open {openCount}
                </button>
                <button onClick={() => handleDraftClick()} className={`status-button open ${selectedStatus === 'open' ? 'selected' : ''}`}>
                  Draft {draftCount}
                </button>
                <button onClick={() => handleCloseClick()} className={`status-button close-btn-planx ${selectedStatus === 'close' ? 'selected' : ''}`}>
                  Close {closeCount}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="status-container">
        <button
          onClick={() => {
            setSelectedMonth(null);
            setSelectedStatus(null);
            setFilteredPlanRows(planRows);
          }}
          className="reset-button"
        >
          Reset
        </button>
      </div>
      <div>
      <button className={`status-button open ${selectedStatus === 'open' ? 'selected' : ''}`}>
          Open ({globalCounts.open})
        </button>
        <button className={`status-button ml-2 close-btn-planx ${selectedStatus === 'close' ? 'selected' : ''}`}>
          Close ({globalCounts.close})
        </button>
        <button className={`status-button ml-2 draft ${selectedStatus === 'draft' ? 'selected' : ''}`}>
          Draft ({globalCounts.draft})
        </button>
      </div>
    </div>
  );
};

export default DateWiseFilter;
