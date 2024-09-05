import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import FormContainer from "../AdminPanel/FormContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import UserNav from "../Pantry/UserPanel/UserNav";
import jwtDecode from "jwt-decode";
import { useGlobalContext } from "../../Context/Context";
import { baseUrl } from "../../utils/config";

const SimAllocationOverview = () => {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [subDate, setSubDate] = useState({});
  const [reason, setReason] = useState({});
  const [simInfo, setSimInfo] = useState([]);
  const [simData, setSimData] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  function getData() {
    axios.get(baseUrl + "alldataofsimallocment").then((res) => {
      const filteredData = res.data.data.filter(
        (check) => check.submitted_at == null || check.status == "Allocated"
      );
      setData(filteredData);
      setFilterData(filteredData);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data?.filter((d) => {
      return d.assetsName?.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const getSimData = (row) => {
    // console.log(row , "row yha hai")
    axios.get(`${baseUrl}` + `get_single_sim/${row.sim_id}`).then((res) => {
      const particularSimData = res.data;
      setSimInfo(particularSimData);
    });

    axios
      .get(`${baseUrl}` + `get_allocation_by_alloid/${row.allo_id}`)
      .then((res) => {
        const fetchedData = res.data.data;
        setSimData(fetchedData);
      });
  };

  const handleKeyPress = (row, e) => {
    if (e.key === "Enter") {
      handleSubmit(row);
    }
  };

  const handleSubmit = (row) => {
    // console.log(simData.allo_id, "tullo id");

    const currentReason = reason[row.sim_id];
    const currSubDate = subDate[row.sim_id];
    if (currSubDate && currentReason) {
      axios.put(baseUrl + "update_allocationsim", {
        sim_id: row.sim_id,
        allo_id: simData.allo_id,
        // user_id: simData.user_id,
        user_id: 0,
        status: "Available",
        submitted_by: userID,
        Last_updated_by: userID,
        reason: currentReason,
        submitted_at: currSubDate,
      });

      axios
        .put(baseUrl + "update_sim", {
          id: simData.sim_id,
          user_id: 0,
          status: "Available",
          // remark: row.Remarks,
          // sim_no: row.simNo,
        })
        .then(() => {
          toastAlert("Form Submitted success");
          setIsFormSubmitted(true);
          getData();
        })
        .catch((error) => {
          // console.error(error);
        });
    }
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "80px",
      sortable: true,
    },
    {
      name: "Assets Name",
      width: "150px",
      selector: (row) => row.assetsName,
      sortable: true,
    },
    {
      name: "Asset ID",
      // width: "10%",
      selector: (row) => row.asset_id,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row) => row.sub_category_name,
      sortable: true,
      width:"150px"
    },

    // {
    // name: "Allocated Date",
    // width: "10%",
    // selector: (row) => row.Creation_date.slice(0, 10),
    // sortable: true,
    // },
    {
      name: "Submission Date",
      width:"150px",

      selector: (row) => (
        <input
          type="date"
          className="form-control"
          value={subDate[row.sim_id] || ""}
          onChange={(e) => {
            setSubDate((prevSubDate) => ({
              ...prevSubDate,
              [row.sim_id]: e.target.value,
            }));
          }}
          onBlur={() => getSimData(row)}
        />
      ),
      sortable: true,
    },
    {
      name: "Reason",
      width: "15%",
      selector: (row) => (
        <input
          type="text"
          className="form-control"
          placeholder="Type & Enter"
          value={reason[row.sim_id] || ""} // Use the reason state with the key of row.sim_id
          onChange={(e) => {
            setReason((prevReason) => ({
              ...prevReason,
              [row.sim_id]: e.target.value, // Update the reason for the specific row
            }));
          }}
          onKeyDown={(e) => handleKeyPress(row, e)}
        />
      ),
      sortable: true,
    },
  ];

  const [buttonAccess, setButtonAccess] = useState(false);

  return (
    <div className="master-card-css" style={{ margin: "0 0 0 10%", width: "80%" }}>
      <UserNav />
      <FormContainer
        mainTitle="Allocation"
        link="/sim-allocation"
        buttonAccess={buttonAccess}
      />

      <div className="">
        <div className="card mb-4">
          <div className="card-header sb">
            <h5>Sim Allocation Overview</h5>
            <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
          </div>
          <div className="data_tbl table-responsive card-body bdy-padding">
            <DataTable
              
              columns={columns}
              data={filterdata}
              // fixedHeader
              pagination
              // fixedHeaderScrollHeight="64vh"
              // highlightOnHover
              
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SimAllocationOverview;
