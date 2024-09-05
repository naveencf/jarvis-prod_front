import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";
import FormContainer from "../AdminPanel/FormContainer";
import { baseUrl } from "../../utils/config";

const viewInOptions = ["Millions", "Thousands", "Default"];

export default function PagePerformanceAnalytics() {
  const [loading, setLoading] = useState(false);
  const [intervalFlag, setIntervalFlag] = useState({
    label: "Current Month",
    value: "1",
  });
  const [pageHistory, setPageHistory] = React.useState([]);
  const [rowData, setRowData] = useState([]);
  const [followerCountFilter, setFollowerCoutFilter] = useState(0);
  const [reachFilter, setReachFilter] = useState(0);
  const [impressionFilter, setImpressionFilter] = useState(0);
  const [followerCoutnCompareFlag, setFollowerCoutnCompareFlag] = useState({
    label: "Greater than",
    value: ">",
  });
  const [reachCompareFlag, setReachCompareFlag] = useState({
    label: "Greater than",
    value: ">",
  });
  const [impressionCompareFlag, setImpressionCompareFlag] = useState({
    label: "Greater than",
    value: ">",
  });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [followerCountCustomFilter, setFollowerCountCustomFilter] = useState({
    from: 0,
    to: 0,
  });
  const [reachCountCustomFilter, setReachCountCustomFilter] = useState({
    from: 0,
    to: 0,
  });
  const [viewType, setViewType] = useState("Default");
  const [searchInput, setSearchInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const callApi = () => {
    axios
      .post(baseUrl + "page_health_dashboard", {
        intervalFlag: intervalFlag.value,
      })
      .then((res) => {
        setPageHistory(res.data.data);
        setRowData(res.data.data);
      });
  };

  useEffect(() => {
    setLoading(true);
    callApi();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (intervalFlag.value === 4) {
      return;
    }
    setLoading(true);
    callApi();
    setLoading(false);
  }, [intervalFlag]);

  const intervalFlagOptions = [
    { label: "Current Month", value: 1 },
    { label: "Last Three months", value: 3 },
    { label: "Last six months", value: 6 },
    { label: "Last one year", value: 10 },
    { label: "All Data", value: 2 },
    { label: "Custom", value: 4 },
  ];

  const compareFlagOptions = [
    { label: "Greater than", value: ">" },
    { label: "Less than", value: "<" },
    { label: "Equal to", value: "==" },
    { label: "Greater than or Equal to", value: ">=" },
    { label: "Less than or Equal to", value: "<=" },
    { label: "Not Equal to", value: "!=" },
    { label: "Between", value: "between" },
  ];

  const handleFilterCustomFollowerCount = (e, type) => {
    if (type === "from") {
      setFollowerCountCustomFilter({
        ...followerCountCustomFilter,
        from: e.target.value,
      });
    } else {
      setFollowerCountCustomFilter({
        ...followerCountCustomFilter,
        to: e.target.value,
      });

      const filteredRows = pageHistory.filter((row) => {
        return (
          row.follower_count >= followerCountCustomFilter.from &&
          row.follower_count <= e.target.value
        );
      });

      setRowData(filteredRows);
    }
  };
  const formatNumberIndian = (num) => {
    if (!num) return "";
    var x = num.toString();
    var afterPoint = '';
    if (x.indexOf('.') > 0)
      afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x);
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '')
      lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
  };

  const handleFilterCustomReachCount = (e, type) => {
    if (type === "from") {
      setReachCountCustomFilter({
        ...followerCountCustomFilter,
        from: e.target.value,
      });
    } else {
      setReachCountCustomFilter({
        ...followerCountCustomFilter,
        to: e.target.value,
      });

      const filteredRows = pageHistory.filter((row) => {
        return (
          row.reach >= reachCountCustomFilter.from &&
          row.reach <= e.target.value
        );
      });

      setRowData(filteredRows);
    }
  };

  const handleFilterCustomImpressionCount = (e, type) => {
    if (type === "from") {
      setReachCountCustomFilter({
        ...followerCountCustomFilter,
        from: e.target.value,
      });
    } else {
      setReachCountCustomFilter({
        ...followerCountCustomFilter,
        to: e.target.value,
      });

      const filteredRows = pageHistory.filter((row) => {
        return (
          row.impression >= reachCountCustomFilter.from &&
          row.impression <= e.target.value
        );
      });

      setRowData(filteredRows.length > 0 ? filteredRows : pageHistory);
    }
  };

  const filterData = () => {
    const compareFollowerCount = (rowValue, filterValue, compareFlag) => {
      switch (compareFlag) {
        case ">":
          return rowValue > filterValue;
        case "<":
          return rowValue < filterValue;
        case ">=":
          return rowValue >= filterValue;
        case "<=":
          return rowValue <= filterValue;
        case "==":
          return rowValue === filterValue;
        case "between":
          return rowValue >= filterValue.from && rowValue <= filterValue.to;
        default:
          return false;
      }
    };
    const filteredRows = pageHistory.filter((row) => {
      return (
        compareFollowerCount(
          +row.follower_count,
          +followerCountFilter,
          followerCoutnCompareFlag.value
        ) &&
        row.reach >= reachFilter &&
        row.impression >= impressionFilter
      );
    });
    setRowData(filteredRows);
  };

  // const filterData = () => {
  //   const compareValue = (rowValue, filterValue, compareFlag) => {
  //     switch (compareFlag.value) {
  //       case ">":
  //         return rowValue > filterValue;
  //       case "<":
  //         return rowValue < filterValue;
  //       case ">=":
  //         return rowValue >= filterValue;
  //       case "<=":
  //         return rowValue <= filterValue;
  //       case "==":
  //         return rowValue === filterValue;
  //       case "between":
  //         return rowValue >= filterValue.from && rowValue <= filterValue.to;
  //       default:
  //         return true;
  //     }
  //   };

  //   const filteredRows = pageHistory.filter((row) => {
  //     return (
  //       compareValue(row.follower_count, followerCoutnCompareFlag.label === "Between" ? followerCountCustomFilter : followerCountFilter, followerCoutnCompareFlag) &&
  //       compareValue(row.reach, reachCompareFlag.label === "Between" ? reachCountCustomFilter : reachFilter, reachCompareFlag) &&
  //       compareValue(row.impression, impressionCompareFlag.label === "Between" ? reachCountCustomFilter : impressionFilter, impressionCompareFlag)
  //     );
  //   });

  //   setRowData(filteredRows);
  // };

  // useEffect(() => {
  //   filterData();
  // }, [followerCountFilter, reachFilter, impressionFilter, followerCoutnCompareFlag, reachCompareFlag, impressionCompareFlag, pageHistory]);

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 40,
      renderCell: (params) => {
        const rowIndex = pageHistory.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    { field: "page_name", headerName: "Page Name", width: 200 },
    {
      field: "follower_count",
      headerName: "Follower Count",
      width: 200,
      renderCell: (params) => {
        const followerCount = params.row.follower_count;
        if (viewType === "Millions") {
          return <span>{(followerCount / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(followerCount / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{formatNumberIndian(followerCount)}</span>;
        }
      },
      valueFormatter: (params) => formatNumberIndian(params.value),

    },
    {
      field: "maxReach",
      headerName: "Highest Reach",
      width: 200,
      renderCell: (params) => {
        const reach = params.row.maxReach;
        if (viewType === "Millions") {
          return <span>{(reach / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(reach / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{formatNumberIndian(reach)}</span>;
        }
      },
      valueFormatter: (params) => formatNumberIndian(params.value),

    },
    {
      field: "maxImpression",
      headerName: "Highest Impression",
      width: 200,
      renderCell: (params) => {
        const impression = params.row.maxImpression;
        if (viewType === "Millions") {
          return <span>{(impression / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(impression / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{formatNumberIndian(impression)}</span>;
        }
      },
      valueFormatter: (params) => formatNumberIndian(params.value),

    },
    {
      field: "maxEngagement",
      headerName: "Highest Engagement",
      width: 200,
      renderCell: (params) => {
        const engagement = params.row.maxEngagement;
        if (viewType === "Millions") {
          return <span>{(engagement / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(engagement / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{formatNumberIndian(engagement)}</span>;
        }
      },
      valueFormatter: (params) => formatNumberIndian(params.value),

    },
    {
      field: "maxStoryView",
      headerName: "Highest Story view",
      width: 200,
      renderCell: (params) => {
        const storyView = params.row.maxStoryView;
        if (viewType === "Millions") {
          return <span>{(storyView / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(storyView / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{storyView}</span>;
        }
      },
    },
    // { field: "maxStoryView", headerName: "Hightest Story view", width: 200 },
    {
      field: "maxStoryViewDate",
      headerName: "Highest Story view Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.maxStoryViewDate ? (
              <>
                {new Date(params.row.maxStoryViewDate)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.maxStoryViewDate)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.maxStoryViewDate)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "avgReach",
      headerName: "Avg Reach",
      width: 200,
      renderCell: (params) => {
        const reach = params.row.avgReach;
        if (viewType === "Millions") {
          return <span>{(reach / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(reach / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{reach}</span>;
        }
      },
    },
    {
      field: "avgImpression",
      headerName: "Avg Impression",
      width: 200,
      renderCell: (params) => {
        const impression = params.row.avgImpression;
        if (viewType === "Millions") {
          return <span>{(impression / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(impression / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{impression}</span>;
        }
      },
    },
    {
      field: "avgEngagement",
      headerName: "Avg Engagement",
      width: 200,
      renderCell: (params) => {
        const engagement = params.row.avgEngagement;
        if (viewType === "Millions") {
          return <span>{(engagement / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(engagement / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{engagement}</span>;
        }
      },
    },
    {
      field: "avgStoryView",
      headerName: "Avg Story view",
      width: 200,
      renderCell: (params) => {
        const storyView = params.row.avgStoryView;
        if (viewType === "Millions") {
          return <span>{(storyView / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(storyView / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{storyView}</span>;
        }
      },
    },
    {
      field: "avgStoryViewDate",
      headerName: "Avg Story view Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.avgStoryViewDate ? (
              <>
                {new Date(params.row.avgStoryViewDate)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.avgStoryViewDate)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.avgStoryViewDate)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "minReach",
      headerName: "Lowest Reach",
      width: 200,
      renderCell: (params) => {
        const reach = params.row.minReach;
        if (viewType === "Millions") {
          return <span>{(reach / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(reach / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{reach}</span>;
        }
      },
    },
    {
      field: "minImpression",
      headerName: "Lowest Impression",
      width: 200,
      renderCell: (params) => {
        const impression = params.row.minImpression;
        if (viewType === "Millions") {
          return <span>{(impression / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(impression / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{impression}</span>;
        }
      },
    },
    {
      field: "minEngagement",
      headerName: "Lowest Engagement",
      width: 200,
      renderCell: (params) => {
        const engagement = params.row.minEngagement;
        if (viewType === "Millions") {
          return <span>{(engagement / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(engagement / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{engagement}</span>;
        }
      },
    },
    {
      field: "minStoryView",
      headerName: "Lowest Story view",
      width: 200,
      renderCell: (params) => {
        const storyView = params.row.minStoryView;
        if (viewType === "Millions") {
          return <span>{(storyView / 1000000).toFixed(1)}M</span>;
        } else if (viewType === "Thousands") {
          return <span>{(storyView / 1000).toFixed(2)}K</span>;
        } else {
          return <span>{storyView}</span>;
        }
      },
    },
    {
      field: "minStoryViewDate",
      headerName: "Lowest Story view Date",
      width: 200,
      renderCell: (params) => {
        return (
          <div>
            {params.row?.minStoryViewDate ? (
              <>
                {new Date(params.row.minStoryViewDate)
                  .toISOString()
                  .substr(8, 2)}
                /
                {new Date(params.row.minStoryViewDate)
                  .toISOString()
                  .substr(5, 2)}
                /
                {new Date(params.row.minStoryViewDate)
                  .toISOString()
                  .substr(2, 2)}
              </>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      field: "top5AgeGroupPercentage",
      headerName: "Top 5 Age Group",
      width: 430,
      renderCell: (params) => {
        const ageGroup = params.row.top5AgeGroupPercentage;
        return (
          <>
            <span>
              <span className="text-danger">{ageGroup[0].ageGroup}</span>={" "}
              <span className="text-success">
                {ageGroup[0].percentage % 1 == 0
                  ? ageGroup[0].percentage
                  : ageGroup[0].percentage.toFixed(2)}
              </span>
              &nbsp;
            </span>
            <span>
              {ageGroup[1].ageGroup}={" "}
              {ageGroup[1].percentage % 1 == 0
                ? ageGroup[1].percentage
                : ageGroup[1].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
            <span>
              {ageGroup[2].ageGroup}={" "}
              {ageGroup[2].percentage % 1 == 0
                ? ageGroup[2].percentage
                : ageGroup[2].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
            <span>
              {ageGroup[3].ageGroup}={" "}
              {ageGroup[3].percentage % 1 == 0
                ? ageGroup[3].percentage
                : ageGroup[3].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
            <span>
              {ageGroup[4].ageGroup}={" "}
              {ageGroup[4].percentage % 1 == 0
                ? ageGroup[4].percentage
                : ageGroup[4].percentage.toFixed(2)}
              &nbsp;{" "}
            </span>
          </>
        );
      },
    },
    {
      field: "avgMalePercent",
      headerName: "Avg Male Per",
      width: 200,
      renderCell: (params) => {
        const avgMalePercent = params.row.avgMalePercent;
        return (
          <>
            <span>
              {avgMalePercent % 1 == 0
                ? avgMalePercent
                : avgMalePercent.toFixed(1)}
            </span>
          </>
        );
      },
    },
    {
      field: "avgFemalePercent",
      headerName: "Avg Female Per",
      width: 200,
      renderCell: (params) => {
        const avgFemalePercent = params.row.avgFemalePercent;
        return (
          <>
            <span>
              {avgFemalePercent % 1 == 0
                ? avgFemalePercent
                : avgFemalePercent.toFixed(1)}
            </span>
          </>
        );
      },
    },
  ];

  const handleFilterFollowerCount = (e) => {
    setFollowerCoutFilter(e.target.value);
    filterData();
  };

  const handleFilterReach = (e) => {
    setReachFilter(e.target.value);
    filterData();
  };

  const handleFilterImpression = (e) => {
    setImpressionFilter(e.target.value);
    filterData();
  };

  useEffect(() => {
    filterData();
  }, [followerCountFilter, reachFilter, impressionFilter]);

  const handleEndDateChange = (e) => {
    setEndDate(e);
    const endDateString = e.$d;
    const endDateObject = new Date(endDateString);
    const endYear = endDateObject.getFullYear();
    const endMonth = (endDateObject.getMonth() + 1).toString().padStart(2, "0");
    const endDay = endDateObject.getDate().toString().padStart(2, "0");

    const endFormattedDate = `${endYear}-${endMonth}-${endDay}`;

    const startDateString = startDate.$d;
    const startDateObject = new Date(startDateString);
    const startYear = startDateObject.getFullYear();
    const startMonth = (startDateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const startDay = startDateObject.getDate().toString().padStart(2, "0");
    const startFormattedDate = `${startYear}-${startMonth}-${startDay}`;
    axios
      .post(baseUrl + "page_health_dashboard", {
        startDate: startFormattedDate,
        endDate: endFormattedDate,
      })
      .then((res) => {
        setPageHistory(res.data.data);
        setRowData(res.data.data);
      });
  };


  const filterRows = () => {
    const filtered = rowData.filter((row) =>
      row.page_name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredRows(filtered);
  };

  useEffect(() => {
    filterRows();
  }, [searchInput, rowData]);

  return (
    <div >
      <FormContainer mainTitle="Analytics" link="/ip-master" />
      <div
        className="card body-padding thm_form gap16"
      >
        <div className="flexCenter colGap16">

          <Autocomplete
            className="me-2"
            disablePortal
            value={intervalFlag.label}
            defaultValue={intervalFlagOptions[0].label}
            id="combo-box-demo"
            options={intervalFlagOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={(event, newValue) => {
              if (newValue === null) {
                return setIntervalFlag({ label: "Current Month", value: 1 });
              }

              setIntervalFlag(newValue);
            }}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Filter Date" />
            )}
          />
          {intervalFlag.value === 4 && (
            <>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={startDate}
                  format="DD/MM/YY"
                  onChange={(e) => setStartDate(e)}
                  label="From"
                />
              </LocalizationProvider>
              <span>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e)}
                    label="To"
                    disabled={!startDate}
                  />
                </LocalizationProvider>
              </span>
            </>
          )}
        </div>

        <div className=" flexCenter colGap16">
          <Autocomplete
            disablePortal
            value={followerCoutnCompareFlag.label}
            defaultValue={compareFlagOptions[0].label}
            id="combo-box-demo"
            options={compareFlagOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={(event, newValue) => {
              console.log(newValue);
              if (newValue === null) {
                return setFollowerCoutnCompareFlag({
                  label: "Greater than",
                  value: ">",
                });
              }

              setFollowerCoutnCompareFlag(newValue);
            }}
            sx={{ width: 250 }}
            renderInput={(params) => <TextField {...params} />}
          />

          {followerCoutnCompareFlag.label !== "Between" && (
            <TextField
              className="mx-2"
              label="Follower Count"
              type="number"
              variant="outlined"
              inputProps={{
                min: 0,
                step: 1,
                onInput: (e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              }}
              onChange={handleFilterFollowerCount}
            />
          )}

          {followerCoutnCompareFlag.label === "Between" && (
            <>
              {" "}
              <TextField
                className="mx-2"
                label="From"
                type="number"
                variant="outlined"
                inputProps={{
                  min: 0,
                  step: 1,
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
                onChange={(e) => handleFilterCustomFollowerCount(e, "from")}
              />
              <TextField
                label="To"
                type="number"
                variant="outlined"
                inputProps={{
                  min: 0,
                  step: 1,
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
                onChange={(e) => handleFilterCustomFollowerCount(e, "to")}
              />
            </>
          )}
        </div>

        <div className=" flexCenter colGap16">
          {" "}
          <Autocomplete
            disablePortal
            value={reachCompareFlag.label}
            defaultValue={compareFlagOptions[0].label}
            id="combo-box-demo"
            options={compareFlagOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={(event, newValue) => {
              if (newValue === null) {
                return setReachCompareFlag({
                  label: "Greater than",
                  value: ">",
                });
              }

              setReachCompareFlag(newValue);
            }}
            sx={{ width: 250 }}
            renderInput={(params) => <TextField {...params} />}
          />
          {reachCompareFlag.label !== "Between" && (
            <TextField
              className="d-block mx-2"
              label="Reach"
              type="number"
              variant="outlined"
              inputProps={{
                min: 0,
                step: 1,
                onInput: (e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              }}
              onChange={handleFilterReach}
            />
          )}
          {reachCompareFlag.label === "Between" && (
            <>
              <TextField
                className="mx-2"
                label="From"
                type="number"
                variant="outlined"
                inputProps={{
                  min: 0,
                  step: 1,
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
                onChange={(e) => handleFilterCustomReachCount(e, "from")}
              />
              <TextField
                label="To"
                type="number"
                variant="outlined"
                inputProps={{
                  min: 0,
                  step: 1,
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
                onChange={(e) => handleFilterCustomReachCount(e, "to")}
              />
            </>
          )}
        </div>
        <div className=" flexCenter colGap16">
          <Autocomplete
            disablePortal
            value={impressionCompareFlag.label}
            defaultValue={compareFlagOptions[0].label}
            id="combo-box-demo"
            options={compareFlagOptions.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            onChange={(event, newValue) => {
              if (newValue === null) {
                return setImpressionCompareFlag({
                  label: "Greater than",
                  value: ">",
                });
              }
              setImpressionCompareFlag(newValue);
            }}
            sx={{ width: 250 }}
            rende
            renderInput={(params) => <TextField {...params} />}
          />
          {impressionCompareFlag.label != "Between" && (
            <TextField
              className="mx-2"
              label="Impression"
              type="number"
              variant="outlined"
              inputProps={{
                min: 0,
                step: 1,
                onInput: (e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                },
              }}
              onChange={handleFilterImpression}
            />
          )}
          {impressionCompareFlag.label === "Between" && (
            <>
              <TextField
                className="mx-2"
                label="From"
                type="number"
                variant="outlined"
                inputProps={{
                  min: 0,
                  step: 1,
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
                onChange={(e) => handleFilterCustomImpressionCount(e, "from")}
              />
              <TextField
                label="To"
                type="number"
                variant="outlined"
                inputProps={{
                  min: 0,
                  step: 1,
                  onInput: (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  },
                }}
                onChange={(e) => handleFilterCustomImpressionCount(e, "to")}
              />
            </>
          )}
          {/* <button
            classname="mx-2 d-block"
            variant="contained"
            onclick={filterdata}
          >
            filter
          </button> */}
        </div>
        <div className=" flexCenter colGap16 ">
          <Autocomplete
            disablePortal
            value={viewType}
            // defaultValue={compareFlagOptions[0].label}
            id="combo-box-demo"

            options={viewInOptions}
            onChange={(event, newValue) => {
              if (newValue === null) {
                return setViewType({
                  newValue: "Default",
                });
              }

              setViewType(newValue);
            }}

            renderInput={(params) => <TextField {...params} label="View In" />}
          // onChange={(e) => setFollowerCoutnCompareFlag(e.target.value)}
          />

          <TextField
            type="text"
            label="Search Page"

            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>
      <div className="card body-padding thm_table nt-head">

        {!loading ? (
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            getRowId={(row) => row._id}
          />
        ) : (
          <ContentLoader
            width={2000}
            height={700}
            viewBox="0 30 2000 700"
            backgroundColor="#f0f0f0"
            foregroundColor="#dedede"
          >
            <rect x="42" y="77" rx="10" ry="10" width="1100" height="600" />
          </ContentLoader>
        )}
      </div>

    </div>
  );
}
