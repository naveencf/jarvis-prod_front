import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../../../Context/Context";
import FormContainer from "../../FormContainer";
import DeleteButton from "../../DeleteButton";
import Loader from "../../../Finance/Loader/Loader";
import {
  useGetIncentivePlanListQuery,
  useUpdateIncentivePlanMutation,
} from "../../../Store/API/Sales/IncentivePlanApi";
import {
  useGetAllSaleServiceQuery,
  useEditSaleServiceMutation,
} from "../../../Store/API/Sales/SalesServiceApi";
import View from "../Account/View/View";
import getDecodedToken from "../../../../utils/DecodedToken";

const SalesProductOverview = () => {
  const navigate = useNavigate();
  const { toastAlert, toastError } = useGlobalContext();
  const token = getDecodedToken();
  const loginUserRole = token.role_id;
  const userId = loginUserRole !== 1 ? token.id : null;

  const [activeTab, setActiveTab] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [incentiveData, setIncentiveData] = useState([]);

  const {
    data: allSalesService,
    isLoading: salesLoading,
    refetch: refetchSales,
  } = useGetAllSaleServiceQuery();

  const {
    data: allIncentiveData,
    isLoading: incentiveLoading,
    refetch: refetchIncentive,
  } = useGetIncentivePlanListQuery();
  console.log(allSalesService, allIncentiveData);

  const [updateSalesService] = useEditSaleServiceMutation();
  const [updateIncentive] = useUpdateIncentivePlanMutation();

  // Handle Sales Service Status Update
  const handleUpdateStatus = async (row) => {
    try {
      await updateSalesService({
        id: row._id,
        status: row.status === 0 ? 1 : 0,
      }).unwrap();
      toastAlert("Status changed successfully");
      refetchSales();
    } catch (error) {
      toastError(error.message);
    }
  };

  // Handle Incentive Update
  const handleUpdatePercent = async (setEditFlag, row) => {
    try {
      const payload = {
        id: allIncentiveData.find(
          (item) => item.sales_service_master_id === row._id
        )?._id,
        sales_service_master_id: row._id,
        value: Number(row.service_percentage),
        updated_by: token.id,
        incentive_type: allIncentiveData.find(
          (item) => item.sales_service_master_id === row._id
        )?.incentive_type,
      };
      await updateIncentive(payload).unwrap();
      toastAlert("Incentive updated successfully");
      setEditFlag(false);
      refetchIncentive();
      refetchSales();
    } catch (error) {
      toastError(error.message);
    }
  };

  // Set Filtered Data Based on Active Tab
  useEffect(() => {
    const filteredService = allSalesService?.filter(
      (item) => item.status === activeTab
    );
    setTableData(filteredService || []);
  }, [activeTab, allSalesService]);

  // Set Incentive Data Based on User Role
  useEffect(() => {
    if (allIncentiveData) {
      if (loginUserRole === 1) {
        setIncentiveData(allIncentiveData);
      } else {
        setIncentiveData(
          allIncentiveData.filter(
            (data) => data.sales_service_master_Data?.status === 0
          )
        );
      }
    }
  }, [allIncentiveData]);

  // Common Columns
  const columns = [
    {
      name: "S.No",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 50,
    },
    {
      key: "service_name",
      name: "Service Name",
      renderRowCell: (row) =>
        row.sales_service_master_Data?.service_name || row.service_name,
      width: 200,
      compare: true,
    },
    {
      key: "value",
      name: "Incentive (%)",
      renderRowCell: (row) =>
        row.value ||
        allIncentiveData?.find(
          (item) => item.sales_service_master_id === row._id
        )?.value,
      width: 150,
      compare: true,
    },
    {
      key: "status",
      name: "Status",
      renderRowCell: (row) => (
        <button
          className={`btn cmnbtn btn_sm ${
            row.status === 0 ? "btn-success" : "btn-danger"
          }`}
          onClick={() => handleUpdateStatus(row)}
        >
          {row.status === 0 ? "Active" : "Inactive"}
        </button>
      ),
      width: 150,
    },
    {
      key: "incentive_type",
      name: "Service Type",
      renderRowCell: (row) =>
        allIncentiveData?.find(
          (data) => row?._id === data?.sales_service_master_id
        )?.incentive_type,
      compare: true,
      width: 200,
    },
  ];

  if (loginUserRole === 1) {
    columns.push({
      key: "action",
      name: "Action",
      renderRowCell: (row) => (
        <div className="flex-row gap-2">
          <Link
            to={`/admin/sales/product/${
              allIncentiveData?.find(
                (data) => row?._id === data?.sales_service_master_id
              )?._id
            }`}
          >
            <div className="icon-1">
              <i className="bi bi-pencil"></i>
            </div>
          </Link>
          <DeleteButton
            endpoint="sales/delete_sale_service_master"
            id={row._id}
            getData={allSalesService}
          />
        </div>
      ),
      width: 200,
    });
  }

  return (
    <>
      {(salesLoading || incentiveLoading) && <Loader />}
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Product Overview"
            submitButton={false}
            link={true}
          />
        </div>
        <div className="action_btns">
          <button
            className="btn cmnbtn btn_sm btn-primary"
            onClick={() =>
              navigate({
                pathname: "/admin/sales/product/create",
                state: { task: "add" },
              })
            }
          >
            Add Product
          </button>
        </div>
      </div>

      <div className="tab">
        <button
          className={`named-tab ${activeTab === 0 ? "active-tab" : ""}`}
          onClick={() => setActiveTab(0)}
        >
          Active
        </button>
        <button
          className={`named-tab ${activeTab === 1 ? "active-tab" : ""}`}
          onClick={() => setActiveTab(1)}
        >
          Inactive
        </button>
      </div>
      <View
        columns={columns}
        data={tableData}
        isLoading={salesLoading || incentiveLoading}
        title="Overview"
        pagination
        tableName="SalesProductOverview-1"
      />
    </>
  );
};

export default SalesProductOverview;
