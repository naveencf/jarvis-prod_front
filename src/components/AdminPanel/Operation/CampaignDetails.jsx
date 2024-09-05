import { TextField, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../../../utils/config";
import { useGetAllBrandQuery } from "../../Store/API/Sales/BrandApi";

const CampaignDetails = ({ cid }) => {
  const {
    data: allBrandData,
    isLoading: allBrandLoading,
    isError: allBrandError,
  } = useGetAllBrandQuery();
  const [campaignData, setCampaignData] = useState({});
  const [commitData, setCommitData] = useState([]);
  const [brandName, setBrandName] = useState("");

  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}opcampaign/${cid}`);
      const data = res.data[0];
      setCampaignData(data);
      if (allBrandData) {
        const brand = allBrandData.find(
          (brand) => brand._id === data.pre_brand_id
        );
        setBrandName(brand ? brand.instaBrandName : "N/A");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [cid, allBrandData]);
  const getCommitments = async () => {
    try {
      const res = await axios.get(`${baseUrl}get_all_commitments`);
      setCommitData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommitments();
  }, []);

  const getCommitName = (id) => {
    const commit = commitData.find((commit) => commit.cmtId === id);
    return commit ? capitalizeFirstLetter(commit.cmtName) : "N/A";
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="card body-padding">
      <div className="mb-4">
        <h4> Campaign Details</h4>
      </div>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Brand"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            value={capitalizeFirstLetter(brandName)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            label="Campaign"
            InputLabelProps={{ shrink: true }}
            value={capitalizeFirstLetter(
              campaignData?.campaign_data?.exeCmpName || ""
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            label="Campaign Details"
            InputLabelProps={{ shrink: true }}
            value={capitalizeFirstLetter(campaignData?.details || "")}
          />
        </Grid>
        {campaignData?.commitments &&
          // campaignData.commitments.length > 0 &&
          campaignData.commitments.map((comm, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                label={getCommitName(comm.selectValue)}
                value={capitalizeFirstLetter(comm.textValue || "")}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};
export default CampaignDetails;
