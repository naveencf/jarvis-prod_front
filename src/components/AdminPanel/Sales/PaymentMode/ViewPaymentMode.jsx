import React, { useEffect, useState } from "react";
import FormContainer from "../../FormContainer";
import DataTable from "react-data-table-component";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import { Link } from "react-router-dom";
import DeleteButton from "../../DeleteButton";
import { useGetAllPaymentModesQuery } from "../../../Store/API/Sales/PaymentModeApi";
import View from "../Account/View/View";
import getDecodedToken from "../../../../utils/DecodedToken";
import { useAPIGlobalContext } from "../../APIContext/APIContext";

const ViewPaymentMode = () => {
  const token = getDecodedToken();
  let loginUserId;
  const loginUserRole = token.role_id;
  const { userContextData, contextData } = useAPIGlobalContext();
  if (contextData?.find((data) => data?._id == 64)?.view_value !== 1) {
    loginUserId = token.id;
  }
  const [paymentModeData, setPaymentModeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const {
    data: allPaymentModeData,
    isLoading: paymentModeLoading,
    isError: paymentModeError,
  } = useGetAllPaymentModesQuery();
  const getData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}sales/getlist_sale_payment_mode`
      );
      setPaymentModeData(response.data.data);
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
    setPaymentModeData(result);
  }, [search]);

  const columns = [
    {
      key: "s.no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 50,
    },
    {
      key: "payment_mode_name",
      name: "Mode Name",
      renderRowCell: (row) => row.payment_mode_name,
      width: 500,
    },
    {
      key: "action",
      name: "Actions",
      renderRowCell: (row) => (
        <div className="d-flex">
          <Link to={`/admin/sales/edit-payment-mode/${row._id}`}>
            <div className="icon-1">
              <i className="bi bi-pencil" />
            </div>
          </Link>
          <DeleteButton
            endpoint="sales/delete_sale_payment_mode"
            id={row._id}
            getData={getData}
          />
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Payment Mode"
            link="/admin/sales/create-payment-mode"
            buttonAccess={loginUserRole === 1}
            submitButton={false}
          />
        </div>
      </div>
      <div className="page_height">
        <View
          version={1}
          title={"Payment Mode Overview"}
          columns={columns}
          data={allPaymentModeData}
          pagination
          isLoading={paymentModeLoading}
          tableName={"PaymentModeOverview"}
        />
        {/* <div className="card mb-4">
          <div className="data_tbl table-responsive">
            <DataTable
              title="Payment Mode Overview"
              columns={columns}
              data={paymentModeData}
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
        </div> */}
      </div>
    </>
  );
};

export default ViewPaymentMode;
