import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import {baseUrl} from '../../utils/config'

const IpMaster = () => {
  const { toastAlert } = useGlobalContext();
  const [userData, setUserData] = useState([]);
  const [IPType, setIPType] = useState("");
  const [platform, setPlatform] = useState("");
  const [IPName, setIPname] = useState("");
  const [password, setPassword] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [allocatedTo, setAllocatedTo] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [singleUser, setSingleUser] = useState({});
  const [platformData, setPlatFormData] = useState([]);
  const [ipTypeData, setIpTypeData] = useState([]);
  const [email, setEmail] = useState("");
  const [emailPass, setEmailPass] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryContact, setRecoveryContact] = useState("");
  const [postCount, setPostCount] = useState("");
  const [followers, setFollowers] = useState("");
  const [daysReach, setDaysReach] = useState("");
  const [activeTab, setActiveTab] = useState("stage1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_users")
      .then((res) => setUserData(res.data.data));

    axios
      .get(baseUrl+"get_all_platforms")
      .then((res) => setPlatFormData(res.data));

    axios
      .get(baseUrl+"get_all_iptypes")
      .then((res) => setIpTypeData(res.data));
  }, []);

  const handleSelectChange = (e) => {
    axios
      .get(`${baseUrl}`+`get_single_user/${e.target.value}`)
      .then((res) => setSingleUser(res.data));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getFollowers = async () => {
    setLoading(true);
    let intervalId;

    try {
      const apiUrl = baseUrl+"instagram";
      const response = await axios.post(apiUrl, { IPName: IPName });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currDate = new Date().toISOString();
    const dateString = currDate.replace("T", " ").replace("Z", "");

    if (!IPType || !platform || !IPName || !email || !postCount) {
      setError("Please fill all required fields");
      return;
    }

    await axios.post(baseUrl+"add_instapage", {
      ip_type: Number(IPType),
      platform: Number(platform),
      ip_name: IPName,
      password: password,
      backup_code: backupCode,
      contact_no: contactNo,
      email: email,
      email_pass: emailPass,
      recovery_email: recoveryEmail,
      recovery_contact: recoveryContact,
      allocated_to_primary: Number(allocatedTo),
      created_by: userID,
      report_L1: singleUser.Report_L1,
      report_L2: singleUser.Report_L2,
      report_L3: singleUser.Report_L3,
      post_count: Number(postCount),
      followers: Number(followers),
      days_reach: Number(daysReach),
      last_updated_by: userID,
      last_updated_at: dateString,
    });

    toastAlert("Form Submitted success");
    setIsFormSubmitted(true);
  };

  if (isFormSubmitted) {
    return <Navigate to="/ip-overview" />;
  }
  return (
    <>
      <UserNav />
      <div className="section section_padding sec_bg h100vh">
        <div className="container">
          <div className="card mb-4">
            <div className="card-header">
              <div className="tabbtn_header_two">
                <button
                  onClick={() => handleTabChange("stage1")}
                  style={{
                    backgroundColor: activeTab === "stage1" ? "blue" : "gray",
                    color: "white",
                  }}
                >
                  {" "}
                  Credential Stage
                </button>
                <button
                  onClick={() => handleTabChange("stage2")}
                  style={{
                    backgroundColor: activeTab === "stage2" ? "blue" : "gray",
                    color: "white",
                  }}
                >
                  {" "}
                  Recovery Stage
                </button>
                <button
                  onClick={() => handleTabChange("stage3")}
                  style={{
                    backgroundColor: activeTab === "stage3" ? "blue" : "gray",
                    color: "white",
                  }}
                >
                  {" "}
                  Access Level Stage
                </button>
                <button
                  onClick={() => handleTabChange("stage4")}
                  style={{
                    backgroundColor: activeTab === "stage4" ? "blue" : "gray",
                    color: "white",
                  }}
                >
                  {" "}
                  Page Health Stage
                </button>
              </div>
            </div>
            <div className="card-body pb0 pb4 thm_form">
              <form method="POST" className="row" onSubmit={handleSubmit}>
                {activeTab === "stage1" && (
                  <>
                    <FieldContainer
                      label="Ip Type *"
                      Tag="select"
                      value={IPType}
                      required={false}
                      onChange={(e) => setIPType(e.target.value)}
                    >
                      <option value="">Please select</option>
                      {ipTypeData.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </FieldContainer>

                    <FieldContainer
                      label="Platform *"
                      Tag="select"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    >
                      <option value="">Please select</option>
                      {platformData.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </FieldContainer>

                    <FieldContainer
                      label="IP Name *"
                      value={IPName}
                      required={true}
                      onChange={(e) => setIPname(e.target.value)}
                    />
                    <FieldContainer
                      label="Account Email ID*"
                      required={true}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FieldContainer
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <FieldContainer
                      label="Backup Code"
                      required={false}
                      value={backupCode}
                      onChange={(e) => setBackupCode(e.target.value)}
                    />
                    <FieldContainer
                      label="Account Contact Number"
                      type="number"
                      required={false}
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                    />
                  </>
                )}

                {activeTab === "stage2" && (
                  <>
                    <FieldContainer
                      label="Password"
                      required={false}
                      value={emailPass}
                      onChange={(e) => setEmailPass(e.target.value)}
                    />
                    <FieldContainer
                      label="Recovery Email"
                      required={false}
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                    />
                    <FieldContainer
                      label="Recovery Contact"
                      type="number"
                      required={false}
                      value={recoveryContact}
                      onChange={(e) => setRecoveryContact(e.target.value)}
                    />
                  </>
                )}

                {activeTab === "stage3" && (
                  <>
                    <FieldContainer
                      label="Allocated TO"
                      Tag="select"
                      value={allocatedTo}
                      required={false}
                      onChange={(e) => {
                        setAllocatedTo(e.target.value);
                        handleSelectChange(e);
                      }}
                    >
                      {userData.map((data) => (
                        <option key={data.user_id} value={data.user_id}>
                          {data.user_name}
                        </option>
                      ))}
                    </FieldContainer>

                    <FieldContainer
                      label="Reporting To L1"
                      Tag="select"
                      value={singleUser.Report_L1}
                      disabled
                    >
                      <option key={1} value={singleUser.Report_L1}>
                        {singleUser.report_L1_name}
                      </option>
                    </FieldContainer>

                    <FieldContainer
                      label="Reporting To L2"
                      Tag="select"
                      value={singleUser.Report_L2}
                      disabled
                    >
                      <option key={1} value={singleUser.Report_L2}>
                        {singleUser.report_L2_name}
                      </option>
                    </FieldContainer>

                    <FieldContainer
                      label="Reporting To L3"
                      Tag="select"
                      value={singleUser.Report_L3}
                      disabled
                    >
                      <option key={1} value={singleUser.Report_L3}>
                        {singleUser.report_L3_name}
                      </option>
                    </FieldContainer>
                  </>
                )}

                {activeTab === "stage4" && (
                  <>
                    <FieldContainer
                      label="Post Counts *"
                      value={postCount}
                      type="number"
                      required={true}
                      onChange={(e) => setPostCount(e.target.value)}
                    />
                    <FieldContainer
                      label="Followers"
                      value={followers}
                      type="number"
                      required={false}
                      onChange={(e) => setFollowers(e.target.value)}
                    />
                    <FieldContainer
                      label="Days Reach"
                      value={daysReach}
                      type="number"
                      required={false}
                      onChange={(e) => setDaysReach(e.target.value)}
                    />
                    <div style={{ display: "contents" }}>
                      <button
                        type="button"
                        onClick={getFollowers}
                        style={{ height: "40px", margin: "20px 0 0 10px" }}
                        className="col-xl-3 col-lg-3 col-md-3 col-sm-12 btn btn-success"
                      >
                        Get Followers
                      </button>

                      {loading && (
                        <p style={{ margin: "20px 0 0 10px" }}>Fetching data</p>
                      )}
                    </div>

                    <p>{error}</p>

                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn btn-primary"
                    />
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IpMaster;
