import React, { useEffect, useState } from "react";
import axios from "axios";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import Select from "react-select";
import Modal from "react-modal";
import { baseUrl } from "../../../../utils/config";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";

const SalarySummary = () => {
  const [allSalaryData, setAllSalaryData] = useState([]);
  const [savedData, setSavedData] = useState([]);
  const [search, setSearch] = useState("");

  const [userCount, setUserCount] = useState([]);
  const [handleOpenUser, setHandleOpenUser] = useState(false);
  const [month, setMonth] = useState("");

  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState([]);
  const [totalSalaryDepartmentWise,setTotalSalaryDepartmentWise] = useState("")
  const [dynamicFilter, setDynamicFilter] = useState("");

  const [OpenBonus , setHandleOpenBonus] = useState(false)
  const [bonusData , setBonusData] = useState([])
  const handleOpenBonus = () =>{
    setHandleOpenBonus(true)
  }
  const handleCloseBonus = () =>{
    setHandleOpenBonus(false)
  }

  const bonusDatas = () =>{
     axios.get(baseUrl+`get_all_wfhd_users_with_bonus`).then((res)=>{
      setBonusData(res.data.data)
       console.log(res.data.data)
     })
    
  }
  useEffect(()=>{
  bonusDatas()
  },[])
  const MonthData = [
    { label: "All", value: "" },
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];

  const FilterDynamic = [
    // { label: "Today", value: "today" },
    // { label: "This Week", value: "this_week" },
    { label: "All", value: "" },
    { label: "This Month", value: "this_month" },
    { label: "This Quater", value: "this_quater" },
    { label: "This Year", value: "this_year" },
    { label: "Previous Month", value: "previous_month" },
    { label: "Previous Year", value: "previous_year" },
  ];

  const handleOpenSubCat = () => {
    setHandleOpenUser(true);
  };
  const handleCloseSubCat = () => {
    setHandleOpenUser(false);
  };

  
  

  const departmentAPI = () => {
    axios.get(baseUrl + "get_wfh_users_with_dept").then((res) => {
      setDepartmentData(res.data.data);
      getData();
    });
  };

  useEffect(() => {
    const result = savedData.filter((d) => {
      const deptMatch = !departmentFilter || d.dept_id === departmentFilter;
      const monthMatch = !month || d.month === month;
      return deptMatch && monthMatch;
    });
    const sumMonth = result?.reduce(
      (acc, obj) => acc + obj.totalSalary,
      0
    );
    setAllSalaryData(result);
    setTotalSalaryDepartmentWise(sumMonth);
  }, [departmentFilter, month ]);

  useEffect(() => {
    departmentAPI();
  }, []);

  const handleUserModal = async (row) => {
    try {
      const response = await axios.post(
        `${baseUrl}` + `get_users_count_by_dept`,
        {
          dept_id: row.dept_id,
          month: row.month,
          year: row.year,
        }
      );
      setUserCount(response.data.data);
      handleOpenSubCat();
    } catch (error) {
      console.log(error, "sub cat api not working");
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        baseUrl + "get_salary_calculation_with_filter_data",
        {
          params: {
            filterOption: dynamicFilter,
          },
        }
      );
      setSavedData(response.data.data);
      setAllSalaryData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [dynamicFilter]);

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
      name: "Department Name",
      cell: (row) => row.dept_name,
    },
    {
      name: "Month",
      cell: (row) => row.month,
    },
    {
      name: "User Count",
      cell: (row) => (
        <button
          style={{ width: "60px" }}
          className="btn btn-outline-warning"
          onClick={() => handleUserModal(row)}
        >
          {row.totalUsers}
        </button>
      ),
      sortable: true,
    },

    {
      name: "Salary",
      cell: (row) => row.salary + " ₹",
    },
    {
      name: "Total Salary",
      cell: (row) => row.totalSalary + " ₹",
    },
    {
      name: "Bonus",
      cell: (row) => row.totalBonus + " ₹",
    },

  ];

  const SubCatColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = userCount.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "user_name",
      headerName: "User Name",
      width: 200,
    },
    {
      field: "salary",
      headerName: "Salary",
      width: 150,
    },
    {
      field: "total_salary",
      headerName: "Total Salary",
      width: 150,
    },
    {
      field: "bonus",
      headerName: "Bonus",
      width: 150,
    },
    {
      field: "salary_deduction",
      headerName: "Salary Deduction",
      width: 150,
    },
    {
      field: "toPay",
      headerName: "To Pay",
      width: 150,
    },
  ];


  const BonusColumns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = bonusData.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },  
    {
      field: "user_name",
      headerName: "User Name",
      width: 180,
    },
    {
      field: "dept_name",
      headerName: "Department Name",
      width: 190,
    },
    {
      field: "month",
      headerName: "Month",
      width: 150,
    },
    {
      field: "salary",
      headerName: "Salary",
      width: 150,
    },
    {
      field: "bonus",
      headerName: "Bonus",
      width: 150,
    },
    {
      field: "totalSalary",
      headerName: "Total Salary",
      width: 150,
    },
      {
        field: "toPay",
        headerName: "To Pay",
        width: 150,
      },
  ]
  return (
    <>
      <div className="row">
        <div className="form-group col-3">
          <label className="form-label">
            Department Name
          </label>
          <Select
            options={[
              { value: "", label: "All" },
              ...departmentData.map((option) => ({
                value: option.dept_id,
                label: option.dept_name,
              })),
            ]}
            value={
              departmentFilter === ""
                ? { value: "", label: "All" }
                : {
                    value: departmentFilter,
                    label:
                      departmentData?.find(
                        (dept) => dept.dept_id === departmentFilter
                      )?.dept_name || "All",
                  }
            }
            onChange={(selectedOption) => {
              const selectedValue = selectedOption ? selectedOption.value : "";
              setDepartmentFilter(selectedValue);
              if (selectedValue === "") {
                getData();
              }
            }}
            required
          />
        </div>
        <div className={`form-group col-3`}>
          <label className="form-label">Monthly Filter</label>
          <Select
            options={MonthData}
            value={FilterDynamic.find((option) => option.value === month)}
            onChange={(selectedOption) => {
              if (selectedOption.value === "") {
                getData(); // Call getData function
              } else {
                setMonth(selectedOption.value); // Update state
              } 
            }}
          />
        </div>

        <div className={`form-group col-3`}>
          <label className="form-label">Filter</label>
          <Select
            options={FilterDynamic}
            value={FilterDynamic.find(
              (option) => option.value === dynamicFilter
            )}
            onChange={(selectedOption) => {
              if (selectedOption.value === "") {
                setDynamicFilter("");
              } else {
                setDynamicFilter(selectedOption.value);
              }
            }}
          />
        </div>
        <div className="col-2 mt-4">
        <button className="btn btn-primary" onClick={handleOpenBonus}>Bonus Users List</button>
        </div>
        
      </div>
      
      <div className="master-card-css">
        <FormContainer mainTitle="Salary Summary" link={"/admin/"} />
        <div className="card">
          <div className="card-header sb">
            {/* <h5>Total Salary Summary</h5> */}
            <h5 style={{color:'green'}}>Total Deparmtent Wise Salary:- {totalSalaryDepartmentWise}</h5>
            <input
              type="text"
              placeholder="Search Here"
              className="w-50 form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="data_tbl table-responsive card-body body-padding">
            <DataTable
              columns={columns}
              data={allSalaryData}
              // fixedHeader
              // fixedHeaderScrollHeight="64vh"
              highlightOnHover
              pagination
            />
          </div>
        </div>
        <Modal
          isOpen={handleOpenUser}
          onRequestClose={handleCloseSubCat}
          contentLabel="Example Modal"
          appElement={document.getElementById("root")}
          style={{
            content: {
              width: "60%",
              height: "80%",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
             
            },
          }}
        >
          <button
            className="btn btn-danger mb-3 float-right"
            onClick={handleCloseSubCat}
          >
            x
          </button>
          <DataGrid
          rows={userCount}
          columns={SubCatColumns}
          getRowId={(row)=>row?.user_id}
          slots={{
            toolbar: GridToolbar
          }}
          />
        </Modal>


        {/* bonus user list  */}
        <Modal
          isOpen={OpenBonus}
          onRequestClose={handleCloseBonus}
          contentLabel="Example Modal"
          appElement={document.getElementById("root")}
          style={{
            content: {
              width: "60%",
              height: "80%",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
             
            },
          }}
        >
          <button
            className="btn btn-danger mb-3 float-right"
            onClick={handleCloseBonus}
          >
            x
          </button>
          <DataGrid
          rows={bonusData}
          columns={BonusColumns}
          getRowId={(row)=>row?.user_id}
          slots={{
            toolbar: GridToolbar
          }}
          />
        </Modal>
      </div>
    </>
  );
};

export default SalarySummary;
