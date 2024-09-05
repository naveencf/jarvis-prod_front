import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import DeleteButton from "../../AdminPanel/DeleteButton";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import { baseUrl } from "../../../utils/config";

const NotificationHistory = () => {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  async function getData() {
    await axios.get(baseUrl + "get_all_notifications").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.notification_title.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedTimestamp;
  }

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "9%",
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.notification_title,
      sortable: true,
    },
    {
      name: "Message",
      selector: (row) => row.notification_message,
      sortable: true,
    },
    {
      name: "Readen",
      selector: (row) => (row.readen ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Action On",
      selector: (row) => formatTimestamp(row.creation_date),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <DeleteButton
            endpoint="delete_notification"
            id={row._id}
            getData={getData}
          />
        </>
      ),
      allowOverflow: true,
      width: "22%",
    },
  ];

  return (
    <div >
      <FormContainer mainTitle="Notifications" link="/" />

      <div className="card">
        <div className="card-header sb">
          Notification History
          <input
            type="text"
            placeholder="Search here"
            className="w-25 form-control "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body yhm_table">

          <DataTable

            columns={columns}
            data={filterdata}
            // fixedHeader
            pagination
            // selectableRows
            highlightOnHover
          />

        </div>
        {/* <div className="data_tbl table-responsive">
          <DataTable
            title="Notification History"
            columns={columns}
            data={filterdata}
            fixedHeader
            // pagination
            fixedHeaderScrollHeight="64vh"
            highlightOnHover
           
          />
        </div> */}
      </div>
    </div>
  );
};

export default NotificationHistory;
