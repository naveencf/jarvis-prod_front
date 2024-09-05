import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Navigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../../../Context/Context";
import FieldContainer from "../FieldContainer";
import FormContainer from "../FormContainer";
import { baseUrl } from "../../../utils/config";

const DesignationUpdate = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const { desi_id } = useParams();
  const [designationData, setDesignationData] = useState({
    id: 0,
    desi_name: "",
    dept_id: "",
    sub_dept_id: "",
    remark: "",
  });
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [subDepartmentData, setSubDeparmentData] = useState([]);
  const [subDeparmtment, setSubDepartment] = useState("");

  function subDepartmentDatas() {
    if (designationData.dept_id) {
      axios
        .get(baseUrl + `get_subdept_from_dept/${designationData.dept_id}`)
        .then((res) => {
          setSubDeparmentData(res.data);
        });
    }
  }
  useEffect(() => {
    subDepartmentDatas();
  }, [designationData.dept_id]);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(baseUrl + "get_all_departments");
        const departmentOptions = response.data.map((dept) => ({
          value: dept.dept_id,
          label: dept.dept_name,
        }));
        setDepartmentOptions(departmentOptions);
      } catch (error) {
        console.error("Error fetching departments: ", error);
      }
    };

    const fetchDesignationData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}` + `get_single_designation/${desi_id}`
        );
        setDesignationData(response.data.data);
        setSubDepartment(response.data.data.sub_dept_id);
      } catch (error) {
        console.error("Error fetching designation: ", error);
        toastAlert("Failed to fetch designation");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartmentData();
    fetchDesignationData();
  }, [desi_id, toastAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (designationData.desi_name == "") {
      return toastError("Fill Required Field");
    }
    try {
      await axios.put(baseUrl + "update_designation", designationData);
      toastAlert("Updated successfully");
      setIsFormSubmitted(true);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/designation-overview" />;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <FormContainer
      mainTitle="Designation Update"
      title="Designation Update"
      handleSubmit={handleSubmit}
    >
      <FieldContainer
        label="Designation Name"
        fieldGrid={4}
        astric
        required={false}
        value={designationData.desi_name}
        onChange={(e) =>
          setDesignationData({ ...designationData, desi_name: e.target.value })
        }
      />
      <div className="form-group col-4">
        <label className="form-label">
          Department Name <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          options={departmentOptions}
          value={departmentOptions.find(
            (option) => option.value === designationData.dept_id
          )}
          onChange={(selectedOption) =>
            setDesignationData({
              ...designationData,
              dept_id: selectedOption ? selectedOption.value : "",
            })
          }
        />
      </div>

      <div className="form-group col-4">
        <label className="form-label">
          Sub Department <sup style={{ color: "red" }}>*</sup>
        </label>
        <Select
          className=""
          options={subDepartmentData?.map((option) => ({
            value: option.sub_dept_id,
            label: `${option.sub_dept_name}`,
          }))}
          value={{
            value: subDepartmentData,
            label:
              subDepartmentData.find(
                (user) => user.sub_dept_id === subDeparmtment
              )?.sub_dept_name || "",
          }}
          onChange={(e) => {
            setSubDepartment(e.value);
          }}
          required
        />
      </div>

      <FieldContainer
        label="Remark"
        required={false}
        value={designationData.remark}
        Tag="textarea"
        onChange={(e) =>
          setDesignationData({ ...designationData, remark: e.target.value })
        }
      />
    </FormContainer>
  );
};

export default DesignationUpdate;
