import LinearProgress from "@mui/material/LinearProgress";
import flag from "../../../assets/imgs/other/flag.png";
import { formatIndianNumber } from "../../../utils/formatIndianNumber";
import { formatNumber } from "../../../utils/formatNumber";
import getDecodedToken from "../../../utils/DecodedToken";

const TargetCard = ({ data, totalSaleAmountDateWise }) => {
  const loginUserRole = getDecodedToken().role_id;
  const finalTargetAmount = data?.target_amount || 0;

  const currentSaleAmount =
    Array.isArray(totalSaleAmountDateWise) && totalSaleAmountDateWise.length > 0
      ? totalSaleAmountDateWise[0]?.totalCampaignAmount
      : 0;

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">{data?.competition_name || "N/A"}</h5>
          </div>
          <div className="card-body">
            <div className="saletargetWrapper">
              {loginUserRole === 1 && (
                <div className="saletargetHead">
                  <h5>
                    Current sale -{" "}
                    <span className="mediumText">
                      ₹ {formatIndianNumber(Math.ceil(currentSaleAmount))}{" "}
                      {`(₹ ${formatNumber(currentSaleAmount)})`}
                    </span>
                  </h5>

                  <h5>
                    Target -{" "}
                    <span className="warningText">
                      ₹ {formatIndianNumber(finalTargetAmount)}{" "}
                      {`(₹ ${formatNumber(finalTargetAmount)})`}
                    </span>
                  </h5>
                </div>
              )}
              <div className="saletargetHead">
                <h5>
                  Completed:{" "}
                  <span>
                    {((currentSaleAmount / finalTargetAmount) * 100).toFixed(2)}{" "}
                    %
                  </span>
                </h5>
                <h5>
                  Remaining:{" "}
                  <span>
                    {(
                      100 -
                      (currentSaleAmount / finalTargetAmount) * 100
                    ).toFixed(2)}{" "}
                    %
                  </span>
                </h5>
              </div>

              <div className="saletargetBar">
                <div className="targetflag">
                  <img src={flag} alt="Home" />
                </div>
                <LinearProgress
                  variant="determinate"

                  value={(currentSaleAmount / finalTargetAmount) * 100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetCard;
