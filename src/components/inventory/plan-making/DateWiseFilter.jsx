import { useGetPlanxlogDateWiseQuery } from "../../Store/PageBaseURL";
import { useEffect, useState } from "react";

const DateWiseFilter = ({ planRows, setFilteredPlanRows }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const { data, error, isLoading } = useGetPlanxlogDateWiseQuery({
    month_year: selectedMonth,
    status: selectedStatus,
  },);

  const summaryData = data?.data?.summaryData || [];
  const monthData = data?.data?.monthData || [];

  const toggleSubmenu = (month) => {
    setSelectedMonth(month);
    setSubmenuOpen((prev) => (prev && selectedMonth === month ? false : true));
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };
console.log("summaryData",);
  useEffect(()=>{
    if(monthData?.length){
      const formattedRows = monthData
      ?.filter((plan) => plan.plan_status !== "pricing")
      ?.map((plan) => ({
        sales_executive_name: plan.sales_executive_name,
        brief: plan.brief,
        plan_status: plan.plan_status,
        created_by_name: plan.created_by_name,
        id: plan._id,
        platformCount: plan.no_of_pages,
        planName: plan.plan_name,
        costPrice: plan.cost_price,
        sellingPrice: plan.selling_price,
        pages: plan.no_of_pages,
        postCount: plan.post_count,
        storyCount: plan.story_count,
        description: plan.description,
        account_id: plan.account_id,
        sales_executive_id: plan.sales_executive_id,
        account_name: plan.account_name,
        createdAt: plan.createdAt,
        not_available_pages: plan.not_available_pages,
        brand_id: plan.brand_id,
        planx_log_file: plan.planx_log_file,
        own_pages_cost_price: plan.own_pages_cost_price,
        sales_executive_created: plan.sales_executive_created,
      }));
  
    setFilteredPlanRows(formattedRows);
    }
 
  },[summaryData])

  return (
    <div className="plan-data-container">
      <h2 className="title">Plan Data - Monthly Filter</h2>
      <div className="months-container">
        {summaryData.map(({ monthYear, total, open, close, draft }) => (
          <div key={monthYear}>
            <button
              onClick={() => toggleSubmenu(monthYear)}
              className={`month-button ${
                selectedMonth === monthYear ? "selected" : ""
              }`}
            >
              {monthYear} ({total})
            </button>
            {selectedMonth === monthYear && submenuOpen && (
              <div className="submenu-buttons">
                <button
                  onClick={() => handleStatusClick("open")}
                  className={`status-button open ${
                    selectedStatus === "open" ? "selected" : ""
                  }`}
                >
                  Open {open}
                </button>
                <button
                  onClick={() => handleStatusClick("draft")}
                  className={`status-button draft ${
                    selectedStatus === "draft" ? "selected" : ""
                  }`}
                >
                  Draft {draft}
                </button>
                <button
                  onClick={() => handleStatusClick("close")}
                  className={`status-button close-btn-planx ${
                    selectedStatus === "close" ? "selected" : ""
                  }`}
                >
                  Close {close}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="status-container">
        <button
          onClick={() => {
            setSelectedMonth("");
            setSelectedStatus("");
            setFilteredPlanRows(planRows);
          }}
          className="reset-button"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DateWiseFilter;
