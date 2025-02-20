import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import FormContainer from "../AdminPanel/FormContainer";
import FieldContainer from "../AdminPanel/FieldContainer";
import { useGlobalContext } from "../../Context/Context";
import UserNav from "../Pantry/UserPanel/UserNav";
// import { Chart } from 'chart.js';
// import Chart from "chart.js/auto";
import Select from "react-select";
import {baseUrl} from '../../utils/config'

const setFollowersDataY = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "# of Followers",
      data: [100, 20, 33, 24, 5, 61, 7, 48, 9, 10, 91, 112],
      backgroundColor: "rgb(242, 31, 12)",
      borderColor: "rgb(255, 165, 0)",
      borderWidth: 1,
    },
    {
      label: "# of Post Counts",
      data: [10, 120, 33, 244, 50, 1, 70, 48, 90, 10, 91, 12],
      backgroundColor: "rgb(23, 3, 252)",
      borderColor: "rgb(255, 165, 0)",
      borderWidth: 1,
    },
  ],
};

const setStatsDataGraph = {
  labels: ["followers", "non-followers"],
  datasets: [
    {
      label: "#",
      data: [33, 66],
      backgroundColor: ["red", "blue"],
      borderColor: ["red", "blue"],
      borderWidth: 1,
    },
  ],
};

const IpGraph = () => {
  const { id } = useParams();
  const { toastAlert } = useGlobalContext();
  const [graph, setGraph] = useState({});
  const [activeButton, setActiveButton] = useState("Year");
  const [ipDetail, setIpDetail] = useState({});
  const [year, setYear] = useState("");
  const [firstMonth, setFirstMonth] = useState("");
  const [secondMonth, setSecondMonth] = useState("");
  const [graph2, setGraph2] = useState({});
  const [storyView, setStoryView] = useState("");
  const [monthReach, setMonthlyReach] = useState("");
  const [impression, setImpression] = useState("");
  const [profileVisit, setProfileVisit] = useState("");
  const [gender, setGender] = useState("");
  const [linkTap, setLinkTap] = useState("");
  const [emailTap, setEmailTap] = useState("");
  const [contentShare, setContentShare] = useState("");
  const [followerss, setFollowerss] = useState("");
  const [nonFollowers, setNonFollowers] = useState("");
  const [likes, setLikes] = useState("");
  const [share, setShare] = useState("");
  const [save, setSave] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [ipAllocateUser, setIpAllocateUser] = useState("");
  const [ipAllocatePage, setIpAllocatePage] = useState([]);
  const [userData, setUserData] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [statsMonth, setStatsMonth] = useState("");
  const [statsYear, setStatsYear] = useState("");

  const followersChartY = async () => {
    setActiveButton("Year");
    const currentYear = new Date().getFullYear()?.toString();
    axios
      .post(`${baseUrl}`+`dataforgraph`, {
        dateFormat: currentYear, // 2023
        ip_id: id,
      })
      .then((res) => {
        const changedRes = res.data.followers;
        setGraph(changedRes);
        setGraph2(res.data.postcounts);
        setIpDetail(res.data.ipRegisterData);
      });
  };

  useEffect(() => {
    $("#myChart").remove();
    $(".ttttt").append('<canvas id="myChart"><canvas>');

    if (activeButton == "Year") {
      setFollowersDataY.datasets[0].borderColor = "red";
      setFollowersDataY.datasets[1].borderColor = "blue";
      setFollowersDataY.labels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      setFollowersDataY.datasets[0].data = graph;
      setFollowersDataY.datasets[1].data = graph2;
    }

    if (activeButton == "Month") {
      setFollowersDataY.datasets[0].borderColor = "red";
      setFollowersDataY.datasets[1].borderColor = "blue";
      setFollowersDataY.labels = ["Current Month"];
      setFollowersDataY.datasets[0].data = graph;
      setFollowersDataY.datasets[1].data = graph2;
    }

    if (activeButton == "Custom") {
      setFollowersDataY.datasets[0].borderColor = "red";
      setFollowersDataY.datasets[1].borderColor = "blue";
      setFollowersDataY.labels = Object.keys(graph).sort((a, b) =>
        a.localeCompare(b)
      );
      setFollowersDataY.datasets[0].data = Object.values(graph).sort(
        (a, b) => a - b
      );
      setFollowersDataY.datasets[1].data = graph2;
    }

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: "line",
      data: setFollowersDataY,
    });
  }, [graph, activeButton]);

  const followersChartM = async () => {
    setActiveButton("Month");
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const currentYearMonth = `${year}-${month}`;

    axios
      .post(`${baseUrl}`+`dataforgraph`, {
        dateFormat: currentYearMonth, // 2023-08
        ip_id: id,
      })
      .then((res) => {
        const changedRes = res.data.followers;
        setGraph(changedRes);
        setGraph2(res.data.postcounts);
        setIpDetail(res.data.ipRegisterData);
      });
  };

  const followersChartC = async () => {
    setActiveButton("Custom");
    const currentDate = new Date();
    const year = currentDate.getFullYear();

    axios
      .post(`${baseUrl}`+`dataforgraph`, {
        start_date: `${year}-${firstMonth}-${"01"}`,
        end_date: `${year}-${secondMonth}-${"30"}`,
        ip_id: id,
      })
      .then((res) => {
        const changedRes = res.data.followers;
        setGraph(changedRes);
        setGraph2(res.data.postcounts);
        setIpDetail(res.data.ipRegisterData);
      });
  };

  useEffect(() => {
    followersChartY();
  }, []);

  const saveStats = async (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}`+`ip_stats_post`, {
      ip_id: id,
      story_view: storyView,
      month_reach: monthReach,
      impression: impression,
      profile_visit: profileVisit,
      gender: gender,
      link_tap: linkTap,
      email_tap: emailTap,
      content_shared: contentShare,
      followerss: followerss,
      non_followerss: nonFollowers,
      likes: likes,
      shares: share,
      saves: save,
    });
    toastAlert("Form Submitted success");
    setIsFormSubmitted(true);
  };

  const saveIpPageResponsiblity = async (e) => {
    e.preventDefault();
    axios.put(`${baseUrl}`+`ipregiupdatenew`, {
      id: id,
      user_id: ipAllocateUser,
      user_response: ipAllocatePage?.map((option) => option.value).join(),
    });
    followersChartY();
  };

  useEffect(() => {
    axios
      .get(baseUrl+"get_all_users")
      .then((res) => setUserData(res.data.data));
  }, []);

  useEffect(() => {
    const date = new Date();
    const currentMonth = date.toLocaleString("default", { month: "long" });
    const currentYear = date.getFullYear().toString();

    const payload = {
      ip_id: id,
      month: currentMonth,
      year: currentYear,
    };

    axios
      .post(baseUrl+"show_stats", payload)
      .then((res) => {
        setStatsData(res.data.data);

        $("#donutChart").remove();
        $(".uuuuu").append('<canvas id="donutChart"><canvas>');

        setStatsDataGraph.datasets[0].backgroundColor = ["red", "blue"];
        setStatsDataGraph.datasets[0].borderColor = ["red", "blue"];
        setStatsDataGraph.labels = ["followers", "non-followers"];
        setStatsDataGraph.datasets[0].data = [
          res.data.data[0]?.followerss,
          res.data.data[0]?.non_followerss,
        ];

        var ctx = document.getElementById("donutChart");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: setStatsDataGraph,
        });
      });
  }, []);

  const showStatsConst = () => {
    const payload = {
      ip_id: id,
      month: statsMonth,
      year: statsYear,
    };

    axios
      .post(baseUrl+"show_stats", payload)
      .then((res) => {
        setStatsData(res.data.data);

        $("#donutChart").remove();
        $(".uuuuu").append('<canvas id="donutChart"><canvas>');

        setStatsDataGraph.datasets[0].backgroundColor = ["red", "blue"];
        setStatsDataGraph.datasets[0].borderColor = ["red", "blue"];
        setStatsDataGraph.labels = ["followers", "non-followers"];
        setStatsDataGraph.datasets[0].data = [
          res.data.data[0]?.followerss,
          res.data.data[0]?.non_followerss,
        ];

        var ctx = document.getElementById("donutChart");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: setStatsDataGraph,
        });
      });
  };

  const response_page = [
    { value: "Page Manager", label: "Page Manager" },
    { value: "Growth Manager", label: "Growth Manager" },
    { value: "Content Manager", label: "Content Manager" },
    { value: "IG Content Manager", label: "IG Content Manager" },
    { value: "Comment Reply", label: "Comment Reply" },
    { value: "Captions", label: "Captions" },
    { value: "Scheduling", label: "Scheduling" },
    { value: "Dm's", label: "Dm's" },
  ];

  if (isFormSubmitted) {
    return <Navigate to="/ip-overview" />;
  }

  return (
    <>
      <UserNav />

      <div className="modal fade" id="myModal" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Choose Duration</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <FieldContainer
                  label="Year"
                  Tag="select"
                  fieldGrid={4}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">Please Select</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032">2032</option>
                  <option value="2033">2033</option>
                </FieldContainer>
                <FieldContainer
                  label="From Month"
                  Tag="select"
                  fieldGrid={4}
                  value={firstMonth}
                  onChange={(e) => setFirstMonth(e.target.value)}
                >
                  <option value="">Please Select</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </FieldContainer>
                <FieldContainer
                  label="To Month"
                  Tag="select"
                  fieldGrid={4}
                  value={secondMonth}
                  onChange={(e) => setSecondMonth(e.target.value)}
                >
                  <option value="">Please Select</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </FieldContainer>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={followersChartC}
                className="btn btn-success"
                data-dismiss="modal"
              >
                Show Graph
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section section_padding sec_bg h100vh">
        <div className="container">
          <div className="row" style={{ marginBottom: "15px" }}>
            <div className="col-sm-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Page Name</h5>
                  <p className="card-text">{ipDetail.ip_name}</p>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Page Manager</h5>
                  <p className="card-text">content.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Followers</h5>
                  <p className="card-text">{ipDetail.followers}</p>
                </div>
                <div className="card-body">
                  <h5 className="card-title">PlatForm Name</h5>
                  <p className="card-text">Content</p>
                </div>
              </div>
            </div>
          </div>

          <ul
            className="nav nav-pills nav-fill navtop"
            style={{ marginBottom: "20px" }}
          >
            <li className="nav-item">
              <a className="nav-link active" href="#menu1" data-toggle="tab">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#menu2" data-toggle="tab">
                Stats (Page Health)
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#menu3" data-toggle="tab">
                Access Level
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#menu4" data-toggle="tab">
                Security & Recovery
              </a>
            </li>
            <li className="nav-item">
              <Link to={`/ip-history/${id}`}>
                <button
                  type="button"
                  className="btn btn-default"
                  style={{ color: "#0d6efd" }}
                >
                  History
                </button>
              </Link>
            </li>
          </ul>

          <div id="myModal1" className="modal fade" role="dialog">
            <div className="modal-dialog" style={{ marginLeft: "25%" }}>
              <div className="modal-content" style={{ width: "150%" }}>
                <div className="modal-header">
                  <h4 className="modal-title">Stats for this page</h4>
                  <button type="button" className="close" data-dismiss="modal">
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <FieldContainer
                      label="Story Views"
                      type="number"
                      value={storyView}
                      fieldGrid={4}
                      required={true}
                      onChange={(e) => setStoryView(e.target.value)}
                    />
                    <FieldContainer
                      label="Monthly Reach"
                      type="number"
                      required={true}
                      fieldGrid={4}
                      value={monthReach}
                      onChange={(e) => setMonthlyReach(e.target.value)}
                    />
                    <FieldContainer
                      label="Impressions"
                      type="number"
                      value={impression}
                      fieldGrid={4}
                      onChange={(e) => setImpression(e.target.value)}
                    />
                    <FieldContainer
                      label="Profile Visits"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={profileVisit}
                      onChange={(e) => setProfileVisit(e.target.value)}
                    />
                    <FieldContainer
                      label="Gender"
                      required={false}
                      fieldGrid={4}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    <FieldContainer
                      label="External Link Tap"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={linkTap}
                      onChange={(e) => setLinkTap(e.target.value)}
                    />
                    <FieldContainer
                      label="Email Tap"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={emailTap}
                      onChange={(e) => setEmailTap(e.target.value)}
                    />
                    <FieldContainer
                      label="Content Shared"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={contentShare}
                      onChange={(e) => setContentShare(e.target.value)}
                    />
                    <FieldContainer
                      label="Followers"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={followerss}
                      onChange={(e) => setFollowerss(e.target.value)}
                    />
                    <FieldContainer
                      label="Non Followers"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={nonFollowers}
                      onChange={(e) => setNonFollowers(e.target.value)}
                    />
                    <FieldContainer
                      label="Likes"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={likes}
                      onChange={(e) => setLikes(e.target.value)}
                    />
                    <FieldContainer
                      label="Shares"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={share}
                      onChange={(e) => setShare(e.target.value)}
                    />
                    <FieldContainer
                      label="Saves"
                      type="number"
                      required={false}
                      fieldGrid={4}
                      value={save}
                      onChange={(e) => setSave(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={saveStats}
                    data-dismiss="modal"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-content">
            <div className="tab-pane active" role="tabpanel" id="menu1">
              <h4>How Many Unique People Allocated ?</h4>
              <br />
              <div className="row">
                <FieldContainer
                  label="Year"
                  Tag="select"
                  fieldGrid={4}
                  value={statsYear}
                  onChange={(e) => setStatsYear(e.target.value)}
                >
                  <option value="">Please Select</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032">2032</option>
                  <option value="2033">2033</option>
                </FieldContainer>
                <FieldContainer
                  label="Month"
                  Tag="select"
                  fieldGrid={4}
                  value={statsMonth}
                  onChange={(e) => setStatsMonth(e.target.value)}
                >
                  <option value="">Please Select</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </FieldContainer>
                <div className="col-md-3" style={{ marginTop: "2%" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={showStatsConst}
                  >
                    Show Stats
                  </button>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-5">
                  <h5>Story View - {statsData[0]?.story_view}</h5>
                  <h5>Month Reach - {statsData[0]?.month_reach}</h5>
                  <h5>Impressions - {statsData[0]?.impression}</h5>
                  <h5>Profile Visit - {statsData[0]?.profile_visit}</h5>
                  <h5>Link Tap - {statsData[0]?.link_tap}</h5>
                  <h5>Email Tap - {statsData[0]?.email_tap}</h5>
                  <h5>Content Shared - {statsData[0]?.content_shared}</h5>
                  <h5>Likes - {statsData[0]?.likes}</h5>
                  <h5>Shares - {statsData[0]?.shares}</h5>
                  <h5>Saves - {statsData[0]?.saves}</h5>
                  <h5>Followers - {statsData[0]?.followerss}</h5>
                  <h5>Non-Followers - {statsData[0]?.non_followerss}</h5>
                </div>

                <div className="uuuuu col-md-7" style={{ height: "300px" }}>
                  <canvas id="donutChart" width="400" height="300"></canvas>
                </div>
              </div>
            </div>

            <div className="tab-pane" role="tabpanel" id="menu2">
              <div className="card mb-4">
                <div className="card-body pb0 pb4">
                  <div className="row thm_form">
                    <div className="col-md-6">
                      <div className="btn-group">
                        <button
                          onClick={followersChartM}
                          type="button"
                          className="btn btn-outline-primary"
                        >
                          Current Month
                        </button>
                        <button
                          onClick={followersChartY}
                          type="button"
                          className="btn btn-outline-primary"
                        >
                          Current Year
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          data-toggle="modal"
                          data-target="#myModal"
                        >
                          Custom Date
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{ float: "right", marginTop: "-30px" }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-toggle="modal"
                      data-target="#myModal1"
                    >
                      Save Stats
                    </button>
                  </div>
                </div>
              </div>

              <div className="row ttttt">
                <canvas id="myChart" width="400" height="300"></canvas>
              </div>
            </div>
            <div className="tab-pane" role="tabpanel" id="menu3">
              <div className="row">
                <form onSubmit={saveIpPageResponsiblity}>
                  <FieldContainer
                    label="User"
                    Tag="select"
                    fieldGrid={3}
                    value={ipAllocateUser}
                    onChange={(e) => {
                      setIpAllocateUser(e.target.value);
                    }}
                  >
                    <option value=""> Please Select </option>
                    {userData.map((data) => (
                      <option key={data.user_id} value={data.user_id}>
                        {data.user_name}
                      </option>
                    ))}
                  </FieldContainer>
                  <div className="form-group col-3">
                    <label className="form-label">
                      Responsiblity <sup style={{ color: "red" }}>*</sup>
                    </label>
                    <Select
                      isMulti
                      name="responsiblity"
                      options={response_page}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={ipAllocatePage}
                      onChange={setIpAllocatePage}
                    />
                  </div>
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                </form>
              </div>

              <h5>User - {ipDetail.user_name}</h5>
              <h5>User Responsiblities- {ipDetail.user_response}</h5>
              <br />
              <h5>
                Allocated to primary - {ipDetail.allocated_to_primary_name}
              </h5>
              <h5>Report L1 - {ipDetail.report_L1_user_name}</h5>
              <h5>Report L2 - {ipDetail.report_L2_user_name}</h5>
              <h5>Report L3 - {ipDetail.report_L3_user_name}</h5>
            </div>
            <div className="tab-pane" role="tabpanel" id="menu4">
              <h4>Recoverty Email- {ipDetail.recovery_email}</h4>
              <h4>Recoverty Contact- {ipDetail.recovery_contact}</h4>
              <h4>Password- {ipDetail.password}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IpGraph;
