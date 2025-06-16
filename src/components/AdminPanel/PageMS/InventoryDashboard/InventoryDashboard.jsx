import React, { useState } from "react";
import FormContainer from "../../FormContainer";
import { NavLink } from "react-router-dom";
import { Users, Files } from "@phosphor-icons/react";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";

const InventoryDashboard = () => {
  const [inputValue, setInputValue] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const pageNames = inputValue
      .split(/[\s,]+/)
      .map((name) => name.trim())
      .filter(Boolean); // Remove empty strings

    setIsLoading(true);
    try {
      const res = await axios.post(baseUrl + "v1/check_page_in_pms", {
        page_names: pageNames,
      });
      setInputValue("");
      setResponseData(res.data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="action_heading">
        <div className="action_title">
          <FormContainer mainTitle={"Inventory Dashboard"} link={true} />
        </div>

        {/* Navigation Cards */}
        <div className="row mt-4">
          {/* Cards here (no change from your version) */}
          <div className="col">
            <NavLink to="/admin/inventory/pms-tag-Category">
              <div className="card shadow-none bgSuccessLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgSuccessLight">
                    <span>
                      <i className="bi bi-tag"></i>
                    </span>
                  </div>
                  <h6 className="fs_16">Tag Category</h6>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="col">
            <NavLink to="/admin/inventory/pms-inventory-category-overview">
              <div className="card shadow-none bgPrimaryLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgPrimaryLight">
                    <span>
                      <i className="bi bi-tag"></i>
                    </span>
                  </div>
                  <h6 className="fs_16">Category</h6>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="col">
            <NavLink to="/admin/inventory/pms-unfetch-pages">
              <div className="card shadow-none bgTertiaryLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgTertiaryLight">
                    <span>
                      <Files weight="duotone" />
                    </span>
                  </div>
                  <h6 className="fs_16">Unfetch Pages</h6>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="col">
            <NavLink to="/admin/inventory/pms-page-cat-assignment-overview">
              <div className="card shadow-none bgSecondaryLight">
                <div className="card-body text-center pb20">
                  <div className="iconBadge bgSecondaryLight">
                    <span>
                      <Users size={32} />
                    </span>
                  </div>
                  <h6 className="fs_16">Assign User</h6>
                </div>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Input section with MUI Grid */}
        <div className="mt-4">
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Enter Page Name(s):
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter page names (space or comma separated)"
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                size="small"
              >
                {isLoading ? "Checking..." : "Submit"}
              </Button>
            </Grid>
          </Grid>
        </div>

        {/* Unregistered Pages UI */}
        {responseData?.data?.unregistered_pages?.length > 0 && (
          <Card
            sx={{
              maxWidth: 500,
              mt: 4,
              mx: "auto",
              borderRadius: 2,
              boxShadow: 3,
              backgroundColor: "#fff3f3",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                Unregistered Pages (
                {responseData.data.unregistered_pages.length})
              </Typography>
              <List>
                {responseData.data.unregistered_pages.map((page, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "#f44336" }}>
                        <ErrorIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={page} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboard;
