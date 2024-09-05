import React, { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { Autocomplete, Button, TextField } from "@mui/material";
import { set } from "date-fns";
import {baseUrl} from '../../../utils/config'

const WFHAllSalary = () => {
  const [allSalaryData, setAllSalaryData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [masterDataList, setMasterDataList] = useState([]);
  const [deplartmentFilterValue, setDepartmentFilterValue] = useState();
  const [yearFilterValue, setYearFilterValue] = useState();
  const [monthFilterValue, setMonthFilterValue] = useState();

  const getData = async () => {
    const response = await axios.get(
      baseUrl+"get_all_attendance_data"
    );
    setAllSalaryData(response.data.data);
    setMasterDataList(response.data.data);
    setSavedData(response.data.data);

    axios
      .get(baseUrl+"get_all_departments")
      .then((res) => {
        setDepartmentList(res.data);
      });
  };
  const yearWiseFilterOptions = [
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
    { value: "2028", label: "2028" },
    { value: "2029", label: "2029" },
    { value: "2030", label: "2030" },
  ];

  const monthWiseFilterOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const lowerCaseSearch = search.toLowerCase();
    const searchYear = parseInt(search, 10); // Convert search string to a number for year comparison

    const result = savedData.filter((d) => {
      const matchesUserName = d.user_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDeptName = d.dept_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesDesiName = d.desi_name
        ?.toLowerCase()
        .includes(lowerCaseSearch);
      const matchesMonth = d.month?.toLowerCase().includes(lowerCaseSearch);
      const matchesYear = d.year === searchYear;

      return (
        matchesUserName ||
        matchesDeptName ||
        matchesDesiName ||
        matchesMonth ||
        (!isNaN(searchYear) && matchesYear)
      );
    });

    setAllSalaryData(result);
  }, [search, savedData]); // Dependencies

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.user_name,
    },
    {
      name: "Department",
      cell: (row) => row.dept_name,
    },
    {
      name: "Designation",
      cell: (row) => row.designation_name,
    },
    {
      name: "DOJ",
      cell: (row) => {
        const date = new Date(row.joining_date);
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yy = String(date.getFullYear()).slice(2);
        return `${dd}/${mm}/${yy}`;
      },
    },
    {
      name: "Work Days",
      cell: () => 30,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    { name: "Year", cell: (row) => row.year },
    {
      name: "Salary",
      cell: (row) => row.salary,
    },
    {
      name: "Absent Days",
      cell: (row) => row.noOfabsent,
    },
    {
      name: "Present Days",
      cell: (row) => 30 - Number(row.noOfabsent),
    },

    {
      name: "Total Salary",
      cell: (row) => row.total_salary + " ₹",
      footer: {
        cell: (row) =>
          row.reduce((total, rows) => {
            return total + Number(rows.total_salary);
          }, 0),
      },
    },
    {
      name: "Bonus",
      cell: (row) => row.bonus + " ₹",
      footer: {
        cell: (row) => {
          const totalBonus = row.reduce((total, rows) => {
            return total + Number(rows.bonus);
          }, 0);
          return <div>{totalBonus + " ₹"}</div>;
        },
      },
    },
    {
      name: "Deductions",
      cell: (row) => row.salary_deduction + " ₹",
    },
    {
      name: "Net Salary",
      cell: (row) => row.net_salary + " ₹",
    },
    {
      name: "TDS",
      cell: (row) => row.tds_deduction + " ₹",
    },
    {
      name: "To Pay",
      cell: (row) => row.toPay + " ₹",
    },
  ];

  const handleFilterClick = () => {
    if (!deplartmentFilterValue && !yearFilterValue && !monthFilterValue) {
      setAllSalaryData(savedData);
    } else if (
      deplartmentFilterValue &&
      !yearFilterValue &&
      !monthFilterValue
    ) {
      const result = savedData.filter((d) => {
        const matchesDeptName = d.dept_name

          ?.toLowerCase()
          .includes(deplartmentFilterValue.toLowerCase());
        return matchesDeptName;
      });
      setAllSalaryData(result);
    } else if (
      !deplartmentFilterValue &&
      yearFilterValue &&
      !monthFilterValue
    ) {
      const result = savedData.filter((d) => {
        const matchesYear = d.year == yearFilterValue.value;
        return matchesYear;
      });
      setAllSalaryData(result);
    } else if (
      !deplartmentFilterValue &&
      !yearFilterValue &&
      monthFilterValue
    ) {
      const result = savedData.filter((d) => {
        const matchesMonth = d.month
          ?.toLowerCase()
          .includes(monthFilterValue.value.toLowerCase());
        return matchesMonth;
      });
      setAllSalaryData(result);
    } else if (deplartmentFilterValue && yearFilterValue && !monthFilterValue) {
      const result = savedData.filter((d) => {
        const matchesDeptName = d.dept_name
          ?.toLowerCase()
          .includes(deplartmentFilterValue.toLowerCase());
        const matchesYear = d.year == yearFilterValue.value;
        return matchesDeptName && matchesYear;
      });
      setAllSalaryData(result);
    } else if (deplartmentFilterValue && !yearFilterValue && monthFilterValue) {
      const result = savedData.filter((d) => {
        const matchesDeptName = d.dept_name
          ?.toLowerCase()
          .includes(deplartmentFilterValue.toLowerCase());
        const matchesMonth = d.month
          ?.toLowerCase()
          .includes(monthFilterValue.value.toLowerCase());
        return matchesDeptName && matchesMonth;
      });
      setAllSalaryData(result);
    } else if (!deplartmentFilterValue && yearFilterValue && monthFilterValue) {
      const result = savedData.filter((d) => {
        const matchesMonth = d.month
          ?.toLowerCase()
          .includes(monthFilterValue.value.toLowerCase());
        const matchesYear = d.year == yearFilterValue.value;
        return matchesMonth && matchesYear;
      });
      setAllSalaryData(result);
    } else if (deplartmentFilterValue && yearFilterValue && monthFilterValue) {
      const result = savedData.filter((d) => {
        const matchesDeptName = d.dept_name
          ?.toLowerCase()
          .includes(deplartmentFilterValue.toLowerCase());
        const matchesMonth = d.month
          ?.toLowerCase()
          .includes(monthFilterValue.value.toLowerCase());
        const matchesYear = d.year == yearFilterValue.value;
        return matchesDeptName && matchesMonth && matchesYear;
      });
      setAllSalaryData(result);
    }
  };

  return (
    <>
      <div>
        <FormContainer mainTitle="Salary Overview History" link={"/admin/"} />
        <div className="row">
          <Autocomplete
            className="m-2"
            disablePortal
            id="combo-box-demo"
            value={deplartmentFilterValue}
            onChange={(e, value) => {
              // handleFilterChange(value, "Department");
              setDepartmentFilterValue(value);
            }}
            options={departmentList.map((option) => option.dept_name)}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Department" />
            )}
          />
          <Autocomplete
            className="m-2"
            disablePortal
            value={yearFilterValue}
            id="combo-box-demo"
            onChange={(e, value) => {
              // handleFilterChange(value, "Year");
              setYearFilterValue(value);
            }}
            options={yearWiseFilterOptions}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Year" />}
          />
          <Autocomplete
            className="m-2"
            disablePortal
            value={monthFilterValue}
            id="combo-box-demo"
            onChange={(e, value) => {
              // handleFilterChange(value, "Month");
              setMonthFilterValue(value);
            }}
            options={monthWiseFilterOptions}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Month" />}
          />

          <Button
            className="m-2 col-md-1"
            variant="contained"
            onClick={handleFilterClick}
          >
            Search
          </Button>
        </div>
        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title=" "
              columns={columns}
              data={allSalaryData}
              fixedHeader
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search Here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WFHAllSalary;
