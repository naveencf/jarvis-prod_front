import React, { useEffect, useState } from "react";
import FormContainer from "../FormContainer";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import FieldContainer from "../FieldContainer";
import Select from "react-select";

export default function TotalNDG() {
  const [NDSData, setNDSData] = React.useState([]);
  const [filterData, setNDSFilterData] = React.useState([]);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [departmentData, setDepartmentData] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [previousSalaryFilterData, setPreviousSalaryFilterData] = useState([]);
  const [previousSalaryData, setPreviousSalaryData] = useState([]);

  const monthOptions = [
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

  const yearOptions = [
    { value: "2010", label: "2010" },
    { value: "2011", label: "2011" },
    { value: "2012", label: "2012" },
    { value: "2013", label: "2013" },
    { value: "2014", label: "2014" },
    { value: "2015", label: "2015" },
    { value: "2016", label: "2016" },
    { value: "2017", label: "2017" },
    { value: "2018", label: "2018" },
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
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

  const handSearchleClick = (e) => {
    e.preventDefault();
    handleSearchPreviosSalary();
  };

  const handleSearchPreviosSalary = () => {
    axios
      .post(baseUrl + "get_salary_by_id_month_year", {
        month: months,
        year: 1 * years,
        dept_id: departmentFilter,
      })
      .then((res) => {
        setPreviousSalaryData(res.data.data);
        setPreviousSalaryFilterData(res.data.data);
      });
  };

  const accordionButtons = [
    "Non Digital Signature Users",
    "See Previous Salary",
  ];

  const handleAccordionButtonClick = (index) => {
    setActiveAccordionIndex(index);
  };

  const columns = [
    { field: "user_name", headerName: "User Name", width: 200 },
    { field: "dept_name", headerName: "Department", width: 200 },
  ];
  const PreviousSalarycolumns = [
    { field: "user_name", headerName: "User Name", width: 200 },
    { field: "dept_name", headerName: "Department", width: 200 },
    { field: "month", headerName: "Month", width: 200 },
    { field: "year", headerName: "Year", width: 200 },
    { field: "toPay", headerName: "Salary", width: 200 },
  ];

  const getData = () => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      setDepartmentData(res.data);
    });

    axios
      .get(baseUrl + "get_users_without_digital_signature_image")
      .then((response) => {
        setNDSData(response.data.data);
        setNDSFilterData(response.data.data);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const nonDigitalSignature = (
    <div>
      <DataGrid
        rows={filterData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 4,
            },
          },
        }}
        rowsPerPageOptions={[10, 20, 30]}


        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        getRowId={(row) => row._id}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );

  const seePreviousSalary = (
    <div>

      <DataGrid
        rows={previousSalaryFilterData}
        columns={PreviousSalarycolumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        // pageSize={5}
        // rowsPerPageOptions={[5]}

        disableSelectionOnClick
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        getRowId={(row) => row._id}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </div>
  );
  return (
    <div className="master-card-css">
      <FormContainer
        submitButton={false}
        mainTitle="Total & NDG"
        link="finance"
      >
        {/* {activeAccordionIndex === 0 && nonDigitalSignature}
        {activeAccordionIndex === 1 && seePreviousSalary} */}
        {/* {activeAccordionIndex === 2 && payoutReleased}
        {activeAccordionIndex === 3 && TDS}
        {activeAccordionIndex === 4 && NonTDS} */}
      </FormContainer>

      <div className="tab">
        <div className={`named-tab ${activeAccordionIndex === 0 ? "active-tab" : ""}`} onClick={() => { handleAccordionButtonClick(0) }}>
          {accordionButtons[0]}
        </div>
        <div className={`named-tab ${activeAccordionIndex === 1 ? "active-tab" : ""}`} onClick={() => { handleAccordionButtonClick(1) }}>
          {accordionButtons[1]}
        </div>
      </div>
      <div className="card">
        <div className="card-header sb">
          Finance    <div className="pack gap16">
            {activeAccordionIndex === 1 ? <>
              <div className="form-group">
                <label className="form-label">
                  Department Name<sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  placeholder="Department Name"
                  options={[
                    { value: "", label: "All" },
                    ...departmentData.map((option) => ({
                      value: option.dept_id,
                      label: option.dept_name,
                    })),
                  ]}
                  value={
                    departmentFilter === ""
                      ? { value: "", label: "Department Name" }
                      : {
                        value: departmentFilter,
                        label:
                          departmentData.find(
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

              {/* <div className="form-group col-3">
                  <label className="form-label">
                    Designation<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <Select
                    options={[
                      { value: "", label: "All" },
                      ...designationData.map((option) => ({
                        value: option.desi_id,
                        label: option.desi_name,
                      })),
                    ]}
                    value={
                      designationFilter === ""
                        ? { value: "", label: "All" }
                        : {
                            value: designationFilter,
                            label:
                              designationData.find(
                                (option) => option.desi_id === designationFilter
                              )?.desi_name || "Select...",
                          }
                    }
                    onChange={(selectedOption) => {
                      const newValue = selectedOption
                        ? selectedOption.value
                        : "";
                      setDesignationFilter(newValue);
                      if (newValue === "") {
                        designationAPI();
                      }
                    }}
                    required
                  />
                </div> */}

              <div className="form-group">
                <label className="form-label">
                  Years<sup style={{ color: "red" }}>*</sup>
                </label>
                <Select

                  value={yearOptions.find((option) => option.value === years)}
                  onChange={(selectedOption) => {
                    setYears(selectedOption.value);
                  }}
                  options={yearOptions}
                  placeholder="Year"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Months<sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  value={monthOptions.find((option) => option.value === months)}
                  onChange={(selectedOption) => {
                    setMonths(selectedOption.value);
                  }}
                  options={monthOptions}
                  placeholder="Month"

                />
              </div>
              <div className="form-group">
                <button
                  onClick={handSearchleClick}
                  disabled={!years || !months || !departmentFilter}
                  className="btn  cmnbtn btn_sm btn-primary"
                >
                  Show Salary
                </button>
              </div>
              {/* <div className="form-group col-3 ">
        </div> */}
            </> : ""}
          </div>
        </div>
        <div className="card-body body-padding thm_table">
          {activeAccordionIndex === 0 && nonDigitalSignature}
          {activeAccordionIndex === 1 && seePreviousSalary}
        </div>
      </div>

      {/* <FormContainer mainTitle="NGD" link="#" />




        <DataGrid
        rows={filterData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        getRowId={(row) => row._id}      
        components={{
          Toolbar: GridToolbar,
        }}
      /> */}
    </div>
  );
}
