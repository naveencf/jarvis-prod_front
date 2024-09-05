import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import WhatsappAPI from "../../WhatsappAPI/WhatsappAPI";
import { baseUrl } from '../../../utils/config'

const OnboardExtendDateOverview = () => {
  const whatsappApi = WhatsappAPI();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [contextData, setDatas] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(storedToken);
  const userID = decodedToken.id;

  useEffect(() => {
    if (userID && contextData.length === 0) {
      axios
        .get(`${baseUrl}` + `userauth/${userID}`)
        .then((res) => {
          setDatas(res.data);
        });
    }
  }, []);

  async function getData() {
    try {
      const response = await axios.get(
        baseUrl + "get_all_users"
      );
      const data = response.data.data.filter(
        (item) => item.joining_date_extend_status == "Requested"
      );
      // const data = response.data.data;

      setDatas(data);
      setFilterData(data);
    } catch (error) {
      console.log("Error fething Data", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const statusUpdate = (user_id, status, user_contact_no) => {
    const formData = new FormData();
    formData.append("id", user_id);
    formData.append("joining_date_extend_status", status);
    axios
      .put(baseUrl + "userupdate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        whatsappApi.callWhatsAPI(
          "Preonboarding Register",
          "9977815413",
          user_id,
          [status, "1", "2", "www"]
        );
      })
      .then(() => getData());
  };

  useEffect(() => {
    const result = data.filter((d) => {
      return d.desi_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

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
    },
    {
      name: "Joining Date",
      selector: (row) => row.joining_date?.split("T")?.[0],
      sortable: true,
    },
    {
      name: "Extended Date",
      selector: (row) => row.joining_date_extend_status,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.joining_date_extend_status,
      sortable: true,
    },
    {
      name: "Prove of Doc",
      // selector: (row) => row.joining_extend_document_url,
      selector: (row) => `<img src="${row.joining_extend_document_url}" alt="Proof of Document" />`,
      sortable: true,
    },
    {
      name: "Reason",
      selector: (row) => row.joining_date_extend_reason,
      sortable: true,
    },

    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            title="Approve"
            className="btn cmnbtn btn_sm btn-outline-success btn-md user-button"
            onClick={() =>
              statusUpdate(row.user_id, "Approve", row.user_contact_no)
            }
          >
            Approve
          </button>

          <button
            title="Reject"
            className="btn cmnbtn btn_sm btn-outline-danger btn-md user-button"
            onClick={() =>
              statusUpdate(row.user_id, "Reject", row.user_contact_no)
            }
          >
            Reject
          </button>
          {/* )} */}
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <div >
      <FormContainer
        mainTitle="Extend Date Overview"
        link="/admin/designation-master"
        buttonAccess={
          contextData &&
          contextData[10] &&
          contextData[10].insert_value === 1 &&
          true
        }
      />

      <div className="card">
        <div className="card-body thm_table">
          <DataTable
            title=" Overview"
            columns={columns}
            data={filterdata}
            fixedHeader
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
  );
};

export default OnboardExtendDateOverview;
