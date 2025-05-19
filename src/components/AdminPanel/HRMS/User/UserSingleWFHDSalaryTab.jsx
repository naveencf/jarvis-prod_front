import { useEffect, useState } from "react";

const UserSingleWFHDSalaryTab = ({ salaryData }) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState({});

  // Group data by user_name initially
  useEffect(() => {
    if (!Array.isArray(salaryData)) {
      setFilteredData({});
      return;
    }

    const grouped = salaryData.reduce((acc, curr) => {
      if (!curr?.user_name) return acc;
      if (!acc[curr.user_name]) {
        acc[curr.user_name] = [];
      }
      acc[curr.user_name].push(curr);
      return acc;
    }, {});

    setFilteredData(grouped);
  }, [salaryData]);

  // Filter based on search input
  useEffect(() => {
    if (!Array.isArray(salaryData)) {
      setFilteredData({});
      return;
    }

    const searchText = search.toLowerCase();

    const filtered = salaryData.reduce((acc, curr) => {
      const monthMatch = curr?.month?.toLowerCase()?.includes(searchText);
      const yearMatch = String(curr?.year || "").includes(searchText);

      if ((monthMatch || yearMatch) && curr?.user_name) {
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
      {/* Search Input */}
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
      {Object?.keys(filteredData || {})?.map((userName) => {
        const userSalaryData = filteredData?.[userName] || [];

        // Safe reduce with fallback to 0
        const totalPresentDays = userSalaryData.reduce(
          (sum, row) => sum + (row?.presentDays || 0),
          0
        );
        const totalBonus = userSalaryData.reduce(
          (sum, row) => sum + Number(row?.bonus || 0),
          0
        );
        const totalTDS = userSalaryData.reduce(
          (sum, row) => sum + Number(row?.tds_deduction || 0),
          0
        );
        const totalToPay = userSalaryData.reduce(
          (sum, row) => sum + Number(row?.toPay || 0),
          0
        );

        return (
          <div key={userName} className="employee-card">
            <h3 className="employee-name">{userName}</h3>

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

            <div className="salary-details">
              {userSalaryData.map((row, index) => (
                <div key={index} className="salary-item">
                  <p>
                    <strong>Month:</strong> {row?.month || "-"}
                  </p>
                  <p>
                    <strong>Year:</strong> {row?.year || "-"}
                  </p>
                  <p>
                    <strong>Work Days:</strong> {row?.presentDays || 0}
                  </p>
                  <p>
                    <strong>Absents:</strong> {row?.noOfabsent || 0}
                  </p>
                  <p>
                    <strong>Total Payout:</strong> {row?.total_salary || 0} ₹
                  </p>
                  <p>
                    <strong>Bonus:</strong> {row?.bonus || 0} ₹
                  </p>
                  <p>
                    <strong>Net Payout:</strong>{" "}
                    {row?.net_salary?.toFixed?.() || 0} ₹
                  </p>
                  <p>
                    <strong>TDS:</strong> {row?.tds_deduction || 0} ₹
                  </p>
                  <p>
                    <strong>To Pay:</strong> {row?.toPay?.toFixed?.() || 0} ₹
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
