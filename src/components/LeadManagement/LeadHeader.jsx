import * as React from "react";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

function LeadHeader() {
  const [value, setValue] = React.useState(0);

  return (
    <Paper sx={{ width: "100%" }}>
      <Link to="/admin/exploreleads">
        <Button>Lead Home</Button>
      </Link>
      <Link to="/admin/newlead">
        <Button>Assign Lead</Button>
      </Link>
      <Link to="/admin/updatelead">
        <Button>Edit Lead</Button>
      </Link>
      {/* </BottomNavigation> */}
    </Paper>
  );
}
export default LeadHeader;
