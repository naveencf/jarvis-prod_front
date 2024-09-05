import { useState } from "react";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const Reason = () => {
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserID = decodedToken.id;
  const { toastAlert } = useGlobalContext();
  const [reason, setReason] = useState("");
  const [remark, setRemark] = useState("");
  const [data, setData] = useState([]);

  const [isRequired, setIsRequired] = useState({
    reason: false,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (reason == "") {
      setIsRequired((perv) => ({ ...perv, reason: true }));
    }

    if (!reason || reason == "") {
      return toastError("Fill Required Fields");
    }

    try {
      await axios.post(baseUrl + "add_reason", {
        created_by: loginUserID,
        reason: reason,
        remark: remark,
      });
      setReason("");
      setRemark("");
      getData();
      toastAlert("Form Submitted success");
    } catch (error) {
      toastAlert("Reason Already Exists");
    }
  }

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "get_all_reasons");
      setData(response.data);
    } catch (error) {
      toastAlert("An error occurred:", error);
    }
  }
  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "15%",
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
      width: "30%",
      sortable: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
      width: "30%",
      sortable: true,
    },
  ];
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <FormContainer
        mainTitle="Reason"
        title="Reason"
        handleSubmit={handleSubmit}
      >
        <div className="mb-4 row">

<div className="col-6">
          <FieldContainer
            label="Reason"
            astric
            fieldGrid={12}
            value={reason}
            required={false}
            onChange={(e) =>{
               setReason(e.target.value)
               if (e.target.value === "") {
                setIsRequired((prev) => ({
                  ...prev,
                  reason: true,
                }));
              } else {
                setIsRequired((prev) => ({
                  ...prev,
                  reason: false,
                }));
              
              }}}
          />
          {isRequired.reason && (
            <p className="form-error">Please Enter Reason</p>
          )}
          </div>
          <FieldContainer
            label="Remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            required={false}
          />
        </div>
      </FormContainer>
      <div className="card">
        <div className="card-body thm_table">
          <DataTable
            columns={columns}
            data={data}
            fixedHeader
            highlightOnHover
            pagination
            subHeader
          />
        </div>
      </div>
    </>
  );
};

export default Reason;
