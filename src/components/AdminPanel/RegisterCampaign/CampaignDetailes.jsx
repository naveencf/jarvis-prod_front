import { Paper, TextField, Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {baseUrl} from '../../../utils/config'

let commInfo = [];

// eslint-disable-next-line react/prop-types
const CampaignDetailes = ({
  cid,
  getCampaign,
  // setCampaignData,
  // campaignData,
}) => {
  const [campaignData, setCampaignData] = useState({});
  const [brandData, setBrandData] = useState([]);
  const [cmpName, setCmpName] = useState({});
  const [commitData, setCommitData] = useState([]);
  const [commitmentCompleteData, setCommitmentCompleteData] = useState([]);

  const getData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}`+`register_campaign/${cid}`
      );
      setCampaignData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(cid, "mycid");
  // console.log(campaignData)
  const getBrandInfo = async () => {
    const brand = await axios.get(`${baseUrl}`+`get_brands`);
    const myBrand = brand.data.data.find(
      (brand) => brand.brand_id == campaignData.brand_id
    );
    setBrandData(myBrand);
  };

  // useEffect(()=>{
  //   getCampaign()
  // },[getCampaign])

  const getCampaignName = async () => {
    const camp = await axios.get(`${baseUrl}`+`exe_campaign`);
    const mycamp = camp.data.data.find(
      (camp) => camp.exeCmpId == campaignData.exeCmpId
    );
    setCmpName(mycamp);
    // getCampaign(mycamp)
  };
  useEffect(() => {
    getData();
  }, [cid]);

  const getCommitments = async () => {
    const comm = await axios.get(
      baseUrl+"get_all_commitments"
    );
    const myComm = comm.data.data.filter((comm) =>
      commInfo.includes(comm.cmtId)
    );
    setCommitData(myComm);
    // console.log(myComm);
    let data = [];
    myComm.forEach((x,index) => {
      data.push({ commitment: x.cmtName, value: "0",max:campaignData?.commitment[index]?.textValue });
    });

    setCommitmentCompleteData(data);
  };

  useEffect(() => {
    if (commitmentCompleteData.length > 0 && getCampaign) {
      getCampaign(commitmentCompleteData, cmpName?.exeCmpName,campaignData);
    }
  }, [commitmentCompleteData, cmpName]);

  useEffect(() => {
    if (campaignData.brand_id) {
      campaignData.commitment.forEach((element) => {
        commInfo.push(element.selectValue);
      });
      getBrandInfo();
      getCampaignName();
      getCommitments();
    }
  }, [campaignData]);

  return (
    <>
      {/* Non editable campaigning detailes */}
      <div className="card body-padding">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Brand "
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={brandData?.brand_name}
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
              value={cmpName?.exeCmpName}
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
              value={campaignData.detailing}
            />
          </Grid>
          {commitData.length > 0 &&
            commitData.map((comm, index) => {
              // commitForValidate.push()
              return  <>
              <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  label="Commitment"
                  value={comm.cmtName}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
               
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  label="value"
                  value={campaignData?.commitment[index]?.textValue}
                />
              </Grid>
            </>
            })}
        </Grid>
      </div>
    </>
  );
};

export default CampaignDetailes;
