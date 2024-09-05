import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useEffect } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useGlobalContext } from "../../../Context/Context";
import { useAPIGlobalContext } from "../APIContext/APIContext";
import Select from "react-select";
import { baseUrl } from "../../../utils/config";

export default function SubDepartmentUpdate() {
  const { toastAlert, toastError } = useGlobalContext();
  // const { DepartmentContext } = useAPIGlobalContext();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [subDepartmentName, setSubDepartmentName] = useState("");
  const [remark, setRemark] = useState("");
  // const [departmentData, setDepartmentData] = useState([]);
  const [deptId, setDeptId] = useState(null);
  const { id } = useParams();
  const [DepartmentContext , getDepartmentData] = useState([])

  function getData() {
    // axios
    //   .get(baseUrl+"get_all_departments")
    //   .then((res) => {
    //     setDepartmentData(res.data);
    //   });

    axios.get(`${baseUrl}` + `get_subdept_from_id/${id}`).then((res) => {
      setDeptId(res.data.dept_id);
      setRemark(res.data.remark);
      setSubDepartmentName(res.data.sub_dept_name);
    });
  }
  useEffect(()=>{
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });
  })


  useEffect(() => {
    getData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!subDepartmentName) {
      return toastError("Fill Required Field");
    }

    try {
      await axios.put(`${baseUrl}update_sub_department`, {
        id: Number(id),
        sub_dept_name: subDepartmentName,
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
    return <Navigate to="/admin/sub-department-overview" />;
  }

  const departmentOptions = DepartmentContext.map((option) => ({
    value: option.dept_id,
    label: option.dept_name,
  }));

  const selectedDepartment =
    departmentOptions.find((option) => option.value === deptId) || null;
  // console.log(deptId, "dept id hai yaha")
  return (
    <div>
      <>
        <FormContainer
          mainTitle="Sub-Department"
          title="Sub-Department Update"
          handleSubmit={handleSubmit}
        >
          <FieldContainer
            label="Sub-Department Name"
            astric
            required={false}
            value={subDepartmentName}
            onChange={(e) => setSubDepartmentName(e.target.value)}
          />

          <div className="form-group col-6">
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
          </div>
          <FieldContainer
            label="Remark"
            // disabled
            required={false}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />

          {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
        </FormContainer>
      </>
    </div>
  );
}
