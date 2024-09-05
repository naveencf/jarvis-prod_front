import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const CocHistory = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  async function getData() {
    await axios
      .get(`${baseUrl}`+`get_coc_history/${id}`)
      .then((res) => {
        setData(res.data.data);
        setFilterData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.heading.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "Display sequence",
      selector: (row) => row.display_sequence,
      sortable: true,
    },
    {
      name: "Heading",
      selector: (row) => row.heading,
      sortable: true,
    },
    {
      name: "Sub heading",
      selector: (row) => row.sub_heading,
      sortable: true,
    },
    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: true,
    },
    {
      name: "Updated Date",
      selector: (row) => {
        return (
          <div>
            {new Date(row.updated_date).toISOString().substr(8, 2)}/
            {new Date(row.updated_date).toISOString().substr(5, 2)}/
            {new Date(row.updated_date).toISOString().substr(2, 2)}
          </div>
        );
      },
      sortable: true,
    },
  ];

  return (
    <>
      <FormContainer
        mainTitle="COC"
        title="Coc History"
        // handleSubmit={handleSubmit}
      >
        <div className="page_height">
          <div className="card mb-4">
            <div className="data_tbl table-responsive">
              <DataTable
                title="Pre Onboard User"
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
      </FormContainer>
    </>
  );
};

export default CocHistory;
