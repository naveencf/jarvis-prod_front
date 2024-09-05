import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
// import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
// import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import EllipsisVerticalIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";


export const OverviewLatestProducts = (props) => {
  const { products, sx } = props;
  let newrow = [

  ]
  const columns = [{ field: 'id', headerName: "ID", width: "20" }, { field: 'cust_name', headerName: "Customer Name", width: "150" }, { field: 'salaes_bookig_data', headerName: "Sales Booking Date", width: "150" }]
  const topFiveProducts = products?.filter(e => e.execution_status == 0).slice(0, 5);
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          Latest Pending
        </div>
      </div>
      <div className="card-body nt-head fx-head thm_table">

        <DataGrid
          rows={topFiveProducts}
          columns={columns}
          getRowId={(row) => row.id}
        />
      </div>
      <div className="card-footer sb">

        <div></div>
        <div className="pack">

          <Link to="/admin/exeinventory">

            <Button
              color="inherit"
              className="btn btn-primary cmnbtn  btn_sm"
              endIcon={<SvgIcon fontSize="small"><ArrowRightIcon /></SvgIcon>}
              size="small"
              variant="text"
            >
              View all
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

OverviewLatestProducts.propTypes = {
  products: PropTypes.array,
  sx: PropTypes.object,
};