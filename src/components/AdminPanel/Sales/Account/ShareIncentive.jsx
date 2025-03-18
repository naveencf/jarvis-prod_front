import React, { useState, useEffect, use } from "react";
import { useAPIGlobalContext } from "../../APIContext/APIContext";
import CustomSelect from "../../../ReusableComponents/CustomSelect";
import getDecodedToken from "../../../../utils/DecodedToken";
import FieldContainer from "../../FieldContainer";
import { useGetAllSaleServiceQuery } from "../../../Store/API/Sales/SalesServiceApi";
import {
  useAddIncentiveSharingMutation,
  useGetIncentiveSharingDetailsQuery,
  useDeleteIncentiveSharingMutation,
} from "../../../Store/API/Sales/IncentiveSharingApi";
import ServiceIncentiveSharing from "./ServiceIncentiveSharing";
import View from "./View/View";
import EditIncentiveSharing from "./EditIncentiveSharing";
import FormContainer from "../../FormContainer.jsx";

const ShareIncentive = ({ closeModal, accountInfo }) => {
  const { userContextData } = useAPIGlobalContext();
  const [accountincentivepercentage, setAccountIncentivePercentage] =
    useState(100);
  const [incentiveSharing, setIncentiveSharing] = useState([]);
  const [editFlag, setEditFlag] = useState(false);

  const [serviceField, setServiceField] = useState([]);
  const [selectedService, setSelectedService] = useState();
  const [allSalesServiceData, setAllSalesServiceData] = useState([]);
  const token = getDecodedToken();
  const loginUser = token.id;
  const userRole = token.role_id;
  const {
    refetch: getIncentiveSharingDetails,
    data: getincentiveSharingData,
    isError: getincentiveSharingError,
    isLoading: getincentiveSharingLoading,
  } = useGetIncentiveSharingDetailsQuery(accountInfo?.[0]?.account_id);

  useEffect(() => {
    if (!getincentiveSharingError) {
      setAccountIncentivePercentage(
        getincentiveSharingData?.account_percentage
      );
      setServiceField(getincentiveSharingData?.services);
      setEditFlag(getincentiveSharingData?.services?.length > 0);
    }
  }, [getincentiveSharingData]);

  useEffect(() => {
    if (!editFlag) {
      setAccountIncentivePercentage(
        getincentiveSharingData?.account_percentage
      );
      setServiceField(getincentiveSharingData?.services);
    }
  }, [editFlag]);

  const [
    addIncentiveSharing,
    {
      data: incentiveSharingData,
      isError: incentiveSharingError,
      isLoading: incentiveSharingLoading,
    },
  ] = useAddIncentiveSharingMutation();

  const [
    deleteIncentiveSharing,
    {
      data: deleteIncentiveSharingData,
      isError: deleteIncentiveSharingError,
      isLoading: deleteIncentiveSharingLoading,
    },
  ] = useDeleteIncentiveSharingMutation();

  const {
    data: allSalesService,
    isError: salesError,
    isLoading: salesLoading,
  } = useGetAllSaleServiceQuery();

  useEffect(() => {
    if (allSalesService) {
      if (serviceField?.length === 0) {
        setAllSalesServiceData(
          allSalesService?.filter((data) => data?.status === 0)
        );
      } else {
        setAllSalesServiceData(
          allSalesService?.filter(
            (data) =>
              !serviceField?.some((sf) => sf?.service_id === data?._id) &&
              data?.status === 0
          )
        );
      }
    }
  }, [allSalesService, serviceField]);

  useEffect(() => {
    setAccountIncentivePercentage((pre) => {
      if (pre > 100) {
        return 100;
      } else if (pre < 0) {
        return 0;
      }
      return pre;
    });
  }, [accountincentivepercentage]);

  const handelDelete = async (row) => {
    const data = {
      id: accountInfo?.[0]?.account_id,
      service_id: row?.service_id,
      incentive_sharing_users: row?.incentive_sharing_users?.map(
        (data) => data?.user_id
      ),
      updated_by: loginUser,
    };

    try {
      await deleteIncentiveSharing(data).unwrap();
      getIncentiveSharingDetails();
    } catch (error) {
      log.error(error);
    }
  };

  const removeServices = (index) => {
    const newServiceField = [...serviceField];
    newServiceField.splice(index, 1);
    setServiceField(newServiceField);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    const data = {
      account_id: accountInfo?.[0]?.account_id,
      account_percentage: Number(accountincentivepercentage),
      services: serviceField,
      created_by: loginUser,
    };

    try {
      await addIncentiveSharing(data).unwrap();
      getIncentiveSharingDetails();
    } catch (error) {
      log.error(error);
    }
  };

  const columns = [
    {
      key: "S.no",
      name: "S.No",
      renderRowCell: (row, index) => index + 1,
      width: 10,
    },
    {
      key: "service_name",
      name: "Service Name",
      renderRowCell: (row) =>
        allSalesService?.find((data) => data?._id === row?.service_id)
          ?.service_name,
      width: 50,
    },
    {
      key: "service_percentage",
      name: "Service Percentage",
      renderRowCell: (row) => row?.service_percentage,
      width: 100,
    },
    {
      key: "incentive_sharing_users_Count",
      name: "Incentive Sharing Users Count",
      renderRowCell: (row, index) => (
        <>
          <p
            type="button"
            className="btn cmnbtn btn-primary btn_sm mb-2"
            data-toggle="collapse"
            data-target={"#collapseExample" + index}
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            {row?.incentive_sharing_users?.length}
          </p>

          <div class="collapse" id={"collapseExample" + index}>
            <div class="card card-body">
              {row?.incentive_sharing_users?.map((data, index) => (
                <div key={index} className="sb">
                  <p>
                    {
                      userContextData?.find(
                        (user) => user?.user_id === data?.user_id
                      )?.user_name
                    }
                  </p>
                  <p>{data?.user_percentage + "%"}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
      width: 100,
    },
    {
      key: "Action",
      name: "Action",
      renderRowCell: (row, index) => (
        <button onClick={() => handelDelete(row)} className="icon-1">
          <i className="bi bi-trash"></i>
        </button>
      ),
      width: 50,
    },
  ];

  return (
    <div className="w-700">
      <div className="action_heading">
        <div className="action_title">
          <FormContainer
            link={true}
            mainTitle={
              "Share Incentive for" + " " + accountInfo?.[0]?.account_name
            }
          />
        </div>
        <div className="action_btns">
          {editFlag && (
            <button
              className="btn btn-primary btn_sm cmnbtn"
              onClick={() => setEditFlag(false)}
            >
              {allSalesService?.filter((data) => data.status === 0)?.length ===
              serviceField?.length
                ? "Edit"
                : "Add More"}
            </button>
          )}
        </div>
      </div>
      {editFlag ? (
        <View
          columns={columns}
          data={serviceField}
          title={
            "Account Sharing Percentage" +
            " " +
            accountincentivepercentage +
            "%"
          }
          isLoading={getincentiveSharingLoading || salesLoading}
          pagination
          tableName={"sales_incentive_sharing"}
        />
      ) : (
        <EditIncentiveSharing
          accountincentivepercentage={accountincentivepercentage}
          setAccountIncentivePercentage={setAccountIncentivePercentage}
          allSalesServiceData={allSalesServiceData}
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          incentiveSharing={incentiveSharing}
          setIncentiveSharing={setIncentiveSharing}
          serviceField={serviceField}
          setServiceField={setServiceField}
          allSalesService={allSalesService}
          editFlag={editFlag}
          incentiveSharingLoading={incentiveSharingLoading}
          handelSubmit={handelSubmit}
          loginUser={loginUser}
          userContextData={userContextData}
          removeServices={removeServices}
          userRole={userRole}
          accountInfo={accountInfo}
        />
      )}
    </div>
  );
};

export default ShareIncentive;
