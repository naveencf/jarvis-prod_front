import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import FormContainer from "../FormContainer";
import DataTable from "react-data-table-component";
import { useGlobalContext } from "../../../Context/Context";
import { Autocomplete, Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { set } from "date-fns";
import { ContactlessOutlined } from "@mui/icons-material";
import { baseUrl } from "../../../utils/config";

const LoginHistory = () => {
  const { toastAlert } = useGlobalContext();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [durationFilter, setDurationFilter] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [customDate, setCustomDate] = useState(null);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const loginUserId = decodedToken.id;

  const customDateOptions = [
    "7 Days",
    "15 Days",
    "30 Days",
    "Custom Date",
    "Start To End Date",
    "All",
    "Today",
    "Yesterday",
  ];

  async function getData() {
    await axios.get(baseUrl + "get_all_login_history").then((res) => {
      setData(res.data.data);
      setFilterData(res.data.data);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((d) => {
      return d.user_name?.toLowerCase()?.match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  function formatTimestamp(timestamp) {
    if (timestamp == null) {
      return 'N/A'
    }
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedTimestamp;
  }

  function getDuration(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    return `${days} days, ${hrs} hours, ${mnts} minutes, and ${seconds} seconds`;
  }

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "5%",
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "User Id",
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: "User Email Id",
      selector: (row) => row.user_email_id,
      sortable: true,
    },
    {
      name: "Login Date",
      selector: (row) => formatTimestamp(row.login_date),
      sortable: true,
    },
    {
      name: "Logout Date",
      selector: (row) => formatTimestamp(row.log_out_date),
      width: "15%",
    },
    {
      name: "Duration",
      selector: (row) => getDuration(row.duration),
      width: "29%",
    },
  ];

  const handleFilterChange = (newValue) => {
    setCustomDate(null);
    setStartDate(null);
    setEndDate(null);
    if (newValue === null) {
      setFilterData(data);
      return setDurationFilter("All");
    }
    setDurationFilter(newValue);
    const result = data.filter((d) => {
      if (newValue === "7 Days") {
        return (
          new Date(d.login_date).getTime() >=
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        );
      } else if (newValue === "15 Days") {
        return (
          new Date(d.login_date).getTime() >=
          new Date().getTime() - 15 * 24 * 60 * 60 * 1000
        );
      } else if (newValue === "30 Days") {
        return (
          new Date(d.login_date).getTime() >=
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000
        );
      } else if (newValue === "Today") {
        return (
          new Date(d.login_date).getTime() >=
          new Date().getTime() - 1 * 24 * 60 * 60 * 1000
        );
      } else if (newValue === "Yesterday") {
        return (
          new Date(d.login_date).getTime() >=
          new Date().getTime() - 2 * 24 * 60 * 60 * 1000
        );
      } else if (newValue === "All") {
        return d;
      } else if (newValue === "Custom Date") {
        return d;
      } else if (newValue === "Start To End Date") {
        return d;
      }
    });
    setFilterData(result);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e);
    // const endDateString = e.$d;
    // const endDateObject = new Date(endDateString);
    // const endYear = endDateObject.getFullYear();
    // const endMonth = (endDateObject.getMonth() + 1).toString().padStart(2, "0");
    // const endDay = endDateObject.getDate().toString().padStart(2, "0");

    // const endFormattedDate = `${endYear}-${endMonth}-${endDay}`;

    // const startDateString = startDate.$d;
    // const startDateObject = new Date(startDateString);
    // const startYear = startDateObject.getFullYear();
    // const startMonth = (startDateObject.getMonth() + 1)
    //   .toString()
    //   .padStart(2, "0");
    // const startDay = startDateObject.getDate().toString().padStart(2, "0");
    // const startFormattedDate = `${startYear}-${startMonth}-${startDay}`;

    // const result = data.filter((d) => {
    //   return (
    //     new Date(d.login_date).getTime() >=
    //       new Date(startFormattedDate).getTime() &&
    //     new Date(d.login_date).getTime() <= new Date(endFormattedDate).getTime()
    //   );
    // });

    // setFilterData(result);
    // setDurationFilter("Custom Date");
  };

  const handleFindCunstomDate = () => {
    if (startDate === null || endDate === null) {
      return toastAlert("Please select start and end date", "error");
    }
    const endDateString = endDate.$d;
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

    const result = data.filter((d) => {
      return (
        new Date(d.login_date).getTime() >=
        new Date(startFormattedDate).getTime() &&
        new Date(d.login_date).getTime() <= new Date(endFormattedDate).getTime()
      );
    });

    setFilterData(result);
  };

  const handleCustomDate = (e) => {
    setCustomDate(e);
    const customDateString = e.$d;
    const customDateObject = new Date(customDateString);
    const customYear = customDateObject.getFullYear();
    const customMonth = (customDateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const customDay = customDateObject.getDate().toString().padStart(2, "0");
    const customFormattedDate = `${customYear}-${customMonth}-${customDay}`;
    const result = data.filter((d) => {
      const customDateObject2 = new Date(d.login_date);
      const customYear2 = customDateObject2.getFullYear();
      const customMonth2 = (customDateObject2.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const customDay2 = customDateObject2
        .getDate()
        .toString()
        .padStart(2, "0");
      const customFormattedDate2 = `${customYear2}-${customMonth2}-${customDay2}`;
      return (
        new Date(customFormattedDate2).getTime() ==
        new Date(customFormattedDate).getTime()
      );
    });

    setFilterData(result);
    setDurationFilter("Custom Date");
  };

  return (
    <div>

      <FormContainer
        mainTitle="Onboarding user login history"
        title="Pre Onboard User Login History"
        // title=""
        // handleSubmit={handleSubmit}
        TitleHeaderComponentDisplay="flex"
        Titleheadercomponent={
          <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: "10px" }} >
            <div className="d-flex" style={{ display: "flex", gap: "10px" }}>
              <Autocomplete
                className=""
                disablePortal
                id="combo-box-demo"
                value={durationFilter}
                options={customDateOptions}
                onChange={(event, newValue) => {
                  handleFilterChange(newValue);
                }}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Custom Date" />
                )}
              />

              {durationFilter === "Start To End Date" && (
                <>

                  <LocalizationProvider
                    className=""
                    dateAdapter={AdapterDayjs}
                  >
                    <DatePicker
                      value={startDate}
                      format="DD/MM/YY"
                      onChange={(e) => setStartDate(e)}
                      label="From"
                    />
                  </LocalizationProvider>
                  <span className="">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={endDate}
                        format="DD/MM/YY"
                        onChange={(e) => handleEndDateChange(e)}
                        label="To"
                        minDate={startDate ? dayjs(startDate).add(1, "day") : null}
                        disabled={!startDate}
                      />
                    </LocalizationProvider>
                  </span>
                  <Button
                    variant="contained"
                    disabled={!startDate || !endDate}
                    className="w-40"
                    onClick={handleFindCunstomDate}
                  >
                    Find
                  </Button>
                </>
              )}

              {durationFilter === "Custom Date" && (
                <LocalizationProvider
                  className="col-md-3"
                  dateAdapter={AdapterDayjs}
                >
                  <DatePicker
                    value={customDate}
                    format="DD/MM/YY"
                    onChange={(e) => handleCustomDate(e)}
                    label="Date"
                  />
                </LocalizationProvider>
              )}
            </div>
            <input
              type="text"
              placeholder="Search here"
              className="w-50 form-control "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        }
        submitButton={false}
      >




        <div className="thm_table">
          <DataTable

            columns={columns}
            data={filterdata}
            // fixedHeader
            pagination
          // selectableRows
          // fixedHeaderScrollHeight="64vh"
          // highlightOnHover


          />
        </div>


      </FormContainer>
    </div>
  );
};

export default LoginHistory;
