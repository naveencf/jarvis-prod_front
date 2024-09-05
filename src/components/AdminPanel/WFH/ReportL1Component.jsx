import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useGlobalContext } from "../../../Context/Context";
import Select from "react-select";

const ReportL1Component = ({ isModalOpenSend, onClose, rowData, getData }) => {
  const { toastAlert, usersDataContext } = useGlobalContext();
  const [subDepartmentData, setSubDepartmentData] = useState([]);
  const [reportL1, setReportL1] = useState("");
  const [subDepartment, setSubDeparment] = useState("");

  useEffect(() => {
    axios.get(`${baseUrl}` + `get_all_sub_departments`).then((res) => {
      setSubDepartmentData(res.data);
    });
  }, []);
  const handleSubmit = async () => {
    try {
      await axios.put(baseUrl + "change_all_reportL1_by_sub_dept", {
        report_L1: reportL1,
        sub_dept_id: subDepartment,
      });
      getData();
      onClose();
      toastAlert("Report L1 Changed");
    } catch {}
  };

  return (
    <Modal
      isOpen={isModalOpenSend}
      onRequestClose={onClose}
      style={{
        content: {
          width: "30%",
          height: "40%",
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <div>
        <div className="d-flex justify-content-between mb-2">
          <h3>Report L1 Replace Sub Department Wise</h3>
          <div className="d-flex">
            <button className="btn btn-danger" onClick={onClose}>
              X
            </button>
          </div>
        </div>
        <div>
          <div className="form-group col-12">
            <label className="form-label">Sub Department</label>
            <Select
              className=""
              options={subDepartmentData.map((option) => ({
                value: option.id,
                label: `${option.sub_dept_name}`,
              }))}
              value={{
                value: subDepartmentData,
                label:
                  subDepartmentData.find((user) => user.id === subDepartment)
                    ?.sub_dept_name || "",
              }}
              onChange={(e) => {
                setSubDeparment(e.value);
              }}
              required
            />
          </div>
          <div className="form-group col-12">
            <label className="form-label">
              Report L1 <sup className="form-error">*</sup>
            </label>
            <Select
              className=""
              options={usersDataContext.map((option) => ({
                value: option.user_id,
                label: `${option.user_name}`,
              }))}
              value={{
                value: reportL1,
                label:
                  usersDataContext.find((user) => user.user_id === reportL1)
                    ?.user_name || "",
              }}
              onChange={(e) => {
                setReportL1(e.value);
              }}
            />
          </div>
        </div>
        <button className="btn btn-success ml-3" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default ReportL1Component;
