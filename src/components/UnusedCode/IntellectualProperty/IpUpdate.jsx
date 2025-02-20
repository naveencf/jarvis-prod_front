import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
import {baseUrl} from '../../utils/config'

const IpUpdate = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [userData, setUserData] = useState([]);
  const [ipType, setIpType] = useState("");
  const [platform, setPlatform] = useState("");
  const [IPName, setIPname] = useState("");
  const [password, setPassword] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [emailPass, setEmailPass] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryContact, setRecoveryContact] = useState("");
  const [allocatedTo, setAllocatedTo] = useState("");
  const [singleUser, setSingleUser] = useState({});
  const [l1, setl1] = useState("");
  const [l2, setl2] = useState("");
  const [l3, setl3] = useState("");
  const [l1Name, setl1Name] = useState("");
  const [l2Name, setl2Name] = useState("");
  const [l3Name, setl3Name] = useState("");
  const [platformData, setPlatFormData] = useState([]);
  const [ipTypeData, setIpTypeData] = useState([]);
  const [postCount, setPostCount] = useState("");
  const [followers, setFollowers] = useState("");
  const [daysReach, setDaysReach] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [createdBy, setCreatedBy] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  useEffect(() => {
    axios
      .get(`${baseUrl}`+`dataofipregis/${id}`)
      .then((res) => {
        const fetchedData = res.data[0];
        setIpType(fetchedData.ip_type);
        setPlatform(fetchedData.platform);
        setIPname(fetchedData.ip_name);
        setPassword(fetchedData.password);
        setBackupCode(fetchedData.backup_code);
        setContactNo(fetchedData.contact_no);
        setEmail(fetchedData.email);
        setEmailPass(fetchedData.email_pass);
        setRecoveryEmail(fetchedData.recovery_email);
        setRecoveryContact(fetchedData.recovery_contact);
        setAllocatedTo(fetchedData.allocated_to_primary);
        setl1(fetchedData.report_L1);
        setl2(fetchedData.report_L2);
        setl3(fetchedData.report_L3);
        setl1Name(fetchedData.report_L1_user_name);
        setl2Name(fetchedData.report_L2_user_name);
        setl3Name(fetchedData.report_L3_user_name);
        setPostCount(fetchedData.post_count);
        setFollowers(fetchedData.followers);
        setDaysReach(fetchedData.days_reach);
        setCreatedAt(fetchedData.created_at);
        setCreatedBy(fetchedData.created_by);
      });

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
      .then((res) => {
        setl1(res.data.Report_L1);
        setl2(res.data.Report_L2);
        setl3(res.data.Report_L3);
        setl1Name(res.data.report_L1_name);
        setl2Name(res.data.report_L2_name);
        setl3Name(res.data.report_L3_name);
      });
  };

  const handleSubmit = (e) => {
    const currDate = new Date().toISOString();
    const dateString = currDate.replace("T", " ").replace("Z", "");

    const dateObject = new Date(createdAt);
    const formattedDate = `${dateObject
      .toISOString()
      .slice(0, 19)
      .replace("T", " ")}.${dateObject
      .getUTCMilliseconds()
      .toString()
      .padStart(3, "0")}`;

    e.preventDefault();
    axios.put(baseUrl+"ipregiupdate", {
      id: Number(id),
      ip_type: Number(ipType),
      platform: Number(platform),
      ip_name: IPName,
      password: password,
      backup_code: backupCode,
      contact_no: Number(contactNo),
      email: email,
      email_pass: emailPass,
      recovery_email: recoveryEmail,
      recovery_contact: Number(recoveryContact),
      allocated_to_primary: Number(allocatedTo),
      report_L1: l1,
      report_L2: l2,
      report_L3: l3,
      created_at: formattedDate,
      created_by: createdBy,
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
        mainTitle="Instagram Page"
        title="Update"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Ip Type"
          Tag="select"
          value={ipType}
          required={false}
          onChange={(e) => setIpType(e.target.value)}
        >
          <option value="">Please select</option>
          {ipTypeData.map((data) => (
            <option key={data.id} value={data.id}>
              {data.name}
            </option>
          ))}
        </FieldContainer>

        <FieldContainer
          label="Platform"
          Tag="select"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {platformData.map((data) => (
            <option key={data.id} value={data.id}>
              {data.name}
            </option>
          ))}
        </FieldContainer>

        <FieldContainer
          label="IP Name"
          value={IPName}
          onChange={(e) => setIPname(e.target.value)}
        />
        <FieldContainer
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FieldContainer
          label="Backup Code"
          value={backupCode}
          onChange={(e) => setBackupCode(e.target.value)}
        />
        <FieldContainer
          label="Contact Number"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
        />
        <FieldContainer
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FieldContainer
          label="Password"
          value={emailPass}
          onChange={(e) => setEmailPass(e.target.value)}
        />
        <FieldContainer
          label="Recovery Email"
          value={recoveryEmail}
          onChange={(e) => setRecoveryEmail(e.target.value)}
        />
        <FieldContainer
          label="Recovery Contact"
          value={recoveryContact}
          onChange={(e) => setRecoveryContact(e.target.value)}
        />
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
          value={l1}
          disabled
        >
          <option key={1} value={l1}>
            {l1Name}
          </option>
        </FieldContainer>

        <FieldContainer
          label="Reporting To L2"
          Tag="select"
          value={l2}
          disabled
        >
          <option key={1} value={l2}>
            {l2Name}
          </option>
        </FieldContainer>

        <FieldContainer
          label="Reporting To L3"
          Tag="select"
          value={l3}
          disabled
        >
          <option key={1} value={l3}>
            {l3Name}
          </option>
        </FieldContainer>

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
      </FormContainer>
    </div>
  );
};

export default IpUpdate;
