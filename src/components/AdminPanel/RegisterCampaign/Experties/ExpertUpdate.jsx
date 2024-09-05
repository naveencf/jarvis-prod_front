import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";

let options = [];
let plateformvar = [];

const ExpertiesUpdate = () => {
  const { id } = useParams();
  console.log(id, "exp-id");
  const [allPageData, setAllPageData] = useState([]);
  const [getUserData, setGetUserData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFollower, setSelectedFollower] = useState([]);
  const [pageHealth, setPageHealth] = useState([]);
  const [platform, setPlatfrom] = useState([]);
  const [expertdata, setExpertData] = useState([]);

  const [expertiesusername, setExpertiesUserName] = useState([]);
  const [expertiessingledata, setExpertiesSingleData] = useState([]);

  const Follower_Count = [
    "<10k",
    "10k to 100k ",
    "100k to 1M ",
    "1M to 5M ",
    ">5M ",
  ];
  const page_health = ["Active", "nonActive"];

  const getPageData = async () => {
    const pageData = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    setAllPageData(pageData.data.body);
  };

  const getAllUsers = async () => {
    const alluser = await axios.get(baseUrl + "get_all_users");
    setGetUserData(alluser.data.data);
  };
  const ExsingleData = async () => {
    const singledata = await axios.get(`${baseUrl}` + `expertise/${id}`);
    const fetcheData = singledata?.data.data;
    console.log(fetcheData, "single data ");
    const { exp_name, user_id, area_of_expertise } = fetcheData;
    // console.log(category);
    setExpertiesUserName(fetcheData)
    setExpertiesUserName(area_of_expertise.category);
    // setSelectedCategory(category);
  };

  useEffect(() => {
    ExsingleData();
    getPageData();
    getAllUsers();
  }, []);

  const categorySet = () => {
    allPageData?.forEach((data) => {
      if (!options.includes(data.cat_name)) {
        options.push(data.cat_name);
      }
    });
  };

  const platformset = () => {
    allPageData?.forEach((data) => {
      if (!plateformvar.includes(data.platform)) {
        plateformvar.push(data.platform);
      }
    });
  };

  useEffect(() => {
    if (allPageData?.length > 0) {
      categorySet();
      platformset();
    }
  }, [allPageData]);

  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);
  };
  const plateformHandler = (e, op) => {
    setPlatfrom(op);
  };

  const followerChangeHandler = (e, op) => {
    setSelectedFollower(op);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}` + `expertise/${expertiesusername.user_id}`,
        {
          user_id: expertiesusername.user_id,
          area_of_expertise: {
            category: selectedCategory,
            follower_count: selectedFollower,
            platform: platform,
            pageHealth: pageHealth,
          },
          updated_by: "hello",
        }
      );
    } catch { }
  };

  return (
    <>
      <FormContainer mainTitle="Update Expert" link="flase" />

      <div className="card body-padding">
        <FormControl className="gap4" sx={{ width: "100%" }}>
          <div className="grid-con ">
            {/* <div className="col-sm-12 col-lg-12 "> */}
              <Autocomplete
                fullWidth={true}
                disablePortal
                value={expertiesusername?.exp_name}
                id="combo-box-demo"
                options={getUserData.map((user) => ({
                  label: user.user_name,
                  value: user.user_id,
                }))}
                onChange={(e, newvalue) => {
                  if (newvalue != null) {
                    setExpertiesUserName((prev) => ({
                      label: newvalue.label,
                      user_id: newvalue.value,
                    }));
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="User Name" />
                )}
              />
            {/* </div> */}
            {/* <div className="col-sm-12 col-lg-3"> */}
              <Autocomplete
                multiple
                id="combo-box-demo"
                value={selectedCategory}
                options={options}
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
                onChange={categoryChangeHandler}
              />
            {/* </div> */}

            {/* <div className="col-sm-12 col-lg-3"> */}
              <Autocomplete
                multiple
                id="combo-box-demo"
                options={plateformvar}
                renderInput={(params) => (
                  <TextField {...params} label="Platform" />
                )}
                onChange={plateformHandler}
              />
            {/* </div> */}
            {/* <div className="col-sm-12 col-lg-3"> */}
              <Autocomplete
                multiple
                id="combo-box-demo"
                options={Follower_Count}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Follower Count" />
                )}
                onChange={followerChangeHandler}
              />
            {/* </div> */}
            {/* <div className="col-sm-12 col-lg-3"> */}
              <Autocomplete
                multiple
                id="combo-box-demo"
                options={page_health}
                value={pageHealth}
                onChange={(e, newvalue) => setPageHealth(newvalue)}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField {...params} label="Page health" />
                )}
              />
            {/* </div> */}
          </div>
          
                  <div className="pack mt-2">

            <button onClick={handleSubmit}className="btn btn-outline-primary">
              Submit
            </button>
                  </div>
         
        </FormControl>
      </div>
    </>
  );
};

export default ExpertiesUpdate;
