import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../../../../../../Context/Context";
import { baseUrl } from "../../../../../../utils/config";
import FormContainer from "../../../../FormContainer";
import FieldContainer from "../../../../FieldContainer";

const BillingMast = () => {
  const { toastAlert } = useGlobalContext();
  const [bilingName, setBillingName] = useState("");
  const [department, setDepartment] = useState("");
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [allWFHDepartments, setAllWFHDepartments] = useState([]);
  const [unassignedWFHDepartments, setUnassignedWFHDepartments] = useState([]);
  const [seeMoreButtonActive, setSeeMoreButtonActive] = useState(true);

  const [isRequired, setIsRequired] = useState({
    bilingName: false,
    department: false,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const assignedDepartmentResponse = await axios.get(
          baseUrl + "get_all_billingheaders"
        );
        const wfhDepartmentsResponse = await axios.get(
          baseUrl + "dept_with_wfh"
        );

        const assignedDepartments = assignedDepartmentResponse.data.result;

        const wfhDepartments = wfhDepartmentsResponse.data;

        const assignedDeptIds = new Set(
          assignedDepartments.map((dept) => dept.dept_id)
        );

        const unassignedWfhDepartments = wfhDepartments.filter(
          (dept) => !assignedDeptIds.has(dept.dept_id)
        );

        setUnassignedWFHDepartments(unassignedWfhDepartments);
        setAllWFHDepartments(wfhDepartments);
        if (unassignedWfhDepartments.length == wfhDepartments.length) {
          setSeeMoreButtonActive(false);
        }
      } catch (error) {
        console.error("Error Fetching Data", error);
      }
    }

    fetchData();
  }, []);

  const toggleDepartmentList = () => {
    setShowAllDepartments((prev) => !prev);
  };

  const DepartmentMenuList = (props) => (
    <>
      {props.children}
      {seeMoreButtonActive && (
        <button className="btn btn-primary" onClick={toggleDepartmentList}>
          {showAllDepartments ? "Show Less" : "See More"}
        </button>
      )}
    </>
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (bilingName == "") {
      setIsRequired((perv) => ({ ...perv, bilingName: true }));
    }
    if (department == "") {
      setIsRequired((perv) => ({ ...perv, department: true }));
    }

    if (!bilingName || bilingName == "") {
      return toastError("Fill Required Fields");
    }
    if (!department || department == "") {
      return toastError("Fill Required Fields");
    }

    axios
      .post(baseUrl + "add_billingheader", {
        billing_header_name: bilingName,
        dept_id: department,
      })
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert("Submitted");
      });
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/wfhd/billing-overview" />;
  }

  const options = showAllDepartments
    ? allWFHDepartments
    : unassignedWFHDepartments;

  return (
    <>
      <FormContainer
        mainTitle="Billing Register"
        title="Billing"
        handleSubmit={handleSubmit}
      >
        <div className="col-6">
          <FieldContainer
            label="Billing Header Name"
            astric
            required={false}
            fieldGrid={12}
            value={bilingName}
            onChange={(e) => {
              const billingVal = e.target.value;
              setBillingName(billingVal);
              if (billingVal === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  bilingName: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  bilingName: false,
                }));
              }
            }}
          />
          {isRequired.bilingName && (
            <p className="form-error">Please Enter Billing Header</p>
          )}
        </div>

        <div className="form-group col-6">
          <label className="form-label">
            Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={options.map((option) => ({
              value: option.dept_id,
              label: option.dept_name,
            }))}
            value={{
              value: department,
              label:
                options?.find((opt) => opt.dept_id === department)?.dept_name ||
                "",
            }}
            onChange={(selectedOption) => {
              setDepartment(selectedOption.value);
              if (selectedOption.value === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  department: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  department: false,
                }));
              }
            }}
            components={{ MenuList: DepartmentMenuList }}
            required
          />
          {isRequired.department && (
            <p className="form-error">Please select Department</p>
          )}
        </div>
      </FormContainer>
    </>
  );
};

export default BillingMast;
