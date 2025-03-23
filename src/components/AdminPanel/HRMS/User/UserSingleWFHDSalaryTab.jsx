import { useEffect, useState } from "react";

const UserSingleWFHDSalaryTab = ({ salaryData }) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState({});

  // Group data by user_name
  useEffect(() => {
    const grouped = salaryData?.reduce((acc, curr) => {
      if (!acc[curr.user_name]) {
        acc[curr.user_name] = [];
      }
      acc[curr.user_name].push(curr);
      return acc;
    }, {});

    setFilteredData(grouped);
  }, [salaryData]);

  // Handle search for employee name & month-year
  useEffect(() => {
    const filtered = salaryData?.reduce((acc, curr) => {
      const searchText = search.toLowerCase();
      const matches =
        curr.month.toLowerCase().includes(searchText) ||
        String(curr.year).includes(searchText); // Convert year to string

      if (matches) {
        if (!acc[curr.user_name]) {
          acc[curr.user_name] = [];
        }
        acc[curr.user_name].push(curr);
      }
      return acc;
    }, {});

    setFilteredData(filtered);
  }, [search, salaryData]);

  return (
    <div className="container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Month or Year"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Employee Cards */}
      {Object.keys(filteredData).map((userName) => {
        const userSalaryData = filteredData[userName];

        // Calculate totals for the summary card
        const totalPresentDays = userSalaryData.reduce(
          (sum, row) => sum + row.presentDays,
          0
        );
        const totalBonus = userSalaryData.reduce(
          (sum, row) => sum + Number(row.bonus),
          0
        );
        const totalTDS = userSalaryData.reduce(
          (sum, row) => sum + Number(row.tds_deduction),
          0
        );
        const totalToPay = userSalaryData.reduce(
          (sum, row) => sum + Number(row.toPay),
          0
        );

        return (
          <div key={userName} className="employee-card">
            {/* Employee Name */}
            <h3 className="employee-name">{userName}</h3>

            {/* Summary Card */}
            <div className="summary-card">
              <p>
                <strong>Total To Pay:</strong> {totalToPay} ₹
              </p>
              <p>
                <strong>Total Present Days:</strong> {totalPresentDays}
              </p>
              <p>
                <strong>Total Bonus:</strong> {totalBonus} ₹
              </p>
              <p>
                <strong>Total TDS:</strong> {totalTDS} ₹
              </p>
            </div>

            {/* Salary Records in Flexbox Row */}
            <div className="salary-details">
              {userSalaryData.map((row, index) => (
                <div key={index} className="salary-item">
                  <p>
                    <strong>Month:</strong> {row.month}
                  </p>
                  <p>
                    <strong>Year:</strong> {row.year}
                  </p>
                  <p>
                    <strong>Work Days:</strong> {row.presentDays}
                  </p>
                  <p>
                    <strong>Absents:</strong> {row.noOfabsent}
                  </p>
                  <p>
                    <strong>Total Payout:</strong> {row.total_salary} ₹
                  </p>
                  <p>
                    <strong>Bonus:</strong> {row.bonus} ₹
                  </p>
                  <p>
                    <strong>Net Payout:</strong> {row.net_salary?.toFixed()} ₹
                  </p>
                  <p>
                    <strong>TDS:</strong> {row.tds_deduction} ₹
                  </p>
                  <p>
                    <strong>To Pay:</strong> {row.toPay?.toFixed()} ₹
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Styles */}
      <style>{`
        .container {
          padding: 20px;
        }
        .search-bar {
          margin-bottom: 15px;
          text-align: center;
        }
        .search-input {
          width: 50%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .employee-card {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          padding: 15px;
          margin-bottom: 20px;
        }
        .employee-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .summary-card {
          background: #f1f1f1;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
        .salary-details {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .salary-item {
          padding: 10px;
          border-radius: 8px;
          width: calc(33.33% - 10px);
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default UserSingleWFHDSalaryTab;
