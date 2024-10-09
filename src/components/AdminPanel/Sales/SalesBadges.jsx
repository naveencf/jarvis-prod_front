import Diamond from "../../../assets/img/icon/badge/diamond.png";
import Platinum from "../../../assets/img/icon/badge/platinum.png";
import Gold from "../../../assets/img/icon/badge/gold.png";
import Silver from "../../../assets/img/icon/badge/silver.png";
import Bronze from "../../../assets/img/icon/badge/bronze.png";
import Basic from "../../../assets/img/icon/badge/iron.png";
import axios from "axios";
import { baseUrl } from "../../../utils/config";
import { useEffect, useState } from "react";
import { formatNumber } from "../../../utils/formatNumber";

const badgeImageMap = {
  Diamond: Diamond,
  Platinum: Platinum,
  Gold: Gold,
  Silver: Silver,
  Bronze: Bronze,
  Basic: Basic,
};

const SalesBadges = ({ userBadgeData }) => {
  const [badgeData, setBadgeData] = useState([]);
  const getBadges = async () => {
    try {
      const response = await axios.get(`${baseUrl}sales/badges_master`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      setBadgeData(response.data.data);
    } catch (error) {
      console.error("Error");
    }
  };

  useEffect(() => {
    getBadges();
  }, []);

  return (
    <div>
      <div className="mt20">
        <div className="stepWrapper">
          <ol className="steps">
            <input
              type="hidden"
              id="total_payment_request_approved_amount"
              value=""
            />

            {badgeData?.map((badge, index) => (
              <li
                key={index}
                className={`step ${
                  userBadgeData?.totalCampaignAmount > badge.min_rate_amount &&
                  "stepActive"
                } ${
                  userBadgeData?.totalCampaignAmount > badge.max_rate_amount &&
                  "stepComplete"
                }`}
                data-step={index + 1}
              >
                <div className="step_icon si">
                  <img
                    src={badgeImageMap[badge?.badge_name]}
                    alt={badge?.badge_name}
                  />
                </div>
                <div className="step_text st">
                  <h4>{badge?.badge_name}</h4>
                  <h5>
                    {formatNumber(badge?.min_rate_amount)} -
                    {formatNumber(badge?.max_rate_amount)}
                  </h5>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SalesBadges;
