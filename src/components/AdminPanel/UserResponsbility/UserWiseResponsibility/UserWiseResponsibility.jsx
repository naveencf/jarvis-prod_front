import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import jwtDecode from "jwt-decode";
import FormContainer from "../../FormContainer";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { useGlobalContext } from "../../../../Context/Context";
import { baseUrl } from "../../../../utils/config";

const UserWiseResponsibility = () => {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [datas, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [allResponsiblility, setAllResponsibility] = useState([]);
  const [transferResponsibilityData, setTransferResponsibilityData] = useState(
    []
  );
  const [checkedData, setCheckedData] = useState([]);
  const [remark, setRemark] = useState("");
  const [transferTo, setTransferTo] = useState(0);
  const [transferToUser, setTransferToUser] = useState([]);
  const [contextData, setDatas] = useState([]);

  const { id } = useParams();

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;
  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(`${baseUrl}` + `get_single_user_auth_detail/${userID}`)
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, [userID]);

  async function getData() {
    try {
      const response = await axios.get(baseUrl + "get_all_users");
      const data = response.data.data;

      setTransferToUser(data);
    } catch (error) {
      console.log("Error fething Data", error);
    }
  }

  const handleTransfer = (userId) => {
    axios.get(`${baseUrl}` + `get_single_kra/${userId}`).then((res) => {
      setTransferResponsibilityData(res.data);
    });
  };
  function handleAllCheckedData(event) {
    if (event.target.checked) {
      setCheckedData([...transferResponsibilityData]);
    } else {
      setCheckedData([]);
      const checkboxes = document.querySelectorAll(`input[type="checkbox"]`);
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
    }
  }
  function handleCheckedData(row) {
    if (checkedData.includes(row)) {
      setCheckedData(checkedData.filter((r) => r !== row));
    } else {
      setCheckedData([...checkedData, row]);
    }
  }

  function getDatas() {
    axios.get(`${baseUrl}` + `userbyjobres/${id}`).then((res) => {
      setData(res.data);
      setFilterData(res.data);
    });
  }
  useEffect(() => {
    getData();
    getDatas();
    axios.get(baseUrl + "get_all_jobresponsibilitys").then((res) => {
      setAllResponsibility(res.data.data);
    });
  }, []);

  useEffect(() => {
    const result = datas.filter((d) => {
      return d.user_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const handleTransferSubmit = () => {
    for (const element of checkedData) {
      const requestData = {
        user_to_id: transferTo,
        remarks: remark,
        created_by: userID,
        user_from_id: element.user_id,
        job_responsibility_id: element.Job_res_id,
        Job_res_id: element.Job_res_id,
      };
      axios
        .post(baseUrl + "kratranspost", requestData)
        .then((res) => {
          setRemark("");
          setTransferTo("");
          toastAlert("KRA Transfer Successfully");

          const MailUser = transferToUser.find((d) => d.user_id == transferTo);

          axios
            .post(baseUrl + "add_send_user_mail", {
              email: MailUser.user_email_id,
              subject: "User Registration",
              text: "You Have Assign New KRA",
              // attachment: selectedImage,
              // login_id: loginId,
              // name: username,
              // password: password,
            })
            .then((res) => {
              console.log("Email sent successfully:", res.data);
            })
            .catch((error) => {
              console.log("Failed to send email:", error);
            });
        })

        .catch((error) => {
          console.error("Error submitting transfer data:", error);
        });
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
      // width: "17%",
    },
    {
      name: "Department",
      selector: (row) => row.department_name,
      sortable: true,
      width: "20%",
    },
    {
      name: "Designation",
      selector: (row) => row.designation_name,
      sortable: true,
      // width: "15%",
    },
    {
      name: "Responsibility",
      selector: (row) => row.sjob_responsibility,
      sortable: true,
      width: "20%",
    },
    {
      name: "Transfer Res",
      selector: (row) => (
        <button
          type="button"
          className="btn btn-outline-warning btn-sm"
          data-toggle="modal"
          data-target="#exampleModal"
          data-whatever="@mdo"
          onClick={() => handleTransfer(row.user_id)}
        >
          Transfer
        </button>
      ),
      width: "7%",
    },
  ];

  return (
    <>
      {allResponsiblility.map((d) => {
        <h1>{d.user_name}</h1>;
      })}
      <FormContainer
        mainTitle="User Wise Responsibility"
        link="/admin/responsibility-master"
        // buttonAccess={
        //   contextData &&
        //   contextData[16] &&
        //   contextData[16].insert_value === 1 &&
        //   true
        // }
      />
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="User Wise Responsibility"
              columns={columns}
              data={filterdata}
              fixedHeader
              // pagination
              fixedHeaderScrollHeight="64vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
      {/* Modal here  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div
            className="modal-content"
            style={{ height: "90vh", overflow: "scroll", width: "140%" }}
          >
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Transfer KRA
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div>
                <div className="row">
                  <div className="form-group col-3">
                    <label className="form-label">
                      Transfer Kra <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      className=""
                      options={transferToUser.map((option) => ({
                        value: option.user_id,
                        label: `${option.user_name}`,
                      }))}
                      value={{
                        value: transferTo,
                        label:
                          transferToUser.find(
                            (user) => user.user_id === transferTo
                          )?.user_name || "",
                      }}
                      onChange={(e) => {
                        setTransferTo(e.value);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group col-9">
                    <label className="form-label">Reason</label>
                    <input
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      className="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <DataTable
                  columns={[
                    {
                      name: (
                        <input
                          type="checkbox"
                          checked={
                            checkedData.length ===
                            transferResponsibilityData.length
                          }
                          onChange={handleAllCheckedData}
                        />
                      ),
                      cell: (row) => (
                        <input
                          type="checkbox"
                          checked={checkedData.includes(row)}
                          onChange={() => handleCheckedData(row)}
                        />
                      ),
                    },
                    {
                      name: "s.no",
                      cell: (row, index) => <div>{index + 1}</div>,
                    },
                    { name: "Name", selector: "user_name" },
                    { name: "Department", selector: "department_name" },
                    {
                      name: "Job Responsibility",
                      selector: "sjob_responsibility",
                    },
                  ]}
                  data={transferResponsibilityData}
                  highlightOnHover
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => handleTransferSubmit()}
                className="btn btn-primary"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserWiseResponsibility;
