import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import DeleteButton from "../../DeleteButton";
import { Link } from "react-router-dom";

const CreditApprovalReasonView = () => {
  const [creditAppReasonData, setCreditAppReasonData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/getlist_reason_credit_approval`
      );
      setCreditAppReasonData(response.data.data);
      setOriginalData(response.data.data);
    } catch (error) {
      console.error("Error fetching credit approval reasons:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = originalData.filter((d) => {
      return d.reason?.toLowerCase().includes(search.toLowerCase());
    });
    setCreditAppReasonData(result);
  }, [search]);

  const columns = [
    {
      name: "S.no",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Reason",
      selector: (row) => row.reason,
    },
    {
      name: "Days Count",
      selector: (row) => row.day_count,
    },
    {
      name: "Action",
      cell: (row) =>
        row.reason_type !== "own reason" && (
          <>
            <Link to={`/admin/update-credit-reason-approval/${row._id}`}>
              <div className="icon-1">
                <i className="bi bi-pencil" />
              </div>
            </Link>
            <DeleteButton
              endpoint="sales/delete_reason_credit_approval"
              id={row._id}
              getData={getData}
            />
          </>
        ),
    },
  ];
  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Credit Approval Reasons"
            link="/admin/create-credit-reason-approval"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Services Overview"
              columns={columns}
              data={creditAppReasonData}
              fixedHeader
              pagination
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
    </>
  );
};

export default CreditApprovalReasonView;
