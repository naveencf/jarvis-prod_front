import React, { useState } from "react";
import { useGlobalContext } from "../../../../Context/Context";
import { useCreateDepartmentMutation } from "../../../Store/API/Sales/DepartmentApi";
import Loader from "../../../Finance/Loader/Loader";

const CreateDepartment = ({ loginUserId, closeModal }) => {
  const { toastAlert, toastError } = useGlobalContext();
  const [department, setDepartment] = useState("");
  const [addDepartment, { isLoading, isSuccess, isError }] =
    useCreateDepartmentMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDepartment({
        department_name: department,
        created_by: loginUserId,
      }).unwrap();
      setDepartment("");
      closeModal();
      toastAlert("Department added successfully");
    } catch (err) {
      console.error("Failed to add department:", err);
      toastError("Failed to add department");
    }
  };

  return (
    <div>
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="department">Add Department</label>
          <span style={{ color: "red" }}>*</span>
          <input
            type="text"
            placeholder="Enter Department"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <button
          type="submit"
          className="btn cmnbtn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {isSuccess && <p>Department added successfully!</p>}
      {isError && <p>Failed to add Department. Please try again.</p>}
    </div>
  );
};

export default CreateDepartment;
