import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../../../../AdminPanel/FormContainer";
import { useGlobalContext } from "../../../../../Context/Context";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import Loader from "../../../../AdminPanel/RegisterCampaign/Loader/Loader";

const PendingInvoiceCustomerDeatils = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [datas, setData] = useState([]);
  const [gstNumClick, setGSTNumClick] = useState([]);
  const [loading, setLoading] = useState(true);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3RpbmciLCJpYXQiOjE3MDczMTIwODB9.ytDpwGbG8dc9jjfDasL_PI5IEhKSQ1wXIFAN-2QLrT8";

  // const token = sessionStorage.getItem("token");
  // const decodedToken = jwtDecode(token);
  // const loginUserId = decodedToken.id;

  function getData() {
    const formData = new FormData();
    formData.append("loggedin_user_id", 36);
    formData.append("cust_id", id);

    axios
      .post(
        `https://sales.creativefuel.io/webservices/RestController.php?view=sales-customer_detail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setData(res?.data?.body);
        setLoading(false);
        // setFilterData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const handleGSTNumberClick = (e) => {
    // e.preventDefault();
    setLoading(true);

    const payload = {
      flag: 1,
      // gstNo: "23AAJCC1807B1ZC",
      gstNo: datas?.gst_no,
    };

    axios
      .post(`http://35.200.154.203:8080/api/v1/get_gst_details`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGSTNumClick(res?.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error, "ERROR---------------");
      });
  };

  return (
    <>
      <FormContainer
        mainTitle="Customer Details"
        title="Customer Detail"
        submitButton={false}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Customer Name
                </Typography>
                <Typography variant="h6">{datas?.cust_name}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Customer Type
                </Typography>
                <Typography variant="h6">{datas.cust_type}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Company Name
                </Typography>
                <Typography variant="h6">{datas?.company_name}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  GST Number
                </Typography>
                <Typography
                  variant="h6"
                  onClick={(e) => handleGSTNumberClick(e)}
                >
                  <a href="#" style={{ cursor: "pointer", color: "blue" }}>
                    {datas.gst_no}
                  </a>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Mobile
                </Typography>
                <Typography variant="h6">{datas.mobile_no}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Alternate Number
                </Typography>
                <Typography variant="h6">{datas.alternative_no}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="h6">{datas.email_id}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Country
                </Typography>
                <Typography variant="h6">{datas.country}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  State
                </Typography>
                <Typography variant="h6">{datas.state}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  City
                </Typography>
                <Typography variant="h6">{datas.city}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Website
                </Typography>
                <Typography variant="h6">{datas.website}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Instagram Username
                </Typography>
                <Typography variant="h6">{datas.instagram_username}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="h6">{datas.cat_name}</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        {/* </Card> */}
        <hr />
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Loader />
          </Box>
        ) : (
          <>
            {gstNumClick && Object.keys(gstNumClick).length > 0 && (
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Trade Name
                      </Typography>
                      <Typography variant="h6">
                        {gstNumClick?.trade_name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Legal Business Name
                      </Typography>
                      <Typography variant="h6">
                        {gstNumClick?.legal_business_name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Constitution OF Business
                      </Typography>
                      <Typography variant="h6">
                        {gstNumClick?.constitution_of_business}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Address
                      </Typography>
                      <Typography variant="h6">
                        {gstNumClick?.principal_place_of_business}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        GST In
                      </Typography>
                      <Typography variant="h6">{gstNumClick?.gstin}</Typography>
                    </Box>
                  </Grid>
                  {/* {gstNumClick?.goods_and_services_list?.map((goodServices) => (
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      GST In
                    </Typography>
                    <Typography variant="h6">
                      {goodServices?.goods_services_desc}
                    </Typography>
                  </Box>
                </Grid>
              ))} */}
                </Grid>
              </CardContent>
            )}
          </>
        )}
      </FormContainer>
    </>
  );
};

export default PendingInvoiceCustomerDeatils;
