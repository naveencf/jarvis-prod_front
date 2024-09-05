import {
  Autocomplete,
  FormControl,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../../../../utils/config";
import FormContainer from "../../FormContainer";
import jwtDecode from "jwt-decode";

let options = [];
let plateformvar = [];

const NewExpertUpdate = () => {
const navigate=  useNavigate()
  const { id } = useParams();
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const { userID } = decodedToken;
  const [allPageData, setAllPageData] = useState([]);
  const [getUserData, setGetUserData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFollower, setSelectedFollower] = useState([]);
  const [pageHealth, setPageHealth] = useState([]);
  const [platform, setPlatfrom] = useState([]);
  const [singleUserData, setSingleUserData] = useState(null);

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
 

  const ExsingleData = async () => {
    const singledata = await axios.get(`${baseUrl}` + `expertise/${id}`);
    const fetcheData = singledata?.data.data;
    setSingleUserData(fetcheData);
    setSelectedCategory(fetcheData?.area_of_expertise?.category);
    setPlatfrom(fetcheData?.area_of_expertise?.platform);
    setSelectedFollower(fetcheData?.area_of_expertise?.follower_count);
  };
  useEffect(() => {
    getPageData();
    getAllUsers();
    ExsingleData();

  }, []);
  

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `${baseUrl}expertise/${singleUserData?.user_id}`,
        {
          user_id: singleUserData.user_id,
          area_of_expertise: {
            category: selectedCategory,
            follower_count: selectedFollower,
            platform: platform,
            pageHealth: pageHealth,
          },
          updated_by: userID,
        }
        );
      } catch {}
      navigate('/admin/experties-overview') 
  };

  return (
    <>
      <FormContainer mainTitle="Update Expert" link="flase" />

      <div className="card body-padding">
        <FormControl className="gap4" sx={{ width: "100%" }}>
          <div className="grid-con ">
            <Autocomplete
              fullWidth={true}
              disablePortal
              id="user-name-autocomplete"
              options={getUserData?.map((user) => ({
                label: user.user_name,
                value: user.user_id,
              }))}
              value={
                getUserData.find(
                  (user) => user.user_name === singleUserData?.exp_name
                )?.user_name || null
              }
              renderInput={(params) => (
                <TextField {...params} label="User Name" />
              )}
              onChange={(e, newvalue) => {
                if (newvalue != null) {
                  setSingleUserData((prev) => ({
                    ...prev,
                    exp_name: newvalue.label,
                    user_id: newvalue.value,
                  }));
                } else {
                  // Reset or adjust `singleUserData` if no user is selected
                  setSingleUserData((prev) => ({
                    ...prev,
                    exp_name: null,
                    user_id: null,
                  }));
                }
              }}            />

            <Autocomplete
              multiple
              id="combo-box-demo"
              options={options}
              renderInput={(params) => (
                <TextField {...params} label="Category" />
              )}
              onChange={categoryChangeHandler}
              value={selectedCategory}
            />

            <Autocomplete
              multiple
              id="combo-box-demo"
              options={plateformvar}
              renderInput={(params) => (
                <TextField {...params} label="Platform" />
              )}
              value={platform}
              onChange={plateformHandler}
            />

            <Autocomplete
              multiple
              id="combo-box-demo"
              options={Follower_Count}
              value={selectedFollower}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField {...params} label="Follower Count" />
              )}
              onChange={followerChangeHandler}
            />
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
          </div>

          <div className="pack mt-2">
            <button onClick={handleSubmit} className="btn btn-outline-primary">
              Submit
            </button>
          </div>
        </FormControl>
      </div>
    </>
  );
};

export default NewExpertUpdate;
