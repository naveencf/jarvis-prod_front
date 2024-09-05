import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import getDecodedToken from "../../../../utils/DecodedToken";

const IncentiveRelease = ({ selectedRow, setIncentiveRelease, setp_TotalFalse, setp_TotalTrue, setp_Total }) => {

  const selectedUserId = selectedRow?.sales_executive_id;
  const token = sessionStorage.getItem("token");
  const loginUserId = getDecodedToken()?.id;
  const [data, setData] = useState([]);
  const [selectedTrue, setSelectedTrue] = useState([]);
  const [selectedFalse, setSelectedFalse] = useState([]);
  const [totalTrue, setTotalTrue] = useState(0);
  const [totalFalse, setTotalFalse] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}sales/incentive_relesed_button_data/${selectedRow?.sales_executive_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = response.data.data;
        setData(res);
      } catch (error) {
        console.error("Error fetching button data:", error);
      }
    };


    if (selectedRow) {
      fetchData();
    }
  }, [selectedRow]);

  const trueCampaigns = data
    .filter((c) => c.gstStatus)
    .sort((a, b) => new Date(a.saleBookingDate) - new Date(b.saleBookingDate));
  const falseCampaigns = data.filter((c) => !c.gstStatus);

  const getOptimalFalseCampaigns = (trueTotal) => {
    let bestCombination = [];
    let bestSum = 0;

    const findCombination = (currentCombination, currentIndex, currentSum) => {
      if (currentSum > trueTotal) return;
      if (currentSum > bestSum) {
        bestSum = currentSum;
        bestCombination = currentCombination.slice();
      }
      for (let i = currentIndex; i < falseCampaigns.length; i++) {
        findCombination(
          [...currentCombination, falseCampaigns[i]],
          i + 1,
          currentSum + falseCampaigns[i].earnedIncentiveAmount
        );
      }
    };

    findCombination([], 0, 0);
    return { bestCombination, bestSum };
  };

  const addCampaign = () => {
    if (trueCampaigns.length > selectedTrue.length) {
      const nextTrue = trueCampaigns[selectedTrue.length];
      const newSelectedTrue = [...selectedTrue, nextTrue];
      const newTotalTrue = totalTrue + nextTrue.earnedIncentiveAmount;

      const { bestCombination, bestSum } =
        getOptimalFalseCampaigns(newTotalTrue);

      setSelectedTrue(newSelectedTrue);
      setTotalTrue(newTotalTrue);
      setSelectedFalse(bestCombination);
      setTotalFalse(bestSum);
      setTotal(newTotalTrue + bestSum); // Update the total amount
    }
  };

  const removeCampaign = () => {
    if (selectedTrue.length > 0) {
      const lastTrue = selectedTrue[selectedTrue.length - 1];
      const newSelectedTrue = selectedTrue.slice(0, -1);
      const newTotalTrue = totalTrue - lastTrue.earnedIncentiveAmount;

      const { bestCombination, bestSum } =
        getOptimalFalseCampaigns(newTotalTrue);

      setSelectedTrue(newSelectedTrue);
      setTotalTrue(newTotalTrue);
      setSelectedFalse(bestCombination);
      setTotalFalse(bestSum);
      setTotal(newTotalTrue + bestSum); // Update the total amount
    }
  };


  useEffect(() => {
    setp_TotalFalse(selectedTrue)
    setp_TotalTrue(selectedFalse)
    setp_Total(total)

  }, [total])
  const releaseIncentive = async () => {
    const saleBookingIds = [
      ...selectedTrue.map((c) => c.sale_booking_id),
      ...selectedFalse.map((c) => c.sale_booking_id),
    ];

    try {
      const response = await axios.post(
        `${baseUrl}sales/incentive_request`,
        {
          sales_executive_id: selectedUserId,
          sale_booking_ids: saleBookingIds,
          created_by: loginUserId,
          user_requested_amount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error releasing campaigns:", error);
      return error;
    }
  };

  return (
    <div>
      <div className="d-flex mt-2 mb-2">
        <button type="button" className="btn btn_sm cmnbtn btn-primary ml-2 mr-2" onClick={addCampaign}>
          +
        </button>
        {/* <p className="mt-2">Total Release Amount: {total}</p>{" "} */}
        <button type="button" className="btn btn_sm cmnbtn btn-primary" onClick={removeCampaign}>
          -
        </button>
      </div>
      {/* <div>
        <h3>Selected GST Campaign Amounts</h3>
        <ul>
          {selectedTrue.map((c) => (
            <li key={c.sale_booking_id}>Amount: {c.earnedIncentiveAmount}</li>
          ))}
        </ul>
        <p>GST Total: {totalTrue}</p>
      </div>
      <div>
        <h3>Selected Non GST Campaign Amounts</h3>
        <ul>
          {selectedFalse.map((c) => (
            <li key={c.sale_booking_id}>Amount: {c.earnedIncentiveAmount}</li>
          ))}
        </ul>
        <p>Non GST Total: {totalFalse}</p>
      </div> */}

    </div>
  );
};

export default IncentiveRelease;
