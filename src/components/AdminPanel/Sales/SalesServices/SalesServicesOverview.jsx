import axios from "axios";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";
import DeleteButton from "../../DeleteButton";
import {
  useEditSaleServiceMutation,
  useGetAllSaleServiceQuery,
} from "../../../Store/API/Sales/SalesServiceApi";
import View from "../Account/View/View";
import { useGlobalContext } from "../../../../Context/Context";
import Loader from "../../../Finance/Loader/Loader";

const SalesServicesOverview = () => {
  const { toastAlert, toastError } = useGlobalContext();
  const [activeTab, setActiveTab] = useState(0);
  const [tableData, setTableData] = useState();
  const [post, setPost] = useState("post");
  const {
    refetch: refetchService,
    data: allSalesService,
    error: allSalesServiceError,
    isLoading: allSalesServiceLoading,
  } = useGetAllSaleServiceQuery();

  const [
    updateSalesService,
    { isLoading: updatingSalesService, isError: updateError },
  ] = useEditSaleServiceMutation();

  const handleUpdateStatus = async (row) => {
    try {
      await updateSalesService({
        id: row._id,
        status: row.status == 0 ? 1 : 0,
      }).unwrap();

      toastAlert("Status changed successfully");
      refetchService();
    } catch (error) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    const filteredService = allSalesService?.filter(
      (item) => item.status == activeTab
    );
    setTableData(filteredService);
  }, [activeTab, allSalesService]);

  const columns = [
    {
      name: "S.no",
      renderRowCell: (row, index) => <div>{index + 1}</div>,
      width: 50,
    },
    {
      key: "service_name",
      width: 550,
      name: "Service Name",
    },
    {
      key: "status",
      name: "Status",
      renderRowCell: (row, index) => {
        if (row.status == 0) {
          return (
            <buton
              className="btn cmnbtn btn_sm btn-success"
              onClick={() => handleUpdateStatus(row)}
            >
              Active
            </buton>
          );
        } else {
          return (
            <buton
              className="btn cmnbtn btn_sm btn-danger"
              onClick={() => handleUpdateStatus(row)}
            >
              Inactive
            </buton>
          );
        }
      },
      // width: 550,
    },
    {
      width: 150,
      name: "Action",
      renderRowCell: (row) => (
        <>
          <div className="flex-row gap-2">
            <button
              type="button"
              className=" icon-1 "
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fa-solid fa-ellipsis"></i>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to={`/admin/create-sales-services/${row._id}/${"put"}`}>
                <button className="dropdown-item ">Edit</button>
              </Link>

              <Link to={`/admin/create-sales-services/${row._id}/${post}`}>
                <button className="dropdown-item ">Clone</button>
              </Link>
            </div>
            <DeleteButton
              endpoint="sales/delete_sale_service_master"
              id={row._id}
              getData={allSalesService}
            />
          </div>
        </>
      ),
    },
  ];
  return (
    <>
      {updatingSalesService && <Loader />}
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            mainTitle="Services"
            link="/admin/create-sales-services"
            buttonAccess={true}
            submitButton={false}
          />
        </div>
      </div>
      <>
        <div className="tab">
          <button
            className={`named-tab ${activeTab == 0 ? "active-tab" : ""}`}
            onClick={() => {
              setActiveTab(0);
            }}
          >
            Active
          </button>
          <button
            className={`named-tab ${activeTab == 1 ? "active-tab" : ""}`}
            onClick={() => {
              setActiveTab(1);
            }}
          >
            Inactive
          </button>
        </div>
      </>

      <View
        columns={columns}
        data={tableData}
        isLoading={allSalesServiceLoading}
        title="Services Overview"
        pagination
        tableName={"SalesServicesOverview"}
      />
    </>
  );
};

export default SalesServicesOverview;
