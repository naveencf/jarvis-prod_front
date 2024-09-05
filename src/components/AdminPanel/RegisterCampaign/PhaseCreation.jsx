// import { Paper, TextField, Typography, Button, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CampaignDetailes from "./CampaignDetailes";
import { Link, Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { DataGrid, GridExpandMoreIcon } from "@mui/x-data-grid";
import PageDetaling from "./PageDetailing";

import {
  Paper,
  TextField,
  Button,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  AccordionDetails,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordioan from "./Accordioan";
import { useNavigate } from "react-router-dom";
import PageOverview from "./PageOverview";
import { baseUrl } from "../../../utils/config";

let options = [];
let timer;

const Follower_Count = [
  "<10k",
  "10k to 100k ",
  "100k to 1M ",
  "1M to 5M ",
  ">5M ",
];
const page_health = ["Active", "nonActive"];

const PhaseCreation = () => {
  const navigate = useNavigate();
  const param = useParams();
  const id = param.id;
  const [allPageData, setAllPageData] = useState([]);
  const [phaseData, setPhaseData] = useState("");
  const [phaseDataError, setPhaseDataError] = useState("");
  const [phaseDcripation, setPhaseDcripation] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actualPlanData, setActualPlanData] = useState([]);
  //state related to filtering and modal
  const [filterdPages, setFilteredPages] = useState([]);
  const [searchedPages, setSearchedPages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [searched, setSearched] = useState(false);
  const [campaignName, setCampaignName] = useState([]);
  const [remainingPages, setRemainingPages] = useState([]);
  const [modalSearchPage, setModalSearchPage] = useState([]);
  const [modalSearchPageStatus, setModalSearchPageStatus] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [cmpName, setCmpName] = useState("");
  const [allPhaseData, setAllPhaseData] = useState([]);
  console.log(allPhaseData, "zzzzz");
  const [showPageDetails, setShowPageDetails] = useState(false);

  const [payload, setPayload] = useState([]);

  const [postpage, setPostPage] = useState(0);
  const [render, setRender] = useState(false);

  //fetching data for the single plan
  const getPageData = async () => {
    const pageD = await axios.get(
      `${baseUrl}`+`campaignplan/${id}`
    );

    const x = pageD.data.data
      .filter((page) => {
        return (
          page.replacement_status == "inactive" ||
          page.replacement_status == "replacement"
        );
      })
      .map((page) => {
        return { ...page, postPerPage: 0 };
      });
    setFilteredPages(x);
    setActualPlanData(x);
    setPayload(x);

    const allpage = await axios.get(
      `https://purchase.creativefuel.io/webservices/RestController.php?view=inventoryDataList`
    );
    setAllPageData(allpage.data.body);
  };

  const getPhaseData = async () => {
    const data = await axios.get(
      `${baseUrl}`+`campaignphase/${id}`
    );
    setAllPhaseData(data?.data?.result);
  };
  useEffect(() => {
    getPageData();
    getPhaseData();
  }, []);

  useEffect(() => {
    const remainingData = allPageData?.filter(
      (item) =>
        !filterdPages.some((selectedItem) => selectedItem.p_id == item.p_id)
    );
    setRemainingPages(remainingData);
  }, [filterdPages]);

  //this function will feed the category data to categories option array
  const categorySet = () => {
    filterdPages.forEach((data) => {
      if (!options.includes(data.cat_name)) {
        options.push(data.cat_name);
      }
    });
  };
  const renderHard = () => {
    getPhaseData();
  };
  //whenever a pageData is available call categoryset function
  useEffect(() => {
    if (allPageData?.length > 0) {
      categorySet();
    }
  }, [allPageData]);

  console.log(allPhaseData);
  //useEffect for category selection change events
  useEffect(() => {
    if (selectedCategory.length > 0 && selectedFollower) {
      //if there is a selected category and selected follower
      const page = actualPlanData.filter((pages) => {
        //based on the selected follower a condition will be executed

        if (selectedFollower == "<10k") {
          if (selectedCategory.length > 0) {
            //if there is category selected then this
            return (
              Number(pages.follower_count) <= 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            //if there is no category selected
            return Number(pages.follower_count) <= 10000;
          }
        }
        if (selectedFollower == "10k to 100k ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000
            );
          }
        }
        if (selectedFollower == "100k to 1M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000
            );
          }
        }
        if (selectedFollower == "1M to 5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000
            );
          }
        }
        if (selectedFollower == ">5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) > 5000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) > 5000000;
          }
        }
        // return selectedCategory.includes(pages.cat_name)
      });
      //to set the filtered page
      setFilteredPages(page);
      setPayload(page);
    } else if (selectedCategory.length > 0 && !selectedFollower) {
      //in case category is present but follower count is not selected
      const page = actualPlanData.filter((pages) => {
        return selectedCategory.includes(pages.cat_name);
      });
      console.log(page);
      setFilteredPages(page);
      setPayload(page);
      // setSelectedFollower(null)
    } else if (selectedCategory.length == 0 && !selectedFollower) {
      setFilteredPages(actualPlanData);
      setPayload(actualPlanData);
    } else if (selectedCategory.length == 0 && selectedFollower) {
      setFilteredPages(filterdPages);
      setPayload(filterdPages);
    }
  }, [selectedCategory]);

  useEffect(() => {
    //
    if (selectedFollower) {
      const page = actualPlanData.filter((pages) => {
        if (selectedFollower == "<10k") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) <= 10000;
          }
        }
        if (selectedFollower == "10k to 100k ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 100000 &&
              Number(pages.follower_count) > 10000
            );
          }
        }
        if (selectedFollower == "100k to 1M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 1000000 &&
              Number(pages.follower_count) > 100000
            );
          }
        }
        if (selectedFollower == "1M to 5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return (
              Number(pages.follower_count) <= 5000000 &&
              Number(pages.follower_count) > 1000000
            );
          }
        }
        if (selectedFollower == ">5M ") {
          if (selectedCategory.length > 0) {
            return (
              Number(pages.follower_count) > 5000000 &&
              selectedCategory.includes(pages.cat_name)
            );
          } else {
            return Number(pages.follower_count) > 5000000;
          }
        }
        // return selectedCategory.includes(pages.cat_name)
      });
      setFilteredPages(page);
      setPayload(page);
    } else {
      if (selectedCategory.length > 0) {
        const page = actualPlanData.filter((pages) => {
          return selectedCategory.includes(pages.cat_name);
        });
        setFilteredPages(page);
        setPayload(page);
      } else {
        setFilteredPages(actualPlanData);
        setPayload(actualPlanData);
      }
    }
    if (selectedCategory.length == 0 && !selectedFollower) {
      setPayload(actualPlanData);
      setFilteredPages(actualPlanData);
    }
  }, [selectedFollower]);

  const categoryChangeHandler = (e, op) => {
    setSelectedCategory(op);
    setPostPage(0);
  };

  const followerChangeHandler = (e, op) => {
    setSelectedFollower(op);
  };

  const handleSearchChange = (e) => {
    if (!e.target.value.length == 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const searched = payload.filter((page) => {
          return (
            page.page_name
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            page.cat_name.toLowerCase().includes(e.target.value.toLowerCase())
          );
        });

        setSearched(true);
        setFilteredPages(searched);
      }, 500);
    } else {
      setSearched(false);
      setFilteredPages(payload);
      clearTimeout(timer);
    }
  };

  const getCampaignName = (detail, cmp) => {
    setCmpName(cmp);
    setCampaignName(detail);
  };
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = () => {
    setIsModalOpen(true);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSeachChangeModal = (e) => {
    if (!e.target.value.length == 0) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const searched = remainingPages.filter((page) => {
          return (
            page.page_name
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
            page.cat_name.toLowerCase().includes(e.target.value.toLowerCase())
          );
        });
        setModalSearchPage(searched);
        setModalSearchPageStatus(true);
      }, 500);
    } else {
      console.log();
    }
  };

  const handleModalPageAdd = () => {
    const selectedRowData = selectedRows.map((rowId) =>
      remainingPages.find((row) => row.p_id === rowId)
    );
    setFilteredPages([...filterdPages, ...selectedRowData]);
    setPayload([...filterdPages, ...selectedRowData]);
    setModalSearchPageStatus(false);
    setIsModalOpen(false);
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };

  // useEffect(()=>{
  //   setModalSearchPage
  // },[selectedRows])

  const columns = [
    {
      field: "S.NO",
      headerName: "S.NO",
      width: 90,
      renderCell: (params) => {
        const rowIndex = remainingPages.indexOf(params.row);
        return <div>{rowIndex + 1}</div>;
      },
    },
    {
      field: "page_name",
      headerName: "pages",
      width: 150,
      editable: true,
    },
    {
      field: "follower_count",
      headerName: "follower",
      width: 150,
      editable: true,
    },
    {
      field: "cat_name",
      headerName: "cat_name",
      width: 150,
      editable: true,
    },
    {
      field: "post_page",
      headerName: "post / page",
      width: 150,

      renderCell: (params) => {
        return (
          <input
            style={{ width: "60%" }}
            type="number"
            value={params.row.postPerPage}
          />
        );
      },
    },
    {
      field: "platform",
      headerName: "vender",
      width: 150,
      editable: true,
    },
  ];
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Function to toggle the visibility of page details
  const togglePageDetails = () => {
    setShowPageDetails(!showPageDetails);
  };

  const payloadChangeOnSearchChangeInPageDetailing = (pl, up) => {
    console.log(pl);
    setPayload([...pl]);
    setFilteredPages(up);
  };

  return (
    <>
      <div className="form_heading_title">
        <h2 className="form-heading">Phase Creation</h2>
      </div>
      {/* {id && */}
      <CampaignDetailes cid={id} getCampaign={getCampaignName} />
      {/* } */}

      {/* add Accordion for show phase------------------- */}
      <Paper>
        {allPhaseData?.map((item, index) => (
          <Paper key={index}>
            <Link
              to={`/admin/createAssign/${item.phase_id}`}
              style={{
                margin: "2px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button variant="contained" color="primary" size="small">
                Create Assignment
              </Button>
            </Link>
            <Accordion
              key={index}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
            >
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                // aria-controls={`panel${index}bh-content`}
                // id={`panel${index}bh-header`}
              >
                <Typography>{`Phase ${index + 1}`}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* <Accordioan data={item} /> */}
                {console.log(item)}
                <PageOverview
                  selectData={item.pages}
                  stage={"phase"}
                  setRender={renderHard}
                />
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </Paper>
      {/* add Accordion for show end phase------------------- */}

      <Button
        variant="outlined"
        onClick={togglePageDetails}
        sx={{ mt: 2, mb: 2 }}
      >
        {showPageDetails ? "Hide Page Details" : "Create New Phase"}
      </Button>
      {showPageDetails && (
        <>
          <Typography variant="h6" sx={{ fontWeight: "40px" }}>
            Phase Details
          </Typography>
          <Paper>
            <Box sx={{ pt: 1, m: 2, display: "flex" }}>
              <TextField
                label="Phase"
                value={phaseData}
                onChange={(e) => {
                  setPhaseData(e.target.value);
                  if (phaseDataError) {
                    setPhaseDataError("");
                  }
                }}
                sx={{ mr: 1 }}
                error={!!phaseDataError}
                helperText={phaseDataError}
              />

              <TextField
                label="Description"
                value={phaseDcripation}
                onChange={(e) => setPhaseDcripation(e.target.value)}
                sx={{ mr: 1 }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date *"
                  format="DD/MM/YY"
                  fullWidth
                  value={startDate}
                  onChange={(e) => setStartDate(e.$d)}
                  sx={{ mr: 1 }}
                />
                <DatePicker
                  label="End Date *"
                  format="DD/MM/YY"
                  fullWidth
                  value={endDate}
                  onChange={(e) => setEndDate(e.$d)}
                  sx={{ mr: 1 }}
                />
              </LocalizationProvider>
            </Box>
            {/* {console.log(campaignName[0].commitment, "camp name lalit")} */}
            {campaignName?.map((cmp, index) => {
              return (
                <Box sx={{ display: "flex" }} key={index}>
                  <TextField
                    disabled
                    value={cmp?.commitment}
                    sx={{ ml: 2, mb: 2 }}
                    label="Commitment"
                  />
                  <TextField
                    label="Value"
                    type="number"
                    onChange={(e) => {
                      let x = [...campaignName];
                      x.splice(index, 1, {
                        commitment: cmp?.commitment,
                        value: Number(e.target.value),
                      });
                      setCampaignName(x);
                    }}
                    sx={{ ml: 1, mb: 2 }}
                  />
                </Box>
              );
            })}
          </Paper>

          <Paper sx={{ display: "flex", gap: "10" }}>
            <Autocomplete
              multiple
              id="combo-box-demo"
              options={options}
              sx={{ width: 250, mr: 1, ml: 2 }}
              renderInput={(params) => (
                <TextField {...params} label="Category" />
              )}
              onChange={categoryChangeHandler}
            />
            <Autocomplete
              id="combo-box-demo"
              options={Follower_Count}
              getOptionLabel={(option) => option}
              sx={{ width: 250, mr: 1 }}
              renderInput={(params) => (
                <TextField {...params} label="Follower Count" />
              )}
              onChange={followerChangeHandler}
            />
            <Autocomplete
              id="combo-box-demo"
              options={page_health}
              getOptionLabel={(option) => option}
              sx={{ width: 250, mr: 1 }}
              renderInput={(params) => (
                <TextField {...params} label="Page health" />
              )}
            />
            <TextField
              label="Search"
              variant="outlined"
              onChange={handleSearchChange}
              sx={{ width: 200, mr: 1 }}
            />
            <Button variant="outlined" onClick={handleClick}>
              Add More Pages
            </Button>
          </Paper>
          {/* <PageDetaling
            pageName={"phaseCreation"}
            data={{ campaignName: cmpName, campaignId: id }}
           
            search={searched}
            searchedpages={searchedPages}
            setFilteredPages={setFilteredPages}
            // campaignId={id}
            // campaignName={campaignName}
            type={"plan"}
            phaseInfo={{ "phaseName": phaseData, "description": phaseDcripation, "commitment": campaignName }}
          /> */}

          <PageDetaling
            pageName={"phaseCreation"}
            data={{ campaignName: cmpName, campaignId: id }}
            pages={filterdPages?.filter((page) => page.postRemaining > 0)}
            search={searched}
            searchedpages={searchedPages}
            setFilteredPages={setFilteredPages}
            realPageData={allPageData}
            setPhaseDataError={setPhaseDataError}
            setPostPage={setPostPage}
            postpage={postpage}
            phaseInfo={{
              phaseName: phaseData,
              description: phaseDcripation,
              commitment: campaignName,
              phaseDataError: phaseDataError,
            }}
            payload={payload}
            payloadChange={payloadChangeOnSearchChangeInPageDetailing}
          />
        </>
      )}
      <Dialog open={isModalOpen}>
        <DialogTitle>Add more Pages</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, width: "100%" }}>
            <TextField
              label="Search"
              variant="outlined"
              onChange={handleSeachChangeModal}
              style={{ margin: "10px" }}
            />
            {modalSearchPageStatus ? (
              <DataGrid
                rows={modalSearchPage || []}
                columns={columns}
                getRowId={(row) => row.p_id}
                pageSizeOptions={[5]}
                checkboxSelection
                onRowSelectionModelChange={(row) => handleSelectionChange(row)}
                rowSelectionModel={selectedRows.map((row) => row)}
              />
            ) : (
              <DataGrid
                rows={remainingPages || []}
                columns={columns}
                getRowId={(row) => row.p_id}
                pageSizeOptions={[5]}
                checkboxSelection
                onRowSelectionModelChange={(row) => handleSelectionChange(row)}
                rowSelectionModel={selectedRows.map((row) => row)}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={handleModalPageAdd}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default PhaseCreation;
