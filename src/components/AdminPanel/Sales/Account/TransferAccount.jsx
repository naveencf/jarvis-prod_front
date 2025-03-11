import React, { useState } from "react";
import {
  useEditAccountOwnerMutation,
  useGetSalesUsersQuery,
} from "../../../Store/API/Sales/SalesAccountApi.js";
import CustomSelect from "../../../ReusableComponents/CustomSelect.jsx";
import { useGlobalContext } from "../../../../Context/Context.jsx";
import getDecodedToken from "../../../../utils/DecodedToken.js";

const TransferAccount = ({ account_Owner, id, accountData }) => {
  const [accountOwner, setAccountOwner] = useState("");
  const { toastAlert, toastError } = useGlobalContext();
  const loginUserId = getDecodedToken().id;
  console.log(accountData);

  const [
    updateAccount,
    {
      data: editAccountData,
      error: editAccountError,
      isLoading: editAccountLoading,
    },
  ] = useEditAccountOwnerMutation();
  const {
    data: SalesUsersData,
    error: SalesUsersError,
    isLoading: SalesUsers,
    isfetching: SalesUsersFetching,
  } = useGetSalesUsersQuery();

  const handleUpdateAccount = async () => {
    try {
      const formData = {
        account_owner_id: accountOwner,
        id: id,
        updated_by: loginUserId,
      };

      const res = await updateAccount(formData);
      if (res.error) {
        new Error(res.error);
      } else {
        toastAlert("Account Updated Successfully");
      }
    } catch (error) {
      toastError("Failed to update Account");
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-title">
          <h3>Transfer OwnerShip of {accountData?.account_name} Account</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-5">
              <h4>Current Account Owner:</h4>
              {accountData?.account_owner_name}
            </div>
            <CustomSelect
              label="Select New Account Owner"
              dataArray={SalesUsersData}
              fieldGrid={12}
              optionLabel={"user_name"}
              optionId={"user_id"}
              selectedId={accountOwner}
              setSelectedId={setAccountOwner}
            />
            <button
              className="btn-primary btn cmnbtn"
              onClick={() => {
                handleUpdateAccount();
              }}
              disabled={editAccountLoading || !accountOwner}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferAccount;
