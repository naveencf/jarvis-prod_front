import { useEffect } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useGlobalContext } from "../../../../../Context/Context";
import { baseUrl } from "../../../../../utils/config";
import FieldContainer from "../../../FieldContainer";
import FormContainer from "../../../FormContainer";

export default function MajorDepartmentUpdate() {
  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [majorDepartmentName, setMajorDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  const [deptId, setDeptId] = useState(null);
  const { id } = useParams();
  const [DepartmentContext, getDepartmentData] = useState([]);

  function getData() {
    axios
      .get(`${baseUrl}` + `get_single_major_department/${id}`)
      .then((res) => {
        setDeptId(res.data.data.dept_id);
        setRemark(res.data.data.Remarks);
        setMajorDepartmentName(res.data.data.m_dept_name);
      });
  }
  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });
  }, []);

  useEffect(() => {
    getData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!majorDepartmentName) {
      return toastError("Fill Required Field");
    }

    try {
      await axios.put(`${baseUrl}edit_major_department`, {
        m_dept_id: Number(id),
        // m_dept_name: majorDepartmentName,
        dept_id: Number(deptId),
        remark: remark,
      });

      setIsFormSubmitted(true);
      toastAlert("Submitted Successfully");
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  if (isFormSubmitted) {
    return <Navigate to="/admin/user/major-department-overview" />;
  }

  const departmentOptions = DepartmentContext.map((option) => ({
    value: option.dept_id,
    label: option.dept_name,
  }));

  const selectedDepartment =
    departmentOptions.find((option) => option.value === deptId) || null;
  return (
    <div>
      <>
        <FormContainer
          mainTitle="Major-Department"
          title="Major-Department Update"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Major-Department Name"
            astric
            required={false}
            value={majorDepartmentName}
            onChange={(e) => setMajorDepartmentName(e.target.value)}
          />

          {/* <div className="form-group col-6">
            <label className="form-label">
              Department Name <sup style={{ color: "red" }}>*</sup>
            </label>
            <Select
              options={departmentOptions}
              value={selectedDepartment}
              onChange={(selectedOption) =>
                setDeptId(selectedOption ? selectedOption.value : null)
              }
            />
          </div> */}
          <FieldContainer
            label="Remark"
            required={false}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </FormContainer>
      </>
    </div>
  );
}
