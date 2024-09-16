import LinearProgress from "@mui/material/LinearProgress";
import flag from "../../../assets/imgs/other/flag.png";
import { formatIndianNumber } from "../../../utils/formatIndianNumber";
import { formatNumber } from "../../../utils/formatNumber";
import getDecodedToken from "../../../utils/DecodedToken";
import { Accordion } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import View from "./Account/View/View";

const TargetCard = ({ data, totalSaleAmountDateWise }) => {

  const loginUserRole = getDecodedToken().role_id;
  const finalTargetAmount = data?.target_amount || 0;

  const currentSaleAmount =
    Array.isArray(totalSaleAmountDateWise) && totalSaleAmountDateWise.length > 0
      ? totalSaleAmountDateWise[0]?.totalCampaignAmount
      : 0;
  const columns = [
    { key: "S.no", name: "S.no", renderRowCell: (row, index) => index + 1, width: 70, },
    { key: "campaignAmount", name: "Sales Amount", width: 200, },
    { key: "sales_executive_name", name: "Sales Executive Name", width: 200, },
    { key: "totalSaleBookingCounts", name: "Total Sale Booking Counts", width: 200, },
    {
      key: "Contribution", name: "Contribution", renderRowCell: (row) => {
        return `${((row.campaignAmount / currentSaleAmount) * 100).toFixed(2)}%`
      }, width: 200, compare: true
    },

  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="card target-card">
          <div className="card-header">
            <h5 className="card-title">{data?.competition_name || "N/A"}</h5>
          </div>
          <Accordion>
            <AccordionSummary
              aria-controls="panel1-content"
              id="panel1-header"
            >
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
            </AccordionSummary>
            <AccordionDetails>
              <View
                columns={columns}
                data={totalSaleAmountDateWise?.[0]?.userWiseData}
                pagination
                title={"Sales User Contribution"}
                tableName={"Sales User Contribution in dashboard"}
                isLoading={false}
                component={
                  buttonTab
                }
              />
            </AccordionDetails>
          </Accordion>


        </div>
      </div>
    </div>
  );
};

function buttonTab() {
  return (
    <div className="icon-1">
      <i className="bi bi-trash"></i>
    </div>
  )
}

export default TargetCard;
