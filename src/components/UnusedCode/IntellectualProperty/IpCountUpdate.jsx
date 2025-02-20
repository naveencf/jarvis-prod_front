import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import FormContainer from "../AdminPanel/FormContainer";
import DeleteButton from "../AdminPanel/DeleteButton";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import jwtDecode from "jwt-decode";
import { baseUrl } from "../../utils/config";

const IpCountUpdate = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [postCount, setPostCount] = useState("");
  const [followers, setFollowers] = useState("");
  const [daysReach, setDaysReach] = useState("");
  const [iPID, setIPID] = useState("");
  const [ipName, setIpName] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`lastdataofipcount/${id}`)
      .then((res) => {
        const fetchedData = res.data[0];
        setIPID(fetchedData.ip_regist_id);
        setIpName(fetchedData.ip_name);
        setPostCount(fetchedData.post_count);
        setFollowers(fetchedData.followers);
        setDaysReach(fetchedData.days_reach);
      });
  }, []);

  const getFollowers = async () => {
    setLoading(true);
    let intervalId;

    try {
      const apiUrl = baseUrl+"instagram";
      const response = await axios.post(apiUrl, { IPName: ipName });
      const dataRequestId = response.data.data_request_id;

      intervalId = setInterval(async () => {
        try {
          const secondApiUrl = `${baseUrl}`+`instagram2/${dataRequestId}`;
          const secondApiResponse = await axios.get(secondApiUrl);
          const followers =
            secondApiResponse.data.response_entries[0].followers;
          const posts = secondApiResponse.data.response_entries[0].posts;

          if (followers && posts) {
            clearInterval(intervalId);
            setLoading(false);
            setFollowers(followers);
            setPostCount(posts);
          }
        } catch (error) {
          console.error("Second API call error:", error);
        }
      }, 2000);
    } catch (error) {
      console.error("First API call error:", error);
    }
  };

  const handleSubmit = (e) => {
    const currDate = new Date().toISOString();
    const dateString = currDate.replace("T", " ").replace("Z", "");

    e.preventDefault();
    axios.post(baseUrl+"ipcountpost", {
      ip_id: Number(id),
      last_updated_by: userID,
      last_updated_at: dateString,
      post_count: Number(postCount),
      followers: Number(followers),
      days_reach: Number(daysReach),
    });

    toastAlert("Form Submitted success");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/ip-overview" />;
  }
  return (
    <div style={{ width: "80%", margin: "0 0 0 10%" }}>
      <UserNav />
      <FormContainer
        mainTitle="Instagram Count Page"
        title="Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="IP Name"
          value={ipName}
          required={false}
          disabled={true}
        />
        <FieldContainer
          label="Post Counts"
          value={postCount}
          required={false}
          onChange={(e) => setPostCount(e.target.value)}
        />
        <FieldContainer
          label="Followers"
          value={followers}
          required={false}
          onChange={(e) => setFollowers(e.target.value)}
        />
        <FieldContainer
          label="Days Reach"
          value={daysReach}
          required={false}
          onChange={(e) => setDaysReach(e.target.value)}
        />
        <div style={{ display: "contents" }}>
          <button
            type="button"
            onClick={getFollowers}
            style={{ height: "40px", margin: "20px 0 10px 10px" }}
            className="col-xl-6 col-lg-6 col-md-6 col-sm-12 btn btn-success"
          >
            Get Latest Followers And Post Counts
          </button>

          {loading && <p style={{ margin: "20px 0 0 10px" }}>Fetching data</p>}
        </div>
      </FormContainer>
    </div>
  );
};
export default IpCountUpdate;
