import { useState } from "react";
import FieldContainer from "../../FieldContainer";
import FormContainer from "../../FormContainer";
import Select from "react-select";
import { useEffect } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import { useGlobalContext } from "../../../../Context/Context";

const BillingUpdate = () => {
  const { id } = useParams();
  const { toastError, toastAlert } = useGlobalContext();
  const [bilingName, setBillingName] = useState("");
  const [department, setDepartment] = useState("");
  const [departmentdata, getDepartmentData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    axios.get(baseUrl + "get_all_departments").then((res) => {
      getDepartmentData(res.data);
    });

    axios.get(`${baseUrl}` + `get_single_billingheader/${id}`).then((res) => {
      const fetchData = res.data;

      const [{ billing_header_name, dept_id }] = fetchData;
      setBillingName(billing_header_name);
      setDepartment(dept_id);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bilingName || bilingName == "") {
      return toastError("Fill Required Fields");
    }
    await axios.put(baseUrl + "update_billingheader", {
      billingheader_id: id,
      billing_header_name: bilingName,
      dept_id: department,
    });
    setIsFormSubmitted(true);
    toastAlert("Successfully Updated");
  };

  if (isFormSubmitted) {
    return <Navigate to="/admin/billing-overview" />;
  }

  return (
    <>
      <FormContainer
        mainTitle="Billing Update"
        title="Billing"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Billing Header Name"
          astric
          required={false}
          value={bilingName}
          onChange={(e) => setBillingName(e.target.value)}
        />

        <div className="form-group col-6">
          <label className="form-label">
            Department Name <sup style={{ color: "red" }}>*</sup>
          </label>
          <Select
            className=""
            options={departmentdata.map((option) => ({
              value: option.dept_id,
              label: `${option.dept_name}`,
            }))}
            value={{
              value: department,
              label:
                departmentdata.find((user) => user.dept_id === department)
                  ?.dept_name || "",
            }}
            onChange={(e) => {
              setDepartment(e.value);
            }}
            required
          />
        </div>
      </FormContainer>
    </>
  );
};

export default BillingUpdate;
