import PropTypes from "prop-types";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

export const OverviewBudget = (props) => {
  const { complete, pending, onGoing, sx, value } = props;
  console.log(complete, pending, onGoing);
  return (
    <div className="card op-exe-das-card">

      <div className="title-line">
        {value}

      </div>

      <div className="title-count  sb">
        <h5 className="title-tag pending-txt">Pending</h5>
        <div className="scroll-con">
          <div className="scroller pending-txt">
            <h2 className="scroller-tag">0</h2>

            {Array.from({ length: pending }).map((_, index) => (
              <h2 className="scroller-tag" key={index}>{index + 1}</h2>
            ))}
          </div>
        </div>
      </div>
      <div className="title-count sb">
        <h5 className="title-tag ongoing-txt">Ongoing</h5>
        <div className="scroll-con">
          <div className="scroller ongoing-txt">
            <h2 className="scroller-tag">0</h2>

            {Array.from({ length: onGoing }).map((_, index) => (
              <h2 className="scroller-tag" key={index}>{index + 1}</h2>
            ))}
          </div>
        </div>
      </div>
      <div className="title-count sb">
        <h5 className="title-tag complete-txt">Completed</h5>
        <div className="scroll-con">
          <div className="scroller complete-txt">
            <h2 className="scroller-tag">0</h2>

            {Array.from({ length: complete }).map((_, index) => (
              <h2 className="scroller-tag" key={index}>{index + 1}</h2>
            ))}
          </div>
        </div>
      </div>
      <>

        {/* {difference && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={positive ? "success" : "error"} fontSize="small">
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? "success.main" : "error.main"}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              Since last month
            </Typography>
          </Stack>
        )} */}
      </>
    </div >
  );
};

OverviewBudget.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
