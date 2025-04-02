import React, { useEffect, useState } from "react";
import { useEditBookingIncentiveUpdateMutation } from "../../../Store/API/Sales/SaleBookingApi.js";
import FieldContainer from "../../FieldContainer.jsx";
import { useAPIGlobalContext } from "../../APIContext/APIContext.jsx";
import CustomSelect from "../../../ReusableComponents/CustomSelect.jsx";
import { useGlobalContext } from "../../../../Context/Context.jsx";
import getDecodedToken from "../../../../utils/DecodedToken.js";

const IncentiveModal = ({ closeModal, selectedRowData }) => {
  let isMultiSharing = selectedRowData?.is_incentive_sharing;
  let token = getDecodedToken();
  const { toastError, toastAlert } = useGlobalContext();
  const [incentiveData, setIncentiveData] = useState(
    isMultiSharing
      ? selectedRowData?.incentive_sharing_users_array?.length > 0
        ? [...selectedRowData?.incentive_sharing_users_array]
        : [{ incentive_amount: 0, user_percentage: 0, user_id: 0 }]
      : { incentive_amount: 0 }
  );
  const { userContextData } = useAPIGlobalContext();
  const [
    upadteIncentive,
    {
      isLoading: updateIncentiveLoading,
      isSuccess: updateIncentiveSuccess,
      isError: updateIncentiveError,
    },
  ] = useEditBookingIncentiveUpdateMutation();
  let sum = 0;
  let sum1 = 0;
  let disable_btn = false;
  let disable_submit = false;
  if (isMultiSharing) {
    disable_btn = incentiveData?.some((element) => {
      sum += Number(element?.incentive_amount);
      return sum >= selectedRowData?.base_amount;
    });
    disable_submit = incentiveData?.some((element) => {
      sum1 += Number(element.incentive_amount);
      return sum1 > selectedRowData?.base_amount;
    });
  }

  async function handleSubmit() {
    try {
      if (isMultiSharing) {
        let data = {
          saleBookingId: selectedRowData?.sale_booking_id,
          isMultiSharing: isMultiSharing,
          incentiveUpdatedBy: token?.id,
          incentiveSharingUsersArray: incentiveData,
        };
        await upadteIncentive(data).unwrap();
      } else {
        let data = {
          saleBookingId: selectedRowData?.sale_booking_id,
          isMultiSharing: isMultiSharing,
          incentiveUpdatedBy: token?.id,
          incentive_amount: incentiveData?.incentive_amount,
        };
        await upadteIncentive(data).unwrap();
      }
      toastAlert("Incentive amount updated successfully", "success");
      closeModal();
    } catch (err) {
      toastError(
        "Something went wrong while updating incentive amount, please try again"
      );
    }
  }

  return (
    <>
      <div className="card w-100">
        <div className="card-header">
          <h6 className="card-title">
            You are changing incentive for booking ID{" "}
            {selectedRowData?.sale_booking_id}
          </h6>
        </div>
        <div className="row">
          {!isMultiSharing ? (
            <FieldContainer
              fieldGrid={12}
              type="text"
              label="Incentive Amount"
              value={incentiveData?.incentive_amount}
              onChange={(e) => {
                setIncentiveData((prev) => ({
                  ...prev,
                  incentive_amount: e.target.value,
                }));
              }}
            />
          ) : (
            <>
              {incentiveData?.map((item, index) => {
                return (
                  <div className="row" key={item?._id}>
                    <CustomSelect
                      label={"Sales Executive"}
                      optionId={"user_id"}
                      optionLabel={"user_name"}
                      fieldGrid={6}
                      dataArray={userContextData}
                      selectedId={item.user_id}
                      setSelectedId={(val) => {
                        setIncentiveData((prev) => {
                          const updatedData = [...prev];
                          updatedData[index].user_id = val;
                          return updatedData;
                        });
                      }}
                    />

                    <FieldContainer
                      fieldGrid={6}
                      type="number"
                      label="Incentive Amount"
                      value={item.incentive_amount}
                      onChange={(e) => {
                        setIncentiveData((prev) => {
                          const updatedData = [...prev];
                          updatedData[index] = {
                            ...updatedData[index],
                            incentive_amount: e.target.value,
                            user_percentage:
                              e.target.value > 0
                                ? (
                                    (e.target.value /
                                      selectedRowData?.base_amount) *
                                    100
                                  )?.toFixed(2)
                                : 0,
                          };
                          return updatedData;
                        });
                      }}
                    />
                    <FieldContainer
                      fieldGrid={6}
                      type="number"
                      label="User Percentage"
                      value={item.user_percentage}
                      disabled={true}
                    />

                    <div
                      className="icon-1 mt-4"
                      onClick={() => {
                        setIncentiveData((prev) => {
                          const updatedData = [...prev];
                          updatedData.splice(index, 1);
                          return updatedData;
                        });
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {disable_btn && (
          <div className="form-error mb-4">
            {"Total incentive amount should be less than or equal to base amount " +
              selectedRowData?.base_amount}
          </div>
        )}
        <div className="sb w-100 mt-3">
          {isMultiSharing && (
            <button
              disabled={disable_btn}
              className="btn cmnbtn btn-primary"
              onClick={() => {
                setIncentiveData((prev) => [
                  ...prev,
                  { incentive_amount: 0, user_percentage: 0, user_id: 0 },
                ]);
              }}
            >
              Add More
            </button>
          )}
          <button
            disabled={disable_submit}
            className="btn cmnbtn btn-primary"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default IncentiveModal;
